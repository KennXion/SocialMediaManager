"""
Post schemas for request and response validation.
"""
from datetime import datetime
from typing import Dict, List, Optional, Union

from pydantic import BaseModel, Field, validator


class PostBase(BaseModel):
    """Base post schema with common attributes."""
    platform_id: int
    content: str = Field(..., min_length=1, max_length=5000)
    content_type: str = Field(..., description="Type: text, image, video, link, etc.")
    hashtags: Optional[List[str]] = None
    mentions: Optional[List[str]] = None
    media_urls: Optional[List[str]] = None
    og_url: Optional[str] = None
    status: str = "draft"  # draft, scheduled, published, failed


class PostCreate(PostBase):
    """Schema for post creation."""
    pass


class PostUpdate(BaseModel):
    """Schema for post updates."""
    content: Optional[str] = Field(None, min_length=1, max_length=5000)
    content_type: Optional[str] = None
    hashtags: Optional[List[str]] = None
    mentions: Optional[List[str]] = None
    media_urls: Optional[List[str]] = None
    og_url: Optional[str] = None
    
    @validator("content_type")
    def validate_content_type(cls, v):
        """Validate content type."""
        valid_types = ["text", "image", "video", "link", "carousel", "story", "poll", "reel"]
        if v and v not in valid_types:
            raise ValueError(f"Invalid content type. Must be one of: {', '.join(valid_types)}")
        return v


class PostInDBBase(PostBase):
    """Base schema for posts in DB."""
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    published_at: Optional[datetime] = None
    external_id: Optional[str] = None  # ID of the post on the social platform

    class Config:
        orm_mode = True


class Post(PostInDBBase):
    """Response schema for posts."""
    pass


class PostWithPlatformDetails(Post):
    """Post with additional platform details."""
    platform_name: str
    platform_type: str
    metrics: Optional[Dict[str, Union[int, float]]] = None
