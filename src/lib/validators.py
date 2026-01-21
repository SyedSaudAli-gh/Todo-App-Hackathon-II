"""
Validation utilities for the Todo App.

This module provides validation functions for input validation and error handling.
"""

from typing import List, Union

# Add the src directory to sys.path if not already there
import sys
import os
src_dir = os.path.dirname(os.path.dirname(__file__))
if src_dir not in sys.path:
    sys.path.insert(0, src_dir)

from models.todo_item import TodoItem


def validate_description(description: str) -> tuple[bool, str]:
    """
    Validate a todo item description.

    Args:
        description (str): The description to validate

    Returns:
        tuple[bool, str]: (is_valid, error_message)
    """
    if not description or not description.strip():
        return False, "Description cannot be empty"

    # Check for very long descriptions (optional validation)
    if len(description) > 1000:  # Arbitrary limit
        return False, "Description is too long"

    return True, ""


def validate_position(position: str, todo_list: List[TodoItem]) -> tuple[bool, str, int]:
    """
    Validate a position in the todo list.

    Args:
        position (str): The position string to validate
        todo_list (List[TodoItem]): The list of todo items to validate against

    Returns:
        tuple[bool, str, int]: (is_valid, error_message, position_int)
    """
    try:
        pos = int(position)
    except ValueError:
        return False, "Position must be a number", 0

    if pos < 1 or pos > len(todo_list):
        return False, f"Invalid position: {pos}. Position must be between 1 and {len(todo_list)}", 0

    return True, "", pos


def validate_todo_exists(todo_list: List[TodoItem], position: int) -> tuple[bool, str, TodoItem]:
    """
    Validate that a todo item exists at the given position.

    Args:
        todo_list (List[TodoItem]): The list of todo items
        position (int): The 1-based position to check

    Returns:
        tuple[bool, str, TodoItem]: (exists, error_message, todo_item)
    """
    if not todo_list or position < 1 or position > len(todo_list):
        return False, f"Invalid position: {position}. Position must be between 1 and {len(todo_list)}", None

    return True, "", todo_list[position - 1]


def validate_new_description(new_description: str) -> tuple[bool, str]:
    """
    Validate a new description for updating a todo item.

    Args:
        new_description (str): The new description to validate

    Returns:
        tuple[bool, str]: (is_valid, error_message)
    """
    return validate_description(new_description)


def validate_command_format(args: List[str], expected_count: int, command_name: str) -> tuple[bool, str]:
    """
    Validate that the correct number of arguments were provided for a command.

    Args:
        args (List[str]): The command arguments
        expected_count (int): The expected number of arguments
        command_name (str): The name of the command for error messages

    Returns:
        tuple[bool, str]: (is_valid, error_message)
    """
    if len(args) != expected_count:
        return False, f"Invalid command format for '{command_name}'. Expected {expected_count} argument(s), got {len(args)}"

    return True, ""


def validate_command_format_min(args: List[str], min_count: int, command_name: str) -> tuple[bool, str]:
    """
    Validate that at least the minimum number of arguments were provided for a command.

    Args:
        args (List[str]): The command arguments
        min_count (int): The minimum number of arguments
        command_name (str): The name of the command for error messages

    Returns:
        tuple[bool, str]: (is_valid, error_message)
    """
    if len(args) < min_count:
        return False, f"Invalid command format for '{command_name}'. Expected at least {min_count} argument(s), got {len(args)}"

    return True, ""