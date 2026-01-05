"""
Todo Manager Service

Core business logic for todo operations including add, list, complete, delete, and update.
All data is stored in memory only.
"""

from typing import List, Optional, Tuple

# Add the src directory to sys.path if not already there
import sys
import os
src_dir = os.path.dirname(os.path.dirname(__file__))
if src_dir not in sys.path:
    sys.path.insert(0, src_dir)

from models.todo_item import TodoItem
from lib.validators import validate_description


class TodoManager:
    """Manages the collection of todo items in memory."""

    def __init__(self):
        """Initialize the TodoManager with an empty list of todos."""
        self.todos: List[TodoItem] = []
        self._next_id = 1

    def add_item(self, description: str) -> Tuple[bool, str, Optional[TodoItem]]:
        """
        Add a new todo item to the collection.

        Args:
            description (str): The description of the todo item

        Returns:
            Tuple[bool, str, Optional[TodoItem]]: (success, message, todo_item if successful)
        """
        is_valid, error_msg = validate_description(description)
        if not is_valid:
            return False, error_msg, None

        # Create a new todo item
        new_item = TodoItem(
            description=description.strip(),
            item_id=self._next_id
        )
        self.todos.append(new_item)
        self._next_id += 1

        return True, f"Added: {new_item.description}", new_item

    def get_all_items(self) -> List[TodoItem]:
        """
        Get all todo items in the collection.

        Returns:
            List[TodoItem]: List of all todo items
        """
        return self.todos.copy()

    def mark_complete(self, position: int) -> Tuple[bool, str, Optional[TodoItem]]:
        """
        Mark a todo item as complete by its position in the list.

        Args:
            position (int): 1-based position of the item to mark complete

        Returns:
            Tuple[bool, str, Optional[TodoItem]]: (success, message, todo_item if successful)
        """
        if position < 1 or position > len(self.todos):
            return False, f"Invalid position: {position}. Position must be between 1 and {len(self.todos)}", None

        item = self.todos[position - 1]
        item.completed = True

        return True, f"Marked as complete: {item.description}", item

    def delete_item(self, position: int) -> Tuple[bool, str, Optional[TodoItem]]:
        """
        Delete a todo item by its position in the list.

        Args:
            position (int): 1-based position of the item to delete

        Returns:
            Tuple[bool, str, Optional[TodoItem]]: (success, message, deleted_todo_item if successful)
        """
        if position < 1 or position > len(self.todos):
            return False, f"Invalid position: {position}. Position must be between 1 and {len(self.todos)}", None

        deleted_item = self.todos.pop(position - 1)

        # Renumber remaining items to maintain consistent positions
        # Note: This is a simple approach; alternatively, we could keep positions as-is
        # For now, we'll just return the deleted item without renumbering

        return True, f"Deleted: {deleted_item.description}", deleted_item

    def update_item(self, position: int, new_description: str) -> Tuple[bool, str, Optional[TodoItem]]:
        """
        Update the description of a todo item by its position in the list.

        Args:
            position (int): 1-based position of the item to update
            new_description (str): The new description for the item

        Returns:
            Tuple[bool, str, Optional[TodoItem]]: (success, message, updated_todo_item if successful)
        """
        if position < 1 or position > len(self.todos):
            return False, f"Invalid position: {position}. Position must be between 1 and {len(self.todos)}", None

        is_valid, error_msg = validate_description(new_description)
        if not is_valid:
            return False, error_msg, None

        item = self.todos[position - 1]
        old_description = item.description
        item.description = new_description.strip()

        return True, f"Updated: {old_description} -> {item.description}", item

    def get_item_count(self) -> int:
        """
        Get the total number of todo items.

        Returns:
            int: Number of todo items in the collection
        """
        return len(self.todos)

    def get_completed_count(self) -> int:
        """
        Get the number of completed todo items.

        Returns:
            int: Number of completed todo items
        """
        return sum(1 for todo in self.todos if todo.completed)

    def get_pending_count(self) -> int:
        """
        Get the number of pending todo items.

        Returns:
            int: Number of pending todo items
        """
        return len(self.todos) - self.get_completed_count()