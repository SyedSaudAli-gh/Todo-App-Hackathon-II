"""
Todo SQLModel for persistent storage in Neon PostgreSQL.

Supports:
- User Story 1 (P1): Create and View Todos
- User Story 2 (P2): Mark Todos Complete
- User Story 3 (P3): Update Todo Details
- User Story 4 (P4): Delete Todos
"""
from datetime import datetime
from typing import Optional
from sqlmodel import Field, SQLModel


class Todo(SQLModel, table=True):
    """
    Todo entity for persistent storage.

    Attributes:
        id: Unique identifier (auto-increment)
        user_id: User identifier from Better Auth (required for multi-user support)
        title: Todo title (required, 1-200 characters)
        description: Todo description (optional, max 2000 characters)
        completed: Completion status (default: False)
        created_at: Creation timestamp (UTC)
        updated_at: Last update timestamp (UTC)
    """
    __tablename__ = "todos"

    # Primary Key
    id: Optional[int] = Field(default=None, primary_key=True)

    # User Association (required for multi-user support)
    user_id: str = Field(
        description="User identifier from Better Auth",
        index=True
    )

    # Required Fields
    title: str = Field(
        min_length=1,
        max_length=200,
        description="Todo title (required, 1-200 characters)"
    )

    # Optional Fields
    description: Optional[str] = Field(
        default=None,
        max_length=2000,
        description="Todo description (optional, max 2000 characters)"
    )

    # Status
    completed: bool = Field(
        default=False,
        description="Completion status (true = completed, false = active)"
    )

    # Timestamps
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        description="Creation timestamp (UTC)"
    )

    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        description="Last update timestamp (UTC)"
    )
