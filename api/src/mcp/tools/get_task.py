"""
MCP Tool: get_task

Retrieves details of a specific task by ID.
Stateless tool - receives database session as parameter.
Uses service layer for consistency with REST API.
"""
from typing import Dict, Any, Optional
from sqlmodel import Session
from ...services import todo_service


# OpenAI function schema for get_task tool
get_task_schema = {
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


async def get_task(
    task_id: int,
    user_id: Optional[str] = None,
    db: Optional[Session] = None
) -> Dict[str, Any]:
    """
    Get a specific task by ID using service layer.

    Args:
        task_id: Task ID
        user_id: User identifier (injected by orchestrator)
        db: Database session (injected by orchestrator)

    Returns:
        Dict with success status and task object or error message
    """
    try:
        # Use service layer to get task
        task = await todo_service.get_todo_by_id(db, task_id, user_id)

        if not task:
            return {
                "success": False,
                "message": f"Task not found with ID: {task_id}"
            }

        # Format task for response
        return {
            "task": {
                "id": task.id,
                "title": task.title,
                "description": task.description,
                "completed": task.completed,
                "created_at": task.created_at.isoformat(),
                "updated_at": task.updated_at.isoformat()
            },
            "success": True
        }

    except Exception as e:
        return {
            "success": False,
            "message": f"Failed to retrieve task: {str(e)}"
        }
