# Implementation Plan: Chatbot UI Improvements and Connection Fix

**Branch**: `003-chatbot-ui-bugfix` | **Date**: 2026-02-02 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-chatbot-ui-bugfix/spec.md`

## Summary

This feature improves the chatbot user interface and fixes critical connection errors that currently prevent users from interacting with the AI assistant. The implementation focuses on three priorities: (P1) fixing "Connection failed" errors to make the chatbot functional, (P2) creating a modern, visually appealing chat interface with clear message distinction, and (P3) implementing a floating chat widget with modal/slide-out panel for better accessibility. The solution uses OpenAI ChatKit for the frontend chat UI while maintaining the existing stateless backend architecture with conversation persistence.

## Technical Context

**Project Type**: Phase III Full-Stack Web Application with AI Agent

### Phase III AI Agent Architecture

**AI/Agent Layer** (Existing - No Changes):
- Agent Framework: OpenAI Agents SDK
- LLM Provider: OpenRouter (NOT OpenAI directly)
- Recommended Model: Gemini via OpenRouter (google/gemini-2.0-flash-exp)
- Tool Protocol: MCP (Model Context Protocol)
- MCP SDK: Official Python MCP SDK
- Agent Configuration: OpenRouter-compatible base URL
- API Key: `OPENROUTER_API_KEY` environment variable

**Agent Requirements** (Existing - No Changes):
- Stateless design (fetch conversation context from database)
- Tool-based reasoning (no direct database access)
- Natural language understanding for task operations
- Graceful error handling with user-friendly messages
- Confirmation prompts for destructive actions

**MCP Server Requirements** (Existing - No Changes):
- Stateless tool design (no in-memory state)
- Database-backed operations (persist all changes)
- Structured input/output schemas
- Agent-only invocation (no direct frontend access)

**Chat API Requirements** (Existing - Minimal Changes):
- RESTful endpoints for conversation management
- Message persistence (user and agent messages)
- Tool call tracking
- Conversation history retrieval
- **NEW**: Verify CORS configuration for deployed environment
- **NEW**: Validate API response format compatibility with ChatKit

### Phase II Full-Stack Web Application

**Frontend** (Primary Focus):
- Framework: Next.js 15+ with App Router
- UI Library: React 19+ with hooks
- Chat UI: **OpenAI ChatKit** (primary integration point)
- Language: TypeScript 5+ (strict mode)
- Styling: Tailwind CSS 3+ (for custom components and ChatKit styling)
- State Management: React hooks, Context API
- HTTP Client: fetch API (for ChatKit API adapter)
- Deployment: Vercel (production environment)

**Backend** (Minimal Changes):
- Framework: FastAPI 0.100+
- Language: Python 3.13+
- Validation: Pydantic v2
- ORM: SQLModel (SQLAlchemy + Pydantic)
- Migrations: Alembic
- Agent SDK: OpenAI Agents SDK
- MCP Server: Official MCP SDK
- Documentation: OpenAPI/Swagger (auto-generated)
- Deployment: Railway/Render (production environment)
- **INVESTIGATION NEEDED**: CORS configuration for Vercel domain
- **INVESTIGATION NEEDED**: API response format validation

**Database** (No Changes):
- Database: Neon PostgreSQL (serverless)
- ORM: SQLModel
- Migrations: Alembic
- Existing Tables: Conversations, Messages, ToolCalls

**Testing**:
- Frontend: Jest, React Testing Library (component tests)
- Backend: pytest, FastAPI TestClient (API tests)
- E2E: Playwright (chat flow tests)
- Manual: Connection testing on local and deployed environments

### Performance Goals

- Chat interface loads in under 2 seconds on standard broadband
- Message send/receive latency under 5 seconds (including AI processing)
- Smooth animations (60fps) for chat widget open/close
- No visual glitches or layout shifts during interactions
- Responsive performance on mobile devices (320px width minimum)

### Constraints

- **Frontend-only changes**: No backend logic rewrite except minimal fixes for connection issues
- **OpenAI ChatKit required**: Must use ChatKit for chat interface implementation
- **Stateless backend**: Must maintain existing stateless architecture
- **Database persistence**: Backend must continue to persist all conversations
- **No breaking changes**: Existing chat functionality must remain intact
- **Responsive design**: Must work on mobile (320px), tablet (768px), and desktop (1920px)
- **Accessibility**: Keyboard navigation required (Tab, Enter, Escape)

### Scale/Scope

- **Users**: Designed for hackathon judges and reviewers (small scale, high quality)
- **Conversations**: Support for multiple concurrent conversations per user
- **Messages**: Handle conversations with 50+ messages efficiently
- **Devices**: Mobile, tablet, and desktop support
- **Environments**: Local development and deployed production (Vercel + Railway/Render)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Phase III Requirements

- ✅ Uses approved AI/Agent stack (OpenAI Agents SDK, OpenRouter, MCP) - **No changes to agent layer**
- ✅ OpenRouter API integration (NOT direct OpenAI API) - **Existing, no changes**
- ✅ `OPENROUTER_API_KEY` environment variable (NOT `OPENAI_API_KEY`) - **Existing, no changes**
- ✅ MCP Server with stateless, database-backed tools - **Existing, no changes**
- ✅ Agent uses MCP tools for ALL task operations (no direct DB access) - **Existing, no changes**
- ✅ Stateless backend (no in-memory conversation state) - **Existing, maintained**
- ✅ Conversation persistence (database-backed) - **Existing, maintained**
- ✅ Message and tool call tracking - **Existing, maintained**
- ✅ Agent behavior contract (confirmations, error handling, no hallucinations) - **Existing, no changes**
- ✅ Chat API endpoints for conversation management - **Existing, minimal validation changes**
- ✅ No manual coding (Claude generates all code) - **Compliant**
- ⚠️ Phase III specifications required (agent.md, mcp-tools.md, chat-api.md, database.md, architecture.md) - **Existing from previous features, no new specs needed**

### Phase II Requirements

- ✅ Uses approved technology stack (Next.js, FastAPI, Neon) - **Compliant**
- ✅ API-first architecture (Frontend → API → Database) - **Maintained**
- ✅ Frontend-backend separation (no direct DB access from frontend) - **Maintained**
- ✅ Persistent storage (Neon PostgreSQL, not in-memory) - **Maintained**
- ✅ No Phase I patterns (in-memory, CLI, positional indexes) - **Compliant**
- ✅ Database migrations with Alembic - **No schema changes needed**
- ✅ OpenAPI/Swagger documentation - **Existing, maintained**
- ✅ Proper error handling and validation - **Enhanced for connection errors**

### Additional Requirements for This Feature

- ✅ **OpenAI ChatKit Integration**: Required by spec, approved for Phase III chat UI
- ✅ **Frontend-Only Focus**: Aligns with constraint to minimize backend changes
- ✅ **Responsive Design**: Required for mobile, tablet, desktop support
- ✅ **Accessibility**: Keyboard navigation required (Tab, Enter, Escape)
- ✅ **No Breaking Changes**: Existing chat functionality must remain intact

**Constitution Check Result**: ✅ **PASSED** - All requirements met, no violations

## Project Structure

### Documentation (this feature)

```text
specs/003-chatbot-ui-bugfix/
├── spec.md                    # Feature specification (completed)
├── plan.md                    # This file (in progress)
├── research.md                # Phase 0 output (to be created)
├── quickstart.md              # Phase 1 output (to be created)
├── checklists/
│   └── requirements.md        # Spec quality checklist (completed)
└── contracts/                 # Phase 1 output (to be created)
    └── chatkit-integration.md # ChatKit API adapter contract
