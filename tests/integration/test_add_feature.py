"""
Integration tests for the add feature.

Tests the complete add functionality from CLI input to storage in the todo manager.
"""

import unittest
from io import StringIO
from unittest.mock import patch
from src.services.todo_manager import TodoManager
from src.cli.cli_interface import CLIInterface


class TestAddFeatureIntegration(unittest.TestCase):
    """Integration tests for the add feature."""

    def setUp(self):
        """Set up test fixtures."""
        self.todo_manager = TodoManager()
        self.cli = CLIInterface(self.todo_manager)

    def test_add_single_item_integration(self):
        """Test the complete flow of adding a single item."""
        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_add(["Buy groceries"])

            # Check that the success message is printed
            output = fake_out.getvalue().strip()
            self.assertEqual(output, "Added: Buy groceries")

        # Verify the item was added to the manager
        todos = self.todo_manager.get_all_items()
        self.assertEqual(len(todos), 1)
        self.assertEqual(todos[0].description, "Buy groceries")
        self.assertFalse(todos[0].completed)
        self.assertIsNotNone(todos[0].created_at)

    def test_add_multiple_items_integration(self):
        """Test the complete flow of adding multiple items."""
        # Add first item
        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_add(["Buy groceries"])
            output1 = fake_out.getvalue().strip()
            self.assertEqual(output1, "Added: Buy groceries")

        # Add second item
        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_add(["Walk the dog"])
            output2 = fake_out.getvalue().strip()
            self.assertEqual(output2, "Added: Walk the dog")

        # Verify both items were added to the manager
        todos = self.todo_manager.get_all_items()
        self.assertEqual(len(todos), 2)
        self.assertEqual(todos[0].description, "Buy groceries")
        self.assertEqual(todos[1].description, "Walk the dog")

    def test_add_item_then_list_integration(self):
        """Test adding an item and then listing to verify it appears."""
        # Add an item
        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_add(["Buy groceries"])
            add_output = fake_out.getvalue().strip()
            self.assertEqual(add_output, "Added: Buy groceries")

        # List items
        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_list([])
            list_output = fake_out.getvalue().strip()

        # Verify the added item appears in the list
        expected_list = "1. [ ] Buy groceries"
        self.assertEqual(list_output, expected_list)

    def test_add_empty_description_integration(self):
        """Test adding an empty description and verify error handling."""
        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_add([""])
            output = fake_out.getvalue().strip()
            self.assertEqual(output, "Error: Description cannot be empty")

        # Verify no items were added
        todos = self.todo_manager.get_all_items()
        self.assertEqual(len(todos), 0)

    def test_add_whitespace_description_integration(self):
        """Test adding a whitespace-only description and verify error handling."""
        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_add(["   "])
            output = fake_out.getvalue().strip()
            self.assertEqual(output, "Error: Description cannot be empty")

        # Verify no items were added
        todos = self.todo_manager.get_all_items()
        self.assertEqual(len(todos), 0)

    def test_add_items_with_incrementing_ids(self):
        """Test that added items get incrementing IDs."""
        # Add first item
        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_add(["First task"])
            fake_out.getvalue()  # Clear output

        # Add second item
        with patch('sys.stdout', new=StringIO()) as fake_out:
            self.cli.handle_add(["Second task"])
            fake_out.getvalue()  # Clear output

        # Verify IDs are incrementing
        todos = self.todo_manager.get_all_items()
        self.assertEqual(len(todos), 2)
        self.assertEqual(todos[0].id, 1)
        self.assertEqual(todos[1].id, 2)


if __name__ == "__main__":
    unittest.main()