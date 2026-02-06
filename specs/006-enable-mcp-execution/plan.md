# Implementation Plan: Enable Real MCP Tool Execution in AI Todo Assistant

**Branch**: `006-enable-mcp-execution` | **Date**: 2026-02-03 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/006-enable-mcp-execution/spec.md`

## Summary

Enable the AI Todo Assistant to execute real MCP (Model Context Protocol) tools instead of simulating responses. The agent will perform actual database operations for task management (create, list, update, delete) through stateless MCP tools, with all operations persisting to the database and being immediately visible in the UI. This implementation uses OpenAI Agents SDK configured for OpenRouter API with a free non-Gemini model (Mistral or Qwen), ensuring tool-based reasoning and complete conversation persistence.

## Technical Context

**Project Type**: Phase III Full-Stack Web Application with AI Agent

### Phase III AI Agent Architecture

**AI/Agent Layer**:
- Agent Framework: OpenAI Agents SDK
- LLM Provider: OpenRouter (NOT OpenAI directly)
- Model: Free non-Gemini model via OpenRouter (Mistral 7B or Qwen 2.5)
- Tool Protocol: MCP (Model Context Protocol)
- MCP SDK: Official Python MCP SDK
- Agent Configuration: OpenRouter-compatible base URL
- API Key: `OPENROUTER_API_KEY` environment variable

**Agent Requirements**:
- Stateless design (fetch conversation context from database)
- Tool-based reasoning (no direct database access)
- Natural language understanding for task operations
- Graceful error handling with user-friendly messages
- Confirmation prompts for destructive actions

**MCP Server Requirements**:
- Stateless tool design (no in-memory state)
- Database-backed operations (persist all changes)
- Structured input/output schemas
- Agent-only invocation (no direct frontend access)
- Four tools: add_task, list_tasks, update_task, delete_task

**Chat API Requirements**:
- RESTful endpoints for conversation management
- Message persistence (user and agent messages)
- Tool call tracking
- Conversation history retrieval
- Streaming response support

### Phase II Full-Stack Web Application (maintained)

**Frontend**:
- Framework: Next.js 15+ with App Router
- UI Library: React 19+ with hooks
- Language: TypeScript 5+ (strict mode)
- Styling: Tailwind CSS 3+
- State Management: React hooks, Context API
- HTTP Client: fetch API
- Chat UI: Existing chat components (no routing changes)
- Deployment: Vercel

**Backend**:
- Framework: FastAPI 0.100+
- Language: Python 3.13+
- Validation: Pydantic v2
- ORM: SQLModel (SQLAlchemy + Pydantic)
- Migrations: Alembic
- Documentation: OpenAPI/Swagger (auto-generated)
- Deployment: Railway or Render

**Database**:
- Database: Neon PostgreSQL (serverless)
- ORM: SQLModel
- Migrations: Alembic
- Primary Keys: Auto-increment integers
- Relationships: Foreign keys with CASCADE/RESTRICT

**Testing**:
- Frontend: Jest, React Testing Library
- Backend: pytest, FastAPI TestClient
- E2E: Playwright
- API: Contract tests with OpenAPI validation

### Performance Goals

- Agent response latency: <3 seconds for 95% of requests
- MCP tool execution: <500ms per tool call
- Chat API endpoints: <200ms p95 (excluding agent processing)
- Database queries: <100ms p95
- Streaming response: First token within 1 second

### Constraints

- No Gemini models (use Mistral 7B or Qwen 2.5 via OpenRouter)
- No UI routing changes (use existing chat interface)
- Backend must remain stateless (no in-memory conversation state)
- All operations must persist to database
- Agent must use MCP tools exclusively (no direct database access)
- Conversation context loaded from database per request

### Scale/Scope

- Support: 100+ concurrent users
- Conversations: Unlimited per user
- Messages: Unlimited per conversation
- Tool calls: Track all invocations for audit
- Database: Neon PostgreSQL free tier initially

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Phase III Requirements (Initial Check - Before Phase 0)

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
- ⚠️ Model constraint: Using Mistral/Qwen instead of recommended Gemini (user requirement)

**Initial Constitution Check Status**: ✅ PASSED (with noted model constraint)

---

### Phase III Requirements (Re-check - After Phase 1 Design)

- ✅ Uses approved AI/Agent stack (OpenAI Agents SDK, OpenRouter, MCP)
  - **Design**: OpenAI SDK configured with OpenRouter base URL
  - **Model**: Mistral 7B Instruct via OpenRouter
  - **Tools**: Python functions with OpenAI function calling format

- ✅ OpenRouter API integration (NOT direct OpenAI API)
  - **Design**: base_url="https://openrouter.ai/api/v1"
  - **Research**: Confirmed OpenAI-compatible API

- ✅ `OPENROUTER_API_KEY` environment variable (NOT `OPENAI_API_KEY`)
  - **Design**: Environment variable documented in quickstart
  - **Config**: API key passed to OpenAI client

- ✅ MCP Server with stateless, database-backed tools
  - **Design**: 4 tools (add_task, list_tasks, update_task, delete_task)
  - **Architecture**: Database session passed per request
  - **Contracts**: Detailed tool specifications in mcp-tools.yaml

- ✅ Agent uses MCP tools for ALL task operations (no direct DB access)
  - **Design**: Agent service executes tools and returns results
  - **Pattern**: Tool execution → database operation → structured response
  - **Validation**: No direct database access from agent logic

- ✅ Stateless backend (no in-memory conversation state)
  - **Design**: Conversation context loaded from database per request
  - **Pattern**: load_conversation_history() fetches from database
  - **Verification**: No session state, restart-safe

- ✅ Conversation persistence (database-backed)
  - **Schema**: conversations, messages, tool_calls tables
  - **Migrations**: 003, 004, 005 defined
  - **Relationships**: Proper foreign keys with cascade delete

- ✅ Message and tool call tracking
  - **Design**: Messages table stores all user/agent messages
  - **Design**: ToolCalls table tracks all tool invocations
  - **Audit**: Complete audit trail for debugging

- ✅ Agent behavior contract (confirmations, error handling, no hallucinations)
  - **Design**: Tool execution with result feedback loop
  - **Pattern**: Agent receives actual tool results before responding
  - **Confirmations**: Delete operations require user confirmation

- ✅ Chat API endpoints for conversation management
  - **Contract**: chat-api.yaml with 5 endpoints
  - **OpenAPI**: Full API specification with schemas
  - **Documentation**: Swagger auto-generated

- ✅ No manual coding (Claude generates all code)
  - **Process**: Spec → Plan → Tasks → Implementation
  - **Validation**: All code generated from approved specifications

- ✅ Phase III specifications required
  - **Created**: research.md, data-model.md, contracts/, quickstart.md
  - **Pending**: agent.md, mcp-tools.md, chat-api.md (detailed specs - can be derived from contracts)

### Phase II Requirements (maintained)

- ✅ Uses approved technology stack (Next.js, FastAPI, Neon)
  - **Design**: Builds on existing Phase II stack
  - **No changes**: Frontend and backend frameworks unchanged

- ✅ API-first architecture (Frontend → API → Database)
  - **Design**: Chat API follows REST conventions
  - **Pattern**: Frontend → Chat API → Agent → MCP → Database

- ✅ Frontend-backend separation (no direct DB access from frontend)
  - **Design**: Frontend calls chat API only
  - **Validation**: No database imports in frontend code

- ✅ Persistent storage (Neon PostgreSQL, not in-memory)
  - **Design**: All data persists to Neon PostgreSQL
  - **Migrations**: Alembic migrations for new tables

- ✅ No Phase I patterns (in-memory, CLI, positional indexes)
  - **Design**: Database-backed with auto-increment IDs
  - **Validation**: No in-memory lists or positional indexes

- ✅ Database migrations with Alembic
  - **Design**: 3 new migrations (003, 004, 005)
  - **Pattern**: Standard Alembic migration format

- ✅ OpenAPI/Swagger documentation
  - **Design**: chat-api.yaml with full OpenAPI 3.0 spec
  - **Auto-gen**: FastAPI generates Swagger UI

- ✅ Proper error handling and validation
  - **Design**: Structured error responses in all tools
  - **Pattern**: Try-catch with rollback, no exceptions to agent

### Phase I Requirements

- N/A (Phase I deprecated for new features)

**Final Constitution Check Status**: ✅ PASSED

**Design Validation**: All Phase III requirements met with complete specifications and contracts. Ready for task breakdown.

## Project Structure

### Documentation (this feature)

```text
specs/006-enable-mcp-execution/
├── spec.md                    # Feature specification (completed)
├── plan.md                    # This file (in progress)
├── research.md                # Phase 0 output (to be created)
├── data-model.md              # Phase 1 output (to be created)
├── quickstart.md              # Phase 1 output (to be created)
├── contracts/                 # Phase 1 output (to be created)
│   ├── chat-api.yaml         # Chat API OpenAPI spec
│   └── mcp-tools.yaml        # MCP tool contracts
├── checklists/
│   └── requirements.md        # Spec quality checklist (completed)
└── tasks.md                   # Phase 2 output (NOT created by /sp.plan)
```

### Source Code (repository root)

```text
api/                          # FastAPI backend
├── src/
│   ├── ai/                   # AI agent integration (NEW)
│   │   ├── __init__.py
│   │   ├── agent.py         # OpenAI Agents SDK setup
│   │   ├── config.py        # Agent configuration
│   │   └── runner.py        # Agent execution logic
│   ├── mcp/                  # MCP Server (NEW)
│   │   ├── __init__.py
│   │   ├── server.py        # MCP server initialization
│   │   ├── tools/           # MCP tool implementations
│   │   │   ├── __init__.py
│   │   │   ├── add_task.py
│   │   │   ├── list_tasks.py
│   │   │   ├── update_task.py
│   │   │   └── delete_task.py
│   │   └── schemas.py       # Tool input/output schemas
│   ├── models/              # SQLModel database models (EXISTING + NEW)
│   │   ├── conversation.py  # NEW: Conversation model
│   │   ├── message.py       # NEW: Message model
│   │   └── todo.py          # EXISTING: Todo model
│   ├── schemas/             # Pydantic request/response models (EXISTING + NEW)
│   │   ├── chat.py          # NEW: Chat API schemas
│   │   └── todo.py          # EXISTING: Todo schemas
│   ├── routers/             # API endpoints (EXISTING + NEW)
│   │   ├── chat.py          # NEW: Chat API endpoints
│   │   └── todos.py         # EXISTING: Todo endpoints
│   ├── services/            # Business logic (NEW)
│   │   ├── conversation.py  # Conversation management
│   │   └── agent_service.py # Agent orchestration
│   ├── database.py          # Database connection (EXISTING)
│   ├── dependencies.py      # FastAPI dependencies (EXISTING)
│   └── main.py              # FastAPI app (EXISTING - to be updated)
├── alembic/                 # Database migrations
│   └── versions/
│       ├── 003_create_conversations_table.py  # NEW
│       ├── 004_create_messages_table.py       # NEW
│       └── 005_create_tool_calls_table.py     # NEW (optional)
├── tests/
│   ├── test_ai/             # NEW: Agent tests
│   ├── test_mcp/            # NEW: MCP tool tests
│   ├── test_api/            # EXISTING: API endpoint tests
│   └── test_services/       # NEW: Service tests
├── requirements.txt         # Python dependencies (to be updated)
└── .env.example             # Environment variables (to be updated)

