# Implementation Plan: AI-Powered Todo Chatbot Backend

**Branch**: `001-ai-todo-chatbot` | **Date**: 2026-02-02 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-ai-todo-chatbot/spec.md`

## Summary

Build a stateless AI-powered chatbot backend that enables natural language task management through OpenAI Agents SDK, MCP tools, and persistent conversation memory. The system demonstrates tool-based reasoning, agent orchestration, and clean separation between agent logic, MCP tools, and database operations. All conversations and tasks persist across server restarts, with the FastAPI server reconstructing context from PostgreSQL on every request.

**Technical Approach**: Integrate OpenAI Agents SDK configured for OpenRouter API, implement MCP Server with 5 stateless task management tools, create conversation persistence layer with SQLModel, and expose single POST /api/v1/chat endpoint for all interactions.

## Technical Context

**Project Type**: Phase III Full-Stack Web Application (AI Agent Extension)

### Phase III AI Agent Architecture

**AI/Agent Layer**:
- Agent Framework: OpenAI Agents SDK (MANDATORY)
- LLM Provider: OpenRouter (NOT OpenAI directly)
- Recommended Model: Gemini 2.0 Flash via OpenRouter
- Tool Protocol: MCP (Model Context Protocol)
- MCP SDK: Official Python MCP SDK (`mcp` package)
- Agent Configuration: OpenRouter-compatible base URL (`https://openrouter.ai/api/v1`)
- API Key: `OPENROUTER_API_KEY` environment variable (NOT `OPENAI_API_KEY`)

**Agent Requirements**:
- Stateless design (fetch conversation context from database on every request)
- Tool-based reasoning (no direct database access from agent logic)
- Natural language understanding for task operations (create, read, update, delete, list)
- Graceful error handling with user-friendly messages
- Confirmation prompts for destructive actions (delete, bulk operations)
- Conversation context maintenance across messages
- Response time target: <3 seconds under normal load

**MCP Server Requirements**:
- Stateless tool design (no in-memory state between calls)
- Database-backed operations (persist all changes immediately)
- Structured input/output schemas with Pydantic validation
- Agent-only invocation (not exposed to frontend directly)
- 5 core tools: create_task, list_tasks, get_task, update_task, delete_task
- Error responses with structured format
- Transaction support for data integrity

**Chat API Requirements**:
- Single POST endpoint: `/api/v1/chat`
- Request: conversation_id (optional), message (required)
- Response: conversation_id, response text, tool_calls array, timestamp
- Message persistence (user and agent messages)
- Tool call tracking for auditability
- Conversation history retrieval (last 20 messages for context)
- Stateless request handling (<500ms context reconstruction)

### Phase II Full-Stack Web Application (Maintained)

**Frontend** (Existing - No Changes Required):
- Framework: Next.js 15+ with App Router
- UI Library: React 19+ with hooks
- Language: TypeScript 5+ (strict mode)
- Styling: Tailwind CSS 3+
- Authentication: NextAuth with PostgreSQL adapter
- State Management: React hooks, Context API
- HTTP Client: fetch API
- Deployment: Vercel

**Backend** (Existing + Phase III Extensions):
- Framework: FastAPI 0.100+
- Language: Python 3.13+
- Validation: Pydantic v2
- ORM: SQLModel (SQLAlchemy + Pydantic)
- Migrations: Alembic
- Documentation: OpenAPI/Swagger (auto-generated)
- Deployment: Railway, Render, or similar
- **NEW**: OpenAI Agents SDK integration
- **NEW**: MCP Server implementation
- **NEW**: Conversation service layer

**Database** (Existing + Phase III Extensions):
- Database: Neon PostgreSQL (serverless)
- ORM: SQLModel
- Migrations: Alembic
- Primary Keys: UUID (conversations, messages) and auto-increment integers (tasks)
- Relationships: Foreign keys with CASCADE
- **NEW**: conversations table (UUID primary key)
- **NEW**: messages table (UUID primary key, FK to conversations)
- **NEW**: tool_calls tracking (embedded in messages as JSON)

**Testing**:
- Backend: pytest, FastAPI TestClient
- Agent Behavior: pytest with mock MCP tools
- MCP Tools: Contract tests with database fixtures
- API: Contract tests with OpenAPI validation
- E2E: Conversation flow tests

