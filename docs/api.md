# CampusLink - API Specification

## Endpoints

### 1. Match Engine
`POST /match`
- **Auth**: `Bearer <supabase JWT>`
- **Request Body**:
```json
{
  "kind": "mentor",
  "text": "Looking for an ML mentor",
  "slots": ["wkend_morn"],
  "year": 2
}
```
- **Response `200 OK`**:
```json
{
  "request_id": "uuid",
  "matches": [
    {
      "candidate_id": "uuid",
      "name": "Ananya",
      "year": 3,
      "score": 87.4,
      "parts": {
        "semantic": 1.0,
        "coverage": 1.0,
        "availability": 0.33,
        "fit": 1.0
      },
      "skills": ["python", "machine learning"],
      "reason": "covers ml; verified year-3 mentor; 1 shared free slot(s)"
    }
  ]
}
```

### 2. Connections
`POST /matches/{id}/connect`
- **Auth**: `Bearer <supabase JWT>`
- **Response `200 OK`**:
```json
{
  "connection_id": "uuid",
  "status": "pending"
}
```

`POST /connections/{id}/respond`
- **Auth**: `Bearer <supabase JWT>`
- **Request Body**:
```json
{
  "status": "accepted"
}
```
*(or `"declined"`)*
- **Response `200 OK`**:
```json
{
  "connection_id": "uuid",
  "status": "accepted"
}
```

### 3. Match Feedback
`POST /matches/{id}/feedback`
- **Auth**: `Bearer <supabase JWT>`
- **Request Body**:
```json
{
  "feedback": "good"
}
```
*(or `"bad"`)*
- **Response `200 OK`**:
```json
{
  "ok": true
}
```

### 4. Notes Library
`GET /library?q=dbms&subject=`
- **Response `200 OK`**:
```json
{
  "items": [
    {
      "id": "uuid",
      "title": "DBMS Comprehensive Notes",
      "subject": "Computer Science",
      "tags": ["sql", "dbms", "normalization"],
      "verified": true,
      "file_url": "https://..."
    }
  ]
}
```

### 5. Health Check
`GET /health`
- **Response `200 OK`**:
```json
{
  "ok": true
}
```

> **Privacy Rule**: Contact details (email/phone) are returned only when a connection is `accepted`.

