# Quickstart Guide: Chat History & Header UX

**Feature**: 008-chat-history-ux
**Date**: 2026-02-05
**Audience**: Developers implementing this feature

## Overview

This guide helps developers quickly set up, test, and implement the Chat History & Header UX feature. The feature extends existing Phase III chat infrastructure with conversation history management and improved header UI.

## Prerequisites

### Required Infrastructure (Existing)
- ✅ FastAPI backend running on port 8000
- ✅ Neon PostgreSQL database with `conversations` and `messages` tables
- ✅ Next.js frontend running on port 3000
- ✅ Authentication system providing JWT tokens
- ✅ Existing chat endpoint: POST /api/v1/chat

### Development Environment
- Python 3.13+
- Node.js 18+
- PostgreSQL client (psql or GUI tool)
- API testing tool (curl, Postman, or HTTPie)

### No New Dependencies Required
- ✅ Backend: All required packages already installed
- ✅ Frontend: All required packages already installed
- ✅ Database: Schema is complete, no migrations needed

---

## Quick Setup (5 Minutes)

### Step 1: Verify Existing Infrastructure

**Check Backend**:
```bash
cd api
python -m pytest tests/test_api/test_chat.py -v
# Expected: All tests pass
```

**Check Database**:
```bash
psql $DATABASE_URL -c "SELECT COUNT(*) FROM conversations;"
psql $DATABASE_URL -c "SELECT COUNT(*) FROM messages;"
# Expected: Tables exist and return counts
```

**Check Frontend**:
```bash
cd web
npm run dev
# Expected: Server starts on http://localhost:3000
```

### Step 2: Test Existing Chat Endpoint

**Get JWT Token**:
```bash
# Sign in via frontend or use existing token
export TOKEN="your-jwt-token-here"
```

**Send Test Message**:
```bash
curl -X POST http://localhost:8000/api/v1/chat \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, create a test task"}'
```

**Expected Response**:
```json
{
  "conversation_id": "550e8400-e29b-41d4-a716-446655440000",
  "response": "I've created a test task for you.",
  "tool_calls": [...],
  "timestamp": "2026-02-05T10:00:00Z"
}
```

### Step 3: Verify Database State

**Check Conversation Created**:
```bash
psql $DATABASE_URL -c "SELECT * FROM conversations ORDER BY created_at DESC LIMIT 1;"
```

**Check Messages Saved**:
```bash
psql $DATABASE_URL -c "SELECT role, message_text FROM messages ORDER BY timestamp DESC LIMIT 2;"
```

---

## Implementation Workflow

### Phase 1: Backend API Endpoints

**Task Order**:
1. Extend `ConversationService` with history methods
2. Add GET /api/v1/chat/conversations endpoint
3. Add GET /api/v1/chat/conversations/{id}/messages endpoint
4. Add POST /api/v1/chat/conversations endpoint
5. Write API tests for new endpoints

**Testing New Endpoints**:

```bash
# List conversations
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/v1/chat/conversations

# Get messages for conversation
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/v1/chat/conversations/{conversation_id}/messages

# Create new conversation
curl -X POST -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/v1/chat/conversations
```

**Expected Responses**: See `contracts/*.yaml` for detailed schemas

---

### Phase 2: Frontend Components

**Task Order**:
1. Create `ChatHeader` component
2. Create `HistoryPanel` component
3. Create `ConversationList` component
4. Create `useChatHistory` hook
5. Extend `useChat` hook with history state
6. Update `ChatContainer` to use new components
7. Add API client methods in `lib/api/chat.ts`

**Testing Components**:

```bash
cd web

# Run component tests
npm test -- ChatHeader.test.tsx
npm test -- HistoryPanel.test.tsx

# Run in development mode
npm run dev
# Open http://localhost:3000
# Click chatbot icon
# Test: Click History button → see conversation list
# Test: Click conversation → messages load
# Test: Click New Chat → chat area clears
# Test: Click Close → chatbot closes
```

