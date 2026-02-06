"""
MCP Tool: list_tasks

Lists all tasks or filters by status (pending/completed).
Stateless tool - receives database session as parameter.
Uses service layer for consistency with REST API.
"""
from typing import Dict, Any, Optional
from sqlmodel import Session
from services import todo_service


# OpenAI function schema for list_tasks tool
list_tasks_schema = {
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


async def list_tasks(
    status: str = "all",
    user_id: Optional[str] = None,
    db: Optional[Session] = None
) -> Dict[str, Any]:
    """
    List all tasks or filter by status using service layer.

    Args:
        status: Status filter ("all", "pending", or "completed", default: "all")
        user_id: User identifier (injected by orchestrator)
        db: Database session (injected by orchestrator)

    Returns:
        Dict with success status, tasks array, and count
    """
    try:
        # Validate status
        if status not in ["all", "pending", "completed"]:
            return {
                "success": False,
                "message": "Invalid status. Must be 'all', 'pending', or 'completed'"
            }

        # Use service layer to get all tasks
        all_tasks = await todo_service.list_todos(db, user_id)

        # Apply status filter
        if status == "pending":
            tasks = [task for task in all_tasks if not task.completed]
        elif status == "completed":
            tasks = [task for task in all_tasks if task.completed]
        else:
            tasks = all_tasks

        # Format tasks for response
        tasks_list = [
            {
                "id": task.id,
                "title": task.title,
                "description": task.description,
                "completed": task.completed,
                "created_at": task.created_at.isoformat(),
                "updated_at": task.updated_at.isoformat()
            }
            for task in tasks
        ]

        return {
            "tasks": tasks_list,
            "count": len(tasks_list),
            "success": True
        }

    except Exception as e:
        return {
            "success": False,
            "message": f"Failed to retrieve tasks: {str(e)}"
        }
