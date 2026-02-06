# Data Model: Enable Real MCP Tool Execution in AI Todo Assistant

**Feature**: 006-enable-mcp-execution
**Date**: 2026-02-03
**Phase**: Phase 1 - Design & Contracts

## Overview

This document defines the database schema and data models for conversation persistence and tool call tracking in the AI Todo Assistant. All models use SQLModel (SQLAlchemy + Pydantic) for type safety and validation.

## Entity Relationship Diagram

```
users (existing)
  ↓ (1:N)
conversations
  ↓ (1:N)
messages
  ↓ (1:N)
tool_calls (optional)

users (existing)
  ↓ (1:N)
todos (existing)
```

## Data Models

### 1. Conversation

**Purpose**: Represents a chat session between a user and the AI agent.

**SQLModel Definition**:

```python
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import Optional, List

class Conversation(SQLModel, table=True):
    __tablename__ = "conversations"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", nullable=False, index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)

    # Relationships
    messages: List["Message"] = Relationship(back_populates="conversation", cascade_delete=True)
```

**Fields**:
- `id`: Auto-increment primary key
- `user_id`: Foreign key to users table (who owns this conversation)
- `created_at`: Timestamp when conversation was created
- `updated_at`: Timestamp when conversation was last updated

**Constraints**:
- `user_id` must reference valid user (foreign key constraint)
- `user_id` indexed for efficient user conversation queries
- Cascade delete: When user is deleted, all conversations are deleted

**Validation Rules**:
- `user_id` must be positive integer
- `created_at` and `updated_at` must be valid timestamps
- `updated_at` must be >= `created_at`

---

### 2. Message

**Purpose**: Represents a single message in a conversation (user or assistant).

**SQLModel Definition**:

```python
from sqlmodel import SQLModel, Field, Relationship, Column, Enum as SQLEnum
from datetime import datetime
from typing import Optional, List
from enum import Enum

class MessageRole(str, Enum):
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"

class Message(SQLModel, table=True):
    __tablename__ = "messages"

    id: Optional[int] = Field(default=None, primary_key=True)
    conversation_id: int = Field(foreign_key="conversations.id", nullable=False, index=True)
    role: MessageRole = Field(sa_column=Column(SQLEnum(MessageRole)), nullable=False)
    content: str = Field(nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False, index=True)

    # Relationships
    conversation: Optional["Conversation"] = Relationship(back_populates="messages")
    tool_calls: List["ToolCall"] = Relationship(back_populates="message", cascade_delete=True)
```

**Fields**:
- `id`: Auto-increment primary key
- `conversation_id`: Foreign key to conversations table
- `role`: Enum ("user", "assistant", "system")
- `content`: Message text content
- `created_at`: Timestamp when message was created

**Constraints**:
- `conversation_id` must reference valid conversation (foreign key constraint)
- `conversation_id` indexed for efficient conversation message queries
- `created_at` indexed for chronological ordering
- `role` must be one of: "user", "assistant", "system"
- `content` cannot be empty
- Cascade delete: When conversation is deleted, all messages are deleted

**Validation Rules**:
- `conversation_id` must be positive integer
- `role` must be valid MessageRole enum value
- `content` must be non-empty string (max 10,000 characters)
- `created_at` must be valid timestamp

---

### 3. ToolCall (Optional - for audit/debugging)

**Purpose**: Tracks AI agent tool invocations for debugging and audit purposes.

**SQLModel Definition**:

```python
from sqlmodel import SQLModel, Field, Relationship, Column, JSON, Enum as SQLEnum
from datetime import datetime
from typing import Optional, Dict, Any
from enum import Enum

class ToolCallStatus(str, Enum):
    SUCCESS = "success"
    ERROR = "error"

class ToolCall(SQLModel, table=True):
    __tablename__ = "tool_calls"

    id: Optional[int] = Field(default=None, primary_key=True)
    message_id: int = Field(foreign_key="messages.id", nullable=False, index=True)
    tool_name: str = Field(nullable=False, max_length=100)
    tool_input: Dict[str, Any] = Field(sa_column=Column(JSON), nullable=False)
    tool_output: Dict[str, Any] = Field(sa_column=Column(JSON), nullable=False)
    status: ToolCallStatus = Field(sa_column=Column(SQLEnum(ToolCallStatus)), nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)

    # Relationships
    message: Optional["Message"] = Relationship(back_populates="tool_calls")
```

