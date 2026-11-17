import os
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, Depends, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from app.auth import verify_token
from app.matcher import match
from app.db import (
    load_profiles,
    save_request_and_matches,
    create_connection,
    get_connections,
    respond_connection,
    save_feedback,
    get_library_items,
)

app = FastAPI(
    title="CampusLink API",
    version="1.0.0",
    description="CampusLink AI Matching Engine API with JWT Authentication and Explainable Scoring",
)

# CORS setup
origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins + ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Schemas
class MatchRequestBody(BaseModel):
    kind: str = Field(..., description="Request kind: teammate | mentor | notes")
    text: str = Field(..., description="Plain-language description of request")
    slots: List[str] = Field(default_factory=list, description="Free time slots")
    year: int = Field(default=2, ge=1, le=4, description="Student academic year")

class ScoreParts(BaseModel):
    semantic: float
    coverage: float
    availability: float
    fit: float

class MatchItem(BaseModel):
    candidate_id: str
    name: str
    year: int
    score: float
    parts: ScoreParts
    skills: List[str]
    reason: str

class MatchResponse(BaseModel):
    request_id: str
    matches: List[MatchItem]

class ConnectRequestBody(BaseModel):
    from_name: Optional[str] = "Student"
    from_email: Optional[str] = "student@college.edu"
    from_year: Optional[int] = 1
    to_name: Optional[str] = "Peer"
    to_year: Optional[int] = 3
    topic: Optional[str] = "Campus collaboration request"

class ConnectResponse(BaseModel):
    connection_id: str
    status: str
    connection: Optional[Dict[str, Any]] = None

class ConnectionRespondBody(BaseModel):
    status: str = Field(..., pattern="^(accepted|declined)$")

class FeedbackBody(BaseModel):
    feedback: str = Field(..., pattern="^(good|bad)$")

@app.get("/health")
def health_check():
    return {"ok": True}

@app.post("/match", response_model=MatchResponse)
def match_request(
    body: MatchRequestBody,
    current_user: dict = Depends(verify_token),
    k: int = Query(default=3, ge=1, le=10),
):
    """
    POST /match
    Requires valid Supabase JWT in Authorization header.
    Loads profiles excluding the requester, runs hybrid matching, and returns explainable scores.
    """
    user_id = current_user.get("sub", "anon")
    
    # Load candidate profiles excluding the requester
    profiles = load_profiles(exclude_user_id=user_id)
    if not profiles:
        return MatchResponse(request_id="empty", matches=[])

    # Convert request body to matcher format
    req_dict = {
        "id": "incoming",
        "kind": body.kind,
        "text": body.text,
        "avail": body.slots,
        "year": body.year,
    }

    # Execute match
    raw_matches = match(req_dict, profiles=profiles, k=k)

    # Format to match exact API contract
    formatted_matches = []
    for m in raw_matches:
        formatted_matches.append(
            MatchItem(
                candidate_id=str(m["id"]),
                name=m["name"],
                year=m["year"],
                score=float(m["score"]),
                parts=ScoreParts(
                    semantic=float(m["parts"]["semantic"]),
                    coverage=float(m["parts"]["coverage"]),
                    availability=float(m["parts"]["availability"]),
                    fit=float(m["parts"]["fit"]),
                ),
                skills=m["skills"],
                reason=m["why"],
            )
        )

    # Save to database
    request_id = save_request_and_matches(
        user_id=user_id,
        req_body=body.model_dump(),
        matches=[m.model_dump() for m in formatted_matches],
    )

    return MatchResponse(request_id=request_id, matches=formatted_matches)

@app.post("/matches/{id}/connect", response_model=ConnectResponse)
def connect_candidate(
    id: str,
    body: Optional[ConnectRequestBody] = None,
    current_user: dict = Depends(verify_token),
):
    user_id = current_user.get("sub", "anon")
    b = body or ConnectRequestBody()
    return create_connection(
        from_id=user_id,
        match_id=id,
        from_name=b.from_name or "Student",
        from_email=b.from_email or "student@college.edu",
        from_year=b.from_year or 1,
        to_name=b.to_name or "Peer",
        to_year=b.to_year or 3,
        topic=b.topic or "Campus collaboration request",
    )

@app.get("/connections")
def list_connections(current_user: dict = Depends(verify_token)):
    return {"connections": get_connections()}

@app.post("/connections/{id}/respond", response_model=ConnectResponse)
def respond_to_connection(
    id: str,
    body: ConnectionRespondBody,
    current_user: dict = Depends(verify_token),
):
    return respond_connection(connection_id=id, status=body.status)

@app.post("/matches/{id}/feedback")
def submit_match_feedback(
    id: str,
    body: FeedbackBody,
    current_user: dict = Depends(verify_token),
):
    return save_feedback(match_id=id, feedback=body.feedback)

@app.get("/library")
def get_library(
    q: Optional[str] = Query(default="", alias="q"),
    subject: Optional[str] = Query(default=""),
):
    items = get_library_items(query=q, subject=subject)
    return {"items": items}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=True)
