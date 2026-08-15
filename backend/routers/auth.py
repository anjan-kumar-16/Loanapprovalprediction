from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from schemas import LoginRequest
from database import get_db

router = APIRouter(prefix="/api", tags=["auth"])

@router.post("/login")
def login(req: LoginRequest, db: Session = Depends(get_db)):
    if req.username == "manager" and req.password == "password":
        return {"role": "manager", "token": "fake-jwt-token-manager"}
    elif req.username == "applicant" and req.password == "password":
        return {"role": "applicant", "token": "fake-jwt-token-applicant"}
    else:
        raise HTTPException(status_code=401, detail="Invalid credentials")
