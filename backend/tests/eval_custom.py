import sys
import re
from pathlib import Path

# Add backend directory to path
backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

from app.matcher import match

def load_seed_profiles():
    seed_sql_path = backend_dir.parent / "supabase" / "seed.sql"
    content = seed_sql_path.read_text(encoding="utf-8")
    
    # Regex pattern to extract profiles
    pattern = re.compile(
        r"\('(?P<id>00000000-0000-0000-0000-0000000000\d\d)',\s*'(?P<name>[^']+)',\s*'(?P<email>[^']+)',\s*(?P<year>\d+),\s*(?P<mentor>true|false),\s*array\[(?P<skills>[^\]]+)\],\s*'(?P<interests>[^']*)',\s*array\[(?P<slots>[^\]]+)\]\)",
        re.MULTILINE
    )
    
    profiles = []
    for m in pattern.finditer(content):
        d = m.groupdict()
        skills = [s.strip().strip("'").lower() for s in d["skills"].split(",")]
        slots = [s.strip().strip("'").lower() for s in d["slots"].split(",")]
        profiles.append({
            "id": d["id"],
            "name": d["name"],
            "year": int(d["year"]),
            "mentor": (d["mentor"].lower() == "true"),
            "skills": skills,
            "interests": d["interests"],
            "avail": slots,
        })
    return profiles

def run_unseen_eval():
    profiles = load_seed_profiles()
    print(f"Total Seed Profiles Loaded: {len(profiles)}")

    unseen_requests = [
        {
            "id": "U1",
            "kind": "teammate",
            "year": 2,
            "avail": ["wkday_eve", "wkend_morn"],
            "text": "Looking for someone to help me learn Docker and deploy my first containerized backend",
        },
        {
            "id": "U2",
            "kind": "mentor",
            "year": 2,
            "avail": ["wkday_eve", "wkend_aft"],
            "text": "Need a senior mentor in competitive programming and dynamic programming for upcoming campus drive",
        },
        {
            "id": "U3",
            "kind": "teammate",
            "year": 1,
            "avail": ["wkday_aft", "wkend_morn"],
            "text": "Building an IoT weather station with Arduino and sensors, need a collaborator",
        },
        {
            "id": "U4",
            "kind": "teammate",
            "year": 2,
            "avail": ["wkend_morn", "wkday_eve"],
            "text": "Need a UI/UX designer to create mobile app wireframes and Figma prototype for a healthcare hackathon",
        },
        {
            "id": "U5",
            "kind": "mentor",
            "year": 2,
            "avail": ["wkend_morn", "wkday_eve"],
            "text": "Looking for an NLP mentor to guide me through fine-tuning BERT and RAG pipelines",
        },
    ]

    for req in unseen_requests:
        top_matches = match(req, profiles=profiles, k=3)
        print(f"\n[REQUEST] ({req['kind']}) {req['text']}")
        for idx, m in enumerate(top_matches, 1):
            print(f"  {idx}. {m['name']} (Yr {m['year']}) | Score: {m['score']} | Parts: {m['parts']} | Why: {m['why']}")

if __name__ == "__main__":
    run_unseen_eval()

