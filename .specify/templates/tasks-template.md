---

description: "Task list template for feature implementation"
---

# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Phase IV Deployment**: `helm/` (Helm charts), `api/Dockerfile`, `web/Dockerfile`
- **Phase III AI Agent App**: `api/src/` (backend + agent + MCP), `web/src/` (frontend + chat UI)
- **Phase II Web App**: `api/src/`, `web/src/`
- **Phase I Single project** (DEPRECATED): `src/`, `tests/` at repository root
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume Phase II/III/IV web app - adjust based on plan.md structure

<!-- 
  ============================================================================
  IMPORTANT: The tasks below are SAMPLE TASKS for illustration purposes only.
  
  The /sp.tasks command MUST replace these with actual tasks based on:
  - User stories from spec.md (with their priorities P1, P2, P3...)
  - Feature requirements from plan.md
  - Entities from data-model.md
  - Endpoints from contracts/
  
  Tasks MUST be organized by user story so each story can be:
  - Implemented independently
  - Tested independently
  - Delivered as an MVP increment
  
  DO NOT keep these sample tasks in the generated tasks.md file.
  ============================================================================
-->

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

### Phase II Web Application Setup

**Backend Setup**:
- [P] [Setup] Initialize FastAPI project structure in `api/`
- [P] [Setup] Configure Neon PostgreSQL connection in `api/src/database.py`
- [P] [Setup] Setup Alembic for database migrations in `api/alembic/`
- [P] [Setup] Configure Pydantic settings in `api/src/config.py`
- [P] [Setup] Setup pytest for backend tests in `api/tests/`
- [P] [Setup] Create requirements.txt with FastAPI, SQLModel, Alembic, Pydantic

**Frontend Setup**:
- [P] [Setup] Initialize Next.js 15+ project with TypeScript in `web/`
- [P] [Setup] Configure Tailwind CSS in `web/tailwind.config.js`
- [P] [Setup] Setup API client utilities in `web/src/lib/api.ts`
- [P] [Setup] Configure Jest and React Testing Library in `web/tests/`
- [P] [Setup] Create TypeScript types in `web/src/types/`
- [P] [Setup] Setup environment variables in `web/.env.local`

**Integration Setup**:
- [Setup] Configure CORS in FastAPI for Next.js frontend
- [Setup] Setup OpenAPI/Swagger documentation at `/api/v1/docs`
- [Setup] Create API base URL configuration for frontend

### Phase III AI Agent Application Setup (if applicable)

**AI/Agent Setup**:
- [P] [Setup] Install OpenAI Agents SDK in `api/requirements.txt`
- [P] [Setup] Install MCP SDK for Python in `api/requirements.txt`
- [P] [Setup] Configure OpenRouter API integration in `api/src/config.py`
- [P] [Setup] Setup `OPENROUTER_API_KEY` environment variable
- [P] [Setup] Create agent configuration module in `api/src/agent/config.py`
- [P] [Setup] Create MCP server structure in `api/src/mcp/`

**Chat UI Setup**:
- [P] [Setup] Install OpenAI ChatKit in `web/package.json`
- [P] [Setup] Configure ChatKit components in `web/src/components/chat/`
- [P] [Setup] Setup chat API client in `web/src/lib/api/chat.ts`
- [P] [Setup] Create chat page route in `web/src/app/chat/`

**Conversation Persistence Setup**:
- [P] [Setup] Create Conversation model in `api/src/models/conversation.py`
- [P] [Setup] Create Message model in `api/src/models/message.py`
- [P] [Setup] Create ToolCall model in `api/src/models/tool_call.py`
- [Setup] Create Alembic migration for conversation tables

**Agent Testing Setup**:
- [P] [Setup] Setup agent behavior tests in `api/tests/test_agent/`
- [P] [Setup] Setup MCP tool contract tests in `api/tests/test_mcp/`
- [P] [Setup] Create test fixtures for conversations in `api/tests/fixtures/`

### Phase IV Deployment Setup (if applicable)

**Docker Setup**:
- [P] [Setup] Create multi-stage Dockerfile for backend in `api/Dockerfile`
- [P] [Setup] Create multi-stage Dockerfile for frontend in `web/Dockerfile`
- [P] [Setup] Create .dockerignore files for backend and frontend
- [P] [Setup] Configure Docker build optimization (layer caching, minimal images)
- [P] [Setup] Setup non-root users in Docker images for security

