"""
TodoItem Model

Represents a single todo task with properties: id, description text, completion status, creation timestamp.
All data is stored in memory only.
"""

from datetime import datetime
from typing import Optional


class TodoItem:
    """Represents a single todo task in memory."""

    def __init__(self, description: str, item_id: Optional[int] = None, completed: bool = False, created_at: Optional[datetime] = None):
        """
        Initialize a TodoItem.

        Args:
            description (str): The text description of the todo item
            item_id (int, optional): Unique identifier for the item; auto-generated if not provided
            completed (bool): Completion status; defaults to False
            created_at (datetime, optional): Timestamp when item was created; defaults to now
        """
        self.id = item_id
        self.description = description
        self.completed = completed
        self.created_at = created_at or datetime.now()

    def __str__(self) -> str:
        """Return a string representation of the todo item."""
        status = "x" if self.completed else " "
        return f"[{status}] {self.description}"

    def __repr__(self) -> str:
        """Return a detailed string representation of the todo item."""
        return f"TodoItem(id={self.id}, description='{self.description}', completed={self.completed}, created_at={self.created_at})"

    def to_dict(self) -> dict:
        """Convert the TodoItem to a dictionary representation."""
        return {
            "id": self.id,
            "description": self.description,
            "completed": self.completed,
            "created_at": self.created_at.isoformat()
        }

    @classmethod
    def from_dict(cls, data: dict):
        """Create a TodoItem from a dictionary representation."""
        created_at = datetime.fromisoformat(data["created_at"])
        return cls(
            description=data["description"],
            item_id=data["id"],
            completed=data["completed"],
            created_at=created_at
        )