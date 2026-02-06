"""
Chat router for Phase III AI Chatbot.

Provides POST /api/v1/chat endpoint for AI-powered todo management.
"""
from datetime import datetime
from typing import Annotated
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from ..database import get_session
from ..dependencies import get_current_user
from ..schemas.chat import (
    ChatRequest,
    ChatResponse,
    ChatErrorResponse,
    ConversationListResponse,
    ConversationSummary,
    MessageListResponse,
    MessageResponse
)
from ..services.conversation import ConversationService
from ..ai.orchestrator import AIAgentOrchestrator
from ..ai.context import ConversationContextBuilder
from ..ai.errors import AIAgentTimeoutError
from ..models.message import MessageRole

router = APIRouter()


@router.post(
    "/chat",
    response_model=ChatResponse,
    status_code=status.HTTP_200_OK,
    summary="Send message to AI assistant",
    description="Send a message to the AI assistant for todo management. Creates new conversation if conversation_id not provided.",
    responses={
        200: {"description": "Message processed successfully"},
        400: {"description": "Bad request - Invalid input"},
        404: {"description": "Not found - Conversation does not exist or user does not own it"},
        422: {"description": "Unprocessable entity - Validation error"},
        500: {"description": "Internal server error - AI agent failure or database error"}
    }
)
async def send_chat_message(
    request: ChatRequest,
    session: Annotated[Session, Depends(get_session)],
    user_id: Annotated[str, Depends(get_current_user)]
) -> ChatResponse:
    """
    Send a message to the AI assistant and receive a response.

    Args:
        request: Chat request with optional conversation_id and required message
        session: Database session
        user_id: Authenticated user ID from JWT (injected)

    Returns:
        ChatResponse: AI response with conversation_id, response text, tool_calls, and timestamp

    Raises:
        HTTPException: Various status codes for different error conditions
    """
    import logging
    logger = logging.getLogger(__name__)

    logger.info(f"🎯 Chat endpoint called for user: {user_id}")
    logger.info(f"📝 Message: {request.message}")
    logger.info(f"💬 Conversation ID: {request.conversation_id}")

    # Initialize services
    conversation_service = ConversationService(session)
    ai_orchestrator = AIAgentOrchestrator()
    context_builder = ConversationContextBuilder()

    try:
        logger.info("✅ Step 1: Services initialized")
        # Validate message is not empty
        if not request.message or not request.message.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Message cannot be empty"
            )

        # Validate message length
        if len(request.message) > 10000:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Message exceeds maximum length of 10,000 characters"
            )

        # Get or create conversation
        if request.conversation_id:
            logger.info(f"✅ Step 2: Validating existing conversation: {request.conversation_id}")
            # Validate conversation_id format (UUID)
            try:
                conversation_id_uuid = UUID(str(request.conversation_id))
            except (ValueError, AttributeError):
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail="Invalid conversation_id format. Must be a valid UUID."
                )

            # Existing conversation - validate ownership
            conversation = conversation_service.get_conversation(
                request.conversation_id,
                user_id
            )
            if not conversation:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Conversation not found or you do not have access to it"
                )
            logger.info(f"✅ Step 2: Conversation validated")
        else:
            # New conversation
            logger.info("✅ Step 2: Creating new conversation")
            conversation = conversation_service.create_conversation(user_id)
            logger.info(f"✅ Step 2: New conversation created: {conversation.conversation_id}")

        # Get conversation history
        logger.info("✅ Step 3: Loading conversation history")
        history_messages = conversation_service.get_conversation_history(
            conversation.conversation_id,
            limit=20
        )
        logger.info(f"✅ Step 3: Loaded {len(history_messages)} messages")

        # Build conversation context
        logger.info("✅ Step 4: Building conversation context")
        conversation_context = context_builder.build_context(
            history_messages,
            system_prompt=context_builder.get_default_system_prompt()
        )
        logger.info(f"✅ Step 4: Context built with {len(conversation_context)} messages")

        # Save user message
        logger.info("✅ Step 5: Saving user message")
        conversation_service.save_message(
            conversation.conversation_id,
            MessageRole.USER,
            request.message
        )
        logger.info("✅ Step 5: User message saved")

        # Process message with AI agent
        logger.info("✅ Step 6: Calling AI orchestrator")
        try:
            ai_result = await ai_orchestrator.process_message(
                request.message,
                conversation_context,
                user_id=user_id,
                db=session,
                timeout=15
            )
            logger.info(f"✅ Step 6: AI response received: {ai_result['response'][:50]}...")
        except Exception as ai_error:
            # EMERGENCY: Return 200 with error message instead of 500
            logger.error(f"❌ AI error (returning as message): {str(ai_error)}")
            error_response = f"AI error: {str(ai_error)}"

            # Save error as assistant message
            conversation_service.save_message(
                conversation.conversation_id,
                MessageRole.ASSISTANT,
                error_response
            )

            return ChatResponse(
                conversation_id=conversation.conversation_id,
                response=error_response,
                tool_calls=[],
                timestamp=datetime.utcnow()
            )

        # Save AI response
        logger.info("✅ Step 7: Saving AI response")
        conversation_service.save_message(
            conversation.conversation_id,
            MessageRole.ASSISTANT,
            ai_result["response"],
            tool_calls=ai_result.get("tool_calls", [])
        )
        logger.info("✅ Step 7: AI response saved")

        # Update conversation timestamp
        logger.info("✅ Step 8: Updating conversation timestamp")
        conversation_service.update_conversation_timestamp(
            conversation.conversation_id
        )
        logger.info("✅ Step 8: Timestamp updated")

        # Return response
        logger.info("✅ Step 9: Returning response to client")
        return ChatResponse(
            conversation_id=conversation.conversation_id,
            response=ai_result["response"],
            tool_calls=ai_result.get("tool_calls", []),
            timestamp=datetime.utcnow()
        )

    except HTTPException as e:
        # Re-raise HTTP exceptions but log them
        logger.error(f"❌ HTTP exception: {e.status_code} - {e.detail}")
        raise
    except Exception as e:
        # EMERGENCY: Return 200 with error message instead of 500
        logger.error(f"❌ Unexpected error (returning as message): {str(e)}", exc_info=True)

        # Return error as chat response instead of throwing 500
        return ChatResponse(
            conversation_id=request.conversation_id or "error",
            response=f"System error: {str(e)}",
            tool_calls=[],
            timestamp=datetime.utcnow()
        )


