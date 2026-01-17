"""
Todo service layer for business logic and database operations.
"""
from typing import List, Optional
from datetime import datetime
from sqlmodel import Session, select
from src.models.todo import Todo
from src.schemas.todo import TodoCreate, TodoUpdate


async def create_todo(session: Session, todo_data: TodoCreate, user_id: str) -> Todo:
    """
    Create a new todo item for a specific user.

    Args:
        session: Database session
        todo_data: Todo creation data (title, description)
        user_id: User ID from authentication

    Returns:
        Created Todo instance with generated id and timestamps
    """
    todo = Todo(
        user_id=user_id,
        title=todo_data.title.strip(),
        description=todo_data.description.strip() if todo_data.description else None,
        completed=False,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )

    session.add(todo)
    session.commit()
    session.refresh(todo)

    return todo


async def list_todos(session: Session, user_id: str) -> List[Todo]:
    """
    List all todos for a specific user, sorted by creation date (newest first).

    Args:
        session: Database session
        user_id: User ID to filter todos

    Returns:
        List of Todo instances sorted by created_at DESC
    """
    statement = select(Todo).where(Todo.user_id == user_id).order_by(Todo.created_at.desc())
    results = session.exec(statement)
    todos = results.all()

    return list(todos)


async def get_todo_by_id(session: Session, todo_id: int, user_id: str) -> Optional[Todo]:
    """
    Get a single todo by ID for a specific user.

    Args:
        session: Database session
        todo_id: Todo ID to retrieve
        user_id: User ID to verify ownership

    Returns:
        Todo instance if found and owned by user, None otherwise
    """
    statement = select(Todo).where(Todo.id == todo_id, Todo.user_id == user_id)
    result = session.exec(statement)
    todo = result.first()

    return todo


async def update_todo(session: Session, todo_id: int, todo_data: TodoUpdate, user_id: str) -> Optional[Todo]:
    """
    Update an existing todo with partial data for a specific user.

    Args:
        session: Database session
        todo_id: Todo ID to update
        todo_data: Partial update data (title, description, completed)
        user_id: User ID to verify ownership

    Returns:
        Updated Todo instance if found and owned by user, None otherwise
    """
    todo = await get_todo_by_id(session, todo_id, user_id)

    if not todo:
        return None

    # Update only provided fields
    update_data = todo_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        if field == "title" and value is not None:
            setattr(todo, field, value.strip())
        elif field == "description" and value is not None:
            setattr(todo, field, value.strip() if value else None)
        else:
            setattr(todo, field, value)

    # Always update the updated_at timestamp
    todo.updated_at = datetime.utcnow()

    session.add(todo)
    session.commit()
    session.refresh(todo)

    return todo


async def delete_todo(session: Session, todo_id: int, user_id: str) -> bool:
    """
    Delete a todo by ID for a specific user.

    Args:
        session: Database session
        todo_id: Todo ID to delete
        user_id: User ID to verify ownership

    Returns:
        True if deleted, False if not found or not owned by user
    """
    todo = await get_todo_by_id(session, todo_id, user_id)

    if not todo:
        return False

    session.delete(todo)
    session.commit()

    return True
