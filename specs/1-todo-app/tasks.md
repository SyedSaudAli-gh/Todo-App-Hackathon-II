---
description: "Task list for In-Memory Python Todo App implementation"
---

# Tasks: In-Memory Python Todo App

**Input**: Design documents from `/specs/1-todo-app/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Test tasks included as specified in functional requirements and success criteria.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create project structure per implementation plan
- [X] T002 [P] Create src directory structure: src/models/, src/services/, src/cli/, src/lib/
- [X] T003 [P] Create tests directory structure: tests/unit/, tests/integration/
- [X] T004 Create main application file todo_app.py

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

Foundational tasks based on the data model and core requirements:

- [X] T005 Create TodoItem model in src/models/todo_item.py
- [X] T006 Create validators module in src/lib/validators.py
- [X] T007 Create todo manager service in src/services/todo_manager.py (skeleton)
- [X] T008 Create CLI interface module in src/cli/cli_interface.py (skeleton)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Add Todo Items (Priority: P1) 🎯 MVP

**Goal**: Allow users to add new todo items to their list through the console interface

**Independent Test**: Can be fully tested by adding a todo item and verifying it appears in the list. Delivers core value of capturing tasks.

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T009 [P] [US1] Unit test for TodoItem model in tests/unit/test_todo_item.py
- [X] T010 [P] [US1] Contract test for add command in tests/contract/test_add_command.py
- [X] T011 [US1] Integration test for add functionality in tests/integration/test_add_feature.py

### Implementation for User Story 1

- [X] T012 [US1] Implement TodoItem model with properties: id, description, completed, created_at in src/models/todo_item.py
- [X] T013 [US1] Implement validation for TodoItem description in src/lib/validators.py
- [X] T014 [US1] Implement add_item method in src/services/todo_manager.py
- [X] T015 [US1] Implement add command handler in src/cli/cli_interface.py
- [X] T016 [US1] Integrate add functionality in main todo_app.py
- [X] T017 [US1] Add error handling for empty descriptions in src/lib/validators.py

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - View Todo Items (Priority: P2)

**Goal**: Allow users to see all their current todo items in a readable format

**Independent Test**: Can be fully tested by adding items and then viewing the list. Delivers visibility into stored tasks.

### Tests for User Story 2 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T018 [P] [US2] Contract test for list command in tests/contract/test_list_command.py
- [X] T019 [US2] Integration test for list functionality in tests/integration/test_list_feature.py

### Implementation for User Story 2

- [X] T020 [US2] Implement get_all_items method in src/services/todo_manager.py
- [X] T021 [US2] Implement list command handler in src/cli/cli_interface.py
- [X] T022 [US2] Add list formatting logic to display items with completion status
- [X] T023 [US2] Integrate list functionality in main todo_app.py

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Mark Todo Items Complete (Priority: P3)

**Goal**: Allow users to mark todo items as complete to track their progress

**Independent Test**: Can be fully tested by adding an item, marking it complete, and viewing the updated status. Delivers progress tracking functionality.

### Tests for User Story 3 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T024 [P] [US3] Contract test for complete command in tests/contract/test_complete_command.py
- [X] T025 [US3] Integration test for complete functionality in tests/integration/test_complete_feature.py

### Implementation for User Story 3

- [X] T026 [US3] Implement mark_complete method in src/services/todo_manager.py
- [X] T027 [US3] Implement complete command handler in src/cli/cli_interface.py
- [X] T028 [US3] Add position validation for complete operation in src/lib/validators.py
- [X] T029 [US3] Integrate complete functionality in main todo_app.py

**Checkpoint**: At this point, User Stories 1, 2 AND 3 should all work independently

---

## Phase 6: User Story 4 - Delete Todo Items (Priority: P4)

**Goal**: Allow users to remove todo items that are no longer needed

**Independent Test**: Can be fully tested by adding items, deleting one, and verifying it's no longer in the list. Delivers list management capability.

### Tests for User Story 4 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T030 [P] [US4] Contract test for delete command in tests/contract/test_delete_command.py
- [X] T031 [US4] Integration test for delete functionality in tests/integration/test_delete_feature.py

### Implementation for User Story 4

- [X] T032 [US4] Implement delete_item method in src/services/todo_manager.py
- [X] T033 [US4] Implement delete command handler in src/cli/cli_interface.py
- [X] T034 [US4] Add position validation and renumbering logic in src/services/todo_manager.py
- [X] T035 [US4] Integrate delete functionality in main todo_app.py

**Checkpoint**: At this point, User Stories 1, 2, 3 AND 4 should all work independently

---

## Phase 7: User Story 5 - Update Todo Items (Priority: P5)

**Goal**: Allow users to modify the text of an existing todo item

**Independent Test**: Can be fully tested by adding an item, updating its text, and verifying the change. Delivers text modification capability.

### Tests for User Story 5 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T036 [P] [US5] Contract test for update command in tests/contract/test_update_command.py
- [X] T037 [US5] Integration test for update functionality in tests/integration/test_update_feature.py

### Implementation for User Story 5

- [X] T038 [US5] Implement update_item method in src/services/todo_manager.py
- [X] T039 [US5] Implement update command handler in src/cli/cli_interface.py
- [X] T040 [US5] Add validation for updated description in src/lib/validators.py
- [X] T041 [US5] Integrate update functionality in main todo_app.py

**Checkpoint**: All user stories should now be independently functional

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T042 [P] Add comprehensive error handling for all operations in src/lib/validators.py
- [X] T043 [P] Add command parsing logic in main todo_app.py
- [X] T044 [P] Add help command functionality in src/cli/cli_interface.py
- [X] T045 [P] Add edge case handling (invalid positions, empty descriptions) in src/lib/validators.py
- [X] T046 [P] Documentation updates in README.md
- [X] T047 Code cleanup and refactoring
- [X] T048 [P] Additional unit tests in tests/unit/
- [X] T049 Run quickstart.md validation
- [X] T050 Final integration testing across all features

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3 → P4 → P5)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable
- **User Story 4 (P4)**: Can start after Foundational (Phase 2) - May integrate with US1/US2/US3 but should be independently testable
- **User Story 5 (P5)**: Can start after Foundational (Phase 2) - May integrate with US1/US2/US3/US4 but should be independently testable

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
# Launch all tests for User Story 1 together:
Task: "Unit test for TodoItem model in tests/unit/test_todo_item.py"
Task: "Contract test for add command in tests/contract/test_add_command.py"
Task: "Integration test for add functionality in tests/integration/test_add_feature.py"

# Launch all models for User Story 1 together:
Task: "Implement TodoItem model with properties: id, description, completed, created_at in src/models/todo_item.py"
Task: "Implement validation for TodoItem description in src/lib/validators.py"
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
5. Add User Story 4 → Test independently → Deploy/Demo
6. Add User Story 5 → Test independently → Deploy/Demo
7. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
   - Developer D: User Story 4
   - Developer E: User Story 5
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