"""
Analytics endpoints for social media data.
"""
from typing import Any, Dict, List, Optional
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.user import User as UserModel
from app.services.auth import get_current_active_user
from app.services.analytics import (
    get_platform_analytics,
    get_post_performance,
    get_audience_insights,
    get_engagement_metrics,
    get_growth_metrics,
    export_analytics
)

router = APIRouter()


@router.get("/platform/{platform_id}", response_model=Dict[str, Any])
def platform_analytics(
    platform_id: int,
    from_date: Optional[datetime] = None,
    to_date: Optional[datetime] = None,
    metrics: List[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user),
) -> Any:
    """
    Get analytics for a specific platform.
    
    Optional metrics to include:
    - followers
    - engagement
    - impressions
    - reach
    - demographics
    - best_time
    """
    if not from_date:
        from_date = datetime.now() - timedelta(days=30)
    
    if not to_date:
        to_date = datetime.now()
    
    analytics = get_platform_analytics(
        db, 
        platform_id=platform_id, 
        user_id=current_user.id,
        from_date=from_date,
        to_date=to_date,
        metrics=metrics
    )
    return analytics


@router.get("/performance", response_model=Dict[str, Any])
def post_performance(
    platform_id: Optional[int] = None,
    from_date: Optional[datetime] = None,
    to_date: Optional[datetime] = None,
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user),
) -> Any:
    """
    Get post performance analytics across all platforms or for a specific platform.
    
    Returns top performing posts by engagement rate.
    """
    if not from_date:
        from_date = datetime.now() - timedelta(days=30)
    
    if not to_date:
        to_date = datetime.now()
    
    performance = get_post_performance(
        db, 
        user_id=current_user.id,
        platform_id=platform_id,
        from_date=from_date,
        to_date=to_date,
        limit=limit
    )
    return performance


@router.get("/audience", response_model=Dict[str, Any])
def audience_insights(
    platform_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user),
) -> Any:
    """
    Get audience demographics and insights across all platforms or for a specific platform.
    """
    insights = get_audience_insights(
        db, 
        user_id=current_user.id,
        platform_id=platform_id
    )
    return insights


@router.get("/engagement", response_model=Dict[str, Any])
def engagement_analytics(
    platform_id: Optional[int] = None,
    from_date: Optional[datetime] = None,
    to_date: Optional[datetime] = None,
    interval: str = "day",  # day, week, month
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user),
) -> Any:
    """
    Get engagement metrics over time.
    """
    if not from_date:
        from_date = datetime.now() - timedelta(days=30)
    
    if not to_date:
        to_date = datetime.now()
    
    metrics = get_engagement_metrics(
        db, 
        user_id=current_user.id,
        platform_id=platform_id,
        from_date=from_date,
        to_date=to_date,
        interval=interval
    )
    return metrics


@router.get("/growth", response_model=Dict[str, Any])
def growth_analytics(
    platform_id: Optional[int] = None,
    from_date: Optional[datetime] = None,
    to_date: Optional[datetime] = None,
    interval: str = "day",  # day, week, month
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user),
) -> Any:
    """
    Get follower growth metrics over time.
    """
    if not from_date:
        from_date = datetime.now() - timedelta(days=30)
    
    if not to_date:
        to_date = datetime.now()
    
    metrics = get_growth_metrics(
        db, 
        user_id=current_user.id,
        platform_id=platform_id,
        from_date=from_date,
        to_date=to_date,
        interval=interval
    )
    return metrics


@router.get("/export", response_model=Dict[str, str])
def export_analytics_data(
    platform_id: Optional[int] = None,
    from_date: Optional[datetime] = None,
    to_date: Optional[datetime] = None,
    format: str = "csv",  # csv, xlsx, json
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user),
) -> Any:
    """
    Export analytics data in various formats.
    """
    if not from_date:
        from_date = datetime.now() - timedelta(days=30)
    
    if not to_date:
        to_date = datetime.now()
    
    if format not in ["csv", "xlsx", "json"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported format: {format}. Supported formats: csv, xlsx, json"
        )
    
    export_url = export_analytics(
        db, 
        user_id=current_user.id,
        platform_id=platform_id,
        from_date=from_date,
        to_date=to_date,
        format=format
    )
    return {"download_url": export_url}
