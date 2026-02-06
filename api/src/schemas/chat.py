"""
Chat API Pydantic schemas for Phase III AI Chatbot.

Request and response models for the chat endpoint.
"""
from datetime import datetime
from typing import Optional, List, Dict, Any
from uuid import UUID
from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    """
    Request schema for POST /api/v1/chat endpoint.

    Attributes:
        conversation_id: Optional UUID of existing conversation
        message: User's message to the AI assistant (required, 1-10,000 characters)
    """
    conversation_id: Optional[UUID] = Field(
        default=None,
        description="Optional UUID of existing conversation. If not provided, a new conversation is created."
    )

    message: str = Field(
        min_length=1,
        max_length=10000,
        description="User's message to the AI assistant"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "conversation_id": "550e8400-e29b-41d4-a716-446655440000",
                "message": "Create a todo to buy groceries tomorrow"
            }
        }


class ToolCall(BaseModel):
    """
    Schema for MCP tool invocation metadata.

    Attributes:
        tool_name: Name of the MCP tool that was invoked
        arguments: Arguments passed to the tool
        result: Result of the tool invocation (dict or string)
    """
    tool_name: str = Field(
        description="Name of the MCP tool (e.g., create_task, list_tasks)"
    )

    arguments: Dict[str, Any] = Field(
        default_factory=dict,
        description="Arguments passed to the tool"
    )

    result: Dict[str, Any] | str = Field(
        description="Result of the tool invocation"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "tool_name": "create_task",
                "arguments": {
                    "title": "Buy groceries"
                },
                "result": {"success": True, "task_id": 1}
            }
        }


class ChatResponse(BaseModel):
    """
    Response schema for POST /api/v1/chat endpoint.

    Attributes:
        conversation_id: UUID of the conversation
        response: AI assistant's response message
        tool_calls: Array of MCP tool invocations made during processing
        timestamp: ISO 8601 timestamp when the message was processed (UTC)
    """
    conversation_id: UUID = Field(
        description="UUID of the conversation"
    )

    response: str = Field(
        description="AI assistant's response to the user's message"
    )

    tool_calls: List[ToolCall] = Field(
        default_factory=list,
        description="Array of MCP tool invocations (empty if no tools were invoked)"
    )

    timestamp: datetime = Field(
        description="ISO 8601 timestamp when the message was processed (UTC)"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "conversation_id": "550e8400-e29b-41d4-a716-446655440000",
                "response": "I've created a todo for you to buy groceries tomorrow. The task has been added to your list.",
                "tool_calls": [
                    {
                        "tool": "create_todo",
                        "parameters": {
                            "title": "Buy groceries",
                            "due_date": "2026-01-30"
                        },
                        "result": "success"
                    }
                ],
                "timestamp": "2026-01-29T10:00:05Z"
            }
        }


class ChatErrorResponse(BaseModel):
    """
    Error response schema for chat endpoint failures.

    Attributes:
        error: High-level error category
        code: Machine-readable error code
        message: Human-readable error message
        timestamp: ISO 8601 timestamp when the error occurred (UTC)
    """
    error: str = Field(
        description="High-level error category"
    )

    code: str = Field(
        description="Machine-readable error code for programmatic handling"
    )

    message: str = Field(
        description="Human-readable error message"
    )

    timestamp: datetime = Field(
        description="ISO 8601 timestamp when the error occurred (UTC)"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "error": "Conversation not found",
                "code": "CONVERSATION_NOT_FOUND",
                "message": "The conversation ID you provided does not exist or you do not have access to it.",
                "timestamp": "2026-01-29T10:00:00Z"
            }
        }


class ConversationSummary(BaseModel):
    """
    Summary schema for conversation list items.

    Attributes:
        conversation_id: UUID of the conversation
        created_at: When the conversation was created (UTC)
        updated_at: When the conversation was last updated (UTC)
        message_count: Total number of messages in the conversation
        preview: Preview text from the last message (first 100 characters)
    """
    conversation_id: UUID = Field(
        description="UUID of the conversation"
    )

    created_at: datetime = Field(
        description="When the conversation was created (UTC)"
    )

    updated_at: datetime = Field(
        description="When the conversation was last updated (UTC)"
    )

    message_count: int = Field(
        ge=0,
        description="Total number of messages in this conversation"
    )

    preview: Optional[str] = Field(
        default=None,
        max_length=100,
        description="Preview text from the last message (first 100 characters)"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "conversation_id": "550e8400-e29b-41d4-a716-446655440000",
                "created_at": "2026-02-05T10:00:00Z",
                "updated_at": "2026-02-05T10:30:00Z",
                "message_count": 10,
                "preview": "Can you help me create a task for..."
            }
        }


class ConversationListResponse(BaseModel):
    """
    Response schema for GET /api/v1/chat/conversations endpoint.

    Attributes:
        conversations: List of conversation summaries
        total: Total number of conversations for this user
        limit: Number of conversations returned in this response
        offset: Number of conversations skipped
    """
    conversations: List[ConversationSummary] = Field(
        description="List of conversation summaries"
    )

    total: int = Field(
        ge=0,
        description="Total number of conversations for this user"
    )

    limit: int = Field(
        ge=1,
        le=100,
        description="Number of conversations returned in this response"
    )

    offset: int = Field(
        ge=0,
        description="Number of conversations skipped"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "conversations": [
                    {
                        "conversation_id": "550e8400-e29b-41d4-a716-446655440000",
                        "created_at": "2026-02-05T10:00:00Z",
                        "updated_at": "2026-02-05T10:30:00Z",
                        "message_count": 10,
                        "preview": "Can you help me create a task for..."
                    }
                ],
                "total": 150,
                "limit": 50,
                "offset": 0
            }
        }


class MessageResponse(BaseModel):
    """
    Schema for a single message in conversation history.

    Attributes:
        message_id: UUID of the message
        role: Message sender role (user or assistant)
        message_text: Content of the message
        timestamp: When the message was sent (UTC)
    """
    message_id: UUID = Field(
        description="UUID of the message"
    )

    role: str = Field(
        description="Message sender role (user or assistant)"
    )

    message_text: str = Field(
        description="Content of the message"
    )

    timestamp: datetime = Field(
        description="When the message was sent (UTC)"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "message_id": "660e8400-e29b-41d4-a716-446655440000",
                "role": "user",
                "message_text": "Create a task to buy groceries",
                "timestamp": "2026-02-05T10:00:00Z"
            }
        }


class MessageListResponse(BaseModel):
    """
    Response schema for GET /api/v1/chat/conversations/{id}/messages endpoint.

    Attributes:
        conversation_id: UUID of the conversation
        messages: List of messages in chronological order
        total: Total number of messages in this conversation
        limit: Number of messages returned in this response
        offset: Number of messages skipped
    """
    conversation_id: UUID = Field(
        description="UUID of the conversation"
    )

    messages: List[MessageResponse] = Field(
        description="List of messages in chronological order"
    )

    total: int = Field(
        ge=0,
        description="Total number of messages in this conversation"
    )

    limit: int = Field(
        ge=1,
        le=500,
        description="Number of messages returned in this response"
    )

    offset: int = Field(
        ge=0,
        description="Number of messages skipped"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "conversation_id": "550e8400-e29b-41d4-a716-446655440000",
                "messages": [
                    {
                        "message_id": "660e8400-e29b-41d4-a716-446655440000",
                        "role": "user",
                        "message_text": "Create a task to buy groceries",
                        "timestamp": "2026-02-05T10:00:00Z"
                    }
                ],
                "total": 10,
                "limit": 100,
                "offset": 0
            }
        }
