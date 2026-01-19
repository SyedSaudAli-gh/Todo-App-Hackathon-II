# Implementation Plan: Fix API Endpoint Path Mismatch

**Branch**: `001-fix-api-404` | **Date**: 2026-01-19 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-fix-api-404/spec.md`

## Summary

Fix the 404 Not Found errors occurring when the frontend attempts to perform todo operations. The root cause is an endpoint path mismatch: the frontend is calling `/api/todos` while the backend serves endpoints at `/api/tasks`. This is a simple bug fix requiring a find-and-replace operation in the frontend API client module to align with the backend's correct endpoint paths.

**Technical Approach**: Update all endpoint references in `web/src/lib/api/todos.ts` from `/todos` to `/tasks` to match the backend API specification. No changes needed to authentication, API client configuration, or backend code.

## Technical Context

**Project Type**: Phase II Full-Stack Web Application

### Phase II Full-Stack Web Application

**Frontend**:
- Framework: Next.js 15.5.9 with App Router
- UI Library: React 19+ with hooks
- Language: TypeScript 5+ (strict mode)
- Styling: Tailwind CSS 3+
- State Management: React hooks, Context API
- HTTP Client: fetch API with custom wrapper
- Authentication: Better Auth with JWT tokens (RS256)
- Deployment: Running on localhost:3000

**Backend**:
- Framework: FastAPI
- Language: Python 3.13+
- Validation: Pydantic v2
- ORM: SQLModel (SQLAlchemy + Pydantic)
- Authentication: JWT validation with RS256
- API Endpoints: `/api/tasks` (specification-compliant)
- Deployment: Running on localhost:8001

**Database**:
- Database: Neon PostgreSQL (serverless)
- ORM: SQLModel
- Primary Keys: Auto-increment integers
- User Isolation: Enforced via user_id from JWT 'sub' claim

**Testing**:
- Frontend: Manual testing via browser
- Backend: Automated tests with pytest
- E2E: Manual verification of all CRUD operations
- API: curl/Postman for endpoint validation

### Performance Goals
- API response time: <500ms p95 (already met)
- Frontend load time: <2s (already met)
- No performance changes expected from this fix

### Constraints
- Must maintain existing JWT authentication behavior
- Must not break any other API calls
- Must preserve all error handling logic
- Zero downtime deployment (frontend-only change)

### Scale/Scope
- Single file modification: `web/src/lib/api/todos.ts`
- 5 endpoint references to update
- Affects all todo CRUD operations
- No database or backend changes required

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Phase II Requirements
- ✅ Uses approved technology stack (Next.js, FastAPI, Neon)
- ✅ API-first architecture (Frontend → API → Database)
- ✅ Frontend-backend separation (no direct DB access from frontend)
- ✅ Persistent storage (Neon PostgreSQL, not in-memory)
- ✅ No Phase I patterns (in-memory, CLI, positional indexes)
- ✅ Database migrations with Alembic (no schema changes needed)
- ✅ OpenAPI/Swagger documentation (backend already has this)
- ✅ Proper error handling and validation (maintained)

**Status**: ✅ PASS - This is a bug fix that maintains all Phase II requirements

## Project Structure

### Documentation (this feature)

```text
specs/001-fix-api-404/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0 output (minimal - issue is clear)
└── tasks.md             # Phase 2 output (created by /sp.tasks)
```

### Source Code (repository root)

```text
web/                          # Next.js frontend
├── src/
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts         # ✅ Already correct - no changes needed
│   │   │   └── todos.ts          # 🔧 NEEDS FIX - change /todos to /tasks
│   │   └── auth/
│   │       └── jwt-manager.ts    # ✅ Already correct - no changes needed
│   ├── components/
│   │   └── todos/
│   │       └── TodoList.tsx      # ✅ No changes needed - uses API functions
│   └── contexts/
│       └── AuthContext.tsx       # ✅ No changes needed - JWT working
│
api/                          # FastAPI backend
├── src/
│   ├── routers/
│   │   └── todos.py              # ✅ Already correct - serves /api/tasks
│   └── main.py                   # ✅ Already correct - routes configured
```

**Structure Decision**: This is a frontend-only bug fix. The backend is correctly implemented and serves endpoints at `/api/tasks` as per the specification. The frontend API client wrapper (`client.ts`) is also correct. Only the endpoint paths in `todos.ts` need to be updated.

## Complexity Tracking

> **No violations** - This fix maintains all Phase II principles and requires no justification.

## Architecture Overview

### Current (Broken) Flow

```
User Action (e.g., Load Todos)
    ↓
