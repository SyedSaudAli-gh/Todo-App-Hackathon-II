# Implementation Plan: Chat History & Header UX

**Branch**: `008-chat-history-ux` | **Date**: 2026-02-05 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/008-chat-history-ux/spec.md`

## Summary

Enhance the existing Phase III AI chatbot with conversation history management and improved header UX. Users will be able to view past conversations, switch between them, start new chats without losing history, and interact with a clean, intuitive header interface. The implementation extends existing conversation persistence infrastructure with new API endpoints for history retrieval and frontend components for history navigation.

**Technical Approach**: Extend existing FastAPI chat router with conversation list and message retrieval endpoints. Add React components for history panel and redesigned header. Implement frontend state management for conversation switching. Ensure all data persists across sessions using existing PostgreSQL database models.

## Technical Context

**Project Type**: Phase III Full-Stack Web Application with AI Agent

### Phase III AI Agent Architecture

**AI/Agent Layer** (Existing - No Changes Required):
- Agent Framework: OpenAI Agents SDK
- LLM Provider: OpenRouter (NOT OpenAI directly)
- Recommended Model: Gemini via OpenRouter
- Tool Protocol: MCP (Model Context Protocol)
- MCP SDK: Official Python MCP SDK
- Agent Configuration: OpenRouter-compatible base URL
- API Key: `OPENROUTER_API_KEY` environment variable

**Agent Requirements** (Existing - Maintained):
- Stateless design (fetch conversation context from database)
- Tool-based reasoning (no direct database access)
- Natural language understanding for task operations
- Graceful error handling with user-friendly messages
- Confirmation prompts for destructive actions

**MCP Server Requirements** (Existing - Maintained):
- Stateless tool design (no in-memory state)
- Database-backed operations (persist all changes)
- Structured input/output schemas
- Agent-only invocation (no direct frontend access)

**Chat API Requirements** (Existing + New Endpoints):
- RESTful endpoints for conversation management
- Message persistence (user and agent messages)
- Tool call tracking
- Conversation history retrieval (NEW)
- Conversation list retrieval (NEW)

### Phase II Full-Stack Web Application

**Frontend**:
- Framework: Next.js 15+ with App Router
- UI Library: React 19+ with hooks
- Language: TypeScript 5+ (strict mode)
- Styling: Tailwind CSS 3+
- State Management: React hooks, Context API
- HTTP Client: fetch API
- Deployment: Vercel (recommended)

**Backend**:
- Framework: FastAPI 0.100+
- Language: Python 3.13+
- Validation: Pydantic v2
- ORM: SQLModel (SQLAlchemy + Pydantic)
- Migrations: Alembic
- Documentation: OpenAPI/Swagger (auto-generated)
- Deployment: Railway, Render, or similar

**Database**:
- Database: Neon PostgreSQL (serverless)
- ORM: SQLModel
- Migrations: Alembic
- Primary Keys: UUID (existing: conversation_id, message_id)
- Relationships: Foreign keys with CASCADE (existing: messages → conversations)

**Testing**:
- Frontend: Jest, React Testing Library
- Backend: pytest, FastAPI TestClient
- E2E: Playwright or Cypress
- API: Contract tests with OpenAPI validation

### Performance Goals

- API response time: <500ms p95 for conversation list retrieval
- API response time: <1000ms p95 for message history retrieval (up to 100 messages)
- Frontend conversation switching: <300ms UI transition time
- History panel load: <2 seconds from button click to display
- Message rendering: <100ms per message in UI

### Constraints

- Conversation list pagination: Support up to 1000 conversations per user
- Message history limit: Retrieve last 100 messages per conversation by default
- Message content: Max 10,000 characters (existing constraint)
- Browser compatibility: Modern browsers (Chrome, Firefox, Safari, Edge - last 2 versions)
- Mobile responsiveness: Support screens down to 320px width

### Scale/Scope

- Expected users: 100-1000 concurrent users
- Conversations per user: Up to 1000 conversations
- Messages per conversation: Up to 10,000 messages
- API throughput: 100 requests/second
- Database queries: Optimized with indexes on user_id, conversation_id, timestamp

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Phase III Requirements

- ✅ Uses approved AI/Agent stack (OpenAI Agents SDK, OpenRouter, MCP) - **Existing, no changes**
- ✅ OpenRouter API integration (NOT direct OpenAI API) - **Existing, no changes**
- ✅ `OPENROUTER_API_KEY` environment variable (NOT `OPENAI_API_KEY`) - **Existing, no changes**
- ✅ MCP Server with stateless, database-backed tools - **Existing, no changes**
- ✅ Agent uses MCP tools for ALL task operations (no direct DB access) - **Existing, no changes**
- ✅ Stateless backend (no in-memory conversation state) - **Existing, maintained**
- ✅ Conversation persistence (database-backed) - **Existing, extended with history retrieval**
- ✅ Message and tool call tracking - **Existing, no changes**
- ✅ Agent behavior contract (confirmations, error handling, no hallucinations) - **Existing, no changes**
- ✅ Chat API endpoints for conversation management - **Existing + NEW endpoints for history**
- ✅ No manual coding (Claude generates all code) - **Enforced**
- ✅ Phase III specifications required - **This plan.md satisfies requirement**

### Phase II Requirements

- ✅ Uses approved technology stack (Next.js, FastAPI, Neon) - **Existing, maintained**
- ✅ API-first architecture (Frontend → API → Database) - **Enforced in new endpoints**
- ✅ Frontend-backend separation (no direct DB access from frontend) - **Enforced**
- ✅ Persistent storage (Neon PostgreSQL, not in-memory) - **Existing, maintained**
- ✅ No Phase I patterns (in-memory, CLI, positional indexes) - **No violations**
- ✅ Database migrations with Alembic - **Required for any schema changes**
- ✅ OpenAPI/Swagger documentation - **Auto-generated for new endpoints**
- ✅ Proper error handling and validation - **Implemented in new endpoints**

**Constitution Check Result**: ✅ **PASS** - All requirements satisfied. No violations detected.

## Project Structure

### Documentation (this feature)

```text
specs/008-chat-history-ux/
├── spec.md                    # Feature specification (COMPLETE)
├── plan.md                    # This file (IN PROGRESS)
├── research.md                # Phase 0 output (TO BE CREATED)
├── data-model.md              # Phase 1 output (TO BE CREATED)
├── quickstart.md              # Phase 1 output (TO BE CREATED)
├── contracts/                 # Phase 1 output (TO BE CREATED)
│   ├── get-conversations.yaml # OpenAPI spec for GET /conversations
│   ├── get-messages.yaml      # OpenAPI spec for GET /conversations/{id}/messages
│   └── create-conversation.yaml # OpenAPI spec for POST /conversations
├── checklists/
│   └── requirements.md        # Spec quality checklist (COMPLETE)
└── tasks.md                   # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
api/                                    # FastAPI backend
├── src/
│   ├── models/                        # SQLModel database models
│   │   ├── conversation.py            # ✅ EXISTS - No changes needed
│   │   └── message.py                 # ✅ EXISTS - No changes needed
│   ├── schemas/                       # Pydantic request/response models
│   │   └── chat.py                    # ✅ EXISTS - Extend with new schemas
│   ├── routers/                       # API endpoints
│   │   └── chat.py                    # ✅ EXISTS - Add new endpoints
│   ├── services/                      # Business logic
│   │   └── conversation.py            # ✅ EXISTS - Extend with history methods
│   ├── database.py                    # ✅ EXISTS - No changes needed
│   └── main.py                        # ✅ EXISTS - No changes needed
├── alembic/                           # Database migrations
│   └── versions/                      # ✅ EXISTS - No new migrations needed
├── tests/
│   ├── test_api/
│   │   └── test_chat_history.py       # 🆕 NEW - Test new endpoints
│   └── test_services/
│       └── test_conversation_history.py # 🆕 NEW - Test history methods
└── requirements.txt                   # ✅ EXISTS - No new dependencies

