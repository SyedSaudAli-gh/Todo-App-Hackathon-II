"""
Statistics service for calculating user activity metrics.

This module provides functions to calculate user statistics including:
- Total tasks created
- Completed tasks count
- Completion rate percentage
- Active days since account creation
"""
import logging
from datetime import datetime, timezone
from typing import Dict
from sqlmodel import Session, select, func, case
from models.todo import Todo

# Configure logger
logger = logging.getLogger(__name__)


def calculate_total_tasks(session: Session, user_id: str) -> int:
    """
    Calculate total number of todos created by user.

    Args:
        session: Database session
        user_id: User identifier from Better Auth

    Returns:
        int: Total count of todos for user
    """
    stmt = select(func.count(Todo.id)).where(Todo.user_id == user_id)
    result = session.exec(stmt).one()
    return result or 0


def calculate_completed_tasks(session: Session, user_id: str) -> int:
    """
    Calculate number of completed todos for user.

    Args:
        session: Database session
        user_id: User identifier from Better Auth

    Returns:
        int: Count of completed todos for user
    """
    stmt = select(func.count(Todo.id)).where(
        Todo.user_id == user_id,
        Todo.completed == True
    )
    result = session.exec(stmt).one()
    return result or 0


def calculate_completion_rate(total: int, completed: int) -> float:
    """
    Calculate completion rate percentage with division by zero handling.

    Args:
        total: Total number of tasks
        completed: Number of completed tasks

    Returns:
        float: Completion rate percentage (0.0-100.0)
    """
    if total == 0:
        return 0.0

    rate = (completed / total) * 100
    return round(rate, 1)


def calculate_active_days(session: Session, user_id: str, user_created_at: str = None) -> int:
    """
    Calculate number of days since user account creation (inclusive).

    If user_created_at is not provided, calculates from the earliest todo creation date.

    Args:
        session: Database session
        user_id: User identifier from Better Auth
        user_created_at: User creation timestamp (ISO format from Better Auth), optional

    Returns:
        int: Number of active days (minimum 1 for today)
    """
    try:
        # If user_created_at is provided, use it
        if user_created_at:
            created_at_dt = datetime.fromisoformat(user_created_at.replace('Z', '+00:00'))
        else:
            # Fallback: use earliest todo creation date
            stmt = select(func.min(Todo.created_at)).where(Todo.user_id == user_id)
            earliest_todo = session.exec(stmt).one()

            if earliest_todo:
                created_at_dt = earliest_todo
            else:
                # No todos yet, return 1 (today)
                return 1

        # Ensure timezone-aware datetime
        if created_at_dt.tzinfo is None:
            created_at_dt = created_at_dt.replace(tzinfo=timezone.utc)

        # Calculate difference from now (UTC)
        now = datetime.now(timezone.utc)
        delta = now - created_at_dt

        # Inclusive counting: today = day 1
        active_days = delta.days + 1

        # Ensure minimum of 1 day
        return max(1, active_days)

    except (ValueError, AttributeError) as e:
        # If timestamp parsing fails, return 1 as safe default
        logger.warning(f"Failed to calculate active days: {str(e)}")
        return 1


def get_user_stats_optimized(session: Session, user_id: str, user_created_at: str = None) -> Dict[str, any]:
    """
    Calculate all user statistics using optimized single aggregation query.

    This function uses a single database query with conditional counting
    for better performance.

    Args:
        session: Database session
        user_id: User identifier from Better Auth
        user_created_at: User creation timestamp (ISO format)

    Returns:
        dict: User statistics with keys:
            - total_tasks: Total todos count
            - completed_tasks: Completed todos count
            - completion_rate: Completion percentage
            - active_days: Days since account creation

    Raises:
        Exception: If database query fails
    """
    try:
        logger.info(f"Calculating statistics for user (first 8 chars): {user_id[:8]}...")

        # Single aggregation query with conditional counting
        stmt = select(
            func.count(Todo.id).label("total_tasks"),
            func.sum(case((Todo.completed == True, 1), else_=0)).label("completed_tasks")
        ).where(Todo.user_id == user_id)

        result = session.exec(stmt).one()

        total_tasks = result.total_tasks or 0
        completed_tasks = result.completed_tasks or 0

        # Calculate completion rate
        completion_rate = calculate_completion_rate(total_tasks, completed_tasks)

        # Calculate active days
        active_days = calculate_active_days(session, user_id, user_created_at)

        logger.info(f"Statistics calculated successfully: total={total_tasks}, completed={completed_tasks}, rate={completion_rate}%, days={active_days}")

        return {
            "total_tasks": total_tasks,
            "completed_tasks": completed_tasks,
            "completion_rate": completion_rate,
            "active_days": active_days
        }

    except Exception as e:
        logger.error(f"Failed to calculate user statistics: {str(e)}")
        # Re-raise with context for error handling in endpoint
        raise Exception(f"Failed to calculate user statistics: {str(e)}")


def get_user_stats(session: Session, user_id: str, user_created_at: str = None) -> Dict[str, any]:
    """
    Calculate all user statistics (orchestration function).

    This is the main entry point for calculating user statistics.
    Uses optimized single query approach.

    Args:
        session: Database session
        user_id: User identifier from Better Auth
        user_created_at: User creation timestamp (ISO format)

    Returns:
        dict: User statistics with keys:
            - total_tasks: Total todos count
            - completed_tasks: Completed todos count
            - completion_rate: Completion percentage
            - active_days: Days since account creation

    Raises:
        Exception: If database query fails
    """
    return get_user_stats_optimized(session, user_id, user_created_at)
