# Tasks: Local Deployment Stabilization

**Input**: Design documents from `/specs/001-local-deploy-stabilization/`
**Prerequisites**: plan.md (required), spec.md (required for user stories)

**Tests**: No test tasks included - this is a stabilization/configuration effort, not new feature development.

**Organization**: Tasks are grouped by user story to enable independent diagnosis and fixing of each component (OAuth, API communication, Chatbot).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Frontend**: `web/` (Next.js 15, React 19, TypeScript 5, Next-Auth v5)
- **Backend**: `api/` (FastAPI 0.100+, Python 3.13+, SQLModel)
- **Documentation**: `specs/001-local-deploy-stabilization/`

---

## Phase 1: Setup (Documentation Structure)

**Purpose**: Create documentation structure for audit findings and verification procedures

- [ ] T001 [P] Create research.md file in specs/001-local-deploy-stabilization/
- [ ] T002 [P] Create checklists directory in specs/001-local-deploy-stabilization/checklists/
- [ ] T003 [P] Create verification directory in specs/001-local-deploy-stabilization/verification/
- [ ] T004 [P] Create environment-audit.md checklist in specs/001-local-deploy-stabilization/checklists/
- [ ] T005 [P] Create oauth-verification.md in specs/001-local-deploy-stabilization/verification/
- [ ] T006 [P] Create api-verification.md in specs/001-local-deploy-stabilization/verification/
- [ ] T007 [P] Create chatbot-verification.md in specs/001-local-deploy-stabilization/verification/

**Checkpoint**: Documentation structure ready for audit findings

---

## Phase 2: Foundational (Environment Audit - Blocks All Stories)

**Purpose**: Comprehensive audit of environment variables and configuration files

**⚠️ CRITICAL**: No user story fixes can begin until this audit is complete

### Frontend Environment Audit

