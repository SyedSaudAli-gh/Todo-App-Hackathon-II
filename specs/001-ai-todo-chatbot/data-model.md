# Database Schema: AI-Powered Todo Chatbot Backend

**Feature**: 001-ai-todo-chatbot
**Date**: 2026-02-02
**Purpose**: Define database schema for conversations, messages, and tool calls

## Overview

This schema extends the existing Phase II database with Phase III conversation persistence. The design supports stateless backend architecture where all conversation state is reconstructed from the database on every request.

## Existing Tables (Phase II - Maintained)

### Table: todos

**Purpose**: Store user todo tasks

**Schema**:
```sql
CREATE TABLE todos (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR NOT NULL,
    title VARCHAR(200) NOT NULL,
    description VARCHAR(2000),
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_todos_user_id ON todos(user_id);
CREATE INDEX idx_todos_completed ON todos(completed);
```

**Relationships**: None (independent entity)

**Notes**:
- Existing table from Phase II
- No changes required for Phase III
- Agent accesses via MCP tools only

---

## New Tables (Phase III)

### Table: conversations

**Purpose**: Store user conversation sessions with AI assistant

**Schema**:
```sql
CREATE TABLE conversations (
    conversation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_conversations_updated_at ON conversations(updated_at);
```

**SQLModel Definition**:
```python
from datetime import datetime
from uuid import UUID, uuid4
from sqlmodel import Field, SQLModel, Relationship

class Conversation(SQLModel, table=True):
    __tablename__ = "conversations"

    conversation_id: UUID = Field(
        default_factory=uuid4,
        primary_key=True,
        index=True,
        description="Unique identifier for the conversation"
    )

    user_id: str = Field(
        index=True,
        description="User identifier from authentication system"
    )

    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        description="When the conversation was created (UTC)"
    )

    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        description="When the conversation was last updated (UTC)"
    )

    # Relationships
    messages: list["Message"] = Relationship(
        back_populates="conversation",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )
```

**Relationships**:
- Has many messages (one-to-many)
- Cascade delete: deleting conversation deletes all messages

**Constraints**:
- `conversation_id` is UUID primary key (unique, indexed)
- `user_id` is required (indexed for user conversation queries)
- `updated_at` indexed for sorting recent conversations

**Usage**:
- Created when user starts new chat session
- Updated timestamp on every new message
- Retrieved by conversation_id for context reconstruction

---

### Table: messages

**Purpose**: Store user and assistant messages in conversations

**Schema**:
```sql
CREATE TABLE messages (
    message_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(conversation_id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
    message_text TEXT NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
    tool_calls JSONB,
    message_metadata JSONB
);

CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_timestamp ON messages(timestamp);
CREATE INDEX idx_messages_conversation_timestamp ON messages(conversation_id, timestamp);
```

**SQLModel Definition**:
```python
from datetime import datetime
from typing import Optional, Dict, Any
from uuid import UUID, uuid4
from enum import Enum
from sqlmodel import Field, SQLModel, Relationship, Column
from sqlalchemy import JSON, Enum as SQLEnum

class MessageRole(str, Enum):
    """Message role enum."""
    USER = "user"
    ASSISTANT = "assistant"

class Message(SQLModel, table=True):
    __tablename__ = "messages"

    message_id: UUID = Field(
        default_factory=uuid4,
        primary_key=True,
        index=True,
        description="Unique identifier for the message"
    )

    conversation_id: UUID = Field(
        foreign_key="conversations.conversation_id",
        index=True,
        description="ID of the conversation this message belongs to"
    )

    role: MessageRole = Field(
        sa_column=Column(SQLEnum(MessageRole), nullable=False),
        description="Role of the message sender (user or assistant)"
    )

    message_text: str = Field(
        max_length=10000,
        description="Content of the message"
    )

    timestamp: datetime = Field(
        default_factory=datetime.utcnow,
        index=True,
        description="When the message was sent (UTC)"
    )

    tool_calls: Optional[list[Dict[str, Any]]] = Field(
        default=None,
        sa_column=Column(JSON),
        description="Array of MCP tool invocations (for assistant messages)"
    )

    message_metadata: Optional[Dict[str, Any]] = Field(
        default=None,
        sa_column=Column(JSON),
        description="Additional metadata (e.g., pending confirmations, model version)"
    )

    # Relationships
    conversation: Optional["Conversation"] = Relationship(
        back_populates="messages"
    )
```

