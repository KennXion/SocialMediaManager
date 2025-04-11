"""
Social media platform management endpoints.
"""
from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.user import User as UserModel
from app.models.platform import Platform as PlatformModel
from app.schemas.platform import (
    Platform,
    PlatformCreate,
    PlatformUpdate,
    PlatformCredentials,
    PlatformWithStats
)
from app.services.auth import get_current_active_user
from app.services.platform import (
    get_platform,
    get_platforms_by_user,
    create_platform,
    update_platform,
    delete_platform,
    verify_platform_credentials,
    get_platform_stats
)

router = APIRouter()


@router.get("", response_model=List[Platform])
def read_platforms(
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user),
) -> Any:
    """
    Get all platforms for current user.
    """
    platforms = get_platforms_by_user(db, user_id=current_user.id)
    return platforms


@router.post("", response_model=Platform)
def create_user_platform(
    platform_in: PlatformCreate,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user),
) -> Any:
    """
    Create new platform for current user.
    """
    platform = create_platform(db, obj_in=platform_in, user_id=current_user.id)
    return platform


@router.get("/{platform_id}", response_model=Platform)
def read_platform(
    platform_id: int,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user),
) -> Any:
    """
    Get platform by ID.
    """
    platform = get_platform(db, id=platform_id)
    if not platform:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Platform not found"
        )
    
    # Check if user has access to this platform
    if platform.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    return platform


@router.put("/{platform_id}", response_model=Platform)
def update_user_platform(
    platform_id: int,
    platform_in: PlatformUpdate,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user),
) -> Any:
    """
    Update platform.
    """
    platform = get_platform(db, id=platform_id)
    if not platform:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Platform not found"
        )
    
    # Check if user has access to this platform
    if platform.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    platform = update_platform(db, db_obj=platform, obj_in=platform_in)
    return platform


@router.delete("/{platform_id}", response_model=Platform)
def delete_user_platform(
    platform_id: int,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user),
) -> Any:
    """
    Delete platform.
    """
    platform = get_platform(db, id=platform_id)
    if not platform:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Platform not found"
        )
    
    # Check if user has access to this platform
    if platform.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    platform = delete_platform(db, id=platform_id)
    return platform


@router.post("/{platform_id}/verify", response_model=dict)
def verify_credentials(
    platform_id: int,
    credentials: PlatformCredentials,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user),
) -> Any:
    """
    Verify platform credentials.
    """
    platform = get_platform(db, id=platform_id)
    if not platform:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Platform not found"
        )
    
    # Check if user has access to this platform
    if platform.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    result = verify_platform_credentials(platform.type, credentials.dict())
    return {"valid": result, "message": "Credentials verification successful" if result else "Invalid credentials"}


@router.get("/{platform_id}/stats", response_model=PlatformWithStats)
def platform_stats(
    platform_id: int,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user),
) -> Any:
    """
    Get platform statistics.
    """
    platform = get_platform(db, id=platform_id)
    if not platform:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Platform not found"
        )
    
    # Check if user has access to this platform
    if platform.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    stats = get_platform_stats(db, platform)
    return stats
