# Implementation Plan: Chatbot UX Polish, Layout Stability & Interaction Fixes

**Branch**: `007-chatbot-ux-polish` | **Date**: 2026-02-05 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/007-chatbot-ux-polish/spec.md`

## Summary

This feature improves the usability, stability, and visual integration of the AI Todo Assistant chatbot embedded in the Todos Dashboard. The primary requirement is to fix critical UX issues including unexpected auto-closing, missing close controls, visual inconsistency with the application theme, and lack of interaction feedback. The technical approach focuses on frontend-only modifications to existing React components using Tailwind CSS for styling and Framer Motion for animations.

## Technical Context

**Project Type**: web (Phase III full-stack with frontend-only changes for this feature)

### Phase III Full-Stack Web Application

**Frontend** (Changes Required):
- Framework: Next.js 15+ with App Router
- UI Library: React 19+ with hooks
- Language: TypeScript 5+ (strict mode)
- Styling: Tailwind CSS 3+
- Animation: Framer Motion (already in use)
- State Management: React hooks, Context API
- HTTP Client: fetch API or axios
- Deployment: Vercel (recommended)

**Backend** (No Changes Required):
- Framework: FastAPI 0.100+
- Language: Python 3.13+
- Validation: Pydantic v2
- ORM: SQLModel (SQLAlchemy + Pydantic)
- Chat API: Already functional
- Agent: Already functional with MCP tools

**Database** (No Changes Required):
- Database: Neon PostgreSQL (serverless)
- Conversations and messages already persisted

**Testing**:
- Frontend: Jest, React Testing Library
- Component tests for updated components
- E2E: Playwright or Cypress for user interaction flows

### Performance Goals
- Chatbot animations complete within 300ms (smooth 60fps)
- User feedback appears within 500ms of interaction
- Auto-scroll completes within 200ms
- No layout shifts or jank during interactions

### Constraints
- Frontend-only changes (no backend modifications)
- Must maintain existing chat functionality
- Must preserve conversation history and message flow
- Must work across desktop, tablet, and mobile viewports
- Must maintain accessibility standards (keyboard navigation, ARIA labels)

### Scale/Scope
- 6 React components to modify
- ~500-800 lines of code changes
- 4 prioritized user stories
- 19 functional requirements
- Zero backend changes
- Zero database changes

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Phase III Requirements (Maintained - No Changes)
- ✅ Uses approved AI/Agent stack (OpenAI Agents SDK, OpenRouter, MCP) - No changes to agent
- ✅ OpenRouter API integration (NOT direct OpenAI API) - No changes
- ✅ `OPENROUTER_API_KEY` environment variable - No changes
- ✅ MCP Server with stateless, database-backed tools - No changes
- ✅ Agent uses MCP tools for ALL task operations - No changes
- ✅ Stateless backend (no in-memory conversation state) - No changes
- ✅ Conversation persistence (database-backed) - No changes
- ✅ Message and tool call tracking - No changes
- ✅ Agent behavior contract (confirmations, error handling) - No changes
- ✅ Chat API endpoints for conversation management - No changes
- ✅ No manual coding (Claude generates all code) - Compliant

### Phase II Requirements (Maintained)
- ✅ Uses approved technology stack (Next.js, FastAPI, Neon) - Compliant
- ✅ API-first architecture (Frontend → API → Database) - No changes
- ✅ Frontend-backend separation - Compliant (frontend-only changes)
- ✅ Persistent storage (Neon PostgreSQL) - No changes
- ✅ No Phase I patterns (in-memory, CLI, positional indexes) - Compliant
- ✅ Database migrations with Alembic - Not applicable (no DB changes)
- ✅ OpenAPI/Swagger documentation - Not applicable (no API changes)
- ✅ Proper error handling and validation - Enhanced in this feature

### Feature-Specific Compliance
- ✅ Frontend-only changes (no backend modifications)
- ✅ Uses existing chat infrastructure (useChat hook, ChatContainer, etc.)
- ✅ Maintains conversation persistence
- ✅ Preserves all existing functionality
- ✅ Enhances UX without breaking changes
- ✅ Follows Tailwind CSS styling conventions
- ✅ Uses Framer Motion for animations (already in project)
- ✅ Maintains accessibility standards

**No Constitution Violations**: This feature is a pure UI/UX enhancement with no architectural changes.

## Project Structure

### Documentation (this feature)

```text
specs/007-chatbot-ux-polish/
├── spec.md              # Feature specification (completed)
├── plan.md              # This file (in progress)
├── research.md          # Phase 0 output (minimal - design system review)
├── quickstart.md        # Phase 1 output (component modification guide)
├── checklists/
│   └── requirements.md  # Specification quality checklist (completed)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
web/                          # Next.js frontend (CHANGES REQUIRED)
├── src/
│   ├── components/
│   │   ├── chatbot/         # Chatbot widget components (MODIFY)
│   │   │   ├── ChatPanel.tsx           # MODIFY: Remove click-outside, add close button
│   │   │   ├── ChatWidget.tsx          # REVIEW: No changes expected
│   │   │   ├── FloatingChatButton.tsx  # REVIEW: No changes expected
│   │   │   └── ChatWidgetWrapper.tsx   # REVIEW: No changes expected
│   │   └── chat/            # Chat UI components (MODIFY)
│   │       ├── ChatContainer.tsx       # MODIFY: Add close button, improve error display
│   │       ├── MessageList.tsx         # MODIFY: Improve auto-scroll stability
│   │       ├── MessageInput.tsx        # REVIEW: Verify Enter/Shift+Enter (already implemented)
│   │       ├── LoadingIndicator.tsx    # MODIFY: Add tool execution status
│   │       ├── ErrorDisplay.tsx        # MODIFY: User-friendly error messages
│   │       └── Message.tsx             # REVIEW: Ensure consistent styling
│   ├── lib/
│   │   └── hooks/
│   │       └── useChat.ts              # MODIFY: Add tool execution status tracking
│   └── styles/              # Global styles (REVIEW)
│       └── globals.css      # REVIEW: Ensure theme variables defined
├── tests/
│   └── components/          # Component tests (ADD)
│       ├── ChatPanel.test.tsx
│       ├── ChatContainer.test.tsx
│       └── MessageInput.test.tsx
└── package.json