TodoList.tsx calls listTodos()
    ↓
todos.ts: apiClient('/todos')  ← WRONG PATH
    ↓
client.ts: constructs http://localhost:8001/api/todos
    ↓
Backend: 404 Not Found (no route at /api/todos)
    ↓
Error displayed to user
```

### Fixed Flow

```
User Action (e.g., Load Todos)
    ↓
TodoList.tsx calls listTodos()
    ↓
todos.ts: apiClient('/tasks')  ← CORRECT PATH
    ↓
client.ts: constructs http://localhost:8001/api/tasks
    ↓
Backend: 200 OK (route exists at /api/tasks)
    ↓
JWT validated, user_id extracted from 'sub' claim
    ↓
Database query filtered by user_id
    ↓
Todos returned to frontend
    ↓
UI displays todos successfully
```

### Authentication Flow (Unchanged)

```
User Login
    ↓
Better Auth sets session cookie
    ↓
Frontend calls /api/token
    ↓
JWT generated with user_id in 'sub' claim
    ↓
JWT cached in memory by jwt-manager
    ↓
API calls include Authorization: Bearer <JWT>
    ↓
Backend validates JWT with RSA public key
    ↓
User_id extracted from 'sub' claim
    ↓
Data operations scoped to user_id
```

## Root Cause Analysis

### Issue Identification

**Problem**: Frontend calling `/api/todos` but backend serves `/api/tasks`

**Evidence**:
1. `web/src/lib/api/todos.ts` lines 10, 14, 21, 24, 32: All use `/todos` endpoint
2. `web/src/lib/api/client.ts` line 45: Constructs URL as `${API_BASE_URL}/api${endpoint}`
3. Backend `api/src/routers/todos.py`: Registers routes at `/api/tasks`
4. Backend `api/src/main.py`: Includes router with `/api` prefix
5. Console error: "ApiError: Not Found (404)" at `client.ts:74`

**Why This Happened**:
- Frontend code was written with `/todos` endpoint assumption
- Backend was correctly implemented to specification with `/api/tasks`
- Mismatch went undetected until runtime testing
- No contract tests to catch the discrepancy

### Impact Assessment

**Affected Operations**:
- ❌ List todos: `GET /api/todos` → 404
- ❌ Create todo: `POST /api/todos` → 404
- ❌ Get single todo: `GET /api/todos/{id}` → 404
- ❌ Update todo: `PATCH /api/todos/{id}` → 404
- ❌ Delete todo: `DELETE /api/todos/{id}` → 404

**Unaffected Operations**:
- ✅ User authentication (uses `/api/auth/*`)
- ✅ JWT token generation (uses `/api/token`)
- ✅ Session management (Better Auth)
- ✅ All other API calls (if any)

## Implementation Strategy

### Phase 0: Research (Minimal)

**Research Questions**:
1. ✅ What is the correct backend endpoint path? → `/api/tasks` (confirmed in backend code)
2. ✅ Are there other files calling `/todos`? → No, only `todos.ts` (confirmed via grep)
3. ✅ Will this break JWT authentication? → No, authentication is in `client.ts` (unchanged)
4. ✅ Are there any API versioning considerations? → No, `/v1` was removed from client.ts

**Decisions Made**:
- **Decision**: Change all `/todos` to `/tasks` in `web/src/lib/api/todos.ts`
- **Rationale**: Backend is correct per specification, frontend must match
- **Alternatives Considered**:
  - Change backend to `/todos` → Rejected (backend is spec-compliant)
  - Add alias route in backend → Rejected (unnecessary complexity)
  - Use environment variable for endpoint → Rejected (overkill for bug fix)

### Phase 1: Implementation Plan

**File to Modify**: `web/src/lib/api/todos.ts`

**Changes Required**:
1. Line 10: `apiClient<TodoListResponse>('/todos')` → `apiClient<TodoListResponse>('/tasks')`
2. Line 14: `apiClient<Todo>('/todos', {` → `apiClient<Todo>('/tasks', {`
3. Line 21: `apiClient<Todo>(\`/todos/${id}\`)` → `apiClient<Todo>(\`/tasks/${id}\`)`
4. Line 24: `apiClient<Todo>(\`/todos/${id}\`, {` → `apiClient<Todo>(\`/tasks/${id}\`, {`
5. Line 32: `apiClient<void>(\`/todos/${id}\`, {` → `apiClient<void>(\`/tasks/${id}\`, {`

**No Changes Needed**:
- ✅ `web/src/lib/api/client.ts` - Already correct
- ✅ `web/src/lib/auth/jwt-manager.ts` - Already correct
- ✅ `web/src/contexts/AuthContext.tsx` - Already correct
- ✅ `web/src/components/todos/TodoList.tsx` - Uses API functions, no direct calls
- ✅ Backend files - Already correct

### Phase 2: Testing Strategy

**Pre-Deployment Testing**:
1. **Unit Test**: Verify URL construction
   - Mock `apiClient` and verify it's called with `/tasks`
   - Confirm all 5 functions use correct endpoint

2. **Integration Test**: Test against running backend
   - Start backend on port 8001
   - Start frontend on port 3000
   - Login as test user
   - Verify JWT token is generated

3. **End-to-End Test**: Verify all CRUD operations
   - **List**: Navigate to /dashboard/todos → todos load without 404
   - **Create**: Submit new todo → appears in list, no 404
   - **Update**: Mark todo complete → status updates, no 404
   - **Delete**: Remove todo → disappears from list, no 404

4. **Regression Test**: Verify no side effects
   - JWT authentication still works
   - Other pages still load correctly
   - Error handling still works for real errors
   - Network errors display appropriate messages

**Acceptance Criteria**:
- ✅ All API calls use `/api/tasks` endpoint
- ✅ No 404 errors for valid todo operations
- ✅ JWT tokens still attached to requests
- ✅ User data isolation still enforced
- ✅ Error messages accurate for actual errors

### Phase 3: Deployment

**Deployment Steps**:
1. Commit changes to `001-fix-api-404` branch
2. Run frontend build: `npm run build`
3. Verify build succeeds with no errors
4. Test against production backend (if applicable)
5. Merge to main branch
6. Deploy frontend (hot reload in development)

**Rollback Plan**:
- If issues occur, revert commit
- Frontend-only change, no database rollback needed
- No backend changes, no API rollback needed

## Risk Assessment

### Low Risk Items
- ✅ Single file change
- ✅ Simple find-and-replace operation
- ✅ No logic changes
- ✅ No authentication changes
- ✅ No database changes
- ✅ Frontend-only deployment

### Mitigation Strategies
- **Risk**: Typo in endpoint path
  - **Mitigation**: Careful code review, test all operations

- **Risk**: Missing an occurrence of `/todos`
  - **Mitigation**: Use grep to verify all occurrences found and updated

- **Risk**: Breaking other API calls
  - **Mitigation**: Only modifying `todos.ts`, other API modules unaffected

## Quality Checklist

### Pre-Implementation
- [x] Specification approved and complete
- [x] Root cause identified and documented
- [x] Implementation approach validated
- [x] No constitution violations
- [x] Testing strategy defined

### Implementation
- [ ] Code changes made in `todos.ts`
- [ ] All 5 endpoint references updated
- [ ] No other files modified
- [ ] Code review completed
- [ ] Build succeeds without errors

### Testing
- [ ] Unit tests pass (if applicable)
- [ ] Integration tests pass
- [ ] All CRUD operations work
- [ ] JWT authentication verified
- [ ] No 404 errors observed
- [ ] Error handling still works

### Deployment
- [ ] Changes committed to branch
- [ ] Frontend deployed
- [ ] Production testing completed
- [ ] No regressions detected
- [ ] Documentation updated

## Success Metrics

### Immediate Success Indicators
- ✅ No 404 errors in browser console
- ✅ Todos load successfully on page navigation
- ✅ Todo creation works without errors
- ✅ Todo updates persist correctly
- ✅ Todo deletion works as expected

### Long-Term Success Indicators
- ✅ Zero 404 errors in production logs
- ✅ 100% success rate for valid todo operations
- ✅ No increase in authentication errors
- ✅ No user-reported issues related to todos

## Next Steps

1. **Run `/sp.tasks`** to generate atomic, testable tasks
2. **Implement changes** following TDD approach
3. **Test thoroughly** against running backend
4. **Deploy** and verify in production
5. **Monitor** for any unexpected issues

## Appendix

### Debug Commands

**Verify backend endpoints**:
```bash
curl http://localhost:8001/api/tasks \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

**Check frontend API calls**:
```javascript
// In browser console
console.log('API Base URL:', process.env.NEXT_PUBLIC_API_BASE_URL);
```

**Test JWT token generation**:
```bash
curl http://localhost:3000/api/token \
  -H "Cookie: better-auth.session_token=<SESSION>"
```

### Related Documentation
- Backend API specification: `api/src/routers/todos.py`
- Frontend API client: `web/src/lib/api/client.ts`
- JWT authentication: `JWT_IMPLEMENTATION_GUIDE.md`
- End-to-end tests: `test_e2e_auth.py`
