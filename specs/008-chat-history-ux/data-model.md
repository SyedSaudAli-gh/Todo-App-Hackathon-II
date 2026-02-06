# Data Model: Chat History & Header UX

**Feature**: 008-chat-history-ux
**Date**: 2026-02-05
**Status**: Complete

## Overview

This document describes the data model for conversation history management. The existing Phase III database schema already supports all requirements for this feature. No schema changes or migrations are needed.

## Existing Database Schema

### Table: `conversations`

**Purpose**: Store user conversation sessions with the AI assistant

**Schema**:
```sql
CREATE TABLE conversations (
    conversation_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

    -- Indexes
    INDEX idx_conversations_user_id (user_id),
    INDEX idx_conversations_updated_at (updated_at)
);
```

**SQLModel Definition** (Existing - No Changes):
```python
class Conversation(SQLModel, table=True):
    __tablename__ = "conversations"

    conversation_id: UUID = Field(
        default_factory=uuid4,
        primary_key=True,
        index=True
    )
    user_id: str = Field(index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    messages: List["Message"] = Relationship(
        back_populates="conversation",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )
```

**Fields**:
- `conversation_id` (UUID, PK): Unique identifier for the conversation
- `user_id` (str, indexed): User identifier from authentication system
- `created_at` (datetime): When the conversation was created (UTC)
- `updated_at` (datetime): When the conversation was last updated (UTC)

**Relationships**:
- Has many `messages` (cascade delete)

**Indexes**:
- Primary key index on `conversation_id`
- Index on `user_id` (for user conversation queries)
- Index on `updated_at` (for sorting by most recent)

**Constraints**:
- `conversation_id` is unique and auto-generated
- `user_id` is required (NOT NULL)
- `created_at` and `updated_at` are required with defaults

---

### Table: `messages`

**Purpose**: Store user and assistant messages within conversations

**Schema**:
```sql
CREATE TABLE messages (
    message_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(conversation_id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
    message_text TEXT NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
    tool_calls JSONB,
    message_metadata JSONB,

    -- Indexes
    INDEX idx_messages_conversation_id (conversation_id),
    INDEX idx_messages_timestamp (timestamp)
);
```

**SQLModel Definition** (Existing - No Changes):
```python
class MessageRole(str, Enum):
    USER = "user"
    ASSISTANT = "assistant"

class Message(SQLModel, table=True):
    __tablename__ = "messages"

    message_id: UUID = Field(
        default_factory=uuid4,
        primary_key=True,
        index=True
    )
    conversation_id: UUID = Field(
        foreign_key="conversations.conversation_id",
        index=True
    )
    role: MessageRole = Field(
        sa_column=Column(SQLEnum(MessageRole), nullable=False)
    )
    message_text: str = Field(max_length=10000)
    timestamp: datetime = Field(
        default_factory=datetime.utcnow,
        index=True
    )
    tool_calls: Optional[List[Dict[str, Any]]] = Field(
        default=None,
        sa_column=Column(JSON)
    )
    message_metadata: Optional[Dict[str, Any]]] = Field(
        default=None,
        sa_column=Column(JSON)
    )

    # Relationships
    conversation: Optional["Conversation"] = Relationship(
        back_populates="messages"
    )
```

**Fields**:
- `message_id` (UUID, PK): Unique identifier for the message
- `conversation_id` (UUID, FK): Parent conversation ID
- `role` (enum): Message sender role (user or assistant)
- `message_text` (str, max 10000 chars): Conversational text content
- `timestamp` (datetime): When the message was sent (UTC)
- `tool_calls` (JSON, optional): Array of MCP tool invocations (for assistant messages)
- `message_metadata` (JSON, optional): Additional metadata (model version, token count, etc.)

**Relationships**:
- Belongs to `conversation` (foreign key with cascade delete)

**Indexes**:
- Primary key index on `message_id`
- Index on `conversation_id` (for conversation message queries)
- Index on `timestamp` (for chronological ordering)

**Constraints**:
- `message_id` is unique and auto-generated
- `conversation_id` is required and must reference valid conversation
- `role` must be 'user' or 'assistant'
- `message_text` is required (NOT NULL)
- `timestamp` is required with default

---

## Query Patterns

### Q1: List User Conversations (Sorted by Most Recent)

**Use Case**: Display conversation history in History panel

**Query**:
```sql
SELECT
    c.conversation_id,
    c.created_at,
    c.updated_at,
    COUNT(m.message_id) as message_count,
    (
        SELECT m2.message_text
        FROM messages m2
        WHERE m2.conversation_id = c.conversation_id
        ORDER BY m2.timestamp DESC
        LIMIT 1
    ) as preview
FROM conversations c
LEFT JOIN messages m ON m.conversation_id = c.conversation_id
WHERE c.user_id = :user_id
GROUP BY c.conversation_id
ORDER BY c.updated_at DESC
LIMIT :limit OFFSET :offset;
```

**SQLModel Implementation**:
```python
def get_user_conversations(
    self,
    user_id: str,
    limit: int = 50,
    offset: int = 0
) -> List[ConversationSummary]:
    # Use SQLModel select with joins and aggregations
    # Return list of ConversationSummary objects
```

