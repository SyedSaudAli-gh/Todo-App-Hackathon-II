# Tasks: Enable Real MCP Tool Execution in AI Todo Assistant

**Input**: Design documents from `/specs/006-enable-mcp-execution/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Tests are NOT included in this task list (not requested in specification)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Phase III AI Agent App**: `api/src/` (backend + agent + MCP), `web/src/` (frontend + chat UI)
- Backend: FastAPI with OpenAI Agents SDK, MCP tools, SQLModel
- Frontend: Next.js with existing chat components (no routing changes)
- Database: Neon PostgreSQL with Alembic migrations

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Environment configuration and dependency installation

### Backend Setup

- [x] T001 [P] Add OpenAI SDK to api/requirements.txt with OpenRouter support
- [x] T002 [P] Add openai package (latest version) to api/requirements.txt
- [x] T003 [P] Configure OPENROUTER_API_KEY in api/.env.example
- [x] T004 [P] Configure OPENROUTER_MODEL=mistralai/mistral-7b-instruct in api/.env.example
- [x] T005 [P] Create agent configuration module in api/src/ai/config.py
- [x] T006 [P] Create MCP tools directory structure in api/src/mcp/tools/
- [x] T007 [P] Create agent services directory in api/src/services/

### Frontend Setup

- [x] T008 [P] Verify existing chat components in web/src/components/chat/
- [x] T009 [P] Verify existing chat API client in web/src/lib/api/chat.ts
- [x] T010 [P] Verify existing chat types in web/src/types/chat.ts

**Checkpoint**: Environment configured, dependencies ready for installation

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Database Migrations

- [x] T011 Create Conversation SQLModel in api/src/models/conversation.py
- [x] T012 Create Message SQLModel in api/src/models/message.py
- [ ] T013 [P] Create ToolCall SQLModel in api/src/models/tool_call.py (optional for MVP)
- [x] T014 Create Alembic migration 003 for conversations table in api/alembic/versions/003_create_conversations_table.py
- [x] T015 Create Alembic migration 004 for messages table in api/alembic/versions/004_create_messages_table.py
- [ ] T016 [P] Create Alembic migration 005 for tool_calls table in api/alembic/versions/005_create_tool_calls_table.py (optional)
- [ ] T017 Run database migrations with alembic upgrade head

### Agent Infrastructure

- [ ] T018 Create OpenAI client configuration with OpenRouter in api/src/ai/client.py
- [x] T019 Create agent configuration with Mistral model in api/src/ai/config.py
- [x] T020 Create agent runner with tool execution logic in api/src/ai/runner.py
- [x] T021 [P] Create agent error handling utilities in api/src/ai/errors.py

### Conversation Services

- [x] T022 Create conversation service for CRUD operations in api/src/services/conversation.py
- [x] T023 Implement load_conversation_history function in api/src/services/conversation.py
- [x] T024 Implement save_message function in api/src/services/conversation.py
- [x] T025 [P] Implement save_tool_call function in api/src/services/conversation.py (optional)

### Chat API Base

- [x] T026 Create chat API schemas in api/src/schemas/chat.py
- [x] T027 Create chat router in api/src/routers/chat.py
- [x] T028 Implement POST /api/v1/chat/conversations endpoint in api/src/routers/chat.py
- [x] T029 Implement GET /api/v1/chat/conversations/{id} endpoint in api/src/routers/chat.py
- [x] T030 [P] Implement DELETE /api/v1/chat/conversations/{id} endpoint in api/src/routers/chat.py

### MCP Tool Base Structure

- [ ] T031 Create MCP tool base schemas in api/src/mcp/schemas.py
- [ ] T032 Create tool registry structure in api/src/mcp/registry.py
- [ ] T033 Create tool execution wrapper in api/src/mcp/executor.py

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Create Task via Chat (Priority: P1) 🎯 MVP

**Goal**: User can create a todo task by sending a natural language message to the AI agent, which executes the real add_task MCP tool to persist the task to the database.

**Independent Test**: Send "Create a task to buy groceries" in chat and verify task appears in database and todo list UI.

### MCP Tool Implementation

- [x] T034 [P] [US1] Create AddTaskInput schema in api/src/mcp/schemas.py
- [x] T035 [P] [US1] Create add_task tool function in api/src/mcp/tools/add_task.py
- [x] T036 [US1] Implement database INSERT logic in add_task tool
- [x] T037 [US1] Implement error handling with structured responses in add_task tool
- [x] T038 [US1] Define OpenAI function definition for add_task in api/src/mcp/tools/add_task.py
- [x] T039 [US1] Register add_task tool in tool registry in api/src/mcp/registry.py

### Agent Behavior

- [x] T040 [US1] Configure agent instructions for task creation in api/src/ai/config.py
- [x] T041 [US1] Implement tool execution for add_task in agent runner in api/src/ai/runner.py
- [x] T042 [US1] Implement tool result feedback loop in agent runner
- [x] T043 [P] [US1] Add task creation confirmation messages in agent config

### Chat API Integration

- [x] T044 [US1] Update POST /api/v1/chat/conversations/{id}/messages to handle add_task tool calls
- [x] T045 [US1] Implement agent invocation with add_task tool in chat endpoint
- [x] T046 [US1] Persist user message, tool call, and agent response to database
- [x] T047 [P] [US1] Add error handling for tool execution failures in chat endpoint

### Chat UI Updates

- [x] T048 [P] [US1] Update chat message component to display tool execution results in web/src/components/chat/Message.tsx
- [x] T049 [P] [US1] Add loading state for agent processing in web/src/components/chat/ChatInterface.tsx
- [x] T050 [P] [US1] Add error display for tool failures in web/src/components/chat/ChatInterface.tsx

### Integration & Verification

- [ ] T051 [US1] Test end-to-end: "Create a task to buy groceries" → database record created
- [ ] T052 [US1] Verify task appears in todo list UI after creation via chat
- [ ] T053 [US1] Verify conversation history persists across page refresh
- [ ] T054 [US1] Test error handling: invalid task title, database failure

**Checkpoint**: User Story 1 complete - users can create tasks via chat with real database persistence

---

## Phase 4: User Story 2 - List Tasks via Chat (Priority: P1)

**Goal**: User can ask to see their tasks and the AI agent retrieves real data from the database using the list_tasks MCP tool.

**Independent Test**: Ask "Show me my tasks" and verify response contains actual tasks from database, not simulated data.

### MCP Tool Implementation

- [x] T055 [P] [US2] Create ListTasksInput schema in api/src/mcp/schemas.py
- [x] T056 [P] [US2] Create list_tasks tool function in api/src/mcp/tools/list_tasks.py
- [x] T057 [US2] Implement database SELECT logic with status filtering in list_tasks tool
- [x] T058 [US2] Implement error handling with structured responses in list_tasks tool
- [x] T059 [US2] Define OpenAI function definition for list_tasks in api/src/mcp/tools/list_tasks.py
- [x] T060 [US2] Register list_tasks tool in tool registry in api/src/mcp/registry.py

### Agent Behavior

- [ ] T061 [US2] Configure agent instructions for task listing in api/src/ai/config.py
- [ ] T062 [US2] Implement tool execution for list_tasks in agent runner in api/src/ai/runner.py
- [ ] T063 [US2] Format task list for natural language response in agent config
- [ ] T064 [P] [US2] Handle empty task list scenario in agent config

### Chat API Integration

- [ ] T065 [US2] Update POST /api/v1/chat/conversations/{id}/messages to handle list_tasks tool calls
- [ ] T066 [US2] Implement agent invocation with list_tasks tool in chat endpoint
- [ ] T067 [US2] Persist tool call results to database
- [ ] T068 [P] [US2] Add error handling for empty results in chat endpoint

### Chat UI Updates

- [ ] T069 [P] [US2] Update chat message component to display task lists in web/src/components/chat/Message.tsx
- [ ] T070 [P] [US2] Format task list display with status indicators in chat UI
- [ ] T071 [P] [US2] Add empty state message when no tasks exist

### Integration & Verification

- [ ] T072 [US2] Test end-to-end: "Show me my tasks" → returns real database tasks
- [ ] T073 [US2] Verify task list matches todo list UI data
- [ ] T074 [US2] Test status filtering: "Show completed tasks" → filters correctly
- [ ] T075 [US2] Test empty state: user with no tasks gets appropriate message

**Checkpoint**: User Story 2 complete - users can list tasks via chat with real database queries

---

## Phase 5: User Story 3 - Update Task via Chat (Priority: P2)

**Goal**: User can modify a task (mark complete, change title, etc.) via natural language and the AI agent executes the real update_task MCP tool to persist changes.

**Independent Test**: Create a task, then ask "Mark task 1 as complete" and verify status changes persist after page refresh.

### MCP Tool Implementation

- [x] T076 [P] [US3] Create UpdateTaskInput schema in api/src/mcp/schemas.py
- [x] T077 [P] [US3] Create update_task tool function in api/src/mcp/tools/update_task.py
- [x] T078 [US3] Implement database UPDATE logic with ownership validation in update_task tool
- [x] T079 [US3] Implement error handling for not found and permission denied in update_task tool
- [x] T080 [US3] Define OpenAI function definition for update_task in api/src/mcp/tools/update_task.py
- [x] T081 [US3] Register update_task tool in tool registry in api/src/mcp/registry.py

### Agent Behavior

- [ ] T082 [US3] Configure agent instructions for task updates in api/src/ai/config.py
- [ ] T083 [US3] Implement tool execution for update_task in agent runner in api/src/ai/runner.py
- [ ] T084 [US3] Add update confirmation messages in agent config
- [ ] T085 [P] [US3] Handle task not found errors gracefully in agent config

### Chat API Integration

- [ ] T086 [US3] Update POST /api/v1/chat/conversations/{id}/messages to handle update_task tool calls
- [ ] T087 [US3] Implement agent invocation with update_task tool in chat endpoint
- [ ] T088 [US3] Persist update operations to database
- [ ] T089 [P] [US3] Add error handling for permission denied in chat endpoint

### Chat UI Updates

- [ ] T090 [P] [US3] Update chat message component to display update confirmations in web/src/components/chat/Message.tsx
- [ ] T091 [P] [US3] Add visual feedback for successful updates in chat UI
- [ ] T092 [P] [US3] Display error messages for failed updates

### Integration & Verification

- [ ] T093 [US3] Test end-to-end: "Mark task 1 as complete" → database status updated
- [ ] T094 [US3] Verify updated task reflects in todo list UI immediately
- [ ] T095 [US3] Test permission validation: user cannot update other user's tasks
- [ ] T096 [US3] Test error handling: update non-existent task returns helpful message

**Checkpoint**: User Story 3 complete - users can update tasks via chat with real database persistence

---

## Phase 6: User Story 4 - Delete Task via Chat (Priority: P2)

**Goal**: User can delete a task via natural language and the AI agent executes the real delete_task MCP tool after confirmation to permanently remove it.

**Independent Test**: Create a task, delete it via chat with confirmation, and verify it no longer appears in database or todo list.

### MCP Tool Implementation

- [x] T097 [P] [US4] Create DeleteTaskInput schema in api/src/mcp/schemas.py
- [x] T098 [P] [US4] Create delete_task tool function in api/src/mcp/tools/delete_task.py
- [x] T099 [US4] Implement database DELETE logic with ownership validation in delete_task tool
- [x] T100 [US4] Implement error handling for not found and permission denied in delete_task tool
- [x] T101 [US4] Define OpenAI function definition for delete_task in api/src/mcp/tools/delete_task.py
- [x] T102 [US4] Register delete_task tool in tool registry in api/src/mcp/registry.py

### Agent Behavior

- [ ] T103 [US4] Configure agent instructions for task deletion with confirmation in api/src/ai/config.py
- [ ] T104 [US4] Implement confirmation prompt before delete in agent runner in api/src/ai/runner.py
- [ ] T105 [US4] Implement tool execution for delete_task after confirmation in agent runner
- [ ] T106 [P] [US4] Add deletion confirmation messages in agent config

### Chat API Integration

- [ ] T107 [US4] Update POST /api/v1/chat/conversations/{id}/messages to handle delete_task tool calls
- [ ] T108 [US4] Implement agent invocation with delete_task tool in chat endpoint
- [ ] T109 [US4] Persist deletion operations to database
- [ ] T110 [P] [US4] Add error handling for permission denied in chat endpoint

### Chat UI Updates

- [ ] T111 [P] [US4] Update chat message component to display deletion confirmations in web/src/components/chat/Message.tsx
- [ ] T112 [P] [US4] Add confirmation dialog UI for destructive operations in chat interface
- [ ] T113 [P] [US4] Display success/error messages for deletions

### Integration & Verification

- [ ] T114 [US4] Test end-to-end: "Delete task 5" → confirmation prompt → "yes" → database record deleted
- [ ] T115 [US4] Verify deleted task no longer appears in todo list UI
- [ ] T116 [US4] Test confirmation flow: "Delete task 5" → "no" → task not deleted
- [ ] T117 [US4] Test permission validation: user cannot delete other user's tasks

**Checkpoint**: User Story 4 complete - users can delete tasks via chat with confirmation and real database deletion

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and final validation

### Documentation & Validation

- [ ] T118 [P] Update api/.env.example with all required environment variables
- [ ] T119 [P] Update web/.env.local.example with chat API configuration
- [ ] T120 [P] Verify quickstart.md instructions are accurate
- [ ] T121 Run complete end-to-end test following quickstart.md

### Error Handling & Edge Cases

- [ ] T122 [P] Add global error handling for agent failures in api/src/ai/errors.py
- [ ] T123 [P] Add retry logic for OpenRouter API failures in api/src/ai/client.py
- [ ] T124 [P] Add timeout handling for long-running agent operations
- [ ] T125 Implement graceful degradation when MCP tools fail

### Performance & Optimization

- [ ] T126 [P] Add database connection pooling configuration in api/src/database.py
- [ ] T127 [P] Optimize conversation history loading (limit to 50 recent messages)
- [ ] T128 [P] Add caching for frequently accessed tool definitions

### Security & Validation

- [ ] T129 [P] Add input validation for all MCP tool inputs
- [ ] T130 [P] Add user permission checks in all tool functions
- [ ] T131 [P] Add rate limiting for chat API endpoints
- [ ] T132 Verify no sensitive data in error messages

### Final Verification

- [ ] T133 Test all 4 user stories work independently
- [ ] T134 Test conversation persistence across server restarts
- [ ] T135 Verify no tool calls are simulated (all use real database)
- [ ] T136 Verify tasks created via chat appear in todo list UI
- [ ] T137 Run database inspection to verify all operations persist correctly

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - US1 (P1): Can start after Foundational - No dependencies on other stories
  - US2 (P1): Can start after Foundational - No dependencies on other stories
  - US3 (P2): Can start after Foundational - No dependencies on other stories
  - US4 (P2): Can start after Foundational - No dependencies on other stories
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Independent - can be implemented and tested alone
- **User Story 2 (P1)**: Independent - can be implemented and tested alone
- **User Story 3 (P2)**: Independent - can be implemented and tested alone
- **User Story 4 (P2)**: Independent - can be implemented and tested alone

### Within Each User Story

- MCP tool implementation before agent behavior
- Agent behavior before chat API integration
- Chat API integration before chat UI updates
- All implementation before integration testing

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all 4 user stories can start in parallel (if team capacity allows)
- Within each user story, tasks marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all parallelizable tasks for User Story 1 together:

# MCP Tool schemas (parallel):
Task T034: "Create AddTaskInput schema in api/src/mcp/schemas.py"

# Agent config (parallel with tool):
Task T043: "Add task creation confirmation messages in agent config"

# Chat UI updates (parallel):
Task T048: "Update chat message component to display tool execution results"
Task T049: "Add loading state for agent processing"
Task T050: "Add error display for tool failures"
```

