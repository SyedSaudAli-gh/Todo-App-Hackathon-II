"""
Contract tests for the delete command.

Tests the delete command interface according to the specified contract:
- Command: `delete [position]`
- Input: Single integer argument (1-based position in list)
- Success Response: Confirmation message "Deleted: [description]"
- Error Responses:
  - "Error: Invalid position" (if position is out of range)
  - "Error: Invalid command format" (if no position provided)
"""

import unittest
from io import StringIO
from unittest.mock import patch
from src.services.todo_manager import TodoManager
from src.cli.cli_interface import CLIInterface


class TestDeleteCommandContract(unittest.TestCase):
    """Contract tests for the delete command."""

    def setUp(self):
        """Set up test fixtures."""
        self.todo_manager = TodoManager()
        self.cli = CLIInterface(self.todo_manager)

    def test_delete_command_with_valid_position(self):
        """Test delete command with a valid position."""
        # Add an item first
        self.todo_manager.add_item("Buy groceries")

        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_delete(["1"])

            # Check that the success message is printed
            output = fake_out.getvalue().strip()
            self.assertEqual(output, "Deleted: Buy groceries")

        # Verify the item was deleted
        todos = self.todo_manager.get_all_items()
        self.assertEqual(len(todos), 0)

    def test_delete_command_with_multiple_items(self):
        """Test delete command with a valid position in a list with multiple items."""
        # Add multiple items
        self.todo_manager.add_item("Buy groceries")
        self.todo_manager.add_item("Walk the dog")
        self.todo_manager.add_item("Do laundry")

        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_delete(["2"])

            # Check that the success message is printed for the correct item
            output = fake_out.getvalue().strip()
            self.assertEqual(output, "Deleted: Walk the dog")

        # Verify the correct item was deleted
        todos = self.todo_manager.get_all_items()
        self.assertEqual(len(todos), 2)
        self.assertEqual(todos[0].description, "Buy groceries")  # First item should remain
        self.assertEqual(todos[1].description, "Do laundry")    # Third item should now be at position 2

    def test_delete_command_with_invalid_position_low(self):
        """Test delete command with a position that is too low."""
        # Add an item first
        self.todo_manager.add_item("Buy groceries")

        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_delete(["0"])

            # Check that the error message is printed
            output = fake_out.getvalue().strip()
            self.assertIn("Invalid position", output)

        # Verify the item still exists
        todos = self.todo_manager.get_all_items()
        self.assertEqual(len(todos), 1)
        self.assertEqual(todos[0].description, "Buy groceries")

    def test_delete_command_with_invalid_position_high(self):
        """Test delete command with a position that is too high."""
        # Add an item first
        self.todo_manager.add_item("Buy groceries")

        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_delete(["5"])

            # Check that the error message is printed
            output = fake_out.getvalue().strip()
            self.assertIn("Invalid position", output)

        # Verify the item still exists
        todos = self.todo_manager.get_all_items()
        self.assertEqual(len(todos), 1)
        self.assertEqual(todos[0].description, "Buy groceries")

    def test_delete_command_with_no_items(self):
        """Test delete command when there are no items."""
        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_delete(["1"])

            # Check that the error message is printed
            output = fake_out.getvalue().strip()
            self.assertIn("Invalid position", output)

    def test_delete_command_with_invalid_format_no_args(self):
        """Test delete command with no arguments."""
        # Add an item first
        self.todo_manager.add_item("Buy groceries")

        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_delete([])

            # Check that the error message is printed
            output = fake_out.getvalue().strip()
            self.assertIn("Invalid command format", output)

        # Verify the item still exists
        todos = self.todo_manager.get_all_items()
        self.assertEqual(len(todos), 1)
        self.assertEqual(todos[0].description, "Buy groceries")

    def test_delete_command_with_invalid_format_multiple_args(self):
        """Test delete command with multiple arguments."""
        # Add an item first
        self.todo_manager.add_item("Buy groceries")

        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_delete(["1", "extra", "arg"])

            # Check that the error message is printed
            output = fake_out.getvalue().strip()
            self.assertIn("Invalid command format", output)

        # Verify the item still exists
        todos = self.todo_manager.get_all_items()
        self.assertEqual(len(todos), 1)
        self.assertEqual(todos[0].description, "Buy groceries")

    def test_delete_command_with_non_numeric_position(self):
        """Test delete command with a non-numeric position."""
        # Add an item first
        self.todo_manager.add_item("Buy groceries")

        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_delete(["abc"])

            # Check that the error message is printed
            output = fake_out.getvalue().strip()
            self.assertIn("Position must be a number", output)

        # Verify the item still exists
        todos = self.todo_manager.get_all_items()
        self.assertEqual(len(todos), 1)
        self.assertEqual(todos[0].description, "Buy groceries")


if __name__ == "__main__":
    unittest.main()