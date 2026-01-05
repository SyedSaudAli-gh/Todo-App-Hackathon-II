"""
Unit tests for the TodoManager service.

Tests the TodoManager class functionality including add, list, complete, delete, and update operations.
"""

import unittest
from src.services.todo_manager import TodoManager


class TestTodoManager(unittest.TestCase):
    """Test cases for the TodoManager service."""

    def setUp(self):
        """Set up test fixtures."""
        self.todo_manager = TodoManager()

    def test_initial_empty_list(self):
        """Test that the todo list is empty when initialized."""
        todos = self.todo_manager.get_all_items()
        self.assertEqual(len(todos), 0)

    def test_add_item(self):
        """Test adding a single item."""
        success, message, item = self.todo_manager.add_item("Buy groceries")

        self.assertTrue(success)
        self.assertIn("Added: Buy groceries", message)
        self.assertIsNotNone(item)
        self.assertEqual(item.description, "Buy groceries")
        self.assertFalse(item.completed)

        # Verify the item was added to the list
        todos = self.todo_manager.get_all_items()
        self.assertEqual(len(todos), 1)
        self.assertEqual(todos[0].description, "Buy groceries")

    def test_add_multiple_items(self):
        """Test adding multiple items."""
        # Add first item
        success1, msg1, item1 = self.todo_manager.add_item("Buy groceries")
        # Add second item
        success2, msg2, item2 = self.todo_manager.add_item("Walk the dog")

        self.assertTrue(success1)
        self.assertTrue(success2)
        self.assertIsNotNone(item1)
        self.assertIsNotNone(item2)

        # Verify both items were added
        todos = self.todo_manager.get_all_items()
        self.assertEqual(len(todos), 2)
        self.assertEqual(todos[0].description, "Buy groceries")
        self.assertEqual(todos[1].description, "Walk the dog")

    def test_get_item_count(self):
        """Test getting the total item count."""
        self.assertEqual(self.todo_manager.get_item_count(), 0)

        # Add items
        self.todo_manager.add_item("Item 1")
        self.assertEqual(self.todo_manager.get_item_count(), 1)

        self.todo_manager.add_item("Item 2")
        self.assertEqual(self.todo_manager.get_item_count(), 2)

    def test_get_completed_count(self):
        """Test getting the completed item count."""
        self.assertEqual(self.todo_manager.get_completed_count(), 0)

        # Add an item
        self.todo_manager.add_item("Item 1")
        self.assertEqual(self.todo_manager.get_completed_count(), 0)

        # Mark it as complete
        self.todo_manager.mark_complete(1)
        self.assertEqual(self.todo_manager.get_completed_count(), 1)

    def test_get_pending_count(self):
        """Test getting the pending item count."""
        self.assertEqual(self.todo_manager.get_pending_count(), 0)

        # Add an item
        self.todo_manager.add_item("Item 1")
        self.assertEqual(self.todo_manager.get_pending_count(), 1)

        # Mark it as complete
        self.todo_manager.mark_complete(1)
        self.assertEqual(self.todo_manager.get_pending_count(), 0)

    def test_mark_complete(self):
        """Test marking an item as complete."""
        # Add an item
        self.todo_manager.add_item("Buy groceries")

        # Mark it as complete
        success, message, item = self.todo_manager.mark_complete(1)

        self.assertTrue(success)
        self.assertIn("Marked as complete", message)
        self.assertIsNotNone(item)
        self.assertTrue(item.completed)

    def test_mark_complete_invalid_position(self):
        """Test marking an item as complete with an invalid position."""
        # Try to mark an item at invalid position
        success, message, item = self.todo_manager.mark_complete(1)

        self.assertFalse(success)
        self.assertIn("Invalid position", message)
        self.assertIsNone(item)

    def test_delete_item(self):
        """Test deleting an item."""
        # Add items
        self.todo_manager.add_item("Buy groceries")
        self.todo_manager.add_item("Walk the dog")

        # Delete the first item
        success, message, item = self.todo_manager.delete_item(1)

        self.assertTrue(success)
        self.assertIn("Deleted:", message)
        self.assertIsNotNone(item)
        self.assertEqual(item.description, "Buy groceries")

        # Verify only the second item remains
        todos = self.todo_manager.get_all_items()
        self.assertEqual(len(todos), 1)
        self.assertEqual(todos[0].description, "Walk the dog")

    def test_delete_item_invalid_position(self):
        """Test deleting an item with an invalid position."""
        # Try to delete an item at invalid position
        success, message, item = self.todo_manager.delete_item(1)

        self.assertFalse(success)
        self.assertIn("Invalid position", message)
        self.assertIsNone(item)

    def test_update_item(self):
        """Test updating an item."""
        # Add an item
        self.todo_manager.add_item("Buy groceries")

        # Update the item
        success, message, item = self.todo_manager.update_item(1, "Buy organic groceries")

        self.assertTrue(success)
        self.assertIn("Updated:", message)
        self.assertIsNotNone(item)
        self.assertEqual(item.description, "Buy organic groceries")

    def test_update_item_invalid_position(self):
        """Test updating an item with an invalid position."""
        # Try to update an item at invalid position
        success, message, item = self.todo_manager.update_item(1, "New description")

        self.assertFalse(success)
        self.assertIn("Invalid position", message)
        self.assertIsNone(item)

    def test_update_item_empty_description(self):
        """Test updating an item with an empty description."""
        # Add an item
        self.todo_manager.add_item("Buy groceries")

        # Try to update with empty description
        success, message, item = self.todo_manager.update_item(1, "")

        self.assertFalse(success)
        self.assertIn("Description cannot be empty", message)
        self.assertIsNone(item)

        # Verify the original item is unchanged
        todos = self.todo_manager.get_all_items()
        self.assertEqual(len(todos), 1)
        self.assertEqual(todos[0].description, "Buy groceries")


if __name__ == "__main__":
    unittest.main()