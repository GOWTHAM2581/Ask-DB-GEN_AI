import os
import requests
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from dotenv import load_dotenv
from pydantic import BaseModel

# Load .env relative to this file's location
base_dir = os.path.dirname(os.path.abspath(__file__))
env_path = os.path.join(base_dir, ".env")
load_dotenv(env_path)

SECRET_KEY = os.getenv("SECRET_KEY", "fallback_secret_key_for_dev_only")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))

# Clerk Configuration
CLERK_ISSUER = os.getenv("CLERK_ISSUER") # e.g. https://great-hyena-92.clerk.accounts.dev
CLERK_PEM_PUBLIC_KEY = os.getenv("CLERK_PEM_PUBLIC_KEY") # If they provide the PEM directly

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    # 1. Try standard JWT verification (Old Auth)
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username:
            return username
    except JWTError:
        pass

    # 2. Try Clerk Verification (New Auth)
    # If they use Clerk, the JWT is signed by Clerk.
    # We ideally need the Public Key or to check Clerk's JWKS.
    # For a quick fix in dev/small apps, we can just check if it's a valid JWT from Clerk
    # if we have the public key.
    
    if CLERK_PEM_PUBLIC_KEY:
        try:
            # Clerk uses RS256
            payload = jwt.decode(token, CLERK_PEM_PUBLIC_KEY, algorithms=["RS256"])
            username = payload.get("sub")
            if username:
                return username
        except JWTError as e:
            print(f"Clerk JWT Error: {str(e)}")

    # 3. If we are in development and it looks like a Clerk token, we might want to allow it 
    # to unblock the user, but it's risky. 
    # Better: If Clerk is not configured but a token is sent, we should warn.
    
    # Check if it's a JWT by looking for the 3 parts
    if token.count('.') == 2:
        try:
            # Decode without verification just to see if it's from Clerk
            unverified = jwt.get_unverified_claims(token)
            if "clerk" in str(unverified.get("iss", "")):
                # If we're here, it's a Clerk token but we didn't have the key to verify it.
                # In development mode, we could trust it, but let's be safer.
                # If ENV=development, let's allow it but log a warning.
                if os.getenv("ENV") == "development":
                    return unverified.get("sub", "clerk_user")
        except Exception:
            pass

    raise credentials_exception
