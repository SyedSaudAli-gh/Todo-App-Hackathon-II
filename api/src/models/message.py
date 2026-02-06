"""
Message SQLModel for Phase III AI Chatbot.

Represents a single message in a conversation.
Stores message content, role, timestamp, and metadata about tool invocations.
"""
from datetime import datetime
from typing import Optional, List, Dict, Any
from uuid import UUID, uuid4
from enum import Enum
from sqlmodel import Field, SQLModel, Relationship, Column
from sqlalchemy import JSON
from sqlalchemy import Enum as SQLEnum


class MessageRole(str, Enum):
    """Message role enum."""
    USER = "user"
    ASSISTANT = "assistant"


class Message(SQLModel, table=True):
    """
    Message entity for persistent storage.

    Attributes:
        message_id: Unique identifier (UUID)
        conversation_id: Parent conversation ID (FK)
        role: Message sender role (user or assistant)
        message_text: Content of the message
        timestamp: When the message was sent (UTC)
        tool_calls: Array of MCP tool invocations (JSON)
        metadata: Additional metadata (JSON)
    """
    __tablename__ = "messages"

    # Primary Key
    message_id: UUID = Field(
        default_factory=uuid4,
        primary_key=True,
        index=True,
        description="Unique identifier for the message"
    )

    # Foreign Key
    conversation_id: UUID = Field(
        foreign_key="conversations.conversation_id",
        index=True,
        description="ID of the conversation this message belongs to"
    )

    # Message Content
    role: MessageRole = Field(
        sa_column=Column(SQLEnum(MessageRole), nullable=False),
        description="Role of the message sender (user or assistant)"
    )

    message_text: str = Field(
        max_length=10000,
        description="Content of the message"
    )

    # Timestamp
    timestamp: datetime = Field(
        default_factory=datetime.utcnow,
        index=True,
        description="When the message was sent (UTC)"
    )

    # Metadata
    tool_calls: Optional[List[Dict[str, Any]]] = Field(
        default=None,
        sa_column=Column(JSON),
        description="Array of MCP tool invocations (for assistant messages)"
    )

    message_metadata: Optional[Dict[str, Any]] = Field(
        default=None,
        sa_column=Column(JSON),
        description="Additional metadata (e.g., model version, token count)"
    )

    # Relationships
    conversation: Optional["Conversation"] = Relationship(
        back_populates="messages"
    )
