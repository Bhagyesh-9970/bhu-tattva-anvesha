import hashlib
from datetime import datetime, timedelta
from typing import Optional, Dict, Any

# Secret key for JWT simulation
SECRET_KEY = "bhu_tattva_super_secret_jwt_key_change_in_production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours


def hash_password(password: str) -> str:
    """Hashes password using SHA256 with salt."""
    salted = f"{password}_bhu_tattva_salt"
    return hashlib.sha256(salted.encode('utf-8')).hexdigest()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies plain password against stored hash."""
    return hash_password(plain_password) == hashed_password


def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """Generates simple JWT access token string representation."""
    payload = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    payload["exp"] = expire.timestamp()
    
    # Token format: username:role:exp_timestamp:hash
    raw_token = f"{payload.get('sub')}:{payload.get('role')}:{expire.timestamp()}"
    signature = hashlib.sha256(f"{raw_token}:{SECRET_KEY}".encode('utf-8')).hexdigest()
    return f"{raw_token}:{signature}"


def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    """Decodes and validates JWT token."""
    try:
        parts = token.split(":")
        if len(parts) != 4:
            return None
        sub, role, exp_str, sig = parts
        
        raw_token = f"{sub}:{role}:{exp_str}"
        expected_sig = hashlib.sha256(f"{raw_token}:{SECRET_KEY}".encode('utf-8')).hexdigest()
        
        if sig != expected_sig:
            return None
            
        exp = float(exp_str)
        if datetime.utcnow().timestamp() > exp:
            return None
            
        return {"sub": sub, "role": role, "exp": exp}
    except Exception:
        return None
