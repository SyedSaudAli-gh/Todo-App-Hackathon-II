# MCP Tool Contracts: AI-Powered Todo Chatbot Backend

**Feature**: 001-ai-todo-chatbot
**Date**: 2026-02-02
**Purpose**: Define MCP tool schemas for task management operations

## Overview

This document defines the 5 MCP tools that the AI agent uses for task management. All tools are implemented as OpenAI function calling schemas and invoked by the agent through the OpenAI API.

**Design Principles**:
- **Stateless**: Each tool receives database session as parameter
- **Database-backed**: All operations persist immediately to PostgreSQL
- **Structured responses**: Return dict with success, message, and data
- **Error handling**: Catch exceptions and return structured error responses
- **Validation**: Use Pydantic for input validation

---

## Tool 1: create_task

### Purpose
Create a new todo task in the database.

### OpenAI Function Schema

```json
{
  "type": "function",
  "function": {
    "name": "create_task",
    "description": "Create a new todo task for the user. Use this when the user wants to add a task, create a reminder, or add something to their todo list.",
    "parameters": {
      "type": "object",
      "properties": {
        "title": {
          "type": "string",
          "description": "Task title (required, 1-200 characters). Should be concise and descriptive."
        },
        "description": {
          "type": "string",
          "description": "Optional task description with additional details (max 2000 characters)"
        },
        "status": {
          "type": "string",
          "enum": ["pending", "completed"],
          "description": "Task status. Default is 'pending'. Use 'completed' only if user explicitly says the task is already done."
        }
      },
      "required": ["title"]
    }
  }
}
```

### Input Parameters

| Parameter | Type | Required | Constraints | Description |
|-----------|------|----------|-------------|-------------|
| title | string | Yes | 1-200 chars | Task title |
| description | string | No | Max 2000 chars | Task description |
| status | string | No | "pending" or "completed" | Task status (default: "pending") |

### Output Schema

**Success Response**:
```json
{
  "task_id": 42,
  "success": true,
  "message": "Created task: Buy groceries"
}
```

**Error Response**:
```json
{
  "success": false,
  "message": "Failed to create task: Title cannot be empty"
}
```

### Implementation Signature

```python
def create_task(
    title: str,
    description: str | None = None,
    status: str = "pending",
    user_id: str = None,  # Injected by orchestrator
    db: Session = None     # Injected by orchestrator
) -> dict:
    """Create task in database and return result."""
```

### Database Operations
- INSERT into `todos` table
- Commit transaction
- Return task_id

### Error Cases
- Empty title → Return error message
- Title exceeds 200 characters → Return error message
- Description exceeds 2000 characters → Return error message
- Database error → Return error message

### Example Invocations

**User**: "Create a task to buy groceries"
```json
{
  "title": "Buy groceries"
}
```

**User**: "Add a reminder to call mom at 3pm with her phone number"
```json
{
  "title": "Call mom at 3pm",
  "description": "Phone number: 555-1234"
}
```

---

## Tool 2: list_tasks

### Purpose
Retrieve all tasks or filter by status (pending/completed).

### OpenAI Function Schema

```json
{
  "type": "function",
  "function": {
    "name": "list_tasks",
    "description": "List all tasks or filter by status. Use this when the user wants to see their tasks, check what's pending, or review completed items.",
    "parameters": {
      "type": "object",
      "properties": {
        "status": {
          "type": "string",
          "enum": ["all", "pending", "completed"],
          "description": "Filter tasks by status. 'all' returns all tasks, 'pending' returns only incomplete tasks, 'completed' returns only finished tasks. Default is 'all'."
        }
      }
    }
  }
}
```

### Input Parameters

| Parameter | Type | Required | Constraints | Description |
|-----------|------|----------|-------------|-------------|
| status | string | No | "all", "pending", or "completed" | Status filter (default: "all") |

### Output Schema

**Success Response**:
```json
{
  "tasks": [
    {
      "id": 42,
      "title": "Buy groceries",
      "description": "Milk, eggs, bread",
      "completed": false,
      "created_at": "2026-02-02T14:00:00Z",
      "updated_at": "2026-02-02T14:00:00Z"
    },
    {
      "id": 43,
      "title": "Call mom",
      "description": null,
      "completed": false,
      "created_at": "2026-02-02T14:05:00Z",
      "updated_at": "2026-02-02T14:05:00Z"
    }
  ],
  "count": 2,
  "success": true
}
```

**Empty List Response**:
```json
{
  "tasks": [],
  "count": 0,
  "success": true
}
```

**Error Response**:
```json
{
  "success": false,
  "message": "Failed to retrieve tasks: Database connection error"
}
```

### Implementation Signature

```python
def list_tasks(
    status: str = "all",
    user_id: str = None,  # Injected by orchestrator
    db: Session = None     # Injected by orchestrator
) -> dict:
    """List tasks from database with optional status filter."""
```

