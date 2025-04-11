"""
AI-powered content generation endpoints.
"""
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.user import User as UserModel
from app.schemas.ai import (
    ContentGenerationRequest,
    ContentGenerationResponse,
    ContentImprovement,
    ContentIdeas,
    HashtagSuggestions,
    AudienceAnalysis
)
from app.services.auth import get_current_active_user
from app.services.ai import (
    generate_content,
    improve_content,
    generate_content_ideas,
    suggest_hashtags,
    analyze_audience
)

router = APIRouter()


@router.post("/generate", response_model=ContentGenerationResponse)
async def create_content(
    request: ContentGenerationRequest,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user),
) -> Any:
    """
    Generate social media content using AI.
    """
    try:
        content = await generate_content(
            db,
            user_id=current_user.id,
            platform=request.platform,
            content_type=request.content_type,
            topic=request.topic,
            tone=request.tone,
            keywords=request.keywords,
            length=request.length,
            include_hashtags=request.include_hashtags,
            include_emoji=request.include_emoji
        )
        return content
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Content generation failed: {str(e)}"
        )


@router.post("/improve", response_model=ContentImprovement)
async def improve_existing_content(
    content: str = Query(..., min_length=1, max_length=2000),
    platform: str = Query(...),
    aspect: str = Query(..., description="Aspect to improve: engagement, clarity, tone, etc."),
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user),
) -> Any:
    """
    Improve existing content using AI suggestions.
    """
    try:
        improved = await improve_content(
            db,
            user_id=current_user.id,
            content=content,
            platform=platform,
            aspect=aspect
        )
        return improved
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Content improvement failed: {str(e)}"
        )


@router.get("/ideas", response_model=ContentIdeas)
async def get_content_ideas(
    topic: str = Query(None),
    platform: str = Query(...),
    count: int = Query(5, ge=1, le=20),
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user),
) -> Any:
    """
    Generate content ideas based on topic or trending subjects.
    """
    try:
        ideas = await generate_content_ideas(
            db,
            user_id=current_user.id,
            platform=platform,
            topic=topic,
            count=count
        )
        return ideas
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Idea generation failed: {str(e)}"
        )


@router.get("/hashtags", response_model=HashtagSuggestions)
async def get_hashtags(
    content: str = Query(..., min_length=1, max_length=2000),
    platform: str = Query(...),
    count: int = Query(10, ge=1, le=30),
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user),
) -> Any:
    """
    Suggest relevant hashtags for content.
    """
    try:
        hashtags = await suggest_hashtags(
            db,
            user_id=current_user.id,
            content=content,
            platform=platform,
            count=count
        )
        return hashtags
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Hashtag suggestion failed: {str(e)}"
        )


@router.get("/audience", response_model=AudienceAnalysis)
async def get_audience_analysis(
    platform_id: int,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user),
) -> Any:
    """
    Analyze audience and suggest content strategy.
    """
    try:
        analysis = await analyze_audience(
            db,
            user_id=current_user.id,
            platform_id=platform_id
        )
        return analysis
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Audience analysis failed: {str(e)}"
        )