### Performance Goals

- API response time: <500ms p95 (excluding agent processing)
- Agent response time: <3 seconds p95 (including LLM and tool calls)
- Context reconstruction: <500ms for conversations up to 50 messages
- Database query performance: <100ms p95 for conversation history retrieval
- Concurrent requests: Support 10+ concurrent chat requests without data corruption
- Tool call latency: <200ms p95 per MCP tool invocation

### Constraints

- Stateless backend: No in-memory conversation state
- Database-backed: All state persisted to PostgreSQL
- OpenRouter API: Must use OpenRouter, not direct OpenAI API
- MCP tools only: Agent cannot access database directly
- Single endpoint: All chat interactions through POST /api/v1/chat
- Conversation history limit: Last 20 messages for context (performance constraint)
- Message length: Max 10,000 characters per message
- Tool timeout: 15 seconds max for agent processing per request

### Scale/Scope

- Target users: Single-user hackathon demo (multi-user ready via user_id)
- Conversation volume: 100+ conversations per user
- Message volume: 1000+ messages per conversation
- Task volume: 1000+ tasks per user
- Tool calls: 5-10 tool calls per agent response (average)
- Database size: <1GB for hackathon demo
- Deployment: Single instance (horizontally scalable architecture)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Phase III Requirements

- ✅ Uses approved AI/Agent stack (OpenAI Agents SDK, OpenRouter, MCP)
- ✅ OpenRouter API integration (NOT direct OpenAI API)
- ✅ `OPENROUTER_API_KEY` environment variable (NOT `OPENAI_API_KEY`)
- ✅ MCP Server with stateless, database-backed tools
- ✅ Agent uses MCP tools for ALL task operations (no direct DB access)
- ✅ Stateless backend (no in-memory conversation state)
- ✅ Conversation persistence (database-backed)
- ✅ Message and tool call tracking
- ✅ Agent behavior contract (confirmations, error handling, no hallucinations)
- ✅ Chat API endpoints for conversation management
- ✅ No manual coding (Claude generates all code)
- ✅ Phase III specifications required (agent.md, mcp-tools.md, chat-api.md, database.md, architecture.md)

### Phase II Requirements (Maintained in Phase III)

- ✅ Uses approved technology stack (Next.js, FastAPI, Neon)
- ✅ API-first architecture (Frontend → API → Database)
- ✅ Frontend-backend separation (no direct DB access from frontend)
- ✅ Persistent storage (Neon PostgreSQL, not in-memory)
- ✅ No Phase I patterns (in-memory, CLI, positional indexes)
- ✅ Database migrations with Alembic
- ✅ OpenAPI/Swagger documentation
- ✅ Proper error handling and validation

### Existing Architecture Review

**✅ PASS**: Reviewed existing codebase:
- `api/src/routers/chat.py` exists with POST /chat endpoint structure
- `api/src/models/conversation.py` exists with Conversation model (UUID primary key)
- `api/src/models/message.py` exists with Message model (UUID primary key, tool_calls JSON field)
- `api/src/models/todo.py` exists with Todo model (user_id support)
- Authentication middleware exists (`api/src/middleware/auth.py`)
- Database connection exists (`api/src/database.py`)

**⚠️ NEEDS IMPLEMENTATION**: Missing components identified:
- `api/src/ai/orchestrator.py` - AIAgentOrchestrator class (OpenAI Agents SDK integration)
- `api/src/ai/context.py` - ConversationContextBuilder class
- `api/src/ai/errors.py` - AIAgentTimeoutError exception
- `api/src/services/conversation.py` - ConversationService class
- `api/src/schemas/chat.py` - ChatRequest, ChatResponse schemas
- `api/src/mcp/` - MCP Server implementation with 5 tools
- Alembic migrations for conversations and messages tables

## Project Structure

### Documentation (this feature)

