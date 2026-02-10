# Implementation Plan: Local Deployment Stabilization

**Branch**: `001-local-deploy-stabilization` | **Date**: 2026-02-10 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-local-deploy-stabilization/spec.md`

## Summary

This plan addresses critical configuration and connectivity issues preventing the Todo application from functioning correctly in local development. The primary focus is fixing OAuth authentication (Google, Facebook), frontend-backend API communication, and chatbot response handling. This is a **stabilization effort** targeting existing functionality, not new feature development.

**Approach**: Systematic audit of environment variables, configuration files, and network connectivity, followed by targeted fixes with verification steps for each component.

## Technical Context

**Project Type**: Phase III Full-Stack Web Application with AI Agent

### Current Technology Stack

**Frontend**:
- Framework: Next.js 15+ with App Router
- UI Library: React 19+ with hooks
- Language: TypeScript 5+ (strict mode)
- Styling: Tailwind CSS 3+
- Auth: Next-Auth v5 (Better Auth)
- Chat UI: OpenAI ChatKit React
- HTTP Client: fetch API
- Running on: localhost:3000

**Backend**:
- Framework: FastAPI 0.100+
- Language: Python 3.13+
- Validation: Pydantic v2
- ORM: SQLModel (SQLAlchemy + Pydantic)
- Migrations: Alembic
- AI Agent: OpenAI SDK (with OpenRouter support)
- Running on: localhost:8000 (assumed from NEXT_PUBLIC_API_BASE_URL)

**Database**:
- Database: Neon PostgreSQL (serverless)
- ORM: SQLModel
- Migrations: Alembic
- Primary Keys: Auto-increment integers or UUID

**AI/Agent Layer**:
- Agent Framework: OpenAI SDK
- LLM Provider: OpenAI or OpenRouter
- Chat UI: OpenAI ChatKit
- Conversation Persistence: Database-backed

### Performance Goals

- OAuth authentication completes within 5 seconds
- API responses return within 500ms (p95)
- Chatbot responses return within 10 seconds
- Zero CORS errors during frontend-backend communication

### Constraints

- Local development only (localhost)
- No production deployment changes
- No Kubernetes or cloud configuration
- Must preserve existing working features (email/password auth)
- Must not introduce new dependencies

### Scale/Scope

- Single developer local environment
- 2 services (frontend + backend)
- 3 OAuth providers (Google, Facebook, LinkedIn - focus on Google & Facebook)
- 1 AI agent integration

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Phase III Requirements (Applicable)
- ✅ Uses approved AI/Agent stack (OpenAI SDK, OpenRouter support)
- ✅ OpenRouter API integration supported (with fallback to OpenAI)
- ✅ `OPENROUTER_API_KEY` or `OPENAI_API_KEY` environment variable
- ✅ Stateless backend (conversation persistence in database)
- ✅ Agent uses database-backed conversation memory
- ✅ Chat API endpoints for conversation management
- ⚠️ **ISSUE**: Chatbot not returning responses (needs investigation)

### Phase II Requirements (Maintained)
- ✅ Uses approved technology stack (Next.js, FastAPI, Neon)
- ✅ API-first architecture (Frontend → API → Database)
- ✅ Frontend-backend separation (no direct DB access from frontend)
- ✅ Persistent storage (Neon PostgreSQL)
- ✅ No Phase I patterns (in-memory, CLI, positional indexes)
- ✅ Database migrations with Alembic
- ⚠️ **ISSUE**: Frontend-backend communication failing (needs CORS/network fix)
- ⚠️ **ISSUE**: OAuth configuration incomplete (needs provider setup)

### Stabilization Requirements (This Feature)
- ✅ Email/password authentication working (baseline confirmed)
- ❌ Google OAuth not working (configuration error)
- ❌ Facebook OAuth not working (configuration error)
- ❌ Frontend-backend API communication failing
- ❌ Chatbot not returning responses
- ⚠️ Environment variables need audit and validation

**Gate Status**: ⚠️ **CONDITIONAL PASS** - Architecture is correct, but configuration issues prevent functionality. Proceed with stabilization plan.

## Project Structure

### Documentation (this feature)

```text
specs/001-local-deploy-stabilization/
├── spec.md                    # Feature specification (completed)
├── plan.md                    # This file (implementation plan)
├── research.md                # Phase 0 output (configuration audit findings)
├── checklists/
│   ├── requirements.md        # Spec quality checklist (completed)
│   └── environment-audit.md   # Environment variable audit checklist
└── verification/
    ├── oauth-verification.md  # OAuth testing procedures
    ├── api-verification.md    # API communication testing
    └── chatbot-verification.md # Chatbot testing procedures
