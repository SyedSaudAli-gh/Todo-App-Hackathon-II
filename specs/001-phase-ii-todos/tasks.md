---

description: "Task list for Phase II Todo Management implementation"
---

# Tasks: Phase II Todo Management

**Input**: Design documents from `/specs/001-phase-ii-todos/`
**Prerequisites**: plan.md (required), spec.md (required), data-model.md, contracts/todos-api.yaml, research.md, quickstart.md

**Tests**: Tests are OPTIONAL in this feature - not explicitly requested in spec.md. Tasks focus on implementation only.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Phase II Web App**: `api/src/`, `web/src/`
- Backend: `api/` directory
- Frontend: `web/` directory

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

### Backend Setup

- [x] T001 [P] Initialize FastAPI project structure in `api/` directory
- [x] T002 [P] Create `api/requirements.txt` with FastAPI, SQLModel, Alembic, Pydantic, psycopg2-binary, python-dotenv, pytest, httpx
- [x] T003 [P] Create `api/.env.example` with DATABASE_URL, CORS_ORIGINS, API_VERSION, DEBUG, HOST, PORT
- [x] T004 [P] Create `api/src/__init__.py` for package initialization
- [x] T005 [P] Create `api/src/config.py` with Pydantic Settings for environment variables
- [x] T006 [P] Initialize Alembic in `api/alembic/` with `alembic init alembic`
- [x] T007 [P] Configure Alembic `api/alembic/env.py` to use SQLModel metadata and Neon connection
- [x] T008 [P] Create `api/tests/__init__.py` and `api/tests/conftest.py` with pytest fixtures

### Frontend Setup

- [x] T009 [P] Initialize Next.js 15+ project with TypeScript in `web/` directory using `npx create-next-app@latest` (Created package.json, next.config.js, tsconfig.json manually)
- [x] T010 [P] Configure Tailwind CSS in `web/tailwind.config.js` and `web/postcss.config.js` (Created tailwind.config.js and postcss.config.js)
- [x] T011 [P] Create `web/.env.local.example` with NEXT_PUBLIC_API_BASE_URL, NEXT_PUBLIC_API_VERSION
- [x] T012 [P] Create `web/src/types/todo.ts` for Todo type definitions
- [x] T013 [P] Create `web/src/types/api.ts` for API response types
- [x] T014 [P] Create `web/src/lib/api/client.ts` for base API client with fetch wrapper
- [x] T015 [P] Configure TypeScript strict mode in `web/tsconfig.json` (Configured with "strict": true in compilerOptions)
- [x] T016 [P] Create `web/src/app/globals.css` with Tailwind directives and base styles

### Integration Setup