```text
specs/001-ai-todo-chatbot/
├── spec.md                    # ✅ Complete (feature specification)
├── plan.md                    # ✅ This file (implementation plan)
├── research.md                # Phase 0 output (technology research)
├── data-model.md              # Phase 1 output (database schema)
├── quickstart.md              # Phase 1 output (setup guide)
├── contracts/                 # Phase 1 output (API contracts)
│   ├── chat-api.yaml         # OpenAPI spec for chat endpoint
│   └── mcp-tools.yaml        # MCP tool contracts
├── checklists/
│   └── requirements.md        # ✅ Complete (spec quality checklist)
└── tasks.md                   # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
api/                                    # FastAPI backend
├── src/
│   ├── models/                        # SQLModel database models
│   │   ├── conversation.py           # ✅ Exists (Conversation model)
│   │   ├── message.py                # ✅ Exists (Message model)
│   │   ├── todo.py                   # ✅ Exists (Todo model)
│   │   └── __init__.py
│   ├── schemas/                       # Pydantic request/response models
│   │   ├── chat.py                   # ⚠️ NEW (ChatRequest, ChatResponse)
│   │   └── __init__.py
│   ├── routers/                       # API endpoints
│   │   ├── chat.py                   # ✅ Exists (needs AIAgentOrchestrator)
│   │   ├── todos.py                  # ✅ Exists
│   │   ├── health.py                 # ✅ Exists
│   │   └── __init__.py
│   ├── services/                      # Business logic
│   │   ├── conversation.py           # ⚠️ NEW (ConversationService)
│   │   └── __init__.py
│   ├── ai/                            # ⚠️ NEW (AI agent layer)
│   │   ├── orchestrator.py           # AIAgentOrchestrator (OpenAI Agents SDK)
│   │   ├── context.py                # ConversationContextBuilder
│   │   ├── errors.py                 # AIAgentTimeoutError, AIAgentError
│   │   └── __init__.py
│   ├── mcp/                           # ⚠️ NEW (MCP Server)
│   │   ├── server.py                 # MCP Server initialization
│   │   ├── tools/                    # MCP tool implementations
│   │   │   ├── create_task.py       # create_task tool
│   │   │   ├── list_tasks.py        # list_tasks tool
│   │   │   ├── get_task.py          # get_task tool
│   │   │   ├── update_task.py       # update_task tool
│   │   │   ├── delete_task.py       # delete_task tool
│   │   │   └── __init__.py
│   │   └── __init__.py
│   ├── middleware/                    # Middleware
│   │   ├── auth.py                   # ✅ Exists (authentication)
│   │   ├── error_handler.py          # ✅ Exists
│   │   └── __init__.py
│   ├── database.py                    # ✅ Exists (database connection)
│   ├── dependencies.py                # ✅ Exists (FastAPI dependencies)
│   ├── config.py                      # ✅ Exists (configuration)
│   └── main.py                        # ✅ Exists (FastAPI app)
├── alembic/                           # Database migrations
│   ├── versions/
│   │   ├── 001_create_todos_table.py              # ✅ Exists
│   │   ├── 002_add_user_id_to_todos.py            # ✅ Exists
│   │   ├── 003_create_conversations_table.py      # ⚠️ NEW
│   │   └── 004_create_messages_table.py           # ⚠️ NEW
│   └── env.py                         # ✅ Exists
├── tests/
│   ├── test_api/                      # API endpoint tests
│   │   ├── test_chat.py              # ⚠️ NEW (chat endpoint tests)
│   │   └── test_todos.py             # ✅ Exists
│   ├── test_models/                   # Database model tests
│   │   ├── test_conversation.py      # ⚠️ NEW
│   │   └── test_message.py           # ⚠️ NEW
│   ├── test_services/                 # Business logic tests
│   │   └── test_conversation.py      # ⚠️ NEW
│   ├── test_ai/                       # ⚠️ NEW (AI agent tests)
│      ├── test_orchestrator.py      # Agent behavior tests
│   │   └── test_context.py           # Context builder tests
│   ├── test_mcp/                      # ⚠️ NEW (MCP tool tests)
│   │   └── test_tools.py             # Tool contract tests
│   └── conftest.py                    # ✅ Exists (pytest fixtures)
├── requirements.txt                   # ✅ Exists (needs updates)
└── .env.example                       # ✅ Exists (needs OPENROUTER_API_KEY)

web/                                    # Next.js frontend (NO CHANGES)
├── src/
│   ├── app/                           # ✅ Exists (Next.js App Router)
│   ├── components/                    # ✅ Exists (React components)
│   ├── lib/                           # ✅ Exists (utilities)
│   └── types/                         # ✅ Exists (TypeScript types)
├── public/                            # ✅ Exists
├── package.json                       # ✅ Exists
└── tsconfig.json                      # ✅ Exists
```