---

## Implementation Strategy

### MVP First (User Stories 1 & 2 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Create Task)
4. Complete Phase 4: User Story 2 (List Tasks)
5. **STOP and VALIDATE**: Test US1 and US2 independently
6. Deploy/demo if ready

**Rationale**: US1 and US2 are both P1 and provide core value (create and view tasks)

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (Create tasks!)
3. Add User Story 2 → Test independently → Deploy/Demo (View tasks!)
4. Add User Story 3 → Test independently → Deploy/Demo (Update tasks!)
5. Add User Story 4 → Test independently → Deploy/Demo (Delete tasks!)
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Create Task)
   - Developer B: User Story 2 (List Tasks)
   - Developer C: User Story 3 (Update Task)
   - Developer D: User Story 4 (Delete Task)
3. Stories complete and integrate independently

---

## Task Summary

**Total Tasks**: 137 tasks

**Tasks by Phase**:
- Phase 1 (Setup): 10 tasks
- Phase 2 (Foundational): 23 tasks
- Phase 3 (US1 - Create Task): 21 tasks
- Phase 4 (US2 - List Tasks): 21 tasks
- Phase 5 (US3 - Update Task): 21 tasks
- Phase 6 (US4 - Delete Task): 21 tasks
- Phase 7 (Polish): 20 tasks

**Tasks by User Story**:
- US1 (P1): 21 tasks
- US2 (P1): 21 tasks
- US3 (P2): 21 tasks
- US4 (P2): 21 tasks

**Parallel Opportunities**: 58 tasks marked [P] can run in parallel within their phase

**MVP Scope**: Phases 1-4 (Setup + Foundational + US1 + US2) = 75 tasks

---

## Notes

- [P] tasks = different files, no dependencies within phase
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- No tests included (not requested in specification)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- All 4 user stories can be developed in parallel after Foundational phase
