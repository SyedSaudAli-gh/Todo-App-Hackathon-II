---
description: Update the Project Constitution from Phase I to Phase II with web, API, database architecture and quality standards.
handoffs:
  - label: Build Phase II Specification
    agent: sp.specify
    prompt: Create the Phase II feature specification based on the upgraded constitution. I want to build...
  - label: Plan Phase II Architecture
    agent: sp.plan
    prompt: Design the Phase II architecture plan following the upgraded constitution principles.
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Outline

You are upgrading the project constitution from Phase I (in-memory CLI) to Phase II (web + API + database). This is a **major version upgrade** that fundamentally changes the architecture, technology stack, and quality standards while maintaining spec-driven development principles.

Follow this execution flow:

### 1. Pre-Flight Validation

Before proceeding, verify Phase I completion:
- Read `.specify/memory/constitution.md` and confirm it's a Phase I constitution
- Verify current version is 1.x.x (Phase I)
- Check that Phase I features are implemented (scan for evidence in codebase)
- **REJECT** if Phase I constitution is incomplete or has unresolved TODOs
- **REJECT** if attempting partial upgrade (all-or-nothing requirement)

### 2. Load Current Constitution and Analyze

- Read `.specify/memory/constitution.md` in full
- Extract current version, ratification date, and all principles
- Identify Phase I-specific constraints that must be deprecated:
  - In-memory only storage
  - CLI-only interaction
  - Python standard library only
  - No external dependencies
  - No persistence mechanisms
  - No network communication
  - No databases or APIs

### 3. Define Phase II Architecture Principles

Create new principles that **replace** Phase I constraints:

**Phase II Core Principles (MUST include):**

#### I. Spec-Driven Development (UNCHANGED)
Maintain from Phase I: All implementation must strictly follow approved specifications.

#### II. Phase II Integrity (NEW - REPLACES Phase I Integrity)
Phase II introduces web interface, REST API, and persistent database storage:
- **Frontend**: Next.js 15+ with React 19+, TypeScript, Tailwind CSS
- **Backend**: FastAPI with Python 3.13+, Pydantic v2, SQLModel
- **Database**: Neon PostgreSQL (serverless)
- **Architecture**: Clear separation between frontend, API, and data layers
- **NO Phase I patterns**: No in-memory storage, no CLI-only features in web context
- **Persistence**: All data must survive application restarts

#### III. Reusability and Extension (EVOLVED)
Design must support future phases (Phase III+):
- API versioning strategy (v1, v2, etc.)
- Database migration support
- Modular architecture for feature additions
- Clear contracts between layers

#### IV. Determinism and Testability (EVOLVED)
- All API endpoints must have contract tests
- Database operations must be transactional and testable
- Frontend components must have unit tests
- Integration tests across all three layers
- End-to-end tests for critical user flows

#### V. Test-First Development (MAINTAINED - NON-NEGOTIABLE)
TDD remains mandatory: Write tests first → Red → Green → Refactor
- API: OpenAPI/Swagger specs before implementation
- Frontend: Component tests before implementation
- Database: Schema tests before migrations

#### VI. Technology Stack Compliance (NEW - REPLACES Python-Only)
**Approved Stack:**
- Frontend: Next.js 15+, React 19+, TypeScript 5+, Tailwind CSS 3+
- Backend: FastAPI 0.100+, Python 3.13+, Pydantic v2, SQLModel
- Database: Neon PostgreSQL (serverless, managed)
- Deployment: Vercel (frontend), Railway/Render (backend)

**Prohibited:**
- Phase I in-memory patterns in Phase II code
- Direct database access from frontend
- Mixing CLI logic with web logic
- Unapproved frameworks or libraries

### 4. Define Phase II Quality Standards

Add new sections to constitution:

#### API Design Standards
- RESTful conventions (GET, POST, PUT, DELETE)
- Proper HTTP status codes (200, 201, 400, 401, 404, 500)
- Request/response validation with Pydantic
- Error handling with structured error responses
- API versioning in URL path (/api/v1/...)
- OpenAPI documentation auto-generated

#### Database Standards
- SQLModel for ORM (combines SQLAlchemy + Pydantic)
- Alembic for migrations (version controlled)
- Proper indexing for performance
- Foreign key constraints enforced
- No raw SQL unless justified in ADR
- Connection pooling and transaction management

