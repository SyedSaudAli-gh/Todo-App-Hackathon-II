# Todo App CLI Command Contracts

## Command Interface Specifications

### Add Command
- **Command**: `add "description text"`
- **Input**: Single string argument containing the todo description
- **Success Response**: Confirmation message "Added: [description]"
- **Error Responses**:
  - "Error: Description cannot be empty" (if description is empty)
  - "Error: Invalid command format" (if no description provided)

### List Command
- **Command**: `list` (no arguments)
- **Input**: None
- **Success Response**: Numbered list of all todo items with completion status
  - Format: "1. [ ] description" for incomplete items
  - Format: "1. [x] description" for completed items
  - Empty list message: "No todo items found"
- **Error Responses**: None expected

### Complete Command
- **Command**: `complete [position]`
- **Input**: Single integer argument (1-based position in list)
- **Success Response**: Confirmation message "Marked as complete: [description]"
- **Error Responses**:
  - "Error: Invalid position" (if position is out of range)
  - "Error: Invalid command format" (if no position provided)

### Delete Command
- **Command**: `delete [position]`
- **Input**: Single integer argument (1-based position in list)
- **Success Response**: Confirmation message "Deleted: [description]"
- **Error Responses**:
  - "Error: Invalid position" (if position is out of range)
  - "Error: Invalid command format" (if no position provided)

### Update Command
- **Command**: `update [position] "new description"`
- **Input**: Integer position (1-based) and string description
- **Success Response**: Confirmation message "Updated: [new description]"
- **Error Responses**:
  - "Error: Invalid position" (if position is out of range)
  - "Error: Description cannot be empty" (if new description is empty)
  - "Error: Invalid command format" (if arguments missing)