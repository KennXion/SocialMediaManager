"""
User schemas for request and response validation.
"""
from typing import Optional

from pydantic import BaseModel, EmailStr, Field


class UserBase(BaseModel):
    """Base user schema with common attributes."""
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    is_active: Optional[bool] = True
    is_admin: bool = False


class UserCreate(UserBase):
    """Schema for user creation."""
    email: EmailStr
    password: str = Field(..., min_length=8)
    full_name: str


class UserUpdate(UserBase):
    """Schema for user updates."""
    password: Optional[str] = Field(None, min_length=8)


class UserInDBBase(UserBase):
    """Base schema for users in DB."""
    id: int

    class Config:
        orm_mode = True


class User(UserInDBBase):
    """Response schema for users."""
    pass


class UserInDB(UserInDBBase):
    """Schema for user with hashed password in DB."""
    hashed_password: str
