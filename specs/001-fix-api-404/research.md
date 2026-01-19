# Research: Fix API Endpoint Path Mismatch

**Feature**: 001-fix-api-404
**Date**: 2026-01-19
**Status**: Complete

## Research Questions

### Q1: What is the correct backend endpoint path?

**Investigation**:
- Examined `api/src/routers/todos.py`
- Examined `api/src/main.py` router configuration
- Tested backend endpoints with curl

**Finding**: Backend correctly serves endpoints at `/api/tasks`

**Evidence**:
```python
# api/src/routers/todos.py
@router.post("/tasks", ...)  # Creates todo
@router.get("/tasks", ...)   # Lists todos
@router.get("/tasks/{todo_id}", ...)  # Gets single todo
@router.patch("/tasks/{todo_id}", ...)  # Updates todo
@router.delete("/tasks/{todo_id}", ...)  # Deletes todo
```

**Conclusion**: Backend is specification-compliant. No backend changes needed.

---

### Q2: Where is the frontend making incorrect API calls?

**Investigation**:
- Searched codebase for `/todos` references
- Examined `web/src/lib/api/todos.ts`
- Examined `web/src/lib/api/client.ts`

**Finding**: Only `web/src/lib/api/todos.ts` contains incorrect endpoint paths

**Evidence**:
```bash
$ grep -r "/todos" web/src --include="*.ts" --include="*.tsx"
web/src/lib/api/todos.ts:  return apiClient<TodoListResponse>('/todos');
web/src/lib/api/todos.ts:  return apiClient<Todo>('/todos', {
web/src/lib/api/todos.ts:  return apiClient<Todo>(`/todos/${id}`);
web/src/lib/api/todos.ts:  return apiClient<Todo>(`/todos/${id}`, {
web/src/lib/api/todos.ts:  return apiClient<void>(`/todos/${id}`, {
```

**Conclusion**: Single file needs modification. All 5 endpoint references must change from `/todos` to `/tasks`.

---

### Q3: Will changing endpoint paths affect JWT authentication?

**Investigation**:
- Examined `web/src/lib/api/client.ts` (handles JWT)
- Examined `web/src/lib/auth/jwt-manager.ts` (manages tokens)
- Reviewed JWT implementation guide

**Finding**: JWT authentication is handled in `client.ts`, independent of endpoint paths

**Evidence**:
```typescript
// client.ts constructs URL and adds JWT
const url = `${API_BASE_URL}/api${endpoint}`;  // endpoint is parameter
const config = {
  headers: {
    'Authorization': `Bearer ${token}`,  // JWT added regardless of endpoint
  }
};
```

**Conclusion**: JWT authentication will continue to work correctly. No authentication changes needed.

---

### Q4: Are there any API versioning considerations?

**Investigation**:
- Examined current `client.ts` implementation
- Checked for `/v1` or version prefixes
- Reviewed backend route configuration

**Finding**: API versioning was previously removed from `client.ts`

**Evidence**:
```typescript
// Current implementation (line 45)
const url = `${API_BASE_URL}/api${endpoint}`;
// Note: No /v1 prefix - was removed in recent update
```

**Backend routes**:
```python
# Backend serves both paths for compatibility
app.include_router(todos_router, prefix="/api/v1", tags=["todos"])
app.include_router(todos_router, prefix="/api", tags=["tasks"])
```

**Conclusion**: Use `/api/tasks` without version prefix. Backend supports both `/api/v1/tasks` and `/api/tasks` for compatibility.

---

## Decisions

### Decision 1: Endpoint Path

**Decision**: Change all endpoint references from `/todos` to `/tasks` in `web/src/lib/api/todos.ts`

**Rationale**:
- Backend is specification-compliant with `/api/tasks`
- Frontend must match backend specification
- Single file change minimizes risk
- No authentication or logic changes required

**Alternatives Considered**:
1. **Change backend to `/todos`**
   - Rejected: Backend is correct per specification
   - Would require backend code changes and redeployment
   - Would break specification compliance