---

### Phase 3: Integration Testing

**E2E Test Scenarios**:

1. **Conversation History Flow**:
   - Sign in
   - Send 3 messages in conversation A
   - Click "New Chat"
   - Send 2 messages in conversation B
   - Click "History"
   - Verify: 2 conversations listed
   - Click conversation A
   - Verify: 3 messages displayed

2. **Header UI Flow**:
   - Open chatbot
   - Verify: Header shows "AI Todo Assistant", History, New Chat, Close buttons
   - Verify: No "✕ New Conversation ✕" text
   - Click outside chatbot
   - Verify: Chatbot remains open
   - Click Close button
   - Verify: Chatbot closes

3. **Persistence Flow**:
   - Create conversation with 5 messages
   - Close browser
   - Reopen browser
   - Sign in
   - Open chatbot
   - Click History
   - Verify: Conversation still exists with 5 messages

---

## API Testing Examples

### Using curl

**List Conversations**:
```bash
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8000/api/v1/chat/conversations?limit=10&offset=0"
```

**Get Messages**:
```bash
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8000/api/v1/chat/conversations/550e8400-e29b-41d4-a716-446655440000/messages"
```

**Create Conversation**:
```bash
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8000/api/v1/chat/conversations"
```

### Using Python (pytest)

```python
def test_get_conversations(client, auth_token):
    response = client.get(
        "/api/v1/chat/conversations",
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "conversations" in data
    assert "total" in data

def test_get_messages(client, auth_token, conversation_id):
    response = client.get(
        f"/api/v1/chat/conversations/{conversation_id}/messages",
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "messages" in data
    assert data["conversation_id"] == str(conversation_id)
```

---

## Frontend Development

### Component Structure

```
web/src/components/chat/
├── ChatContainer.tsx       # Main container (UPDATE)
├── ChatHeader.tsx          # New header component (NEW)
├── HistoryPanel.tsx        # History panel (NEW)
├── ConversationList.tsx    # Conversation list (NEW)
├── MessageList.tsx         # Message display (EXISTING)
└── MessageInput.tsx        # Message input (EXISTING)
```

### State Management

**useChatHistory Hook**:
```typescript
const {
  conversations,
  isLoading,
  error,
  fetchConversations,
  refreshConversations
} = useChatHistory({ token });
```

**useChat Hook (Extended)**:
```typescript
const {
  messages,
  isLoading,
  error,
  conversationId,
  isHistoryOpen,
  sendMessage,
  loadConversation,
  createNewConversation,
  toggleHistory
} = useChat({ conversationId, token });
```

### API Client Methods

```typescript
// lib/api/chat.ts

export async function getConversations(
  token: string,
  limit = 50,
  offset = 0
): Promise<ConversationListResponse> {
  // Implementation
}

export async function getConversationMessages(
  conversationId: string,
  token: string,
  limit = 100,
  offset = 0
): Promise<MessageListResponse> {
  // Implementation
}

export async function createConversation(
  token: string
): Promise<ConversationCreatedResponse> {
  // Implementation
}
```

---

## Debugging Tips

### Backend Issues

**Problem**: Conversation list returns empty
- **Check**: User has conversations in database
- **Query**: `SELECT * FROM conversations WHERE user_id = 'your-user-id';`
- **Fix**: Create test conversations via POST /chat

**Problem**: Messages not loading
- **Check**: Conversation exists and user owns it
- **Query**: `SELECT * FROM messages WHERE conversation_id = 'conversation-id';`
- **Fix**: Verify conversation_id is correct UUID

**Problem**: 404 on conversation access
- **Check**: User owns the conversation
- **Fix**: Ensure user_id matches authenticated user

### Frontend Issues

**Problem**: History panel not opening
- **Check**: `isHistoryOpen` state in useChat hook
- **Debug**: Add console.log in toggleHistory function
- **Fix**: Verify onClick handler connected to button

