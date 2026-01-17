"""
Users router for user-related endpoints.

This module provides endpoints for user information and statistics,
including authenticated user statistics retrieval.
"""
import logging
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlmodel import Session
from src.database import get_session
from src.middleware.auth import get_current_user
from src.services.stats_service import get_user_stats
from src.schemas.user_stats import UserStatsResponse

# Configure logger
logger = logging.getLogger(__name__)

router = APIRouter()


@router.get(
    "/users/me/stats",
    response_model=UserStatsResponse,
    summary="Get Current User Statistics",
    description="""
    Retrieve aggregated activity statistics for the authenticated user.

    Statistics include:
    - Total tasks created
    - Completed tasks count
    - Completion rate percentage
    - Active days since account creation

    All statistics are calculated in real-time from the database.

    **Authentication Required**: This endpoint requires a valid Better Auth session cookie.
    """,
    responses={
        200: {
            "description": "Successfully retrieved user statistics",
            "content": {
                "application/json": {
                    "examples": {
                        "zero_todos": {
                            "summary": "User with no todos",
                            "value": {
                                "total_tasks": 0,
                                "completed_tasks": 0,
                                "completion_rate": 0.0,
                                "active_days": 1
                            }
                        },
                        "partial_completion": {
                            "summary": "User with partial completion",
                            "value": {
                                "total_tasks": 10,
                                "completed_tasks": 7,
                                "completion_rate": 70.0,
                                "active_days": 15
                            }
                        },
                        "full_completion": {
                            "summary": "User with all todos completed",
                            "value": {
                                "total_tasks": 5,
                                "completed_tasks": 5,
                                "completion_rate": 100.0,
                                "active_days": 30
                            }
                        }
                    }
                }
            }
        },
        401: {
            "description": "Not authenticated - missing or invalid session cookie",
            "content": {
                "application/json": {
                    "example": {"detail": "Not authenticated"}
                }
            }
        },
        500: {
            "description": "Internal server error - failed to calculate statistics",
            "content": {
                "application/json": {
                    "example": {"detail": "Failed to calculate statistics"}
                }
            }
        }
    },
    tags=["users"]
)
async def get_current_user_stats(
    request: Request,
    session: Session = Depends(get_session),
    user_info: dict = Depends(get_current_user)
) -> UserStatsResponse:
    """
    Get statistics for the authenticated user.

    Args:
        request: FastAPI request object
        session: Database session (injected)
        user_info: Authenticated user information (injected)

    Returns:
        UserStatsResponse: User activity statistics

    Raises:
        HTTPException: 401 if not authenticated, 500 if calculation fails
    """
    try:
        # Extract user information from auth dependency
        user_id = user_info["user_id"]
        user_created_at = user_info["created_at"]

        # Calculate statistics using stats service
        stats = get_user_stats(session, user_id, user_created_at)

        # Return response
        return UserStatsResponse(**stats)

    except Exception as e:
        # Log error for debugging
        logger.error(f"Error calculating user statistics: {str(e)}")

        # Return 500 error with generic message
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to calculate statistics"
        )
