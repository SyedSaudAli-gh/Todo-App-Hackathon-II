# API Client Contract: Chat Frontend

**Feature**: 002-chat-frontend
**Date**: 2026-02-02
**Purpose**: Define TypeScript API client for backend communication

---

## Overview

The API client provides a typed interface for communicating with the backend chat endpoint. It handles request formatting, authentication, error handling, and response parsing.

**Backend Endpoint**: `POST /api/v1/chat`
**Authentication**: JWT Bearer token in Authorization header
**Base URL**: `process.env.NEXT_PUBLIC_API_URL` (e.g., http://localhost:8000)

---

## API Client Module

**File**: `web/src/lib/api/chat.ts`

### TypeScript Types

```typescript
// Request Types
export interface SendMessageRequest {
  conversation_id?: string | null;  // Optional for first message
  message: string;                   // User's message text
}

// Response Types
export interface SendMessageResponse {
  conversation_id: string;           // UUID of conversation
  response: string;                  // AI assistant's response
  tool_calls: ToolCall[];           // Array of tool calls made
  timestamp: string;                 // ISO 8601 timestamp
}

export interface ToolCall {
  tool_name: string;                 // Name of tool called
  arguments: Record<string, any>;    // Tool arguments
  result: any;                       // Tool execution result
}

// Error Types
export interface ApiError {
  status: number;                    // HTTP status code
  message: string;                   // Error message
  details?: any;                     // Additional error details
}

// Conversation History Types
export interface ConversationMessage {
  id: string;                        // Message UUID
  role: 'user' | 'assistant';       // Message sender
  content: string;                   // Message text
  timestamp: string;                 // ISO 8601 timestamp
  tool_calls?: ToolCall[];          // Tool calls (assistant only)
}

export interface ConversationHistoryResponse {
  conversation_id: string;
  messages: ConversationMessage[];
  created_at: string;
  updated_at: string;
}
```

---

## Function: sendMessage

**Purpose**: Send a user message to the AI assistant and receive response.

### Signature
```typescript
export async function sendMessage(
  message: string,
  token: string,
  conversationId?: string | null
): Promise<SendMessageResponse>
```

### Parameters
- `message` (string, required): User's message text (1-5000 characters)
- `token` (string, required): JWT authentication token from NextAuth
- `conversationId` (string | null, optional): Existing conversation ID or null for new conversation

### Returns
- `Promise<SendMessageResponse>`: AI assistant's response with conversation ID

### Throws
- `ApiError`: On network error, authentication failure, or server error

### Implementation
```typescript
export async function sendMessage(
  message: string,
  token: string,
  conversationId?: string | null
): Promise<SendMessageResponse> {
  // Validation
  if (!message || message.trim().length === 0) {
    throw new Error('Message cannot be empty');
  }
  if (message.length > 5000) {
    throw new Error('Message too long (max 5000 characters)');
  }
  if (!token) {
    throw new Error('Authentication token required');
  }

  // Build request
  const requestBody: SendMessageRequest = {
    message: message.trim(),
  };

  if (conversationId) {
    requestBody.conversation_id = conversationId;
  }

  // Make API call
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    });

    // Handle errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        status: response.status,
        message: errorData.detail || `HTTP ${response.status}`,
        details: errorData,
      } as ApiError;
    }

    // Parse response
    const data: SendMessageResponse = await response.json();
    return data;
  } catch (error) {
    // Network or parsing error
    if ((error as ApiError).status) {
      throw error;  // Re-throw ApiError
    }
    throw {
      status: 0,
      message: 'Network error: Unable to reach server',
      details: error,
    } as ApiError;
  }
}
```

### Error Handling

| Status Code | Error Type | Action |
|-------------|-----------|--------|
| 400 | Bad Request | Display validation error to user |
| 401 | Unauthorized | Redirect to login page |
| 404 | Not Found | Start new conversation |
| 500 | Server Error | Display "AI assistant unavailable" |
| 0 | Network Error | Display "Connection failed" |

---

## Function: getConversationHistory

**Purpose**: Fetch all messages from an existing conversation.

### Signature
```typescript
export async function getConversationHistory(
  conversationId: string,
  token: string
): Promise<ConversationHistoryResponse>
```

### Parameters
- `conversationId` (string, required): UUID of conversation to fetch
- `token` (string, required): JWT authentication token

### Returns
- `Promise<ConversationHistoryResponse>`: Conversation metadata and messages

### Throws
- `ApiError`: On network error, authentication failure, or conversation not found

### Implementation
```typescript
export async function getConversationHistory(
  conversationId: string,
  token: string
): Promise<ConversationHistoryResponse> {
  // Validation
  if (!conversationId) {
    throw new Error('Conversation ID required');
  }
  if (!token) {
    throw new Error('Authentication token required');
  }

  // Make API call
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/conversations/${conversationId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    // Handle errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        status: response.status,
        message: errorData.detail || `HTTP ${response.status}`,
        details: errorData,
      } as ApiError;
    }

    // Parse response
    const data: ConversationHistoryResponse = await response.json();
    return data;
  } catch (error) {
    if ((error as ApiError).status) {
      throw error;
    }
    throw {
      status: 0,
      message: 'Network error: Unable to reach server',
      details: error,
    } as ApiError;
  }
}
```

---

## Error Handling Utilities

### Function: handleApiError

**Purpose**: Centralized error handling for API errors.

```typescript
export function handleApiError(error: ApiError): string {
  switch (error.status) {
    case 400:
      return error.message || 'Invalid request. Please check your input.';
    case 401:
      return 'Authentication failed. Please log in again.';
    case 404:
      return 'Conversation not found. Starting new conversation.';
    case 500:
      return 'AI assistant is temporarily unavailable. Please try again.';
    case 0:
      return 'Connection failed. Please check your internet connection.';
    default:
      return `Error: ${error.message}`;
  }
}
```

### Function: isAuthError

**Purpose**: Check if error requires re-authentication.

```typescript
export function isAuthError(error: ApiError): boolean {
  return error.status === 401;
}
```

---

## Usage Example

```typescript
import { sendMessage, getConversationHistory, handleApiError, isAuthError } from '@/lib/api/chat';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

function ChatContainer() {
  const { data: session } = useSession();
  const router = useRouter();
  const [conversationId, setConversationId] = useState<string | null>(null);

  const handleSendMessage = async (message: string) => {
    try {
      const response = await sendMessage(
        message,
        session?.accessToken!,
        conversationId
      );

      // Update conversation ID if new
      if (!conversationId) {
        setConversationId(response.conversation_id);
        // Update URL
        router.push(`/chat/${response.conversation_id}`);
      }

      // Add assistant response to messages
      addMessage({
        role: 'assistant',
        content: response.response,
        tool_calls: response.tool_calls,
        timestamp: response.timestamp,
      });
    } catch (error) {
      const apiError = error as ApiError;

      // Handle auth errors
      if (isAuthError(apiError)) {
        router.push('/auth/signin');
        return;
      }

      // Display error to user
      setError(handleApiError(apiError));
    }
  };

  return (
    // Component JSX
  );
}
```

---

## Testing Considerations

### Unit Tests
- Test request formatting with/without conversationId
- Test error handling for each status code
- Test token injection in headers
- Test response parsing

### Integration Tests
- Test successful message send
- Test conversation history fetch
- Test authentication failure handling
- Test network error handling

### Mock Responses
```typescript
// Success response
const mockSuccessResponse: SendMessageResponse = {
  conversation_id: '123e4567-e89b-12d3-a456-426614174000',
  response: 'I created a new task for you.',
  tool_calls: [
    {
      tool_name: 'add_task',
      arguments: { title: 'Buy groceries', priority: 'high' },
      result: { id: 1, title: 'Buy groceries', status: 'pending' },
    },
  ],
  timestamp: '2026-02-02T10:30:00Z',
};

// Error response
const mockErrorResponse: ApiError = {
  status: 401,
  message: 'Invalid or expired token',
  details: { code: 'TOKEN_EXPIRED' },
};
```

---

## Performance Considerations

- **Request Timeout**: Consider adding timeout (e.g., 30 seconds)
- **Retry Logic**: Implement exponential backoff for 5xx errors
- **Request Cancellation**: Support AbortController for cancelled requests
- **Caching**: No caching (stateless architecture)

---

## Security Considerations

- **Token Storage**: Never log or expose JWT tokens
- **HTTPS Only**: Enforce HTTPS in production
- **Input Sanitization**: Sanitize message content before sending
- **XSS Prevention**: Sanitize response content before rendering
- **CSRF Protection**: Not needed (JWT authentication, no cookies)

---

## API Client Summary

**Exports**:
- `sendMessage()` - Send user message to AI
- `getConversationHistory()` - Fetch conversation messages
- `handleApiError()` - Format error messages
- `isAuthError()` - Check if re-auth needed

**Dependencies**:
- `fetch` API (built-in)
- Environment variable: `NEXT_PUBLIC_API_URL`
- NextAuth session for JWT token

**Error Handling**:
- Typed errors with status codes
- Centralized error formatting
- Auth error detection for redirects