**Structure Decision**: Phase III extends existing Phase II architecture with AI agent layer (`api/src/ai/`), MCP Server (`api/src/mcp/`), and conversation service (`api/src/services/conversation.py`). Frontend remains unchanged - chat UI integration is out of scope for backend-focused SPEC-006.

## Complexity Tracking

No constitution violations. All requirements align with Phase III principles.

---

## Phase 0: Research & Technology Validation

**Objective**: Resolve all technical unknowns and validate technology choices before design phase.

### Research Tasks

#### R1: OpenAI Agents SDK + OpenRouter Integration
**Question**: How to configure OpenAI Agents SDK to use OpenRouter API instead of direct OpenAI API?

**Research Areas**:
- OpenAI Agents SDK base URL configuration
- OpenRouter API compatibility with OpenAI SDK
- API key environment variable naming (`OPENROUTER_API_KEY`)
- Model selection (Gemini 2.0 Flash via OpenRouter)
- Error handling for OpenRouter-specific responses

**Expected Outcome**: Configuration pattern for Agents SDK with OpenRouter base URL

#### R2: MCP SDK Python Implementation
**Question**: How to implement MCP Server in Python with stateless, database-backed tools?

**Research Areas**:
- Official MCP SDK for Python (`mcp` package)
- MCP Server initialization and tool registration
- Tool schema definition (input/output with Pydantic)
- Stateless tool design patterns
- Database connection management in MCP tools
- Error handling and structured responses

**Expected Outcome**: MCP Server implementation pattern with tool registration

#### R3: Agent-MCP Integration Pattern
**Question**: How does OpenAI Agents SDK invoke MCP tools?

**Research Areas**:
- Tool invocation protocol between Agents SDK and MCP Server
- Tool result handling and response formatting
- Error propagation from MCP tools to agent
- Timeout handling for tool calls
- Multiple tool calls in single agent response

**Expected Outcome**: Integration pattern for Agents SDK → MCP Server communication

#### R4: Conversation Context Management
**Question**: How to efficiently reconstruct conversation context from database for stateless requests?

**Research Areas**:
- Conversation history retrieval strategies (last N messages)
- Message formatting for agent context (role, content, tool_calls)
- Context window management (token limits)
- Performance optimization (database queries, indexing)
- Context caching strategies (if allowed within stateless constraint)

**Expected Outcome**: Context reconstruction pattern with performance benchmarks

#### R5: Agent Confirmation Flow
**Question**: How to implement confirmation prompts for destructive actions in conversational flow?

**Research Areas**:
- Multi-turn conversation patterns
- State management for pending confirmations (database-backed)
- Timeout handling for confirmation responses
- Cancellation handling
- User intent recognition (yes/no/cancel)

**Expected Outcome**: Confirmation flow pattern with state persistence

### Research Output

**Deliverable**: `specs/001-ai-todo-chatbot/research.md`

**Format**:
```markdown
# Research: AI-Powered Todo Chatbot Backend

## R1: OpenAI Agents SDK + OpenRouter Integration
- **Decision**: [Configuration approach]
- **Rationale**: [Why this approach]
- **Alternatives Considered**: [Other options evaluated]
- **Code Example**: [Configuration snippet]

## R2: MCP SDK Python Implementation
[Same format]

## R3: Agent-MCP Integration Pattern
[Same format]

## R4: Conversation Context Management
[Same format]

## R5: Agent Confirmation Flow
[Same format]
```

---

## Phase 1: Design & Contracts

**Prerequisites**: `research.md` complete with all decisions documented

### D1: Database Schema Design

**Objective**: Define complete database schema for conversations, messages, and tool calls.

**Deliverable**: `specs/001-ai-todo-chatbot/data-model.md`

**Content**:
- Conversation entity (UUID primary key, user_id, timestamps)
- Message entity (UUID primary key, conversation_id FK, role enum, message_text, tool_calls JSON, timestamp)
- Tool call structure (embedded in messages as JSON array)
- Relationships and foreign keys
- Indexes for query performance
- Migration strategy (Alembic versions 003 and 004)