web/                                    # Next.js frontend
├── src/
│   ├── app/
│   │   └── chat/                      # ✅ EXISTS - No changes needed
│   ├── components/
│   │   └── chat/
│   │       ├── ChatContainer.tsx      # ✅ EXISTS - Update header UI
│   │       ├── ChatHeader.tsx         # 🆕 NEW - Dedicated header component
│   │       ├── HistoryPanel.tsx       # 🆕 NEW - Conversation history panel
│   │       ├── ConversationList.tsx   # 🆕 NEW - List of conversations
│   │       ├── MessageList.tsx        # ✅ EXISTS - No changes needed
│   │       └── MessageInput.tsx       # ✅ EXISTS - No changes needed
│   ├── lib/
│   │   ├── api/
│   │   │   └── chat.ts                # ✅ EXISTS - Add history API calls
│   │   └── hooks/
│   │       ├── useChat.ts             # ✅ EXISTS - Extend with history state
│   │       └── useChatHistory.ts      # 🆕 NEW - History management hook
│   └── types/
│       └── chat.ts                    # ✅ EXISTS - Add history types
├── tests/
│   ├── unit/
│   │   └── components/
│   │       ├── ChatHeader.test.tsx    # 🆕 NEW - Header component tests
│   │       └── HistoryPanel.test.tsx  # 🆕 NEW - History panel tests
│   └── e2e/
│       └── chat-history.spec.ts       # 🆕 NEW - E2E history tests
├── package.json                       # ✅ EXISTS - No new dependencies
└── tsconfig.json                      # ✅ EXISTS - No changes needed
```

**Structure Decision**: Phase III Full-Stack Web Application with existing conversation persistence infrastructure. The implementation extends existing backend services and frontend components rather than creating new modules. Database models are already complete and require no schema changes.

## Complexity Tracking

> **No violations detected. This section is empty.**

All requirements align with Phase III constitution. No complexity justifications needed.

## Phase 0: Research & Discovery

### Research Tasks

#### R1: Existing Conversation Infrastructure Analysis
**Status**: ✅ COMPLETE (analyzed during planning)

**Findings**:
- Database models exist: `Conversation` (conversation_id, user_id, created_at, updated_at) and `Message` (message_id, conversation_id, role, message_text, timestamp, tool_calls)
- Existing endpoint: POST /api/v1/chat (creates conversation if not provided, saves messages)
- ConversationService exists with methods: create_conversation, get_conversation, save_message, get_conversation_history, update_conversation_timestamp
- Frontend useChat hook manages single conversation state

**Gaps Identified**:
1. No API endpoint to list all user conversations
2. No API endpoint to retrieve messages for a specific conversation (separate from chat flow)
3. No frontend components for history panel
4. No frontend state management for conversation switching
5. Header UI needs redesign (remove "✕ New Conversation ✕", add proper buttons)

#### R2: Conversation List Retrieval Patterns
**Question**: What's the best approach for retrieving and displaying conversation lists with preview text?

**Research Needed**:
- Pagination strategy (offset vs cursor-based)
- Preview text generation (first message vs last message vs summary)
- Sorting order (newest first vs last updated)
- Performance optimization (eager loading vs lazy loading)

**Decision Criteria**:
- User experience: Fast initial load, smooth scrolling
- Scalability: Support 1000+ conversations per user
- Database efficiency: Minimize query complexity

#### R3: Frontend State Management for Conversation Switching
**Question**: How should the frontend manage state when switching between conversations?

**Research Needed**:
- State preservation strategy (keep all conversations in memory vs fetch on demand)
- Message caching approach (cache all vs cache recent)
- Loading state management (optimistic UI vs loading indicators)
- Error recovery (network failures during switch)

**Decision Criteria**:
- Performance: <300ms UI transition time
- Memory efficiency: Don't load all conversations into memory
- User experience: Smooth transitions, clear loading states

#### R4: Click-Outside Behavior Implementation
**Question**: How to disable click-outside-to-close while maintaining accessibility?

**Research Needed**:
- React event handling patterns (stopPropagation vs preventDefault)
- Accessibility considerations (keyboard navigation, focus management)
- Modal vs non-modal patterns
- Z-index and overlay management

**Decision Criteria**:
- Accessibility: Keyboard users can still close with Escape or Close button
- User experience: Clear visual indication that chatbot is persistent
- Code maintainability: Simple, testable implementation

#### R5: JSON Filtering in Message Display
**Question**: How to reliably filter JSON tool call data from user-facing messages?

**Research Needed**:
- Message content parsing strategies
- Tool call data structure analysis
- Regex vs JSON parsing approaches
- Edge cases (partial JSON, nested structures)

**Decision Criteria**:
- Reliability: 100% filtering of tool call data
- Performance: <10ms per message processing
- Maintainability: Clear, testable filtering logic

### Research Output

All research tasks will be documented in `research.md` with:
- Decision made
- Rationale
- Alternatives considered
- Implementation guidance

## Phase 1: Design & Contracts

### Data Model Extensions

**File**: `data-model.md`

**Existing Models** (No Changes):
- `Conversation`: conversation_id (UUID, PK), user_id (str, indexed), created_at (datetime), updated_at (datetime)
- `Message`: message_id (UUID, PK), conversation_id (UUID, FK), role (enum: user/assistant), message_text (str), timestamp (datetime), tool_calls (JSON), message_metadata (JSON)

**No New Models Required**: Existing schema supports all feature requirements.

**Index Optimization** (Potential):
- Existing index on `conversations.user_id` supports conversation list queries
- Existing index on `messages.conversation_id` supports message retrieval
- Consider composite index on `(user_id, updated_at)` for sorted conversation lists

### API Contract Extensions

**File**: `contracts/get-conversations.yaml`

**Endpoint**: GET /api/v1/chat/conversations
- **Purpose**: Retrieve all conversations for authenticated user
- **Authentication**: Required (JWT token)
- **Query Parameters**:
  - `limit` (optional, default: 50, max: 100): Number of conversations to return
  - `offset` (optional, default: 0): Pagination offset
  - `sort` (optional, default: "updated_at_desc"): Sort order
- **Response 200**:
  ```json
  {
    "conversations": [
      {
        "conversation_id": "uuid",
        "created_at": "2026-02-05T10:00:00Z",
        "updated_at": "2026-02-05T10:30:00Z",
        "message_count": 10,
        "preview": "Last message preview text..."
      }
    ],
    "total": 150,
    "limit": 50,
    "offset": 0
  }
  ```
- **Response 401**: Unauthorized
- **Response 500**: Internal server error

**File**: `contracts/get-messages.yaml`

**Endpoint**: GET /api/v1/chat/conversations/{conversation_id}/messages
- **Purpose**: Retrieve all messages for a specific conversation
- **Authentication**: Required (JWT token)
- **Path Parameters**:
  - `conversation_id` (required, UUID): Conversation identifier
- **Query Parameters**:
  - `limit` (optional, default: 100, max: 500): Number of messages to return
  - `offset` (optional, default: 0): Pagination offset
- **Response 200**:
  ```json
  {
    "conversation_id": "uuid",
    "messages": [
      {
        "message_id": "uuid",
        "role": "user",
        "message_text": "Create a task...",
        "timestamp": "2026-02-05T10:00:00Z"
      },
      {
        "message_id": "uuid",
        "role": "assistant",
        "message_text": "Task created successfully.",
        "timestamp": "2026-02-05T10:00:05Z",
        "tool_calls": [...]
      }
    ],
    "total": 10,
    "limit": 100,
    "offset": 0
  }
  ```
- **Response 401**: Unauthorized
- **Response 404**: Conversation not found or access denied
- **Response 500**: Internal server error

**File**: `contracts/create-conversation.yaml`

**Endpoint**: POST /api/v1/chat/conversations
- **Purpose**: Explicitly create a new conversation (alternative to implicit creation in POST /chat)
- **Authentication**: Required (JWT token)
- **Request Body**: None (empty POST)
- **Response 201**:
  ```json
  {
    "conversation_id": "uuid",
    "created_at": "2026-02-05T10:00:00Z",
    "updated_at": "2026-02-05T10:00:00Z"
  }
  ```
- **Response 401**: Unauthorized
- **Response 500**: Internal server error

### Frontend Component Design

**Component**: `ChatHeader`
- **Purpose**: Display chatbot title and navigation controls
- **Props**:
  - `onNewChat: () => void` - Callback for New Chat button
  - `onToggleHistory: () => void` - Callback for History button
  - `onClose: () => void` - Callback for Close button
  - `isHistoryOpen: boolean` - Whether history panel is open
- **Layout**:
  ```
  [AI Todo Assistant] [History] [New Chat] [❌]
  ```
- **Styling**: Tailwind CSS, consistent with site theme
- **Accessibility**: ARIA labels, keyboard navigation

**Component**: `HistoryPanel`
- **Purpose**: Display list of past conversations
- **Props**:
  - `conversations: Conversation[]` - List of conversations
  - `currentConversationId: string | null` - Active conversation
  - `onSelectConversation: (id: string) => void` - Callback for conversation selection
  - `isOpen: boolean` - Panel visibility
  - `onClose: () => void` - Callback to close panel
- **Layout**: Slide-in panel from left or right
- **Features**:
  - Scrollable list
  - Highlight active conversation
  - Show preview text and timestamp
  - Empty state for no conversations
- **Styling**: Tailwind CSS, smooth transitions

**Component**: `ConversationList`
- **Purpose**: Render individual conversation items
- **Props**:
  - `conversations: Conversation[]`
  - `currentConversationId: string | null`
  - `onSelect: (id: string) => void`
- **Item Layout**:
  ```
  [Preview text...]
  [Timestamp]
  ```
- **Interaction**: Click to load conversation

### State Management Design

**Hook**: `useChatHistory`
- **Purpose**: Manage conversation history state
- **State**:
  - `conversations: Conversation[]` - List of user conversations
  - `isLoading: boolean` - Loading state
  - `error: string | null` - Error state
- **Methods**:
  - `fetchConversations(): Promise<void>` - Load conversation list
  - `refreshConversations(): Promise<void>` - Reload conversation list
- **Effects**:
  - Fetch conversations on mount
  - Refresh on conversation creation

**Hook Extension**: `useChat` (existing)
- **New State**:
  - `isHistoryOpen: boolean` - History panel visibility
- **New Methods**:
  - `toggleHistory(): void` - Toggle history panel
  - `loadConversation(id: string): Promise<void>` - Switch to conversation
  - `createNewConversation(): Promise<void>` - Start new chat

### Quickstart Guide

**File**: `quickstart.md`

**Developer Setup**:
1. Ensure existing chat infrastructure is running (API, database, frontend)
2. No new dependencies required
3. No database migrations required (schema is complete)

**Testing New Endpoints**:
```bash
# List conversations
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/v1/chat/conversations

