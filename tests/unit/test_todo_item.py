"""
Unit tests for the TodoItem model.

Tests the TodoItem class functionality including initialization, string representation,
and dictionary conversion methods.
"""

import unittest
from datetime import datetime
from src.models.todo_item import TodoItem


class TestTodoItem(unittest.TestCase):
    """Test cases for the TodoItem model."""

    def test_initialization_with_defaults(self):
        """Test initializing a TodoItem with default values."""
        item = TodoItem("Test description")

        self.assertEqual(item.description, "Test description")
        self.assertFalse(item.completed)
        self.assertIsNotNone(item.created_at)
        self.assertIsInstance(item.created_at, datetime)
        self.assertIsNone(item.id)

    def test_initialization_with_all_params(self):
        """Test initializing a TodoItem with all parameters."""
        test_datetime = datetime.now()
        item = TodoItem(
            description="Test description",
            item_id=1,
            completed=True,
            created_at=test_datetime
        )

        self.assertEqual(item.description, "Test description")
        self.assertTrue(item.completed)
        self.assertEqual(item.created_at, test_datetime)
        self.assertEqual(item.id, 1)

    def test_string_representation(self):
        """Test the string representation of a TodoItem."""
        item = TodoItem("Test description")

        self.assertEqual(str(item), "[ ] Test description")

        # Test with completed item
        item.completed = True
        self.assertEqual(str(item), "[x] Test description")

    def test_repr_representation(self):
        """Test the detailed string representation of a TodoItem."""
        item = TodoItem("Test description", item_id=1)

        repr_str = repr(item)
        self.assertIn("TodoItem", repr_str)
        self.assertIn("id=1", repr_str)
        self.assertIn("description='Test description'", repr_str)
        self.assertIn("completed=False", repr_str)

    def test_to_dict_conversion(self):
        """Test converting a TodoItem to a dictionary."""
        test_datetime = datetime(2023, 1, 1, 12, 0, 0)
        item = TodoItem(
            description="Test description",
            item_id=1,
            completed=True,
            created_at=test_datetime
        )

        item_dict = item.to_dict()

        self.assertEqual(item_dict["id"], 1)
        self.assertEqual(item_dict["description"], "Test description")
        self.assertEqual(item_dict["completed"], True)
        self.assertEqual(item_dict["created_at"], "2023-01-01T12:00:00")

    def test_from_dict_conversion(self):
        """Test creating a TodoItem from a dictionary."""
        data = {
            "id": 1,
            "description": "Test description",
            "completed": True,
            "created_at": "2023-01-01T12:00:00"
        }

        item = TodoItem.from_dict(data)

        self.assertEqual(item.id, 1)
        self.assertEqual(item.description, "Test description")
        self.assertTrue(item.completed)
        self.assertEqual(item.created_at.year, 2023)
        self.assertEqual(item.created_at.month, 1)
        self.assertEqual(item.created_at.day, 1)
        self.assertEqual(item.created_at.hour, 12)
        self.assertEqual(item.created_at.minute, 0)
        self.assertEqual(item.created_at.second, 0)


if __name__ == "__main__":
    unittest.main()