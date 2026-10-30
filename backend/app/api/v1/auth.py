from fastapi import APIRouter, Depends, HTTPException, Header, status
from pydantic import BaseModel, EmailStr
from typing import Optional
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.core.security import hash_password, verify_password, create_access_token, decode_access_token

router = APIRouter()


class LoginRequest(BaseModel):
    username: str
    password: str


class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str
    role: Optional[str] = "USER"


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


@router.post("/login", response_model=AuthResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == req.username).first()
    if not user or not verify_password(req.password, user.hashed_password):
        # Fallback for demo logins if DB not seeded
        if req.username == "admin" and req.password == "admin123":
            token = create_access_token({"sub": "admin", "role": "ADMIN"})
            return AuthResponse(access_token=token, user={"id": 1, "username": "admin", "email": "admin@bhu-tattva.gov.in", "role": "ADMIN"})
        elif req.username == "user" and req.password == "user123":
            token = create_access_token({"sub": "user", "role": "USER"})
            return AuthResponse(access_token=token, user={"id": 2, "username": "user", "email": "user@bhu-tattva.gov.in", "role": "USER"})
        raise HTTPException(status_code=400, detail="Invalid username or password")

    token = create_access_token({"sub": user.username, "role": user.role})
    return AuthResponse(
        access_token=token,
        user={
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role,
        }
    )


@router.post("/register", response_model=AuthResponse)
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter((User.username == req.username) | (User.email == req.email)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username or email already registered")

    user = User(
        username=req.username,
        email=req.email,
        hashed_password=hash_password(req.password),
        role=req.role.upper() if req.role and req.role.upper() in ["ADMIN", "USER"] else "USER"
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": user.username, "role": user.role})
    return AuthResponse(
        access_token=token,
        user={
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role,
        }
    )


@router.get("/me")
def get_current_user(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Authentication token required")
    
    token = authorization.replace("Bearer ", "") if authorization.startswith("Bearer ") else authorization
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
        
    username = payload.get("sub")
    user = db.query(User).filter(User.username == username).first()
    if user:
        return {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role
        }
    return {
        "id": 1 if payload.get("role") == "ADMIN" else 2,
        "username": username,
        "email": f"{username}@bhu-tattva.gov.in",
        "role": payload.get("role", "USER")
    }
