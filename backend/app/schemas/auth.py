"""
Authentication schemas for request and response validation.
"""
from datetime import datetime
from typing import Optional

from jose import jwt, JWTError
from pydantic import BaseModel, Field


class Token(BaseModel):
    """Schema for authentication token response."""
    access_token: str
    refresh_token: str
    token_type: str


class TokenPayload(BaseModel):
    """Schema for JWT token payload."""
    sub: Optional[str] = None
    exp: Optional[datetime] = None
    type: Optional[str] = None
    
    @classmethod
    def from_jwt(cls, token: str, secret_key: str) -> Optional["TokenPayload"]:
        """Parse JWT token and return payload."""
        try:
            payload = jwt.decode(token, secret_key)
            return cls(**payload)
        except JWTError:
            return None


class RefreshToken(BaseModel):
    """Schema for refresh token request."""
    refresh_token: str = Field(..., description="JWT refresh token")
