# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. For Phase II projects, use the approved technology stack.
-->

**Project Type**: [web/mobile/single - determines source structure]

### Phase II Full-Stack Web Application (if applicable)

**Frontend**:
- Framework: Next.js 15+ with App Router
- UI Library: React 19+ with hooks
- Language: TypeScript 5+ (strict mode)
- Styling: Tailwind CSS 3+
- State Management: React hooks, Context API
- HTTP Client: fetch API or axios
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
- Primary Keys: UUID or auto-increment integers
- Relationships: Foreign keys with CASCADE/RESTRICT

**Testing**:
- Frontend: Jest, React Testing Library
- Backend: pytest, FastAPI TestClient
- E2E: Playwright or Cypress
- API: Contract tests with OpenAPI validation

### Phase III AI Agent Architecture (if applicable)

**AI/Agent Layer**:
- Agent Framework: OpenAI Agents SDK
- LLM Provider: OpenRouter (NOT OpenAI directly)
- Recommended Model: Gemini via OpenRouter
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

**Chat API Requirements**:
- RESTful endpoints for conversation management
- Message persistence (user and agent messages)
- Tool call tracking
- Conversation history retrieval

### Phase IV Deployment Architecture (if applicable)

**Deployment Platform**:
- Kubernetes: Minikube (local cluster)
- Package Manager: Helm 3+
- Containerization: Docker
- Kubernetes CLI: kubectl

**AI-Assisted DevOps Tools** (MANDATORY):
- Gordon: AI-powered Docker assistant
- kubectl-ai: AI-powered Kubernetes assistant
- kagent: Kubernetes deployment agent

**Docker Requirements**:
- Multi-stage builds (build stage + runtime stage)
- Minimal runtime images (alpine, distroless)
- Non-root users for security
- Layer caching optimization
- Consistent tagging (semantic versioning)

**Helm Chart Requirements**:
- Templated manifests with value substitution
- Values files for environment configuration
- Chart metadata (Chart.yaml) with version and description
- Helper templates for reusable logic
- Validation of required values

**Kubernetes Requirements**:
- Declarative manifests (YAML)
- Resource requests and limits defined
- Health checks (liveness, readiness, startup probes)
- Environment variables via ConfigMaps and Secrets
- Labels and selectors for resource organization
- Namespace isolation (`todo` namespace)

**Cloud-Native Best Practices**:
- Stateless applications (no local file storage)
- Environment-based configuration (no hardcoded values)
- Health checks for all services
- Resource management (CPU/memory limits)
- Container security (non-root users, minimal images)

**Deployment Process**:
1. Build Docker images (via Gordon or Claude)
2. Load images into Minikube (if using local registry)
3. Create Kubernetes namespace (`todo`)
4. Apply Helm charts (via kubectl-ai/kagent or Claude)
5. Verify pod status (Running)
6. Verify service accessibility (port forwarding)
7. Test application functionality

**Verification Requirements**:
- All pods in `Running` state
- Services accessible via port forwarding
- Frontend loads in browser
- Backend API responds to health checks
- Application functionality working end-to-end
- Database connection working
- No error logs in pod output

**Documentation Requirements**:
- Complete setup instructions in README
- All commands documented (Minikube, Docker, Helm, kubectl)
- AI tool usage logs/screenshots included
- Troubleshooting guide for common issues
- Reproducibility guarantee (anyone can follow README and deploy)

### Phase I Single Project (if applicable - deprecated for new features)

**Language/Version**: Python 3.13+
**Storage**: In-memory (Phase I only - use database for Phase II)
**Testing**: pytest, unittest
**Target Platform**: CLI (Phase I only - use web for Phase II)

### Performance Goals
[domain-specific, e.g., API <500ms p95, 1000 req/s, 60 fps or NEEDS CLARIFICATION]

### Constraints
[domain-specific, e.g., <200ms p95, <100MB memory, offline-capable or NEEDS CLARIFICATION]

### Scale/Scope
[domain-specific, e.g., 10k users, 1M LOC, 50 screens or NEEDS CLARIFICATION]

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Phase III Requirements (if applicable)
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

### Phase II Requirements (if applicable - maintained in Phase III)
- ✅ Uses approved technology stack (Next.js, FastAPI, Neon)
- ✅ API-first architecture (Frontend → API → Database)
- ✅ Frontend-backend separation (no direct DB access from frontend)
- ✅ Persistent storage (Neon PostgreSQL, not in-memory)
- ✅ No Phase I patterns (in-memory, CLI, positional indexes)
- ✅ Database migrations with Alembic
- ✅ OpenAPI/Swagger documentation
- ✅ Proper error handling and validation

### Phase I Requirements (if applicable - deprecated for new features)
- ✅ In-memory storage only
- ✅ CLI interface only
- ✅ Python standard library only
- ✅ No external dependencies

**Note**: Phase I patterns are deprecated. New features should use Phase II or Phase III architecture.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
# [REMOVE IF UNUSED] Option 1: Phase II Web Application (RECOMMENDED)
api/                          # FastAPI backend
├── src/
│   ├── models/              # SQLModel database models
│   ├── schemas/             # Pydantic request/response models
│   ├── routers/             # API endpoints
│   ├── services/            # Business logic
│   ├── database.py          # Database connection
│   └── main.py              # FastAPI app
├── alembic/                 # Database migrations
│   └── versions/
├── tests/
│   ├── test_api/            # API endpoint tests
│   ├── test_models/         # Database model tests
│   └── test_services/       # Business logic tests
└── requirements.txt

web/                          # Next.js frontend
├── src/
│   ├── app/                 # Next.js App Router pages
│   ├── components/          # React components
│   ├── lib/                 # Utilities and API client
│   └── types/               # TypeScript types
├── public/                  # Static assets
├── tests/
│   ├── unit/                # Component tests
│   └── e2e/                 # End-to-end tests
├── package.json
└── tsconfig.json

# [REMOVE IF UNUSED] Option 2: Phase I Single Project (DEPRECATED - for reference only)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# [REMOVE IF UNUSED] Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as Phase II backend above]

ios/ or android/
└── [platform-specific structure: feature modules, UI flows, platform tests]
```

**Structure Decision**: [Document the selected structure and reference the real
directories captured above]

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