2. **Add alias route in backend**
   - Rejected: Unnecessary complexity
   - Would maintain incorrect frontend code
   - Would create two paths for same resource

3. **Use environment variable for endpoint name**
   - Rejected: Overkill for simple bug fix
   - Would add configuration complexity
   - Endpoint name should be consistent, not configurable

**Implementation**: Simple find-and-replace operation in `todos.ts`

---

### Decision 2: Testing Approach

**Decision**: Manual end-to-end testing of all CRUD operations

**Rationale**:
- Simple change with clear acceptance criteria
- Existing backend tests already validate endpoints
- Manual testing sufficient for single-file bug fix
- Can verify JWT authentication still works

**Testing Steps**:
1. Start backend on port 8001
2. Start frontend on port 3000
3. Login as test user (alice@test.com)
4. Verify JWT token generated
5. Test all CRUD operations:
   - List todos (GET /api/tasks)
   - Create todo (POST /api/tasks)
   - Update todo (PATCH /api/tasks/{id})
   - Delete todo (DELETE /api/tasks/{id})
6. Verify no 404 errors in console
7. Verify JWT authentication still works

---

### Decision 3: Deployment Strategy

**Decision**: Frontend-only deployment with immediate effect

**Rationale**:
- No backend changes required
- No database changes required
- Frontend hot-reloads in development
- Zero downtime in production
- Easy rollback if needed (revert commit)

**Deployment Steps**:
1. Commit changes to `001-fix-api-404` branch
2. Test locally with both servers running
3. Merge to main branch
4. Frontend auto-deploys (Vercel or similar)
5. Verify in production

**Rollback Plan**:
- Revert commit if issues occur
- Frontend-only change, no database rollback needed
- No backend coordination required

---

## Technical Findings

### Current URL Construction

**Frontend**:
```typescript
// todos.ts
apiClient('/todos')  // Wrong

// client.ts
const url = `${API_BASE_URL}/api${endpoint}`;
// Results in: http://localhost:8001/api/todos
```

**Backend**:
```python
# Serves at /api/tasks
# Does NOT serve at /api/todos
# Result: 404 Not Found
```

### Fixed URL Construction

**Frontend**:
```typescript
// todos.ts
apiClient('/tasks')  // Correct

// client.ts
const url = `${API_BASE_URL}/api${endpoint}`;
// Results in: http://localhost:8001/api/tasks
```

**Backend**:
```python
# Serves at /api/tasks
# Matches frontend request
# Result: 200 OK (or 201, 204 depending on operation)
```

---

## Best Practices Applied

### 1. API Endpoint Naming
- Use plural nouns for resources: `/tasks` not `/task`
- Use consistent naming across frontend and backend
- Follow REST conventions

### 2. Error Handling
- Maintain existing error handling in `client.ts`
- 404 errors will now only occur for actual missing resources
- JWT authentication errors still handled correctly

### 3. Code Organization
- Keep endpoint paths centralized in `todos.ts`
- API client wrapper (`client.ts`) remains generic
- Components use API functions, not direct calls

---

## Risks and Mitigations

### Risk 1: Typo in Endpoint Path
**Likelihood**: Low
**Impact**: High (would cause same 404 errors)
**Mitigation**: Careful code review, test all operations

### Risk 2: Missing an Occurrence
**Likelihood**: Very Low
**Impact**: Medium (some operations would still fail)
**Mitigation**: Used grep to find all occurrences, only 5 found in single file

### Risk 3: Breaking Other API Calls
**Likelihood**: Very Low
**Impact**: Medium
**Mitigation**: Only modifying `todos.ts`, other API modules unaffected

---

## Conclusion

**Research Complete**: All questions answered, decisions made, implementation approach validated.

**Key Findings**:
1. Backend is correct at `/api/tasks`
2. Frontend needs 5 changes in single file
3. JWT authentication unaffected
4. No versioning considerations
5. Simple, low-risk fix

**Ready for Implementation**: Yes - proceed to `/sp.tasks` to generate atomic tasks.
