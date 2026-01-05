"""
CLI Interface Module

Handles command-line interface operations for the Todo application.
"""

from typing import List

# Add the src directory to sys.path if not already there
import sys
import os
src_dir = os.path.dirname(os.path.dirname(__file__))
if src_dir not in sys.path:
    sys.path.insert(0, src_dir)

from services.todo_manager import TodoManager
from lib.validators import (
    validate_description,
    validate_position,
    validate_todo_exists,
    validate_new_description,
    validate_command_format,
    validate_command_format_min
)


class CLIInterface:
    """Handles CLI commands for the Todo application."""

    def __init__(self, todo_manager: TodoManager):
        """
        Initialize the CLI interface.

        Args:
            todo_manager (TodoManager): The todo manager instance to use
        """
        self.todo_manager = todo_manager

    def handle_add(self, args: List[str]) -> None:
        """
        Handle the 'add' command.

        Args:
            args (List[str]): Command arguments (should contain description)
        """
        if not args:
            print("Error: Description cannot be empty")
            return

        # Join all arguments to form the description (to allow spaces in descriptions)
        description = " ".join(args)

        success, message, todo_item = self.todo_manager.add_item(description)
        if success:
            print(message)
        else:
            print(f"Error: {message}")

    def handle_list(self, args: List[str]) -> None:
        """
        Handle the 'list' command.

        Args:
            args (List[str]): Command arguments (should be empty)
        """
        # In interactive mode, we may or may not have empty args, so we'll proceed regardless
        todos = self.todo_manager.get_all_items()

        if not todos:
            print("No todo items found")
            return

        for i, todo in enumerate(todos, 1):
            status = "x" if todo.completed else " "
            print(f"{i}. [{status}] {todo.description}")

    def handle_complete(self, args: List[str]) -> None:
        """
        Handle the 'complete' command.

        Args:
            args (List[str]): Command arguments (should contain position)
        """
        if not args:
            print("Error: Position cannot be empty")
            return

        position_str = args[0]

        # Validate the position
        is_valid, error_msg, position = validate_position(position_str, self.todo_manager.get_all_items())
        if not is_valid:
            print(f"Error: {error_msg}")
            return

        success, message, todo_item = self.todo_manager.mark_complete(position)
        if success:
            print(message)
        else:
            print(f"Error: {message}")

    def handle_delete(self, args: List[str]) -> None:
        """
        Handle the 'delete' command.

        Args:
            args (List[str]): Command arguments (should contain position)
        """
        if not args:
            print("Error: Position cannot be empty")
            return

        position_str = args[0]

        # Validate the position
        is_valid, error_msg, position = validate_position(position_str, self.todo_manager.get_all_items())
        if not is_valid:
            print(f"Error: {error_msg}")
            return

        success, message, todo_item = self.todo_manager.delete_item(position)
        if success:
            print(message)
        else:
            print(f"Error: {message}")

    def handle_update(self, args: List[str]) -> None:
        """
        Handle the 'update' command.

        Args:
            args (List[str]): Command arguments (should contain position and new description)
        """
        if len(args) < 2:
            print("Error: Update command requires position and new description")
            return

        position_str = args[0]
        new_description = " ".join(args[1:])

        # Validate the position
        is_valid, error_msg, position = validate_position(position_str, self.todo_manager.get_all_items())
        if not is_valid:
            print(f"Error: {error_msg}")
            return

        success, message, todo_item = self.todo_manager.update_item(position, new_description)
        if success:
            print(message)
        else:
            print(f"Error: {message}")

    def handle_help(self) -> None:
        """Display help information for the interactive menu."""
        help_text = """
TODO APP - Interactive Menu Help

This application uses an interactive menu system. You will be presented with
a numbered menu where you can select options by entering the corresponding number.

Menu Options:
1. Add a new todo item - Add a new task to your todo list
2. List all todo items - View all tasks in your todo list
3. Mark a todo item as complete - Mark a task as completed
4. Delete a todo item - Remove a task from your todo list
5. Update a todo item - Change the description of an existing task
6. Show help - Display this help information
7. Exit - Quit the application

All operations work with numbered positions of your todo items.
For example, if you see "1. [ ] Buy groceries", then "Buy groceries" is at position 1.
        """
        print(help_text.strip())