# Get messages for conversation
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/v1/chat/conversations/{id}/messages

# Create new conversation
curl -X POST -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/v1/chat/conversations
```

**Frontend Development**:
```bash
cd web
npm run dev
# Open http://localhost:3000
# Click chatbot icon
# Click History button to see conversation list
# Click New Chat to start fresh conversation
```

## Implementation Phases

### Phase 0: Research (Complete)
- ✅ Analyze existing infrastructure
- ✅ Identify gaps
- 🔄 Research conversation list patterns → `research.md`
- 🔄 Research state management approach → `research.md`
- 🔄 Research click-outside behavior → `research.md`
- 🔄 Research JSON filtering → `research.md`

### Phase 1: Design (In Progress)
- ✅ Document data model (no changes needed)
- 🔄 Create API contracts → `contracts/*.yaml`
- 🔄 Design frontend components → `data-model.md`
- 🔄 Design state management → `data-model.md`
- 🔄 Create quickstart guide → `quickstart.md`

### Phase 2: Tasks (Next Command)
- Run `/sp.tasks` to generate atomic, testable tasks
- Tasks will cover:
  - Backend: New API endpoints, service methods, tests
  - Frontend: New components, hooks, state management, tests
  - Integration: E2E tests, UX validation
  - Documentation: API docs, user guide updates

## Success Criteria Mapping

| Success Criterion | Implementation Approach | Validation Method |
|-------------------|------------------------|-------------------|
| SC-001: History loads in <2s | Indexed database queries, pagination | Performance test |
| SC-002: Conversation switch <3s | Optimized message retrieval, caching | Performance test |
| SC-003: 100% persistence | Database-backed storage (existing) | E2E test |
| SC-004: 0% data loss on new chat | Separate conversation creation | Integration test |
| SC-005: No close on outside click | Event handling, stopPropagation | E2E test |
| SC-006: Close in <500ms | React state update, CSS transitions | Performance test |
| SC-007: No JSON in UI | Message filtering logic | Unit test |
| SC-008: 95% navigation success | Intuitive UI, clear feedback | User testing |
| SC-009: 4 header elements | Component structure | Visual test |
| SC-010: Transitions <300ms | CSS transitions, React optimization | Performance test |

## Risk Analysis

### Technical Risks

**Risk 1: Performance degradation with large conversation lists**
- **Likelihood**: Medium
- **Impact**: High
- **Mitigation**: Implement pagination, lazy loading, virtual scrolling
- **Contingency**: Add search/filter functionality to reduce visible items

**Risk 2: State synchronization issues during conversation switching**
- **Likelihood**: Medium
- **Impact**: Medium
- **Mitigation**: Clear state management patterns, loading indicators
- **Contingency**: Add optimistic UI updates, rollback on error

**Risk 3: Message filtering fails to catch all JSON tool calls**
- **Likelihood**: Low
- **Impact**: High (poor UX)
- **Mitigation**: Comprehensive regex/parsing, extensive test coverage
- **Contingency**: Server-side filtering as fallback

### UX Risks

**Risk 4: Users confused by history panel interaction**
- **Likelihood**: Low
- **Impact**: Medium
- **Mitigation**: Clear visual design, tooltips, empty states
- **Contingency**: Add onboarding tutorial or help text

**Risk 5: Accidental conversation switches**
- **Likelihood**: Low
- **Impact**: Low
- **Mitigation**: Confirmation on unsaved input, clear active state
- **Contingency**: Add "undo" functionality

## Dependencies

### External Dependencies
- ✅ Existing authentication system (provides user_id)
- ✅ Existing database schema (Conversation, Message models)
- ✅ Existing chat API (POST /chat endpoint)
- ✅ Existing frontend chat components (ChatContainer, MessageList, MessageInput)

### Internal Dependencies
- Phase 0 research must complete before Phase 1 design finalization
- API contracts must be defined before frontend implementation
- Backend endpoints must be deployed before frontend integration testing

## Next Steps

1. **Complete Phase 0 Research**: Document all research findings in `research.md`
2. **Finalize Phase 1 Design**: Create all contract files in `contracts/` directory
3. **Generate Tasks**: Run `/sp.tasks` to break down implementation into atomic tasks
4. **Begin Implementation**: Execute tasks in dependency order (backend → frontend → integration)

## Appendix

### Existing Code References

**Backend**:
- `api/src/models/conversation.py:13-54` - Conversation model
- `api/src/models/message.py:22-87` - Message model
- `api/src/routers/chat.py:24-210` - Existing chat endpoint
- `api/src/services/conversation.py` - ConversationService (to be extended)

**Frontend**:
- `web/src/components/chat/ChatContainer.tsx:44-140` - Main chat container
- `web/src/lib/hooks/useChat.ts` - Chat state management hook (to be extended)
- `web/src/lib/api/chat.ts` - Chat API client (to be extended)

### Related Documentation
- Phase III Constitution: `.specify/memory/constitution.md`
- Feature Specification: `specs/008-chat-history-ux/spec.md`
- Quality Checklist: `specs/008-chat-history-ux/checklists/requirements.md`
