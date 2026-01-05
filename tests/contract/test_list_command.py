"""
Contract tests for the list command.

Tests the list command interface according to the specified contract:
- Command: `list` (no arguments)
- Input: None
- Success Response: Numbered list of all todo items with completion status
  - Format: "1. [ ] description" for incomplete items
  - Format: "1. [x] description" for completed items
  - Empty list message: "No todo items found"
- Error Responses: None expected
"""

import unittest
from io import StringIO
from unittest.mock import patch
from src.services.todo_manager import TodoManager
from src.cli.cli_interface import CLIInterface


class TestListCommandContract(unittest.TestCase):
    """Contract tests for the list command."""

    def setUp(self):
        """Set up test fixtures."""
        self.todo_manager = TodoManager()
        self.cli = CLIInterface(self.todo_manager)

    def test_list_command_with_empty_list(self):
        """Test list command with no todo items."""
        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_list([])

            # Check that the empty list message is printed
            output = fake_out.getvalue().strip()
            self.assertEqual(output, "No todo items found")

    def test_list_command_with_single_item(self):
        """Test list command with a single todo item."""
        # Add an item first
        self.todo_manager.add_item("Buy groceries")

        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_list([])

            # Check that the item is listed with correct format
            output = fake_out.getvalue().strip()
            self.assertEqual(output, "1. [ ] Buy groceries")

    def test_list_command_with_single_completed_item(self):
        """Test list command with a single completed todo item."""
        # Add an item and mark it complete
        self.todo_manager.add_item("Buy groceries")
        self.todo_manager.mark_complete(1)

        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_list([])

            # Check that the item is listed with completed status
            output = fake_out.getvalue().strip()
            self.assertEqual(output, "1. [x] Buy groceries")

    def test_list_command_with_multiple_items(self):
        """Test list command with multiple todo items."""
        # Add multiple items
        self.todo_manager.add_item("Buy groceries")
        self.todo_manager.add_item("Walk the dog")
        self.todo_manager.add_item("Do laundry")

        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_list([])

            # Check that all items are listed with correct format
            output = fake_out.getvalue().strip()
            expected_output = "1. [ ] Buy groceries\n2. [ ] Walk the dog\n3. [ ] Do laundry"
            self.assertEqual(output, expected_output)

    def test_list_command_with_mixed_completed_items(self):
        """Test list command with a mix of completed and incomplete items."""
        # Add multiple items
        self.todo_manager.add_item("Buy groceries")
        self.todo_manager.add_item("Walk the dog")
        self.todo_manager.add_item("Do laundry")

        # Mark the second item as complete
        self.todo_manager.mark_complete(2)

        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_list([])

            # Check that items are listed with correct completion status
            output = fake_out.getvalue().strip()
            expected_output = "1. [ ] Buy groceries\n2. [x] Walk the dog\n3. [ ] Do laundry"
            self.assertEqual(output, expected_output)

    def test_list_command_with_invalid_args(self):
        """Test list command with invalid arguments."""
        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_list(["invalid", "args"])

            # Check that the error message is printed
            output = fake_out.getvalue().strip()
            self.assertEqual(output, "Error: list command takes no arguments")


if __name__ == "__main__":
    unittest.main()