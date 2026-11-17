import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.matcher import match
from app.data import PROFILES
from app.auth import create_test_token

client = TestClient(app)

def test_empty_profile_list_does_not_crash():
    """Verify that an empty candidate list returns empty without crashing."""
    req = {
        "id": "test_empty",
        "kind": "teammate",
        "year": 2,
        "avail": ["wkend_morn"],
        "text": "Need someone to help with React",
    }
    res = match(req, profiles=[])
    assert res == []

def test_deterministic_ranking():
    """Verify that running match on the same request produces identical ranking and scores."""
    req = {
        "id": "test_deterministic",
        "kind": "teammate",
        "year": 2,
        "avail": ["wkend_aft", "wkday_eve"],
        "text": "Need a frontend developer for a hackathon, comfortable with React",
    }
    run1 = match(req, profiles=PROFILES, k=3)
    run2 = match(req, profiles=PROFILES, k=3)

    assert len(run1) == len(run2) == 3
    for m1, m2 in zip(run1, run2):
        assert m1["id"] == m2["id"]
        assert m1["score"] == m2["score"]
        assert m1["why"] == m2["why"]

def test_mentor_ranks_verified_senior_first():
    """Verify that a mentor request prioritizes verified senior mentors over junior peers."""
    req = {
        "id": "test_mentor",
        "kind": "mentor",
        "year": 2,
        "avail": ["wkend_morn", "wkday_eve"],
        "text": "Looking for a senior mentor in machine learning to guide my mini project",
    }
    results = match(req, profiles=PROFILES, k=3)
    top = results[0]

    # Top match must be a verified mentor and senior (year > 2)
    assert top["year"] > req["year"]
    assert "verified year-" in top["why"]
    assert "covers ml" in top["why"]
    assert top["name"] == "Ananya"

def test_api_match_without_auth_rejected():
    """Verify that requests without token are rejected with 401."""
    payload = {
        "kind": "mentor",
        "text": "Looking for an ML mentor",
        "slots": ["wkend_morn"],
        "year": 2,
    }
    res = client.post("/match", json=payload)
    assert res.status_code == 401
    assert "detail" in res.json()

def test_api_match_with_valid_jwt():
    """Verify POST /match with valid token returns exact JSON contract."""
    token = create_test_token("student_user_123")
    headers = {"Authorization": f"Bearer {token}"}
    payload = {
        "kind": "mentor",
        "text": "Looking for an ML mentor",
        "slots": ["wkend_morn"],
        "year": 2,
    }
    res = client.post("/match", json=payload, headers=headers)
    assert res.status_code == 200
    data = res.json()

    assert "request_id" in data
    assert isinstance(data["matches"], list)
    assert len(data["matches"]) >= 1

    top = data["matches"][0]
    assert "candidate_id" in top
    assert "name" in top
    assert "year" in top
    assert "score" in top
    assert "parts" in top
    assert "skills" in top
    assert "reason" in top

    # Verify score parts
    parts = top["parts"]
    assert "semantic" in parts
    assert "coverage" in parts
    assert "availability" in parts
    assert "fit" in parts

def test_api_connections_and_feedback():
    """Verify connect, respond, and feedback endpoints."""
    token = create_test_token("student_user_123")
    headers = {"Authorization": f"Bearer {token}"}

    # Connect
    conn_res = client.post("/matches/P01/connect", headers=headers)
    assert conn_res.status_code == 200
    conn_data = conn_res.json()
    assert "connection_id" in conn_data
    assert conn_data["status"] == "pending"

    # Respond
    resp_res = client.post(
        f"/connections/{conn_data['connection_id']}/respond",
        json={"status": "accepted"},
        headers=headers,
    )
    assert resp_res.status_code == 200
    assert resp_res.json()["status"] == "accepted"

    # Feedback
    fb_res = client.post(
        "/matches/match_123/feedback",
        json={"feedback": "good"},
        headers=headers,
    )
    assert fb_res.status_code == 200
    assert fb_res.json()["ok"] is True

def test_api_library_endpoint():
    """Verify GET /library filter."""
    res = client.get("/library?q=dbms")
    assert res.status_code == 200
    items = res.json()["items"]
    assert len(items) >= 1
    assert "DBMS" in items[0]["title"]

