"""
Integration tests for the complete feature.

Tests the complete functionality from CLI input through to storage in the todo manager.
"""

import unittest
from io import StringIO
from unittest.mock import patch
from src.services.todo_manager import TodoManager
from src.cli.cli_interface import CLIInterface


class TestCompleteFeatureIntegration(unittest.TestCase):
    """Integration tests for the complete feature."""

    def setUp(self):
        """Set up test fixtures."""
        self.todo_manager = TodoManager()
        self.cli = CLIInterface(self.todo_manager)

    def test_complete_single_item_integration(self):
        """Test the complete flow for a single item."""
        # Add an item
        self.todo_manager.add_item("Buy groceries")

        # Complete the item
        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_complete(["1"])
            output = fake_out.getvalue().strip()
            self.assertEqual(output, "Marked as complete: Buy groceries")

        # Verify the item is marked as complete in the manager
        todos = self.todo_manager.get_all_items()
        self.assertEqual(len(todos), 1)
        self.assertTrue(todos[0].completed)
        self.assertEqual(todos[0].description, "Buy groceries")

    def test_complete_item_then_list_integration(self):
        """Test completing an item and then listing to verify status change."""
        # Add an item
        self.todo_manager.add_item("Buy groceries")

        # Complete the item
        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_complete(["1"])
            complete_output = fake_out.getvalue().strip()
            self.assertEqual(complete_output, "Marked as complete: Buy groceries")

        # List items
        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_list([])
            list_output = fake_out.getvalue().strip()

        # Verify the completed item appears with correct status
        expected_list = "1. [x] Buy groceries"
        self.assertEqual(list_output, expected_list)

    def test_complete_multiple_items_integration(self):
        """Test completing multiple items."""
        # Add multiple items
        self.todo_manager.add_item("Buy groceries")
        self.todo_manager.add_item("Walk the dog")
        self.todo_manager.add_item("Do laundry")

        # Complete the first and third items
        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_complete(["1"])
            output1 = fake_out.getvalue().strip()
            self.assertEqual(output1, "Marked as complete: Buy groceries")

        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_complete(["3"])
            output3 = fake_out.getvalue().strip()
            self.assertEqual(output3, "Marked as complete: Do laundry")

        # List items to verify completion status
        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_list([])
            list_output = fake_out.getvalue().strip()

        expected_list = "1. [x] Buy groceries\n2. [ ] Walk the dog\n3. [x] Do laundry"
        self.assertEqual(list_output, expected_list)

    def test_complete_item_then_add_new_integration(self):
        """Test completing an item, then adding a new one, then listing."""
        # Add items
        self.todo_manager.add_item("Buy groceries")
        self.todo_manager.add_item("Walk the dog")

        # Complete the first item
        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_complete(["1"])
            complete_output = fake_out.getvalue().strip()
            self.assertEqual(complete_output, "Marked as complete: Buy groceries")

        # Add a new item
        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_add(["Do laundry"])
            add_output = fake_out.getvalue().strip()
            self.assertEqual(add_output, "Added: Do laundry")

        # List items
        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_list([])
            list_output = fake_out.getvalue().strip()

        expected_list = "1. [x] Buy groceries\n2. [ ] Walk the dog\n3. [ ] Do laundry"
        self.assertEqual(list_output, expected_list)

    def test_complete_nonexistent_item_error_integration(self):
        """Test attempting to complete a non-existent item."""
        # Try to complete an item when the list is empty
        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_complete(["1"])
            output = fake_out.getvalue().strip()

        # Verify the error message
        self.assertIn("Invalid position", output)

        # Verify no items were added or changed
        todos = self.todo_manager.get_all_items()
        self.assertEqual(len(todos), 0)

    def test_complete_with_invalid_input_integration(self):
        """Test completing with invalid input."""
        # Add an item
        self.todo_manager.add_item("Buy groceries")

        # Try to complete with invalid position
        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_complete(["99"])
            output = fake_out.getvalue().strip()

        # Verify the error message
        self.assertIn("Invalid position", output)

        # Verify the item is still incomplete
        todos = self.todo_manager.get_all_items()
        self.assertEqual(len(todos), 1)
        self.assertFalse(todos[0].completed)

    def test_complete_item_id_persists_integration(self):
        """Test that completing an item preserves its ID."""
        # Add an item
        self.todo_manager.add_item("Buy groceries")

        # Get the original ID
        original_item = self.todo_manager.get_all_items()[0]
        original_id = original_item.id

        # Complete the item
        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_complete(["1"])
            complete_output = fake_out.getvalue().strip()
            self.assertEqual(complete_output, "Marked as complete: Buy groceries")

        # Verify the ID is preserved
        completed_item = self.todo_manager.get_all_items()[0]
        self.assertEqual(completed_item.id, original_id)
        self.assertTrue(completed_item.completed)


if __name__ == "__main__":
    unittest.main()