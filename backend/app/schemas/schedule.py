"""
Schedule schemas for request and response validation.
"""
from datetime import datetime
from typing import Dict, Optional

from pydantic import BaseModel, Field, validator


class ScheduleBase(BaseModel):
    """Base schedule schema with common attributes."""
    post_id: int
    scheduled_at: datetime
    status: str = "pending"  # pending, completed, failed, cancelled
    timezone: str = "UTC"
    recurrence: Optional[str] = None  # daily, weekly, monthly, custom


class ScheduleCreate(ScheduleBase):
    """Schema for schedule creation."""
    
    @validator("scheduled_at")
    def validate_scheduled_at(cls, v):
        """Validate that scheduled time is in the future."""
        if v <= datetime.utcnow():
            raise ValueError("Scheduled time must be in the future")
        return v
    
    @validator("recurrence")
    def validate_recurrence(cls, v):
        """Validate recurrence pattern."""
        if v:
            valid_patterns = ["daily", "weekly", "monthly", "custom"]
            if v not in valid_patterns:
                raise ValueError(f"Invalid recurrence pattern. Must be one of: {', '.join(valid_patterns)}")
        return v


class ScheduleUpdate(BaseModel):
    """Schema for schedule updates."""
    scheduled_at: Optional[datetime] = None
    status: Optional[str] = None
    timezone: Optional[str] = None
    recurrence: Optional[str] = None
    
    @validator("scheduled_at")
    def validate_scheduled_at(cls, v):
        """Validate that scheduled time is in the future."""
        if v and v <= datetime.utcnow():
            raise ValueError("Scheduled time must be in the future")
        return v
    
    @validator("status")
    def validate_status(cls, v):
        """Validate status."""
        if v:
            valid_statuses = ["pending", "completed", "failed", "cancelled"]
            if v not in valid_statuses:
                raise ValueError(f"Invalid status. Must be one of: {', '.join(valid_statuses)}")
        return v


class ScheduleInDBBase(ScheduleBase):
    """Base schema for schedules in DB."""
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    completed_at: Optional[datetime] = None
    error_message: Optional[str] = None

    class Config:
        orm_mode = True


class Schedule(ScheduleInDBBase):
    """Response schema for schedules."""
    pass


class ScheduleWithPostDetails(Schedule):
    """Schedule with additional post and platform details."""
    post_content: str
    post_type: str
    platform_id: int
    platform_name: str
    platform_type: str
    metrics: Optional[Dict[str, int]] = None
