# Quick Start Guide: Chatbot UX Polish Implementation

**Feature**: 007-chatbot-ux-polish
**Date**: 2026-02-05
**Purpose**: Practical guide for implementing chatbot UX improvements

## Overview

This guide provides step-by-step instructions for implementing the chatbot UX polish feature. All changes are frontend-only modifications to existing React components.

## Prerequisites

- Node.js and npm installed
- Next.js development environment running
- Familiarity with React hooks and TypeScript
- Understanding of Tailwind CSS and Framer Motion

## Component Modification Guide

### 1. ChatPanel.tsx - Remove Click-Outside Behavior

**File**: `web/src/components/chatbot/ChatPanel.tsx`

**Changes Required**:

1. **Remove click-outside handler** (lines 71-92):
   ```typescript
   // DELETE THIS ENTIRE useEffect BLOCK:
   useEffect(() => {
     const handleClickOutside = (event: MouseEvent) => {
       if (
         panelRef.current &&
         !panelRef.current.contains(event.target as Node) &&
         window.innerWidth >= 768
       ) {
         onClose();
       }
     };

     if (isOpen) {
       setTimeout(() => {
         document.addEventListener('mousedown', handleClickOutside);
       }, 100);
     }

     return () => {
       document.removeEventListener('mousedown', handleClickOutside);
     };
   }, [isOpen, onClose]);
   ```

2. **Add Escape key handler** (add after focus trap useEffect):
   ```typescript
   // ADD THIS NEW useEffect:
   useEffect(() => {
     const handleEscapeKey = (e: KeyboardEvent) => {
       if (e.key === 'Escape' && isOpen) {
         onClose();
       }
     };

     if (isOpen) {
       document.addEventListener('keydown', handleEscapeKey);
     }

     return () => {
       document.removeEventListener('keydown', handleEscapeKey);
     };
   }, [isOpen, onClose]);
   ```

3. **Update backdrop click handler** (line 105):
   ```typescript
   // KEEP backdrop for mobile, but remove onClick:
   <motion.div
     initial={{ opacity: 0 }}
     animate={{ opacity: 1 }}
     exit={{ opacity: 0 }}
     transition={{ duration: 0.2 }}
     className="fixed inset-0 bg-black/50 z-[999] md:hidden"
     // REMOVE: onClick={onClose}
     aria-hidden="true"
   />
   ```

**Testing**:
- Open chatbot
- Click outside chatbot area
- Verify chatbot remains open
- Press Escape key
- Verify chatbot closes

---

### 2. ChatContainer.tsx - Add Close Button and Error Handling

**File**: `web/src/components/chat/ChatContainer.tsx`

**Changes Required**:

1. **Add onClose prop to interface**:
   ```typescript
   interface ChatContainerProps {
     token: string;
     conversationId: string | null;
     onClose: () => void; // ADD THIS
   }
   ```

2. **Update component signature**:
   ```typescript
   export function ChatContainer({
     token,
     conversationId,
     onClose // ADD THIS
   }: ChatContainerProps) {
   ```

3. **Add error mapping function** (before component):
   ```typescript
   function mapErrorToUserFriendly(error: string): string {
     // Log original error for debugging
     console.error('Chat error:', error);

     // Map to user-friendly messages
     if (error.toLowerCase().includes('network')) {
       return 'Unable to connect. Please check your internet connection.';
     }
     if (error.includes('500')) {
       return 'Something went wrong. Please try again.';
     }
     if (error.includes('401') || error.includes('unauthorized')) {
       return 'Your session has expired. Please sign in again.';
     }
     if (error.toLowerCase().includes('timeout')) {
       return 'The request took too long. Please try again.';
     }
     // Generic fallback
     return 'An unexpected error occurred. Please try again.';
   }
   ```