```

### Source Code (repository root)

```text
web/                                    # Next.js frontend (PRIMARY FOCUS)
├── src/
│   ├── app/
│   │   ├── layout.tsx                 # Root layout (add ChatWidget)
│   │   └── chat/                      # Existing chat page (minimal changes)
│   │       └── [[...conversationId]]/
│   │           └── page.tsx
│   ├── components/
│   │   ├── chat/                      # Existing chat components (refactor)
│   │   │   ├── ChatContainer.tsx      # Existing (refactor for ChatKit)
│   │   │   ├── MessageList.tsx        # Existing (replace with ChatKit)
│   │   │   ├── MessageInput.tsx       # Existing (replace with ChatKit)
│   │   │   └── LoadingIndicator.tsx   # Existing (keep)
│   │   └── chatbot/                   # NEW: Floating chat widget components
│   │       ├── FloatingChatButton.tsx # NEW: Bottom-right floating button
│   │       ├── ChatWidget.tsx         # NEW: Modal/slide-out container
│   │       ├── ChatPanel.tsx          # NEW: ChatKit integration wrapper
│   │       └── MessageBubble.tsx      # NEW: Custom message styling
│   ├── lib/
│   │   ├── api/
│   │   │   └── chat.ts                # Existing (validate/fix connection)
│   │   ├── hooks/
│   │   │   ├── useChat.ts             # Existing (refactor for ChatKit)
│   │   │   └── useChatWidget.ts       # NEW: Widget open/close state
│   │   └── chatkit/                   # NEW: ChatKit configuration
│   │       ├── adapter.ts             # NEW: API adapter for ChatKit
│   │       └── config.ts              # NEW: ChatKit initialization
│   └── styles/
│       └── chatkit-custom.css         # NEW: Custom ChatKit styling
├── public/
│   └── icons/
│       └── chat-icon.svg              # NEW: Floating button icon
└── package.json                       # Update: Add @openai/chatkit-react

