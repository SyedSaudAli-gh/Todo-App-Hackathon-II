# Component Specifications: Chat Frontend

**Feature**: 002-chat-frontend
**Date**: 2026-02-02
**Purpose**: Define all React components with props, state, and behavior contracts

---

## Component Hierarchy

```
ChatPage (page.tsx)
└── ChatContainer
    ├── MessageList
    │   └── Message (multiple)
    │       └── ToolCallDisplay (conditional)
    ├── MessageInput
    └── LoadingIndicator (conditional)
```

---

## C1: ChatPage (App Router Page Component)

**File**: `web/src/app/chat/[[...conversationId]]/page.tsx`

**Purpose**: Top-level page component that handles authentication and routing.

### Props
```typescript
interface ChatPageProps {
  params: {
    conversationId?: string[];  // Optional catch-all route
  };
}
```

### State
```typescript
// No local state - delegates to ChatContainer
```

### Behavior
1. Check authentication with `useSession()` from NextAuth
2. Redirect to `/auth/signin` if unauthenticated
3. Show loading spinner while checking auth status
4. Extract JWT token from session
5. Extract conversationId from URL params (if present)
6. Render ChatContainer with token and conversationId

### TypeScript Interface
```typescript
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function ChatPage({ params }: ChatPageProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const conversationId = params.conversationId?.[0] || null;

  // Authentication check
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  return (
    <ChatContainer
      token={session?.accessToken}
      conversationId={conversationId}
    />
  );
}
```

### Validation Rules
- Must redirect if `status === 'unauthenticated'`
- Must show loading state while `status === 'loading'`
- Must pass valid JWT token to ChatContainer
- Must handle missing conversationId gracefully (start new conversation)

---

## C2: ChatContainer

**File**: `web/src/components/chat/ChatContainer.tsx`

**Purpose**: Main chat interface container that manages conversation state and orchestrates child components.

### Props
```typescript
interface ChatContainerProps {
  token: string;                    // JWT token from NextAuth
  conversationId: string | null;    // Optional conversation ID from URL
}
```

### State
```typescript
interface ChatContainerState {
  messages: Message[];              // Array of conversation messages
  isLoading: boolean;               // True when waiting for AI response
  error: string | null;             // Error message if API call fails
  currentConversationId: string | null;  // Active conversation ID
}
```

### Behavior
1. **On Mount**:
   - If conversationId provided, fetch conversation history from backend
   - If no conversationId, initialize empty messages array
   - Set up message state

2. **On Send Message**:
   - Add user message to messages array (optimistic UI)
   - Set isLoading = true
   - Call API client sendMessage()
   - On success: Add assistant response to messages, update conversationId
   - On error: Set error state, remove optimistic user message
   - Set isLoading = false

3. **On Error**:
   - Display error message in UI
   - Allow user to retry

### TypeScript Interface
```typescript
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  tool_calls?: ToolCall[];
}

interface ToolCall {
  tool_name: string;
  arguments: Record<string, any>;
  result: any;
}

export function ChatContainer({ token, conversationId }: ChatContainerProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(conversationId);

  // Fetch conversation history on mount
  useEffect(() => {
    if (conversationId) {
      fetchConversationHistory(conversationId, token);
    }
  }, [conversationId, token]);

  const handleSendMessage = async (message: string) => {
    // Implementation in API client section
  };

  return (
    <div className="flex flex-col h-screen">
      <MessageList messages={messages} />
      {isLoading && <LoadingIndicator />}
      {error && <ErrorDisplay message={error} />}
      <MessageInput onSend={handleSendMessage} disabled={isLoading} />
    </div>
  );
}
```

### Validation Rules
- Must not send message if isLoading = true
- Must handle 401 errors by redirecting to login
- Must update URL when new conversation created
- Must preserve message order (chronological)
- Must auto-scroll to latest message

---

## C3: MessageList

**File**: `web/src/components/chat/MessageList.tsx`

**Purpose**: Displays list of messages with visual distinction between user and assistant.

### Props
```typescript
interface MessageListProps {
  messages: Message[];
}
```

### State
```typescript
// No local state - purely presentational
```

### Behavior
1. Render messages in chronological order
2. Apply different styling for user vs assistant messages
3. Auto-scroll to bottom when new message added
4. Display timestamps
5. Show tool calls if present

### TypeScript Interface
```typescript
export function MessageList({ messages }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
```

### Styling Rules
- User messages: Right-aligned, blue background (`bg-blue-100`)
- Assistant messages: Left-aligned, gray background (`bg-gray-100`)
- Max width: 80% of container
- Padding: 12px
- Border radius: 8px
- Timestamps: Small gray text below message

---

## C4: Message

**File**: `web/src/components/chat/Message.tsx`

**Purpose**: Individual message component with role-based styling.

### Props
```typescript
interface MessageProps {
  message: Message;
}
```

### State
```typescript
interface MessageState {
  showToolCalls: boolean;  // Toggle for tool call details
}
```

### Behavior
1. Display message content
2. Apply role-based styling
3. Show timestamp
4. If tool_calls present, show collapsible tool call section

