"""
Social media post management endpoints.
"""
from typing import Any, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.user import User as UserModel
from app.schemas.post import (
    Post,
    PostCreate,
    PostUpdate,
    PostWithPlatformDetails
)
from app.services.auth import get_current_active_user
from app.services.post import (
    get_post,
    get_posts_by_user,
    create_post,
    update_post,
    delete_post,
    publish_post,
    get_post_analytics
)

router = APIRouter()


@router.get("", response_model=List[PostWithPlatformDetails])
def read_posts(
    skip: int = 0,
    limit: int = 100,
    platform_id: Optional[int] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user),
) -> Any:
    """
    Get all posts for current user with filtering options.
    """
    posts = get_posts_by_user(
        db, 
        user_id=current_user.id, 
        skip=skip, 
        limit=limit,
        platform_id=platform_id,
        status=status
    )
    return posts


@router.post("", response_model=Post)
def create_user_post(
    post_in: PostCreate,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user),
) -> Any:
    """
    Create a new post.
    """
    post = create_post(db, obj_in=post_in, user_id=current_user.id)
    return post


@router.get("/{post_id}", response_model=PostWithPlatformDetails)
def read_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user),
) -> Any:
    """
    Get post by ID.
    """
    post = get_post(db, id=post_id)
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    # Check if user has access to this post
    if post.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    return post


@router.put("/{post_id}", response_model=Post)
def update_user_post(
    post_id: int,
    post_in: PostUpdate,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user),
) -> Any:
    """
    Update post.
    """
    post = get_post(db, id=post_id)
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    # Check if user has access to this post
    if post.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    # Check if post is already published
    if post.status == "published":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot update a published post"
        )
    
    post = update_post(db, db_obj=post, obj_in=post_in)
    return post


@router.delete("/{post_id}", response_model=Post)
def delete_user_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user),
) -> Any:
    """
    Delete post.
    """
    post = get_post(db, id=post_id)
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    # Check if user has access to this post
    if post.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    # Check if post is already published
    if post.status == "published":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete a published post"
        )
    
    post = delete_post(db, id=post_id)
    return post


@router.post("/{post_id}/publish", response_model=Post)
def publish_user_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user),
) -> Any:
    """
    Publish a post immediately.
    """
    post = get_post(db, id=post_id)
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    # Check if user has access to this post
    if post.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    # Check if post is already published
    if post.status == "published":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Post is already published"
        )
    
    post = publish_post(db, post)
    return post


@router.get("/{post_id}/analytics", response_model=dict)
def get_post_metrics(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user),
) -> Any:
    """
    Get analytics for a specific post.
    """
    post = get_post(db, id=post_id)
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    # Check if user has access to this post
    if post.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    # Check if post is published
    if post.status != "published":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot get analytics for an unpublished post"
        )
    
    analytics = get_post_analytics(db, post)
    return analytics
