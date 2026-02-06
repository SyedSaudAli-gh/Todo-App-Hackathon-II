"""
Conversation service for Phase III AI Chatbot.

Handles conversation and message persistence operations.
"""
from datetime import datetime
from typing import Optional, List
from uuid import UUID, uuid4
from sqlmodel import Session, select
from src.models.conversation import Conversation
from src.models.message import Message, MessageRole


class ConversationService:
    """
    Service for managing conversations and messages.

    Provides methods for creating conversations, retrieving conversation history,
    saving messages, and updating conversation timestamps.
    """

    def __init__(self, session: Session):
        """
        Initialize ConversationService.

        Args:
            session: Database session
        """
        self.session = session

    def create_conversation(self, user_id: str) -> Conversation:
        """
        Create a new conversation for a user.

        Args:
            user_id: User identifier from authentication system

        Returns:
            Conversation: Newly created conversation
        """
        conversation = Conversation(
            conversation_id=uuid4(),
            user_id=user_id,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        self.session.add(conversation)
        self.session.commit()
        self.session.refresh(conversation)
        return conversation

    def get_conversation(
        self,
        conversation_id: UUID,
        user_id: str
    ) -> Optional[Conversation]:
        """
        Get a conversation by ID with user ownership validation.

        Args:
            conversation_id: UUID of the conversation
            user_id: User identifier (for ownership validation)

        Returns:
            Optional[Conversation]: Conversation if found and owned by user, None otherwise
        """
        statement = select(Conversation).where(
            Conversation.conversation_id == conversation_id,
            Conversation.user_id == user_id
        )
        conversation = self.session.exec(statement).first()
        return conversation

    def get_conversation_history(
        self,
        conversation_id: UUID,
        limit: int = 20
    ) -> List[Message]:
        """
        Get conversation history (last N messages) in chronological order.

        Args:
            conversation_id: UUID of the conversation
            limit: Maximum number of messages to retrieve (default: 20)

        Returns:
            List[Message]: List of messages in chronological order (oldest first)
        """
        statement = (
            select(Message)
            .where(Message.conversation_id == conversation_id)
            .order_by(Message.timestamp.desc())
            .limit(limit)
        )
        messages = self.session.exec(statement).all()

        # Reverse to get chronological order (oldest first)
        return list(reversed(messages))

    def save_message(
        self,
        conversation_id: UUID,
        role: MessageRole,
        message_text: str,
        tool_calls: Optional[List[dict]] = None,
        message_metadata: Optional[dict] = None
    ) -> Message:
        """
        Save a message to the conversation.

        Args:
            conversation_id: UUID of the conversation
            role: Message role (user or assistant)
            message_text: Content of the message
            tool_calls: Optional array of MCP tool invocations
            message_metadata: Optional metadata (e.g., model version, token count)

        Returns:
            Message: Newly created message
        """
        message = Message(
            message_id=uuid4(),
            conversation_id=conversation_id,
            role=role,
            message_text=message_text,
            timestamp=datetime.utcnow(),
            tool_calls=tool_calls,
            message_metadata=message_metadata
        )
        self.session.add(message)
        self.session.commit()
        self.session.refresh(message)
        return message

    def update_conversation_timestamp(self, conversation_id: UUID) -> None:
        """
        Update the conversation's updated_at timestamp.

        Args:
            conversation_id: UUID of the conversation
        """
        statement = select(Conversation).where(
            Conversation.conversation_id == conversation_id
        )
        conversation = self.session.exec(statement).first()

        if conversation:
            conversation.updated_at = datetime.utcnow()
            self.session.add(conversation)
            self.session.commit()

    def get_user_conversations(
        self,
        user_id: str,
        limit: int = 50,
        offset: int = 0
    ) -> tuple[List[dict], int]:
        """
        Get all conversations for a user with pagination.

        Args:
            user_id: User identifier from authentication system
            limit: Maximum number of conversations to return (default: 50, max: 100)
            offset: Number of conversations to skip (default: 0)

        Returns:
            tuple: (list of conversation summaries, total count)
                Each summary is a dict with:
                - conversation_id: UUID
                - created_at: datetime
                - updated_at: datetime
                - message_count: int
                - preview: Optional[str] (first 100 chars of last message)
        """
        from sqlalchemy import func, desc

        # Get total count
        count_statement = select(func.count(Conversation.conversation_id)).where(
            Conversation.user_id == user_id
        )
        total = self.session.exec(count_statement).one()

        # Get conversations with pagination
        statement = (
            select(Conversation)
            .where(Conversation.user_id == user_id)
            .order_by(desc(Conversation.updated_at))
            .limit(limit)
            .offset(offset)
        )
        conversations = self.session.exec(statement).all()

        # Build summaries with message count and preview
        summaries = []
        for conv in conversations:
            # Get message count
            msg_count_statement = select(func.count(Message.message_id)).where(
                Message.conversation_id == conv.conversation_id
            )
            message_count = self.session.exec(msg_count_statement).one()

            # Get last message for preview
            last_msg_statement = (
                select(Message)
                .where(Message.conversation_id == conv.conversation_id)
                .order_by(desc(Message.timestamp))
                .limit(1)
            )
            last_message = self.session.exec(last_msg_statement).first()

            preview = None
            if last_message:
                # Get first 100 characters of last message
                preview = last_message.message_text[:100]

            summaries.append({
                "conversation_id": conv.conversation_id,
                "created_at": conv.created_at,
                "updated_at": conv.updated_at,
                "message_count": message_count,
                "preview": preview
            })

        return summaries, total

    def get_conversation_messages(
        self,
        conversation_id: UUID,
        limit: int = 100,
        offset: int = 0
    ) -> tuple[List[Message], int]:
        """
        Get messages for a specific conversation with pagination.

        Args:
            conversation_id: UUID of the conversation
            limit: Maximum number of messages to return (default: 100, max: 500)
            offset: Number of messages to skip (default: 0)

        Returns:
            tuple: (list of messages in chronological order, total count)
        """
        from sqlalchemy import func

        # Get total count
        count_statement = select(func.count(Message.message_id)).where(
            Message.conversation_id == conversation_id
        )
        total = self.session.exec(count_statement).one()

        # Get messages with pagination (chronological order - oldest first)
        statement = (
            select(Message)
            .where(Message.conversation_id == conversation_id)
            .order_by(Message.timestamp.asc())
            .limit(limit)
            .offset(offset)
        )
        messages = self.session.exec(statement).all()

        return list(messages), total

    def delete_conversation(self, conversation_id: UUID) -> None:
        """
        Delete a conversation and all its messages.

        Args:
            conversation_id: UUID of the conversation to delete

        Note:
            Messages will be cascade deleted if foreign key is configured with ondelete="CASCADE"
        """
        # Get the conversation
        statement = select(Conversation).where(
            Conversation.conversation_id == conversation_id
        )
        conversation = self.session.exec(statement).first()

        if conversation:
            # Delete all messages first (explicit delete)
            message_statement = select(Message).where(
                Message.conversation_id == conversation_id
            )
            messages = self.session.exec(message_statement).all()
            for message in messages:
                self.session.delete(message)

            # Delete the conversation
            self.session.delete(conversation)
            self.session.commit()
