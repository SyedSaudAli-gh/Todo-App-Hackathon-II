# Research & Discovery: Chat History & Header UX

**Feature**: 008-chat-history-ux
**Date**: 2026-02-05
**Status**: Complete

## Overview

This document captures research findings and design decisions for implementing conversation history management and header UX improvements in the Phase III AI chatbot.

## R1: Existing Conversation Infrastructure Analysis

**Status**: ✅ COMPLETE

**Findings**:

**Database Models** (Existing):
- `Conversation`: conversation_id (UUID, PK), user_id (str, indexed), created_at, updated_at
- `Message`: message_id (UUID, PK), conversation_id (FK), role (enum), message_text, timestamp, tool_calls (JSON)
- Relationships: Conversation has many Messages (cascade delete)

**API Endpoints** (Existing):
- POST /api/v1/chat - Creates conversation if not provided, saves user message, processes with AI, saves assistant response

**Services** (Existing):
- `ConversationService` methods:
  - `create_conversation(user_id)` - Creates new conversation
  - `get_conversation(conversation_id, user_id)` - Retrieves conversation with ownership validation
  - `save_message(conversation_id, role, text, tool_calls)` - Persists message
  - `get_conversation_history(conversation_id, limit)` - Retrieves messages for conversation
  - `update_conversation_timestamp(conversation_id)` - Updates updated_at field

**Frontend** (Existing):
- `ChatContainer` - Main chat interface with header and message display
- `useChat` hook - Manages single conversation state (messages, loading, error)
- `MessageList`, `MessageInput` - Display and input components

**Gaps Identified**:
1. ❌ No API endpoint to list all user conversations
2. ❌ No API endpoint to retrieve messages separately from chat flow
3. ❌ No frontend history panel component
4. ❌ No conversation switching state management
5. ❌ Header has "✕ New Conversation ✕" button that needs redesign

**Conclusion**: Infrastructure is 80% complete. Need to add conversation list endpoint, message retrieval endpoint, and frontend history components.

---

## R2: Conversation List Retrieval Patterns

**Question**: What's the best approach for retrieving and displaying conversation lists with preview text?

### Options Considered

**Option A: Offset-based Pagination**
- Query: `SELECT * FROM conversations WHERE user_id = ? ORDER BY updated_at DESC LIMIT ? OFFSET ?`
- Pros: Simple, standard SQL, easy to implement
- Cons: Performance degrades with large offsets, inconsistent results if data changes during pagination
- Use case: Small to medium datasets (<10,000 conversations)

**Option B: Cursor-based Pagination**
- Query: `SELECT * FROM conversations WHERE user_id = ? AND updated_at < ? ORDER BY updated_at DESC LIMIT ?`
- Pros: Consistent results, better performance, handles concurrent updates
- Cons: More complex implementation, requires cursor state management
- Use case: Large datasets, real-time updates

**Option C: Infinite Scroll with Virtual Scrolling**
- Load conversations in batches as user scrolls
- Pros: Best UX for large lists, minimal initial load time
- Cons: Complex frontend implementation, requires virtualization library
- Use case: Very large datasets (>1,000 conversations)

### Decision: **Option A - Offset-based Pagination**

**Rationale**:
1. **Scale**: Expected 100-1,000 conversations per user (within offset-based performance range)
2. **Simplicity**: Standard SQL pattern, easy to test and maintain
3. **Frontend**: Simple pagination UI (load more button or page numbers)
4. **Performance**: With proper indexing on (user_id, updated_at), queries remain fast

**Implementation Details**:
- Default limit: 50 conversations
- Max limit: 100 conversations
- Sort order: `updated_at DESC` (most recently updated first)
- Index: Composite index on `(user_id, updated_at)` for optimal query performance

**Preview Text Strategy**:
- **Decision**: Use last message text (first 100 characters)
- **Rationale**: Most relevant to user (shows latest activity), simple to implement
- **Alternative Rejected**: First message (less relevant), AI-generated summary (too complex, adds latency)

**Fallback**: If performance issues arise with >1,000 conversations, migrate to cursor-based pagination (Option B) without breaking API contract.

