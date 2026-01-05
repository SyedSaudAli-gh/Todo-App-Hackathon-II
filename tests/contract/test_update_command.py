"""
Contract tests for the update command.

Tests the update command interface according to the specified contract:
- Command: `update [position] "new description"`
- Input: Integer position (1-based) and string description
- Success Response: Confirmation message "Updated: [old description] -> [new description]"
- Error Responses:
  - "Error: Invalid position" (if position is out of range)
  - "Error: Description cannot be empty" (if new description is empty)
  - "Error: Invalid command format" (if arguments missing)
"""

import unittest
from io import StringIO
from unittest.mock import patch
from src.services.todo_manager import TodoManager
from src.cli.cli_interface import CLIInterface


class TestUpdateCommandContract(unittest.TestCase):
    """Contract tests for the update command."""

    def setUp(self):
        """Set up test fixtures."""
        self.todo_manager = TodoManager()
        self.cli = CLIInterface(self.todo_manager)

    def test_update_command_with_valid_position_and_description(self):
        """Test update command with a valid position and description."""
        # Add an item first
        self.todo_manager.add_item("Buy groceries")

        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_update(["1", "Buy", "organic", "groceries"])

            # Check that the success message is printed
            output = fake_out.getvalue().strip()
            self.assertEqual(output, "Updated: Buy groceries -> Buy organic groceries")

        # Verify the item was updated
        todos = self.todo_manager.get_all_items()
        self.assertEqual(len(todos), 1)
        self.assertEqual(todos[0].description, "Buy organic groceries")

    def test_update_command_with_multiple_items(self):
        """Test update command with a valid position in a list with multiple items."""
        # Add multiple items
        self.todo_manager.add_item("Buy groceries")
        self.todo_manager.add_item("Walk the dog")
        self.todo_manager.add_item("Do laundry")

        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_update(["2", "Walk", "the", "cat"])

            # Check that the success message is printed for the correct item
            output = fake_out.getvalue().strip()
            self.assertEqual(output, "Updated: Walk the dog -> Walk the cat")

        # Verify the correct item was updated
        todos = self.todo_manager.get_all_items()
        self.assertEqual(len(todos), 3)
        self.assertEqual(todos[0].description, "Buy groceries")  # First item should remain unchanged
        self.assertEqual(todos[1].description, "Walk the cat")   # Second item should be updated
        self.assertEqual(todos[2].description, "Do laundry")    # Third item should remain unchanged

    def test_update_command_with_invalid_position_low(self):
        """Test update command with a position that is too low."""
        # Add an item first
        self.todo_manager.add_item("Buy groceries")

        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_update(["0", "New", "description"])

            # Check that the error message is printed
            output = fake_out.getvalue().strip()
            self.assertIn("Invalid position", output)

        # Verify the item was not updated
        todos = self.todo_manager.get_all_items()
        self.assertEqual(len(todos), 1)
        self.assertEqual(todos[0].description, "Buy groceries")

    def test_update_command_with_invalid_position_high(self):
        """Test update command with a position that is too high."""
        # Add an item first
        self.todo_manager.add_item("Buy groceries")

        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_update(["5", "New", "description"])

            # Check that the error message is printed
            output = fake_out.getvalue().strip()
            self.assertIn("Invalid position", output)

        # Verify the item was not updated
        todos = self.todo_manager.get_all_items()
        self.assertEqual(len(todos), 1)
        self.assertEqual(todos[0].description, "Buy groceries")

    def test_update_command_with_no_items(self):
        """Test update command when there are no items."""
        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_update(["1", "New", "description"])

            # Check that the error message is printed
            output = fake_out.getvalue().strip()
            self.assertIn("Invalid position", output)

    def test_update_command_with_empty_description(self):
        """Test update command with an empty description."""
        # Add an item first
        self.todo_manager.add_item("Buy groceries")

        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_update(["1", ""])

            # Check that the error message is printed
            output = fake_out.getvalue().strip()
            self.assertIn("Description cannot be empty", output)

        # Verify the item was not updated
        todos = self.todo_manager.get_all_items()
        self.assertEqual(len(todos), 1)
        self.assertEqual(todos[0].description, "Buy groceries")

    def test_update_command_with_whitespace_only_description(self):
        """Test update command with a whitespace-only description."""
        # Add an item first
        self.todo_manager.add_item("Buy groceries")

        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_update(["1", "   "])

            # Check that the error message is printed
            output = fake_out.getvalue().strip()
            self.assertIn("Description cannot be empty", output)

        # Verify the item was not updated
        todos = self.todo_manager.get_all_items()
        self.assertEqual(len(todos), 1)
        self.assertEqual(todos[0].description, "Buy groceries")

    def test_update_command_with_invalid_format_no_args(self):
        """Test update command with no arguments."""
        # Add an item first
        self.todo_manager.add_item("Buy groceries")

        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_update([])

            # Check that the error message is printed
            output = fake_out.getvalue().strip()
            self.assertIn("Invalid command format", output)

        # Verify the item was not updated
        todos = self.todo_manager.get_all_items()
        self.assertEqual(len(todos), 1)
        self.assertEqual(todos[0].description, "Buy groceries")

    def test_update_command_with_invalid_format_one_arg(self):
        """Test update command with only one argument."""
        # Add an item first
        self.todo_manager.add_item("Buy groceries")

        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_update(["1"])

            # Check that the error message is printed
            output = fake_out.getvalue().strip()
            self.assertIn("Invalid command format", output)

        # Verify the item was not updated
        todos = self.todo_manager.get_all_items()
        self.assertEqual(len(todos), 1)
        self.assertEqual(todos[0].description, "Buy groceries")

    def test_update_command_with_non_numeric_position(self):
        """Test update command with a non-numeric position."""
        # Add an item first
        self.todo_manager.add_item("Buy groceries")

        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_update(["abc", "New", "description"])

            # Check that the error message is printed
            output = fake_out.getvalue().strip()
            self.assertIn("Position must be a number", output)

        # Verify the item was not updated
        todos = self.todo_manager.get_all_items()
        self.assertEqual(len(todos), 1)
        self.assertEqual(todos[0].description, "Buy groceries")


if __name__ == "__main__":
    unittest.main()