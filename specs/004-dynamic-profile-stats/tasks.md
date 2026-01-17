# Tasks: Dynamic Profile Statistics

**Input**: Design documents from `/specs/004-dynamic-profile-stats/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/user-stats-api.yaml

**Tests**: Tests are NOT explicitly requested in the specification, so test tasks are omitted per template guidelines.

**Organization**: Tasks are organized to enable independent implementation and validation of the core user story (viewing personal activity statistics with data isolation and real-time updates).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1 = View Personal Activity Statistics)
- Include exact file paths in descriptions

## Path Conventions

- **Phase II Web App**: `api/src/`, `web/src/`
- Backend: FastAPI in `api/`
- Frontend: Next.js in `web/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify existing project structure and dependencies

**Note**: This feature builds on existing Phase II infrastructure. Most setup is already complete.

- [x] T001 [P] Verify FastAPI project structure exists in `api/src/`
- [x] T002 [P] Verify Neon PostgreSQL connection configured in `api/src/database.py`
- [x] T003 [P] Verify Alembic migrations setup in `api/alembic/`
- [x] T004 [P] Verify Next.js project structure exists in `web/src/`
- [x] T005 [P] Verify Better Auth configuration in `web/src/lib/auth/auth.ts`
- [x] T006 [P] Verify ProfileStats component exists in `web/src/components/profile/ProfileStats.tsx`
- [x] T007 Verify CORS configuration allows frontend origin in `api/src/main.py`

**Checkpoint**: Infrastructure verified - ready for feature implementation

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before user story implementation

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Database Migration

- [x] T008 Create Alembic migration to add user_id column to todos table in `api/alembic/versions/{timestamp}_add_user_id_to_todos.py`
- [x] T009 Add index on user_id column in migration script for query performance
- [x] T010 Test migration upgrade and downgrade commands
- [x] T011 Apply migration to development database with `alembic upgrade head`
- [x] T012 Verify user_id column exists in todos table with `psql` or database client

### Authentication Middleware

- [x] T013 [P] Create auth middleware module in `api/src/middleware/auth.py`
- [x] T014 Implement Better Auth session cookie extraction from request
- [x] T015 Implement session validation against Better Auth SQLite database
- [x] T016 Implement user_id extraction from validated session
- [x] T017 Create FastAPI dependency `get_current_user` for authenticated endpoints
- [x] T018 Handle unauthenticated requests with 401 HTTPException
- [x] T019 Add auth middleware to FastAPI app in `api/src/main.py`

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - View Personal Activity Statistics (Priority: P1) 🎯 MVP

**Goal**: Authenticated users can view their real-time activity statistics (total tasks, completed tasks, completion rate, active days) on their profile page with complete data isolation between users.

**Independent Test**: Authenticate as a user, create several todos (some completed, some not), navigate to profile page, and verify displayed statistics match actual database data. Create second user with different todos and verify each user sees only their own statistics.

**Acceptance Scenarios**:
1. User with 10 todos (7 completed) sees "Total Tasks: 10", "Completed Tasks: 7", "Completion Rate: 70%"
2. User created account 15 days ago sees "Active Days: 15"
3. User with no todos sees "Total Tasks: 0", "Completed Tasks: 0", "Completion Rate: 0%" (no errors)
4. User A with 10 tasks and User B with 5 tasks each see only their own statistics
5. Statistics update correctly when user creates/completes todos and refreshes page

### Backend Service Layer

- [x] T020 [P] [US1] Create stats service module in `api/src/services/stats_service.py`
- [x] T021 [P] [US1] Implement `calculate_total_tasks(session, user_id)` function with COUNT query
- [x] T022 [P] [US1] Implement `calculate_completed_tasks(session, user_id)` function with conditional COUNT
- [x] T023 [P] [US1] Implement `calculate_completion_rate(total, completed)` function with division by zero handling
- [x] T024 [P] [US1] Implement `calculate_active_days(user_created_at)` function with UTC date difference
- [x] T025 [US1] Implement `get_user_stats(session, user_id, user_created_at)` orchestration function
- [x] T026 [US1] Add error handling for database query failures in stats service
- [x] T027 [US1] Optimize statistics query to use single aggregation query with conditional counting

### Backend Response Schema