api/                                    # FastAPI backend (MINIMAL CHANGES)
├── src/
│   ├── routers/
│   │   └── chat.py                    # Existing (validate CORS, response format)
│   ├── config.py                      # Existing (validate CORS_ORIGINS)
│   └── main.py                        # Existing (validate CORS middleware)
└── .env                               # Existing (validate API keys, URLs)

.env.local (web)                       # Existing (validate API URLs)
.env (api)                             # Existing (validate CORS, OpenRouter key)
```

**Structure Decision**: This is a Phase III web application with existing chat functionality. The implementation focuses on the frontend (`web/`) with new components for the floating chat widget and ChatKit integration. Backend changes are minimal, limited to validating CORS configuration and API response format compatibility.

## Complexity Tracking

> **No violations** - All requirements align with Phase III constitution

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A       | N/A        | N/A                                 |

---

## Phase 0: Research & Investigation

### Research Tasks

#### R1: Connection Error Root Cause Analysis

**Objective**: Identify the exact cause of "Connection failed. Please check your internet connection" error

**Investigation Areas**:
1. **Current ChatKit Implementation**:
   - Review existing ChatKit initialization in `web/src/components/chat/`
   - Check if ChatKit is properly configured with API adapter
   - Verify ChatKit version compatibility with Next.js 15

2. **API Endpoint Configuration**:
   - Verify `NEXT_PUBLIC_API_URL` in `.env.local`
   - Check if API base URL is correct for both local and deployed environments
   - Validate API endpoint paths match ChatKit expectations

3. **CORS Configuration**:
   - Review `CORS_ORIGINS` in `api/.env`
   - Verify Vercel deployment domain is in allowlist
   - Check CORS middleware configuration in `api/src/main.py`

4. **Authentication Flow**:
   - Verify JWT token generation in `/api/token` endpoint
   - Check if token is properly passed to ChatKit API adapter
   - Validate token format and expiration

5. **Network Request Analysis**:
   - Inspect browser network tab for failed requests
   - Check request headers (Authorization, Content-Type)
   - Verify response status codes and error messages

**Expected Findings**:
- Specific error: CORS issue, authentication failure, or API endpoint mismatch
- Environment-specific issues: Local works but deployed fails (or vice versa)
- ChatKit configuration issues: Missing or incorrect API adapter setup

**Deliverable**: Document root cause and solution approach in `research.md`

---

#### R2: OpenAI ChatKit Integration Best Practices

**Objective**: Understand how to properly integrate ChatKit with existing Next.js app and FastAPI backend

**Research Areas**:
1. **ChatKit API Adapter Pattern**:
   - How to create custom API adapter for non-OpenAI backends
   - Request/response format requirements
   - Error handling patterns

2. **ChatKit Configuration**:
   - Required props and initialization options
   - Authentication integration
   - Custom styling and theming

3. **ChatKit Component Architecture**:
   - How to wrap ChatKit in custom components
   - State management with ChatKit
   - Event handling (onSend, onError, etc.)

4. **Responsive Design with ChatKit**:
   - Mobile layout best practices
   - Modal vs. slide-out panel patterns
   - Accessibility considerations

**Expected Findings**:
- ChatKit API adapter implementation pattern
- Configuration options for custom styling
- Best practices for responsive chat UI

**Deliverable**: Document ChatKit integration patterns in `research.md`

---

#### R3: Floating Chat Widget UI Patterns

**Objective**: Research best practices for floating chat widgets and modal/slide-out panels

**Research Areas**:
1. **Floating Button Patterns**:
   - Positioning strategies (fixed vs. sticky)
   - Z-index management
   - Mobile considerations (avoiding overlap with native UI)

2. **Modal vs. Slide-Out Panel**:
   - When to use modal vs. slide-out
   - Animation patterns (slide, fade, scale)
   - Backdrop/overlay handling

3. **Accessibility**:
   - Keyboard navigation (Tab, Enter, Escape)
   - Focus management (trap focus in modal)
   - ARIA attributes for screen readers

4. **Responsive Behavior**:
   - Mobile: Full-screen or partial overlay
   - Tablet: Slide-out panel from right
   - Desktop: Modal or slide-out panel

**Expected Findings**:
- Recommended UI pattern: Slide-out panel from right (desktop/tablet), full-screen modal (mobile)
- Animation library: Framer Motion or Tailwind CSS transitions
- Accessibility requirements: Focus trap, Escape key handler, ARIA labels

**Deliverable**: Document UI patterns and implementation approach in `research.md`

---

#### R4: Environment Configuration Validation

**Objective**: Ensure all environment variables are correctly configured for local and deployed environments

**Investigation Areas**:
1. **Frontend Environment Variables** (`.env.local`):
   - `NEXT_PUBLIC_API_URL`: Correct for local and deployed
   - `NEXT_PUBLIC_API_BASE_URL`: Matches backend API
   - `NEXT_PUBLIC_CHATKIT_DOMAIN_KEY`: Required or optional?

2. **Backend Environment Variables** (`.env`):
   - `CORS_ORIGINS`: Includes Vercel domain
   - `OPENROUTER_API_KEY`: Valid and working
   - `DATABASE_URL`: Neon PostgreSQL connection

3. **Deployment Configuration**:
   - Vercel environment variables set correctly
   - Railway/Render environment variables set correctly
   - API base URL resolves correctly from deployed frontend

**Expected Findings**:
- Missing or incorrect environment variables
- CORS configuration missing deployed domain
- API URL mismatch between environments

**Deliverable**: Document required environment variables and configuration in `research.md`

---

### Research Deliverable: research.md

**Contents**:
1. **Connection Error Root Cause**: Specific issue identified and solution approach
2. **ChatKit Integration Pattern**: API adapter implementation, configuration, and best practices
3. **Floating Widget UI Pattern**: Recommended approach for modal/slide-out panel with animations
4. **Environment Configuration**: Required variables and deployment setup
5. **Technical Decisions**: Rationale for chosen approaches and alternatives considered

---

## Phase 1: Design & Contracts

### Design Artifacts

#### D1: Component Architecture

**File**: `quickstart.md`

**Contents**:
1. **Component Hierarchy**:
   ```
   App Layout (layout.tsx)
   └── ChatWidget (global, always mounted)
       ├── FloatingChatButton (visible when closed)
       └── ChatPanel (visible when open)
           └── ChatKit Component (OpenAI ChatKit)
               ├── MessageList (ChatKit built-in)
               ├── MessageInput (ChatKit built-in)
               └── Custom MessageBubble (styled)
   ```

2. **State Management**:
   - `useChatWidget` hook: Manages open/close state
   - ChatKit internal state: Messages, loading, error
   - Authentication: JWT token from `/api/token`

3. **Component Responsibilities**:
   - **FloatingChatButton**: Trigger to open chat, always visible
   - **ChatWidget**: Container managing visibility and animations
   - **ChatPanel**: Wrapper for ChatKit with custom styling
   - **ChatKit**: Handles message rendering, input, and API communication

4. **Integration Points**:
   - ChatKit API Adapter: Custom adapter for FastAPI backend
   - Authentication: JWT token injection
   - Error Handling: Custom error messages for connection failures

---

#### D2: ChatKit API Adapter Contract

**File**: `contracts/chatkit-integration.md`

**Contents**:
1. **API Adapter Interface**:
   ```typescript
   interface ChatKitAdapter {
     sendMessage(message: string, conversationId?: string): Promise<ChatResponse>;
     getConversationHistory(conversationId: string): Promise<Message[]>;
     handleError(error: Error): string;
   }
   ```

2. **Request Format** (to FastAPI backend):
   ```json
   POST /api/v1/chat
   {
     "message": "user message text",
     "conversation_id": "uuid-or-null"
   }
   ```

3. **Response Format** (from FastAPI backend):
   ```json
   {
     "response": "AI assistant response",
     "conversation_id": "uuid",
     "timestamp": "ISO-8601",
     "tool_calls": []
   }
   ```

4. **Error Handling**:
   - Network errors: "Connection failed. Please try again."
   - Authentication errors: "Session expired. Please log in again."
   - API errors: "Unable to process request. Please try again."

5. **Authentication**:
   - JWT token from `/api/token` endpoint
   - Token injected in `Authorization: Bearer <token>` header
   - Token refresh on 401 response

---

#### D3: Floating Chat Widget Design

**File**: `quickstart.md` (continued)

**Contents**:
1. **Floating Button Design**:
   - Position: Fixed bottom-right (24px from bottom, 24px from right)
   - Size: 56px x 56px (mobile), 64px x 64px (desktop)
   - Icon: Chat bubble or message icon
   - Hover effect: Scale 1.1, shadow increase
   - Z-index: 1000 (above most content, below modals)

2. **Chat Panel Design**:
   - **Desktop/Tablet**: Slide-out panel from right
     - Width: 400px (desktop), 360px (tablet)
     - Height: 600px (desktop), 500px (tablet)
     - Position: Fixed bottom-right, above floating button
     - Animation: Slide in from right (300ms ease-out)
   - **Mobile**: Full-screen modal
     - Width: 100vw
     - Height: 100vh
     - Position: Fixed, covers entire screen
     - Animation: Slide up from bottom (300ms ease-out)

3. **Responsive Breakpoints**:
   - Mobile: < 768px (full-screen modal)
   - Tablet: 768px - 1024px (slide-out panel, 360px width)
   - Desktop: > 1024px (slide-out panel, 400px width)

4. **Accessibility**:
   - Focus trap: Tab cycles within chat panel when open
   - Escape key: Closes chat panel
   - ARIA labels: "Open chat", "Close chat", "Chat panel"
   - Keyboard navigation: All interactive elements accessible

---

#### D4: Message Styling Design

**File**: `quickstart.md` (continued)

**Contents**:
1. **User Messages**:
   - Alignment: Right
   - Background: Blue (primary color)
   - Text color: White
   - Border radius: 16px (rounded corners)
   - Max width: 70% of chat width
   - Margin: 8px bottom

2. **Assistant Messages**:
   - Alignment: Left
   - Background: Light gray
   - Text color: Dark gray
   - Border radius: 16px (rounded corners)
   - Max width: 70% of chat width
   - Margin: 8px bottom

3. **Message Metadata**:
   - Timestamp: Small text below message
   - Avatar: Optional (user initial or AI icon)
   - Status indicator: Sending, sent, error

4. **Loading State**:
   - Typing indicator: Three animated dots
   - Position: Left-aligned (assistant side)
   - Animation: Pulse or bounce

---

### Design Deliverables

1. **quickstart.md**: Component architecture, design specifications, and implementation guide
2. **contracts/chatkit-integration.md**: ChatKit API adapter contract and integration patterns

---

## Phase 2: Task Breakdown

**Note**: Task breakdown is created by the `/sp.tasks` command, NOT by `/sp.plan`. This section is a placeholder.

The `/sp.tasks` command will generate `tasks.md` with atomic, testable tasks based on this plan and the research findings.

---

## Next Steps

1. **Complete Phase 0 Research**: Run research tasks R1-R4 to identify connection error root cause and document integration patterns
2. **Complete Phase 1 Design**: Create `quickstart.md` and `contracts/chatkit-integration.md` with detailed component architecture and API contracts
3. **Run `/sp.tasks`**: Generate atomic task breakdown in `tasks.md`
4. **Begin Implementation**: Execute tasks in priority order (P1: Connection fix, P2: UI improvements, P3: Floating widget)

---

## Risk Mitigation

### Risk 1: ChatKit Compatibility Issues
- **Mitigation**: Test ChatKit integration early in Phase 0 research
- **Fallback**: If ChatKit incompatible, create custom chat UI with similar patterns

### Risk 2: CORS Configuration Issues
- **Mitigation**: Validate CORS settings in Phase 0 research, test on deployed environment
- **Fallback**: Add Vercel domain to CORS_ORIGINS, redeploy backend

### Risk 3: Responsive Design Challenges
- **Mitigation**: Design mobile-first, test on multiple device sizes early
- **Fallback**: Simplify mobile layout to full-screen modal if slide-out panel problematic

### Risk 4: Keyboard Accessibility Conflicts
- **Mitigation**: Review ChatKit accessibility features, add custom keyboard handlers
- **Fallback**: Implement focus trap and Escape key handler manually

---

## Success Criteria Validation

This plan addresses all success criteria from the specification:

- **SC-001**: 95% message success rate → Fixed by connection error resolution (P1)
- **SC-002**: Load in under 2 seconds → Optimized ChatKit initialization
- **SC-003**: Local/deployed parity → Environment configuration validation (R4)
- **SC-004**: Responsive 320px-1920px → Responsive design patterns (R3, D3)
- **SC-005**: Keyboard accessibility → Accessibility design (D3)
- **SC-006**: Visual message distinction → Message styling design (D4)
- **SC-007**: Smooth animations → Animation patterns (R3, D3)
- **SC-008**: Zero connection errors → Connection fix (R1, P1)

---

**Plan Status**: ✅ **COMPLETE** - Ready for Phase 0 research execution
