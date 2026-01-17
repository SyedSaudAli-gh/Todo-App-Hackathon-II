"""
Todo API router with CRUD endpoints.
"""
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from src.database import get_session
from src.middleware.auth import get_current_user_id
from src.schemas.todo import TodoCreate, TodoUpdate, TodoResponse, TodoListResponse
from src.services import todo_service


router = APIRouter()


@router.post(
    "/todos",
    response_model=TodoResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new todo",
    description="Create a new todo item with title and optional description. [TEMPORARY] Authentication bypassed for testing - uses test-user as default user_id.",
)
async def create_todo(
    todo_data: TodoCreate,
    session: Annotated[Session, Depends(get_session)],
) -> TodoResponse:
    """
    Create a new todo item. [TEMPORARY] Authentication bypassed for testing.

    Args:
        todo_data: Todo creation data (title, description)
        session: Database session (injected)

    Returns:
        Created todo with id and timestamps

    Raises:
        422: Validation error (empty title, title >200 chars, description >2000 chars)
    """
    # TEMPORARY: Bypass authentication for testing
    user_id = "test-user"

    todo = await todo_service.create_todo(session, todo_data, user_id)
    return TodoResponse.model_validate(todo)


@router.get(
    "/todos",
    response_model=TodoListResponse,
    summary="List all todos",
    description="Get all todos, sorted by creation date (newest first). [TEMPORARY] Authentication bypassed for testing - uses test-user as default user_id.",
)
async def list_todos(
    session: Annotated[Session, Depends(get_session)],
) -> TodoListResponse:
    """
    List all todos. [TEMPORARY] Authentication bypassed for testing.

    Args:
        session: Database session (injected)

    Returns:
        List of todos with total count
    """
    # TEMPORARY: Bypass authentication for testing
    user_id = "test-user"

    todos = await todo_service.list_todos(session, user_id)
    return TodoListResponse(
        todos=[TodoResponse.model_validate(todo) for todo in todos],
        total=len(todos),
    )


@router.get(
    "/todos/{todo_id}",
    response_model=TodoResponse,
    summary="Get a single todo",
    description="Get a todo by ID. [TEMPORARY] Authentication bypassed for testing - uses test-user as default user_id.",
)
async def get_todo(
    todo_id: int,
    session: Annotated[Session, Depends(get_session)],
) -> TodoResponse:
    """
    Get a single todo by ID. [TEMPORARY] Authentication bypassed for testing.

    Args:
        todo_id: Todo ID to retrieve
        session: Database session (injected)

    Returns:
        Todo with specified ID

    Raises:
        404: Todo not found or not owned by user
    """
    # TEMPORARY: Bypass authentication for testing
    user_id = "test-user"

    todo = await todo_service.get_todo_by_id(session, todo_id, user_id)

    if not todo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Todo with id {todo_id} not found",
        )

    return TodoResponse.model_validate(todo)


@router.patch(
    "/todos/{todo_id}",
    response_model=TodoResponse,
    summary="Update a todo",
    description="Update a todo's title, description, or completion status. [TEMPORARY] Authentication bypassed for testing - uses test-user as default user_id.",
)
async def update_todo(
    todo_id: int,
    todo_data: TodoUpdate,
    session: Annotated[Session, Depends(get_session)],
) -> TodoResponse:
    """
    Update an existing todo with partial data. [TEMPORARY] Authentication bypassed for testing.

    Args:
        todo_id: Todo ID to update
        todo_data: Partial update data (title, description, completed)
        session: Database session (injected)

    Returns:
        Updated todo

    Raises:
        404: Todo not found or not owned by user
        422: Validation error (empty title, title >200 chars, description >2000 chars)
    """
    # TEMPORARY: Bypass authentication for testing
    user_id = "test-user"

    todo = await todo_service.update_todo(session, todo_id, todo_data, user_id)

    if not todo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Todo with id {todo_id} not found",
        )

    return TodoResponse.model_validate(todo)


@router.delete(
    "/todos/{todo_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a todo",
    description="Delete a todo by ID. [TEMPORARY] Authentication bypassed for testing - uses test-user as default user_id.",
)
async def delete_todo(
    todo_id: int,
    session: Annotated[Session, Depends(get_session)],
) -> None:
    """
    Delete a todo by ID. [TEMPORARY] Authentication bypassed for testing.

    Args:
        todo_id: Todo ID to delete
        session: Database session (injected)

    Raises:
        404: Todo not found or not owned by user
    """
    # TEMPORARY: Bypass authentication for testing
    user_id = "test-user"

    deleted = await todo_service.delete_todo(session, todo_id, user_id)

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Todo with id {todo_id} not found",
        )