**Relationships**:
- Belongs to conversation (many-to-one)
- Foreign key: `conversation_id` references `conversations.conversation_id`
- Cascade delete: deleting conversation deletes all messages

**Constraints**:
- `message_id` is UUID primary key (unique, indexed)
- `conversation_id` is required (foreign key, indexed)
- `role` must be 'user' or 'assistant' (enum constraint)
- `message_text` is required (max 10,000 characters)
- `timestamp` is required (indexed for ordering)

**JSON Fields**:

**tool_calls** (array of objects):
```json
[
    {
        "tool_call_id": "call_abc123",
        "name": "create_task",
        "input": {
            "title": "Buy groceries",
            "description": "Milk, eggs, bread"
        },
        "output": {
            "task_id": 42,
            "success": true,
            "message": "Created task: Buy groceries"
        }
    }
]
```

**message_metadata** (object):
```json
{
    "model": "google/gemini-2.0-flash-exp",
    "token_count": 150,
    "pending_confirmation": {
        "action": "delete_task",
        "task_id": 123,
        "expires_at": "2026-02-02T15:30:00Z"
    }
}
```

**Usage**:
- Created for every user message and agent response
- Retrieved in chronological order for context reconstruction
- tool_calls populated only for assistant messages with tool invocations
- message_metadata used for confirmation flow and debugging

---

## Indexes

### Performance-Critical Indexes

1. **idx_messages_conversation_timestamp**: Composite index on `(conversation_id, timestamp)`
   - **Purpose**: Fast retrieval of last N messages for context reconstruction
   - **Query**: `SELECT * FROM messages WHERE conversation_id = ? ORDER BY timestamp DESC LIMIT 20`
   - **Expected Performance**: <50ms for 1000+ messages per conversation

2. **idx_conversations_user_id**: Index on `user_id`
   - **Purpose**: Fast retrieval of user's conversations
   - **Query**: `SELECT * FROM conversations WHERE user_id = ? ORDER BY updated_at DESC`
   - **Expected Performance**: <50ms for 100+ conversations per user

3. **idx_todos_user_id**: Index on `user_id` (existing)
   - **Purpose**: Fast retrieval of user's tasks for MCP tools
   - **Query**: `SELECT * FROM todos WHERE user_id = ?`
   - **Expected Performance**: <50ms for 1000+ tasks per user

---

## Migration Strategy

### Migration 003: Create conversations table

**File**: `api/alembic/versions/003_create_conversations_table.py`

```python
"""Create conversations table

Revision ID: 003
Revises: 002
Create Date: 2026-02-02
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID

revision = '003'
down_revision = '002'
branch_labels = None
depends_on = None

def upgrade() -> None:
    op.create_table(
        'conversations',
        sa.Column('conversation_id', UUID(as_uuid=True), primary_key=True, server_default=sa.text('gen_random_uuid()')),
        sa.Column('user_id', sa.String(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('NOW()')),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.text('NOW()'))
    )

    op.create_index('idx_conversations_user_id', 'conversations', ['user_id'])
    op.create_index('idx_conversations_updated_at', 'conversations', ['updated_at'])

def downgrade() -> None:
    op.drop_index('idx_conversations_updated_at', table_name='conversations')
    op.drop_index('idx_conversations_user_id', table_name='conversations')
    op.drop_table('conversations')
```

### Migration 004: Create messages table

**File**: `api/alembic/versions/004_create_messages_table.py`

