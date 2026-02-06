<!--
Sync Impact Report:
- Version change: 2.0.0 → 3.0.0 (MAJOR - Phase III AI Agent Architecture)
- Modified principles:
  - Principle II: "Phase II Integrity" → "Phase III Integrity" (AI Agent + MCP architecture)
  - Principle VI: "Technology Stack Compliance" → expanded with AI framework requirements
- Added sections:
  - AI Framework & API Key Constraint (new Principle X)
  - MCP Architecture Requirement (new Principle XI)
  - Stateless Backend Rule (new Principle XII)
  - Agent Behavior Contract (new Principle XIII)
  - Folder Ownership & Review Policy (new section)
  - Phase III Objective (new section)
  - Phase III Technology Stack (AI/Agent layer)
  - Phase III Documentation Requirements (agent.md, mcp-tools.md, chat-api.md, etc.)
- Removed sections:
  - None (Phase III builds on Phase II)
- Templates requiring updates:
  - .specify/templates/spec-template.md ⚠ pending (add AI agent, MCP, chat API sections)
  - .specify/templates/plan-template.md ⚠ pending (add Phase III architecture sections)
  - .specify/templates/tasks-template.md ⚠ pending (add Phase III task categories: agent, MCP, chat)
  - .specify/templates/commands/*.md ⚠ pending (update for Phase III context)
- Follow-up TODOs:
  - Update all templates to reflect Phase III requirements
  - Create Phase III implementation guidelines
  - Review backend code for AI agent integration points
  - Validate MCP server architecture against constitution
-->
# Phase III Constitution - Todo AI Chatbot (Agentic + MCP Architecture)

## Core Principles

### I. Spec-Driven Development
All implementation must strictly follow approved specifications. No implementation without proper specification and planning. This ensures traceability and prevents scope creep. Every feature must have a complete specification (spec.md), implementation plan (plan.md), and task breakdown (tasks.md) before any code is written.

**Agentic Dev Stack Enforcement**: Claude MUST follow this order strictly:
1. Write **formal specifications**
2. Generate **implementation plan**
3. Break plan into **atomic tasks**
4. Implement tasks via **Claude Code**
5. Review outputs against spec

⚠️ Skipping or merging steps is NOT allowed.

### II. Phase III Integrity
Phase III introduces **stateless, AI-powered Todo Chatbot** architecture with agent orchestration. The application MUST use:

**Frontend** (Phase II - maintained):
- Next.js 15+ with React 19+, TypeScript 5+, and Tailwind CSS 3+
- OpenAI ChatKit UI for chat interface
- Stateless chat client with auth integration

**Backend** (Phase II + Phase III):
- FastAPI 0.100+ with Python 3.13+, Pydantic v2, and SQLModel
- **OpenAI Agents SDK** (MANDATORY framework for AI agent)
- **MCP (Model Context Protocol) Server** for tool exposure
- Stateless architecture with database-backed conversation memory

**Database** (Phase II - maintained):
- Neon PostgreSQL (serverless) for all persistent storage
- Conversation and message persistence
- Tool call history tracking

**AI/Agent Layer** (Phase III - NEW):
- OpenAI Agents SDK configured for OpenRouter API
- MCP Server exposing stateless, database-backed task tools
- Natural language task management via AI agent
- Tool-based reasoning and agent orchestration

Phase III explicitly **FORBIDS**:
- Manual coding by humans (Claude generates ALL code)
- Direct OpenAI API usage (use OpenRouter instead)
- In-memory agent state (use database for conversations)
- Direct database access by agent logic (use MCP tools only)
- Hallucinated task state (agent must use MCP tools)
- Phase I patterns (in-memory storage, CLI, positional indexes)

### III. Reusability and Extension
Design must support future phases (Phase IV+) through:
- API versioning strategy (v1, v2, etc.)
- Database migration support with Alembic
- Modular architecture enabling feature additions
- Clear contracts between layers (frontend ↔ API ↔ agent ↔ MCP ↔ database)
- Backward compatibility within major API versions
- Agent behavior extensibility through MCP tool additions

### IV. Determinism and Testability
All components must be predictable and testable:
- **API**: Contract tests for all endpoints with OpenAPI/Swagger documentation
- **Database**: Transactional operations with rollback support
- **Frontend**: Unit tests for components, integration tests for user flows
- **Agent**: Behavior tests for tool invocation and error handling
- **MCP Server**: Tool contract tests with stateless guarantees
- **End-to-End**: Critical user journeys tested across all layers including AI agent
- All features must have clear, testable acceptance criteria

### V. Test-First Development (NON-NEGOTIABLE)
TDD remains mandatory across all layers:
- **API**: Write OpenAPI spec → Write tests → Implement endpoints → Tests pass → Refactor
- **Frontend**: Write component tests → Implement components → Tests pass → Refactor
- **Database**: Write schema tests → Create migrations → Tests pass → Refactor
- **Agent**: Write behavior tests → Implement agent logic → Tests pass → Refactor
- **MCP Server**: Write tool contract tests → Implement tools → Tests pass → Refactor
- Red-Green-Refactor cycle strictly enforced at every layer

### VI. Technology Stack Compliance
Phase III requires specific technologies to ensure consistency and quality:

**Approved Frontend Stack** (Phase II - maintained):
- Next.js 15+ (React framework with SSR/SSG)
- React 19+ (UI library)
- TypeScript 5+ (type safety)
- Tailwind CSS 3+ (styling)
- OpenAI ChatKit (chat UI components)

**Approved Backend Stack** (Phase II + Phase III):
- FastAPI 0.100+ (Python web framework)
- Python 3.13+ (language)
- Pydantic v2 (validation)
- SQLModel (ORM combining SQLAlchemy + Pydantic)
- **OpenAI Agents SDK** (AI agent framework)
- **MCP SDK** (Model Context Protocol server)

**Approved Database** (Phase II - maintained):
- Neon PostgreSQL (serverless, managed)
- Alembic (migrations)

**Approved AI/Agent Stack** (Phase III - NEW):
- OpenAI Agents SDK (agent orchestration framework)
- OpenRouter API (LLM provider - NOT OpenAI directly)
- MCP SDK (tool protocol implementation)
- Gemini models via OpenRouter (recommended LLM)

**Prohibited**:
- Manual coding by humans (Claude generates ALL code)
- Direct OpenAI API usage (use OpenRouter with compatible base URL)
- `OPENAI_API_KEY` environment variable (use `OPENROUTER_API_KEY`)
- In-memory agent state (use database)
- Direct database access from agent logic (use MCP tools)
- Phase I patterns (in-memory storage, CLI interfaces, positional indexes)
- Unapproved frameworks or libraries without ADR justification

### VII. API-First Architecture
All data operations MUST go through the REST API layer:
- **Frontend → API → Database** (never Frontend → Database)
- **Frontend → Chat API → Agent → MCP Server → Database** (Phase III chat flow)
- RESTful conventions (resource-based URLs, proper HTTP methods)
- JSON-only communication for all requests and responses
- Proper HTTP status codes (200, 201, 400, 404, 422, 500)
- Request/response validation with Pydantic models
- OpenAPI/Swagger documentation auto-generated
- Framework-agnostic design (no frontend coupling)
- Stateless communication (no server-side sessions)

### VIII. Frontend-Backend Separation
Clear separation of concerns between layers:
- **Frontend**: Presentation, user interaction, client-side state, chat UI
- **Backend**: Business logic, data validation, database operations, agent orchestration
- **Agent**: Natural language understanding, tool invocation, conversation management
- **MCP Server**: Tool exposure, stateless operations, database interaction
- **Database**: Data persistence, integrity constraints, relationships

**Frontend MUST**:
- Communicate with backend exclusively via REST API
- Use ChatKit for chat interface
- Handle loading, error, and success states for all operations
- Validate user input before API submission
- Never import database models, agent logic, or MCP code

**Backend MUST**:
- Expose REST API endpoints for all data operations
- Expose chat API for agent interactions
- Validate all inputs with Pydantic models
- Handle database transactions and error recovery
- Orchestrate agent via OpenAI Agents SDK
- Never render HTML or frontend-specific responses

**Agent MUST**:
- Use MCP tools for ALL task operations
- Never access database directly
- Handle errors gracefully with user-friendly messages
- Confirm user actions before execution
- Never hallucinate task state

**MCP Server MUST**:
- Expose stateless, database-backed tools
- Be callable by AI agent only
- Validate all tool inputs
- Return structured responses
- Handle database operations transactionally

**Database MUST**:
- Enforce data integrity with constraints and foreign keys
- Use migrations for all schema changes
- Support concurrent access with proper locking
- Persist conversations, messages, and tool calls

### IX. Data Integrity and Security
Phase III maintains Phase II security with additional agent-specific requirements:

**Data Integrity**:
- All data persisted to Neon PostgreSQL
- Foreign key constraints enforced
- Database migrations version-controlled with Alembic
- Transactional operations with rollback on error
- Data survives application restarts
- Conversation history persisted across sessions
- Tool call history tracked for debugging

**Security**:
- Environment variables for secrets (never commit .env files)
- `OPENROUTER_API_KEY` for AI agent (NOT `OPENAI_API_KEY`)
- CORS configuration for API (restrict origins in production)
- Input validation on frontend, backend, and MCP tools
- SQL injection prevention through ORM usage (SQLModel)
- XSS prevention through React auto-escaping
- Proper error handling (no sensitive data in error messages)
- Agent prompt injection prevention
- Tool access control (agent-only invocation)

### X. AI Framework & API Key Constraint

**Framework**: OpenAI Agents SDK (MANDATORY)
**API Provider**: OpenRouter (NOT OpenAI directly)

Claude MUST:
- Configure Agents SDK to use OpenRouter-compatible base URL
- Accept OpenRouter API key via `OPENROUTER_API_KEY` environment variable
- Never assume OpenAI-paid API key exists
- Use Gemini models via OpenRouter (recommended)
- Document API key configuration in setup guides

**Prohibited**:
- ❌ `OPENAI_API_KEY` environment variable
- ❌ Direct OpenAI API usage
- ❌ Hardcoded API keys
- ✅ **Use instead**: `OPENROUTER_API_KEY` with OpenRouter base URL

### XI. MCP Architecture Requirement

Claude MUST implement:
- Official MCP SDK for Python
- MCP Server exposing task management tools
- Stateless tool design (no in-memory state)
- Database-backed tool operations
- Agent-only tool invocation (no direct frontend access)

**MCP Tools MUST be**:
- Stateless (fetch state from database on every call)
- Database-backed (persist all changes)
- Callable by AI agent only (not exposed to frontend)
- Well-documented with input/output schemas
- Error-handling with structured responses

**Direct DB access by agent logic is FORBIDDEN**. All database operations MUST go through MCP tools.

### XII. Stateless Backend Rule

FastAPI server MUST:
- Hold **no in-memory state** for conversations or agent context
- Fetch conversation history from database on every request
- Persist all data to database:
  - Conversations (user sessions)
  - Messages (user and agent messages)
  - Tool calls (agent tool invocations)
- Be restart-safe without data loss
- Support horizontal scaling (multiple instances)

**Prohibited**:
- ❌ In-memory conversation storage
- ❌ Session-based agent state
- ❌ Cached conversation history
- ✅ **Use instead**: Database queries for all state retrieval

### XIII. Agent Behavior Contract

AI Agent MUST:
- Use MCP tools for ALL task operations (create, read, update, delete, list)
- NEVER hallucinate task state or make up task data
- Always confirm user actions before execution (e.g., "Delete task X?")
- Handle errors gracefully with user-friendly messages
- Provide clear feedback for successful operations
- Handle edge cases (task not found, invalid input, database errors)
- Maintain conversation context across messages
- Follow natural language conventions (friendly, helpful tone)

**Prohibited Agent Behaviors**:
- ❌ Direct database access
- ❌ Hallucinating task data
- ❌ Executing destructive actions without confirmation
- ❌ Exposing technical error details to users
- ❌ Ignoring tool errors

### XIV. Folder Ownership & Review Policy

Claude MUST respect project boundaries:

**`/api` (Backend)**:
- FastAPI application
- OpenAI Agents SDK integration
- MCP Server implementation
- Database models (SQLModel)
- Chat API endpoints
- Conversation and message persistence

**`/web` (Frontend)**:
- Next.js application
- OpenAI ChatKit UI
- Stateless chat client
- Auth integration
- Todo UI components

**Review Requirements**:
Claude MUST:
- Review existing backend + frontend code before Phase III implementation
- Identify architectural or spec violations
- Fix violations ONLY through generated code (no advice-only answers)
- Ensure Phase II foundations remain intact
- Validate Phase III additions align with constitution

### XV. Spec-First Documentation Requirement

All Phase III work MUST produce:

**Required Specifications**:
- `/specs/phase-iii/agent.md` - Agent behavior specification
- `/specs/phase-iii/mcp-tools.md` - MCP tool contracts
- `/specs/phase-iii/chat-api.md` - Chat API endpoints
- `/specs/phase-iii/database.md` - Conversation/message schema
- `/specs/phase-iii/architecture.md` - System architecture overview

**Code without matching spec = INVALID**.

Each specification MUST include:
- User stories and acceptance criteria
- API contracts (request/response models)
- Data models (database schema)
- Error handling strategies
- Test scenarios

## Phase III Objective

Build a **stateless, AI-powered Todo Chatbot** that allows users to manage tasks via **natural language**, using:

- OpenAI Agents SDK (framework)
- MCP (Model Context Protocol) Server
- Stateless FastAPI backend
- Persistent database-backed conversation memory

The system must demonstrate **tool-based reasoning**, **agent orchestration**, and **clean separation of concerns**.

## Phase III Technology Stack

### AI/Agent Layer (NEW)
- **Agent Framework**: OpenAI Agents SDK
- **LLM Provider**: OpenRouter (NOT OpenAI directly)
- **Recommended Model**: Gemini via OpenRouter
- **Tool Protocol**: MCP (Model Context Protocol)
- **MCP SDK**: Official Python MCP SDK
- **Agent Configuration**: OpenRouter-compatible base URL
- **API Key**: `OPENROUTER_API_KEY` environment variable

### Backend (Phase II + Phase III)
- **Framework**: FastAPI 0.100+
- **Language**: Python 3.13+
- **Validation**: Pydantic v2
- **ORM**: SQLModel (SQLAlchemy + Pydantic)
- **Migrations**: Alembic
- **Agent SDK**: OpenAI Agents SDK
- **MCP Server**: Official MCP SDK
- **Documentation**: OpenAPI/Swagger (auto-generated)
- **Deployment**: Railway, Render, or similar

### Frontend (Phase II - maintained)
- **Framework**: Next.js 15+ with App Router
- **UI Library**: React 19+ with hooks
- **Chat UI**: OpenAI ChatKit
- **Language**: TypeScript 5+ (strict mode enabled)
- **Styling**: Tailwind CSS 3+ (utility-first)
- **State Management**: React hooks, Context API
- **HTTP Client**: fetch API or axios
- **Deployment**: Vercel (recommended)

### Database (Phase II - maintained + Phase III extensions)
- **Database**: Neon PostgreSQL (serverless)
- **ORM**: SQLModel
- **Migrations**: Alembic
- **Primary Keys**: UUID or auto-increment integers
- **Relationships**: Foreign keys with CASCADE/RESTRICT
- **Indexes**: Strategic indexing for query performance
- **Phase III Tables**: Conversations, Messages, ToolCalls (NEW)

## Phase III Quality Standards

### Agent Design Standards
- Natural language understanding for task operations
- Tool-based reasoning (no direct database access)
- Graceful error handling with user-friendly messages
- Confirmation prompts for destructive actions
- Conversation context maintenance across messages
- Stateless design (fetch context from database)

### MCP Server Standards
- Stateless tool design (no in-memory state)
- Database-backed operations (persist all changes)
- Structured input/output schemas
- Comprehensive error responses
- Agent-only invocation (no direct frontend access)
- Tool contract documentation

### Chat API Standards
- RESTful endpoints for conversation management
- Streaming response support (if applicable)
- Conversation history retrieval
- Message persistence
- Tool call tracking
- Proper error responses

### Database Standards (Phase II + Phase III)
- SQLModel for all ORM operations
- Alembic for all schema migrations
- Proper indexing for query performance
- Foreign key constraints enforced
- No raw SQL unless justified in ADR
- Connection pooling and transaction management
- Database operations wrapped in try-except blocks
- Conversation and message persistence
- Tool call history tracking

### Security Standards (Phase II + Phase III)
- Environment variables for all secrets
- `OPENROUTER_API_KEY` for AI agent (NOT `OPENAI_API_KEY`)
- No hardcoded credentials or API keys
- CORS properly configured (no wildcard in production)
- Input validation on frontend, backend, and MCP tools
- SQL injection prevention through ORM
- XSS prevention through React auto-escaping
- Proper error handling (no stack traces to users)
- Agent prompt injection prevention
- Tool access control (agent-only)
- HTTPS in production

## Phase II Foundations (Maintained)

Phase III builds on Phase II foundations. All Phase II principles remain in effect:

### Phase II Architecture (Maintained)
- Full-stack web application (Next.js + FastAPI + Neon)
- Persistent database storage
- REST API for all data operations
- Responsive web UI (mobile, tablet, desktop)
- CRUD operations for todos
- Filtering, sorting, pagination
- Error handling and loading states
- Basic security (input validation, CORS)

### Phase II Deprecations (Still Enforced)
The following Phase I constraints remain **DEPRECATED** and MUST NOT be used:

**Deprecated Storage Patterns**:
- ❌ In-memory lists: `todos = []`
- ❌ In-memory dictionaries: `todos = {}`
- ❌ Session-based storage
- ❌ Data lost on restart
- ✅ **Use instead**: Neon PostgreSQL with SQLModel

**Deprecated Indexing Patterns**:
- ❌ Positional indexes: `todos[0]`, `todos[1]`
- ❌ List-based indexing
- ❌ Manual ID assignment based on list length
- ✅ **Use instead**: UUID or auto-increment primary keys

**Deprecated Interface Patterns**:
- ❌ CLI-only interfaces: `input()`, `print()`
- ❌ Terminal menus
- ❌ Console-based UI
- ✅ **Use instead**: Next.js web interface + ChatKit chat UI

## Phase III Scope

### Phase III Scope (In Scope)
- AI-powered chatbot for task management
- Natural language task operations (create, read, update, delete, list)
- OpenAI Agents SDK integration with OpenRouter
- MCP Server with stateless, database-backed tools
- Conversation persistence across sessions
- Message history tracking
- Tool call logging
- Chat API endpoints
- ChatKit UI integration
- Agent behavior specification
- MCP tool contracts
- Stateless backend architecture

### Phase III Boundaries (Out of Scope)
- Multi-agent systems → Phase IV+
- Advanced NLP features (sentiment analysis, intent classification) → Phase IV+
- Voice interface → Phase IV+
- Multi-language support → Phase IV+
- Agent learning/training → Phase IV+
- Custom LLM fine-tuning → Phase IV+
- Real-time collaboration → Phase IV+
- Advanced analytics on conversations → Phase IV+

## Success Criteria

### Phase III Completion Requires
- ✅ AI agent deployed and functional
- ✅ MCP Server exposing task tools
- ✅ Chat API documented and functional (OpenAPI/Swagger)
- ✅ Conversation persistence working (database-backed)
- ✅ ChatKit UI integrated with chat API
- ✅ Natural language task operations working end-to-end
- ✅ Agent uses MCP tools (no direct database access)
- ✅ Stateless backend (restart-safe)
- ✅ All Phase III specs complete (agent.md, mcp-tools.md, chat-api.md, etc.)
- ✅ Tests pass at all layers (unit, integration, e2e, agent behavior)
- ✅ No manual coding (Claude generated ALL code)
- ✅ OpenRouter API key configuration working
- ✅ Agent behavior meets contract (confirmations, error handling, no hallucinations)
- ✅ Code passes automated review for clean architecture
- ✅ Performance meets standards (API <500ms p95, agent response <3s)
- ✅ Security standards met (validation, CORS, no secrets in code, prompt injection prevention)

### Quality Gates
- All chat endpoints documented with OpenAPI
- All MCP tools have contract documentation
- All database operations use SQLModel
- All frontend components handle loading/error states
- No direct database access from agent logic
- No in-memory agent state (database-backed conversations)
- Agent uses MCP tools for all task operations
- No Phase I patterns (in-memory, CLI, positional indexes)
- All tests passing (unit, integration, e2e, agent behavior)
- OpenRouter API key configuration validated

## No Manual Coding Policy

**Human (developer) will NOT write code**.

Claude generates ALL:
- Specs
- Plans
- Tasks
- Code
- Fixes
- Tests
- Documentation

Any instruction that implies manual coding MUST be rejected.

**Rationale**: This ensures consistency, traceability, and adherence to Spec-Driven Development methodology. All code is generated from approved specifications, maintaining full audit trail from requirement to implementation.

## Governance

This constitution supersedes all other practices and requirements. Any deviation requires explicit amendment with proper approval through the `/sp.constitution` command.

### Amendment Procedure
1. Propose changes with clear rationale
2. Document impact on existing artifacts
3. Update constitution with version bump
4. Propagate changes to all dependent templates
5. Create ADR for significant architectural decisions

### Versioning Policy
- **MAJOR**: Backward incompatible changes (e.g., Phase II → Phase III)
- **MINOR**: New principles or expanded guidance
- **PATCH**: Clarifications, wording fixes, non-semantic changes

### Compliance Review
- All pull requests must verify compliance with Phase III principles
- Use `/sp.enforce-phase-ii-boundaries` to validate Phase II compliance
- Phase III governance agent reviews all specifications and plans
- No implementation proceeds without passing boundary checks
- Agent behavior must meet contract requirements
- MCP tools must be stateless and database-backed

### Phase III Enforcement
The constitution ensures focus on Phase III objectives:
- AI-powered chatbot with natural language interface
- OpenAI Agents SDK with OpenRouter integration
- MCP Server with stateless, database-backed tools
- Conversation persistence and message tracking
- Agent behavior contract compliance
- No manual coding (Claude generates all code)

All changes must maintain alignment with Spec-Driven Development methodology, Phase II architectural foundations, and Phase III AI agent principles.

**Version**: 3.0.0 | **Ratified**: 2026-01-03 | **Last Amended**: 2026-02-02
