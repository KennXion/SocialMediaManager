"""
AI-related schemas for request and response validation.
"""
from typing import Dict, List, Optional, Union

from pydantic import BaseModel, Field, validator


class ContentGenerationRequest(BaseModel):
    """Request schema for AI content generation."""
    platform: str = Field(..., description="Target platform: twitter, facebook, instagram, etc.")
    content_type: str = Field(..., description="Type: text, image_caption, video_description, etc.")
    topic: str = Field(..., description="Topic or subject for the content")
    tone: Optional[str] = Field("neutral", description="Tone: professional, casual, humorous, etc.")
    keywords: Optional[List[str]] = Field([], description="Keywords to include")
    length: Optional[str] = Field("medium", description="Length: short, medium, long")
    include_hashtags: Optional[bool] = Field(True, description="Include relevant hashtags")
    include_emoji: Optional[bool] = Field(True, description="Include relevant emojis")
    
    @validator("platform")
    def validate_platform(cls, v):
        """Validate platform."""
        valid_platforms = [
            "twitter", "facebook", "instagram", "linkedin", 
            "tiktok", "youtube", "pinterest", "snapchat"
        ]
        if v.lower() not in valid_platforms:
            raise ValueError(f"Unsupported platform. Must be one of: {', '.join(valid_platforms)}")
        return v.lower()
    
    @validator("content_type")
    def validate_content_type(cls, v):
        """Validate content type."""
        valid_types = [
            "text", "image_caption", "video_description", "article", 
            "poll", "story", "reel", "carousel", "blog_post", "link_preview"
        ]
        if v.lower() not in valid_types:
            raise ValueError(f"Unsupported content type. Must be one of: {', '.join(valid_types)}")
        return v.lower()
    
    @validator("tone")
    def validate_tone(cls, v):
        """Validate tone."""
        valid_tones = [
            "professional", "casual", "humorous", "inspirational", 
            "informative", "promotional", "conversational", "neutral"
        ]
        if v.lower() not in valid_tones:
            raise ValueError(f"Unsupported tone. Must be one of: {', '.join(valid_tones)}")
        return v.lower()
    
    @validator("length")
    def validate_length(cls, v):
        """Validate length."""
        valid_lengths = ["short", "medium", "long"]
        if v.lower() not in valid_lengths:
            raise ValueError(f"Unsupported length. Must be one of: {', '.join(valid_lengths)}")
        return v.lower()


class ContentGenerationResponse(BaseModel):
    """Response schema for AI-generated content."""
    content: str
    hashtags: Optional[List[str]] = None
    mentions: Optional[List[str]] = None
    media_suggestions: Optional[List[str]] = None
    improvement_tips: Optional[List[str]] = None
    platform_optimization: Optional[Dict[str, str]] = None


class ContentImprovement(BaseModel):
    """Response schema for content improvement suggestions."""
    original_content: str
    improved_content: str
    changes_made: List[str]
    reasoning: str
    additional_suggestions: Optional[List[str]] = None


class ContentIdea(BaseModel):
    """Schema for a content idea."""
    title: str
    description: str
    hashtags: Optional[List[str]] = None
    best_time_to_post: Optional[str] = None
    content_type: str  # text, image, video, etc.
    estimated_engagement: Optional[str] = None  # high, medium, low


class ContentIdeas(BaseModel):
    """Response schema for content ideas."""
    ideas: List[ContentIdea]
    trending_topics: Optional[List[str]] = None
    best_performing_categories: Optional[Dict[str, float]] = None


class HashtagSuggestions(BaseModel):
    """Response schema for hashtag suggestions."""
    hashtags: List[str]
    trending_hashtags: Optional[List[str]] = None
    niche_hashtags: Optional[List[str]] = None
    popular_hashtags: Optional[List[str]] = None
    engagement_potential: Dict[str, str]  # hashtag -> high, medium, low


class AudienceInsight(BaseModel):
    """Schema for audience insight."""
    category: str  # demographics, interests, behavior, etc.
    data: Dict[str, Union[str, int, float, List]]
    recommendations: List[str]


class AudienceAnalysis(BaseModel):
    """Response schema for audience analysis."""
    insights: List[AudienceInsight]
    content_recommendations: List[Dict[str, str]]
    best_posting_times: Dict[str, List[str]]  # day -> times
    engagement_patterns: Dict[str, Any]
    growth_opportunities: List[str]
