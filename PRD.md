# CampusLink - Product Requirements Document (PRD)

FirstCommit '26 | Team EshWar (solo) | Theme: Campus & Student Life
Goal: a working, deployed prototype + GitHub repo + demo video, with **AI matching clearly working** (Round 1 feedback).

---

## 1. Scope

### Must-have (the demo depends on these)
1. College-email login (domain-restricted)
2. Profile: skills, interests, year, free time slots, "I can mentor" toggle
3. Post a request in plain language (teammate / mentor / notes)
4. **AI matches with score, score breakdown and a "why" reason**
5. Connect request -> accept/decline (contact revealed only after accept)
6. Notes library: upload, tag, search

### Nice-to-have (cut in this order if behind)
1. LLM-written friendly explanations (keep rule-based reasons as default)
2. Sentence-embedding similarity (keep TF-IDF as fallback)
3. Notes upload (keep a seeded, read-only library)
4. Feedback buttons ("good match / not useful")

### Out of scope
Chat, notifications, mobile app, multi-college.

---

## 2. Tech Stack (all free)

| Layer | Choice | Why |
|---|---|---|
| Frontend | Next.js (App Router) + Tailwind + shadcn/ui | Fast, polished UI with little code |
| Hosting (web) | Vercel | One-click deploy |
| Backend | FastAPI (Python) | Reuses `matcher.py` directly |
| Hosting (API) | Hugging Face Space (Docker) | No sleep-delay surprises during a live demo; Render/Railway as backup |
| Database + auth + storage | Supabase (Postgres, email auth, storage) | One service for three needs |
| Matching | TF-IDF + concept layer (built) + optional MiniLM embeddings | Explainable, works offline |
| Explanations | Rule-based reasons (built); optional Gemini free tier | Deterministic fallback |
| Tools | Antigravity (agents), GitHub, OBS or Loom (video) | |

