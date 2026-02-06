# Research: Chat-Based Frontend for Todo AI Chatbot

**Feature**: 002-chat-frontend
**Date**: 2026-02-02
**Purpose**: Resolve technical unknowns about ChatKit integration and stateless frontend architecture

## R1: OpenAI ChatKit Integration

### Decision
Use OpenAI ChatKit React components with Next.js App Router by installing `@openai/chatkit` package and configuring domain key in environment variables.

### Rationale
- ChatKit provides pre-built, production-ready chat UI components
- Reduces development time compared to building custom chat UI
- Handles message rendering, input, and basic styling out of the box
- Supports customization through props and Tailwind CSS

### Alternatives Considered
1. **Custom Chat UI**: Rejected - violates user constraint to use ChatKit
2. **Other chat libraries (Stream Chat, SendBird)**: Rejected - user specified ChatKit

### Implementation Pattern

```typescript
import { ChatKit } from '@openai/chatkit';

export default function ChatPage() {
  return (
    <ChatKit
      domainKey={process.env.NEXT_PUBLIC_CHATKIT_DOMAIN_KEY}
      onSendMessage={handleSendMessage}
      messages={messages}
    />
  );
}
```

### Key Configuration
- Environment variable: `NEXT_PUBLIC_CHATKIT_DOMAIN_KEY`
- Domain allowlist: Add localhost:3000 and production domain to ChatKit dashboard
- Message format: `{role: 'user' | 'assistant', content: string, timestamp: Date}`

---

## R2: Stateless Frontend Architecture

### Decision
Store conversation_id in React component state (not localStorage). On page load, check URL parameter for conversation_id or start new conversation. Fetch conversation history from backend on mount.

### Rationale
- Aligns with stateless backend architecture (no client-side caching)
- Ensures single source of truth (database via backend API)
- Simplifies state management (no sync issues between local and remote)
- Page refresh requires re-fetching from backend (acceptable tradeoff)

### Alternatives Considered
1. **localStorage for conversation_id**: Rejected - violates "no local storage" constraint
2. **URL-based routing (/chat/[id])**: Considered - good option for conversation persistence
3. **Session storage**: Rejected - still violates "no local storage" constraint

### Implementation Pattern

```typescript
// Option A: React state only (conversation lost on refresh)
const [conversationId, setConversationId] = useState<string | null>(null);

// Option B: URL-based routing (conversation persists on refresh)
// Route: /chat/[conversationId]
const router = useRouter();
const { conversationId } = router.query;

// On mount: fetch conversation history if conversationId exists
useEffect(() => {
  if (conversationId) {
    fetchConversationHistory(conversationId);
  }
}, [conversationId]);
```

**Recommended**: Option B (URL-based routing) for better UX on page refresh

---

## R3: Backend API Integration

### Decision
Create API client with `sendMessage(conversationId, message, token)` function that calls POST /api/v1/chat with JWT authentication.

### Rationale
- Backend endpoint already exists and is functional
- Simple fetch API call with JSON request/response
- JWT token available from NextAuth session
- Error handling straightforward with try-catch

### Alternatives Considered
1. **GraphQL**: Rejected - backend uses REST API
2. **WebSocket**: Rejected - not needed for request-response pattern
3. **Server-Sent Events**: Rejected - no streaming requirement

### Implementation Pattern

```typescript
async function sendMessage(
  conversationId: string | null,
  message: string,
  token: string
): Promise<ChatResponse> {
  const response = await fetch(`${API_URL}/api/v1/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      conversation_id: conversationId,
      message: message
    })
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}
```

### Error Handling
- Network errors: Display "Connection failed" message
- 401 Unauthorized: Redirect to login
- 404 Not Found: Start new conversation
- 500 Server Error: Display "AI assistant unavailable" message

---

## R4: Message Display and Formatting

### Decision
Use ChatKit's built-in message rendering with custom styling via Tailwind CSS classes for user vs assistant distinction.

### Rationale
- ChatKit handles message rendering and scrolling
- Tailwind CSS provides easy customization
- Visual distinction improves UX
- Tool call information can be displayed as metadata

### Alternatives Considered
1. **Fully custom message components**: Rejected - defeats purpose of using ChatKit
2. **No visual distinction**: Rejected - poor UX

### Implementation Pattern

```typescript
<MessageList>
  {messages.map(msg => (
    <Message
      key={msg.id}
      role={msg.role}
      content={msg.content}
      timestamp={msg.timestamp}
      className={msg.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'}
    />
  ))}
</MessageList>
```

### Visual Distinction
- User messages: Right-aligned, blue background
- Assistant messages: Left-aligned, gray background
- Timestamps: Small text below each message
- Tool calls: Collapsible section showing tool name and result

---

## R5: Authentication Flow

### Decision
Use NextAuth `useSession()` hook to check authentication, redirect to login if unauthenticated, and extract JWT token for API calls.

### Rationale
- NextAuth already configured in application
- useSession() provides session data including JWT
- Simple redirect pattern for unauthenticated users
- Token refresh handled by NextAuth automatically

### Alternatives Considered
1. **Custom authentication**: Rejected - NextAuth already exists
2. **No authentication**: Rejected - violates security requirements

### Implementation Pattern

```typescript
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function ChatPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  // Extract JWT token
  const token = session?.accessToken;

  return <ChatContainer token={token} />;
}
```

### Token Handling
- Extract token from NextAuth session
- Pass token to API client for Authorization header
- Handle token expiration with 401 error → redirect to login
- Token refresh handled automatically by NextAuth

---

## Research Summary

All technical unknowns resolved. Key decisions:

1. **ChatKit Integration**: Install npm package, configure domain key, use React components
2. **Stateless Frontend**: URL-based routing (/chat/[conversationId]) for persistence on refresh
3. **API Integration**: Simple fetch API with JWT authentication
4. **Message Display**: ChatKit rendering with Tailwind CSS customization
5. **Authentication**: NextAuth useSession() hook with redirect for unauthenticated users

**Ready for Phase 1 (Design & Contracts)**.
