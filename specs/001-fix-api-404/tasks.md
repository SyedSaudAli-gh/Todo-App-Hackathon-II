# Implementation Tasks: Fix API Endpoint Path Mismatch

**Feature**: 001-fix-api-404
**Branch**: `001-fix-api-404`
**Spec**: [spec.md](./spec.md)
**Plan**: [plan.md](./plan.md)
**Date**: 2026-01-19

## Overview

Fix the 404 Not Found errors by updating frontend API endpoint paths from `/todos` to `/tasks` to match the backend implementation. This is a single-file bug fix that will restore all todo CRUD operations.

**Total Tasks**: 12
**Estimated Complexity**: Low (single file, 5 line changes)
**Risk Level**: Low (frontend-only, easy rollback)

## Implementation Strategy

This bug fix follows a verify-fix-test approach:
1. **Verify** the backend is correct and serving `/api/tasks`
2. **Fix** all endpoint references in the frontend
3. **Test** all CRUD operations work without 404 errors

Since all 5 endpoint changes are in a single file and interdependent, they should be implemented together as one atomic change. The user stories (load, create, update, delete) will all be satisfied by this single fix.

## Task Phases

### Phase 1: Setup & Verification (2 tasks)

**Goal**: Verify environment is ready and backend is correct

- [ ] T001 Verify backend server is running on port 8001 and accessible
- [ ] T002 Verify backend serves endpoints at `/api/tasks` using curl or browser

**Acceptance**: Backend responds with 200 OK to `GET /api/tasks` with valid JWT token

---

### Phase 2: Fix Endpoint Paths (1 task)

**Goal**: Update all endpoint references to match backend specification

**User Stories Addressed**: US1 (Load), US2 (Create), US3 (Update), US4 (Delete)

- [ ] T003 [US1][US2][US3][US4] Update all 5 endpoint paths in web/src/lib/api/todos.ts from `/todos` to `/tasks`

**File**: `web/src/lib/api/todos.ts`

**Changes Required**:
```typescript
// Line 10: List todos
- return apiClient<TodoListResponse>('/todos');
+ return apiClient<TodoListResponse>('/tasks');

// Line 14: Create todo
- return apiClient<Todo>('/todos', {
+ return apiClient<Todo>('/tasks', {

// Line 21: Get single todo
- return apiClient<Todo>(`/todos/${id}`);
+ return apiClient<Todo>(`/tasks/${id}`);

// Line 24: Update todo
- return apiClient<Todo>(`/todos/${id}`, {
+ return apiClient<Todo>(`/tasks/${id}`, {

// Line 32: Delete todo
- return apiClient<void>(`/todos/${id}`, {
+ return apiClient<void>(`/tasks/${id}`, {
```

**Acceptance**: All 5 endpoint references use `/tasks` instead of `/todos`

---

### Phase 3: Verification & Testing (9 tasks)

**Goal**: Verify all CRUD operations work and no regressions introduced

#### User Story 1: Load Existing Todos (P1)

- [ ] T004 [US1] Test: Navigate to /dashboard/todos and verify todos load without 404 errors
- [ ] T005 [US1] Test: Verify empty state displays correctly when user has no todos (not an error)
- [ ] T006 [US1] Test: Verify JWT token is attached to GET /api/tasks request

**Acceptance**: Todos page loads successfully, displays todos or empty state, no 404 errors in console

#### User Story 2: Create New Todos (P1)

- [ ] T007 [US2] Test: Create a new todo via UI and verify it appears in the list
- [ ] T008 [US2] Test: Verify POST /api/tasks returns 201 status code
- [ ] T009 [US2] Test: Verify created todo persists after page refresh

**Acceptance**: Todo creation works, returns 201, todo persists, no 404 errors

#### User Story 3: Update Existing Todos (P2)

- [ ] T010 [US3] Test: Mark an existing todo as complete and verify status updates
- [ ] T011 [US3] Test: Verify PATCH /api/tasks/{id} returns 200 status code

**Acceptance**: Todo updates work, returns 200, changes persist, no 404 errors

#### User Story 4: Delete Todos (P2)

- [ ] T012 [US4] Test: Delete an existing todo and verify it's removed from the list
- [ ] T013 [US4] Test: Verify DELETE /api/tasks/{id} returns 204 status code

**Acceptance**: Todo deletion works, returns 204, todo doesn't reappear, no 404 errors

---

## Task Dependencies

### Dependency Graph

```
T001 (Verify backend) ──┐
T002 (Verify endpoints) ─┴─→ T003 (Fix paths) ──┬─→ T004-T006 (US1 Tests)
                                                  ├─→ T007-T009 (US2 Tests)
                                                  ├─→ T010-T011 (US3 Tests)
                                                  └─→ T012-T013 (US4 Tests)
```