@router.get(
    "/conversations",
    response_model=ConversationListResponse,
    status_code=status.HTTP_200_OK,
    summary="List user conversations",
    description="Retrieve all conversations for the authenticated user with pagination support.",
    responses={
        200: {"description": "Successfully retrieved conversation list"},
        401: {"description": "Unauthorized - Invalid or missing authentication token"},
        422: {"description": "Unprocessable entity - Invalid query parameters"},
        500: {"description": "Internal server error"}
    }
)
async def get_conversations(
    session: Annotated[Session, Depends(get_session)],
    user_id: Annotated[str, Depends(get_current_user)],
    limit: int = 50,
    offset: int = 0
) -> ConversationListResponse:
    """
    List all conversations for the authenticated user.

    Args:
        session: Database session
        user_id: Authenticated user ID from JWT (injected)
        limit: Maximum number of conversations to return (default: 50, max: 100)
        offset: Number of conversations to skip (default: 0)

    Returns:
        ConversationListResponse: List of conversations with pagination metadata

    Raises:
        HTTPException: 422 if invalid parameters, 500 if database error
    """
    import logging
    logger = logging.getLogger(__name__)

    logger.info(f"📋 Get conversations called for user: {user_id}")

    # Validate pagination parameters
    if limit < 1 or limit > 100:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Invalid limit value. Must be between 1 and 100."
        )

    if offset < 0:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Invalid offset value. Must be >= 0."
        )

    try:
        conversation_service = ConversationService(session)
        summaries, total = conversation_service.get_user_conversations(
            user_id=user_id,
            limit=limit,
            offset=offset
        )

        # Convert summaries to Pydantic models
        conversation_summaries = [
            ConversationSummary(**summary) for summary in summaries
        ]

        logger.info(f"✅ Retrieved {len(conversation_summaries)} conversations (total: {total})")

        return ConversationListResponse(
            conversations=conversation_summaries,
            total=total,
            limit=limit,
            offset=offset
        )

    except Exception as e:
        logger.error(f"❌ Error retrieving conversations: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database connection error"
        )