**Helm Chart Setup**:
- [P] [Setup] Create Helm chart structure for backend in `helm/todo-backend/`
- [P] [Setup] Create Helm chart structure for frontend in `helm/todo-frontend/`
- [P] [Setup] Create Chart.yaml metadata for backend and frontend
- [P] [Setup] Create values.yaml for environment configuration
- [P] [Setup] Create helper templates in `helm/*/templates/_helpers.tpl`

**Kubernetes Manifest Setup**:
- [P] [Setup] Create Deployment manifests in `helm/*/templates/deployment.yaml`
- [P] [Setup] Create Service manifests in `helm/*/templates/service.yaml`
- [P] [Setup] Create ConfigMap manifests in `helm/*/templates/configmap.yaml`
- [P] [Setup] Create Secret manifests in `helm/*/templates/secret.yaml`
- [P] [Setup] Configure health checks (liveness, readiness, startup probes)
- [P] [Setup] Configure resource limits (CPU, memory requests/limits)

**Minikube Setup**:
- [Setup] Install and start Minikube cluster
- [Setup] Create `todo` namespace in Kubernetes
- [Setup] Configure kubectl context for Minikube
- [Setup] Setup port forwarding configuration

**AI-Assisted DevOps Setup**:
- [P] [Setup] Document Gordon usage patterns in deployment docs
- [P] [Setup] Document kubectl-ai usage patterns in deployment docs
- [P] [Setup] Document kagent usage patterns in deployment docs
- [P] [Setup] Create deployment verification checklist

**Deployment Documentation Setup**:
- [P] [Setup] Create deployment guide in `README.md` or `docs/deployment.md`
- [P] [Setup] Document all deployment commands (Docker, Helm, kubectl)
- [P] [Setup] Create troubleshooting guide for common deployment issues
- [P] [Setup] Setup AI tool logs/screenshots directory structure

### Phase I Single Project Setup (DEPRECATED - for reference only)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create project structure per implementation plan
- [ ] T002 Initialize [language] project with [framework] dependencies
- [ ] T003 [P] Configure linting and formatting tools

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Phase II Foundational Tasks

**Database Layer**:
- [ ] T004 Create SQLModel base models in `api/src/models/`
- [ ] T005 Create initial Alembic migration for database schema
- [ ] T006 Setup database session management in `api/src/database.py`
- [ ] T007 [P] Create database connection tests in `api/tests/test_database.py`

**API Layer**:
- [ ] T008 Create Pydantic request/response schemas in `api/src/schemas/`
- [ ] T009 Setup FastAPI routers in `api/src/routers/`
- [ ] T010 [P] Implement error handling middleware in `api/src/middleware/`
- [ ] T011 [P] Configure CORS for frontend in `api/src/main.py`
- [ ] T012 [P] Setup OpenAPI documentation in `api/src/main.py`

**Frontend Layer**:
- [ ] T013 Create API client utilities in `web/src/lib/api.ts`
- [ ] T014 Create TypeScript types matching API schemas in `web/src/types/`
- [ ] T015 [P] Create reusable UI components in `web/src/components/ui/`
- [ ] T016 [P] Setup error handling utilities in `web/src/lib/errors.ts`
- [ ] T017 [P] Create loading state components in `web/src/components/loading/`

**Integration**:
- [ ] T018 Test API-frontend integration with health check endpoint
- [ ] T019 Verify database connection from API
- [ ] T020 Verify frontend can call API endpoints

### Phase III Foundational Tasks (if applicable)

**Purpose**: Core AI agent infrastructure that MUST be complete before ANY agent-based user story can be implemented

**⚠️ CRITICAL**: No agent-based user story work can begin until this phase is complete

**MCP Server Layer**:
- [ ] T021 Create MCP server base structure in `api/src/mcp/server.py`
- [ ] T022 Implement MCP tool registry in `api/src/mcp/registry.py`
- [ ] T023 Create MCP tool base class in `api/src/mcp/tools/base.py`
- [ ] T024 [P] Setup MCP server configuration in `api/src/mcp/config.py`
- [ ] T025 [P] Create MCP tool contract tests in `api/tests/test_mcp/test_tools.py`

**Agent Layer**:
- [ ] T026 Configure OpenAI Agents SDK with OpenRouter in `api/src/agent/client.py`
- [ ] T027 Create agent configuration module in `api/src/agent/config.py`
- [ ] T028 Implement agent orchestration logic in `api/src/agent/orchestrator.py`
- [ ] T029 [P] Create agent behavior tests in `api/tests/test_agent/test_behavior.py`
- [ ] T030 [P] Setup agent error handling in `api/src/agent/errors.py`