- [x] T028 [P] [US1] Create Pydantic response schema in `api/src/schemas/user_stats.py`
- [x] T029 [P] [US1] Define UserStatsResponse model with validation rules (total_tasks >= 0, completion_rate 0-100, active_days >= 1)
- [x] T030 [P] [US1] Add example response data to schema for OpenAPI documentation

### Backend API Endpoint

- [x] T031 [P] [US1] Create users router module in `api/src/routers/users.py`
- [x] T032 [US1] Implement GET /api/v1/users/me/stats endpoint with auth dependency
- [x] T033 [US1] Query Better Auth database for user.created_at timestamp
- [x] T034 [US1] Call stats service to calculate statistics for authenticated user
- [x] T035 [US1] Return UserStatsResponse with calculated statistics
- [x] T036 [US1] Handle 401 Unauthorized for unauthenticated requests
- [x] T037 [US1] Handle 500 Internal Server Error for calculation failures
- [x] T038 [US1] Register users router in `api/src/main.py` with `/api/v1` prefix
- [x] T039 [US1] Verify OpenAPI documentation generated at `/api/v1/docs`

### Frontend Types and API Client

- [x] T040 [P] [US1] Create UserStats TypeScript interface in `web/src/types/user-stats.ts`
- [x] T041 [P] [US1] Create API client module in `web/src/lib/api/user-stats.ts`
- [x] T042 [P] [US1] Implement `getUserStats()` function with fetch and credentials: 'include'
- [x] T043 [P] [US1] Add error handling for 401 and 500 responses in API client
- [x] T044 [P] [US1] Add TypeScript return type annotation for getUserStats function

### Frontend Profile Page Integration

- [x] T045 [US1] Update profile page in `web/src/app/dashboard/profile/page.tsx`
- [x] T046 [US1] Remove local `calculateStats()` function and related logic
- [x] T047 [US1] Add state for stats (UserStats | null), isLoadingStats (boolean), statsError (string | null)
- [x] T048 [US1] Add useEffect hook to fetch stats from API on component mount
- [x] T049 [US1] Implement loading state UI with spinner during stats fetch
- [x] T050 [US1] Implement error state UI with error message and retry button
- [x] T051 [US1] Pass API response data directly to ProfileStats component props
- [x] T052 [US1] Verify ProfileStats component receives correct prop types (no changes to component itself)

### Integration and Validation

- [ ] T053 [US1] Test endpoint via Swagger UI at `/api/v1/docs` with authenticated session
- [ ] T054 [US1] Test frontend with zero todos (verify 0% completion rate, no errors)
- [ ] T055 [US1] Test frontend with partial completion (verify correct percentage calculation)
- [ ] T056 [US1] Test frontend with full completion (verify 100% completion rate)
- [ ] T057 [US1] Test with multiple users to verify data isolation (User A sees only their stats)
- [ ] T058 [US1] Test unauthenticated access returns 401 error
- [ ] T059 [US1] Test API unavailable shows error message with retry button
- [ ] T060 [US1] Test statistics update after creating/completing todos and refreshing page
- [ ] T061 [US1] Test active days calculation for account created today (should show 1)
- [ ] T062 [US1] Test active days calculation for account created 15 days ago (should show 15)
- [ ] T063 [US1] Verify API response time <500ms with 1000 todos per user
- [ ] T064 [US1] Verify no cross-user data leakage with concurrent requests

**Checkpoint**: User Story 1 complete - users can view accurate, isolated statistics

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Improvements and documentation

- [ ] T065 [P] Update API documentation in `api/README.md` with new endpoint details
- [ ] T066 [P] Update frontend documentation in `web/README.md` with stats integration
- [ ] T067 [P] Add logging for statistics calculations in `api/src/services/stats_service.py`
- [ ] T068 [P] Add logging for authentication failures in `api/src/middleware/auth.py`
- [ ] T069 [P] Verify all error messages are user-friendly (no stack traces or technical details)
- [ ] T070 [P] Run quickstart.md validation scenarios from `specs/004-dynamic-profile-stats/quickstart.md`
- [ ] T071 Code review for security (SQL injection prevention, session validation, data isolation)
- [ ] T072 Performance review (query optimization, index usage, response times)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS user story
- **User Story 1 (Phase 3)**: Depends on Foundational phase completion
- **Polish (Phase 4)**: Depends on User Story 1 completion

### Within User Story 1