### TypeScript Interface
```typescript
export function Message({ message }: MessageProps) {
  const [showToolCalls, setShowToolCalls] = useState(false);

  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] rounded-lg p-3 ${
        isUser ? 'bg-blue-100 text-blue-900' : 'bg-gray-100 text-gray-900'
      }`}>
        <p className="text-sm">{message.content}</p>
        <p className="text-xs text-gray-500 mt-1">
          {formatTimestamp(message.timestamp)}
        </p>

        {message.tool_calls && message.tool_calls.length > 0 && (
          <ToolCallDisplay
            toolCalls={message.tool_calls}
            isExpanded={showToolCalls}
            onToggle={() => setShowToolCalls(!showToolCalls)}
          />
        )}
      </div>
    </div>
  );
}
```

### Validation Rules
- Must handle missing timestamps gracefully
- Must sanitize message content (prevent XSS)
- Must truncate very long messages (>1000 chars) with "Show more"

---

## C5: MessageInput

**File**: `web/src/components/chat/MessageInput.tsx`

**Purpose**: Text input field for user to send messages.

### Props
```typescript
interface MessageInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
}
```

### State
```typescript
interface MessageInputState {
  inputValue: string;
}
```

### Behavior
1. Capture user text input
2. Send message on Enter key (Shift+Enter for new line)
3. Send message on button click
4. Clear input after sending
5. Disable input when loading

### TypeScript Interface
```typescript
export function MessageInput({ onSend, disabled }: MessageInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (inputValue.trim() && !disabled) {
      onSend(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t p-4 flex gap-2">
      <textarea
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder="Type your message..."
        className="flex-1 p-2 border rounded-lg resize-none"
        rows={3}
      />
      <button
        onClick={handleSend}
        disabled={disabled || !inputValue.trim()}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
      >
        Send
      </button>
    </div>
  );
}
```

### Validation Rules
- Must not send empty messages (whitespace only)
- Must trim whitespace before sending
- Must disable input when disabled prop is true
- Must clear input after successful send
- Must support multi-line input (Shift+Enter)

---

## C6: LoadingIndicator

**File**: `web/src/components/chat/LoadingIndicator.tsx`

**Purpose**: Visual indicator that AI is processing response.

### Props
```typescript
interface LoadingIndicatorProps {
  // No props - purely presentational
}
```

### State
```typescript
// No state - purely presentational
```

### Behavior
1. Display animated loading dots
2. Show "AI is thinking..." message

### TypeScript Interface
```typescript
export function LoadingIndicator() {
  return (
    <div className="flex justify-start p-4">
      <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
          </div>
          <span className="text-sm text-gray-600">AI is thinking...</span>
        </div>
      </div>
    </div>
  );
}
```

### Styling Rules
- Same styling as assistant messages
- Animated dots with staggered bounce
- Gray color scheme

---

## C7: ToolCallDisplay

**File**: `web/src/components/chat/ToolCallDisplay.tsx`

**Purpose**: Collapsible display of tool calls made by AI assistant.

### Props
```typescript
interface ToolCallDisplayProps {
  toolCalls: ToolCall[];
  isExpanded: boolean;
  onToggle: () => void;
}
```

### State
```typescript
// No local state - controlled by parent
```

### Behavior
1. Show "View tool calls" button when collapsed
2. Show tool call details when expanded
3. Display tool name, arguments, and result

### TypeScript Interface
```typescript
export function ToolCallDisplay({ toolCalls, isExpanded, onToggle }: ToolCallDisplayProps) {
  return (
    <div className="mt-2 border-t pt-2">
      <button
        onClick={onToggle}
        className="text-xs text-blue-600 hover:underline"
      >
        {isExpanded ? 'Hide' : 'View'} tool calls ({toolCalls.length})
      </button>

      {isExpanded && (
        <div className="mt-2 space-y-2">
          {toolCalls.map((call, index) => (
            <div key={index} className="bg-white p-2 rounded text-xs">
              <p className="font-semibold">{call.tool_name}</p>
              <p className="text-gray-600">Args: {JSON.stringify(call.arguments)}</p>
              <p className="text-gray-600">Result: {JSON.stringify(call.result)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### Validation Rules
- Must handle empty tool_calls array
- Must format JSON readably
- Must truncate very long arguments/results

---

## Component Integration Summary

**Data Flow**:
1. ChatPage → authenticates → passes token to ChatContainer
2. ChatContainer → manages state → passes messages to MessageList
3. MessageList → renders → individual Message components
4. MessageInput → captures input → calls ChatContainer.handleSendMessage
5. ChatContainer → calls API → updates messages state

**State Management**:
- Authentication state: NextAuth (ChatPage)
- Conversation state: React useState (ChatContainer)
- UI state: Local component state (Message, MessageInput)

**Error Handling**:
- Network errors: Display in ChatContainer
- Auth errors: Redirect in ChatPage
- Validation errors: Prevent in MessageInput

**Performance Considerations**:
- Auto-scroll only on new messages (useEffect dependency)
- Memoize Message components if list grows large
- Debounce input if needed (not required for MVP)
