"""
Pydantic schemas for user statistics API responses.

This module defines the response models for user statistics endpoints,
including validation rules and example data for OpenAPI documentation.
"""
from pydantic import BaseModel, Field


class UserStatsResponse(BaseModel):
    """
    Response model for user activity statistics.

    Attributes:
        total_tasks: Total number of todos created by user (>= 0)
        completed_tasks: Number of completed todos (>= 0)
        completion_rate: Completion percentage (0.0-100.0)
        active_days: Days since account creation (>= 1)
    """
    total_tasks: int = Field(
        ge=0,
        description="Total number of todos created by user"
    )
    completed_tasks: int = Field(
        ge=0,
        description="Number of todos marked as completed"
    )
    completion_rate: float = Field(
        ge=0.0,
        le=100.0,
        description="Completion rate percentage (0.0-100.0)"
    )
    active_days: int = Field(
        ge=1,
        description="Number of days since account creation (inclusive, minimum 1)"
    )

    class Config:
        """Pydantic model configuration."""
        json_schema_extra = {
            "examples": [
                {
                    "total_tasks": 0,
                    "completed_tasks": 0,
                    "completion_rate": 0.0,
                    "active_days": 1,
                    "description": "User with no todos"
                },
                {
                    "total_tasks": 10,
                    "completed_tasks": 7,
                    "completion_rate": 70.0,
                    "active_days": 15,
                    "description": "User with partial completion"
                },
                {
                    "total_tasks": 5,
                    "completed_tasks": 5,
                    "completion_rate": 100.0,
                    "active_days": 30,
                    "description": "User with all todos completed"
                }
            ]
        }