**Problem**: Messages not displaying after switch
- **Check**: loadConversation function called
- **Debug**: Check network tab for API call
- **Fix**: Verify conversation_id passed correctly

**Problem**: Click outside closes chatbot
- **Check**: Click-outside event listener removed
- **Debug**: Search for "mousedown" event listeners
- **Fix**: Remove or disable click-outside handler

---

## Performance Benchmarks

### API Response Times (Expected)

| Endpoint | Expected Time | Acceptable Time | Action if Slower |
|----------|---------------|-----------------|------------------|
| GET /conversations | <100ms | <500ms | Add composite index |
| GET /messages | <50ms | <200ms | Check message count |
| POST /conversations | <10ms | <50ms | Check DB connection |

### Frontend Metrics (Expected)

| Metric | Expected | Acceptable | Action if Slower |
|--------|----------|------------|------------------|
| History panel open | <200ms | <500ms | Optimize rendering |
| Conversation switch | <300ms | <1000ms | Add loading skeleton |
| Message rendering | <100ms | <300ms | Virtualize list |

---

## Common Pitfalls

### ❌ Don't Do This

1. **Don't fetch all conversations at once**
   ```typescript
   // BAD: No pagination
   const conversations = await getConversations(token, 10000, 0);
   ```
   **Do This**: Use pagination with reasonable limits (50-100)

2. **Don't load all messages into memory**
   ```typescript
   // BAD: Load entire conversation history
   const messages = await getMessages(conversationId, token, 10000, 0);
   ```
   **Do This**: Load last 100 messages, implement "load more" if needed

3. **Don't forget error handling**
   ```typescript
   // BAD: No error handling
   const data = await fetch(url).then(r => r.json());
   ```
   **Do This**: Handle network errors, 404s, 401s gracefully

### ✅ Best Practices

1. **Use loading states**
   ```typescript
   {isLoading && <LoadingSkeleton />}
   {!isLoading && <ConversationList conversations={conversations} />}
   ```

2. **Validate conversation ownership**
   ```python
   conversation = get_conversation(conversation_id, user_id)
   if not conversation:
       raise HTTPException(status_code=404, detail="Not found")
   ```

3. **Update conversation timestamp**
   ```python
   # After saving message
   update_conversation_timestamp(conversation_id)
   ```

---

## Next Steps

1. **Review Specifications**:
   - Read `spec.md` for requirements
   - Read `plan.md` for architecture
   - Read `research.md` for design decisions

2. **Generate Tasks**:
   ```bash
   /sp.tasks
   ```

3. **Start Implementation**:
   - Begin with backend endpoints (testable independently)
   - Then frontend components (integrate with backend)
   - Finally E2E tests (validate full flow)

4. **Monitor Progress**:
   - Run tests frequently
   - Check API documentation (OpenAPI/Swagger)
   - Test in browser during development

---

## Support Resources

- **API Contracts**: `specs/008-chat-history-ux/contracts/*.yaml`
- **Data Model**: `specs/008-chat-history-ux/data-model.md`
- **Research**: `specs/008-chat-history-ux/research.md`
- **Constitution**: `.specify/memory/constitution.md`
- **Existing Code**: `api/src/routers/chat.py`, `web/src/components/chat/`

---

## Success Checklist

Before marking feature complete, verify:

- [ ] All API endpoints return correct responses
- [ ] All API tests pass
- [ ] Frontend components render correctly
- [ ] Frontend tests pass
- [ ] E2E tests pass
- [ ] History panel displays conversations
- [ ] Conversation switching works
- [ ] New chat creates new conversation
- [ ] Header shows correct buttons
- [ ] Click outside doesn't close chatbot
- [ ] Close button closes chatbot
- [ ] No JSON visible in UI
- [ ] Conversations persist across sessions
- [ ] Performance meets benchmarks
- [ ] OpenAPI documentation updated

---

**Ready to implement?** Run `/sp.tasks` to generate atomic, testable tasks.