**Fields**:
- `id`: Auto-increment primary key
- `message_id`: Foreign key to messages table
- `tool_name`: Name of the tool that was called (e.g., "add_task")
- `tool_input`: JSON object with tool input parameters
- `tool_output`: JSON object with tool output/result
- `status`: Enum ("success", "error")
- `created_at`: Timestamp when tool was called

**Constraints**:
- `message_id` must reference valid message (foreign key constraint)
- `message_id` indexed for efficient message tool call queries
- `tool_name` must be one of: "add_task", "list_tasks", "update_task", "delete_task"
- `status` must be one of: "success", "error"
- Cascade delete: When message is deleted, all tool calls are deleted

**Validation Rules**:
- `message_id` must be positive integer
- `tool_name` must be non-empty string (max 100 characters)
- `tool_input` must be valid JSON object
- `tool_output` must be valid JSON object
- `status` must be valid ToolCallStatus enum value
- `created_at` must be valid timestamp

---

### 4. Todo (Existing - No Changes)

**Purpose**: Represents a todo task (existing model, no modifications needed).

**SQLModel Definition** (reference only):

```python
class Todo(SQLModel, table=True):
    __tablename__ = "todos"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", nullable=False, index=True)
    title: str = Field(nullable=False, max_length=200)
    description: Optional[str] = Field(default=None)
    status: str = Field(default="pending", nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
```

**Note**: This model already exists and requires no changes for this feature.

---

## Database Migrations

### Migration 003: Create Conversations Table

**File**: `api/alembic/versions/003_create_conversations_table.py`

```python
"""Create conversations table

Revision ID: 003
Revises: 002
Create Date: 2026-02-03
"""

from alembic import op
import sqlalchemy as sa

revision = '003'
down_revision = '002'
branch_labels = None
depends_on = None

def upgrade():
    op.create_table(
        'conversations',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('idx_conversations_user_id', 'conversations', ['user_id'])

def downgrade():
    op.drop_index('idx_conversations_user_id', table_name='conversations')
    op.drop_table('conversations')
```

---

### Migration 004: Create Messages Table

**File**: `api/alembic/versions/004_create_messages_table.py`

```python
"""Create messages table

Revision ID: 004
Revises: 003
Create Date: 2026-02-03
"""

from alembic import op
import sqlalchemy as sa

revision = '004'
down_revision = '003'
branch_labels = None
depends_on = None

def upgrade():
    op.create_table(
        'messages',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('conversation_id', sa.Integer(), nullable=False),
        sa.Column('role', sa.String(20), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.CheckConstraint("role IN ('user', 'assistant', 'system')", name='check_message_role'),
        sa.ForeignKeyConstraint(['conversation_id'], ['conversations.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('idx_messages_conversation_id', 'messages', ['conversation_id'])
    op.create_index('idx_messages_created_at', 'messages', ['created_at'])

def downgrade():
    op.drop_index('idx_messages_created_at', table_name='messages')
    op.drop_index('idx_messages_conversation_id', table_name='messages')
    op.drop_table('messages')
```

---

### Migration 005: Create Tool Calls Table (Optional)

**File**: `api/alembic/versions/005_create_tool_calls_table.py`