### Database Operations
- SELECT from `todos` table WHERE `user_id` = ?
- Optional WHERE `completed` = ? (if status filter applied)
- ORDER BY `created_at` DESC

### Error Cases
- Invalid status value → Return error message
- Database error → Return error message

### Example Invocations

**User**: "What tasks do I have?"
```json
{
  "status": "all"
}
```

**User**: "Show me my pending tasks"
```json
{
  "status": "pending"
}
```

**User**: "What have I completed?"
```json
{
  "status": "completed"
}
```

---

## Tool 3: get_task

### Purpose
Retrieve details of a specific task by ID.

### OpenAI Function Schema

```json
{
  "type": "function",
  "function": {
    "name": "get_task",
    "description": "Get details of a specific task by ID. Use this when you need to retrieve information about a particular task.",
    "parameters": {
      "type": "object",
      "properties": {
        "task_id": {
          "type": "integer",
          "description": "The unique ID of the task to retrieve"
        }
      },
      "required": ["task_id"]
    }
  }
}
```

### Input Parameters

| Parameter | Type | Required | Constraints | Description |
|-----------|------|----------|-------------|-------------|
| task_id | integer | Yes | Positive integer | Task ID |

### Output Schema

**Success Response**:
```json
{
  "task": {
    "id": 42,
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "completed": false,
    "created_at": "2026-02-02T14:00:00Z",
    "updated_at": "2026-02-02T14:00:00Z"
  },
  "success": true
}
```

**Not Found Response**:
```json
{
  "success": false,
  "message": "Task not found with ID: 42"
}
```

**Error Response**:
```json
{
  "success": false,
  "message": "Failed to retrieve task: Database connection error"
}
```

### Implementation Signature

```python
def get_task(
    task_id: int,
    user_id: str = None,  # Injected by orchestrator
    db: Session = None     # Injected by orchestrator
) -> dict:
    """Get task from database by ID."""
```

### Database Operations
- SELECT from `todos` table WHERE `id` = ? AND `user_id` = ?

### Error Cases
- Task not found → Return error message
- Task belongs to different user → Return error message (security)
- Database error → Return error message

### Example Invocations

**User**: "Tell me more about task 42"
```json
{
  "task_id": 42
}
```

---

## Tool 4: update_task

### Purpose
Update task attributes (title, description, status).

### OpenAI Function Schema

```json
{
  "type": "function",
  "function": {
    "name": "update_task",
    "description": "Update task details or mark as complete/incomplete. Use this when the user wants to change task information or mark a task as done.",
    "parameters": {
      "type": "object",
      "properties": {
        "task_id": {
          "type": "integer",
          "description": "The unique ID of the task to update"
        },
        "title": {
          "type": "string",
          "description": "New task title (1-200 characters)"
        },
        "description": {
          "type": "string",
          "description": "New task description (max 2000 characters)"
        },
        "status": {
          "type": "string",
          "enum": ["pending", "completed"],
          "description": "New task status. Use 'completed' to mark as done, 'pending' to mark as incomplete."
        }
      },
      "required": ["task_id"]
    }
  }
}
```

### Input Parameters

| Parameter | Type | Required | Constraints | Description |
|-----------|------|----------|-------------|-------------|
| task_id | integer | Yes | Positive integer | Task ID |
| title | string | No | 1-200 chars | New task title |
| description | string | No | Max 2000 chars | New task description |
| status | string | No | "pending" or "completed" | New task status |

### Output Schema

**Success Response**:
```json
{
  "task": {
    "id": 42,
    "title": "Buy groceries",
    "description": "Milk, eggs, bread, cheese",
    "completed": true,
    "created_at": "2026-02-02T14:00:00Z",
    "updated_at": "2026-02-02T14:30:00Z"
  },
  "success": true,
  "message": "Updated task successfully"
}
```

**Not Found Response**:
```json
{
  "success": false,
  "message": "Task not found with ID: 42"
}
```

**Error Response**:
```json
{
  "success": false,
  "message": "Failed to update task: Title cannot be empty"
}
```

### Implementation Signature

```python
def update_task(
    task_id: int,
    title: str | None = None,
    description: str | None = None,
    status: str | None = None,
    user_id: str = None,  # Injected by orchestrator
    db: Session = None     # Injected by orchestrator
) -> dict:
    """Update task in database and return updated task."""
```

### Database Operations
- SELECT from `todos` table WHERE `id` = ? AND `user_id` = ? (verify ownership)
- UPDATE `todos` table SET fields WHERE `id` = ?
- UPDATE `updated_at` timestamp
- Commit transaction

### Error Cases
- Task not found → Return error message
- Task belongs to different user → Return error message (security)
- Invalid field values → Return error message
- Database error → Return error message

### Example Invocations

**User**: "Mark the groceries task as complete"
```json
{
  "task_id": 42,
  "status": "completed"
}
```

**User**: "Change the title of task 42 to 'Buy groceries and cook dinner'"
```json
{
  "task_id": 42,
  "title": "Buy groceries and cook dinner"
}
```