**Conversation Persistence Layer**:
- [ ] T031 Create Conversation SQLModel in `api/src/models/conversation.py`
- [ ] T032 Create Message SQLModel in `api/src/models/message.py`
- [ ] T033 Create ToolCall SQLModel in `api/src/models/tool_call.py`
- [ ] T034 Create Alembic migration for conversation tables
- [ ] T035 [P] Create conversation service in `api/src/services/conversation.py`
- [ ] T036 [P] Create conversation repository tests in `api/tests/test_models/test_conversation.py`

**Chat API Layer**:
- [ ] T037 Create chat API schemas in `api/src/schemas/chat.py`
- [ ] T038 Implement chat router in `api/src/routers/chat.py`
- [ ] T039 Create conversation endpoints (create, get, list)
- [ ] T040 Create message endpoints (send, get history)
- [ ] T041 [P] Create chat API tests in `api/tests/test_api/test_chat.py`

**Chat UI Layer**:
- [ ] T042 Create ChatKit integration in `web/src/components/chat/ChatInterface.tsx`
- [ ] T043 Create chat API client in `web/src/lib/api/chat.ts`
- [ ] T044 Create chat page in `web/src/app/chat/page.tsx`
- [ ] T045 [P] Create message components in `web/src/components/chat/Message.tsx`
- [ ] T046 [P] Create chat UI tests in `web/tests/unit/chat/`

**Integration**:
- [ ] T047 Test agent-MCP integration (agent can call MCP tools)
- [ ] T048 Test conversation persistence (messages saved to database)
- [ ] T049 Test chat API-agent integration (API can invoke agent)
- [ ] T050 Test frontend-chat API integration (UI can send/receive messages)

**Checkpoint**: Foundation ready - agent-based user story implementation can now begin in parallel

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - [Title] (Priority: P1) 🎯 MVP

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Phase II Implementation Pattern (Database → API → Frontend)

**Database Tasks** (implement first):
- [ ] T021 [P] [US1] Create SQLModel for [Entity] in `api/src/models/[entity].py`
- [ ] T022 [US1] Create Alembic migration for [Entity] table
- [ ] T023 [P] [US1] Write database model tests in `api/tests/test_models/test_[entity].py`

**API Tasks** (implement second):
- [ ] T024 [P] [US1] Create Pydantic schemas for [Entity] in `api/src/schemas/[entity].py`
- [ ] T025 [US1] Implement POST /api/v1/[resource] endpoint in `api/src/routers/[resource].py`
- [ ] T026 [US1] Implement GET /api/v1/[resource] endpoint
- [ ] T027 [US1] Implement GET /api/v1/[resource]/{id} endpoint
- [ ] T028 [US1] Implement PATCH /api/v1/[resource]/{id} endpoint
- [ ] T029 [US1] Implement DELETE /api/v1/[resource]/{id} endpoint
- [ ] T030 [P] [US1] Write API endpoint tests in `api/tests/test_api/test_[resource].py`

**Frontend Tasks** (implement third):
- [ ] T031 [P] [US1] Create TypeScript types in `web/src/types/[entity].ts`
- [ ] T032 [P] [US1] Create API client functions in `web/src/lib/api/[resource].ts`
- [ ] T033 [US1] Create [ListPage] component in `web/src/app/[route]/page.tsx`
- [ ] T034 [US1] Create [ItemComponent] in `web/src/components/[entity]/[Item].tsx`
- [ ] T035 [US1] Create [FormComponent] in `web/src/components/[entity]/[Form].tsx`
- [ ] T036 [P] [US1] Write component tests in `web/tests/unit/[entity]/`

**Integration Tasks** (implement last):
- [ ] T037 [US1] Test end-to-end user flow (create → read → update → delete)
- [ ] T038 [US1] Test error handling (network errors, validation errors)
- [ ] T039 [US1] Test loading states across all operations

### Phase III Implementation Pattern (MCP Tools → Agent → Chat API → Chat UI)

**MCP Tool Tasks** (implement first):
- [ ] T051 [P] [US1] Create MCP tool for [operation] in `api/src/mcp/tools/[tool_name].py`
- [ ] T052 [P] [US1] Define tool input schema with Pydantic
- [ ] T053 [P] [US1] Define tool output schema with Pydantic
- [ ] T054 [US1] Implement stateless tool logic (fetch from DB, operate, persist to DB)
- [ ] T055 [US1] Register tool in MCP server registry
- [ ] T056 [P] [US1] Write MCP tool contract tests in `api/tests/test_mcp/test_[tool_name].py`