4. **Add close button to header** (modify existing header):
   ```typescript
   {currentConversationId && (
     <div className="bg-white border-b shadow-sm flex justify-between items-center
       px-3 py-2
       sm:px-4 sm:py-2.5
       md:px-4 md:py-3">
       <button
         onClick={resetConversation}
         className="bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium
           px-3 py-1.5 text-xs
           sm:px-3 sm:py-1.5 sm:text-sm
           md:px-4 md:py-2 md:text-sm
           lg:px-4 lg:py-2 lg:text-base"
       >
         New Conversation
       </button>
       {/* ADD THIS CLOSE BUTTON: */}
       <button
         onClick={onClose}
         aria-label="Close chat"
         className="p-1 hover:bg-accent rounded-lg transition-colors
           sm:p-1.5
           md:p-2"
       >
         <X className="w-4 h-4 sm:w-5 sm:h-5 md:w-5 md:h-5 lg:w-6 lg:h-6" />
       </button>
     </div>
   )}
   ```

5. **Update error display** (modify existing error section):
   ```typescript
   {error && (
     <div className="bg-red-50 border-l-4 border-red-500 mx-2 mt-2
       p-3
       sm:mx-3 sm:mt-3 sm:p-3
       md:mx-4 md:mt-4 md:p-4">
       <div className="flex items-center justify-between gap-2">
         {/* CHANGE THIS LINE: */}
         <p className="text-red-700 flex-1
           text-xs
           sm:text-sm
           md:text-sm">{mapErrorToUserFriendly(error)}</p>
         <button
           onClick={clearError}
           className="text-red-500 hover:text-red-700 font-medium whitespace-nowrap
             text-xs
             sm:text-sm
             md:text-sm"
         >
           Dismiss
         </button>
       </div>
     </div>
   )}
   ```

6. **Add import for X icon**:
   ```typescript
   import { X } from 'lucide-react';
   ```

**Testing**:
- Open chatbot
- Verify close button appears in header
- Click close button
- Verify chatbot closes
- Trigger error (disconnect network)
- Verify user-friendly error message displays

---

### 3. ChatPanel.tsx - Pass onClose to ChatContainer

**File**: `web/src/components/chatbot/ChatPanel.tsx`

**Changes Required**:

Update ChatContainer usage to pass onClose prop:

```typescript
<div className="flex-1 overflow-hidden min-h-0">
  <ChatContainer
    token={token}
    conversationId={conversationId}
    onClose={onClose} // ADD THIS
  />
</div>
```

---

### 4. LoadingIndicator.tsx - Add Tool Status Support

**File**: `web/src/components/chat/LoadingIndicator.tsx`

**Changes Required**:

1. **Add status prop to interface**:
   ```typescript
   interface LoadingIndicatorProps {
     status?: string;
   }
   ```

2. **Update component signature**:
   ```typescript
   export function LoadingIndicator({ status }: LoadingIndicatorProps = {}) {
   ```

3. **Update display text**:
   ```typescript
   <div className="flex justify-start p-4">
     <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
       <div className="flex items-center gap-2">
         <div className="flex gap-1">
           <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
           <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.1s]" />
           <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
         </div>
         {/* CHANGE THIS LINE: */}
         <span className="text-sm text-gray-600">
           {status || 'AI is thinking...'}
         </span>
       </div>
     </div>
   </div>
   ```

**Testing**:
- Send message to chatbot
- Verify "AI is thinking..." displays
- (Tool status tracking requires useChat hook changes - see next section)

---

### 5. useChat Hook - Add Tool Status Tracking

**File**: `web/src/lib/hooks/useChat.ts`

**Changes Required**:

1. **Add toolExecutionStatus state**:
   ```typescript
   const [toolExecutionStatus, setToolExecutionStatus] = useState<string | null>(null);
   ```

2. **Parse tool calls from messages** (in sendMessage function):
   ```typescript
   // After receiving agent response, check for tool calls
   // This is a simplified example - actual implementation depends on message format
   const parseToolStatus = (message: Message): string | null => {
     if (message.role === 'assistant' && message.tool_calls) {
       const toolCall = message.tool_calls[0];
       if (toolCall) {
         const toolName = toolCall.function?.name || '';
         if (toolName.includes('create')) return 'Creating task...';
         if (toolName.includes('update')) return 'Updating task...';
         if (toolName.includes('delete')) return 'Deleting task...';
         if (toolName.includes('list')) return 'Loading tasks...';
       }
     }
     return null;
   };

   // In sendMessage, update status:
   const sendMessage = async (message: string) => {
     try {
       setIsLoading(true);
       setToolExecutionStatus(null);

       // ... existing send logic ...

       // After receiving response:
       const status = parseToolStatus(responseMessage);
       if (status) {
         setToolExecutionStatus(status);
         // Clear after a delay
         setTimeout(() => setToolExecutionStatus(null), 2000);
       }
     } catch (error) {
       // ... error handling ...
     } finally {
       setIsLoading(false);
     }
   };
   ```