**Validation**:
- All fields from spec.md Phase III Conversation Persistence section
- Foreign key constraints defined
- Indexes on conversation_id, user_id, timestamp
- JSON schema for tool_calls array

### D2: Chat API Contract

**Objective**: Define OpenAPI specification for POST /api/v1/chat endpoint.

**Deliverable**: `specs/001-ai-todo-chatbot/contracts/chat-api.yaml`

**Content**:
- POST /api/v1/chat endpoint
- Request schema (ChatRequest): conversation_id (optional UUID), message (required string)
- Response schema (ChatResponse): conversation_id (UUID), response (string), tool_calls (array), timestamp (datetime)
- Error responses (400, 401, 404, 422, 500)
- Authentication requirements (JWT token)
- Request/response examples

**Validation**:
- Matches spec.md Phase III Chat API section
- OpenAPI 3.0+ format
- All status codes documented
- Example requests/responses included

### D3: MCP Tool Contracts

**Objective**: Define MCP tool schemas for all 5 task management tools.

**Deliverable**: `specs/001-ai-todo-chatbot/contracts/mcp-tools.yaml`

**Content**:
- create_task tool (inputs: title, description, status; outputs: task_id, success, message)
- list_tasks tool (inputs: status filter; outputs: tasks array, count)
- get_task tool (inputs: task_id; outputs: task object, success, message)
- update_task tool (inputs: task_id, title, description, status; outputs: task object, success, message)
- delete_task tool (inputs: task_id; outputs: success, message)
- Error response format for all tools
- Stateless guarantee documentation

**Validation**:
- Matches spec.md Phase III MCP Tools section
- All input/output fields defined with types
- Error cases documented
- Stateless design confirmed

### D4: Agent Behavior Specification

**Objective**: Define agent behavior contract and interaction patterns.

**Deliverable**: `specs/001-ai-todo-chatbot/contracts/agent-behavior.md`

**Content**:
- Natural language intent patterns (create, read, update, delete, list)
- Tool invocation decision tree
- Confirmation prompt templates
- Error message templates
- Response formatting guidelines
- Edge case handling (ambiguous input, tool failures, database errors)

**Validation**:
- Matches spec.md Phase III AI Agent Behavior section
- All user stories covered
- Confirmation flow defined
- Error handling specified

### D5: Quickstart Guide

**Objective**: Document setup and configuration for local development.

**Deliverable**: `specs/001-ai-todo-chatbot/quickstart.md`

**Content**:
- Environment variable setup (OPENROUTER_API_KEY, DATABASE_URL)
- Dependency installation (requirements.txt updates)
- Database migration commands
- MCP Server startup
- Agent testing commands
- Troubleshooting common issues

**Validation**:
- All environment variables documented
- Step-by-step setup instructions
- Verification commands included

---

## Phase 2: Implementation Readiness

**Prerequisites**: All Phase 1 artifacts complete and validated

### Validation Checklist

- [ ] research.md complete with all 5 research tasks resolved
- [ ] data-model.md complete with Conversation and Message schemas
- [ ] contracts/chat-api.yaml complete with OpenAPI spec
- [ ] contracts/mcp-tools.yaml complete with all 5 tool schemas
- [ ] contracts/agent-behavior.md complete with interaction patterns
- [ ] quickstart.md complete with setup instructions
- [ ] Constitution Check re-validated (no violations)
- [ ] All design decisions documented with rationale
- [ ] Performance targets defined and achievable
- [ ] Security considerations addressed

### Next Steps

After Phase 2 validation passes:

1. **Run `/sp.tasks`** to generate atomic task breakdown from this plan
2. **Review tasks.md** for completeness and dependency order
3. **Begin implementation** following TDD (Red-Green-Refactor) cycle
4. **Track progress** through task completion
5. **Validate against spec** at each milestone

### Implementation Order (High-Level)

1. **Foundation**: Database migrations (conversations, messages tables)
2. **MCP Layer**: Implement 5 stateless tools with database operations
3. **Service Layer**: ConversationService for CRUD operations
4. **AI Layer**: AIAgentOrchestrator with OpenRouter configuration
5. **API Layer**: Update chat router with complete integration
6. **Testing**: Unit, integration, and behavior tests
7. **Documentation**: API docs, setup guides, troubleshooting

