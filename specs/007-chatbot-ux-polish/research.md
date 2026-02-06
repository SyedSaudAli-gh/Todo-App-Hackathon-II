# Research & Discovery: Chatbot UX Polish

**Feature**: 007-chatbot-ux-polish
**Date**: 2026-02-05
**Purpose**: Document design system, component analysis, and technical decisions for chatbot UX improvements

## Design System Audit

### Color Palette (Tailwind Theme)

Based on existing component usage, the application uses Tailwind CSS theme variables:

**Primary Colors**:
- `bg-primary` - Primary brand color for buttons and accents
- `text-primary` - Primary text color
- `text-primary-foreground` - Text on primary background
- `hover:bg-primary/90` - Hover state for primary elements

**Background Colors**:
- `bg-background` - Main background color
- `bg-white` - Pure white for elevated surfaces
- `bg-gray-50` - Light gray for subtle backgrounds
- `bg-gray-100` - Slightly darker gray for disabled states

**Foreground Colors**:
- `text-foreground` - Main text color
- `text-gray-600` - Secondary text color
- `text-gray-700` - Darker secondary text
- `text-gray-900` - Darkest text for emphasis

**Accent Colors**:
- `bg-accent` - Accent background for hover states
- `hover:bg-accent` - Hover state for interactive elements

**Error Colors**:
- `bg-red-50` - Light red background for error messages
- `border-red-500` - Red border for error alerts
- `text-red-700` - Red text for error messages
- `text-red-500` - Red for error icons

### Spacing Scale

**Padding**:
- `p-1` - 0.25rem (4px)
- `p-2` - 0.5rem (8px)
- `p-3` - 0.75rem (12px)
- `p-4` - 1rem (16px)
- `px-3 py-2` - Horizontal 12px, Vertical 8px
- `px-4 py-3` - Horizontal 16px, Vertical 12px

**Gap**:
- `gap-1` - 0.25rem (4px)
- `gap-2` - 0.5rem (8px)
- `gap-3` - 0.75rem (12px)
- `gap-4` - 1rem (16px)

**Margin**:
- `mt-2` - Top margin 8px
- `mb-4` - Bottom margin 16px
- `mx-auto` - Horizontal auto centering

### Border Radius

- `rounded-lg` - 0.5rem (8px) - Standard for buttons, inputs, cards
- `rounded-2xl` - 1rem (16px) - Used for ChatPanel on desktop
- `rounded-full` - Full circle - Used for loading dots

### Shadow Styles

- `shadow-sm` - Small shadow for subtle elevation
- `shadow-md` - Medium shadow for cards
- `shadow-lg` - Large shadow for modals
- `shadow-2xl` - Extra large shadow for ChatPanel

### Animation Timing

**Framer Motion (Current Usage)**:
- Spring animation with `damping: 30, stiffness: 300`
- Slide-in/slide-out: `x: '100%'` to `x: 0`
- Fade: `opacity: 0` to `opacity: 1`
- Duration: ~300ms (spring-based, not fixed duration)

**CSS Transitions**:
- `transition-colors` - Color transitions for hover states
- Duration: 150ms (default Tailwind)

**Loading Animations**:
- `animate-bounce` - Bounce animation for loading dots
- `animate-spin` - Spin animation for spinners
- Staggered delays: `[animation-delay:0.1s]`, `[animation-delay:0.2s]`

## Component Analysis

### Component Hierarchy

```
ChatWidget (web/src/components/chatbot/ChatWidget.tsx)
├── FloatingChatButton (shows when closed)
└── ChatPanel (shows when open)
    └── ChatContainer (web/src/components/chat/ChatContainer.tsx)
        ├── Header (with "New Conversation" button)
        ├── Error Display (conditional)
        ├── MessageList (web/src/components/chat/MessageList.tsx)
        │   └── Message components
        ├── LoadingIndicator (conditional)
        └── MessageInput (web/src/components/chat/MessageInput.tsx)
```

### State Management Patterns

**ChatWidget** (useChatWidget hook):
- `isOpen: boolean` - Controls panel visibility
- `open()` - Opens the panel
- `close()` - Closes the panel

**ChatContainer** (useChat hook):
- `messages: Message[]` - Conversation history
- `isLoading: boolean` - AI processing state
- `error: string | null` - Error message
- `conversationId: string | null` - Current conversation ID
- `sendMessage(message: string)` - Send user message
- `clearError()` - Dismiss error
- `resetConversation()` - Start new conversation
- `isInitialized: boolean` - Hook initialization state

**MessageList**:
- `messagesEndRef: RefObject<HTMLDivElement>` - Scroll target reference
- Auto-scroll effect: `useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])`

**MessageInput**:
- `inputValue: string` - Current input text
- `handleSend()` - Send message handler
- `handleKeyDown(e)` - Keyboard event handler (Enter/Shift+Enter)

### Event Handlers

**ChatPanel.tsx**:
- `handleClickOutside` (lines 72-79): Closes panel when clicking outside (NEEDS REMOVAL)
- `handleTabKey` (lines 47-63): Focus trap for accessibility (KEEP)
- `onClick={onClose}` (line 158): Close button handler (KEEP)