3. **Add to return value**:
   ```typescript
   return {
     messages,
     isLoading,
     error,
     conversationId: currentConversationId,
     toolExecutionStatus, // ADD THIS
     sendMessage,
     clearError,
     resetConversation,
     isInitialized,
   };
   ```

**Note**: The exact implementation depends on your message format and how tool calls are represented in the API response. Adjust the `parseToolStatus` function accordingly.

---

### 6. ChatContainer.tsx - Pass Tool Status to LoadingIndicator

**File**: `web/src/components/chat/ChatContainer.tsx`

**Changes Required**:

1. **Destructure toolExecutionStatus from useChat**:
   ```typescript
   const {
     messages,
     isLoading,
     error,
     conversationId: currentConversationId,
     toolExecutionStatus, // ADD THIS
     sendMessage,
     clearError,
     resetConversation,
     isInitialized,
   } = useChat({ conversationId, token });
   ```

2. **Pass status to LoadingIndicator**:
   ```typescript
   {isLoading && <LoadingIndicator status={toolExecutionStatus} />}
   ```

---

### 7. MessageList.tsx - Improve Auto-Scroll Stability

**File**: `web/src/components/chat/MessageList.tsx`

**Changes Required**:

1. **Add scroll tracking state**:
   ```typescript
   const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
   const containerRef = useRef<HTMLDivElement>(null);
   ```

2. **Add scroll event handler**:
   ```typescript
   const handleScroll = () => {
     if (!containerRef.current) return;

     const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
     const isAtBottom = scrollHeight - scrollTop - clientHeight < 50; // 50px threshold

     setShouldAutoScroll(isAtBottom);
   };
   ```

3. **Update auto-scroll effect**:
   ```typescript
   useEffect(() => {
     if (shouldAutoScroll) {
       messagesEndRef.current?.scrollIntoView({
         behavior: 'smooth',
         block: 'end'
       });
     }
   }, [messages, shouldAutoScroll]);
   ```

4. **Add scroll listener**:
   ```typescript
   useEffect(() => {
     const container = containerRef.current;
     if (container) {
       container.addEventListener('scroll', handleScroll);
       return () => container.removeEventListener('scroll', handleScroll);
     }
   }, []);
   ```

5. **Update container div**:
   ```typescript
   <div
     ref={containerRef}
     className="flex-1 overflow-y-auto p-4 space-y-4"
     onScroll={handleScroll}
   >
   ```

**Testing**:
- Send multiple messages
- Scroll up to read old messages
- Send new message
- Verify auto-scroll does NOT interrupt reading
- Scroll to bottom
- Send new message
- Verify auto-scroll works

---

## Testing Checklist

### Unit Tests

Create test files in `web/tests/components/`:

**ChatPanel.test.tsx**:
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { ChatPanel } from '@/components/chatbot/ChatPanel';

