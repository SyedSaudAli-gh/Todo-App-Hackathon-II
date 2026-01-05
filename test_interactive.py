#!/usr/bin/env python3
"""
Test script to verify the interactive CLI functionality works correctly.
"""

import sys
import os
# Add the src directory to the path so we can import modules
sys.path.insert(0, 'src')

from cli.cli_interface import CLIInterface
from services.todo_manager import TodoManager


def test_interactive_cli():
    """Test the CLI interface with interactive-style inputs."""
    print("Testing interactive CLI functionality...")

    # Initialize the todo manager and CLI interface
    todo_manager = TodoManager()
    cli = CLIInterface(todo_manager)

    print("\n1. Testing add functionality:")
    cli.handle_add(["Buy groceries"])
    cli.handle_add(["Walk the dog"])
    cli.handle_add(["Do laundry"])

    print("\n2. Testing list functionality:")
    cli.handle_list([])

    print("\n3. Testing complete functionality:")
    cli.handle_complete(["1"])

    print("\n4. Testing list again to see completion:")
    cli.handle_list([])

    print("\n5. Testing update functionality:")
    cli.handle_update(["2", "Walk the cat"])

    print("\n6. Testing list again to see update:")
    cli.handle_list([])

    print("\n7. Testing delete functionality:")
    cli.handle_delete(["3"])

    print("\n8. Testing final list:")
    cli.handle_list([])

    print("\n9. Testing help functionality:")
    cli.handle_help()

    print("\nAll interactive CLI functionality tests passed!")


if __name__ == "__main__":
    test_interactive_cli()