import os
import uuid
import requests
from typing import List, Dict, Any, Optional
from app.data import PROFILES

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

def get_supabase_headers() -> Dict[str, str]:
    return {
        "apikey": SUPABASE_SERVICE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=representation",
    }

def load_profiles(exclude_user_id: Optional[str] = None) -> List[Dict[str, Any]]:
    """
    Loads candidate profiles from Supabase.
    Excludes the requesting user.
    Falls back cleanly to seed data when Supabase is unconfigured or unreachable.
    """
    if SUPABASE_URL and SUPABASE_SERVICE_KEY and not SUPABASE_URL.startswith("https://your-project"):
        try:
            url = f"{SUPABASE_URL.rstrip('/')}/rest/v1/profiles?select=*"
            res = requests.get(url, headers=get_supabase_headers(), timeout=4)
            if res.status_code == 200:
                rows = res.json()
                mapped = []
                for p in rows:
                    pid = str(p.get("id"))
                    if exclude_user_id and pid == str(exclude_user_id):
                        continue
                    mapped.append(dict(
                        id=pid,
                        name=p.get("name", "Student"),
                        year=p.get("year", 2),
                        mentor=p.get("is_mentor", False),
                        skills=p.get("skills") or [],
                        interests=p.get("interests") or "",
                        avail=p.get("slots") or [],
                    ))
                if mapped:
                    return mapped
        except Exception as e:
            # Fallback to local profiles
            pass

    # Local fallback from data.py
    return [
        dict(p) for p in PROFILES
        if not exclude_user_id or str(p["id"]) != str(exclude_user_id)
    ]

def save_request_and_matches(user_id: str, req_body: dict, matches: list) -> str:
    """
    Saves the user request and generated matches.
    Returns the request_id.
    """
    request_id = str(uuid.uuid4())
    
    if SUPABASE_URL and SUPABASE_SERVICE_KEY and not SUPABASE_URL.startswith("https://your-project"):
        try:
            # Save request
            req_payload = {
                "id": request_id,
                "user_id": user_id,
                "kind": req_body.get("kind"),
                "text": req_body.get("text"),
                "slots": req_body.get("slots", []),
            }
            requests.post(
                f"{SUPABASE_URL.rstrip('/')}/rest/v1/requests",
                headers=get_supabase_headers(),
                json=req_payload,
                timeout=4
            )

            # Save matches
            match_payloads = [
                {
                    "request_id": request_id,
                    "candidate_id": m["candidate_id"],
                    "score": m["score"],
                    "parts": m["parts"],
                    "reason": m["reason"],
                }
                for m in matches
            ]
            if match_payloads:
                requests.post(
                    f"{SUPABASE_URL.rstrip('/')}/rest/v1/matches",
                    headers=get_supabase_headers(),
                    json=match_payloads,
                    timeout=4
                )
        except Exception:
            pass

    return request_id

CONNECTIONS_STORE: List[Dict[str, Any]] = []

def create_connection(
    from_id: str,
    match_id: str,
    from_name: str = "Aarav Sharma",
    from_email: str = "aarav.cs27@college.edu",
    from_year: int = 1,
    to_name: str = "Peer",
    to_year: int = 3,
    topic: str = "Campus collaboration request",
) -> dict:
    conn_id = "conn_" + str(uuid.uuid4())[:8]
    conn_data = {
        "id": conn_id,
        "fromId": from_id,
        "fromName": from_name,
        "fromEmail": from_email,
        "fromYear": from_year,
        "toId": match_id,
        "toName": to_name,
        "toEmail": f"{to_name.lower().replace(' ', '.')}@college.edu",
        "toYear": to_year,
        "topic": topic,
        "status": "pending",
        "createdAt": "Just now",
    }
    CONNECTIONS_STORE.insert(0, conn_data)
    return {"connection_id": conn_id, "status": "pending", "connection": conn_data}

def get_connections() -> List[Dict[str, Any]]:
    return list(CONNECTIONS_STORE)

def respond_connection(connection_id: str, status: str) -> dict:
    for c in CONNECTIONS_STORE:
        if c.get("id") == connection_id:
            c["status"] = status
            return {"connection_id": connection_id, "status": status}
    return {"connection_id": connection_id, "status": status}

def save_feedback(match_id: str, feedback: str) -> dict:
    return {"ok": True}

def get_library_items(query: str = "", subject: str = "") -> list:
    items = [
        {
            "id": "res_001",
            "title": "Database Management Systems (DBMS) Comprehensive Notes",
            "subject": "Computer Science",
            "tags": ["sql", "dbms", "normalization", "indexing"],
            "verified": True,
            "file_url": "https://storage.supabase.co/notes/dbms_core.pdf",
        },
        {
            "id": "res_002",
            "title": "Machine Learning & Deep Learning Cheat Sheet",
            "subject": "Artificial Intelligence",
            "tags": ["ml", "pytorch", "scikit-learn", "neural networks"],
            "verified": True,
            "file_url": "https://storage.supabase.co/notes/ml_cheatsheet.pdf",
        },
        {
            "id": "res_003",
            "title": "Fullstack Web Development Handbook (React & FastAPI)",
            "subject": "Web Development",
            "tags": ["react", "fastapi", "next.js", "rest api"],
            "verified": True,
            "file_url": "https://storage.supabase.co/notes/fullstack_handbook.pdf",
        },
        {
            "id": "res_004",
            "title": "Placement Preparation Guide: DSA & Coding Rounds",
            "subject": "Placements",
            "tags": ["dsa", "c++", "competitive programming", "algorithms"],
            "verified": True,
            "file_url": "https://storage.supabase.co/notes/dsa_placement.pdf",
        },
    ]

    filtered = items
    if query:
        q = query.lower()
        filtered = [
            it for it in filtered
            if q in it["title"].lower() or any(q in t.lower() for t in it["tags"])
        ]
    if subject:
        s = subject.lower()
        filtered = [it for it in filtered if s in it["subject"].lower()]
    return filtered

