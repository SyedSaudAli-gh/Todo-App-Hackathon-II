# Data Model: In-Memory Python Todo App

## TodoItem Entity

### Properties
- **id** (int): Unique identifier for the todo item; auto-incremented integer
- **description** (str): Text description of the todo item; non-empty string
- **completed** (bool): Completion status of the todo item; defaults to False
- **created_at** (datetime): Timestamp when the item was created; automatically set on creation

### Validation Rules
- **Description**: Must be a non-empty string after whitespace is stripped
- **ID**: Must be a positive integer; auto-generated if not provided
- **Completed**: Must be a boolean value; defaults to False if not specified
- **Created_at**: Must be a valid datetime object; automatically set to current time if not provided

### State Transitions
- **Created**: New todo item is created with `completed=False`
- **Completed**: Todo item status changes from `completed=False` to `completed=True`
- **Updated**: Todo item description is modified while maintaining other properties
- **Deleted**: Todo item is removed from the in-memory collection

## In-Memory Storage Structure

### Todo Collection
- **Type**: Python list of TodoItem objects
- **Indexing**: Items accessible by position (0-based index)
- **Operations**: Add, remove, update, retrieve by position or ID
- **Persistence**: Data exists only in memory; lost on application exit

### Collection Operations
- **Add**: Append new TodoItem to the end of the list
- **Get by Index**: Retrieve TodoItem by position in the list
- **Update by Index**: Modify properties of TodoItem at specific position
- **Delete by Index**: Remove TodoItem from specific position (with renumbering)
- **List All**: Return all TodoItem objects in the collection