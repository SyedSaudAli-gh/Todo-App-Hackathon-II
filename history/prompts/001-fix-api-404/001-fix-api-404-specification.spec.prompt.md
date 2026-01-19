---
id: 001
title: Fix API 404 Specification
stage: spec
date: 2026-01-19
surface: agent
model: claude-sonnet-4-5
feature: fix-api-404
branch: 001-fix-api-404
user: user
command: /sp.specify
labels: ["bug-fix", "api", "specification"]
links:
  spec: specs/001-fix-api-404/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/001-fix-api-404/spec.md
  - specs/001-fix-api-404/checklists/requirements.md
tests:
  - Specification quality validation passed
---

## Prompt

Task: Debug and fix frontend API Not Found (404) error in my Todo App

Project Details:
- Frontend: Next.js 15.5.9, running on port 3000
- Backend: FastAPI, running on port 8001, endpoints /api/tasks (alias exists)
- JWT Authentication: RS256 tokens from Better Auth, frontend attaches via Authorization: Bearer <JWT>
- Error occurs when creating or loading todos via apiClient in src/lib/api/client.ts

Error Details:
- Type: Console ApiError
- Message: Not Found (404)
- Code Frame:
    at apiClient (src/lib/api/client.ts:74:13)
    at async loadTodos (src/components/todos/TodoList.tsx:44:24)
- Observed behavior: Todos cannot be created or loaded; UI shows ApiError

Requirements:
1. Identify the root cause of the 404 error
   - Check API endpoint paths, frontend calls, and port mismatches
   - Verify JWT headers are attached properly
2. Propose code changes in client.ts, AuthContext, or TodoList.ts to fix the issue
3. Ensure frontend calls the correct backend URL: http://localhost:8001/api/tasks
4. Validate the fix

## Response snapshot

Created comprehensive specification for fixing API endpoint path mismatch between frontend and backend:

**Problem Identified**: Frontend calling `/api/todos` while backend serves `/api/tasks`

**Specification Created**:
- Branch: `001-fix-api-404`
- Spec file: `specs/001-fix-api-404/spec.md`
- Quality checklist: `specs/001-fix-api-404/checklists/requirements.md`

**Key Elements**:
- 4 prioritized user stories covering all CRUD operations
- 8 functional requirements ensuring consistent endpoint paths
- 7 measurable success criteria (100% success rate for valid operations)
- Clear scope definition (in/out of scope)
- Dependencies, assumptions, and risks documented
- Edge cases and validation approach defined

**Quality Validation**: All checklist items passed
- No implementation details
- All requirements testable and unambiguous
- Success criteria measurable and technology-agnostic
- No clarifications needed

## Outcome

- ✅ Impact: Specification complete and ready for planning phase
- 🧪 Tests: Specification quality validation passed (all items checked)
- 📁 Files: 2 files created (spec.md, requirements.md checklist)
- 🔁 Next prompts: `/sp.plan` to create implementation plan
- 🧠 Reflection: Clear problem definition with straightforward solution - frontend needs to use `/api/tasks` instead of `/api/todos`

## Evaluation notes (flywheel)

- Failure modes observed: None - specification process completed successfully
- Graders run and results (PASS/FAIL): Quality checklist PASS (all items validated)
- Prompt variant (if applicable): Standard specification workflow
- Next experiment (smallest change to try): Proceed to planning phase to identify exact code changes needed
