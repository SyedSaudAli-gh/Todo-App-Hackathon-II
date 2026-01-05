# In-Memory Python Todo App

A console-based, in-memory todo application that allows users to add, view, complete, update, and delete todo items. All data is stored in memory only and will be lost when the application exits.

## Features

- Add new todo items
- List all todo items with completion status
- Mark todo items as complete
- Delete todo items
- Update todo item descriptions
- Command-line interface
- In-memory storage (no persistent data)

## Prerequisites

- Python 3.13+

## Installation

No installation required. The application runs directly from the source code.

## Usage

Run the application from the command line with one of the following commands:

### Add a new todo item
```bash
python todo_app.py add "Your todo description here"
```

### List all todo items
```bash
python todo_app.py list
```

### Mark a todo item as complete
```bash
python todo_app.py complete 1
```
Replace `1` with the position number of the item you want to mark complete.

### Delete a todo item
```bash
python todo_app.py delete 1
```
Replace `1` with the position number of the item you want to delete.

### Update a todo item
```bash
python todo_app.py update 1 "Your new description here"
```
Replace `1` with the position number of the item you want to update.

### Get help
```bash
python todo_app.py help
```

## Example Workflow

1. Add a new todo: `python todo_app.py add "Buy groceries"`
2. View your todos: `python todo_app.py list`
3. Mark as complete: `python todo_app.py complete 1`
4. Add another todo: `python todo_app.py add "Walk the dog"`
5. View updated list: `python todo_app.py list`

## Notes

- All data is stored in memory only and will be lost when the application exits
- Item positions are 1-based (first item is position 1, not 0)
- The application uses only Python standard library modules
- No external dependencies required