```python
"""Create messages table

Revision ID: 004
Revises: 003
Create Date: 2026-02-02
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID, JSONB

revision = '004'
down_revision = '003'
branch_labels = None
depends_on = None

def upgrade() -> None:
    op.create_table(
        'messages',
        sa.Column('message_id', UUID(as_uuid=True), primary_key=True, server_default=sa.text('gen_random_uuid()')),
        sa.Column('conversation_id', UUID(as_uuid=True), nullable=False),
        sa.Column('role', sa.String(20), nullable=False),
        sa.Column('message_text', sa.Text(), nullable=False),
        sa.Column('timestamp', sa.DateTime(), nullable=False, server_default=sa.text('NOW()')),
        sa.Column('tool_calls', JSONB, nullable=True),
        sa.Column('message_metadata', JSONB, nullable=True),
        sa.ForeignKeyConstraint(['conversation_id'], ['conversations.conversation_id'], ondelete='CASCADE'),
        sa.CheckConstraint("role IN ('user', 'assistant')", name='check_message_role')
    )

    op.create_index('idx_messages_conversation_id', 'messages', ['conversation_id'])
    op.create_index('idx_messages_timestamp', 'messages', ['timestamp'])
    op.create_index('idx_messages_conversation_timestamp', 'messages', ['conversation_id', 'timestamp'])

def downgrade() -> None:
    op.drop_index('idx_messages_conversation_timestamp', table_name='messages')
    op.drop_index('idx_messages_timestamp', table_name='messages')
    op.drop_index('idx_messages_conversation_id', table_name='messages')
    op.drop_table('messages')
```

---

## Data Integrity

### Foreign Key Constraints

- `messages.conversation_id` → `conversations.conversation_id` (CASCADE DELETE)
  - Deleting a conversation automatically deletes all its messages
  - Prevents orphaned messages

### Check Constraints

- `messages.role` must be 'user' or 'assistant'
  - Enforced at database level
  - Prevents invalid role values

### Validation Rules

**Conversation**:
- `conversation_id`: Must be valid UUID
- `user_id`: Must be non-empty string
- `created_at`, `updated_at`: Must be valid timestamps

**Message**:
- `message_id`: Must be valid UUID
- `conversation_id`: Must reference existing conversation
- `role`: Must be 'user' or 'assistant'
- `message_text`: Must be non-empty, max 10,000 characters
- `timestamp`: Must be valid timestamp
- `tool_calls`: Must be valid JSON array (if present)
- `message_metadata`: Must be valid JSON object (if present)

---

## Query Patterns

### Context Reconstruction (Most Frequent)

```sql
-- Get last 20 messages for conversation
SELECT message_id, role, message_text, timestamp, tool_calls, message_metadata
FROM messages
WHERE conversation_id = :conversation_id
ORDER BY timestamp DESC
LIMIT 20;
```

**Performance**: <50ms with composite index on (conversation_id, timestamp)

### User Conversations List

```sql
-- Get user's recent conversations
SELECT conversation_id, created_at, updated_at
FROM conversations
WHERE user_id = :user_id
ORDER BY updated_at DESC
LIMIT 50;
```

**Performance**: <50ms with index on user_id

### Task Operations (via MCP Tools)

```sql
-- List user's tasks
SELECT id, title, description, completed, created_at, updated_at
FROM todos
WHERE user_id = :user_id
ORDER BY created_at DESC;
```

**Performance**: <50ms with index on user_id

---

## Storage Estimates

### Per Conversation

- Conversation record: ~100 bytes
- Average message: ~500 bytes (text + metadata)
- 50 messages per conversation: ~25 KB
- 100 conversations per user: ~2.5 MB

### Per User

- Tasks: 1000 tasks × 500 bytes = 500 KB
- Conversations: 100 conversations × 25 KB = 2.5 MB
- **Total per user**: ~3 MB

### Hackathon Scale

- 10 users × 3 MB = 30 MB
- Well within free tier limits for Neon PostgreSQL

---

## Schema Validation Checklist

- [x] All entities from spec.md Phase III Conversation Persistence section
- [x] UUID primary keys for conversations and messages
- [x] Foreign key constraints with CASCADE delete
- [x] Indexes on high-frequency query columns
- [x] JSON fields for tool_calls and metadata
- [x] Enum constraint for message role
- [x] Timestamps with UTC default
- [x] SQLModel definitions match SQL schema
- [x] Migration scripts for Alembic
- [x] Performance targets achievable (<500ms context reconstruction)

**Schema design complete and ready for implementation.**
