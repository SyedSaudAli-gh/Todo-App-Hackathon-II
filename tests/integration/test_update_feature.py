"""
Integration tests for the update feature.

Tests the update functionality from CLI input through to storage in the todo manager.
"""

import unittest
from io import StringIO
from unittest.mock import patch
from src.services.todo_manager import TodoManager
from src.cli.cli_interface import CLIInterface


class TestUpdateFeatureIntegration(unittest.TestCase):
    """Integration tests for the update feature."""

    def setUp(self):
        """Set up test fixtures."""
        self.todo_manager = TodoManager()
        self.cli = CLIInterface(self.todo_manager)

    def test_update_single_item_integration(self):
        """Test the update flow for a single item."""
        # Add an item
        self.todo_manager.add_item("Buy groceries")

        # Update the item
        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_update(["1", "Buy", "organic", "groceries"])
            output = fake_out.getvalue().strip()
            self.assertEqual(output, "Updated: Buy groceries -> Buy organic groceries")

        # Verify the item is updated in the manager
        todos = self.todo_manager.get_all_items()
        self.assertEqual(len(todos), 1)
        self.assertEqual(todos[0].description, "Buy organic groceries")

    def test_update_item_then_list_integration(self):
        """Test updating an item and then listing to verify the change."""
        # Add an item
        self.todo_manager.add_item("Buy groceries")

        # Update the item
        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_update(["1", "Buy", "organic", "groceries"])
            update_output = fake_out.getvalue().strip()
            self.assertEqual(update_output, "Updated: Buy groceries -> Buy organic groceries")

        # List items
        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_list([])
            list_output = fake_out.getvalue().strip()

        # Verify the updated item appears in the list
        expected_list = "1. [ ] Buy organic groceries"
        self.assertEqual(list_output, expected_list)

    def test_update_multiple_items_integration(self):
        """Test updating multiple items."""
        # Add multiple items
        self.todo_manager.add_item("Buy groceries")
        self.todo_manager.add_item("Walk the dog")
        self.todo_manager.add_item("Do laundry")

        # Update the first and third items
        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_update(["1", "Buy", "organic", "groceries"])
            output1 = fake_out.getvalue().strip()
            self.assertEqual(output1, "Updated: Buy groceries -> Buy organic groceries")

        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_update(["3", "Do", "the", "laundry"])
            output3 = fake_out.getvalue().strip()
            self.assertEqual(output3, "Updated: Do laundry -> Do the laundry")

        # List items to verify updates
        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_list([])
            list_output = fake_out.getvalue().strip()

        expected_list = "1. [ ] Buy organic groceries\n2. [ ] Walk the dog\n3. [ ] Do the laundry"
        self.assertEqual(list_output, expected_list)

    def test_update_item_then_complete_integration(self):
        """Test updating an item, then marking it complete, then listing."""
        # Add an item
        self.todo_manager.add_item("Buy groceries")

        # Update the item
        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_update(["1", "Buy", "organic", "groceries"])
            update_output = fake_out.getvalue().strip()
            self.assertEqual(update_output, "Updated: Buy groceries -> Buy organic groceries")

        # Mark the updated item as complete
        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_complete(["1"])
            complete_output = fake_out.getvalue().strip()
            self.assertEqual(complete_output, "Marked as complete: Buy organic groceries")

        # List items
        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_list([])
            list_output = fake_out.getvalue().strip()

        expected_list = "1. [x] Buy organic groceries"
        self.assertEqual(list_output, expected_list)

    def test_update_completed_item_integration(self):
        """Test updating an item that was already marked as complete."""
        # Add an item and mark it complete
        self.todo_manager.add_item("Buy groceries")
        self.todo_manager.mark_complete(1)

        # Update the completed item
        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_update(["1", "Buy", "organic", "groceries"])
            update_output = fake_out.getvalue().strip()
            self.assertEqual(update_output, "Updated: Buy groceries -> Buy organic groceries")

        # Verify the item is updated but still marked as complete
        todos = self.todo_manager.get_all_items()
        self.assertEqual(len(todos), 1)
        self.assertEqual(todos[0].description, "Buy organic groceries")
        self.assertTrue(todos[0].completed)

        # List items to verify both update and completion status
        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_list([])
            list_output = fake_out.getvalue().strip()

        expected_list = "1. [x] Buy organic groceries"
        self.assertEqual(list_output, expected_list)

    def test_update_with_invalid_input_integration(self):
        """Test updating with invalid input."""
        # Add an item
        self.todo_manager.add_item("Buy groceries")

        # Try to update with invalid position
        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_update(["99", "New", "description"])
            output = fake_out.getvalue().strip()

        # Verify the error message
        self.assertIn("Invalid position", output)

        # Verify the item was not updated
        todos = self.todo_manager.get_all_items()
        self.assertEqual(len(todos), 1)
        self.assertEqual(todos[0].description, "Buy groceries")

    def test_update_with_empty_description_integration(self):
        """Test updating with an empty description."""
        # Add an item
        self.todo_manager.add_item("Buy groceries")

        # Try to update with empty description
        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_update(["1", ""])
            output = fake_out.getvalue().strip()

        # Verify the error message
        self.assertIn("Description cannot be empty", output)

        # Verify the item was not updated
        todos = self.todo_manager.get_all_items()
        self.assertEqual(len(todos), 1)
        self.assertEqual(todos[0].description, "Buy groceries")

    def test_update_item_id_persists_integration(self):
        """Test that updating an item preserves its ID."""
        # Add an item
        self.todo_manager.add_item("Buy groceries")

        # Get the original ID
        original_item = self.todo_manager.get_all_items()[0]
        original_id = original_item.id

        # Update the item
        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_update(["1", "Buy", "organic", "groceries"])
            update_output = fake_out.getvalue().strip()
            self.assertEqual(update_output, "Updated: Buy groceries -> Buy organic groceries")

        # Verify the ID is preserved
        updated_item = self.todo_manager.get_all_items()[0]
        self.assertEqual(updated_item.id, original_id)
        self.assertEqual(updated_item.description, "Buy organic groceries")


if __name__ == "__main__":
    unittest.main()