#### Frontend Standards
- TypeScript strict mode enabled
- Component-based architecture
- Server-side rendering (SSR) where appropriate
- Client-side state management (React hooks, Context API)
- Responsive design (mobile-first)
- Accessibility (WCAG 2.1 AA minimum)

#### Security Standards (NEW)
- Environment variables for secrets (.env files, never committed)
- CORS configuration for API
- Input validation on both frontend and backend
- SQL injection prevention (ORM usage)
- XSS prevention (React auto-escaping)
- Authentication/authorization (if applicable to phase)

### 5. Phase I Deprecation Section

Add explicit deprecation notice:

```markdown
## Phase I Deprecation

The following Phase I constraints are **DEPRECATED** and must NOT be used in Phase II code:

- ❌ In-memory storage (use Neon PostgreSQL)
- ❌ CLI-only interaction (use Next.js web interface)
- ❌ Python standard library only (use approved stack)
- ❌ No external dependencies (use npm/pip with approved packages)
- ❌ No persistence (all data must persist)
- ❌ No network communication (API communication required)

**Migration Path:**
- Phase I code remains in `src/` for reference
- Phase II code goes in `web/` (frontend) and `api/` (backend)
- No mixing of Phase I and Phase II patterns
- Phase I CLI may be maintained separately if needed
```

### 6. Update Constraints and Boundaries

Replace Phase I constraints with Phase II constraints:

**Phase II Constraints:**
- Must use approved technology stack (Next.js, FastAPI, Neon)
- Must maintain clear separation: frontend ↔ API ↔ database
- Must follow REST API conventions
- Must persist all data to database
- Must support concurrent users
- Must handle errors gracefully across all layers
- Must document all API endpoints (OpenAPI)
- Must version control database schema (migrations)

**Phase II Boundaries (Out of Scope):**
- Real-time features (WebSockets, Server-Sent Events) → Phase III+
- Advanced authentication (OAuth, SSO) → Phase III+
- File uploads/storage → Phase III+
- Email notifications → Phase III+
- Advanced analytics/reporting → Phase III+
- Mobile native apps → Phase III+
- Microservices architecture → Phase III+

### 7. Update Success Criteria

Replace Phase I success criteria:

**Phase II Success Criteria:**
- Web interface deployed and accessible
- REST API documented and functional
- Database schema deployed to Neon
- All CRUD operations work end-to-end
- Tests pass at all layers (unit, integration, e2e)
- No Phase I patterns in Phase II code
- Spec, plan, tasks, implementation fully traceable
- Code passes automated review for clean architecture
- Performance meets basic standards (API <500ms p95)

### 8. Version and Governance Update

- **Version**: Increment to 2.0.0 (major version for Phase II)
- **Ratification Date**: Keep original from Phase I
- **Last Amended Date**: Today (ISO format YYYY-MM-DD)
- Update governance section to reference Phase II compliance checks

### 9. Consistency Propagation

Update all dependent templates and ensure no Phase I leakage:

- Read and update `.specify/templates/spec-template.md`:
  - Add sections for API endpoints, database schema, frontend components
  - Remove Phase I-specific sections (CLI commands, in-memory constraints)

- Read and update `.specify/templates/plan-template.md`:
  - Add architecture sections for three-layer design
  - Add API contract design section
  - Add database schema design section
  - Remove Phase I architecture patterns

- Read and update `.specify/templates/tasks-template.md`:
  - Add task categories: API tasks, frontend tasks, database tasks
  - Add integration test tasks
  - Remove Phase I-specific task types

- Scan `.claude/commands/*.md` for Phase I references and update

### 10. Failure Handling (CRITICAL)

**REJECT and ABORT if:**
- Phase I constitution is incomplete or has unresolved TODOs
- User requests partial upgrade (e.g., "just add database, keep CLI")
- Phase I code is not properly isolated from Phase II code paths
- Any Phase I constraints are being carried into Phase II
- Technology stack deviates from approved list without ADR
- Required sections are missing from upgrade

**On rejection:**
- Output clear error message explaining what's missing
- List specific blockers that must be resolved
- Do NOT proceed with partial constitution update
- Do NOT create PHR for failed upgrade

### 11. Produce Sync Impact Report

Prepend as HTML comment at top of constitution file:

```html
<!--
Sync Impact Report - Phase I → Phase II Upgrade:
- Version change: 1.x.x → 2.0.0 (MAJOR - Phase II architecture)
- Modified principles: [list each changed principle]
- Added sections: [list new sections]
- Deprecated sections: [list Phase I constraints removed]
- Templates requiring updates:
  - .specify/templates/plan-template.md [✅ updated / ⚠ pending]
  - .specify/templates/spec-template.md [✅ updated / ⚠ pending]
  - .specify/templates/tasks-template.md [✅ updated / ⚠ pending]
  - .claude/commands/*.md [✅ updated / ⚠ pending]
- Phase I deprecations: [list all deprecated patterns]
- Phase II additions: [list all new requirements]
- Follow-up TODOs: [list any deferred items]
-->
```

### 12. Validation Before Final Output

- ✅ No remaining unexplained placeholder tokens
- ✅ Version is exactly 2.0.0
- ✅ All Phase I constraints explicitly deprecated
- ✅ All Phase II principles clearly defined
- ✅ Technology stack fully specified
- ✅ No Phase I patterns leak into Phase II sections
- ✅ Dates in ISO format (YYYY-MM-DD)
- ✅ All three layers (frontend, API, database) covered
- ✅ Security standards included
- ✅ Migration path from Phase I documented

### 13. Write Updated Constitution

- Overwrite `.specify/memory/constitution.md` with Phase II constitution
- Ensure file is properly formatted (Markdown, no trailing whitespace)
- Verify file is readable after write

### 14. Output Summary to User

Provide:
- ✅ Constitution upgraded: Phase I (v1.x.x) → Phase II (v2.0.0)
- 📋 Key changes summary:
  - Technology stack: Python CLI → Next.js + FastAPI + Neon
  - Architecture: In-memory → Three-layer (web + API + DB)
  - Persistence: None → PostgreSQL database
  - Quality standards: Added API, database, frontend, security standards
- 🗑️ Deprecated: [list Phase I constraints removed]
- ➕ Added: [list Phase II principles and standards]
- 📁 Templates updated: [list files modified]
- ⚠️ Manual follow-up needed: [list any pending items]
- 💬 Suggested commit message:
  ```
  docs: upgrade constitution to Phase II (v2.0.0)

  - Add web + API + database architecture principles
  - Deprecate Phase I in-memory CLI constraints
  - Define Next.js, FastAPI, Neon technology stack
  - Add API, database, frontend, security standards
  - Update all dependent templates for Phase II

  BREAKING CHANGE: Phase I patterns no longer valid in Phase II code
  ```

### 15. Handoff Recommendations

Suggest next steps:
- "Run `/sp.specify` to create Phase II feature specifications"
- "Run `/sp.plan` to design Phase II architecture"
- "Use `phase-ii-governance-agent` to validate compliance before implementation"

---

## Formatting & Style Requirements

- Use Markdown headings exactly as specified
- Keep lines under 100 characters where practical
- Single blank line between sections
- No trailing whitespace
- Use emoji sparingly for visual markers (✅ ❌ 📋 🗑️ ➕ ⚠️ 💬)

---

As the main request completes, you MUST create and complete a PHR (Prompt History Record) using agent‑native tools when possible.

1) Determine Stage
   - Stage: constitution (this is a constitution upgrade)

2) Generate Title and Determine Routing:
   - Generate Title: "upgrade-constitution-phase-ii" (or similar 3-7 word slug)
   - Route: `history/prompts/constitution/` (constitution stage)

3) Create and Fill PHR (Shell first; fallback agent‑native)
   - Run: `.specify/scripts/bash/create-phr.sh --title "upgrade-constitution-phase-ii" --stage constitution --json`
   - Open the file and fill remaining placeholders (YAML + body), embedding full PROMPT_TEXT (verbatim) and concise RESPONSE_TEXT.
   - If the script fails:
     - Read `.specify/templates/phr-template.prompt.md` (or `templates/…`)
     - Allocate an ID; compute the output path: `history/prompts/constitution/<ID>-upgrade-constitution-phase-ii.constitution.prompt.md`
     - Fill placeholders and embed full PROMPT_TEXT and concise RESPONSE_TEXT

4) Validate + report
   - No unresolved placeholders; path under `history/prompts/constitution/`; stage/title/date coherent; print ID + path + stage + title.
   - On failure: warn, don't block. Skip only for `/sp.phr`.