api/                          # FastAPI backend (NO CHANGES)
└── [No modifications required]
```

**Structure Decision**: Frontend-only modifications to existing Next.js application. All changes are isolated to the `web/src/components/chatbot/` and `web/src/components/chat/` directories. No backend, database, or API changes required.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations detected. This feature is a pure UI/UX enhancement with no architectural changes or constitution violations.

## Phase 0: Research & Discovery

### Research Tasks

#### R1: Design System Audit
**Objective**: Document the application's current design system (colors, spacing, shadows, borders) to ensure chatbot matches.

**Approach**:
1. Review `web/src/styles/globals.css` for CSS variables and theme definitions
2. Examine existing components (Sidebar, DashboardLayout, TodoList) for styling patterns
3. Document color palette (primary, secondary, background, foreground, accent)
4. Document spacing scale (padding, margin, gap)
5. Document border radius values
6. Document shadow styles (elevation levels)
7. Document animation timing and easing functions

**Output**: Design system reference in `research.md`

#### R2: Current Component Analysis
**Objective**: Understand the current implementation and identify specific code locations for modifications.

**Approach**:
1. Map component hierarchy: ChatWidget → ChatPanel → ChatContainer → MessageList/MessageInput
2. Identify state management patterns (useState, useEffect, custom hooks)
3. Document current event handlers (onClick, onClose, onKeyDown)
4. Identify animation patterns (Framer Motion usage)
5. Document current accessibility features (ARIA labels, focus management)
6. Identify click-outside handler location (ChatPanel.tsx lines 71-92)
7. Document current close button implementation (ChatPanel.tsx lines 157-165)

**Output**: Component analysis in `research.md`

#### R3: Framer Motion Animation Patterns
**Objective**: Document best practices for smooth animations using Framer Motion.

**Approach**:
1. Review existing animation usage in ChatPanel (slide-in/slide-out)
2. Document recommended spring configurations for smooth motion
3. Identify animation timing for 300ms target
4. Document exit animation patterns
5. Review AnimatePresence usage for mount/unmount animations

**Output**: Animation guidelines in `research.md`

#### R4: Accessibility Requirements
**Objective**: Ensure all modifications maintain or improve accessibility.

**Approach**:
1. Review WCAG 2.1 AA requirements for modal dialogs
2. Document keyboard navigation patterns (Tab, Shift+Tab, Escape, Enter)
3. Review ARIA attributes for close buttons (aria-label, role)
4. Document focus management requirements
5. Review screen reader compatibility

**Output**: Accessibility checklist in `research.md`

### Research Decisions

**Decision 1: Remove Click-Outside Handler**
- **Rationale**: User Story 1 (P1) requires chatbot to remain open during page interactions. Current implementation closes on outside click, breaking user workflow.
- **Implementation**: Remove or disable the `handleClickOutside` event listener in ChatPanel.tsx (lines 71-92)
- **Alternative Considered**: Add a toggle to enable/disable click-outside behavior - Rejected because it adds complexity and the spec clearly states chatbot should NOT close on outside click.

**Decision 2: Add Second Close Button**
- **Rationale**: User Story 4 (P1) requires explicit close controls in both headers. Current implementation has only one close button.
- **Implementation**: Add close button to ChatContainer header (separate from ChatPanel header)
- **Alternative Considered**: Use a single close button with better visibility - Rejected because spec explicitly requires two close buttons for redundancy.

**Decision 3: Use Existing Tailwind Theme**
- **Rationale**: User Story 2 (P2) requires visual consistency. Application already uses Tailwind CSS with defined theme.
- **Implementation**: Use Tailwind theme variables (bg-background, text-foreground, border, etc.) instead of hardcoded colors
- **Alternative Considered**: Create custom CSS classes - Rejected because Tailwind theme provides consistency and maintainability.

**Decision 4: Enhance LoadingIndicator for Tool Status**
- **Rationale**: User Story 3 (P3) requires tool execution status display. Current LoadingIndicator only shows "AI is thinking..."
- **Implementation**: Add optional `status` prop to LoadingIndicator to display tool-specific messages ("Creating task...", "Updating task...")
- **Alternative Considered**: Create separate ToolStatusIndicator component - Rejected because LoadingIndicator already exists and can be enhanced.

**Decision 5: Create ErrorMessage Component Enhancement**
- **Rationale**: User Story 3 (P3) requires user-friendly error messages. Current error display shows raw technical errors.
- **Implementation**: Add error message mapping function to translate technical errors to user-friendly messages
- **Alternative Considered**: Modify backend to return user-friendly errors - Rejected because this is frontend-only feature and backend should return technical errors for debugging.

## Phase 1: Design & Contracts

### Component Modifications

#### Component 1: ChatPanel.tsx
**Purpose**: Main chat panel container with slide-out animation
**Modifications**:
1. Remove click-outside-to-close handler (lines 71-92)
2. Keep Escape key handler for accessibility
3. Ensure close button is keyboard accessible
4. Verify animation timing meets 300ms target
5. Update styling to use Tailwind theme variables

**Props** (No changes):
- `isOpen: boolean`
- `onClose: () => void`
- `token: string`
- `conversationId: string | null`

**State** (No changes):
- Focus management via `panelRef`

#### Component 2: ChatContainer.tsx
**Purpose**: Main chat interface container
**Modifications**:
1. Add close button to header (duplicate of ChatPanel close button)
2. Enhance error display with user-friendly messages
3. Pass tool execution status to LoadingIndicator
4. Improve layout stability (prevent shifts)

**Props** (Enhanced):
- `token: string`
- `conversationId: string | null`
- `onClose: () => void` (NEW - for close button)

**State** (Enhanced via useChat hook):
- `toolExecutionStatus: string | null` (NEW - track tool execution)

#### Component 3: MessageList.tsx
**Purpose**: Display conversation history with auto-scroll
**Modifications**:
1. Improve auto-scroll stability (prevent jank)
2. Use `scrollIntoView` with `behavior: 'smooth'` and `block: 'end'`
3. Add scroll position tracking to prevent unnecessary scrolls
4. Ensure consistent spacing between messages

**Props** (No changes):
- `messages: MessageType[]`
- `isLoading?: boolean`

**State** (Enhanced):
- `shouldAutoScroll: boolean` (NEW - track if user manually scrolled)

#### Component 4: MessageInput.tsx
**Purpose**: Message input field with keyboard shortcuts
**Modifications**:
1. Verify Enter/Shift+Enter handling (already implemented)
2. Ensure Send button disabled state works correctly
3. Update styling to match theme
4. Add visual feedback for disabled state

**Props** (No changes):
- `onSend: (message: string) => void`
- `disabled: boolean`

**State** (No changes):
- `inputValue: string`

#### Component 5: LoadingIndicator.tsx
**Purpose**: Show AI processing status
**Modifications**:
1. Add optional `status` prop for tool execution messages
2. Display "AI is thinking..." by default
3. Display tool-specific status when provided ("Creating task...", "Updating task...")
4. Maintain animated dots for visual feedback

**Props** (Enhanced):
- `status?: string` (NEW - optional tool execution status)

**State** (No changes - stateless component)

#### Component 6: ErrorDisplay.tsx (or enhance ChatContainer error display)
**Purpose**: Display user-friendly error messages
**Modifications**:
1. Create error message mapping function
2. Map technical errors to user-friendly messages
3. Log detailed errors to console for debugging
4. Add dismiss button with proper styling
5. Use alert styling (red background, border)

**Error Mapping Examples**:
- `"Network error"` → `"Unable to connect. Please check your internet connection."`
- `"500 Internal Server Error"` → `"Something went wrong. Please try again."`
- `"401 Unauthorized"` → `"Your session has expired. Please sign in again."`
- `"Timeout"` → `"The request took too long. Please try again."`

### Hook Modifications

#### useChat Hook Enhancement
**Purpose**: Manage chat state and API communication
**Modifications**:
1. Add `toolExecutionStatus` state to track tool execution
2. Parse tool call information from agent responses
3. Update status during tool execution
4. Clear status when tool execution completes
5. Expose `toolExecutionStatus` in hook return value

**Enhanced Return Value**:
```typescript
{
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  conversationId: string | null;
  toolExecutionStatus: string | null; // NEW
  sendMessage: (message: string) => Promise<void>;
  clearError: () => void;
  resetConversation: () => void;
  isInitialized: boolean;
}
```

### Styling Guidelines

#### Theme Variables (Tailwind)
Use existing Tailwind theme variables for consistency:
- **Background**: `bg-background`, `bg-white`
- **Foreground**: `text-foreground`, `text-gray-600`, `text-gray-900`
- **Primary**: `bg-primary`, `text-primary`, `hover:bg-primary/90`
- **Accent**: `bg-accent`, `hover:bg-accent`
- **Border**: `border`, `border-gray-200`, `border-gray-300`
- **Shadow**: `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-2xl`
- **Rounded**: `rounded-lg`, `rounded-2xl`

#### Animation Timing
- **Open/Close**: 300ms spring animation (Framer Motion)
- **Auto-scroll**: 200ms smooth scroll
- **Hover effects**: 150ms transition
- **Loading dots**: Staggered bounce animation

#### Spacing
- **Padding**: `p-3`, `p-4`, `px-4 py-3`
- **Gap**: `gap-2`, `gap-3`, `gap-4`
- **Margin**: `mt-2`, `mb-4`, `mx-auto`

### Testing Strategy

#### Unit Tests
1. **ChatPanel.test.tsx**:
   - Test close button click triggers onClose
   - Test Escape key triggers onClose
   - Test click outside does NOT trigger onClose (removed behavior)
   - Test animation timing
   - Test keyboard navigation (Tab, Shift+Tab)

2. **ChatContainer.test.tsx**:
   - Test close button renders and functions
   - Test error display shows user-friendly messages
   - Test tool execution status displays correctly
   - Test loading indicator appears during processing

3. **MessageInput.test.tsx**:
   - Test Enter key sends message
   - Test Shift+Enter inserts newline
   - Test Send button disabled when loading
   - Test Send button disabled when input empty

#### Integration Tests
1. **Chat Flow**:
   - Open chatbot → Send message → Receive response → Close chatbot
   - Verify chatbot remains open when clicking outside
   - Verify both close buttons work
   - Verify auto-scroll to latest message

2. **Error Handling**:
   - Trigger network error → Verify user-friendly message
   - Trigger timeout → Verify user-friendly message
   - Dismiss error → Verify error clears

3. **Tool Execution**:
   - Send task creation message → Verify "Creating task..." status
   - Wait for completion → Verify status clears
   - Verify task appears in todo list

#### E2E Tests (Playwright/Cypress)
1. **User Story 1**: Stable Chatbot Visibility
   - Open chatbot
   - Click on todo item
   - Verify chatbot remains open
   - Click on sidebar
   - Verify chatbot remains open
   - Click close button
   - Verify chatbot closes

2. **User Story 2**: Visual Integration
   - Open chatbot
   - Verify colors match application theme
   - Verify rounded corners consistent
   - Verify shadow matches other elevated elements
   - Verify animation smooth (300ms)

3. **User Story 3**: Interaction Feedback
   - Send message
   - Verify typing indicator appears
   - Verify tool execution status appears
   - Verify auto-scroll to latest message
   - Trigger error
   - Verify user-friendly error message

4. **User Story 4**: Explicit Close Controls
   - Open chatbot
   - Verify close button in ChatPanel header
   - Verify close button in ChatContainer header
   - Click ChatPanel close button
   - Verify chatbot closes
   - Open chatbot
   - Click ChatContainer close button
   - Verify chatbot closes

## Phase 2: Task Breakdown

**Note**: Detailed task breakdown will be generated by `/sp.tasks` command. This section provides high-level task categories.

### Task Categories

#### Category 1: Remove Click-Outside Behavior (P1)
- Modify ChatPanel.tsx to remove click-outside handler
- Keep Escape key handler for accessibility
- Add tests to verify chatbot stays open on outside click

#### Category 2: Add Explicit Close Controls (P1)
- Add close button to ChatContainer header
- Ensure both close buttons trigger same onClose handler
- Add keyboard accessibility (Tab, Enter, Space)
- Add tests for both close buttons

#### Category 3: Visual Theme Integration (P2)
- Audit current styling in all chat components
- Replace hardcoded colors with Tailwind theme variables
- Ensure consistent border radius, shadows, spacing
- Verify responsive design across viewports
- Add visual regression tests

#### Category 4: Interaction Feedback (P3)
- Enhance LoadingIndicator with tool execution status
- Modify useChat hook to track tool execution
- Improve error display with user-friendly messages
- Add error message mapping function
- Verify auto-scroll stability
- Add tests for all feedback mechanisms

#### Category 5: Keyboard Accessibility (P3)
- Verify Enter/Shift+Enter in MessageInput
- Ensure close buttons keyboard accessible
- Test Tab navigation through chat interface
- Verify Escape key closes chatbot
- Add accessibility tests

#### Category 6: Testing & Validation (P3)
- Write unit tests for modified components
- Write integration tests for chat flows
- Write E2E tests for user stories
- Perform manual testing across browsers
- Verify performance targets (300ms animations, 500ms feedback)

## Success Criteria Validation

### Measurable Outcomes (from spec)

- **SC-001**: Chatbot remains open during 100% of user interactions with other page elements
  - **Validation**: E2E test clicking todos, navigation, background while chatbot open

- **SC-002**: Users can identify and use close buttons within 2 seconds
  - **Validation**: User testing with 5+ participants, measure time to find close button

- **SC-003**: Chatbot visual elements match design system with 100% consistency
  - **Validation**: Design review comparing chatbot colors/spacing/shadows to design system

- **SC-004**: Users receive feedback within 500ms of any interaction
  - **Validation**: Performance testing measuring time from interaction to feedback display

- **SC-005**: Zero UI crashes occur during error scenarios
  - **Validation**: Error injection testing with network errors, timeouts, 500 errors

- **SC-006**: 100% of keyboard interactions work as specified
  - **Validation**: Automated tests for Enter, Shift+Enter, Tab, Escape, Space

- **SC-007**: Chatbot animations complete smoothly within 300ms
  - **Validation**: Performance profiling measuring animation duration and frame rate

- **SC-008**: Error messages understandable to non-technical users (90% comprehension)
  - **Validation**: User testing with error message comprehension questions

## Dependencies

### External Dependencies
- Framer Motion (already installed) - for animations
- Tailwind CSS (already configured) - for styling
- React 19+ (already installed) - for component logic
- TypeScript 5+ (already configured) - for type safety

### Internal Dependencies
- useChat hook (already implemented) - needs enhancement for tool status
- Chat API (already functional) - no changes required
- Agent with MCP tools (already functional) - no changes required
- Conversation persistence (already functional) - no changes required

### Design System Dependencies
- Tailwind theme configuration (already defined)
- CSS variables for colors (already defined)
- Component styling patterns (already established)

## Risks & Mitigation

### Risk 1: Animation Performance
**Risk**: Animations may not achieve 300ms target on lower-end devices
**Mitigation**: Use CSS transforms (GPU-accelerated), test on various devices, provide fallback without animation if performance poor
**Likelihood**: Low | **Impact**: Medium

### Risk 2: Auto-Scroll Jank
**Risk**: Auto-scroll may cause layout shifts or jank
**Mitigation**: Use `scrollIntoView` with `behavior: 'smooth'`, track scroll position to prevent unnecessary scrolls, test with long message lists
**Likelihood**: Medium | **Impact**: Medium

### Risk 3: Theme Inconsistency
**Risk**: Chatbot styling may not perfectly match application theme
**Mitigation**: Conduct thorough design review, use Tailwind theme variables exclusively, compare side-by-side with other components
**Likelihood**: Low | **Impact**: High

### Risk 4: Accessibility Regression
**Risk**: Modifications may break existing accessibility features
**Mitigation**: Maintain focus trap, keep ARIA labels, test with keyboard navigation, verify screen reader compatibility
**Likelihood**: Low | **Impact**: High

### Risk 5: Error Message Mapping Incomplete
**Risk**: Some error types may not have user-friendly mappings
**Mitigation**: Provide generic fallback message, log all errors to console, iterate based on user feedback
**Likelihood**: Medium | **Impact**: Low

## Next Steps

1. **Complete Phase 0**: Generate `research.md` with design system audit and component analysis
2. **Complete Phase 1**: Generate `quickstart.md` with component modification guide
3. **Run `/sp.tasks`**: Generate detailed task breakdown with acceptance criteria
4. **Begin Implementation**: Execute tasks in priority order (P1 → P2 → P3)
5. **Testing**: Write tests alongside implementation (TDD)
6. **Review**: Conduct design review and accessibility audit
7. **Deploy**: Merge to main branch and deploy to production

## Appendix

### Component File Locations
- `web/src/components/chatbot/ChatPanel.tsx` - Main panel container
- `web/src/components/chatbot/ChatWidget.tsx` - Widget wrapper
- `web/src/components/chat/ChatContainer.tsx` - Chat interface
- `web/src/components/chat/MessageList.tsx` - Message display
- `web/src/components/chat/MessageInput.tsx` - Input field
- `web/src/components/chat/LoadingIndicator.tsx` - Loading state
- `web/src/components/chat/ErrorDisplay.tsx` - Error display
- `web/src/lib/hooks/useChat.ts` - Chat state management

### Key Code Locations
- Click-outside handler: `ChatPanel.tsx` lines 71-92 (REMOVE)
- Close button: `ChatPanel.tsx` lines 157-165 (KEEP + ADD SECOND)
- Enter/Shift+Enter: `MessageInput.tsx` lines 29-34 (VERIFY)
- Auto-scroll: `MessageList.tsx` lines 23-25 (IMPROVE)
- Loading indicator: `LoadingIndicator.tsx` lines 7-21 (ENHANCE)

### Design System Reference
- Colors: Use Tailwind theme variables (`bg-background`, `text-foreground`, etc.)
- Spacing: Use Tailwind spacing scale (`p-3`, `p-4`, `gap-2`, etc.)
- Borders: Use `rounded-lg`, `rounded-2xl` for consistency
- Shadows: Use `shadow-sm`, `shadow-md`, `shadow-lg` for elevation
- Animations: Use Framer Motion with 300ms spring timing