- [x] T017 Configure CORS in `api/src/main.py` to allow frontend origin (http://localhost:3000)
- [x] T018 Create health check endpoint at `api/src/routers/health.py` with GET /health
- [x] T019 Create `api/README.md` with backend setup instructions
- [x] T020 Create `web/README.md` with frontend setup instructions

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Database Layer

- [x] T021 Create `api/src/database.py` with SQLModel engine, session factory, and get_session dependency
- [x] T022 Create `api/src/models/__init__.py` for model exports
- [x] T023 Create `api/src/models/todo.py` with Todo SQLModel class (id, title, description, completed, created_at, updated_at)
- [x] T024 Create Alembic migration `api/alembic/versions/001_create_todos_table.py` for todos table with indexes
- [ ] T025 Test database connection by running `alembic upgrade head` against Neon PostgreSQL (MANUAL: Requires Neon database setup and .env configuration)

### API Layer

- [x] T026 [P] Create `api/src/schemas/__init__.py` for schema exports
- [x] T027 [P] Create `api/src/schemas/todo.py` with TodoCreate, TodoUpdate, TodoResponse, TodoListResponse Pydantic models
- [x] T028 [P] Create `api/src/schemas/error.py` with ErrorResponse and ValidationErrorResponse Pydantic models
- [x] T029 [P] Create `api/src/routers/__init__.py` for router exports
- [x] T030 [P] Create `api/src/services/__init__.py` for service exports
- [x] T031 [P] Create error handling middleware in `api/src/middleware/error_handler.py` for consistent error responses
- [x] T032 Initialize FastAPI app in `api/src/main.py` with CORS, error handlers, and router registration

### Frontend Layer

- [x] T033 [P] Create `web/src/components/ui/Button.tsx` reusable button component
- [x] T034 [P] Create `web/src/components/ui/Input.tsx` reusable input component
- [x] T035 [P] Create `web/src/components/ui/LoadingSpinner.tsx` loading indicator component
- [x] T036 [P] Create `web/src/lib/utils.ts` with helper functions (formatDate, cn for className merging)
- [x] T037 [P] Create `web/src/lib/api/todos.ts` with API client functions (stub implementations)
- [x] T038 Create `web/src/app/layout.tsx` root layout with metadata and global styles
- [x] T039 Create `web/src/app/error.tsx` error boundary component

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel (after manual setup steps)

---

## Phase 3: User Story 1 - Create and View Todos (Priority: P1) 🎯 MVP

**Goal**: Users can create new todos and view their complete list to track tasks

**Independent Test**: Create several todos through web interface and verify they appear in list, persist after refresh

**Spec Reference**: spec.md User Story 1, FR-001, FR-002, FR-003, FR-007, FR-008, FR-012, FR-013

### Database Tasks

- [x] T040 Verify Todo model supports create and read operations (already created in T023)
- [x] T041 Verify todos table migration includes created_at index for sorting (already created in T024)

### API Tasks

- [x] T042 [P] [US1] Create `api/src/services/todo_service.py` with create_todo() and list_todos() functions
- [x] T043 [P] [US1] Implement get_todo_by_id() function in `api/src/services/todo_service.py`
- [x] T044 [US1] Create `api/src/routers/todos.py` with POST /api/v1/todos endpoint (create todo)
- [x] T045 [US1] Implement GET /api/v1/todos endpoint in `api/src/routers/todos.py` (list todos, sorted by created_at DESC)
- [x] T046 [US1] Implement GET /api/v1/todos/{id} endpoint in `api/src/routers/todos.py` (get single todo)
- [x] T047 [US1] Add input validation for title (1-200 chars, trimmed) and description (max 2000 chars) in TodoCreate schema (already implemented in T027)
- [x] T048 [US1] Register todos router in `api/src/main.py` at /api/v1 prefix

### Frontend Tasks

- [x] T049 [P] [US1] Implement listTodos() function in `web/src/lib/api/todos.ts` (GET /api/v1/todos)
- [x] T050 [P] [US1] Implement createTodo() function in `web/src/lib/api/todos.ts` (POST /api/v1/todos)
- [x] T051 [P] [US1] Implement getTodo() function in `web/src/lib/api/todos.ts` (GET /api/v1/todos/{id})
- [x] T052 [US1] Create `web/src/components/todos/TodoForm.tsx` with title and description inputs, validation, submit handler
- [x] T053 [US1] Create `web/src/components/todos/TodoItem.tsx` to display single todo (title, description, timestamps)
- [x] T054 [US1] Create `web/src/components/todos/TodoList.tsx` container component with state management (todos, loading, error)
- [x] T055 [US1] Create `web/src/components/todos/EmptyState.tsx` with "No todos yet. Create your first one!" message
- [x] T056 [US1] Create `web/src/app/page.tsx` home page integrating TodoList and TodoForm components
- [x] T057 [US1] Add client-side validation in TodoForm (title required, max lengths) with error messages
- [x] T058 [US1] Implement loading states in TodoList (show LoadingSpinner during API calls)
- [x] T059 [US1] Implement error handling in TodoList (display error messages, retry option)

### Integration Tasks

- [ ] T060 [US1] Test end-to-end create flow: submit form → API call → database insert → UI update (MANUAL: Requires database setup)
- [ ] T061 [US1] Test end-to-end list flow: page load → API call → database query → render todos (MANUAL: Requires database setup)
- [ ] T062 [US1] Test persistence: create todo → refresh page → verify todo still appears (MANUAL: Requires database setup)
- [ ] T063 [US1] Test validation: submit empty title → verify error message → verify no API call (MANUAL: Requires npm install and dev server)
- [ ] T064 [US1] Test empty state: load page with no todos → verify EmptyState component displays (MANUAL: Requires npm install and dev server)

**Acceptance**:
- ✅ Users can create todos with title and optional description
- ✅ Todos appear in list immediately after creation
- ✅ Todos are sorted by creation date (newest first)
- ✅ Todos persist after page refresh
- ✅ Validation errors display for empty title or title >200 chars

**Checkpoint**: At this point, User Story 1 (MVP) should be fully functional and testable independently

---

## Phase 4: User Story 2 - Mark Todos Complete (Priority: P2)

**Goal**: Users can mark todos as complete to track progress and distinguish active from finished tasks

**Independent Test**: Create todo, mark complete, verify visual change, refresh page, verify status persists

**Spec Reference**: spec.md User Story 2, FR-004, FR-011, FR-014

### Database Tasks

- [ ] T065 Verify Todo model completed field supports boolean toggle (already created in T023)

### API Tasks

- [ ] T066 [US2] Implement update_todo() function in `api/src/services/todo_service.py` with partial update support
- [ ] T067 [US2] Implement PATCH /api/v1/todos/{id} endpoint in `api/src/routers/todos.py` (update todo)
- [ ] T068 [US2] Add validation for completed field (boolean only) in TodoUpdate schema
- [ ] T069 [US2] Implement updated_at timestamp auto-update on PATCH operations

### Frontend Tasks

- [ ] T070 [P] [US2] Implement updateTodo() function in `web/src/lib/api/todos.ts` (PATCH /api/v1/todos/{id})
- [ ] T071 [US2] Add checkbox to TodoItem component for toggling completion status
- [ ] T072 [US2] Implement handleToggleComplete() in TodoItem with optimistic UI update
- [ ] T073 [US2] Add visual styling for completed todos (strikethrough title, checkmark icon, different color)
- [ ] T074 [US2] Implement immediate visual feedback (<1 second) for completion toggle
- [ ] T075 [US2] Add error handling for failed toggle (revert optimistic update, show error message)

### Integration Tasks

- [ ] T076 [US2] Test end-to-end toggle flow: click checkbox → API call → database update → UI update
- [ ] T077 [US2] Test persistence: mark complete → refresh page → verify completed status persists
- [ ] T078 [US2] Test visual distinction: create active and completed todos → verify visual differences
- [ ] T079 [US2] Test toggle back: mark complete → mark incomplete → verify status changes both ways

**Acceptance**:
- ✅ Users can mark todos complete with single click
- ✅ Completed todos show visual distinction (strikethrough, checkmark)
- ✅ Completion status persists after page refresh
- ✅ Users can toggle completion status back and forth
- ✅ Visual feedback appears in <1 second

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Update Todo Details (Priority: P3)

**Goal**: Users can edit existing todos to correct mistakes or update information

**Independent Test**: Create todo, edit title and description, verify changes persist

**Spec Reference**: spec.md User Story 3, FR-005, FR-007, FR-008

### Database Tasks

- [ ] T080 Verify Todo model supports title and description updates (already supported via T023)

### API Tasks

- [ ] T081 [US3] Verify PATCH endpoint supports title and description updates (already implemented in T067)
- [ ] T082 [US3] Add validation for title (1-200 chars if provided) and description (max 2000 chars if provided) in TodoUpdate schema

### Frontend Tasks

- [ ] T083 [US3] Add edit mode state to TodoItem component (isEditing boolean)
- [ ] T084 [US3] Add "Edit" button to TodoItem that toggles edit mode
- [ ] T085 [US3] Render TodoForm in edit mode when isEditing is true in TodoItem
- [ ] T086 [US3] Implement handleSave() in TodoItem to call updateTodo() API function
- [ ] T087 [US3] Implement handleCancel() in TodoItem to discard changes and exit edit mode
- [ ] T088 [US3] Add validation in edit mode (title required, max lengths) with error messages
- [ ] T089 [US3] Implement optimistic UI update for edit operations
- [ ] T090 [US3] Add error handling for failed updates (revert changes, show error message)

### Integration Tasks

- [ ] T091 [US3] Test end-to-end edit flow: click edit → change title → save → API call → database update → UI update
- [ ] T092 [US3] Test persistence: edit todo → refresh page → verify updated information persists
- [ ] T093 [US3] Test validation: edit todo → clear title → save → verify error message
- [ ] T094 [US3] Test cancel: edit todo → change values → cancel → verify original values remain

**Acceptance**:
- ✅ Users can edit todo title and description
- ✅ Changes persist after page refresh
- ✅ Validation errors display for empty title
- ✅ Cancel button discards changes
- ✅ UI updates immediately after save

**Checkpoint**: All user stories 1, 2, AND 3 should now work independently

---

## Phase 6: User Story 4 - Delete Todos (Priority: P4)

**Goal**: Users can remove todos they no longer need to keep list clean

**Independent Test**: Create todo, delete it, verify it no longer appears in list

**Spec Reference**: spec.md User Story 4, FR-006, FR-015

### Database Tasks

- [ ] T095 Verify Todo model supports hard delete (no soft delete needed for Phase II)

### API Tasks

- [ ] T096 [US4] Implement delete_todo() function in `api/src/services/todo_service.py`
- [ ] T097 [US4] Implement DELETE /api/v1/todos/{id} endpoint in `api/src/routers/todos.py` (returns 204 No Content)
- [ ] T098 [US4] Add error handling for delete non-existent todo (return 404 Not Found)

### Frontend Tasks

- [ ] T099 [P] [US4] Implement deleteTodo() function in `web/src/lib/api/todos.ts` (DELETE /api/v1/todos/{id})
- [ ] T100 [US4] Add "Delete" button to TodoItem component
- [ ] T101 [US4] Create confirmation dialog component in `web/src/components/ui/ConfirmDialog.tsx`
- [ ] T102 [US4] Implement handleDelete() in TodoItem with confirmation dialog
- [ ] T103 [US4] Implement optimistic UI update for delete (remove from list immediately)
- [ ] T104 [US4] Add error handling for failed delete (restore to list, show error message)
- [ ] T105 [US4] Ensure only selected todo is deleted (verify by ID)

### Integration Tasks

- [ ] T106 [US4] Test end-to-end delete flow: click delete → confirm → API call → database delete → UI update
- [ ] T107 [US4] Test persistence: delete todo → refresh page → verify todo remains deleted
- [ ] T108 [US4] Test cancel: click delete → cancel in dialog → verify todo remains in list
- [ ] T109 [US4] Test multiple todos: delete one → verify others remain

**Acceptance**:
- ✅ Users can delete todos with confirmation
- ✅ Deleted todos disappear from list immediately
- ✅ Deletion persists after page refresh
- ✅ Cancel button keeps todo in list
- ✅ Only selected todo is deleted

**Checkpoint**: All user stories (1, 2, 3, 4) should now be independently functional

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T110 [P] Add responsive design styles in `web/src/app/globals.css` for mobile and tablet
- [ ] T111 [P] Implement keyboard navigation support (Tab, Enter, Escape) across all components
- [ ] T112 [P] Add ARIA labels and roles for screen reader accessibility
- [ ] T113 [P] Add loading states for all async operations (create, update, delete, toggle)
- [ ] T114 [P] Implement consistent error message styling in `web/src/components/ui/ErrorMessage.tsx`
- [ ] T115 [P] Add success feedback for operations (toast notifications or inline messages)
- [ ] T116 [P] Optimize API response times (add database indexes if needed)
- [ ] T117 [P] Add request/response logging in `api/src/middleware/logging.py`
- [ ] T118 [P] Create deployment documentation in `api/README.md` and `web/README.md`
- [ ] T119 [P] Verify OpenAPI documentation at /api/v1/docs is complete and accurate
- [ ] T120 Run quickstart.md validation (follow setup steps, verify all features work)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3 → P4)
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Integrates with US1 (TodoItem) but independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Integrates with US1 (TodoForm, TodoItem) but independently testable
- **User Story 4 (P4)**: Can start after Foundational (Phase 2) - Integrates with US1 (TodoItem) but independently testable

