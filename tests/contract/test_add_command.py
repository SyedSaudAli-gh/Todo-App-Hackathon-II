"""
Contract tests for the add command.

Tests the add command interface according to the specified contract:
- Command: `add "description text"`
- Input: Single string argument containing the todo description
- Success Response: Confirmation message "Added: [description]"
- Error Responses:
  - "Error: Description cannot be empty" (if description is empty)
  - "Error: Invalid command format" (if no description provided)
"""

import unittest
from io import StringIO
import sys
from unittest.mock import patch
from src.services.todo_manager import TodoManager
from src.cli.cli_interface import CLIInterface


class TestAddCommandContract(unittest.TestCase):
    """Contract tests for the add command."""

    def setUp(self):
        """Set up test fixtures."""
        self.todo_manager = TodoManager()
        self.cli = CLIInterface(self.todo_manager)

    def test_add_command_with_valid_description(self):
        """Test add command with a valid description."""
        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_add(["Buy groceries"])

            # Check that the success message is printed
            output = fake_out.getvalue().strip()
            self.assertEqual(output, "Added: Buy groceries")

        # Verify the item was actually added
        self.assertEqual(len(self.todo_manager.get_all_items()), 1)
        self.assertEqual(self.todo_manager.get_all_items()[0].description, "Buy groceries")

    def test_add_command_with_empty_description(self):
        """Test add command with an empty description."""
        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_add([""])

            # Check that the error message is printed
            output = fake_out.getvalue().strip()
            self.assertEqual(output, "Error: Description cannot be empty")

        # Verify no item was added
        self.assertEqual(len(self.todo_manager.get_all_items()), 0)

    def test_add_command_with_whitespace_only_description(self):
        """Test add command with a whitespace-only description."""
        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_add(["   "])

            # Check that the error message is printed
            output = fake_out.getvalue().strip()
            self.assertEqual(output, "Error: Description cannot be empty")

        # Verify no item was added
        self.assertEqual(len(self.todo_manager.get_all_items()), 0)

    def test_add_command_with_multiple_words(self):
        """Test add command with a multi-word description."""
        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_add(["Buy", "groceries", "and", "milk"])

            # Check that the success message is printed with the full description
            output = fake_out.getvalue().strip()
            self.assertEqual(output, "Added: Buy groceries and milk")

        # Verify the item was actually added with the full description
        self.assertEqual(len(self.todo_manager.get_all_items()), 1)
        self.assertEqual(self.todo_manager.get_all_items()[0].description, "Buy groceries and milk")

    def test_add_command_with_special_characters(self):
        """Test add command with special characters in description."""
        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_add(["Buy", "groceries", "&", "milk!"])

            # Check that the success message is printed
            output = fake_out.getvalue().strip()
            self.assertEqual(output, "Added: Buy groceries & milk!")

        # Verify the item was actually added
        self.assertEqual(len(self.todo_manager.get_all_items()), 1)
        self.assertEqual(self.todo_manager.get_all_items()[0].description, "Buy groceries & milk!")


if __name__ == "__main__":
    unittest.main()