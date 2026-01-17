"""
Todo Pydantic schemas for request/response validation.
"""
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field, field_validator


class TodoCreate(BaseModel):
    """Request schema for creating a new todo."""

    title: str = Field(
        min_length=1,
        max_length=200,
        description="Todo title (required)"
    )

    description: Optional[str] = Field(
        default=None,
        max_length=2000,
        description="Todo description (optional)"
    )

    @field_validator('title')
    @classmethod
    def title_must_not_be_empty(cls, v: str) -> str:
        """Validate that title is not empty or whitespace only."""
        if not v or not v.strip():
            raise ValueError('Title cannot be empty or whitespace only')
        return v.strip()

    @field_validator('description')
    @classmethod
    def description_strip_whitespace(cls, v: Optional[str]) -> Optional[str]:
        """Strip whitespace from description if provided."""
        if v:
            return v.strip() if v.strip() else None
        return None


class TodoUpdate(BaseModel):
    """Request schema for updating an existing todo."""

    title: Optional[str] = Field(
        default=None,
        min_length=1,
        max_length=200,
        description="Updated title (optional)"
    )

    description: Optional[str] = Field(
        default=None,
        max_length=2000,
        description="Updated description (optional)"
    )

    completed: Optional[bool] = Field(
        default=None,
        description="Updated completion status (optional)"
    )

    @field_validator('title')
    @classmethod
    def title_must_not_be_empty(cls, v: Optional[str]) -> Optional[str]:
        """Validate that title is not empty if provided."""
        if v is not None:
            if not v or not v.strip():
                raise ValueError('Title cannot be empty or whitespace only')
            return v.strip()
        return None


class TodoResponse(BaseModel):
    """Response schema for todo operations."""

    id: int
    title: str
    description: Optional[str]
    completed: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True  # Enable ORM mode for SQLModel compatibility


class TodoListResponse(BaseModel):
    """Response schema for listing todos."""

    todos: List[TodoResponse]
    total: int
