"""CampusLink AI matching engine (prototype).

Hybrid score = 0.45*semantic + 0.30*concept_coverage + 0.15*availability + 0.10*fit
  semantic          TF-IDF (1-2 grams) cosine between the request and a profile document,
                    where both are enriched with concept tags (a light semantic layer).
  concept_coverage  share of concepts the request needs that the profile covers
                    (full credit for the same concept, half credit for a related one).
  availability      Jaccard overlap of free time slots.
  fit               mentor request -> verified senior mentor; teammate -> similar year.
Production swap: replace the TF-IDF + concept layer with sentence embeddings (same interface).
"""
import re, json
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from data import PROFILES, REQUESTS

CONCEPTS = {
 "frontend": ["react","javascript","html","css","tailwind","typescript","next.js","frontend","web"],
 "backend":  ["fastapi","node.js","spring boot","rest api","backend","api","flask","django"],
 "mobile":   ["flutter","dart","mobile","app","android","cross platform"],
 "design":   ["figma","ui/ux","ui","ux","canva","design","design systems"],
 "ml":       ["machine learning","scikit-learn","pandas","ml","deep learning","pytorch","kaggle"],
 "vision":   ["computer vision","opencv","vision","imaging","rppg","vital signs"],
 "nlp_llm":  ["nlp","llm","llms","langchain","rag","chatbot","ai agents"],
 "database": ["sql","dbms","mysql","postgresql","mongodb","database","databases"],
 "placement":["dsa","data structures","aptitude","competitive programming","placements","coding rounds","c++"],
 "security": ["cybersecurity","ctf","networking","ethical hacking","security"],
 "iot":      ["arduino","iot","robotics"],
 "devops":   ["docker","cloud","devops"],
 "analytics":["excel","power bi","data analysis"],
}
RELATED = {"ml":["nlp_llm","vision"], "nlp_llm":["ml"], "vision":["ml"], "frontend":["design"],
           "design":["frontend"], "backend":["database","devops"], "database":["backend"],
           "mobile":["frontend"], "devops":["backend"]}
STOP = set("a an the and or for to of in on with is are need needs want looking someone good at our my me how do i can you "
           "upcoming project using build by be from this that have has it as who will please help guide senior teammate".split())

def _has(text, term):
    return re.search(r"(?<![\w])" + re.escape(term) + r"s?(?![\w])", text) is not None

def concepts_in(text):
    t = text.lower()
    return {c for c, terms in CONCEPTS.items() if any(_has(t, x) for x in terms)}

def profile_doc(p):
    base = " ".join(p["skills"]) + " " + p["interests"]
    return base.lower() + " " + " ".join("c_" + c for c in concepts_in(base))

def request_doc(r):
    return r["text"].lower() + " " + " ".join("c_" + c for c in concepts_in(r["text"]))

def coverage(req_c, prof_c):
    if not req_c: return 0.0
    s = 0.0
    for c in req_c:
        if c in prof_c: s += 1.0
        elif any(x in prof_c for x in RELATED.get(c, [])): s += 0.5
    return s / len(req_c)

def jaccard(a, b):
    a, b = set(a), set(b)
    return len(a & b) / len(a | b) if a | b else 0.0

def fit(r, p):
    if r["kind"] == "mentor":
        return 1.0 if (p["mentor"] and p["year"] > r["year"]) else 0.2
    return 1.0 if abs(p["year"] - r["year"]) <= 1 else 0.6

def explain(r, p, req_c, prof_c, avail):
    bits = []
    hit = sorted(req_c & prof_c); rel = sorted({x for c in req_c - prof_c for x in RELATED.get(c, []) if x in prof_c})
    if hit: bits.append("covers " + ", ".join(hit))
    if rel: bits.append("related strength in " + ", ".join(rel))
    skills = [s for s in p["skills"] if any(_has(r["text"].lower(), w) for w in s.lower().split())] 
    if r["kind"] == "mentor" and p["mentor"]: bits.append(f"verified year-{p['year']} mentor")
    elif r["kind"] == "teammate": bits.append(f"year {p['year']}")
    common = sorted(set(r["avail"]) & set(p["avail"]))
    bits.append(f"{len(common)} shared free slot(s)" if common else "no shared slot yet")
    return "; ".join(bits)

def match(r, profiles=PROFILES, k=3):
    docs = [profile_doc(p) for p in profiles]
    vec = TfidfVectorizer(ngram_range=(1, 2), token_pattern=r"[A-Za-z_][\w\+\#\./-]*", stop_words=list(STOP))
    X = vec.fit_transform(docs + [request_doc(r)])
    sem = cosine_similarity(X[-1], X[:-1])[0]
    sem = sem / sem.max() if sem.max() > 0 else sem
    req_c = concepts_in(r["text"]); out = []
    for p, s in zip(profiles, sem):
        pc = concepts_in(" ".join(p["skills"]) + " " + p["interests"])
        cov, av, ft = coverage(req_c, pc), jaccard(r["avail"], p["avail"]), fit(r, p)
        score = 0.45 * s + 0.30 * cov + 0.15 * av + 0.10 * ft
        out.append(dict(id=p["id"], name=p["name"], year=p["year"], score=round(float(score) * 100, 1),
                        parts=dict(semantic=round(float(s), 2), coverage=round(cov, 2), availability=round(av, 2), fit=round(ft, 2)),
                        skills=p["skills"], why=explain(r, p, req_c, pc, av)))
    out.sort(key=lambda x: -x["score"])
    return out[:k]

def baseline(r, profiles=PROFILES, k=3):
    """What a chat-group search does: count exact words shared with a profile's text."""
    words = {w for w in re.findall(r"[a-z0-9\+\#]+", r["text"].lower()) if w not in STOP}
    scored = []
    for p in profiles:
        pw = set(re.findall(r"[a-z0-9\+\#]+", (" ".join(p["skills"]) + " " + p["interests"]).lower()))
        scored.append((len(words & pw), p["id"]))
    scored.sort(key=lambda x: (-x[0], x[1]))
    return [pid for sc, pid in scored[:k]]

def evaluate(k=3):
    rows, tot = [], {"m_p": 0, "m_h": 0, "b_p": 0, "b_h": 0}
    for r in REQUESTS:
        m = [x["id"] for x in match(r, k=k)]; b = baseline(r, k=k); rel = set(r["relevant"])
        mp, bp = len(rel & set(m)) / k, len(rel & set(b)) / k
        mh, bh = int(bool(rel & set(m[:1]))), int(bool(rel & set(b[:1])))
        rows.append(dict(id=r["id"], text=r["text"], relevant=r["relevant"], matcher=m, baseline=b,
                         m_p=round(mp, 2), b_p=round(bp, 2), m_h=mh, b_h=bh))
        tot["m_p"] += mp; tot["b_p"] += bp; tot["m_h"] += mh; tot["b_h"] += bh
    n = len(REQUESTS)
    return rows, {key: round(v / n, 3) for key, v in tot.items()}

if __name__ == "__main__":
    import sys
    for r in REQUESTS:
        print(f"\n[{r['id']}] ({r['kind']}) {r['text']}")
        for i, m in enumerate(match(r), 1):
            print(f"  {i}. {m['name']:8s} {m['score']:5.1f}  {m['why']}")
    rows, tot = evaluate()
    print("\nEVAL", json.dumps(tot))
    json.dump(dict(matches={r["id"]: match(r) for r in REQUESTS}, eval_rows=rows, eval_total=tot,
                   requests=REQUESTS, profiles=PROFILES), open("results.json", "w"), indent=1)
