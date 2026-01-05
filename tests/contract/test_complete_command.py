"""
Contract tests for the complete command.

Tests the complete command interface according to the specified contract:
- Command: `complete [position]`
- Input: Single integer argument (1-based position in list)
- Success Response: Confirmation message "Marked as complete: [description]"
- Error Responses:
  - "Error: Invalid position" (if position is out of range)
  - "Error: Invalid command format" (if no position provided)
"""

import unittest
from io import StringIO
from unittest.mock import patch
from src.services.todo_manager import TodoManager
from src.cli.cli_interface import CLIInterface


class TestCompleteCommandContract(unittest.TestCase):
    """Contract tests for the complete command."""

    def setUp(self):
        """Set up test fixtures."""
        self.todo_manager = TodoManager()
        self.cli = CLIInterface(self.todo_manager)

    def test_complete_command_with_valid_position(self):
        """Test complete command with a valid position."""
        # Add an item first
        self.todo_manager.add_item("Buy groceries")

        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_complete(["1"])

            # Check that the success message is printed
            output = fake_out.getvalue().strip()
            self.assertEqual(output, "Marked as complete: Buy groceries")

        # Verify the item was marked as complete
        todos = self.todo_manager.get_all_items()
        self.assertEqual(len(todos), 1)
        self.assertTrue(todos[0].completed)

    def test_complete_command_with_multiple_items(self):
        """Test complete command with a valid position in a list with multiple items."""
        # Add multiple items
        self.todo_manager.add_item("Buy groceries")
        self.todo_manager.add_item("Walk the dog")
        self.todo_manager.add_item("Do laundry")

        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_complete(["2"])

            # Check that the success message is printed for the correct item
            output = fake_out.getvalue().strip()
            self.assertEqual(output, "Marked as complete: Walk the dog")

        # Verify the correct item was marked as complete
        todos = self.todo_manager.get_all_items()
        self.assertEqual(len(todos), 3)
        self.assertFalse(todos[0].completed)  # First item should still be incomplete
        self.assertTrue(todos[1].completed)   # Second item should be complete
        self.assertFalse(todos[2].completed)  # Third item should still be incomplete

    def test_complete_command_with_invalid_position_low(self):
        """Test complete command with a position that is too low."""
        # Add an item first
        self.todo_manager.add_item("Buy groceries")

        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_complete(["0"])

            # Check that the error message is printed
            output = fake_out.getvalue().strip()
            self.assertIn("Invalid position", output)

    def test_complete_command_with_invalid_position_high(self):
        """Test complete command with a position that is too high."""
        # Add an item first
        self.todo_manager.add_item("Buy groceries")

        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_complete(["5"])

            # Check that the error message is printed
            output = fake_out.getvalue().strip()
            self.assertIn("Invalid position", output)

    def test_complete_command_with_no_items(self):
        """Test complete command when there are no items."""
        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_complete(["1"])

            # Check that the error message is printed
            output = fake_out.getvalue().strip()
            self.assertIn("Invalid position", output)

    def test_complete_command_with_invalid_format_no_args(self):
        """Test complete command with no arguments."""
        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_complete([])

            # Check that the error message is printed
            output = fake_out.getvalue().strip()
            self.assertIn("Invalid command format", output)

    def test_complete_command_with_invalid_format_multiple_args(self):
        """Test complete command with multiple arguments."""
        # Add an item first
        self.todo_manager.add_item("Buy groceries")

        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_complete(["1", "extra", "arg"])

            # Check that the error message is printed
            output = fake_out.getvalue().strip()
            self.assertIn("Invalid command format", output)

    def test_complete_command_with_non_numeric_position(self):
        """Test complete command with a non-numeric position."""
        # Add an item first
        self.todo_manager.add_item("Buy groceries")

        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_complete(["abc"])

            # Check that the error message is printed
            output = fake_out.getvalue().strip()
            self.assertIn("Position must be a number", output)


if __name__ == "__main__":
    unittest.main()