---

## Tool 5: delete_task

### Purpose
Remove a task from the database (destructive operation - requires confirmation).

### OpenAI Function Schema

```json
{
  "type": "function",
  "function": {
    "name": "delete_task",
    "description": "Delete a task permanently. IMPORTANT: Always ask for user confirmation before calling this tool, as deletion cannot be undone.",
    "parameters": {
      "type": "object",
      "properties": {
        "task_id": {
          "type": "integer",
          "description": "The unique ID of the task to delete"
        }
      },
      "required": ["task_id"]
    }
  }
}
```

### Input Parameters

| Parameter | Type | Required | Constraints | Description |
|-----------|------|----------|-------------|-------------|
| task_id | integer | Yes | Positive integer | Task ID |

### Output Schema

**Success Response**:
```json
{
  "success": true,
  "message": "Deleted task: Buy groceries"
}
```

**Not Found Response**:
```json
{
  "success": false,
  "message": "Task not found with ID: 42"
}
```

**Error Response**:
```json
{
  "success": false,
  "message": "Failed to delete task: Database connection error"
}
```

### Implementation Signature

```python
def delete_task(
    task_id: int,
    user_id: str = None,  # Injected by orchestrator
    db: Session = None     # Injected by orchestrator
) -> dict:
    """Delete task from database."""
```

### Database Operations
- SELECT from `todos` table WHERE `id` = ? AND `user_id` = ? (verify ownership and get title)
- DELETE from `todos` table WHERE `id` = ?
- Commit transaction

### Error Cases
- Task not found → Return error message
- Task belongs to different user → Return error message (security)
- Database error → Return error message

### Confirmation Requirement
**IMPORTANT**: The agent MUST ask for user confirmation before calling this tool. The confirmation flow is handled by the agent orchestrator using message metadata (see agent-behavior.md).

### Example Invocations

**User**: "Yes, delete it" (after confirmation prompt)
```json
{
  "task_id": 42
}
```

---

## Tool Registration

All tools are registered in the `AIAgentOrchestrator` class:

```python
class AIAgentOrchestrator:
    def _register_tools(self) -> dict:
        """Register tool functions with their schemas."""
        return {
            "create_task": {
                "schema": create_task_tool,
                "function": create_task
            },
            "list_tasks": {
                "schema": list_tasks_tool,
                "function": list_tasks
            },
            "get_task": {
                "schema": get_task_tool,
                "function": get_task
            },
            "update_task": {
                "schema": update_task_tool,
                "function": update_task
            },
            "delete_task": {
                "schema": delete_task_tool,
                "function": delete_task
            }
        }
```

---

## Stateless Guarantee

All tools are stateless and database-backed:

1. **No in-memory state**: Tools do not store any state between calls
2. **Database session injection**: Each tool receives a fresh database session
3. **User ID injection**: Each tool receives the authenticated user ID
4. **Immediate persistence**: All changes are committed to the database immediately
5. **Transaction safety**: Database operations are wrapped in transactions

---

## Error Handling Strategy

All tools follow consistent error handling:

```python
def tool_function(...) -> dict:
    try:
        # Validate inputs
        if not valid_input:
            return {"success": False, "message": "Validation error message"}

        # Perform database operation
        result = db.query(...)

        # Check result
        if not result:
            return {"success": False, "message": "Not found message"}

        # Return success
        return {"success": True, "message": "Success message", "data": result}

    except SQLAlchemyError as e:
        db.rollback()
        return {"success": False, "message": f"Database error: {str(e)}"}

    except Exception as e:
        return {"success": False, "message": f"Unexpected error: {str(e)}"}
```

---

## Security Considerations

1. **User ID Verification**: All tools verify that the task belongs to the authenticated user
2. **SQL Injection Prevention**: Use SQLModel ORM (no raw SQL)
3. **Input Validation**: Validate all inputs before database operations
4. **Error Messages**: Do not expose sensitive information in error messages
5. **Transaction Rollback**: Roll back on errors to maintain data integrity

---

## Performance Targets

| Tool | Target Latency | Database Operations |
|------|----------------|---------------------|
| create_task | <100ms | 1 INSERT |
| list_tasks | <100ms | 1 SELECT (with index) |
| get_task | <50ms | 1 SELECT (by primary key) |
| update_task | <100ms | 1 SELECT + 1 UPDATE |
| delete_task | <100ms | 1 SELECT + 1 DELETE |

---

## Tool Contract Validation Checklist

- [x] All 5 tools defined with OpenAI function schemas
- [x] Input parameters documented with types and constraints
- [x] Output schemas documented for success and error cases
- [x] Implementation signatures defined
- [x] Database operations specified
- [x] Error cases documented
- [x] Example invocations provided
- [x] Stateless guarantee documented
- [x] Security considerations addressed
- [x] Performance targets defined
- [x] Confirmation requirement for delete_task

**MCP tool contracts complete and ready for implementation.**
