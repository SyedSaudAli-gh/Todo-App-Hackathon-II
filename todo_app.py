#!/usr/bin/env python3
"""
Todo App - An interactive, in-memory todo application with while-loop CLI.

This application allows users to add, view, complete, update, and delete
todo items through an interactive menu-based interface. All data is stored
in memory only and will be lost when the application exits.
"""

import sys

# Add the src directory to the path so we can import modules
sys.path.insert(0, 'src')

from cli.cli_interface import CLIInterface
from services.todo_manager import TodoManager


def main():
    """Main entry point for the interactive Todo application."""
    print("Welcome to the Todo App!")
    print("This is an interactive application with a menu-based interface.")

    # Initialize the todo manager and CLI interface
    todo_manager = TodoManager()
    cli = CLIInterface(todo_manager)

    # Interactive menu loop
    while True:
        print("\n" + "="*50)
        print("TODO APP - Interactive Menu")
        print("="*50)
        print("1. Add a new todo item")
        print("2. List all todo items")
        print("3. Mark a todo item as complete")
        print("4. Delete a todo item")
        print("5. Update a todo item")
        print("6. Show help")
        print("7. Exit")
        print("-"*50)

        try:
            choice = input("Please select an option (1-7): ").strip()

            if choice == "1":
                # Handle add
                description = input("Enter the todo description: ").strip()
                if description:
                    cli.handle_add([description])
                else:
                    print("Error: Description cannot be empty")

            elif choice == "2":
                # Handle list
                cli.handle_list([])

            elif choice == "3":
                # Handle complete
                position = input("Enter the position of the item to mark complete: ").strip()
                if position:
                    cli.handle_complete([position])
                else:
                    print("Error: Position cannot be empty")

            elif choice == "4":
                # Handle delete
                position = input("Enter the position of the item to delete: ").strip()
                if position:
                    cli.handle_delete([position])
                else:
                    print("Error: Position cannot be empty")

            elif choice == "5":
                # Handle update
                position = input("Enter the position of the item to update: ").strip()
                if position:
                    new_description = input("Enter the new description: ").strip()
                    if new_description:
                        cli.handle_update([position, new_description])
                    else:
                        print("Error: New description cannot be empty")
                else:
                    print("Error: Position cannot be empty")

            elif choice == "6":
                # Handle help
                cli.handle_help()

            elif choice == "7":
                # Exit
                print("Thank you for using the Todo App. Goodbye!")
                break

            else:
                print(f"Error: Invalid option '{choice}'. Please select a number between 1 and 7.")

        except KeyboardInterrupt:
            print("\n\nApplication interrupted. Goodbye!")
            break
        except EOFError:
            print("\n\nEnd of input received. Goodbye!")
            break


if __name__ == "__main__":
    main()