### Critical Path

1. **Setup** (T001-T002): Verify environment
2. **Fix** (T003): Update endpoint paths
3. **Test** (T004-T013): Verify all operations work

### Parallel Execution Opportunities

**After T003 completes**, all test tasks can run in parallel:
- T004-T006 (US1 tests) can run independently
- T007-T009 (US2 tests) can run independently
- T010-T011 (US3 tests) can run independently
- T012-T013 (US4 tests) can run independently

However, for logical flow, it's recommended to test in order: Load → Create → Update → Delete

---

## Independent Testing Per User Story

### User Story 1 (P1): Load Existing Todos

**Independent Test**:
1. Ensure backend has at least one todo for test user
2. Navigate to /dashboard/todos
3. Verify todos display without errors
4. Check console for no 404 errors
5. Verify JWT token in request headers

**Success Criteria**: Todos load successfully, no 404 errors

---

### User Story 2 (P1): Create New Todos

**Independent Test**:
1. Navigate to /dashboard/todos
2. Fill in todo creation form (title + description)
3. Submit form
4. Verify todo appears in list immediately
5. Refresh page and verify todo persists
6. Check console for no 404 errors

**Success Criteria**: Todo created successfully, persists, no 404 errors

---

### User Story 3 (P2): Update Existing Todos

**Independent Test**:
1. Navigate to /dashboard/todos
2. Click checkbox to mark todo as complete
3. Verify todo status updates immediately
4. Refresh page and verify status persists
5. Check console for no 404 errors

**Success Criteria**: Todo updates successfully, persists, no 404 errors

---

### User Story 4 (P2): Delete Todos

**Independent Test**:
1. Navigate to /dashboard/todos
2. Click delete button on a todo
3. Verify todo disappears from list immediately
4. Refresh page and verify todo doesn't reappear
5. Check console for no 404 errors

**Success Criteria**: Todo deleted successfully, doesn't reappear, no 404 errors

---

## MVP Scope

**Minimum Viable Product**: Complete all tasks (T001-T013)

Since this is a bug fix, all tasks must be completed to restore functionality. There is no partial MVP - the fix is atomic.

**Recommended Approach**:
1. Complete Phase 1 (T001-T002) to verify environment
2. Complete Phase 2 (T003) to apply the fix
3. Complete Phase 3 (T004-T013) to verify all operations work

**Total Implementation Time**: ~30 minutes
- Setup & Verification: 5 minutes
- Fix: 2 minutes (5 line changes)
- Testing: 20 minutes (manual testing of all CRUD operations)

---

## Regression Testing

After completing all tasks, verify no regressions:

1. **JWT Authentication**: Still works correctly
   - Login flow unchanged
   - Token generation unchanged
   - Token attachment to requests unchanged

2. **Error Handling**: Still works correctly
   - Network errors display appropriate messages
   - Server errors display appropriate messages
   - 404 errors only for actual missing resources

3. **Other Features**: Still work correctly
   - Dashboard loads
   - Profile page loads
   - Navigation works
   - Logout works

---

## Rollback Plan

If issues occur after deployment:

1. **Immediate Rollback**: Revert commit
   ```bash
   git revert HEAD
   git push
   ```

2. **Verify Rollback**: Test that previous behavior returns
   - 404 errors should reappear (confirming rollback)

3. **Debug**: Investigate what went wrong
   - Check for typos in endpoint paths
   - Verify backend is still running
   - Check JWT token is still being attached

4. **Re-apply Fix**: After debugging, re-apply with corrections

---

## Success Metrics

### Immediate Success Indicators
- ✅ No 404 errors in browser console
- ✅ All CRUD operations complete successfully
- ✅ JWT authentication still works
- ✅ No regressions in other features

### Long-Term Success Indicators
- ✅ Zero 404 errors in production logs for `/api/tasks`
- ✅ 100% success rate for valid todo operations
- ✅ No user-reported issues related to todos

---

## Notes

- This is a simple bug fix with low risk
- All changes are in a single file
- No backend, database, or authentication changes needed
- Frontend-only deployment with zero downtime
- Easy rollback if needed

---

## Format Validation

✅ All tasks follow checklist format: `- [ ] [TaskID] [Labels] Description`
✅ Task IDs sequential: T001-T013
✅ User story labels present: [US1], [US2], [US3], [US4]
✅ File paths specified where applicable
✅ Dependencies clearly documented
✅ Independent test criteria defined for each user story
✅ MVP scope identified (all tasks required)