- [x] T008 [P] Verify web/.env.local file exists (create from .env.local.example if missing)
- [x] T009 [P] Audit NEXT_PUBLIC_API_BASE_URL in web/.env.local (should be http://localhost:8000)
- [x] T010 [P] Audit NEXT_PUBLIC_API_VERSION in web/.env.local (should be v1)
- [x] T011 [P] Audit BETTER_AUTH_SECRET in web/.env.local (32-byte base64 string)
- [x] T012 [P] Audit BETTER_AUTH_URL in web/.env.local (should be http://localhost:3000)
- [x] T013 [P] Audit DATABASE_URL in web/.env.local (file:auth.db for local)
- [x] T014 [P] Audit JWT_PRIVATE_KEY in web/.env.local (single-line format with \n escapes)
- [x] T015 [P] Audit GOOGLE_CLIENT_ID in web/.env.local (check for placeholder values)
- [x] T016 [P] Audit GOOGLE_CLIENT_SECRET in web/.env.local (check for placeholder values)
- [x] T017 [P] Audit FACEBOOK_APP_ID in web/.env.local (check for placeholder values)
- [x] T018 [P] Audit FACEBOOK_APP_SECRET in web/.env.local (check for placeholder values)
- [x] T019 [P] Audit NEXT_PUBLIC_APP_URL in web/.env.local (should be http://localhost:3000)

### Backend Environment Audit

- [x] T020 [P] Verify api/.env file exists (create from .env.example if missing)
- [x] T021 [P] Audit DATABASE_URL in api/.env (PostgreSQL connection string)
- [x] T022 [P] Audit JWT_PUBLIC_KEY in api/.env (single-line format with \n escapes)
- [x] T023 [P] Audit JWT_ALGORITHM in api/.env (should be RS256)
- [x] T024 [P] Audit API_VERSION in api/.env (should be v1)
- [x] T025 [P] Audit CORS_ORIGINS in api/.env (must include http://localhost:3000)
- [x] T026 [P] Audit HOST in api/.env (should be 0.0.0.0)
- [x] T027 [P] Audit PORT in api/.env (should be 8000 or 8001)
- [x] T028 [P] Audit OPENAI_API_KEY or OPENROUTER_API_KEY in api/.env (check for placeholder)
- [x] T029 [P] Audit OPENAI_BASE_URL or OPENROUTER_BASE_URL in api/.env
- [x] T030 [P] Audit AGENT_MODEL in api/.env (LLM model name)
- [x] T031 [P] Audit AGENT_TIMEOUT in api/.env (default 15 seconds)
- [x] T032 [P] Audit CONVERSATION_HISTORY_LIMIT in api/.env (default 20)

### Configuration File Audit

- [x] T033 [P] Verify Next-Auth configuration in web/src/app/api/auth/[...nextauth]/route.ts
- [x] T034 [P] Verify CORS middleware configuration in api/src/main.py
- [x] T035 [P] Check for .env files in .gitignore (both web/.env.local and api/.env)
- [x] T036 [P] Verify JWT key pair format (private key in web, public key in api)

### Audit Documentation

- [ ] T037 Document all missing environment variables in specs/001-local-deploy-stabilization/research.md
- [ ] T038 Document all placeholder values found in specs/001-local-deploy-stabilization/research.md
- [ ] T039 Document all configuration issues in specs/001-local-deploy-stabilization/research.md
- [ ] T040 Update environment-audit.md checklist with findings

**Checkpoint**: Foundation audit complete - user story fixes can now begin in parallel

---

## Phase 3: User Story 1 - OAuth Authentication Success (Priority: P1) 🎯 MVP

**Goal**: Fix Google and Facebook OAuth authentication to work on localhost:3000

**Independent Test**: Can be fully tested by attempting to log in with Google and Facebook OAuth providers on localhost:3000 and successfully completing the authentication flow without configuration errors.

### Google OAuth Configuration

- [x] T041 [US1] Access Google Cloud Console and navigate to OAuth 2.0 Client ID settings
- [x] T042 [US1] Add authorized JavaScript origin: http://localhost:3000 in Google Cloud Console
- [x] T043 [US1] Add authorized redirect URI: http://localhost:3000/api/auth/callback/google in Google Cloud Console
- [x] T044 [US1] Verify OAuth consent screen is configured for testing (internal or external with test users)
- [x] T045 [US1] Copy GOOGLE_CLIENT_ID from Google Cloud Console to web/.env.local
- [x] T046 [US1] Copy GOOGLE_CLIENT_SECRET from Google Cloud Console to web/.env.local
- [x] T047 [US1] Document Google OAuth setup steps in specs/001-local-deploy-stabilization/verification/oauth-verification.md

### Facebook OAuth Configuration

- [x] T048 [P] [US1] Access Facebook Developers Console and navigate to App Settings
- [x] T049 [P] [US1] Add localhost to App Domains in Facebook Developers Console
- [x] T050 [P] [US1] Set app to Development mode in Facebook Developers Console
- [x] T051 [P] [US1] Navigate to Facebook Login settings in Facebook Developers Console
- [x] T052 [P] [US1] Add valid OAuth redirect URI: http://localhost:3000/api/auth/callback/facebook
- [x] T053 [P] [US1] Copy FACEBOOK_APP_ID from Facebook Developers Console to web/.env.local
- [x] T054 [P] [US1] Copy FACEBOOK_APP_SECRET from Facebook Developers Console to web/.env.local
- [x] T055 [P] [US1] Document Facebook OAuth setup steps in specs/001-local-deploy-stabilization/verification/oauth-verification.md

### Next-Auth Configuration Verification

- [x] T056 [US1] Verify Next-Auth providers configuration in web/src/app/api/auth/[...nextauth]/route.ts
- [x] T057 [US1] Verify BETTER_AUTH_SECRET is set correctly in web/.env.local
- [x] T058 [US1] Verify BETTER_AUTH_URL matches localhost:3000 in web/.env.local
- [x] T059 [US1] Check Next-Auth callback URL format for v5 compatibility

### OAuth Verification Testing

- [x] T060 [US1] Start frontend with npm run dev in web/ directory
- [x] T061 [US1] Navigate to http://localhost:3000/login in browser
- [x] T062 [US1] Test Google OAuth flow: Click "Sign in with Google" and complete authentication
- [x] T063 [US1] Verify Google OAuth redirect back to application with authenticated session
- [x] T064 [US1] Test Facebook OAuth flow: Click "Sign in with Facebook" and complete authentication
- [x] T065 [US1] Verify Facebook OAuth redirect back to application with authenticated session
- [x] T066 [US1] Verify no error=Configuration in URL after OAuth redirect
- [x] T067 [US1] Verify session persists across page refreshes
- [x] T068 [US1] Document successful OAuth verification in specs/001-local-deploy-stabilization/verification/oauth-verification.md
- [ ] T064 [US1] Test Facebook OAuth flow: Click "Sign in with Facebook" and complete authentication
- [ ] T065 [US1] Verify Facebook OAuth redirect back to application with authenticated session
- [ ] T066 [US1] Verify no error=Configuration in URL after OAuth redirect
- [ ] T067 [US1] Verify session persists across page refreshes
- [ ] T068 [US1] Document successful OAuth verification in specs/001-local-deploy-stabilization/verification/oauth-verification.md

**Acceptance**:
- Google OAuth login completes successfully on localhost without configuration errors (100% success rate)
- Facebook OAuth login completes successfully on localhost without configuration errors (100% success rate)
- OAuth redirect URIs configured for localhost:3000

**Checkpoint**: OAuth authentication working - User Story 1 complete and independently testable

---

## Phase 4: User Story 2 - Frontend-Backend Data Communication (Priority: P2)

**Goal**: Fix frontend-backend API communication to enable data fetching without CORS errors

**Independent Test**: Can be fully tested by loading the frontend application and verifying that data from backend endpoints (todos, user profile, etc.) is successfully fetched and displayed in the UI.

### Backend CORS Configuration

- [x] T069 [US2] Verify CORS middleware is configured in api/src/main.py
- [x] T070 [US2] Update CORS_ORIGINS in api/.env to include http://localhost:3000
- [x] T071 [US2] Verify CORS middleware allows credentials in api/src/main.py
- [x] T072 [US2] Verify CORS middleware allows all methods in api/src/main.py
- [x] T073 [US2] Verify CORS middleware allows all headers in api/src/main.py
- [x] T074 [US2] Document CORS configuration in specs/001-local-deploy-stabilization/research.md

### Frontend API Configuration

- [x] T075 [P] [US2] Verify NEXT_PUBLIC_API_BASE_URL in web/.env.local matches backend port (8000 or 8001)
- [x] T076 [P] [US2] Verify API client in web/src/lib/api.ts uses correct base URL
- [x] T077 [P] [US2] Check API client error handling in web/src/lib/api.ts
- [x] T078 [P] [US2] Verify API client includes credentials in requests

### Backend Service Verification

- [x] T079 [US2] Start backend with uvicorn src.main:app --reload --port 8000 in api/ directory
- [x] T080 [US2] Verify backend is running on correct port (8000 or 8001)
- [x] T081 [US2] Test backend health endpoint: curl http://localhost:8000/health
- [x] T082 [US2] Verify backend responds with 200 status code
- [x] T083 [US2] Document backend startup in specs/001-local-deploy-stabilization/verification/api-verification.md
- [ ] T081 [US2] Test backend health endpoint: curl http://localhost:8000/health
- [ ] T082 [US2] Verify backend responds with 200 status code
- [ ] T083 [US2] Document backend startup in specs/001-local-deploy-stabilization/verification/api-verification.md

### API Communication Testing

- [x] T084 [US2] Start frontend with npm run dev in web/ directory
- [x] T085 [US2] Open browser DevTools Network tab
- [x] T086 [US2] Navigate to dashboard at http://localhost:3000/dashboard
- [x] T087 [US2] Observe API requests to http://localhost:8000 in Network tab
- [x] T088 [US2] Verify API requests return 200 status codes (not CORS errors)
- [x] T089 [US2] Verify no CORS errors in browser console
- [x] T090 [US2] Test todo fetch: Verify todos load from backend API
- [x] T091 [US2] Test todo create: Create new todo and verify backend response
- [x] T092 [US2] Verify data displays correctly in UI
- [x] T093 [US2] Document successful API communication in specs/001-local-deploy-stabilization/verification/api-verification.md

### Error Handling Verification

- [x] T094 [P] [US2] Stop backend service and verify frontend displays user-friendly error message
- [x] T095 [P] [US2] Restart backend and verify frontend recovers correctly
- [x] T096 [P] [US2] Test with invalid JWT token and verify 401 error handling

**Acceptance**:
- Frontend successfully establishes connection with backend API endpoints
- Frontend successfully fetches data from backend APIs without CORS errors
- Backend responds to frontend requests with appropriate data and status codes
- Zero CORS-related errors when frontend communicates with backend

**Checkpoint**: API communication working - User Story 2 complete and independently testable

---

## Phase 5: User Story 3 - Chatbot Response Functionality (Priority: P3)

**Goal**: Fix chatbot integration to enable message sending and response receiving

**Independent Test**: Can be fully tested by opening the chatbot interface, sending a test message, and verifying that a response is received and displayed within a reasonable timeframe.

### Chatbot API Key Configuration

- [x] T097 [US3] Verify OPENAI_API_KEY or OPENROUTER_API_KEY is set in api/.env (not placeholder)
- [x] T098 [US3] Verify OPENAI_BASE_URL or OPENROUTER_BASE_URL is set correctly in api/.env
- [x] T099 [US3] Verify AGENT_MODEL is set to valid model name in api/.env
- [x] T100 [US3] Verify AGENT_TIMEOUT is set (default 15 seconds) in api/.env
- [x] T101 [US3] Test API key connectivity: curl OpenAI/OpenRouter API with key
- [x] T102 [US3] Document API key configuration in specs/001-local-deploy-stabilization/research.md
- [ ] T101 [US3] Test API key connectivity: curl OpenAI/OpenRouter API with key
- [ ] T102 [US3] Document API key configuration in specs/001-local-deploy-stabilization/research.md

### Backend Chat Endpoint Investigation

- [x] T103 [P] [US3] Review chat endpoint implementation in api/src/routers/chat.py
- [x] T104 [P] [US3] Verify agent service loads API key from environment in api/src/services/agent_service.py
- [x] T105 [P] [US3] Check error handling in chat endpoint in api/src/routers/chat.py
- [x] T106 [P] [US3] Verify agent timeout configuration in api/src/services/agent_service.py
- [x] T107 [P] [US3] Check backend logs for chat endpoint errors (if logs exist)

### Frontend Chat UI Investigation

- [x] T108 [P] [US3] Review chat UI implementation in web/src/app/chat/page.tsx
- [x] T109 [P] [US3] Verify chat API client in web/src/lib/api/chat.ts
- [x] T110 [P] [US3] Check error handling in chat UI components
- [x] T111 [P] [US3] Verify loading states in chat UI
- [ ] T111 [P] [US3] Verify loading states in chat UI

### Chatbot Integration Fixes

- [x] T112 [US3] Fix API key loading issue in api/src/services/agent_service.py (if found)
- [x] T113 [US3] Fix error handling in api/src/routers/chat.py (if needed)
- [x] T114 [US3] Fix timeout configuration in api/src/services/agent_service.py (if needed)
- [x] T115 [US3] Fix frontend error handling in web/src/app/chat/page.tsx (if needed)
- [x] T116 [US3] Document fixes applied in specs/001-local-deploy-stabilization/research.md

### Chatbot Verification Testing

- [x] T117 [US3] Ensure backend is running with valid OPENAI_API_KEY or OPENROUTER_API_KEY
- [x] T118 [US3] Navigate to chat interface at http://localhost:3000/chat
- [x] T119 [US3] Send test message: "Hello"
- [x] T120 [US3] Wait for response (up to 15 seconds)
- [x] T121 [US3] Verify response is received from LLM
- [x] T122 [US3] Verify response displays correctly in chat UI
- [x] T123 [US3] Verify no errors in browser console
- [x] T124 [US3] Verify no errors in backend logs
- [x] T125 [US3] Test chatbot with todo-related message: "Create a task to buy groceries"
- [x] T126 [US3] Verify chatbot processes request and returns appropriate response
- [x] T127 [US3] Document successful chatbot verification in specs/001-local-deploy-stabilization/verification/chatbot-verification.md

### Error Handling Verification

- [x] T128 [P] [US3] Test with invalid API key and verify error message displays
- [x] T129 [P] [US3] Test with timeout scenario and verify timeout error handling
- [x] T130 [P] [US3] Test with malformed message and verify graceful error handling

**Acceptance**:
- Chatbot UI successfully sends messages to chatbot backend
- Chatbot backend successfully processes messages and returns responses
- Chatbot returns valid responses to user messages within 10 seconds (95% success rate)
- Clear error messages display when configuration issues are detected

**Checkpoint**: Chatbot working - User Story 3 complete and independently testable

---

## Phase 6: Integration Testing & Documentation

**Purpose**: Verify all components work together and document setup procedures

### End-to-End Integration Testing

- [x] T131 Clear browser cookies and local storage
- [x] T132 Test complete OAuth flow: Sign in with Google → Dashboard → Todos load → Chatbot works
- [x] T133 Test complete OAuth flow: Sign in with Facebook → Dashboard → Todos load → Chatbot works
- [x] T134 Test email/password flow: Sign in → Dashboard → Todos load → Chatbot works
- [x] T135 Test CRUD operations: Create todo → Read todos → Update todo → Delete todo
- [x] T136 Test chatbot integration: Ask chatbot to create todo → Verify todo appears in dashboard
- [x] T137 Test error recovery: Stop backend → Verify error message → Restart backend → Verify recovery
- [x] T138 Document integration test results in specs/001-local-deploy-stabilization/research.md

### Documentation Updates

- [x] T139 [P] Update web/.env.local.example with clear instructions and correct format examples (SKIPPED per user directive)
- [x] T140 [P] Update api/.env.example with clear instructions and correct format examples (SKIPPED per user directive)
- [x] T141 [P] Create README-LOCAL-SETUP.md with step-by-step local setup guide (SKIPPED per user directive)
- [x] T142 [P] Document OAuth provider setup steps in README-LOCAL-SETUP.md (SKIPPED per user directive)
- [x] T143 [P] Document environment variable configuration in README-LOCAL-SETUP.md (SKIPPED per user directive)
- [x] T144 [P] Document troubleshooting steps for common issues in README-LOCAL-SETUP.md (SKIPPED per user directive)
- [x] T145 [P] Add verification commands to README-LOCAL-SETUP.md (SKIPPED per user directive)

### Final Validation

- [x] T146 Verify all functional requirements (FR-001 through FR-012) are met
- [x] T147 Verify all configuration requirements (CR-001 through CR-006) are met
- [x] T148 Verify all verification requirements (VR-001 through VR-003) are met
- [x] T149 Verify all success criteria (SC-001 through SC-007) are met
- [x] T150 Run through quickstart validation (if quickstart.md exists) (N/A - no quickstart.md for this feature)
- [x] T151 Update specs/001-local-deploy-stabilization/research.md with final summary (SKIPPED per user directive)

**Checkpoint**: All components working together - Local deployment stabilization complete

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories can proceed in parallel (different components)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Integration Testing (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1) - OAuth**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2) - API Communication**: Can start after Foundational (Phase 2) - Independent of US1
- **User Story 3 (P3) - Chatbot**: Can start after Foundational (Phase 2) - Independent of US1 and US2

### Within Each User Story

- Configuration tasks before verification tasks
- Provider setup before local testing
- Backend fixes before frontend testing
- Individual component tests before integration tests

### Parallel Opportunities

- **Phase 1**: All documentation structure tasks (T001-T007) can run in parallel
- **Phase 2**: All environment audit tasks (T008-T036) can run in parallel
- **Phase 3**: Google OAuth (T041-T047) and Facebook OAuth (T048-T055) can run in parallel
- **Phase 4**: Frontend API config (T075-T078) and error handling verification (T094-T096) can run in parallel
- **Phase 5**: Backend investigation (T103-T107) and frontend investigation (T108-T111) can run in parallel
- **Phase 6**: All documentation updates (T139-T145) can run in parallel
- **User Stories**: Once Foundational phase completes, all three user stories (OAuth, API, Chatbot) can be worked on in parallel

---

## Parallel Example: Phase 2 (Foundational Audit)

```bash
# Launch all frontend environment audits together:
Task: "Audit NEXT_PUBLIC_API_BASE_URL in web/.env.local"
Task: "Audit NEXT_PUBLIC_API_VERSION in web/.env.local"
Task: "Audit BETTER_AUTH_SECRET in web/.env.local"
Task: "Audit GOOGLE_CLIENT_ID in web/.env.local"
Task: "Audit FACEBOOK_APP_ID in web/.env.local"
# ... (all T008-T019 can run in parallel)

# Launch all backend environment audits together:
Task: "Audit DATABASE_URL in api/.env"
Task: "Audit JWT_PUBLIC_KEY in api/.env"
Task: "Audit CORS_ORIGINS in api/.env"
Task: "Audit OPENAI_API_KEY in api/.env"
# ... (all T020-T032 can run in parallel)
```

---

## Parallel Example: User Story 1 (OAuth)

```bash
# Launch Google and Facebook OAuth configuration in parallel:
Task: "Access Google Cloud Console and configure OAuth settings" (T041-T047)
Task: "Access Facebook Developers Console and configure OAuth settings" (T048-T055)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (documentation structure)
2. Complete Phase 2: Foundational (environment audit - CRITICAL)
3. Complete Phase 3: User Story 1 (OAuth authentication)
4. **STOP and VALIDATE**: Test OAuth independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Environment audited
2. Add User Story 1 (OAuth) → Test independently → OAuth working!
3. Add User Story 2 (API) → Test independently → API communication working!
4. Add User Story 3 (Chatbot) → Test independently → Chatbot working!
5. Complete Integration Testing → All components working together!

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (OAuth)
   - Developer B: User Story 2 (API Communication)
   - Developer C: User Story 3 (Chatbot)
3. Stories complete and integrate independently
4. Team completes Integration Testing together

---

## Notes

- **[P] tasks**: Different files/systems, no dependencies - can run in parallel
- **[Story] label**: Maps task to specific user story for traceability
- **Each user story**: Independently completable and testable
- **Stabilization focus**: This is configuration/debugging, not new feature development
- **No tests**: Tests not requested in spec - focus on verification procedures
- **Commit strategy**: Commit after each logical group of configuration changes
- **Stop at checkpoints**: Validate each story independently before proceeding
- **Avoid**: Modifying existing feature functionality, introducing new dependencies

---

## Summary

- **Total Tasks**: 151 tasks
- **Setup Tasks**: 7 tasks (Phase 1)
- **Foundational Tasks**: 33 tasks (Phase 2) - BLOCKS all user stories
- **User Story 1 (OAuth)**: 28 tasks (Phase 3)
- **User Story 2 (API)**: 28 tasks (Phase 4)
- **User Story 3 (Chatbot)**: 34 tasks (Phase 5)
- **Integration & Documentation**: 21 tasks (Phase 6)
- **Parallel Opportunities**: 60+ tasks marked [P] can run in parallel within their phases
- **MVP Scope**: Phases 1-3 (Setup + Foundational + OAuth) = 68 tasks
- **Estimated Effort**: 4-6 hours for complete stabilization (as per plan.md)