---

## R3: Frontend State Management for Conversation Switching

**Question**: How should the frontend manage state when switching between conversations?

### Options Considered

**Option A: Keep All Conversations in Memory**
- Load all conversations and messages into React state
- Pros: Instant switching, no loading states
- Cons: High memory usage, slow initial load, not scalable
- Use case: <10 conversations

**Option B: Fetch on Demand**
- Load conversation list, fetch messages only when conversation selected
- Pros: Low memory usage, fast initial load, scalable
- Cons: Loading state on every switch, network latency
- Use case: Any number of conversations

**Option C: Hybrid with LRU Cache**
- Keep last N conversations in memory, fetch others on demand
- Pros: Balance between speed and memory, good UX for recent conversations
- Cons: Complex cache management, potential stale data
- Use case: Power users with many conversations

### Decision: **Option B - Fetch on Demand**

**Rationale**:
1. **Scalability**: Supports unlimited conversations without memory issues
2. **Performance**: Fast initial load (only conversation list, not all messages)
3. **Simplicity**: Clear loading states, no cache invalidation complexity
4. **Network**: With <3s loading requirement, network latency is acceptable

**Implementation Details**:

**State Structure**:
```typescript
{
  conversations: Conversation[],           // List of conversations (metadata only)
  currentConversationId: string | null,    // Active conversation
  messages: Message[],                     // Messages for current conversation
  isLoadingConversations: boolean,         // Loading conversation list
  isLoadingMessages: boolean,              // Loading messages for conversation
  error: string | null                     // Error state
}
```

**Switching Flow**:
1. User clicks conversation in history panel
2. Set `isLoadingMessages = true`
3. Fetch messages: `GET /api/v1/chat/conversations/{id}/messages`
4. Update `currentConversationId` and `messages`
5. Set `isLoadingMessages = false`
6. Close history panel (optional)

**Optimizations**:
- Show loading skeleton during message fetch
- Preserve scroll position in history panel
- Debounce rapid conversation switches
- Cache last conversation in sessionStorage for page refresh

**Fallback**: If users complain about loading times, implement Option C (LRU cache) for last 5 conversations.

---

## R4: Click-Outside Behavior Implementation

**Question**: How to disable click-outside-to-close while maintaining accessibility?

### Options Considered

**Option A: Remove Click-Outside Handler Entirely**
- Simply don't attach click-outside event listener
- Pros: Simplest implementation, no event handling complexity
- Cons: May leave existing handler in place if not removed properly
- Use case: New components without existing click-outside logic

**Option B: Conditional Click-Outside Handler**
- Add flag to enable/disable click-outside behavior
- Pros: Flexible, can be toggled via props or settings
- Cons: More complex, requires state management
- Use case: Components that need both behaviors

**Option C: Modal Pattern with Backdrop**
- Use modal overlay that doesn't close on backdrop click
- Pros: Clear visual indication, standard pattern
- Cons: May feel too "heavy" for a chatbot
- Use case: Critical dialogs, forms

### Decision: **Option A - Remove Click-Outside Handler**

**Rationale**:
1. **Simplicity**: No event listener = no complexity
2. **Requirement**: Spec explicitly states "clicking outside must NOT close chatbot"
3. **Accessibility**: Close button and Escape key still work
4. **UX**: Chatbot feels more like a persistent panel than a modal

**Implementation Details**:

**Current Behavior** (to be removed):
```typescript
// Existing click-outside handler (if present)
useEffect(() => {
  const handleClickOutside = (event) => {
    if (chatRef.current && !chatRef.current.contains(event.target)) {
      onClose();
    }
  };
  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, []);
```

**New Behavior**:
```typescript
// No click-outside handler
// Only close via:
// 1. Close button click: <button onClick={onClose}>❌</button>
// 2. Escape key: useEffect(() => { ... handle Escape ... })
```

**Accessibility Considerations**:
- ✅ Escape key closes chatbot
- ✅ Close button has ARIA label: `aria-label="Close chat"`
- ✅ Focus trap within chatbot (Tab cycles through interactive elements)
- ✅ Focus returns to trigger button when closed

