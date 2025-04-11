"""
Post model for database representation.
"""
from datetime import datetime
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text, ARRAY, JSON
from sqlalchemy.orm import relationship

from app.core.database import Base


class Post(Base):
    """Post model for social media content."""
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    platform_id = Column(Integer, ForeignKey("platforms.id", ondelete="CASCADE"), nullable=False)
    content = Column(Text, nullable=False)
    content_type = Column(String(50), nullable=False)  # text, image, video, link, etc.
    hashtags = Column(ARRAY(String))
    mentions = Column(ARRAY(String))
    media_urls = Column(ARRAY(String))
    og_url = Column(String)  # Open Graph URL for link previews
    status = Column(String(20), default="draft")  # draft, scheduled, published, failed
    external_id = Column(String)  # ID of the post on the social platform
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    published_at = Column(DateTime)  # When the post was published

    # Relationships
    user = relationship("User", back_populates="posts")
    platform = relationship("Platform", back_populates="posts")
    schedules = relationship("Schedule", back_populates="post", cascade="all, delete-orphan")
    metrics = relationship("PostMetric", back_populates="post", cascade="all, delete-orphan")


class PostMetric(Base):
    """Post metrics model to track performance."""
    __tablename__ = "post_metrics"

    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("posts.id", ondelete="CASCADE"), nullable=False)
    date = Column(DateTime, default=datetime.utcnow)
    likes = Column(Integer, default=0)
    comments = Column(Integer, default=0)
    shares = Column(Integer, default=0)
    saves = Column(Integer, default=0)
    impressions = Column(Integer, default=0)
    reach = Column(Integer, default=0)
    clicks = Column(Integer, default=0)
    engagement_rate = Column(Integer, default=0)  # Stored as percentage * 100
    sentiment = Column(String(20))  # positive, negative, neutral
    details = Column(JSON)  # Platform-specific metrics

    # Relationships
    post = relationship("Post", back_populates="metrics")