@router.get(
    "/conversations/{conversation_id}/messages",
    response_model=MessageListResponse,
    status_code=status.HTTP_200_OK,
    summary="Get conversation messages",
    description="Retrieve all messages for a specific conversation owned by the authenticated user.",
    responses={
        200: {"description": "Successfully retrieved messages"},
        401: {"description": "Unauthorized - Invalid or missing authentication token"},
        404: {"description": "Not found - Conversation does not exist or user does not have access"},
        422: {"description": "Unprocessable entity - Invalid conversation_id or query parameters"},
        500: {"description": "Internal server error"}
    }
)
async def get_conversation_messages(
    conversation_id: UUID,
    session: Annotated[Session, Depends(get_session)],
    user_id: Annotated[str, Depends(get_current_user)],
    limit: int = 100,
    offset: int = 0
) -> MessageListResponse:
    """
    Get all messages for a specific conversation.

    Args:
        conversation_id: UUID of the conversation
        session: Database session
        user_id: Authenticated user ID from JWT (injected)
        limit: Maximum number of messages to return (default: 100, max: 500)
        offset: Number of messages to skip (default: 0)

    Returns:
        MessageListResponse: List of messages with pagination metadata

    Raises:
        HTTPException: 404 if conversation not found, 422 if invalid parameters
    """
    import logging
    logger = logging.getLogger(__name__)

    logger.info(f"💬 Get messages called for conversation: {conversation_id}")

    # Validate pagination parameters
    if limit < 1 or limit > 500:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Invalid limit value. Must be between 1 and 500."
        )

    if offset < 0:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Invalid offset value. Must be >= 0."
        )

    try:
        conversation_service = ConversationService(session)

        # Validate conversation exists and user owns it
        conversation = conversation_service.get_conversation(
            conversation_id=conversation_id,
            user_id=user_id
        )

        if not conversation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversation not found or you do not have access to it"
            )

        # Get messages
        messages, total = conversation_service.get_conversation_messages(
            conversation_id=conversation_id,
            limit=limit,
            offset=offset
        )

        # Convert to response models
        message_responses = [
            MessageResponse(
                message_id=msg.message_id,
                role=msg.role.value,
                message_text=msg.message_text,
                timestamp=msg.timestamp
            )
            for msg in messages
        ]

        logger.info(f"✅ Retrieved {len(message_responses)} messages (total: {total})")

        return MessageListResponse(
            conversation_id=conversation_id,
            messages=message_responses,
            total=total,
            limit=limit,
            offset=offset
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error retrieving messages: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database connection error"
        )


@router.post(
    "/conversations",
    response_model=ChatResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create new conversation",
    description="Explicitly create a new conversation for the authenticated user.",
    responses={
        201: {"description": "Conversation created successfully"},
        401: {"description": "Unauthorized - Invalid or missing authentication token"},
        500: {"description": "Internal server error"}
    }
)
async def create_conversation(
    session: Annotated[Session, Depends(get_session)],
    user_id: Annotated[str, Depends(get_current_user)]
) -> dict:
    """
    Create a new conversation for the user.

    Args:
        session: Database session
        user_id: Authenticated user ID from JWT (injected)

    Returns:
        dict: New conversation with conversation_id, created_at, updated_at

    Raises:
        HTTPException: 500 if database error
    """
    import logging
    logger = logging.getLogger(__name__)

    logger.info(f"➕ Create conversation called for user: {user_id}")

    try:
        conversation_service = ConversationService(session)
        conversation = conversation_service.create_conversation(user_id=user_id)

        logger.info(f"✅ Created conversation: {conversation.conversation_id}")

        return {
            "conversation_id": conversation.conversation_id,
            "created_at": conversation.created_at,
            "updated_at": conversation.updated_at
        }

    except Exception as e:
        logger.error(f"❌ Error creating conversation: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database connection error"
        )


@router.delete(
    "/conversations/{conversation_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete conversation",
    description="Delete a conversation and all its messages. User must own the conversation.",
    responses={
        204: {"description": "Conversation deleted successfully"},
        401: {"description": "Unauthorized - Invalid or missing authentication token"},
        404: {"description": "Not found - Conversation does not exist or user does not have access"},
        500: {"description": "Internal server error"}
    }
)
async def delete_conversation(
    conversation_id: UUID,
    session: Annotated[Session, Depends(get_session)],
    user_id: Annotated[str, Depends(get_current_user)]
):
    """
    Delete a conversation and all its messages.

    Args:
        conversation_id: UUID of the conversation to delete
        session: Database session
        user_id: Authenticated user ID from JWT (injected)

    Raises:
        HTTPException: 404 if conversation not found or not owned by user, 500 if database error
    """
    import logging
    logger = logging.getLogger(__name__)

    logger.info(f"🗑️ Delete conversation called: {conversation_id} for user: {user_id}")

    try:
        conversation_service = ConversationService(session)

        # Verify conversation exists and user owns it
        conversation = conversation_service.get_conversation(conversation_id, user_id)
        if not conversation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversation not found or you do not have access"
            )

        # Delete the conversation (messages will be cascade deleted)
        conversation_service.delete_conversation(conversation_id)

        logger.info(f"✅ Deleted conversation: {conversation_id}")
        return None

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error deleting conversation: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database connection error"
        )