**Performance**:
- Index on `conversations.user_id` enables fast filtering
- Index on `conversations.updated_at` enables fast sorting
- Subquery for preview is optimized with index on `messages.timestamp`
- Expected query time: <100ms for 1000 conversations

---

### Q2: Get Conversation Messages (Chronological Order)

**Use Case**: Load messages when user switches to a conversation

**Query**:
```sql
SELECT
    message_id,
    role,
    message_text,
    timestamp
FROM messages
WHERE conversation_id = :conversation_id
ORDER BY timestamp ASC
LIMIT :limit OFFSET :offset;
```

**SQLModel Implementation**:
```python
def get_conversation_messages(
    self,
    conversation_id: UUID,
    limit: int = 100,
    offset: int = 0
) -> List[Message]:
    # Use SQLModel select with filtering and ordering
    # Return list of Message objects
```

**Performance**:
- Index on `messages.conversation_id` enables fast filtering
- Index on `messages.timestamp` enables fast sorting
- Expected query time: <50ms for 100 messages

---

### Q3: Create New Conversation

**Use Case**: User clicks "New Chat" button

**Query**:
```sql
INSERT INTO conversations (conversation_id, user_id, created_at, updated_at)
VALUES (uuid_generate_v4(), :user_id, NOW(), NOW())
RETURNING conversation_id, created_at, updated_at;
```

**SQLModel Implementation**:
```python
def create_conversation(self, user_id: str) -> Conversation:
    conversation = Conversation(user_id=user_id)
    self.session.add(conversation)
    self.session.commit()
    self.session.refresh(conversation)
    return conversation
```

**Performance**:
- Simple insert operation
- Expected query time: <10ms

---

### Q4: Update Conversation Timestamp

**Use Case**: Update `updated_at` when new message is added

**Query**:
```sql
UPDATE conversations
SET updated_at = NOW()
WHERE conversation_id = :conversation_id;
```

**SQLModel Implementation**:
```python
def update_conversation_timestamp(self, conversation_id: UUID) -> None:
    conversation = self.session.get(Conversation, conversation_id)
    if conversation:
        conversation.updated_at = datetime.utcnow()
        self.session.commit()
```

**Performance**:
- Primary key lookup is very fast
- Expected query time: <5ms

---

## Index Optimization Recommendations

### Current Indexes (Existing)
- ✅ `conversations.conversation_id` (PK)
- ✅ `conversations.user_id`
- ✅ `conversations.updated_at`
- ✅ `messages.message_id` (PK)
- ✅ `messages.conversation_id`
- ✅ `messages.timestamp`

### Recommended Additional Indexes (Optional)
- **Composite index on `(user_id, updated_at)`**: May improve Q1 performance for large datasets
  ```sql
  CREATE INDEX idx_conversations_user_updated
  ON conversations(user_id, updated_at DESC);
  ```
- **Partial index on `messages.role`**: May improve filtering if we add role-based queries
  ```sql
  CREATE INDEX idx_messages_role
  ON messages(role)
  WHERE role = 'user';
  ```

**Decision**: Start without additional indexes. Monitor query performance in production. Add indexes only if performance degrades.

---

## Data Validation Rules

### Conversation Validation
- `user_id` must be non-empty string
- `created_at` and `updated_at` must be valid UTC timestamps
- `updated_at` must be >= `created_at`

### Message Validation
- `conversation_id` must reference existing conversation
- `role` must be 'user' or 'assistant'
- `message_text` must be non-empty and <= 10,000 characters
- `timestamp` must be valid UTC timestamp
- `tool_calls` must be valid JSON array (if provided)
- `message_metadata` must be valid JSON object (if provided)

---

## Data Lifecycle

### Conversation Creation
1. User opens chatbot (no conversation yet)
2. User sends first message
3. Backend creates new conversation (if not provided)
4. Backend saves user message
5. Backend processes with AI agent
6. Backend saves assistant message
7. Backend updates conversation timestamp

### Conversation Switching
1. User clicks conversation in history panel
2. Frontend fetches messages: `GET /conversations/{id}/messages`
3. Frontend displays messages in chat area
4. User can continue conversation by sending new messages

### New Chat
1. User clicks "New Chat" button
2. Frontend creates new conversation: `POST /conversations`
3. Frontend clears current messages
4. Frontend sets new conversation as active
5. User sends first message in new conversation

### Data Retention
- Conversations persist indefinitely (no automatic deletion)
- Messages persist indefinitely (cascade delete with conversation)
- Future: Add conversation archiving or deletion features

---

## Schema Migration Status

**Migration Required**: ❌ NO

**Rationale**: Existing schema fully supports all feature requirements. The `conversations` and `messages` tables already have all necessary fields, indexes, and relationships.

**Verification**:
- ✅ Conversation list query supported (user_id index exists)
- ✅ Message retrieval query supported (conversation_id index exists)
- ✅ Sorting by updated_at supported (updated_at index exists)
- ✅ Preview text generation supported (message_text field exists)
- ✅ User scoping supported (user_id field exists)

---

## Summary

**Existing Schema**: ✅ Complete and sufficient
**New Tables**: ❌ None required
**Schema Changes**: ❌ None required
**New Indexes**: ⚠️ Optional (monitor performance first)
**Migrations**: ❌ None required

The existing Phase III database schema is well-designed and fully supports conversation history management without any modifications.
