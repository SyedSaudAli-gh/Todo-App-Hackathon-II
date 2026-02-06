"""
Todo API router with CRUD endpoints.
All endpoints require JWT authentication with user_id extracted from 'sub' claim.
"""
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from src.database import get_session
from src.dependencies import get_current_user_id
from src.schemas.todo import TodoCreate, TodoUpdate, TodoResponse, TodoListResponse
from src.services import todo_service


router = APIRouter()


@router.post(
    "/tasks",
    response_model=TodoResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new todo",
    description="Create a new todo item with title and optional description. Requires JWT authentication.",
)
async def create_todo(
    todo_data: TodoCreate,
    session: Annotated[Session, Depends(get_session)],
    user_id: Annotated[str, Depends(get_current_user_id)],
) -> TodoResponse:
    """
    Create a new todo item for the authenticated user.

    Args:
        todo_data: Todo creation data (title, description)
        session: Database session (injected)
        user_id: Authenticated user ID from JWT (injected)

    Returns:
        Created todo with id and timestamps

    Raises:
        401: Not authenticated or invalid JWT token
        422: Validation error (empty title, title >200 chars, description >2000 chars)
    """
    todo = await todo_service.create_todo(session, todo_data, user_id)
    return TodoResponse.model_validate(todo)


@router.get(
    "/tasks",
    response_model=TodoListResponse,
    summary="List all todos",
    description="Get all todos for the authenticated user, sorted by creation date (newest first). Requires JWT authentication.",
)
async def list_todos(
    session: Annotated[Session, Depends(get_session)],
    user_id: Annotated[str, Depends(get_current_user_id)],
) -> TodoListResponse:
    """
    List all todos for the authenticated user.

    Args:
        session: Database session (injected)
        user_id: Authenticated user ID from JWT (injected)

    Returns:
        List of todos with total count

    Raises:
        401: Not authenticated or invalid JWT token
    """
    todos = await todo_service.list_todos(session, user_id)
    return TodoListResponse(
        todos=[TodoResponse.model_validate(todo) for todo in todos],
        total=len(todos),
    )


@router.get(
    "/tasks/{todo_id}",
    response_model=TodoResponse,
    summary="Get a single todo",
    description="Get a todo by ID. Only returns todos owned by the authenticated user. Requires JWT authentication.",
)
async def get_todo(
    todo_id: int,
    session: Annotated[Session, Depends(get_session)],
    user_id: Annotated[str, Depends(get_current_user_id)],
) -> TodoResponse:
    """
    Get a single todo by ID for the authenticated user.

    Args:
        todo_id: Todo ID to retrieve
        session: Database session (injected)
        user_id: Authenticated user ID from JWT (injected)

    Returns:
        Todo with specified ID

    Raises:
        401: Not authenticated or invalid JWT token
        404: Todo not found or not owned by user
    """
    todo = await todo_service.get_todo_by_id(session, todo_id, user_id)

    if not todo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Todo with id {todo_id} not found",
        )

    return TodoResponse.model_validate(todo)


@router.patch(
    "/tasks/{todo_id}",
    response_model=TodoResponse,
    summary="Update a todo (PATCH)",
    description="Update a todo's title, description, or completion status. Only updates todos owned by the authenticated user. Requires JWT authentication.",
)
async def update_todo(
    todo_id: int,
    todo_data: TodoUpdate,
    session: Annotated[Session, Depends(get_session)],
    user_id: Annotated[str, Depends(get_current_user_id)],
) -> TodoResponse:
    """
    Update an existing todo with partial data for the authenticated user.

    Args:
        todo_id: Todo ID to update
        todo_data: Partial update data (title, description, completed)
        session: Database session (injected)
        user_id: Authenticated user ID from JWT (injected)

    Returns:
        Updated todo

    Raises:
        401: Not authenticated or invalid JWT token
        404: Todo not found or not owned by user
        422: Validation error (empty title, title >200 chars, description >2000 chars)
    """
    todo = await todo_service.update_todo(session, todo_id, todo_data, user_id)

    if not todo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Todo with id {todo_id} not found",
        )

    return TodoResponse.model_validate(todo)


@router.put(
    "/tasks/{todo_id}",
    response_model=TodoResponse,
    summary="Update a todo (PUT)",
    description="Update a todo's title, description, or completion status. Only updates todos owned by the authenticated user. Requires JWT authentication.",
)
async def update_todo_put(
    todo_id: int,
    todo_data: TodoUpdate,
    session: Annotated[Session, Depends(get_session)],
    user_id: Annotated[str, Depends(get_current_user_id)],
) -> TodoResponse:
    """
    Update an existing todo with partial data for the authenticated user (PUT method).

    Args:
        todo_id: Todo ID to update
        todo_data: Partial update data (title, description, completed)
        session: Database session (injected)
        user_id: Authenticated user ID from JWT (injected)

    Returns:
        Updated todo

    Raises:
        401: Not authenticated or invalid JWT token
        404: Todo not found or not owned by user
        422: Validation error (empty title, title >200 chars, description >2000 chars)
    """
    todo = await todo_service.update_todo(session, todo_id, todo_data, user_id)

    if not todo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Todo with id {todo_id} not found",
        )

    return TodoResponse.model_validate(todo)


@router.delete(
    "/tasks/{todo_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a todo",
    description="Delete a todo by ID. Only deletes todos owned by the authenticated user. Requires JWT authentication.",
)
async def delete_todo(
    todo_id: int,
    session: Annotated[Session, Depends(get_session)],
    user_id: Annotated[str, Depends(get_current_user_id)],
) -> None:
    """
    Delete a todo by ID for the authenticated user.

    Args:
        todo_id: Todo ID to delete
        session: Database session (injected)
        user_id: Authenticated user ID from JWT (injected)

    Raises:
        401: Not authenticated or invalid JWT token
        404: Todo not found or not owned by user
    """
    deleted = await todo_service.delete_todo(session, todo_id, user_id)

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Todo with id {todo_id} not found",
        )