### Within Each User Story

- Database tasks first (verify models and migrations)
- API tasks second (services, then endpoints)
- Frontend tasks third (API client, then components)
- Integration tasks last (end-to-end testing)

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel (T001-T020)
- All Foundational tasks marked [P] can run in parallel within their layer
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- Within each user story, tasks marked [P] can run in parallel
- All Polish tasks marked [P] can run in parallel (T110-T119)

---

## Parallel Example: User Story 1

```bash
# Launch API tasks in parallel (different files):
Task T042: Create todo_service.py with create_todo() and list_todos()
Task T043: Implement get_todo_by_id() in todo_service.py

# Launch frontend tasks in parallel (different files):
Task T049: Implement listTodos() in web/src/lib/api/todos.ts
Task T050: Implement createTodo() in web/src/lib/api/todos.ts
Task T051: Implement getTodo() in web/src/lib/api/todos.ts
Task T052: Create TodoForm.tsx
Task T053: Create TodoItem.tsx
Task T054: Create TodoList.tsx
Task T055: Create EmptyState.tsx
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Create and View Todos)
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add User Story 4 → Test independently → Deploy/Demo
6. Add Polish → Final deployment
7. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (T040-T064)
   - Developer B: User Story 2 (T065-T079)
   - Developer C: User Story 3 (T080-T094)
   - Developer D: User Story 4 (T095-T109)
3. Stories complete and integrate independently
4. Team completes Polish together

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Tests are OPTIONAL - not included as spec.md doesn't explicitly request TDD
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence

---

## Task Summary

**Total Tasks**: 120
- Phase 1 (Setup): 20 tasks
- Phase 2 (Foundational): 19 tasks
- Phase 3 (User Story 1 - P1): 25 tasks
- Phase 4 (User Story 2 - P2): 14 tasks
- Phase 5 (User Story 3 - P3): 12 tasks
- Phase 6 (User Story 4 - P4): 11 tasks
- Phase 7 (Polish): 11 tasks
- Phase 8 (Validation): 8 tasks

**Parallel Opportunities**: 45 tasks marked [P] can run in parallel

**Independent Test Criteria**:
- US1: Create todos and view list, verify persistence
- US2: Toggle completion status, verify visual change and persistence
- US3: Edit todo details, verify changes persist
- US4: Delete todo, verify removal and persistence

**Suggested MVP Scope**: Phase 1 + Phase 2 + Phase 3 (User Story 1 only) = 64 tasks