**Testing**:
- E2E test: Click outside chatbot → chatbot remains open
- E2E test: Press Escape → chatbot closes
- E2E test: Click Close button → chatbot closes

---

## R5: JSON Filtering in Message Display

**Question**: How to reliably filter JSON tool call data from user-facing messages?

### Options Considered

**Option A: Regex-based Filtering**
- Use regex to detect and remove JSON blocks
- Pros: Fast, no parsing overhead
- Cons: Fragile, may miss edge cases, hard to maintain
- Use case: Simple, predictable JSON structures

**Option B: JSON Parsing with Try-Catch**
- Attempt to parse message as JSON, filter if successful
- Pros: Reliable detection, handles nested structures
- Cons: May filter legitimate JSON in user messages
- Use case: Messages that are pure JSON

**Option C: Server-Side Filtering**
- Backend filters tool calls before sending to frontend
- Pros: Most reliable, single source of truth, no client-side logic
- Cons: Requires backend changes, may need migration for existing messages
- Use case: New messages going forward

**Option D: Message Type Discrimination**
- Store message type in database (conversational vs tool_call)
- Pros: Explicit, no parsing needed, future-proof
- Cons: Requires schema change, migration for existing data
- Use case: Greenfield implementation

### Decision: **Option C - Server-Side Filtering**

**Rationale**:
1. **Reliability**: Backend has full context of tool calls vs conversational text
2. **Single Source of Truth**: Filtering logic in one place
3. **Performance**: No client-side parsing overhead
4. **Maintainability**: Easier to update filtering rules
5. **Existing Infrastructure**: Message model already has `tool_calls` field separate from `message_text`

**Implementation Details**:

**Backend Changes**:
```python
# In ConversationService.save_message()
def save_message(
    self,
    conversation_id: UUID,
    role: MessageRole,
    message_text: str,
    tool_calls: Optional[List[Dict[str, Any]]] = None
) -> Message:
    # message_text should ONLY contain conversational text
    # tool_calls should be stored in separate field
    # Frontend receives only message_text, not tool_calls
```

**Frontend Changes**:
```typescript
// Message display component
<div className="message">
  {message.message_text}  {/* Only conversational text */}
  {/* tool_calls are NOT displayed to user */}
</div>
```

**Current State Analysis**:
- ✅ Message model already separates `message_text` and `tool_calls`
- ✅ AI orchestrator should already be saving tool calls separately
- ⚠️ Need to verify: Are tool calls being included in message_text?

**Verification Steps**:
1. Review `AIAgentOrchestrator.process_message()` - ensure tool calls extracted separately
2. Review `ConversationService.save_message()` - ensure tool_calls parameter used correctly
3. Test: Send message with tool calls → verify message_text contains only conversational response

**Fallback**: If backend changes are too complex, implement Option B (JSON parsing) as temporary solution.

---

## Summary of Decisions

| Research Area | Decision | Rationale |
|---------------|----------|-----------|
| **R1: Infrastructure** | Extend existing services | 80% complete, minimal changes needed |
| **R2: Conversation List** | Offset-based pagination | Simple, performant for expected scale |
| **R3: State Management** | Fetch on demand | Scalable, clear loading states |
| **R4: Click-Outside** | Remove handler entirely | Simplest, meets requirement |
| **R5: JSON Filtering** | Server-side filtering | Most reliable, single source of truth |

## Implementation Priorities

**P0 (Critical)**:
1. Add conversation list endpoint (R2)
2. Add message retrieval endpoint (R2)
3. Implement server-side JSON filtering (R5)

**P1 (High)**:
1. Create history panel component (R3)
2. Implement conversation switching (R3)
3. Redesign header UI (R4)

**P2 (Medium)**:
1. Add loading states and error handling (R3)
2. Optimize database queries with indexes (R2)
3. Add E2E tests for all flows

## Open Questions

None. All research questions resolved with clear decisions.

## Next Steps

1. Create API contracts in `contracts/` directory
2. Document data model in `data-model.md`
3. Create quickstart guide in `quickstart.md`
4. Generate tasks with `/sp.tasks` command
