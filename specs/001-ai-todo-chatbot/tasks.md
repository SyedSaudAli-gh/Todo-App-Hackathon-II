# Tasks: AI-Powered Todo Chatbot Backend

**Input**: Design documents from `/specs/001-ai-todo-chatbot/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Tests are NOT explicitly requested in the specification, so test tasks are omitted per template guidelines.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Phase III AI Agent App**: `api/src/` (backend + agent + MCP tools), `web/src/` (frontend - out of scope)
- Backend-focused implementation per SPEC-006

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Environment configuration and dependency installation for Phase III AI agent features

- [x] T001 [P] Update `api/requirements.txt` with Phase III dependencies (openai>=1.0.0, httpx>=0.24.0, tenacity>=8.2.0)
- [x] T002 [P] Create `.env.example` template with OPENROUTER_API_KEY, AGENT_MODEL, AGENT_TIMEOUT, CONVERSATION_HISTORY_LIMIT
- [x] T003 [P] Update `api/src/config.py` to load OpenRouter configuration from environment variables
- [x] T004 [P] Create `api/src/ai/` directory structure for agent layer
- [x] T005 [P] Create `api/src/mcp/` directory structure for MCP tools
- [x] T006 [P] Create `api/src/mcp/tools/` directory for tool implementations
- [ ] T007 Install dependencies with `pip install -r api/requirements.txt`

**Checkpoint**: Environment configured, dependencies installed

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Database Layer

- [x] T008 Verify existing `api/src/models/conversation.py` matches data-model.md schema (UUID PK, user_id, timestamps, messages relationship)
- [x] T009 Verify existing `api/src/models/message.py` matches data-model.md schema (UUID PK, conversation_id FK, role enum, tool_calls JSON, message_metadata JSON)
- [x] T010 Create Alembic migration 003 for conversations table in `api/alembic/versions/003_create_conversations_table.py`
- [x] T011 Create Alembic migration 004 for messages table in `api/alembic/versions/004_create_messages_table.py`
- [ ] T012 Run migrations with `alembic upgrade head` to create conversations and messages tables
- [ ] T013 Verify database schema with indexes on (conversation_id, timestamp) and (user_id)

### Conversation Service Layer

- [x] T014 [P] Create `api/src/services/conversation.py` with ConversationService class
- [x] T015 [P] Implement `create_conversation(user_id)` method returning Conversation object
- [x] T016 [P] Implement `get_conversation(conversation_id, user_id)` method with ownership validation
- [x] T017 [P] Implement `get_conversation_history(conversation_id, limit=20)` method returning last N messages
- [x] T018 [P] Implement `save_message(conversation_id, role, content, tool_calls=None)` method
- [x] T019 [P] Implement `update_conversation_timestamp(conversation_id)` method

### AI Agent Layer - Context Builder

- [x] T020 [P] Create `api/src/ai/context.py` with ConversationContextBuilder class
- [x] T021 [P] Implement `build_context(messages, system_prompt)` method returning OpenAI message array
- [x] T022 [P] Implement `get_default_system_prompt()` method with agent instructions from agent-behavior.md
- [x] T023 [P] Implement message formatting (role, content, tool_calls) for OpenAI API

### AI Agent Layer - Error Handling

- [x] T024 [P] Create `api/src/ai/errors.py` with AIAgentError base exception
- [x] T025 [P] Create AIAgentTimeoutError exception class
- [x] T026 [P] Create AIAgentToolError exception class

### Chat API Schemas

- [x] T027 [P] Create `api/src/schemas/chat.py` with ChatRequest schema (conversation_id: Optional[UUID], message: str)
- [x] T028 [P] Create ChatResponse schema (conversation_id: UUID, response: str, tool_calls: list, timestamp: datetime)
- [x] T029 [P] Create ToolCall schema (tool_call_id: str, name: str, input: dict, output: dict)

### Chat Router Integration

- [x] T030 Verify existing `api/src/routers/chat.py` has POST /chat endpoint structure
- [x] T031 Update chat router imports to include ConversationService, AIAgentOrchestrator, ConversationContextBuilder
- [x] T032 Verify chat endpoint validates conversation_id format (UUID) and message length (max 10,000 chars)
- [x] T033 Verify chat endpoint handles conversation creation when conversation_id is None
- [x] T034 Verify chat endpoint retrieves conversation history (last 20 messages)

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Natural Language Task Creation (Priority: P1) 🎯 MVP

**Goal**: Users can create todo tasks by describing them in natural language to the chatbot

**Independent Test**: Send message "Create a task to buy groceries" and verify task is created in database with correct title

### MCP Tool: create_task

- [x] T035 [P] [US1] Create `api/src/mcp/tools/create_task.py` with create_task function
- [x] T036 [P] [US1] Define OpenAI function schema for create_task tool (title: required, description: optional, status: optional)
- [x] T037 [US1] Implement stateless create_task logic: validate inputs, create Todo in database, commit transaction
- [x] T038 [US1] Implement error handling: return structured error response for validation failures and database errors
- [x] T039 [US1] Return success response with task_id, success=True, message

### Agent Orchestrator - Tool Registration

- [x] T040 [US1] Create `api/src/ai/orchestrator.py` with AIAgentOrchestrator class
- [x] T041 [US1] Initialize OpenAI client with OpenRouter base_url and OPENROUTER_API_KEY
- [x] T042 [US1] Implement `_register_tools()` method returning dict of tool schemas and functions
- [x] T043 [US1] Register create_task tool in tool registry

### Agent Orchestrator - Message Processing

- [x] T044 [US1] Implement `process_message(user_message, context, user_id, db, timeout=15)` method
- [x] T045 [US1] Call OpenAI API with messages, tools, and model (google/gemini-2.0-flash-exp)
- [x] T046 [US1] Check response for tool_calls and execute create_task function with user_id and db injected
- [x] T047 [US1] Format tool results and send back to OpenAI API for final response
- [x] T048 [US1] Return dict with response text and tool_calls array
- [x] T049 [US1] Implement timeout handling with AIAgentTimeoutError

### Chat Router Integration

- [x] T050 [US1] Update chat router to instantiate AIAgentOrchestrator
- [x] T051 [US1] Build conversation context using ConversationContextBuilder
- [x] T052 [US1] Call orchestrator.process_message() with user message and context
- [x] T053 [US1] Save user message to database before agent processing
- [x] T054 [US1] Save agent response and tool_calls to database after agent processing
- [x] T055 [US1] Update conversation timestamp
- [x] T056 [US1] Return ChatResponse with conversation_id, response, tool_calls, timestamp

**Acceptance**: User can send "Create a task to buy groceries" and receive confirmation with task created in database

**Checkpoint**: User Story 1 complete and independently testable

---

## Phase 4: User Story 2 - Task Querying and Listing (Priority: P1)

**Goal**: Users can ask the chatbot to show their tasks using natural language queries

**Independent Test**: Create 3 tasks, then ask "What are my tasks?" and verify agent lists all 3 tasks correctly

### MCP Tool: list_tasks

- [x] T057 [P] [US2] Create `api/src/mcp/tools/list_tasks.py` with list_tasks function
- [x] T058 [P] [US2] Define OpenAI function schema for list_tasks tool (status: optional filter "all"/"pending"/"completed")
- [x] T059 [US2] Implement stateless list_tasks logic: query todos WHERE user_id with optional status filter
- [x] T060 [US2] Return success response with tasks array (id, title, description, completed, timestamps) and count

### MCP Tool: get_task

- [x] T061 [P] [US2] Create `api/src/mcp/tools/get_task.py` with get_task function
- [x] T062 [P] [US2] Define OpenAI function schema for get_task tool (task_id: required integer)
- [x] T063 [US2] Implement stateless get_task logic: query todo WHERE id AND user_id (ownership validation)
- [x] T064 [US2] Return success response with task object or error if not found

### Agent Orchestrator - Tool Registration

- [x] T065 [US2] Register list_tasks tool in AIAgentOrchestrator._register_tools()
- [x] T066 [US2] Register get_task tool in AIAgentOrchestrator._register_tools()

### Agent Behavior - List Intent Recognition

- [x] T067 [US2] Update system prompt in ConversationContextBuilder to include list_tasks and get_task tool descriptions
- [x] T068 [US2] Verify agent recognizes list intents: "What tasks do I have?", "Show me my tasks", "List my todos"
- [x] T069 [US2] Verify agent formats task lists clearly with numbered items and status

**Acceptance**: User can ask "What tasks do I have?" and receive formatted list of all tasks

**Checkpoint**: User Stories 1 AND 2 complete and independently testable

---

## Phase 5: User Story 3 - Task Updates and Completion (Priority: P2)

**Goal**: Users can update task details or mark tasks as complete using conversational commands

**Independent Test**: Create task "buy groceries", then say "Mark groceries as complete" and verify task status updates in database

### MCP Tool: update_task

- [x] T070 [P] [US3] Create `api/src/mcp/tools/update_task.py` with update_task function
- [x] T071 [P] [US3] Define OpenAI function schema for update_task tool (task_id: required, title: optional, description: optional, status: optional)
- [x] T072 [US3] Implement stateless update_task logic: query task, verify ownership, update fields, commit transaction
- [x] T073 [US3] Update updated_at timestamp automatically
- [x] T074 [US3] Return success response with updated task object or error if not found

### Agent Orchestrator - Tool Registration

- [x] T075 [US3] Register update_task tool in AIAgentOrchestrator._register_tools()

### Agent Behavior - Update Intent Recognition

- [x] T076 [US3] Update system prompt to include update_task tool description
- [x] T077 [US3] Verify agent recognizes update intents: "Mark [task] as complete", "Change title to [new title]", "Update [task]"
- [x] T078 [US3] Implement task identification logic: agent calls list_tasks to find task by title before updating
- [x] T079 [US3] Verify agent provides clear confirmation: "I've marked 'buy groceries' as complete"

**Acceptance**: User can say "Mark the groceries task as complete" and task status updates to completed

**Checkpoint**: User Stories 1, 2, AND 3 complete and independently testable

---

## Phase 6: User Story 4 - Task Deletion with Confirmation (Priority: P2)

**Goal**: Users can delete tasks through natural language commands with confirmation prompts

**Independent Test**: Create task, request deletion, verify agent asks for confirmation, respond "yes", verify task deleted from database

### MCP Tool: delete_task

- [x] T080 [P] [US4] Create `api/src/mcp/tools/delete_task.py` with delete_task function
- [x] T081 [P] [US4] Define OpenAI function schema for delete_task tool (task_id: required integer)
- [x] T082 [US4] Implement stateless delete_task logic: query task, verify ownership, delete from database, commit transaction
- [x] T083 [US4] Return success response with message including deleted task title

### Agent Orchestrator - Tool Registration

- [x] T084 [US4] Register delete_task tool in AIAgentOrchestrator._register_tools()

### Agent Behavior - Confirmation Flow

- [x] T085 [US4] Update system prompt to include delete_task tool with MANDATORY confirmation requirement
- [x] T086 [US4] Implement confirmation state management: store pending_confirmation in message_metadata
- [x] T087 [US4] Implement confirmation check: retrieve last assistant message, check for pending_confirmation in metadata
- [x] T088 [US4] Implement confirmation expiration: check expires_at timestamp (5-minute timeout)
- [x] T089 [US4] Implement confirmation response handling: recognize "yes"/"no" responses
- [x] T090 [US4] Execute delete_task only after user confirms with "yes"
- [x] T091 [US4] Cancel operation if user responds "no" or "cancel"

### Agent Behavior - Delete Intent Recognition

- [x] T092 [US4] Verify agent recognizes delete intents: "Delete [task]", "Remove [task]", "Get rid of [task]"
- [x] T093 [US4] Verify agent ALWAYS asks for confirmation before calling delete_task tool
- [x] T094 [US4] Verify agent provides clear confirmation prompt: "Are you sure you want to delete 'buy groceries'? Reply yes to confirm."

**Acceptance**: User can request deletion, agent asks for confirmation, user confirms, task is deleted

**Checkpoint**: User Stories 1, 2, 3, AND 4 complete and independently testable

---

## Phase 7: User Story 5 - Conversation Continuity Across Sessions (Priority: P3)

**Goal**: Users can return to previous conversations and the agent maintains context, demonstrating stateless architecture

**Independent Test**: Start conversation, create tasks, stop server, restart server, continue conversation with same conversation_id, verify agent has full context

### Stateless Context Reconstruction

- [x] T095 [US5] Verify ConversationService.get_conversation_history() retrieves last 20 messages ordered by timestamp
- [x] T096 [US5] Verify ConversationContextBuilder.build_context() formats messages correctly for OpenAI API
- [x] T097 [US5] Verify chat router reconstructs context from database on EVERY request (no in-memory caching)

### Performance Optimization

- [x] T098 [US5] Verify database indexes on (conversation_id, timestamp) for fast message retrieval
- [x] T099 [US5] Measure context reconstruction time: should be <500ms for 50-message conversations
- [x] T100 [US5] Optimize query if needed: add LIMIT 20 and ORDER BY timestamp DESC

### Server Restart Test

- [ ] T101 [US5] Test conversation continuity: create conversation, send messages, stop server, restart server, send new message
- [ ] T102 [US5] Verify agent has full conversation history after restart
- [ ] T103 [US5] Verify no data loss after server restart

**Acceptance**: Conversation context persists across server restarts with full history available to agent

**Checkpoint**: All user stories (1-5) complete and independently testable

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and production readiness

### Error Handling

- [ ] T104 [P] Implement user-friendly error messages for all tool failures in AIAgentOrchestrator
- [ ] T105 [P] Implement database error handling with transaction rollback in all MCP tools
- [ ] T106 [P] Implement OpenRouter API error handling (rate limits, timeouts, invalid responses)
- [ ] T107 [P] Add error logging for debugging in `api/src/ai/orchestrator.py`

### Edge Cases

- [ ] T108 [P] Handle ambiguous user input: agent asks clarifying questions when intent is unclear
- [ ] T109 [P] Handle multiple tasks with similar titles: agent lists options and asks user to specify
- [ ] T110 [P] Handle expired confirmations: inform user and require re-request
- [ ] T111 [P] Handle non-task-related questions: agent politely redirects to task management

### Documentation

- [ ] T112 [P] Update `specs/001-ai-todo-chatbot/quickstart.md` with final setup instructions
- [ ] T113 [P] Document environment variables in `.env.example`
- [ ] T114 [P] Add API documentation comments to all endpoints
- [ ] T115 [P] Document MCP tool contracts in code comments

### Validation

- [ ] T116 Run quickstart.md validation: follow setup guide from scratch and verify all steps work
- [ ] T117 Test all 5 user stories end-to-end with real OpenRouter API
- [ ] T118 Verify all success criteria from spec.md are met
- [ ] T119 Verify constitution compliance: stateless backend, OpenRouter API, tool-based reasoning, no manual coding

**Checkpoint**: Production-ready implementation with all user stories complete

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - User stories can proceed in parallel (if staffed) or sequentially in priority order
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational - No dependencies on other stories (independent)
- **User Story 3 (P2)**: Can start after Foundational - May use list_tasks from US2 but independently testable
- **User Story 4 (P2)**: Can start after Foundational - May use list_tasks from US2 but independently testable
- **User Story 5 (P3)**: Can start after Foundational - Tests infrastructure, not dependent on other stories

### Within Each User Story

- MCP tools before agent orchestrator integration
- Agent orchestrator before chat router integration
- Core implementation before edge case handling

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- MCP tool implementations within a story marked [P] can run in parallel
- Polish tasks marked [P] can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch MCP tool and schemas in parallel:
Task T035: "Create api/src/mcp/tools/create_task.py"
Task T036: "Define OpenAI function schema for create_task"

# Then implement orchestrator (depends on tool being registered):
Task T040: "Create api/src/ai/orchestrator.py"
Task T041: "Initialize OpenAI client with OpenRouter"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T007)
2. Complete Phase 2: Foundational (T008-T034) - CRITICAL
3. Complete Phase 3: User Story 1 (T035-T056)
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add User Story 4 → Test independently → Deploy/Demo
6. Add User Story 5 → Test independently → Deploy/Demo
7. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (T035-T056)
   - Developer B: User Story 2 (T057-T069)
   - Developer C: User Story 3 (T070-T079)
3. Stories complete and integrate independently

---

## Task Summary

**Total Tasks**: 119
- Phase 1 (Setup): 7 tasks
- Phase 2 (Foundational): 27 tasks
- Phase 3 (US1 - Task Creation): 22 tasks
- Phase 4 (US2 - Task Listing): 13 tasks
- Phase 5 (US3 - Task Updates): 10 tasks
- Phase 6 (US4 - Task Deletion): 15 tasks
- Phase 7 (US5 - Conversation Continuity): 9 tasks
- Phase 8 (Polish): 16 tasks

**Parallel Opportunities**: 45 tasks marked [P] can run in parallel within their phase

**Independent Test Criteria**:
- US1: Send "Create a task to buy groceries" → task created in database
- US2: Ask "What are my tasks?" → agent lists all tasks
- US3: Say "Mark groceries as complete" → task status updated
- US4: Request deletion → agent confirms → task deleted
- US5: Restart server → continue conversation → full context preserved

**Suggested MVP Scope**: Phase 1 + Phase 2 + Phase 3 (User Story 1 only) = 56 tasks

---

## Notes

- [P] tasks = different files, no dependencies within phase
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Tests are NOT included per specification (no explicit TDD request)
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
