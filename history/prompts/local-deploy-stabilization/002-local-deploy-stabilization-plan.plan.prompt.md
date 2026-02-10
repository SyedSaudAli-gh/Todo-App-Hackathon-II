---
id: 002
title: Local Deploy Stabilization Plan
stage: plan
date: 2026-02-10
surface: agent
model: claude-sonnet-4-5
feature: local-deploy-stabilization
branch: 001-local-deploy-stabilization
user: SyedSaudAli-gh
command: /sp.plan
labels: ["plan", "phase-iv", "oauth", "deployment", "stabilization", "configuration", "debugging"]
links:
  spec: specs/001-local-deploy-stabilization/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/001-local-deploy-stabilization/plan.md
tests:
  - Configuration audit procedures defined
  - Verification steps for OAuth, API, and chatbot
  - Integration test scenarios documented
---

## Prompt

Create:
- Step-by-step fix plan
- Configuration checklist
- Debugging flow for OAuth, backend API, and chatbot
- Validation steps after each fix

Structure the plan in phases:

Phase 1: Environment & Configuration Audit
- Verify NEXTAUTH_URL
- Verify AUTH_TRUST_HOST
- Verify Google & Facebook OAuth credentials
- Verify backend API base URL
- Verify chatbot API key & endpoint

Phase 2: OAuth Fix (Google & Facebook)
- Required dashboard settings
- Correct callback URLs
- Localhost-specific fixes
- Common misconfiguration checks

Phase 3: Frontend ↔ Backend Data Flow
- API route verification
- CORS checks
- Environment variable usage
- Network/debug validation steps

Phase 4: Chatbot Integration
- Request/response flow
- API key validation
- Backend ↔ LLM connectivity
- Frontend UI response handling

Phase 5: Final Validation
- Login tests (credentials + OAuth)
- Data fetch test
- Chatbot response test

Testing strategy:
- Manual verification steps after each phase
- Expected output for success
- Clear error indicators if something fails

Output format:
- Markdown
- Clear steps
- Commands where needed
- File paths where changes are required

## Response snapshot

Created comprehensive implementation plan with systematic approach to fixing local deployment issues:

**Plan Structure**:
1. **Phase 0: Configuration Audit & Research** - Systematic audit of environment variables, OAuth provider settings, CORS configuration, and chatbot integration
2. **Phase 1: Fix Implementation** - Targeted fixes for environment variables, OAuth providers, CORS, and chatbot
3. **Phase 2: Phased Verification** - Independent testing of OAuth, API communication, and chatbot
4. **Phase 3: Integration Testing** - End-to-end user workflows

**Key Components**:
- **Environment Variable Audit**: Complete checklist for frontend (11 vars) and backend (12 vars)
- **OAuth Configuration**: Detailed setup for Google and Facebook with exact callback URLs
- **CORS Configuration**: FastAPI middleware setup with localhost:3000 origin
- **Chatbot Debugging**: Investigation areas for API key, connectivity, request format, error handling
- **Verification Procedures**: Step-by-step testing with success criteria and troubleshooting

**Deliverables Defined**:
- research.md (audit findings)
- environment-audit.md (checklist)
- oauth-verification.md (OAuth testing)
- api-verification.md (API testing)
- chatbot-verification.md (chatbot testing)
- README-LOCAL-SETUP.md (setup guide)

**Technology Stack Confirmed**:
- Frontend: Next.js 15, React 19, TypeScript 5, Next-Auth v5, OpenAI ChatKit
- Backend: FastAPI 0.100+, Python 3.13+, SQLModel, OpenAI SDK
- Database: Neon PostgreSQL
- Running on: localhost:3000 (frontend), localhost:8000 (backend)

## Outcome

- ✅ Impact: Complete implementation plan ready for task breakdown
- 🧪 Tests: Verification procedures defined for each component (OAuth, API, chatbot)
- 📁 Files: Created plan.md with phased approach and detailed procedures
- 🔁 Next prompts: `/sp.tasks` to break down plan into atomic tasks, or begin Phase 0 configuration audit
- 🧠 Reflection: Plan focuses on systematic diagnosis before fixes. Each phase has clear verification steps to ensure issues are resolved without introducing regressions. Estimated 4-6 hours for complete stabilization.

## Evaluation notes (flywheel)

- Failure modes observed: None - plan completed successfully
- Graders run and results (PASS/FAIL): Constitution check PASS (conditional - architecture correct, configuration issues identified)
- Prompt variant (if applicable): Standard /sp.plan workflow with user-specified phase structure
- Next experiment (smallest change to try): Execute Phase 0 configuration audit to identify root causes before implementing fixes