**MessageInput.tsx**:
- `handleKeyDown` (lines 29-34): Enter sends, Shift+Enter newline (ALREADY CORRECT)
- `handleSend` (lines 20-26): Validates and sends message (KEEP)

**ChatContainer.tsx**:
- `handleSendMessage` (lines 32-34): Wrapper for sendMessage (KEEP)
- `onClick={clearError}` (line 81): Error dismiss handler (KEEP)
- `onClick={resetConversation}` (line 57): New conversation handler (KEEP)

### Animation Patterns (Framer Motion)

**ChatPanel Animation** (lines 110-128):
```typescript
initial={{ x: '100%', y: 0 }}
animate={{ x: 0, y: 0 }}
exit={{ x: '100%', y: 0 }}
transition={{ type: 'spring', damping: 30, stiffness: 300 }}
```

**Analysis**:
- Spring animation provides smooth, natural motion
- `damping: 30` controls bounce (higher = less bounce)
- `stiffness: 300` controls speed (higher = faster)
- Slide from right (`x: '100%'`) to center (`x: 0`)
- Exit animation reverses the motion

**Performance**: Spring animations are GPU-accelerated via CSS transforms, achieving 60fps on most devices.

**Backdrop Fade** (lines 99-107):
```typescript
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
exit={{ opacity: 0 }}
transition={{ duration: 0.2 }}
```

### Accessibility Features

**Current Implementation**:
- Focus trap in ChatPanel (lines 36-68)
- ARIA labels on buttons (`aria-label="Close chat"`, `aria-label="Send message"`)
- ARIA describedby on input (`aria-describedby="message-input-help"`)
- Role and aria-modal on dialog (`role="dialog"`, `aria-modal="true"`)
- Keyboard navigation (Tab, Shift+Tab)
- Enter/Shift+Enter in input field

**Gaps Identified**:
- No Escape key handler to close panel (NEEDS ADDITION)
- Close buttons need explicit keyboard accessibility verification
- Focus management when panel opens/closes needs verification

## Technical Decisions

### Decision 1: Remove Click-Outside Handler

**Current Implementation** (ChatPanel.tsx lines 71-92):
```typescript
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

**Decision**: Remove this entire useEffect block

**Rationale**:
- User Story 1 (P1) explicitly requires chatbot to remain open during page interactions
- Current behavior breaks user workflow by closing unexpectedly
- Spec states: "Clicking outside the chatbot must NOT close it"

**Implementation**:
1. Delete lines 71-92 in ChatPanel.tsx
2. Add Escape key handler as alternative close method
3. Add test to verify chatbot stays open on outside click

**Alternative Considered**: Add a prop to toggle click-outside behavior
**Rejected Because**: Adds unnecessary complexity; spec is clear that click-outside should never close

### Decision 2: Add Second Close Button

**Current Implementation**:
- One close button in ChatPanel header (lines 157-165)
- No close button in ChatContainer

**Decision**: Add close button to ChatContainer header

**Rationale**:
- User Story 4 (P1) requires explicit close controls in both headers
- Spec states: "Add explicit ❌ close icon: Top-right of chatbot container, Top-right of 'AI Todo Assistant' header"
- Redundancy improves discoverability and user confidence

**Implementation**:
1. Add `onClose` prop to ChatContainer
2. Pass `onClose` from ChatPanel to ChatContainer
3. Add close button in ChatContainer header (next to "New Conversation" button)
4. Use same styling as ChatPanel close button for consistency
5. Ensure both buttons trigger same `onClose` handler

**Alternative Considered**: Single close button with better visibility
**Rejected Because**: Spec explicitly requires two close buttons

### Decision 3: Enhance LoadingIndicator for Tool Status

**Current Implementation** (LoadingIndicator.tsx):
- Fixed text: "AI is thinking..."
- No support for custom status messages

**Decision**: Add optional `status` prop to display tool-specific messages

**Rationale**:
- User Story 3 (P3) requires tool execution status display
- Current implementation only shows generic "AI is thinking..."
- Spec requires: "Show tool execution state: 'Creating task…', 'Updating task…'"

**Implementation**:
1. Add `status?: string` prop to LoadingIndicator
2. Display `status` if provided, otherwise default to "AI is thinking..."
3. Modify useChat hook to track tool execution status
4. Parse tool call information from agent responses
5. Pass tool status to LoadingIndicator via ChatContainer

**Alternative Considered**: Create separate ToolStatusIndicator component
**Rejected Because**: LoadingIndicator already exists and can be enhanced with minimal changes

### Decision 4: User-Friendly Error Messages

**Current Implementation** (ChatContainer.tsx lines 70-91):
- Displays raw error messages from API
- No error message transformation

**Decision**: Add error message mapping function

**Rationale**:
- User Story 3 (P3) requires user-friendly error messages
- Spec states: "Replace generic 'AI error' with clear, user-readable messages"
- Technical errors confuse non-technical users

**Implementation**:
1. Create `mapErrorToUserFriendly(error: string): string` function
2. Map common error patterns to user-friendly messages
3. Log original error to console for debugging
4. Display mapped message to user

**Error Mappings**:
- Network errors → "Unable to connect. Please check your internet connection."
- 500 errors → "Something went wrong. Please try again."
- 401 errors → "Your session has expired. Please sign in again."
- Timeout errors → "The request took too long. Please try again."
- Unknown errors → "An unexpected error occurred. Please try again."

**Alternative Considered**: Modify backend to return user-friendly errors
**Rejected Because**: This is frontend-only feature; backend should return technical errors for debugging

### Decision 5: Improve Auto-Scroll Stability

**Current Implementation** (MessageList.tsx lines 23-25):
```typescript
useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
}, [messages]);
```

**Issue**: Scrolls on every message change, even if user manually scrolled up

**Decision**: Add scroll position tracking to prevent unnecessary scrolls

**Rationale**:
- User Story 3 (P3) requires stable auto-scroll
- Spec states: "Chat scroll / layout feels jumpy"
- Current implementation scrolls even when user is reading old messages

**Implementation**:
1. Add `shouldAutoScroll` state to track if user manually scrolled
2. Detect manual scroll events
3. Only auto-scroll if `shouldAutoScroll` is true
4. Reset `shouldAutoScroll` to true when user scrolls to bottom
5. Use `scrollIntoView({ behavior: 'smooth', block: 'end' })` for smoother scrolling

**Alternative Considered**: Always auto-scroll regardless of user position
**Rejected Because**: Disrupts user experience when reading old messages

## Framer Motion Best Practices

### Spring Animation Configuration

**Recommended Settings for 300ms Target**:
```typescript
transition={{
  type: 'spring',
  damping: 30,      // Controls bounce (20-40 range)
  stiffness: 300,   // Controls speed (200-400 range)
  mass: 1,          // Controls weight (0.5-2 range)
}}
```

**Current ChatPanel Settings**: `damping: 30, stiffness: 300` ✅ Already optimal

**Performance Tips**:
- Use CSS transforms (`x`, `y`, `scale`, `rotate`) for GPU acceleration
- Avoid animating `width`, `height`, `top`, `left` (causes reflow)
- Use `AnimatePresence` for mount/unmount animations
- Set `initial` state to prevent flash of unstyled content

### Exit Animations

**Current Implementation**: ✅ Correct
```typescript
<AnimatePresence>
  {isOpen && (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
    >
      {/* Content */}
    </motion.div>
  )}
