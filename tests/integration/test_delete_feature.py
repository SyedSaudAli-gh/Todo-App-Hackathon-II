"""
Integration tests for the delete feature.

Tests the delete functionality from CLI input through to storage in the todo manager.
"""

import unittest
from io import StringIO
from unittest.mock import patch
from src.services.todo_manager import TodoManager
from src.cli.cli_interface import CLIInterface


class TestDeleteFeatureIntegration(unittest.TestCase):
    """Integration tests for the delete feature."""

    def setUp(self):
        """Set up test fixtures."""
        self.todo_manager = TodoManager()
        self.cli = CLIInterface(self.todo_manager)

    def test_delete_single_item_integration(self):
        """Test the delete flow for a single item."""
        # Add an item
        self.todo_manager.add_item("Buy groceries")

        # Delete the item
        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_delete(["1"])
            output = fake_out.getvalue().strip()
            self.assertEqual(output, "Deleted: Buy groceries")

        # Verify the item is deleted from the manager
        todos = self.todo_manager.get_all_items()
        self.assertEqual(len(todos), 0)

    def test_delete_item_then_list_integration(self):
        """Test deleting an item and then listing to verify it's gone."""
        # Add an item
        self.todo_manager.add_item("Buy groceries")

        # Delete the item
        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_delete(["1"])
            delete_output = fake_out.getvalue().strip()
            self.assertEqual(delete_output, "Deleted: Buy groceries")

        # List items
        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_list([])
            list_output = fake_out.getvalue().strip()

        # Verify the list is empty
        self.assertEqual(list_output, "No todo items found")

    def test_delete_middle_item_integration(self):
        """Test deleting an item from the middle of the list."""
        # Add multiple items
        self.todo_manager.add_item("First task")
        self.todo_manager.add_item("Second task")
        self.todo_manager.add_item("Third task")

        # Delete the middle item
        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_delete(["2"])
            delete_output = fake_out.getvalue().strip()
            self.assertEqual(delete_output, "Deleted: Second task")

        # List items to verify the correct item was removed
        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_list([])
            list_output = fake_out.getvalue().strip()

        expected_list = "1. [ ] First task\n2. [ ] Third task"
        self.assertEqual(list_output, expected_list)

    def test_delete_first_item_integration(self):
        """Test deleting the first item from the list."""
        # Add multiple items
        self.todo_manager.add_item("First task")
        self.todo_manager.add_item("Second task")
        self.todo_manager.add_item("Third task")

        # Delete the first item
        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_delete(["1"])
            delete_output = fake_out.getvalue().strip()
            self.assertEqual(delete_output, "Deleted: First task")

        # List items to verify the correct item was removed
        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_list([])
            list_output = fake_out.getvalue().strip()

        expected_list = "1. [ ] Second task\n2. [ ] Third task"
        self.assertEqual(list_output, expected_list)

    def test_delete_last_item_integration(self):
        """Test deleting the last item from the list."""
        # Add multiple items
        self.todo_manager.add_item("First task")
        self.todo_manager.add_item("Second task")
        self.todo_manager.add_item("Third task")

        # Delete the last item
        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_delete(["3"])
            delete_output = fake_out.getvalue().strip()
            self.assertEqual(delete_output, "Deleted: Third task")

        # List items to verify the correct item was removed
        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_list([])
            list_output = fake_out.getvalue().strip()

        expected_list = "1. [ ] First task\n2. [ ] Second task"
        self.assertEqual(list_output, expected_list)

    def test_delete_all_items_integration(self):
        """Test deleting all items one by one."""
        # Add multiple items
        self.todo_manager.add_item("First task")
        self.todo_manager.add_item("Second task")
        self.todo_manager.add_item("Third task")

        # Delete all items
        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_delete(["1"])
            output1 = fake_out.getvalue().strip()
            self.assertEqual(output1, "Deleted: First task")

        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_delete(["1"])  # Now "Second task" is at position 1
            output2 = fake_out.getvalue().strip()
            self.assertEqual(output2, "Deleted: Second task")

        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_delete(["1"])  # Now "Third task" is at position 1
            output3 = fake_out.getvalue().strip()
            self.assertEqual(output3, "Deleted: Third task")

        # List items to verify all are gone
        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_list([])
            list_output = fake_out.getvalue().strip()

        self.assertEqual(list_output, "No todo items found")

    def test_delete_then_add_integration(self):
        """Test deleting an item, then adding a new one."""
        # Add items
        self.todo_manager.add_item("First task")
        self.todo_manager.add_item("Second task")

        # Delete the first item
        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_delete(["1"])
            delete_output = fake_out.getvalue().strip()
            self.assertEqual(delete_output, "Deleted: First task")

        # Add a new item
        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_add(["Third task"])
            add_output = fake_out.getvalue().strip()
            self.assertEqual(add_output, "Added: Third task")

        # List items
        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_list([])
            list_output = fake_out.getvalue().strip()

        expected_list = "1. [ ] Second task\n2. [ ] Third task"
        self.assertEqual(list_output, expected_list)

    def test_delete_with_completed_item_integration(self):
        """Test deleting an item that was marked as complete."""
        # Add an item and mark it complete
        self.todo_manager.add_item("Buy groceries")
        self.todo_manager.mark_complete(1)

        # Delete the completed item
        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_delete(["1"])
            delete_output = fake_out.getvalue().strip()
            self.assertEqual(delete_output, "Deleted: Buy groceries")

        # Verify the item is deleted
        todos = self.todo_manager.get_all_items()
        self.assertEqual(len(todos), 0)

    def test_delete_nonexistent_item_error_integration(self):
        """Test attempting to delete a non-existent item."""
        # Try to delete an item when the list is empty
        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_delete(["1"])
            output = fake_out.getvalue().strip()

        # Verify the error message
        self.assertIn("Invalid position", output)

        # Verify no items were added or changed
        todos = self.todo_manager.get_all_items()
        self.assertEqual(len(todos), 0)


if __name__ == "__main__":
    unittest.main()