```

### Source Code (repository root)

```text
web/                          # Next.js frontend
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── api/auth/        # Next-Auth API routes
│   │   ├── login/           # Login page
│   │   └── dashboard/       # Dashboard (protected)
│   ├── components/          # React components
│   ├── lib/                 # Utilities and API client
│   └── types/               # TypeScript types
├── .env.local               # Frontend environment variables (LOCAL - not in git)
├── .env.local.example       # Frontend env template (IN GIT)
├── package.json
└── next.config.js           # Next.js configuration

api/                          # FastAPI backend
├── src/
│   ├── models/              # SQLModel database models
│   ├── schemas/             # Pydantic request/response models
│   ├── routers/             # API endpoints
│   │   ├── auth.py          # Authentication endpoints
│   │   ├── todos.py         # Todo CRUD endpoints
│   │   └── chat.py          # Chat/agent endpoints
│   ├── services/            # Business logic
│   │   ├── auth_service.py
│   │   ├── todo_service.py
│   │   └── agent_service.py
│   ├── database.py          # Database connection
│   └── main.py              # FastAPI app with CORS config
├── alembic/                 # Database migrations
├── .env                     # Backend environment variables (LOCAL - not in git)
├── .env.example             # Backend env template (IN GIT)
└── requirements.txt
```

**Structure Decision**: Standard Phase III full-stack web application with Next.js frontend and FastAPI backend. Both services run locally on separate ports (3000 and 8000).

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No constitutional violations detected. This is a stabilization effort for existing Phase III architecture.

---

## Phase 0: Configuration Audit & Research

**Objective**: Identify all configuration issues preventing OAuth, API communication, and chatbot functionality.

### Research Tasks

#### Task 0.1: Environment Variable Audit

**Goal**: Verify all required environment variables are present and correctly formatted.

**Frontend Environment Variables** (web/.env.local):
- [ ] `NEXT_PUBLIC_API_BASE_URL` - Backend API URL (should be http://localhost:8000)
- [ ] `NEXT_PUBLIC_API_VERSION` - API version (should be v1)
- [ ] `BETTER_AUTH_SECRET` - Session secret (32-byte base64 string)
- [ ] `BETTER_AUTH_URL` - Auth callback URL (should be http://localhost:3000)
- [ ] `DATABASE_URL` - Auth database (file:auth.db for local)
- [ ] `JWT_PRIVATE_KEY` - RS256 private key (single-line format with \n escapes)
- [ ] `GOOGLE_CLIENT_ID` - Google OAuth client ID
- [ ] `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
- [ ] `FACEBOOK_APP_ID` - Facebook OAuth app ID
- [ ] `FACEBOOK_APP_SECRET` - Facebook OAuth app secret
- [ ] `NEXT_PUBLIC_APP_URL` - App URL (should be http://localhost:3000)

**Backend Environment Variables** (api/.env):
- [ ] `DATABASE_URL` - PostgreSQL connection string (Neon or local)
- [ ] `JWT_PUBLIC_KEY` - RS256 public key (single-line format with \n escapes)
- [ ] `JWT_ALGORITHM` - Should be RS256
- [ ] `API_VERSION` - Should be v1
- [ ] `CORS_ORIGINS` - Should include http://localhost:3000
- [ ] `HOST` - Should be 0.0.0.0
- [ ] `PORT` - Should be 8000 or 8001
- [ ] `OPENAI_API_KEY` or `OPENROUTER_API_KEY` - LLM API key
- [ ] `OPENAI_BASE_URL` or `OPENROUTER_BASE_URL` - LLM API endpoint
- [ ] `AGENT_MODEL` - LLM model name
- [ ] `AGENT_TIMEOUT` - Agent timeout (default 15 seconds)
- [ ] `CONVERSATION_HISTORY_LIMIT` - Message history limit (default 20)

**Verification Commands**:
```bash
# Check frontend env file exists
ls -la web/.env.local

# Check backend env file exists
ls -la api/.env

# Verify no placeholder values remain
grep -E "<|your-|example" web/.env.local api/.env
```

**Expected Output**: No placeholder values found. All required variables present.

#### Task 0.2: OAuth Provider Configuration Research

**Goal**: Document required OAuth provider settings for localhost development.

**Google OAuth Configuration**:
1. Google Cloud Console → APIs & Services → Credentials
2. OAuth 2.0 Client ID settings:
   - Authorized JavaScript origins: `http://localhost:3000`
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google`
     - `http://localhost:3000/auth/callback/google` (check Next-Auth v5 callback path)
3. OAuth consent screen: Configure for testing (internal or external with test users)

**Facebook OAuth Configuration**:
1. Facebook Developers → App → Settings → Basic
2. App Domains: `localhost`
3. Facebook Login → Settings:
   - Valid OAuth Redirect URIs:
     - `http://localhost:3000/api/auth/callback/facebook`
     - `http://localhost:3000/auth/callback/facebook`
4. App Mode: Development (allows localhost)

**Research Questions**:
- What is the exact callback URL format for Next-Auth v5?
- Are there any localhost-specific restrictions for OAuth providers?
- Do OAuth providers require HTTPS for callbacks (exception for localhost)?

#### Task 0.3: CORS Configuration Research

**Goal**: Identify correct CORS settings for local development.

**Backend CORS Requirements** (api/src/main.py):
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Verification**:
- Check if CORS middleware is configured in FastAPI
- Verify `CORS_ORIGINS` environment variable includes localhost:3000
- Test preflight OPTIONS requests

#### Task 0.4: Chatbot Integration Research

**Goal**: Identify why chatbot requests are not returning responses.

**Investigation Areas**:
1. **API Key Validation**: Is OPENAI_API_KEY or OPENROUTER_API_KEY valid?
2. **Network Connectivity**: Can backend reach OpenAI/OpenRouter API?
3. **Request Format**: Is the chat request properly formatted?
4. **Error Handling**: Are errors being caught and logged?
5. **Timeout Settings**: Is AGENT_TIMEOUT sufficient (default 15s)?

**Verification Commands**:
```bash
# Test OpenAI API connectivity from backend
curl -X POST https://api.openai.com/v1/chat/completions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"gpt-4o-mini","messages":[{"role":"user","content":"test"}]}'

# Check backend logs for chat endpoint errors
# (Run this while testing chatbot in UI)
tail -f api/logs/*.log
```

### Research Output

**Deliverable**: `research.md` file documenting:
1. Complete environment variable audit results
2. OAuth provider configuration requirements
3. CORS configuration findings
4. Chatbot integration investigation results
5. Identified root causes for each issue
6. Recommended fixes for each component

---

## Phase 1: Fix Implementation & Verification

**Objective**: Apply fixes for each identified issue with verification steps.

### Phase 1.1: Environment Variable Configuration

**Files to Modify**:
- `web/.env.local` (create if missing, update if incomplete)
- `api/.env` (create if missing, update if incomplete)

**Actions**:
1. Copy `.env.example` files to actual `.env` files if missing
2. Replace all placeholder values with actual credentials
3. Verify JWT key pair format (single-line with \n escapes)
4. Ensure CORS_ORIGINS includes http://localhost:3000
5. Verify API base URL matches backend port

**Verification Checklist**: Create `checklists/environment-audit.md`

### Phase 1.2: OAuth Provider Configuration

**Google OAuth Setup**:
1. Access Google Cloud Console
2. Navigate to OAuth 2.0 Client ID
3. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
4. Add authorized JavaScript origin: `http://localhost:3000`
5. Save changes

**Facebook OAuth Setup**:
1. Access Facebook Developers Console
2. Navigate to Facebook Login settings
3. Add valid OAuth redirect URI: `http://localhost:3000/api/auth/callback/facebook`
4. Set app to Development mode
5. Add localhost to App Domains
6. Save changes

**Verification Steps**: Create `verification/oauth-verification.md`

### Phase 1.3: CORS Configuration Fix

**File to Modify**: `api/src/main.py`

**Required Changes**:
```python
# Ensure CORS middleware is configured
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI()

# CORS configuration
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Verification Steps**: Create `verification/api-verification.md`

### Phase 1.4: Chatbot Integration Fix

**Files to Investigate**:
- `api/src/routers/chat.py` - Chat endpoint implementation
- `api/src/services/agent_service.py` - Agent service logic
- `web/src/app/chat/page.tsx` - Chat UI component

**Common Issues to Check**:
1. API key not loaded from environment
2. Incorrect base URL for OpenRouter
3. Missing error handling in chat endpoint
4. Frontend not handling streaming responses
5. Timeout too short for LLM response

**Verification Steps**: Create `verification/chatbot-verification.md`

---

## Phase 2: Phased Verification & Testing

**Objective**: Systematically verify each fix works independently before final integration testing.

### Phase 2.1: OAuth Verification

**Test Procedure**:
1. Start frontend: `cd web && npm run dev`
2. Navigate to http://localhost:3000/login
3. Click "Sign in with Google"
4. Complete OAuth flow
5. Verify redirect back to application with authenticated session
6. Repeat for Facebook OAuth

**Success Criteria**:
- No `error=Configuration` in URL
- User successfully authenticated
- Session persists across page refreshes

**Troubleshooting**:
- If redirect fails: Check callback URL in provider console
- If error persists: Check BETTER_AUTH_SECRET and BETTER_AUTH_URL
- If session not persisting: Check DATABASE_URL for auth.db

### Phase 2.2: API Communication Verification

**Test Procedure**:
1. Start backend: `cd api && uvicorn src.main:app --reload --port 8000`
2. Start frontend: `cd web && npm run dev`
3. Open browser DevTools → Network tab
4. Navigate to dashboard
5. Observe API requests to http://localhost:8000

**Success Criteria**:
- API requests return 200 status codes
- No CORS errors in console
- Data displays correctly in UI

**Troubleshooting**:
- If CORS error: Check CORS_ORIGINS in api/.env
- If connection refused: Verify backend is running on port 8000
- If 401 errors: Check JWT key pair configuration

### Phase 2.3: Chatbot Verification

**Test Procedure**:
1. Ensure backend is running with valid OPENAI_API_KEY or OPENROUTER_API_KEY
2. Navigate to chat interface
3. Send test message: "Hello"
4. Wait for response (up to 15 seconds)
5. Verify response displays in UI

**Success Criteria**:
- Message sent successfully
- Response received within timeout
- Response displays in chat UI
- No errors in browser console or backend logs

**Troubleshooting**:
- If no response: Check API key validity
- If timeout: Increase AGENT_TIMEOUT in api/.env
- If error: Check backend logs for detailed error message

---

## Phase 3: Final Integration Testing

**Objective**: Verify all components work together in complete user workflows.

### Test Scenario 1: Complete OAuth Flow

1. Clear browser cookies and local storage
2. Navigate to http://localhost:3000
3. Click "Sign in with Google"
4. Complete OAuth authentication
5. Verify redirect to dashboard
6. Verify todos load from backend API
7. Create a new todo
8. Verify todo persists in database
9. Open chatbot
10. Send message to chatbot
11. Verify chatbot response

**Expected Result**: All steps complete without errors.

### Test Scenario 2: Email/Password + API + Chatbot

1. Sign in with email/password (baseline working)
2. Navigate to dashboard
3. Verify todos load
4. Perform CRUD operations on todos
5. Open chatbot
6. Ask chatbot to create a todo
7. Verify todo appears in dashboard

**Expected Result**: All steps complete without errors.

### Test Scenario 3: Error Handling

1. Stop backend service
2. Attempt to load dashboard
3. Verify user-friendly error message
4. Restart backend
5. Refresh page
6. Verify data loads correctly

**Expected Result**: Graceful error handling, recovery after backend restart.

---

## Deliverables

### Documentation Artifacts

1. **research.md** - Configuration audit findings and root cause analysis
2. **checklists/environment-audit.md** - Environment variable checklist
3. **verification/oauth-verification.md** - OAuth testing procedures
4. **verification/api-verification.md** - API communication testing
5. **verification/chatbot-verification.md** - Chatbot testing procedures

### Configuration Files

1. **web/.env.local.example** - Updated with clear instructions
2. **api/.env.example** - Updated with clear instructions
3. **README-LOCAL-SETUP.md** - Step-by-step local setup guide

### Code Changes (if needed)

1. **api/src/main.py** - CORS configuration fixes
2. **api/src/routers/chat.py** - Chatbot error handling improvements
3. **web/src/lib/api-client.ts** - API client error handling

---

## Success Criteria

### Functional Requirements Met

- ✅ FR-001: Google OAuth authentication completes successfully
- ✅ FR-002: Facebook OAuth authentication completes successfully
- ✅ FR-003: OAuth redirect URIs configured for localhost:3000
- ✅ FR-004: Frontend establishes connection with backend API
- ✅ FR-005: Frontend fetches data without CORS errors
- ✅ FR-006: Backend responds with appropriate data and status codes
- ✅ FR-007: Chatbot UI sends messages successfully
- ✅ FR-008: Chatbot backend processes and returns responses
- ✅ FR-009: All environment variables validated
- ✅ FR-010: Clear error messages for configuration issues
- ✅ FR-011: Environment variables documented in .env.example
- ✅ FR-012: Verification steps provided for each fix

### Quality Gates

- All OAuth providers work on localhost
- Zero CORS errors during API communication
- Chatbot returns responses within 10 seconds
- Environment variable documentation is complete and accurate
- Verification procedures are executable by any developer
- No regression in existing email/password authentication

---

## Risk Mitigation

### Risk 1: OAuth Provider Restrictions
**Mitigation**: Document exact callback URL format for Next-Auth v5. Test with both Google and Facebook before marking complete.

### Risk 2: Environment Variable Format Issues
**Mitigation**: Provide exact format examples for JWT keys (single-line with \n escapes). Include validation script.

### Risk 3: CORS Configuration Complexity
**Mitigation**: Use explicit localhost:3000 origin. Document production CORS settings separately.

### Risk 4: Chatbot API Key Issues
**Mitigation**: Test API key connectivity before integration. Provide fallback to OpenRouter if OpenAI fails.

---

## Next Steps

After completing this plan:

1. **Execute Phase 0**: Run configuration audit and document findings in research.md
2. **Execute Phase 1**: Apply fixes based on research findings
3. **Execute Phase 2**: Verify each component independently
4. **Execute Phase 3**: Run integration tests
5. **Document Results**: Update README with local setup instructions
6. **Create Tasks**: Use `/sp.tasks` to break down implementation into atomic tasks

**Estimated Effort**: 4-6 hours for complete stabilization and verification.

**Dependencies**: Access to Google Cloud Console, Facebook Developers Console, and valid API keys for chatbot.
