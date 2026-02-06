# State Management Design: Chat Frontend

**Feature**: 002-chat-frontend
**Date**: 2026-02-02
**Purpose**: Define how conversation state is managed in React without local storage

---

## Overview

The chat frontend uses a **stateless architecture** where all conversation data is persisted via the backend API. No local storage (localStorage, sessionStorage, or IndexedDB) is used. State management is handled through React hooks and URL-based routing for conversation persistence.

**Key Principle**: Backend database is the single source of truth for all conversation data.

---

## State Architecture

### State Layers

```
┌─────────────────────────────────────────┐
│  NextAuth Session (Authentication)      │
│  - JWT token                             │
│  - User info                             │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  URL State (Conversation Routing)        │
│  - /chat/[conversationId]                │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  ChatContainer State (Conversation)      │
│  - messages: Message[]                   │
│  - isLoading: boolean                    │
│  - error: string | null                  │
│  - currentConversationId: string | null  │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  Component State (UI)                    │
│  - inputValue: string                    │
│  - showToolCalls: boolean                │
└─────────────────────────────────────────┘
```

---

## Custom Hook: useChat

**File**: `web/src/lib/hooks/useChat.ts`

**Purpose**: Encapsulate conversation state management and API interactions.

### Hook Interface

```typescript
export interface UseChatOptions {
  conversationId: string | null;  // Initial conversation ID from URL
  token: string;                   // JWT token from NextAuth
}

export interface UseChatReturn {
  // State
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  conversationId: string | null;

  // Actions
  sendMessage: (message: string) => Promise<void>;
  clearError: () => void;
  resetConversation: () => void;

  // Status
  isInitialized: boolean;
}

export function useChat({ conversationId, token }: UseChatOptions): UseChatReturn
```

### Implementation

```typescript
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { sendMessage as apiSendMessage, getConversationHistory, handleApiError, isAuthError } from '@/lib/api/chat';

export function useChat({ conversationId, token }: UseChatOptions): UseChatReturn {
  const router = useRouter();

  // State
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(conversationId);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load conversation history on mount
  useEffect(() => {
    if (conversationId && token) {
      loadConversationHistory(conversationId, token);
    } else {
      setIsInitialized(true);
    }
  }, [conversationId, token]);

  // Load conversation history
  const loadConversationHistory = async (id: string, authToken: string) => {
    try {
      setIsLoading(true);
      const history = await getConversationHistory(id, authToken);

      // Convert backend messages to frontend format
      const formattedMessages: Message[] = history.messages.map(msg => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        timestamp: new Date(msg.timestamp),
        tool_calls: msg.tool_calls,
      }));

      setMessages(formattedMessages);
      setCurrentConversationId(id);
      setIsInitialized(true);
    } catch (err) {
      const apiError = err as ApiError;

      // Handle auth errors
      if (isAuthError(apiError)) {
        router.push('/auth/signin');
        return;
      }

      // Handle 404 (conversation not found) - start new conversation
      if (apiError.status === 404) {
        setMessages([]);
        setCurrentConversationId(null);
        router.push('/chat');
        setIsInitialized(true);
        return;
      }

      // Other errors
      setError(handleApiError(apiError));
      setIsInitialized(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Send message
  const sendMessage = useCallback(async (message: string) => {
    if (!token) {
      setError('Authentication required');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Optimistic UI: Add user message immediately
      const userMessage: Message = {
        id: `temp-${Date.now()}`,
        role: 'user',
        content: message,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMessage]);

      // Call API
      const response = await apiSendMessage(message, token, currentConversationId);

      // Update conversation ID if new conversation
      if (!currentConversationId) {
        setCurrentConversationId(response.conversation_id);
        router.push(`/chat/${response.conversation_id}`);
      }

      // Add assistant response
      const assistantMessage: Message = {
        id: `${Date.now()}`,
        role: 'assistant',
        content: response.response,
        timestamp: new Date(response.timestamp),
        tool_calls: response.tool_calls,
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      const apiError = err as ApiError;

      // Handle auth errors
      if (isAuthError(apiError)) {
        router.push('/auth/signin');
        return;
      }

      // Remove optimistic user message on error
      setMessages(prev => prev.slice(0, -1));
      setError(handleApiError(apiError));
    } finally {
      setIsLoading(false);
    }
  }, [token, currentConversationId, router]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Reset conversation (start new)
  const resetConversation = useCallback(() => {
    setMessages([]);
    setCurrentConversationId(null);
    setError(null);
    router.push('/chat');
  }, [router]);

  return {
    messages,
    isLoading,
    error,
    conversationId: currentConversationId,
    sendMessage,
    clearError,
    resetConversation,
    isInitialized,
  };
}
```

---

## State Flow Diagrams

### Initial Page Load

```
User navigates to /chat/[id]
         ↓
ChatPage checks authentication
         ↓
   Authenticated?
    ↙         ↘
  No          Yes
   ↓           ↓
Redirect   Extract conversationId from URL
to login        ↓
           Pass to ChatContainer
                ↓
           useChat hook initializes
                ↓
           conversationId exists?
            ↙         ↘
          No          Yes
           ↓           ↓
    Empty messages   Fetch history from API
    array (new)           ↓
                    Parse and set messages
                          ↓
                    Display conversation
```

### Send Message Flow

```
User types message and clicks Send
         ↓
MessageInput calls onSend()
         ↓
ChatContainer.handleSendMessage()
         ↓
useChat.sendMessage()
         ↓
Add user message to state (optimistic UI)
         ↓
Call API: POST /api/v1/chat
         ↓
    Success?
    ↙     ↘
  No      Yes
   ↓       ↓
Remove   Update conversationId (if new)
user msg     ↓
   ↓     Add assistant message to state
Show error   ↓
         Update URL (if new conversation)
              ↓
         Display assistant response
```

