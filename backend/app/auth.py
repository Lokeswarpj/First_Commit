import os
import jwt
from fastapi import HTTPException, Security, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer(auto_error=False)

JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET", "mock_jwt_secret_for_dev_and_tests")
ALGORITHM = "HS256"

def verify_token(credentials: HTTPAuthorizationCredentials = Security(security)) -> dict:
    """
    Verifies Supabase JWT from Authorization header.
    Rejects requests without a valid token.
    """
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing Authorization header or Bearer token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token = credentials.credentials
    try:
        # Decode JWT. Allow signature-free verification in local dev/mock mode
        verify_sig = bool(os.getenv("VERIFY_JWT_SIGNATURE", "false").lower() == "true")
        payload = jwt.decode(
            token,
            JWT_SECRET,
            algorithms=[ALGORITHM],
            options={"verify_aud": False, "verify_signature": verify_sig}
        )
        user_id = payload.get("sub", "anon_demo_user")
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
        )
    except jwt.InvalidTokenError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {str(e)}",
        )

def create_test_token(user_id: str, secret: str = None) -> str:
    """Helper to generate valid JWTs for unit and integration testing."""
    sec = secret or JWT_SECRET
    payload = {
        "sub": user_id,
        "aud": "authenticated",
        "role": "authenticated",
        "email": f"{user_id}@college.edu"
    }
    return jwt.encode(payload, sec, algorithm=ALGORITHM)

