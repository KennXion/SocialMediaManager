"""
Main API router that includes all endpoint routers.
"""
from fastapi import APIRouter

from app.api.api_v1.endpoints import (
    auth,
    users,
    platforms,
    posts,
    schedules,
    analytics,
    ai
)

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(platforms.router, prefix="/platforms", tags=["Platforms"])
api_router.include_router(posts.router, prefix="/posts", tags=["Posts"])
api_router.include_router(schedules.router, prefix="/schedules", tags=["Schedules"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])
api_router.include_router(ai.router, prefix="/ai", tags=["AI"])
