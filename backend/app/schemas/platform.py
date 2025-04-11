"""
Platform schemas for request and response validation.
"""
from datetime import datetime
from typing import Dict, List, Optional, Union

from pydantic import BaseModel, Field, validator


class PlatformBase(BaseModel):
    """Base platform schema with common attributes."""
    name: str = Field(..., min_length=1, max_length=100)
    type: str = Field(..., description="Platform type: twitter, facebook, instagram, etc.")
    description: Optional[str] = Field(None, max_length=500)
    is_active: bool = True


class PlatformCreate(PlatformBase):
    """Schema for platform creation."""
    credentials: Dict[str, str] = Field(..., description="Platform credentials")


class PlatformUpdate(PlatformBase):
    """Schema for platform updates."""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    type: Optional[str] = None
    credentials: Optional[Dict[str, str]] = None


class PlatformInDBBase(PlatformBase):
    """Base schema for platforms in DB."""
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


class Platform(PlatformInDBBase):
    """Response schema for platforms."""
    # Exclude sensitive data
    credentials: Optional[Dict[str, str]] = None


class PlatformWithStats(Platform):
    """Platform with additional statistics."""
    followers_count: int = 0
    following_count: int = 0
    total_posts: int = 0
    engagement_rate: float = 0.0
    last_sync: Optional[datetime] = None
    stats: Optional[Dict[str, Union[int, float, str, List[Dict]]]] = None


class PlatformCredentials(BaseModel):
    """Schema for platform credentials."""
    credentials: Dict[str, str] = Field(..., description="Platform API credentials")
    
    @validator("credentials")
    def validate_required_fields(cls, v, values, **kwargs):
        """Validate that required fields are present for each platform type."""
        platform_type = values.get("type", "")
        
        # Different validations based on platform type
        if platform_type == "twitter":
            required = ["api_key", "api_secret", "access_token", "access_token_secret"]
        elif platform_type in ["facebook", "instagram"]:
            required = ["app_id", "app_secret", "access_token"]
        elif platform_type == "linkedin":
            required = ["client_id", "client_secret", "access_token"]
        elif platform_type == "tiktok":
            required = ["client_key", "client_secret", "access_token"]
        elif platform_type == "youtube":
            required = ["api_key"]
        else:
            # For custom platforms, require at least one credential
            return v if v else {}
        
        missing = [field for field in required if field not in v]
        if missing:
            missing_str = ", ".join(missing)
            raise ValueError(f"Missing required credentials: {missing_str}")
        
        return v
