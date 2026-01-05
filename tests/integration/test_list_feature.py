"""
Integration tests for the list feature.

Tests the complete list functionality from CLI input to retrieval from the todo manager.
"""

import unittest
from io import StringIO
from unittest.mock import patch
from src.services.todo_manager import TodoManager
from src.cli.cli_interface import CLIInterface


class TestListFeatureIntegration(unittest.TestCase):
    """Integration tests for the list feature."""

    def setUp(self):
        """Set up test fixtures."""
        self.todo_manager = TodoManager()
        self.cli = CLIInterface(self.todo_manager)

    def test_list_empty_after_initialization(self):
        """Test that the list is empty when the manager is first initialized."""
        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_list([])
            output = fake_out.getvalue().strip()
            self.assertEqual(output, "No todo items found")

    def test_list_after_adding_single_item(self):
        """Test listing after adding a single item."""
        # Add an item
        self.todo_manager.add_item("Buy groceries")

        # List items
        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_list([])
            output = fake_out.getvalue().strip()

        # Verify the item appears in the list
        self.assertEqual(output, "1. [ ] Buy groceries")

    def test_list_after_adding_multiple_items(self):
        """Test listing after adding multiple items."""
        # Add multiple items
        self.todo_manager.add_item("Buy groceries")
        self.todo_manager.add_item("Walk the dog")
        self.todo_manager.add_item("Do laundry")

        # List items
        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_list([])
            output = fake_out.getvalue().strip()

        # Verify all items appear in the list
        expected_output = "1. [ ] Buy groceries\n2. [ ] Walk the dog\n3. [ ] Do laundry"
        self.assertEqual(output, expected_output)

    def test_list_after_marking_items_complete(self):
        """Test listing after marking some items as complete."""
        # Add multiple items
        self.todo_manager.add_item("Buy groceries")
        self.todo_manager.add_item("Walk the dog")
        self.todo_manager.add_item("Do laundry")

        # Mark the first and third items as complete
        self.todo_manager.mark_complete(1)
        self.todo_manager.mark_complete(3)

        # List items
        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_list([])
            output = fake_out.getvalue().strip()

        # Verify items appear with correct completion status
        expected_output = "1. [x] Buy groceries\n2. [ ] Walk the dog\n3. [x] Do laundry"
        self.assertEqual(output, expected_output)

    def test_list_after_deleting_items(self):
        """Test listing after deleting some items."""
        # Add multiple items
        self.todo_manager.add_item("Buy groceries")
        self.todo_manager.add_item("Walk the dog")
        self.todo_manager.add_item("Do laundry")

        # Delete the second item
        self.todo_manager.delete_item(2)

        # List items
        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_list([])
            output = fake_out.getvalue().strip()

        # Verify the remaining items appear in the list (positions should be consistent)
        expected_output = "1. [ ] Buy groceries\n2. [ ] Do laundry"
        self.assertEqual(output, expected_output)

    def test_list_after_updating_items(self):
        """Test listing after updating an item's description."""
        # Add an item
        self.todo_manager.add_item("Buy groceries")

        # Update the item
        self.todo_manager.update_item(1, "Buy organic groceries")

        # List items
        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_list([])
            output = fake_out.getvalue().strip()

        # Verify the updated item appears in the list
        self.assertEqual(output, "1. [ ] Buy organic groceries")

    def test_list_consistency_after_multiple_operations(self):
        """Test that the list remains consistent after multiple operations."""
        # Add items
        self.todo_manager.add_item("Task 1")
        self.todo_manager.add_item("Task 2")
        self.todo_manager.add_item("Task 3")

        # Mark one as complete
        self.todo_manager.mark_complete(2)

        # Add another item
        self.todo_manager.add_item("Task 4")

        # List items
        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_list([])
            output = fake_out.getvalue().strip()

        # Verify all items appear with correct status
        expected_output = "1. [ ] Task 1\n2. [x] Task 2\n3. [ ] Task 3\n4. [ ] Task 4"
        self.assertEqual(output, expected_output)

        # Verify the manager's internal state matches the list output
        items = self.todo_manager.get_all_items()
        self.assertEqual(len(items), 4)
        self.assertEqual(items[0].description, "Task 1")
        self.assertFalse(items[0].completed)
        self.assertEqual(items[1].description, "Task 2")
        self.assertTrue(items[1].completed)
        self.assertEqual(items[2].description, "Task 3")
        self.assertFalse(items[2].completed)
        self.assertEqual(items[3].description, "Task 4")
        self.assertFalse(items[3].completed)


if __name__ == "__main__":
    unittest.main()