web/                          # Next.js frontend
├── src/
│   ├── app/
│   │   └── chat/            # EXISTING: Chat pages (no routing changes)
│   ├── components/
│   │   └── chat/            # EXISTING: Chat UI components (to be updated)
│   ├── lib/
│   │   └── api/
│   │       └── chat.ts      # EXISTING: Chat API client (to be updated)
│   └── types/
│       └── chat.ts          # EXISTING: Chat types (to be updated)
└── tests/
    └── e2e/
        └── chat.spec.ts     # NEW: E2E chat tests
```

**Structure Decision**: Phase III AI Agent Architecture with Phase II foundations maintained. New AI/Agent layer and MCP Server added to existing FastAPI backend. Frontend chat components updated to display tool execution results without routing changes.

## Complexity Tracking

> **No violations requiring justification**

All implementation follows approved Phase III architecture with no deviations from constitution requirements.

## Phase 0: Research & Discovery

### Research Questions

1. **OpenAI Agents SDK with OpenRouter Integration**
   - How to configure Agents SDK to use OpenRouter base URL instead of OpenAI?
   - What are the API compatibility requirements between OpenAI and OpenRouter?
   - How to pass `OPENROUTER_API_KEY` to the Agents SDK?

2. **Free Non-Gemini Model Selection**
   - Which free models on OpenRouter support tool calling (Mistral 7B vs Qwen 2.5)?
   - What are the tool calling capabilities and limitations of each model?
   - What are the latency and reliability characteristics?

3. **MCP SDK Integration**
   - How to initialize MCP server in FastAPI application?
   - How to register MCP tools with proper schemas?
   - How to pass MCP tools to OpenAI Agents SDK?

4. **Tool Execution Flow**
   - How does the agent request tool execution?
   - How to capture tool results and return them to the agent?
   - How to handle tool execution errors gracefully?

5. **Conversation Persistence**
   - What database schema is needed for conversations, messages, and tool calls?
   - How to load conversation context before each agent request?
   - How to persist agent responses and tool calls after execution?

6. **Streaming Responses**
   - Does OpenAI Agents SDK support streaming with OpenRouter?
   - How to stream agent responses to the frontend?
   - How to handle tool execution during streaming?

### Research Tasks

**Task 1: OpenRouter + Agents SDK Integration**
- Research OpenAI Agents SDK documentation for custom base URL configuration
- Identify OpenRouter API endpoint format and authentication
- Document configuration pattern for `OPENROUTER_API_KEY`
- Verify API compatibility between OpenAI and OpenRouter

**Task 2: Model Selection and Tool Calling**
- Compare Mistral 7B and Qwen 2.5 tool calling capabilities on OpenRouter
- Test tool calling with sample MCP tools
- Document model selection rationale
- Identify any model-specific limitations

**Task 3: MCP Server Architecture**
- Research MCP SDK Python implementation
- Design stateless tool architecture with database access
- Document tool registration and schema definition patterns
- Identify error handling best practices

**Task 4: Agent-MCP Integration**
- Research how to pass MCP tools to OpenAI Agents SDK
- Document tool invocation flow (agent → MCP → database → response)
- Identify tool result format requirements
- Design error propagation strategy

**Task 5: Database Schema Design**
- Design Conversations table (id, user_id, created_at, updated_at)
- Design Messages table (id, conversation_id, role, content, created_at)
- Design ToolCalls table (id, message_id, tool_name, input, output, status, created_at)
- Document relationships and constraints

**Task 6: Streaming Implementation**
- Research FastAPI streaming response patterns
- Investigate OpenAI Agents SDK streaming support with OpenRouter
- Design streaming architecture for chat API
- Document fallback strategy if streaming not supported

### Expected Outputs

- `research.md` with all findings and decisions
- Model selection rationale (Mistral vs Qwen)
- OpenRouter configuration pattern
- MCP tool architecture design
- Database schema design
- Streaming implementation strategy

## Phase 1: Design & Contracts

### Data Model Design

**File**: `data-model.md`

**Entities**:

1. **Conversation** (NEW)
   - id: Integer (primary key, auto-increment)
   - user_id: Integer (foreign key to users table)
   - created_at: DateTime
   - updated_at: DateTime
   - Relationships: Has many Messages

2. **Message** (NEW)
   - id: Integer (primary key, auto-increment)
   - conversation_id: Integer (foreign key to conversations)
   - role: String (enum: "user", "assistant")
   - content: Text
   - created_at: DateTime
   - Relationships: Belongs to Conversation, Has many ToolCalls

3. **ToolCall** (NEW - optional for Phase 1)
   - id: Integer (primary key, auto-increment)
   - message_id: Integer (foreign key to messages)
   - tool_name: String
   - tool_input: JSON
   - tool_output: JSON
   - status: String (enum: "success", "error")
   - created_at: DateTime
   - Relationships: Belongs to Message

4. **Todo** (EXISTING - no changes)
   - id: Integer (primary key)
   - user_id: Integer (foreign key)
   - title: String
   - description: Text (optional)
   - status: String (enum: "pending", "completed")
   - created_at: DateTime
   - updated_at: DateTime

### API Contracts

**File**: `contracts/chat-api.yaml` (OpenAPI 3.0)

**Endpoints**:

1. **POST /api/v1/chat/conversations**
   - Purpose: Create new conversation
   - Request: `{ user_id: int }`
   - Response: `{ conversation_id: int, created_at: string }`
   - Status: 201 Created

2. **GET /api/v1/chat/conversations/{conversation_id}**
   - Purpose: Get conversation history
   - Response: `{ conversation_id: int, messages: Message[] }`
   - Status: 200 OK, 404 Not Found

3. **POST /api/v1/chat/conversations/{conversation_id}/messages**
   - Purpose: Send message and get agent response
   - Request: `{ content: string }`
   - Response: `{ message_id: int, role: "assistant", content: string, tool_calls: ToolCall[] }`
   - Status: 200 OK, 404 Not Found, 500 Internal Server Error
   - Streaming: Optional (if supported)

**File**: `contracts/mcp-tools.yaml` (MCP Tool Contracts)

**Tools**:

1. **add_task**
   - Purpose: Create a new todo task
   - Input: `{ title: string, description?: string, user_id: int }`
   - Output: `{ task_id: int, title: string, status: string }`
   - Errors: `{ error: string, code: string }`

2. **list_tasks**
   - Purpose: List all tasks for a user
   - Input: `{ user_id: int, status?: "pending" | "completed" | "all" }`
   - Output: `{ tasks: Task[] }`
   - Errors: `{ error: string, code: string }`

3. **update_task**
   - Purpose: Update an existing task
   - Input: `{ task_id: int, user_id: int, title?: string, description?: string, status?: string }`
   - Output: `{ task_id: int, title: string, status: string }`
   - Errors: `{ error: string, code: "not_found" | "permission_denied" | "validation_error" }`

4. **delete_task**
   - Purpose: Delete a task
   - Input: `{ task_id: int, user_id: int }`
   - Output: `{ success: boolean, task_id: int }`
   - Errors: `{ error: string, code: "not_found" | "permission_denied" }`

### Quickstart Guide

**File**: `quickstart.md`

**Contents**:
1. Prerequisites (Python 3.13+, Node.js 18+, Neon PostgreSQL)
2. Environment setup (`OPENROUTER_API_KEY`, `DATABASE_URL`)
3. Backend setup (install dependencies, run migrations, start server)
4. Frontend setup (install dependencies, configure API URL, start dev server)
5. Testing the agent (example chat interactions)
6. Verification steps (check database for persisted data)

### Agent Context Update

Run `.specify/scripts/powershell/update-agent-context.ps1 -AgentType claude` to update agent-specific context with:
- OpenAI Agents SDK
- MCP SDK
- OpenRouter integration
- Mistral/Qwen model usage
- Conversation persistence patterns

## Phase 2: Task Breakdown

**Note**: Task breakdown is performed by the `/sp.tasks` command, NOT by `/sp.plan`. This section documents the expected task categories for reference.

### Expected Task Categories

1. **Database Migrations**
   - Create conversations table
   - Create messages table
   - Create tool_calls table (optional)

2. **MCP Server Implementation**
   - Initialize MCP server
   - Implement add_task tool
   - Implement list_tasks tool
   - Implement update_task tool
   - Implement delete_task tool
   - Write tool contract tests

3. **Agent Integration**
   - Configure OpenAI Agents SDK with OpenRouter
   - Implement agent runner with MCP tools
   - Implement conversation context loading
   - Implement agent response persistence
   - Write agent behavior tests

4. **Chat API Implementation**
   - Implement create conversation endpoint
   - Implement get conversation history endpoint
   - Implement send message endpoint
   - Implement streaming response (if supported)
   - Write API contract tests

5. **Frontend Updates**
   - Update chat API client for new endpoints
   - Update chat UI to display tool execution results
   - Add loading states for agent processing
   - Add error handling for agent failures
   - Write E2E tests

6. **Integration & Testing**
   - End-to-end agent flow testing
   - Tool execution verification
   - Conversation persistence testing
   - Error handling testing
   - Performance testing

## Implementation Notes

### Critical Path

1. Research OpenRouter + Agents SDK integration (Phase 0)
2. Select and test free model (Mistral vs Qwen) (Phase 0)
3. Design and create database schema (Phase 1)
4. Implement MCP server with tools (Phase 2)
5. Integrate agent with MCP tools (Phase 2)
6. Implement chat API endpoints (Phase 2)
7. Update frontend to display tool results (Phase 2)
8. End-to-end testing and verification (Phase 2)

### Risk Mitigation

**Risk 1: OpenRouter API Compatibility**
- Mitigation: Test API compatibility early in Phase 0
- Fallback: Document any API differences and implement adapters

**Risk 2: Free Model Tool Calling Limitations**
- Mitigation: Test both Mistral and Qwen tool calling capabilities
- Fallback: Use model with best tool calling support, document limitations

**Risk 3: Streaming Not Supported**
- Mitigation: Design non-streaming fallback from the start
- Fallback: Return complete responses without streaming

**Risk 4: Agent Hallucination**
- Mitigation: Strict tool-only architecture, no direct database access
- Fallback: Implement validation layer to verify tool results

### Success Metrics

- Agent successfully executes MCP tools in 100% of valid requests
- Tasks created via chat appear in database within 1 second
- Task list retrieved via chat matches database state with 100% accuracy
- Agent response latency <3 seconds for 95% of requests
- Zero simulated responses (all operations use real MCP tools)
- Conversation history persists across sessions
- All tool invocations logged for audit

## Next Steps

1. Execute Phase 0 research (create `research.md`)
2. Execute Phase 1 design (create `data-model.md`, `contracts/`, `quickstart.md`)
3. Update agent context with new technologies
4. Re-validate Constitution Check after design
5. Proceed to `/sp.tasks` for task breakdown