**Agent Behavior Tasks** (implement second):
- [ ] T057 [US1] Define agent prompt for [operation] in `api/src/agent/prompts.py`
- [ ] T058 [US1] Implement agent tool invocation logic in `api/src/agent/orchestrator.py`
- [ ] T059 [US1] Add confirmation logic for destructive operations
- [ ] T060 [US1] Implement error handling with user-friendly messages
- [ ] T061 [P] [US1] Write agent behavior tests in `api/tests/test_agent/test_[operation].py`

**Chat API Tasks** (implement third):
- [ ] T062 [US1] Update chat endpoint to handle [operation] intent
- [ ] T063 [US1] Implement conversation context retrieval from database
- [ ] T064 [US1] Persist agent responses and tool calls to database
- [ ] T065 [P] [US1] Write chat API tests in `api/tests/test_api/test_chat_[operation].py`

**Chat UI Tasks** (implement fourth):
- [ ] T066 [US1] Update ChatKit interface to display [operation] results
- [ ] T067 [US1] Add loading states for agent processing
- [ ] T068 [US1] Add error handling for agent failures
- [ ] T069 [P] [US1] Write chat UI tests in `web/tests/unit/chat/test_[operation].tsx`

**Integration Tasks** (implement last):
- [ ] T070 [US1] Test end-to-end agent flow (user message → agent → MCP tool → database → response)
- [ ] T071 [US1] Test conversation persistence (messages survive page refresh)
- [ ] T072 [US1] Test error handling (tool failures, agent errors, network issues)
- [ ] T073 [US1] Test confirmation flows (destructive operations require user approval)

**Acceptance**: [Specific criteria from spec.md]

### Tests for User Story 1 (OPTIONAL - only if tests requested) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T010 [P] [US1] Contract test for [endpoint] in tests/contract/test_[name].py
- [ ] T011 [P] [US1] Integration test for [user journey] in tests/integration/test_[name].py

### Implementation for User Story 1

- [ ] T012 [P] [US1] Create [Entity1] model in src/models/[entity1].py
- [ ] T013 [P] [US1] Create [Entity2] model in src/models/[entity2].py
- [ ] T014 [US1] Implement [Service] in src/services/[service].py (depends on T012, T013)
- [ ] T015 [US1] Implement [endpoint/feature] in src/[location]/[file].py
- [ ] T016 [US1] Add validation and error handling
- [ ] T017 [US1] Add logging for user story 1 operations

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - [Title] (Priority: P2)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 2 (OPTIONAL - only if tests requested) ⚠️

- [ ] T018 [P] [US2] Contract test for [endpoint] in tests/contract/test_[name].py
- [ ] T019 [P] [US2] Integration test for [user journey] in tests/integration/test_[name].py

### Implementation for User Story 2

- [ ] T020 [P] [US2] Create [Entity] model in src/models/[entity].py
- [ ] T021 [US2] Implement [Service] in src/services/[service].py
- [ ] T022 [US2] Implement [endpoint/feature] in src/[location]/[file].py
- [ ] T023 [US2] Integrate with User Story 1 components (if needed)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - [Title] (Priority: P3)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 3 (OPTIONAL - only if tests requested) ⚠️

- [ ] T024 [P] [US3] Contract test for [endpoint] in tests/contract/test_[name].py
- [ ] T025 [P] [US3] Integration test for [user journey] in tests/integration/test_[name].py

### Implementation for User Story 3

- [ ] T026 [P] [US3] Create [Entity] model in src/models/[entity].py
- [ ] T027 [US3] Implement [Service] in src/services/[service].py
- [ ] T028 [US3] Implement [endpoint/feature] in src/[location]/[file].py

**Checkpoint**: All user stories should now be independently functional

---

[Add more user story phases as needed, following the same pattern]

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] TXXX [P] Documentation updates in docs/
- [ ] TXXX Code cleanup and refactoring
- [ ] TXXX Performance optimization across all stories
- [ ] TXXX [P] Additional unit tests (if requested) in tests/unit/
- [ ] TXXX Security hardening
- [ ] TXXX Run quickstart.md validation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together (if tests requested):
Task: "Contract test for [endpoint] in tests/contract/test_[name].py"
Task: "Integration test for [user journey] in tests/integration/test_[name].py"

# Launch all models for User Story 1 together:
Task: "Create [Entity1] model in src/models/[entity1].py"
Task: "Create [Entity2] model in src/models/[entity2].py"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
