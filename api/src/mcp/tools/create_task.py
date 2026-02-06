"""
MCP Tool: create_task

Creates a new todo task in the database.
Stateless tool - receives database session as parameter.
Uses service layer for consistency with REST API.
"""
from typing import Dict, Any, Optional
from sqlmodel import Session
from ...services import todo_service
from ...schemas.todo import TodoCreate


# OpenAI function schema for create_task tool
create_task_schema = {
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
                }
            },
            "required": ["title"]
        }
    }
}


async def create_task(
    title: str,
    description: Optional[str] = None,
    user_id: Optional[str] = None,
    db: Optional[Session] = None
) -> Dict[str, Any]:
    """
    Create a new todo task using service layer.

    Args:
        title: Task title (required, 1-200 characters)
        description: Optional task description (max 2000 characters)
        user_id: User identifier (injected by orchestrator)
        db: Database session (injected by orchestrator)

    Returns:
        Dict with success status, task_id, and message
    """
    try:
        # Create TodoCreate schema
        todo_data = TodoCreate(
            title=title,
            description=description
        )

        # Use service layer for creation
        task = await todo_service.create_todo(db, todo_data, user_id)

        return {
            "task": {
                "id": task.id,
                "title": task.title,
                "description": task.description,
                "completed": task.completed,
                "created_at": task.created_at.isoformat(),
                "updated_at": task.updated_at.isoformat()
            },
            "success": True,
            "message": f"Created task: {task.title}"
        }

    except Exception as e:
        db.rollback()
        return {
            "success": False,
            "message": f"Failed to create task: {str(e)}"
        }