```python
"""Create tool_calls table

Revision ID: 005
Revises: 004
Create Date: 2026-02-03
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSONB

revision = '005'
down_revision = '004'
branch_labels = None
depends_on = None

def upgrade():
    op.create_table(
        'tool_calls',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('message_id', sa.Integer(), nullable=False),
        sa.Column('tool_name', sa.String(100), nullable=False),
        sa.Column('tool_input', JSONB, nullable=False),
        sa.Column('tool_output', JSONB, nullable=False),
        sa.Column('status', sa.String(20), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.CheckConstraint("status IN ('success', 'error')", name='check_tool_call_status'),
        sa.ForeignKeyConstraint(['message_id'], ['messages.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('idx_tool_calls_message_id', 'tool_calls', ['message_id'])

def downgrade():
    op.drop_index('idx_tool_calls_message_id', table_name='tool_calls')
    op.drop_table('tool_calls')
```

---

## Query Patterns

### Load Conversation History

```python
def load_conversation_history(conversation_id: int, db: Session, limit: int = 50) -> List[Dict]:
    """Load recent messages from a conversation."""
    messages = db.query(Message)\
        .filter(Message.conversation_id == conversation_id)\
        .order_by(Message.created_at.desc())\
        .limit(limit)\
        .all()

    return [
        {"role": msg.role, "content": msg.content}
        for msg in reversed(messages)
    ]
```

### Get User Conversations

```python
def get_user_conversations(user_id: int, db: Session, limit: int = 20) -> List[Conversation]:
    """Get recent conversations for a user."""
    return db.query(Conversation)\
        .filter(Conversation.user_id == user_id)\
        .order_by(Conversation.updated_at.desc())\
        .limit(limit)\
        .all()
```

### Save Message with Tool Calls

```python
def save_message_with_tools(
    conversation_id: int,
    role: str,
    content: str,
    tool_calls: List[Dict],
    db: Session
) -> Message:
    """Save a message and its associated tool calls."""
    # Create message
    message = Message(
        conversation_id=conversation_id,
        role=role,
        content=content
    )
    db.add(message)
    db.flush()  # Get message.id

    # Create tool calls
    for tool_call in tool_calls:
        tc = ToolCall(
            message_id=message.id,
            tool_name=tool_call["name"],
            tool_input=tool_call["input"],
            tool_output=tool_call["output"],
            status=tool_call["status"]
        )
        db.add(tc)

    db.commit()
    db.refresh(message)
    return message
```

---

## Performance Considerations

### Indexes

- `conversations.user_id`: Fast user conversation lookups
- `messages.conversation_id`: Fast message retrieval for conversations
- `messages.created_at`: Efficient chronological ordering
- `tool_calls.message_id`: Fast tool call lookups for messages

### Query Optimization

- Limit conversation history to recent 50 messages (configurable)
- Use pagination for conversation lists
- Consider archiving old conversations after 90 days
- Use connection pooling for database connections

### Storage Estimates

- Conversation: ~50 bytes per record
- Message: ~500 bytes per record (average)
- ToolCall: ~1KB per record (with JSON)
- 1000 users × 10 conversations × 100 messages = 1M messages ≈ 500MB

---

## Data Integrity

### Foreign Key Constraints

- `conversations.user_id` → `users.id` (CASCADE DELETE)
- `messages.conversation_id` → `conversations.id` (CASCADE DELETE)
- `tool_calls.message_id` → `messages.id` (CASCADE DELETE)

### Check Constraints

- `messages.role` must be in ('user', 'assistant', 'system')
- `tool_calls.status` must be in ('success', 'error')

### Validation

- All timestamps must be valid UTC datetime
- All foreign keys must reference existing records
- Content fields cannot be empty
- JSON fields must be valid JSON objects

---

## Testing Strategy

### Unit Tests

- Test model creation and validation
- Test relationship loading (conversation → messages → tool_calls)
- Test constraint violations (invalid role, invalid status)
- Test cascade deletes

### Integration Tests

- Test conversation creation and message persistence
- Test conversation history loading with pagination
- Test tool call tracking
- Test concurrent message creation

### Performance Tests

- Test query performance with 1000+ messages
- Test index effectiveness
- Test connection pool under load

---

## Next Steps

1. ✅ Data model design complete
2. → Create API contracts (chat-api.yaml, mcp-tools.yaml)
3. → Create quickstart guide
4. → Update agent context
5. → Proceed to task breakdown
