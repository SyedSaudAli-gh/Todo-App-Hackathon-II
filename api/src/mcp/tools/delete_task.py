"""
MCP Tool: delete_task

Deletes a task from the database.
Stateless tool - receives database session as parameter.
Uses service layer for consistency with REST API.

IMPORTANT: Agent MUST ask for user confirmation before calling this tool.
"""
from typing import Dict, Any, Optional
from sqlmodel import Session
from src.services import todo_service


# OpenAI function schema for delete_task tool
delete_task_schema = {
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


async def delete_task(
    task_id: int,
    user_id: Optional[str] = None,
    db: Optional[Session] = None
) -> Dict[str, Any]:
    """
    Delete a task using service layer.

    Args:
        task_id: Task ID
        user_id: User identifier (injected by orchestrator)
        db: Database session (injected by orchestrator)

    Returns:
        Dict with success status and message
    """
    try:
        # Get task first to get title for confirmation message
        task = await todo_service.get_todo_by_id(db, task_id, user_id)

        if not task:
            return {
                "success": False,
                "message": f"Task not found with ID: {task_id}"
            }

        task_title = task.title

        # Use service layer for deletion
        deleted = await todo_service.delete_todo(db, task_id, user_id)

        if not deleted:
            return {
                "success": False,
                "message": f"Failed to delete task with ID: {task_id}"
            }

        return {
            "success": True,
            "message": f"Deleted task: {task_title}"
        }

    except Exception as e:
        db.rollback()
        return {
            "success": False,
            "message": f"Failed to delete task: {str(e)}"
        }
