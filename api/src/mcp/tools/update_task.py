"""
MCP Tool: update_task

Updates task attributes (title, description, status).
Stateless tool - receives database session as parameter.
Uses service layer for consistency with REST API.
"""
from typing import Dict, Any, Optional
from sqlmodel import Session
from src.services import todo_service
from src.schemas.todo import TodoUpdate


# OpenAI function schema for update_task tool
update_task_schema = {
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
                "completed": {
                    "type": "boolean",
                    "description": "Mark task as completed (true) or pending (false)"
                }
            },
            "required": ["task_id"]
        }
    }
}


async def update_task(
    task_id: int,
    title: Optional[str] = None,
    description: Optional[str] = None,
    completed: Optional[bool] = None,
    user_id: Optional[str] = None,
    db: Optional[Session] = None
) -> Dict[str, Any]:
    """
    Update task attributes using service layer.

    Args:
        task_id: Task ID (required)
        title: New task title (optional)
        description: New task description (optional)
        completed: New completion status (optional)
        user_id: User identifier (injected by orchestrator)
        db: Database session (injected by orchestrator)

    Returns:
        Dict with success status, updated task object, and message
    """
    try:
        # Build update data with only provided fields
        update_kwargs = {}
        if title is not None:
            update_kwargs['title'] = title
        if description is not None:
            update_kwargs['description'] = description
        if completed is not None:
            update_kwargs['completed'] = completed

        # Create TodoUpdate with only provided fields
        update_data = TodoUpdate(**update_kwargs)

        # Use service layer for update
        task = await todo_service.update_todo(db, task_id, update_data, user_id)

        if not task:
            return {
                "success": False,
                "message": f"Task not found with ID: {task_id}"
            }

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
            "message": "Updated task successfully"
        }

    except Exception as e:
        db.rollback()
        return {
            "success": False,
            "message": f"Failed to update task: {str(e)}"
        }
