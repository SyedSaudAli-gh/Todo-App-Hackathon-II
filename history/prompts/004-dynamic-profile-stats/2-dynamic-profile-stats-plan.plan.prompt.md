---
id: 2
title: dynamic-profile-stats-plan
stage: plan
date: 2026-01-12
surface: agent
model: claude-sonnet-4-5
feature: 004-dynamic-profile-stats
branch: 004-dynamic-profile-stats
user: SyedSaudAli-gh
command: /sp.plan
labels: ["planning", "implementation-design", "phase-ii", "backend-api", "authentication"]
links:
  spec: specs/004-dynamic-profile-stats/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/004-dynamic-profile-stats/plan.md
  - specs/004-dynamic-profile-stats/research.md
  - specs/004-dynamic-profile-stats/data-model.md
  - specs/004-dynamic-profile-stats/contracts/user-stats-api.yaml
  - specs/004-dynamic-profile-stats/quickstart.md
tests:
  - Constitution check passed (all Phase II requirements satisfied)
  - Research completed (4 research questions resolved)
  - Data model validated (schema changes, response models)
  - API contract defined (OpenAPI 3.0 specification)
---

## Prompt

Goal:
Implement authenticated, backend-driven Profile analytics for Hackathon II Phase II.

Execution Strategy:
Agent-based, backend-first, spec-driven development.

Phases:

Phase 1 — Analysis
- Inspect existing User and Todo models
- Verify presence of user_id on todos
- Confirm user.created_at exists or is stored on first auth

Phase 2 — Backend Foundation
- Create stats_service to compute:
  - totalTasks
  - completedTasks
  - completionRate
  - activeDays
- Ensure calculations are timezone-safe and deterministic

Phase 3 — API Layer
- Add /users/me/stats route
- Secure endpoint using Better Auth session dependency
- Return normalized JSON response

Phase 4 — Frontend Wiring
- Call stats API with credentials included
- Store response in state
- Inject values into ProfileStats component

Phase 5 — Validation & QA
- Test endpoint via Swagger
- Test frontend rendering with:
  - zero todos
  - partial completion
  - full completion
- Verify no cross-user data leakage

Technical Decisions:
- Cookie-based authentication (Better Auth sessions)
- Backend-calculated statistics (no frontend calculations)
- UTC timezone for all date operations
- Single aggregation query for performance

## Response snapshot

Created comprehensive implementation plan for Dynamic Profile Statistics feature (004-dynamic-profile-stats):

**Planning Artifacts Created:**

1. **Implementation Plan** (plan.md - 648 lines)
   - Technical context and technology stack
   - Constitution check (all Phase II requirements satisfied)
   - Project structure with file-level changes
   - 6 implementation phases with acceptance criteria
   - 5 technical decisions with rationale
   - Risk analysis and mitigation strategies
   - Success metrics and next steps

2. **Research Documentation** (research.md)
   - Better Auth session validation strategy
   - User ID association approach (UUID string in todos table)
   - Statistics calculation optimization (single aggregation query)
   - Error handling patterns (HTTPException with status codes)
   - Active days calculation (inclusive counting from user.created_at)
   - Database access strategy (dual connections: Neon + SQLite)

3. **Data Model Documentation** (data-model.md)
   - Database schema changes (add user_id to todos table)
   - Alembic migration script (upgrade/downgrade)
   - UserStatsResponse Pydantic model
   - Query optimization with index strategy
   - Test fixtures for zero todos, partial completion, full completion
   - Validation rules and security considerations

4. **API Contract** (contracts/user-stats-api.yaml)
   - OpenAPI 3.0 specification
   - GET /api/v1/users/me/stats endpoint
   - Request/response schemas
   - Error responses (401, 500)
   - Authentication requirements (cookie-based)
   - Example responses for all scenarios

5. **Quickstart Guide** (quickstart.md)
   - TypeScript types for frontend
   - API client implementation
   - Profile page integration steps
   - Complete code examples
   - Testing scenarios and debugging guide
   - Performance optimization suggestions

**Key Technical Decisions:**

1. **User ID Storage**: String field in todos table to match Better Auth UUID format
2. **Authentication**: FastAPI dependency validates Better Auth session cookies
3. **Statistics Calculation**: Backend service layer with single aggregation query
4. **Active Days**: Calculate from user.created_at in Better Auth database (inclusive counting)
5. **Error Handling**: HTTPException with appropriate status codes (200, 401, 500)

**Implementation Phases:**

1. Database Migration (add user_id to todos)
2. Backend Service Layer (statistics calculation)
3. Authentication Middleware (Better Auth session validation)
4. API Endpoint (GET /users/me/stats)
5. Frontend Integration (replace local stats with API call)
6. Testing & Validation (edge cases, performance, security)

**Constitution Compliance:**
- ✅ Phase II technology stack (Next.js, FastAPI, Neon PostgreSQL)
- ✅ API-first architecture (Frontend → API → Database)
- ✅ Frontend-backend separation (no direct DB access)
- ✅ Persistent storage (Neon PostgreSQL)
- ✅ Database migrations (Alembic)
- ✅ OpenAPI documentation (auto-generated)
- ✅ Cookie-based authentication (Better Auth)

**Performance Targets:**
- API response time: <500ms p95
- Database query time: <200ms
- Support 100+ concurrent users

**Security Measures:**
- User data isolation (strict user_id filtering)
- Session validation (Better Auth cookies)
- No cross-user data access
- Graceful error handling (no sensitive data exposure)

## Outcome

- ✅ Impact: Complete implementation plan with 5 design artifacts ready for task generation
- 🧪 Tests: Constitution check passed, all research questions resolved, data models validated
- 📁 Files: 5 files created (plan.md, research.md, data-model.md, user-stats-api.yaml, quickstart.md)
- 🔁 Next prompts: `/sp.tasks` to generate atomic, testable tasks from this plan
- 🧠 Reflection: Planning phase complete with clear technical approach, no blockers identified. Backend-first strategy with Better Auth integration validated. Ready for task decomposition and TDD implementation.

## Evaluation notes (flywheel)

- Failure modes observed: None - planning completed successfully with all artifacts
- Graders run and results (PASS/FAIL): Constitution check PASS, Research validation PASS, API contract validation PASS
- Prompt variant (if applicable): Standard /sp.plan workflow with Phase 0 research and Phase 1 design
- Next experiment (smallest change to try): Proceed to /sp.tasks for task decomposition, then begin TDD implementation starting with database migration
