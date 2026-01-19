---
id: 002
title: Fix API 404 Implementation Plan
stage: plan
date: 2026-01-19
surface: agent
model: claude-sonnet-4-5
feature: fix-api-404
branch: 001-fix-api-404
user: user
command: /sp.plan
labels: ["bug-fix", "api", "planning"]
links:
  spec: specs/001-fix-api-404/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/001-fix-api-404/plan.md
  - specs/001-fix-api-404/research.md
tests:
  - Root cause analysis completed
  - Implementation strategy validated
---

## Prompt

Create a detailed plan to fix the frontend Todo App "Not Found" (404) ApiError.

Objectives:
1. Ensure frontend successfully communicates with backend at http://localhost:8001/api/tasks
2. Make JWT token from Better Auth attach correctly to all API calls
3. Eliminate 404 errors in apiClient and TodoList.tsx
4. Keep session-based login for UI intact
5. Verify data isolation per user

Plan Deliverables:
- Architecture sketch: Show frontend → JWT → backend flow
- Section structure:
   - Identify mismatched API paths or ports
   - Fix client.ts URL construction and Authorization header
   - Update any dependent components (TodoList.tsx, AuthContext)
- Research Approach:
   - Debug current apiClient calls with console logs
   - Test API calls with Postman/curl to verify backend responses
- Decisions needing documentation:
   - Should API_VERSION be used or removed from client URL
   - How to attach JWT for all endpoints consistently
   - How to handle errors gracefully in UI
- Quality Validation

## Response snapshot

Created comprehensive implementation plan for fixing API 404 error:

**Root Cause Identified**:
- Frontend: Calling `/api/todos` in `web/src/lib/api/todos.ts`
- Backend: Serving `/api/tasks` (specification-compliant)
- Result: 404 Not Found for all todo CRUD operations

**Implementation Plan Created**:
- **File**: `specs/001-fix-api-404/plan.md`
- **Research**: `specs/001-fix-api-404/research.md`
- **Architecture**: Documented current (broken) vs fixed flow
- **Strategy**: Simple find-and-replace in single file

**Key Findings**:
1. Only `web/src/lib/api/todos.ts` needs modification (5 endpoint references)
2. JWT authentication in `client.ts` is correct - no changes needed
3. No backend, database, or authentication changes required
4. Frontend-only deployment with zero downtime
5. Low risk: single file, simple change, easy rollback

**Research Complete**:
- Q1: Backend endpoint path → `/api/tasks` (confirmed)
- Q2: Frontend incorrect calls → Only in `todos.ts` (5 occurrences)
- Q3: JWT authentication impact → None (handled in `client.ts`)
- Q4: API versioning → No `/v1` prefix needed

**Decisions Documented**:
- Change `/todos` to `/tasks` in `todos.ts`
- Manual end-to-end testing approach
- Frontend-only deployment strategy
- No backend or authentication changes

**Constitution Check**: ✅ PASS
- Maintains Phase II architecture
- No violations of approved technology stack
- Preserves API-first design
- Maintains frontend-backend separation

## Outcome

- ✅ Impact: Implementation plan complete and ready for task generation
- 🧪 Tests: Root cause validated, solution approach confirmed
- 📁 Files: 2 files created (plan.md, research.md)
- 🔁 Next prompts: `/sp.tasks` to generate atomic implementation tasks
- 🧠 Reflection: Clear, simple fix - frontend endpoint paths must match backend specification

## Evaluation notes (flywheel)

- Failure modes observed: None - planning completed successfully
- Graders run and results (PASS/FAIL): Constitution check PASS, all Phase II requirements met
- Prompt variant (if applicable): Standard planning workflow with research phase
- Next experiment (smallest change to try): Proceed to task generation, implement fix, verify all CRUD operations work
