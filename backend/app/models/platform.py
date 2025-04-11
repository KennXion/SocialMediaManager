"""
Platform model for database representation.
"""
from datetime import datetime
from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, JSON
from sqlalchemy.orm import relationship

from app.core.database import Base


class Platform(Base):
    """Platform model for social media accounts."""
    __tablename__ = "platforms"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(100), nullable=False)
    type = Column(String(50), nullable=False)  # twitter, facebook, instagram, etc.
    description = Column(String(500))
    credentials = Column(JSON)  # Store API keys, tokens, etc.
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_sync = Column(DateTime)  # Last time platform stats were synchronized

    # Relationships
    user = relationship("User", back_populates="platforms")
    posts = relationship("Post", back_populates="platform", cascade="all, delete-orphan")
    metrics = relationship("PlatformMetric", back_populates="platform", cascade="all, delete-orphan")


class PlatformMetric(Base):
    """Platform metrics model to track analytics over time."""
    __tablename__ = "platform_metrics"

    id = Column(Integer, primary_key=True, index=True)
    platform_id = Column(Integer, ForeignKey("platforms.id", ondelete="CASCADE"), nullable=False)
    date = Column(DateTime, default=datetime.utcnow)
    followers_count = Column(Integer, default=0)
    following_count = Column(Integer, default=0)
    posts_count = Column(Integer, default=0)
    engagement_rate = Column(Integer, default=0)  # Stored as percentage * 100 (e.g., 2.5% = 250)
    impressions = Column(Integer, default=0)
    reach = Column(Integer, default=0)
    likes = Column(Integer, default=0)
    comments = Column(Integer, default=0)
    shares = Column(Integer, default=0)
    clicks = Column(Integer, default=0)
    demographics = Column(JSON)  # Store demographic data
    
    # Relationships
    platform = relationship("Platform", back_populates="metrics")
