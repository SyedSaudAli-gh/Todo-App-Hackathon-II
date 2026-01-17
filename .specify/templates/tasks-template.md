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

- **Phase II Web App** (RECOMMENDED): `api/src/`, `web/src/`
- **Phase I Single project** (DEPRECATED): `src/`, `tests/` at repository root
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume Phase II web app - adjust based on plan.md structure

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