---

## Risk Assessment

### High-Priority Risks

**R1: OpenRouter API Compatibility**
- **Risk**: OpenAI Agents SDK may not support custom base URLs
- **Mitigation**: Research phase validates compatibility; fallback to direct OpenAI SDK with OpenRouter wrapper
- **Impact**: High (blocks agent implementation)

**R2: MCP Tool Performance**
- **Risk**: Database queries in MCP tools may exceed 200ms target
- **Mitigation**: Database indexing, query optimization, connection pooling
- **Impact**: Medium (affects user experience)

**R3: Conversation Context Size**
- **Risk**: Large conversation histories may exceed LLM context window
- **Mitigation**: Limit to last 20 messages; implement context summarization if needed
- **Impact**: Medium (affects conversation continuity)

**R4: Agent Confirmation State**
- **Risk**: Stateless architecture complicates confirmation flow tracking
- **Mitigation**: Store pending confirmations in database with timeout
- **Impact**: Medium (affects user experience for destructive actions)

### Medium-Priority Risks

**R5: Tool Call Timeout**
- **Risk**: Multiple tool calls may exceed 15-second timeout
- **Mitigation**: Optimize tool performance; implement timeout handling with partial results
- **Impact**: Low (rare edge case)

**R6: Concurrent Request Handling**
- **Risk**: Race conditions in conversation updates
- **Mitigation**: Database transactions with proper locking
- **Impact**: Low (affects concurrent users only)

---

## Success Criteria Mapping

| Success Criterion (from spec.md) | Implementation Component | Validation Method |
|----------------------------------|-------------------------|-------------------|
| SC-001: 90% intent accuracy | AIAgentOrchestrator + MCP tools | Behavior tests with intent samples |
| SC-002: <500ms context reconstruction | ConversationService | Performance tests with 50-message conversations |
| SC-003: 100% data persistence | Database migrations + SQLModel | Restart tests with data verification |
| SC-004: 100% confirmation prompts | Agent behavior logic | Behavior tests for destructive actions |
| SC-005: 100% tool call logging | Message.tool_calls JSON field | Database inspection after tool calls |
| SC-006: 10+ concurrent requests | FastAPI + database transactions | Load tests with concurrent clients |
| SC-007: 100% user-friendly errors | Error handling in all layers | Error scenario tests |
| SC-008: Stateless architecture | No in-memory state | Code review + restart tests |
| SC-009: Tool call transparency | tool_calls in ChatResponse | API response validation |
| SC-010: <3s agent response | OpenRouter + MCP optimization | Performance tests under load |

---

## Appendix: Technology Stack Summary

### Required Dependencies (requirements.txt updates)

```text
# Existing dependencies (maintained)
fastapi>=0.100.0
uvicorn[standard]>=0.23.0
sqlmodel>=0.0.14
alembic>=1.12.0
pydantic>=2.0.0
psycopg2-binary>=2.9.0
python-jose[cryptography]>=3.3.0
passlib[bcrypt]>=1.7.4
python-multipart>=0.0.6

# NEW: Phase III AI/Agent dependencies
openai>=1.0.0                    # OpenAI Agents SDK
mcp>=0.1.0                       # MCP SDK for Python
httpx>=0.24.0                    # HTTP client for OpenRouter
tenacity>=8.2.0                  # Retry logic for API calls
```

### Environment Variables

```bash
# Existing (maintained)
DATABASE_URL=postgresql://user:pass@host:5432/dbname
JWT_SECRET_KEY=your-secret-key
CORS_ORIGINS=http://localhost:3000

# NEW: Phase III
OPENROUTER_API_KEY=sk-or-v1-...           # OpenRouter API key (NOT OPENAI_API_KEY)
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
AGENT_MODEL=google/gemini-2.0-flash-exp   # Recommended model via OpenRouter
AGENT_TIMEOUT=15                          # Agent processing timeout (seconds)
CONVERSATION_HISTORY_LIMIT=20             # Max messages for context
```

---

## Plan Completion

This implementation plan is complete and ready for task breakdown via `/sp.tasks`.

**Next Command**: `/sp.tasks` to generate atomic task list from this plan.
