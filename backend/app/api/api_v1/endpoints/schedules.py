"""
Post scheduling endpoints.
"""
from typing import Any, List, Optional
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.user import User as UserModel
from app.schemas.schedule import (
    Schedule,
    ScheduleCreate,
    ScheduleUpdate,
    ScheduleWithPostDetails
)
from app.services.auth import get_current_active_user
from app.services.schedule import (
    get_schedule,
    get_schedules_by_user,
    create_schedule,
    update_schedule,
    delete_schedule,
    get_upcoming_schedules
)

router = APIRouter()


@router.get("", response_model=List[ScheduleWithPostDetails])
def read_schedules(
    skip: int = 0,
    limit: int = 100,
    platform_id: Optional[int] = None,
    status: Optional[str] = None,
    from_date: Optional[datetime] = None,
    to_date: Optional[datetime] = None,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user),
) -> Any:
    """
    Get all schedules for current user with filtering options.
    """
    schedules = get_schedules_by_user(
        db, 
        user_id=current_user.id, 
        skip=skip, 
        limit=limit,
        platform_id=platform_id,
        status=status,
        from_date=from_date,
        to_date=to_date
    )
    return schedules


@router.post("", response_model=Schedule)
def create_user_schedule(
    schedule_in: ScheduleCreate,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user),
) -> Any:
    """
    Create a new schedule.
    """
    schedule = create_schedule(db, obj_in=schedule_in, user_id=current_user.id)
    return schedule


@router.get("/upcoming", response_model=List[ScheduleWithPostDetails])
def upcoming_schedules(
    days: int = 7,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user),
) -> Any:
    """
    Get upcoming schedules for the next specified days.
    """
    schedules = get_upcoming_schedules(db, user_id=current_user.id, days=days)
    return schedules


@router.get("/{schedule_id}", response_model=ScheduleWithPostDetails)
def read_schedule(
    schedule_id: int,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user),
) -> Any:
    """
    Get schedule by ID.
    """
    schedule = get_schedule(db, id=schedule_id)
    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Schedule not found"
        )
    
    # Check if user has access to this schedule
    if schedule.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    return schedule


@router.put("/{schedule_id}", response_model=Schedule)
def update_user_schedule(
    schedule_id: int,
    schedule_in: ScheduleUpdate,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user),
) -> Any:
    """
    Update schedule.
    """
    schedule = get_schedule(db, id=schedule_id)
    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Schedule not found"
        )
    
    # Check if user has access to this schedule
    if schedule.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    # Check if schedule is already completed
    if schedule.status == "completed":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot update a completed schedule"
        )
    
    schedule = update_schedule(db, db_obj=schedule, obj_in=schedule_in)
    return schedule


@router.delete("/{schedule_id}", response_model=Schedule)
def delete_user_schedule(
    schedule_id: int,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user),
) -> Any:
    """
    Delete schedule.
    """
    schedule = get_schedule(db, id=schedule_id)
    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Schedule not found"
        )
    
    # Check if user has access to this schedule
    if schedule.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    # Check if schedule is already completed
    if schedule.status == "completed":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete a completed schedule"
        )
    
    schedule = delete_schedule(db, id=schedule_id)
    return schedule