**Sequential Dependencies**:
1. Backend Service Layer (T020-T027) → Backend Response Schema (T028-T030) → Backend API Endpoint (T031-T039)
2. Backend API Endpoint complete → Frontend Types and API Client (T040-T044)
3. Frontend API Client complete → Frontend Profile Page Integration (T045-T052)
4. All implementation complete → Integration and Validation (T053-T064)

**Parallel Opportunities**:
- T020-T024: All calculation functions can be implemented in parallel
- T028-T030: Schema definition tasks can run in parallel with service layer
- T031, T040-T044: Router creation and frontend types can run in parallel after service layer
- T040-T044: All frontend type and API client tasks can run in parallel
- T053-T064: All validation tests can run in parallel after implementation

### Parallel Execution Example

```bash
# After Foundational phase completes, launch backend service functions in parallel:
Task T020: "Create stats service module"
Task T021: "Implement calculate_total_tasks function"
Task T022: "Implement calculate_completed_tasks function"
Task T023: "Implement calculate_completion_rate function"
Task T024: "Implement calculate_active_days function"

# After service layer completes, launch schema and router in parallel:
Task T028: "Create Pydantic response schema"
Task T031: "Create users router module"

# After API endpoint completes, launch all frontend tasks in parallel:
Task T040: "Create UserStats TypeScript interface"
Task T041: "Create API client module"
Task T042: "Implement getUserStats function"
Task T043: "Add error handling in API client"
Task T044: "Add TypeScript return type annotation"

# After implementation completes, launch all validation tests in parallel:
Task T053-T064: All integration and validation tests
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (verify infrastructure)
2. Complete Phase 2: Foundational (database migration + auth middleware) - CRITICAL
3. Complete Phase 3: User Story 1 (backend → frontend → validation)
4. **STOP and VALIDATE**: Test all acceptance scenarios independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Complete Backend Service Layer → Statistics calculation working
3. Complete Backend API Endpoint → API accessible via Swagger
4. Complete Frontend Integration → Full feature working end-to-end
5. Complete Validation → All edge cases handled
6. Complete Polish → Production ready

### Backend-First Strategy

This feature follows a strict backend-first approach:

1. **Database First**: Migration adds user_id to todos (T008-T012)
2. **Auth Second**: Middleware validates sessions (T013-T019)
3. **Service Third**: Statistics calculation logic (T020-T027)
4. **API Fourth**: Endpoint exposes statistics (T028-T039)
5. **Frontend Last**: UI consumes API (T040-T052)
6. **Validation**: End-to-end testing (T053-T064)

This ensures each layer is testable independently before moving to the next layer.

---

## Notes

- **[P] tasks**: Different files, no dependencies - can run in parallel
- **[US1] label**: All tasks belong to User Story 1 (View Personal Activity Statistics)
- **User Story 2 & 3**: These are validation requirements built into US1 implementation, not separate features
  - US2 (Real-Time Updates): Validated by T060 (refresh behavior)
  - US3 (Data Isolation): Validated by T057, T064 (security testing)
- **No test tasks**: Tests not explicitly requested in specification
- **Backend-first**: Database → Auth → Service → API → Frontend → Validation
- **Data isolation**: All queries filtered by authenticated user_id (enforced in T021-T022, validated in T057, T064)
- **Division by zero**: Handled in T023 (returns 0.0 for empty todo list)
- **Performance**: Single aggregation query (T027), index on user_id (T009), <500ms target (T063)
- **Security**: Session validation (T013-T019), 401 handling (T036, T058), no cross-user access (T057, T064)
- **Error handling**: Graceful degradation (T049-T050), user-friendly messages (T069)
- **Commit strategy**: Commit after each task or logical group
- **Stop at checkpoints**: Validate independently before proceeding

---

## Task Count Summary

- **Total Tasks**: 72
- **Setup Phase**: 7 tasks
- **Foundational Phase**: 12 tasks (BLOCKING)
- **User Story 1 Phase**: 45 tasks (MVP)
- **Polish Phase**: 8 tasks

**Parallel Opportunities**: 28 tasks marked [P] can run in parallel within their phase

**MVP Scope**: Phases 1-3 (64 tasks) deliver complete feature

**Independent Test Criteria**: User Story 1 can be fully tested by authenticating, creating todos, and verifying statistics display correctly with complete data isolation between users.