### Page Refresh Flow

```
User refreshes page
         ↓
URL contains conversationId?
    ↙         ↘
  No          Yes
   ↓           ↓
Start new   Fetch conversation history
conversation    ↓
   ↓        Restore messages from backend
Empty chat      ↓
           Display full conversation
```

---

## State Persistence Strategy

### What is Persisted (Backend)
- ✅ All messages (user and assistant)
- ✅ Conversation metadata (created_at, updated_at)
- ✅ Tool calls and results
- ✅ User association (via JWT token)

### What is NOT Persisted (Ephemeral)
- ❌ Input field value (cleared on send)
- ❌ Loading states (reset on page load)
- ❌ Error messages (cleared on new action)
- ❌ UI state (collapsed/expanded tool calls)

### Conversation Continuity

**Scenario 1: User sends message, then refreshes page**
- ✅ Conversation ID in URL preserved
- ✅ All messages fetched from backend
- ✅ Conversation continues seamlessly

**Scenario 2: User closes tab, reopens later**
- ✅ User can navigate to /chat/[id] directly
- ✅ Full conversation history loaded
- ✅ Can continue conversation

**Scenario 3: User starts new conversation**
- ✅ Navigate to /chat (no ID)
- ✅ Empty messages array
- ✅ First message creates new conversation
- ✅ URL updates to /chat/[new-id]

---

## Error State Management

### Error Types and Handling

```typescript
interface ErrorState {
  message: string;
  type: 'network' | 'auth' | 'validation' | 'server';
  recoverable: boolean;
}
```

| Error Type | State Action | User Action |
|-----------|-------------|-------------|
| Network (0) | Show error banner | Retry button |
| Auth (401) | Redirect to login | Re-authenticate |
| Validation (400) | Show inline error | Fix input |
| Server (500) | Show error banner | Retry button |
| Not Found (404) | Start new conversation | Automatic |

### Error Recovery

```typescript
// Recoverable errors: Show retry button
if (error && error.recoverable) {
  return (
    <div className="error-banner">
      <p>{error.message}</p>
      <button onClick={retryLastAction}>Retry</button>
    </div>
  );
}

// Non-recoverable errors: Show message only
if (error && !error.recoverable) {
  return (
    <div className="error-banner">
      <p>{error.message}</p>
    </div>
  );
}
```

---

## Loading State Management

### Loading Indicators

```typescript
interface LoadingState {
  isLoading: boolean;           // Global loading state
  loadingType: 'send' | 'fetch' | null;  // Type of operation
}
```

**Loading States**:
1. **Fetching history**: Show skeleton loader for messages
2. **Sending message**: Show typing indicator at bottom
3. **Waiting for response**: Show "AI is thinking..." indicator

### Optimistic UI Updates

```typescript
// Add user message immediately (optimistic)
setMessages(prev => [...prev, userMessage]);

// If API call fails, remove optimistic message
if (error) {
  setMessages(prev => prev.slice(0, -1));
}
```

---

## State Validation Rules

### Message State
- ✅ Messages array must be chronologically ordered
- ✅ Each message must have unique ID
- ✅ User and assistant messages must alternate (ideally)
- ✅ Timestamps must be valid Date objects

### Conversation State
- ✅ conversationId must be valid UUID or null
- ✅ conversationId in state must match URL parameter
- ✅ Cannot send message without authentication token

### UI State
- ✅ Cannot send message while isLoading = true
- ✅ Input must be cleared after successful send
- ✅ Error must be cleared before new send attempt

---

## Performance Considerations

### State Updates
- Use `useCallback` for action functions to prevent re-renders
- Memoize message list if performance issues arise
- Avoid unnecessary state updates (check if value changed)

### Memory Management
- No memory leaks (all state cleared on unmount)
- No infinite loops (proper useEffect dependencies)
- No stale closures (use latest state in callbacks)

---

## Testing Strategy

### Unit Tests (useChat hook)
```typescript
describe('useChat', () => {
  it('should initialize with empty messages for new conversation', () => {
    const { result } = renderHook(() => useChat({ conversationId: null, token: 'test' }));
    expect(result.current.messages).toEqual([]);
  });

  it('should fetch conversation history on mount', async () => {
    const { result } = renderHook(() => useChat({ conversationId: 'test-id', token: 'test' }));
    await waitFor(() => expect(result.current.isInitialized).toBe(true));
    expect(result.current.messages.length).toBeGreaterThan(0);
  });

  it('should add user message optimistically', async () => {
    const { result } = renderHook(() => useChat({ conversationId: null, token: 'test' }));
    act(() => {
      result.current.sendMessage('Hello');
    });
    expect(result.current.messages[0].role).toBe('user');
  });
});
```

### Integration Tests
- Test full conversation flow (send → receive → display)
- Test page refresh with conversation ID
- Test error handling and recovery
- Test authentication failure redirect

---

## State Management Summary

**Architecture**: React hooks + URL routing (no local storage)

**Key Components**:
- `useChat` hook: Encapsulates conversation state and API calls
- URL state: Persists conversation ID across refreshes
- NextAuth session: Provides authentication token

**State Flow**:
1. URL → conversationId
2. NextAuth → JWT token
3. useChat → fetch history → messages state
4. User action → API call → update state
5. State change → re-render components

**Persistence**: All data persisted via backend API (single source of truth)

**Error Handling**: Typed errors with recovery actions

**Performance**: Optimistic UI updates, memoized callbacks, efficient re-renders