describe('ChatPanel', () => {
  it('should not close when clicking outside', () => {
    const onClose = jest.fn();
    render(<ChatPanel isOpen={true} onClose={onClose} token="test" conversationId={null} />);

    fireEvent.mouseDown(document.body);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('should close when pressing Escape', () => {
    const onClose = jest.fn();
    render(<ChatPanel isOpen={true} onClose={onClose} token="test" conversationId={null} />);

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });

  it('should close when clicking close button', () => {
    const onClose = jest.fn();
    render(<ChatPanel isOpen={true} onClose={onClose} token="test" conversationId={null} />);

    const closeButton = screen.getByLabelText('Close chat');
    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalled();
  });
});
```

**ChatContainer.test.tsx**:
```typescript
import { render, screen } from '@testing-library/react';
import { ChatContainer } from '@/components/chat/ChatContainer';

describe('ChatContainer', () => {
  it('should display user-friendly error messages', () => {
    // Mock useChat to return error
    jest.mock('@/lib/hooks/useChat', () => ({
      useChat: () => ({
        messages: [],
        isLoading: false,
        error: 'Network error',
        conversationId: null,
        sendMessage: jest.fn(),
        clearError: jest.fn(),
        resetConversation: jest.fn(),
        isInitialized: true,
      }),
    }));

    render(<ChatContainer token="test" conversationId={null} onClose={jest.fn()} />);

    expect(screen.getByText(/unable to connect/i)).toBeInTheDocument();
  });

  it('should render close button', () => {
    render(<ChatContainer token="test" conversationId="123" onClose={jest.fn()} />);

    const closeButton = screen.getByLabelText('Close chat');
    expect(closeButton).toBeInTheDocument();
  });
});
```

### Integration Tests

Test complete chat flows:

1. **Open → Send → Close Flow**:
   - Open chatbot
   - Send message
   - Verify response appears
   - Click close button
   - Verify chatbot closes

2. **Error Handling Flow**:
   - Open chatbot
   - Trigger network error
   - Verify user-friendly error displays
   - Click dismiss
   - Verify error clears

3. **Tool Execution Flow**:
   - Open chatbot
   - Send "Create a task"
   - Verify "Creating task..." status
   - Wait for completion
   - Verify status clears

### E2E Tests (Playwright/Cypress)

Create E2E tests for user stories:

```typescript
// Example Playwright test
test('chatbot remains open when clicking outside', async ({ page }) => {
  await page.goto('/dashboard/todos');

  // Open chatbot
  await page.click('[aria-label="Open chat"]');
  await expect(page.locator('[role="dialog"]')).toBeVisible();

  // Click outside
  await page.click('body', { position: { x: 10, y: 10 } });

  // Verify still open
  await expect(page.locator('[role="dialog"]')).toBeVisible();

  // Close with button
  await page.click('[aria-label="Close chat"]');
  await expect(page.locator('[role="dialog"]')).not.toBeVisible();
});
```

---

## Development Workflow

### 1. Setup Development Environment

```bash
cd web
npm install
npm run dev
```

### 2. Make Changes

Follow the component modification guide above, making changes one component at a time.

### 3. Test Changes

```bash
# Run unit tests
npm test

# Run E2E tests
npm run test:e2e

# Manual testing
# Open http://localhost:3000/dashboard/todos
# Test all user stories
```

### 4. Verify Performance

- Open Chrome DevTools
- Go to Performance tab
- Record interaction
- Verify animations complete within 300ms
- Verify no layout shifts

### 5. Accessibility Audit

```bash
# Install axe DevTools extension
# Run accessibility scan
# Fix any issues found
```

---

## Common Issues and Solutions

### Issue 1: Chatbot Still Closes on Outside Click

**Solution**: Ensure you completely removed the `handleClickOutside` useEffect block and removed `onClick={onClose}` from the backdrop.

### Issue 2: Escape Key Not Working

**Solution**: Verify the Escape key handler is added and the event listener is properly attached when `isOpen` is true.

### Issue 3: Auto-Scroll Jumpy

**Solution**: Ensure `shouldAutoScroll` state is properly tracking scroll position and only auto-scrolling when user is at bottom.

### Issue 4: Error Messages Still Technical

**Solution**: Verify `mapErrorToUserFriendly` function is called in the error display and covers all error types.

### Issue 5: Tool Status Not Showing

**Solution**: Check that `toolExecutionStatus` is properly parsed from message responses and passed through ChatContainer to LoadingIndicator.

---

## Deployment Checklist

Before deploying to production:

- [ ] All unit tests passing
- [ ] All integration tests passing
- [ ] All E2E tests passing
- [ ] Manual testing complete on Chrome, Firefox, Safari
- [ ] Mobile testing complete (iOS Safari, Android Chrome)
- [ ] Accessibility audit passed
- [ ] Performance targets met (300ms animations, 500ms feedback)
- [ ] Error handling tested with network disconnection
- [ ] Code review completed
- [ ] Design review completed

---

## Next Steps

1. Run `/sp.tasks` to generate detailed task breakdown
2. Implement changes following this guide
3. Write tests alongside implementation (TDD)
4. Conduct design and accessibility reviews
5. Deploy to production

## Support

For questions or issues during implementation:
- Review `plan.md` for architectural decisions
- Review `research.md` for design system details
- Check component file locations in plan.md appendix
- Refer to existing component implementations for patterns