</AnimatePresence>
```

**Key Points**:
- `AnimatePresence` required for exit animations
- `exit` prop defines animation when component unmounts
- Exit animation mirrors entry animation for consistency

## Accessibility Requirements (WCAG 2.1 AA)

### Modal Dialog Requirements

**Required**:
- ✅ `role="dialog"` on container
- ✅ `aria-modal="true"` on container
- ✅ `aria-label` or `aria-labelledby` for dialog title
- ✅ Focus trap (Tab cycles within dialog)
- ⚠️ Escape key closes dialog (NEEDS ADDITION)
- ✅ Focus returns to trigger element on close

### Keyboard Navigation

**Required Patterns**:
- ✅ Tab: Move focus forward
- ✅ Shift+Tab: Move focus backward
- ⚠️ Escape: Close dialog (NEEDS ADDITION)
- ✅ Enter: Activate focused button
- ✅ Space: Activate focused button
- ✅ Enter in textarea: Send message (already implemented)
- ✅ Shift+Enter in textarea: New line (already implemented)

### ARIA Attributes

**Current Usage** (✅ Correct):
- `aria-label="Close chat"` on close button
- `aria-label="Send message"` on send button
- `aria-label="Message input"` on textarea
- `aria-describedby="message-input-help"` on textarea
- `role="dialog"` on ChatPanel
- `aria-modal="true"` on ChatPanel

**Recommendations**:
- Add `aria-live="polite"` to LoadingIndicator for screen reader announcements
- Add `aria-live="assertive"` to error display for immediate announcements
- Ensure close buttons have `aria-label` describing their action

## Implementation Checklist

### Phase 0 Complete ✅
- [x] Design system audit
- [x] Component analysis
- [x] Animation patterns documented
- [x] Accessibility requirements identified
- [x] Technical decisions documented

### Phase 1 Next Steps
- [ ] Create quickstart.md with component modification guide
- [ ] Document specific code changes for each component
- [ ] Create testing checklist

### Phase 2 Next Steps (via /sp.tasks)
- [ ] Generate detailed task breakdown
- [ ] Assign priorities to tasks
- [ ] Define acceptance criteria for each task
- [ ] Create test cases

## Conclusion

All research tasks complete. No NEEDS CLARIFICATION items remain. The feature is well-defined with clear technical decisions and implementation paths. Ready to proceed to Phase 1 (quickstart.md generation) and Phase 2 (task breakdown via /sp.tasks).
