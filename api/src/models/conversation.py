"""
Conversation SQLModel for Phase III AI Chatbot.

Represents a chat session between a user and the AI assistant.
Stores conversation metadata and serves as the parent entity for messages.
"""
from datetime import datetime
from typing import Optional, List
from uuid import UUID, uuid4
from sqlmodel import Field, SQLModel, Relationship


class Conversation(SQLModel, table=True):
    """
    Conversation entity for persistent storage.

    Attributes:
        conversation_id: Unique identifier (UUID)
        user_id: User identifier (required for multi-user support)
        created_at: Creation timestamp (UTC)
        updated_at: Last update timestamp (UTC)
    """
    __tablename__ = "conversations"

    # Primary Key
    conversation_id: UUID = Field(
        default_factory=uuid4,
        primary_key=True,
        index=True,
        description="Unique identifier for the conversation"
    )

    # User Association (required for multi-user support)
    user_id: str = Field(
        index=True,
        description="User identifier from authentication system"
    )

    # Timestamps
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        description="When the conversation was created (UTC)"
    )

    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        description="When the conversation was last updated (UTC)"
    )

    # Relationships
    messages: List["Message"] = Relationship(
        back_populates="conversation",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )
