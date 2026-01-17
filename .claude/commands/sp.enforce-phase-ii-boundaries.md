---
description: Prevent scope violations in Phase II by enforcing boundaries, rejecting Phase I patterns, and validating mandatory DB and API-first architecture.
handoffs:
  - label: Fix Constitution Issues
    agent: sp.upgrade-constitution-phase-ii
    prompt: Upgrade the constitution to Phase II to resolve boundary violations.
  - label: Fix Data Model Issues
    agent: sp.design-persistent-todo-data
    prompt: Redesign the data model to use persistent storage and remove Phase I patterns.
  - label: Fix API Issues
    agent: sp.specify-rest-todo-api
    prompt: Redesign the API to ensure proper separation and remove frontend coupling.
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Outline

You are enforcing Phase II boundaries to prevent scope violations. This is a **strict validation skill** that blocks any work that violates Phase II principles. You will scan all artifacts (constitution, specs, plans, code) and immediately reject if Phase I patterns are found, if database usage is missing, or if API-first architecture is violated.

**This skill is a GATEKEEPER. It does not fix violations—it only detects and blocks them.**

Follow this execution flow:

### 1. Pre-Flight Validation

Before proceeding, verify Phase II context:
- Read `.specify/memory/constitution.md`
- **REJECT** if constitution doesn't exist
- **REJECT** if constitution is Phase I (v1.x.x) - must be Phase II (v2.x.x)
- **REJECT** if constitution has unresolved TODOs or placeholders
- Confirm Phase II principles are defined (web, API, database)

### 2. Load All Artifacts for Inspection

Gather all artifacts that need validation:

**Constitution:**
- Read `.specify/memory/constitution.md`
- Extract Phase II principles
- Extract technology stack requirements
- Extract constraints and boundaries

**Specifications:**
- Scan `specs/*/spec.md` for all feature specs
- Scan `specs/api/*.md` for API specs
- Scan `specs/data-model/*.md` for data model specs
- Scan `specs/user-flows/*.md` for user flow specs

**Plans:**
- Scan `specs/*/plan.md` for implementation plans
- Check for architecture decisions

**Code (if exists):**
- Scan `api/` or `backend/` directory for backend code
- Scan `web/` or `frontend/` directory for frontend code
- Scan `src/` directory for any code
- Check for Phase I code that shouldn't be used in Phase II

**User Input:**
- Parse any specific files or areas to check from $ARGUMENTS
- Identify any specific concerns raised by user

### 3. Define Phase II Boundaries (Explicit Rules)

Establish the exact boundaries that must be enforced:

#### **Phase II Technology Stack (MANDATORY)**

**Frontend:**
- ✅ MUST use: Next.js 15+
- ✅ MUST use: React 19+
- ✅ MUST use: TypeScript 5+
- ✅ MUST use: Tailwind CSS 3+
- ❌ FORBIDDEN: CLI interfaces in web context
- ❌ FORBIDDEN: Terminal-based UI
- ❌ FORBIDDEN: Console-only output

**Backend:**
- ✅ MUST use: FastAPI 0.100+
- ✅ MUST use: Python 3.13+
- ✅ MUST use: Pydantic v2
- ✅ MUST use: SQLModel for ORM
- ❌ FORBIDDEN: In-memory storage
- ❌ FORBIDDEN: Python standard library only constraint
- ❌ FORBIDDEN: CLI-only backend

**Database:**
- ✅ MUST use: Neon PostgreSQL (serverless)
- ✅ MUST use: Persistent storage
- ✅ MUST use: Database migrations (Alembic)
- ❌ FORBIDDEN: In-memory storage
- ❌ FORBIDDEN: File-based storage (JSON, CSV, etc.)
- ❌ FORBIDDEN: No persistence

**Architecture:**
- ✅ MUST use: Three-layer separation (Frontend ↔ API ↔ Database)
- ✅ MUST use: REST API for all data operations
- ✅ MUST use: JSON-only communication
- ❌ FORBIDDEN: Direct database access from frontend
- ❌ FORBIDDEN: Frontend-backend coupling
- ❌ FORBIDDEN: Monolithic architecture mixing concerns

#### **Phase I Patterns (FORBIDDEN IN PHASE II)**

**Storage Patterns:**
- ❌ In-memory lists: `todos = []`
- ❌ In-memory dictionaries: `todos = {}`
- ❌ Session-based storage
- ❌ Global variables for data storage
- ❌ Data lost on restart
- ❌ No persistence layer

**Indexing Patterns:**
- ❌ Positional indexes: `todos[0]`, `todos[1]`
- ❌ List-based indexing
- ❌ Manual ID assignment based on list length
- ❌ Index-based CRUD operations

**Interface Patterns:**
- ❌ CLI-only interfaces: `input()`, `print()`
- ❌ Terminal menus
- ❌ Command-line arguments for user interaction
- ❌ STDIN/STDOUT for data I/O
- ❌ Console-based UI

**Dependency Patterns:**
- ❌ Python standard library only
- ❌ No external dependencies
- ❌ No pip packages beyond stdlib

**Architecture Patterns:**
- ❌ Single-file applications
- ❌ No separation of concerns
- ❌ Mixed CLI and web logic
- ❌ Direct function calls instead of API

#### **Phase II Requirements (MANDATORY)**

**Database Usage:**
- ✅ MUST persist all data to Neon PostgreSQL
- ✅ MUST use SQLModel for ORM
- ✅ MUST use UUID or auto-increment primary keys
- ✅ MUST use foreign key relationships
- ✅ MUST use database migrations (Alembic)
- ✅ MUST survive application restarts
- ✅ MUST support concurrent users

**API-First Architecture:**
- ✅ MUST expose REST API endpoints
- ✅ MUST use JSON for all requests/responses
- ✅ MUST validate with Pydantic models
- ✅ MUST document with OpenAPI/Swagger
- ✅ MUST handle errors with proper HTTP status codes
- ✅ MUST be framework-agnostic (no frontend coupling)
- ✅ MUST separate frontend and backend

**Frontend Requirements:**
- ✅ MUST use Next.js web interface
- ✅ MUST communicate via API only
- ✅ MUST NOT access database directly
- ✅ MUST handle loading/error/success states
- ✅ MUST be responsive (mobile, tablet, desktop)
- ✅ MUST be accessible (WCAG 2.1 AA)

### 4. Scan for Phase I Pattern Violations

Check all artifacts and code for forbidden Phase I patterns:

#### **Check Constitution**

Scan `.specify/memory/constitution.md`:
- ❌ VIOLATION: Version is 1.x.x (Phase I)
- ❌ VIOLATION: Contains "in-memory only" constraint
- ❌ VIOLATION: Contains "CLI-only" constraint
- ❌ VIOLATION: Contains "Python standard library only" constraint
- ❌ VIOLATION: Contains "no external dependencies" constraint
- ❌ VIOLATION: Contains "no persistence" constraint
- ❌ VIOLATION: Missing Phase II technology stack
- ❌ VIOLATION: Missing database requirements
- ❌ VIOLATION: Missing API requirements

**If ANY violation found: IMMEDIATE REJECT**

#### **Check Specifications**

Scan all `specs/*/spec.md` files:
- ❌ VIOLATION: Mentions "in-memory storage"
- ❌ VIOLATION: Mentions "positional index" or "list index"
- ❌ VIOLATION: Mentions "CLI interface" for Phase II features
- ❌ VIOLATION: Mentions "console output" for user interaction
- ❌ VIOLATION: Mentions "no database" or "no persistence"
- ❌ VIOLATION: Mentions direct database access from frontend
- ❌ VIOLATION: Missing API endpoints for data operations
- ❌ VIOLATION: Missing database schema definitions

**If ANY violation found: IMMEDIATE REJECT**

#### **Check API Specifications**

Scan `specs/api/*.md` files:
- ❌ VIOLATION: Non-JSON communication (HTML, XML, form-data)
- ❌ VIOLATION: Frontend-specific endpoints
- ❌ VIOLATION: Session-based authentication (use tokens)
- ❌ VIOLATION: Server-side rendering of UI
- ❌ VIOLATION: Tight coupling to frontend framework
- ❌ VIOLATION: Missing Pydantic models
- ❌ VIOLATION: Missing error responses
- ❌ VIOLATION: Missing OpenAPI documentation

**If ANY violation found: IMMEDIATE REJECT**

#### **Check Data Model Specifications**

Scan `specs/data-model/*.md` files:
- ❌ VIOLATION: In-memory storage mentioned
- ❌ VIOLATION: Positional indexes used
- ❌ VIOLATION: No primary keys defined
- ❌ VIOLATION: No database specified
- ❌ VIOLATION: File-based storage (JSON, CSV)
- ❌ VIOLATION: No persistence layer
- ❌ VIOLATION: Missing SQLModel definitions
- ❌ VIOLATION: Missing migration strategy

**If ANY violation found: IMMEDIATE REJECT**

#### **Check User Flow Specifications**

Scan `specs/user-flows/*.md` files:
- ❌ VIOLATION: CLI interactions described
- ❌ VIOLATION: Terminal-based navigation
- ❌ VIOLATION: Console output for user feedback
- ❌ VIOLATION: Direct database access from UI
- ❌ VIOLATION: No API calls for data operations
- ❌ VIOLATION: Missing loading/error states
- ❌ VIOLATION: Missing API integration points

**If ANY violation found: IMMEDIATE REJECT**

#### **Check Implementation Plans**

Scan `specs/*/plan.md` files:
- ❌ VIOLATION: Plans to use in-memory storage
- ❌ VIOLATION: Plans to use CLI interfaces
- ❌ VIOLATION: Plans to use positional indexes
- ❌ VIOLATION: Plans to access database from frontend
- ❌ VIOLATION: Plans to skip API layer
- ❌ VIOLATION: Plans to use Phase I patterns
- ❌ VIOLATION: Missing database integration
- ❌ VIOLATION: Missing API integration

**If ANY violation found: IMMEDIATE REJECT**

### 5. Scan for Missing Mandatory Database Usage

Check that database usage is present and correct:

#### **Database Configuration**

Check for database configuration:
- ❌ VIOLATION: No database connection string
- ❌ VIOLATION: No Neon PostgreSQL configuration
- ❌ VIOLATION: Using SQLite or other non-Neon database
- ❌ VIOLATION: No database environment variables
- ❌ VIOLATION: Hardcoded database credentials

**If ANY violation found: IMMEDIATE REJECT**

#### **Database Models**

Check for SQLModel definitions:
- ❌ VIOLATION: No SQLModel classes defined
- ❌ VIOLATION: Using plain Pydantic (not SQLModel)
- ❌ VIOLATION: No table definitions
- ❌ VIOLATION: No primary keys
- ❌ VIOLATION: No foreign key relationships
- ❌ VIOLATION: Using in-memory data structures instead

**If ANY violation found: IMMEDIATE REJECT**

#### **Database Migrations**

Check for migration setup:
- ❌ VIOLATION: No Alembic configuration
- ❌ VIOLATION: No migration files
- ❌ VIOLATION: No migration strategy documented
- ❌ VIOLATION: Manual schema changes (not versioned)

**If ANY violation found: IMMEDIATE REJECT**

#### **Database Operations**

Check that all CRUD operations use database:
- ❌ VIOLATION: CRUD operations using in-memory lists
- ❌ VIOLATION: CRUD operations using file I/O
- ❌ VIOLATION: CRUD operations without database queries
- ❌ VIOLATION: Data not persisted to database

**If ANY violation found: IMMEDIATE REJECT**

### 6. Scan for API-First Architecture Violations

Check that API-first architecture is enforced:

#### **Frontend-Backend Separation**

Check for proper separation:
- ❌ VIOLATION: Frontend code accessing database directly
- ❌ VIOLATION: Database queries in React components
- ❌ VIOLATION: SQLModel imports in frontend code
- ❌ VIOLATION: Database connection in frontend
- ❌ VIOLATION: Shared code mixing frontend and backend concerns

**If ANY violation found: IMMEDIATE REJECT**

#### **API Layer Presence**

Check that API layer exists:
- ❌ VIOLATION: No API endpoints defined
- ❌ VIOLATION: No FastAPI application
- ❌ VIOLATION: Frontend calling database functions directly
- ❌ VIOLATION: No REST API for CRUD operations
- ❌ VIOLATION: Missing API specification

**If ANY violation found: IMMEDIATE REJECT**

#### **API Communication**

Check that all frontend-backend communication goes through API:
- ❌ VIOLATION: Direct function calls from frontend to backend
- ❌ VIOLATION: Shared memory between frontend and backend
- ❌ VIOLATION: RPC-style calls instead of REST
- ❌ VIOLATION: Non-HTTP communication
- ❌ VIOLATION: Missing HTTP client (fetch, axios) in frontend

**If ANY violation found: IMMEDIATE REJECT**

#### **API Documentation**

Check that API is documented:
- ❌ VIOLATION: No OpenAPI/Swagger documentation
- ❌ VIOLATION: Undocumented endpoints
- ❌ VIOLATION: Missing request/response models
- ❌ VIOLATION: Missing error responses
- ❌ VIOLATION: No API specification file

**If ANY violation found: IMMEDIATE REJECT**

### 7. Check Code Implementation (if exists)

If code has been written, scan for violations:

#### **Backend Code Checks**

Scan `api/` or `backend/` directory:

**Python Files:**
```python
# VIOLATIONS to detect:
❌ todos = []  # In-memory list
❌ todos = {}  # In-memory dict
❌ todos[0]    # Positional index
❌ input()     # CLI input
❌ print()     # CLI output (except logging)
❌ No SQLModel imports
❌ No database session usage
❌ No FastAPI decorators
```

**Check for:**
- ❌ VIOLATION: In-memory data structures for persistence
- ❌ VIOLATION: Positional indexing
- ❌ VIOLATION: CLI input/output functions
- ❌ VIOLATION: No database imports
- ❌ VIOLATION: No API route definitions
- ❌ VIOLATION: Phase I code patterns

**If ANY violation found: IMMEDIATE REJECT**

#### **Frontend Code Checks**

Scan `web/` or `frontend/` directory:

**TypeScript/JavaScript Files:**
```typescript
// VIOLATIONS to detect:
❌ import { SQLModel } from 'sqlmodel'  // Database in frontend
❌ import psycopg2  // Database driver in frontend
❌ Direct SQL queries
❌ Database connection strings
❌ No fetch() or axios calls for data
❌ Direct backend function imports
```

**Check for:**
- ❌ VIOLATION: Database imports in frontend
- ❌ VIOLATION: SQL queries in frontend
- ❌ VIOLATION: Direct backend function calls
- ❌ VIOLATION: No API calls for data operations
- ❌ VIOLATION: CLI-style interfaces

**If ANY violation found: IMMEDIATE REJECT**

#### **Shared Code Checks**

Check for improper code sharing:
- ❌ VIOLATION: Database models imported in frontend
- ❌ VIOLATION: Backend logic in frontend files
- ❌ VIOLATION: Frontend logic in backend files
- ❌ VIOLATION: Mixed concerns in shared utilities

**If ANY violation found: IMMEDIATE REJECT**

### 8. Generate Violation Report

If violations found, generate comprehensive report:

**Report Structure:**
```markdown
# Phase II Boundary Violations Detected

## ⛔ IMPLEMENTATION BLOCKED

Phase II boundaries have been violated. Implementation cannot proceed until all violations are resolved.

## Violations Found

### Constitution Violations
- [List each violation with file path and line number]

### Specification Violations
- [List each violation with file path and line number]

### Code Violations
- [List each violation with file path and line number]

### Database Usage Violations
- [List missing or incorrect database usage]

### API Architecture Violations
- [List API-first architecture violations]

## Required Actions

### Immediate Actions Required:
1. [Specific action to fix violation 1]
2. [Specific action to fix violation 2]
...

### Recommended Skills to Run:
- Run `/sp.upgrade-constitution-phase-ii` if constitution is Phase I
- Run `/sp.design-persistent-todo-data` if data model uses in-memory storage
- Run `/sp.specify-rest-todo-api` if API layer is missing or incorrect

## Phase II Requirements Summary

### MUST Have:
- ✅ Phase II constitution (v2.x.x)
- ✅ Neon PostgreSQL database
- ✅ SQLModel ORM
- ✅ FastAPI REST API
- ✅ Next.js frontend
- ✅ Three-layer architecture (Frontend ↔ API ↔ Database)

### MUST NOT Have:
- ❌ In-memory storage
- ❌ Positional indexes
- ❌ CLI interfaces (in Phase II context)
- ❌ Direct database access from frontend
- ❌ Phase I patterns

## Next Steps

1. Review all violations listed above
2. Run recommended skills to fix violations
3. Re-run `/sp.enforce-phase-ii-boundaries` to verify fixes
4. Only proceed with implementation after all violations resolved
```

### 9. Immediate Rejection on Violation

If ANY violation found:

**Output:**
```
⛔ PHASE II BOUNDARY VIOLATION DETECTED

Implementation is BLOCKED until violations are resolved.

Violations: [count]
- Constitution: [count]
- Specifications: [count]
- Code: [count]
- Database: [count]
- API: [count]

See detailed report above for required actions.

❌ DO NOT PROCEED WITH IMPLEMENTATION
```

**Actions:**
- Write violation report to `specs/violations/phase-ii-boundary-violations.md`
- Exit with error status
- Do NOT proceed with any implementation
- Do NOT create tasks or plans
- Do NOT write any code

### 10. Success Path (No Violations)

If NO violations found:

**Output:**
```
✅ PHASE II BOUNDARIES VERIFIED

All Phase II boundaries are properly enforced:
- ✅ Constitution is Phase II (v2.x.x)
- ✅ Database usage is mandatory (Neon PostgreSQL)
- ✅ API-first architecture is enforced
- ✅ No Phase I patterns detected
- ✅ Proper separation of concerns

Phase II implementation may proceed.

Checked:
- Constitution: [file path]
- Specifications: [count] files
- Plans: [count] files
- Code: [count] files

All artifacts comply with Phase II requirements.
```

**Actions:**
- Write success report to `specs/validation/phase-ii-boundary-check.md`
- Include timestamp and checked files
- Proceed with implementation

### 11. Validation Checklist

Before finalizing, verify all checks completed:

**Constitution Checks:**
- ✅ Version is 2.x.x (Phase II)
- ✅ Phase II principles defined
- ✅ Technology stack specified
- ✅ Phase I constraints deprecated

**Database Checks:**
- ✅ Neon PostgreSQL configured
- ✅ SQLModel models defined
- ✅ Migrations setup (Alembic)
- ✅ No in-memory storage

**API Checks:**
- ✅ FastAPI endpoints defined
- ✅ Pydantic models for validation
- ✅ OpenAPI documentation
- ✅ No frontend coupling

**Frontend Checks:**
- ✅ Next.js application
- ✅ API calls for all data operations
- ✅ No direct database access
- ✅ No CLI interfaces

**Architecture Checks:**
- ✅ Three-layer separation
- ✅ Frontend ↔ API ↔ Database
- ✅ No mixed concerns
- ✅ Proper boundaries

**Phase I Pattern Checks:**
- ✅ No in-memory storage
- ✅ No positional indexes
- ✅ No CLI interfaces (in Phase II context)
- ✅ No Python stdlib-only constraint

### 12. Output Summary

**If Violations Found:**
```
⛔ PHASE II BOUNDARY ENFORCEMENT: FAILED

Violations detected: [count]
Implementation BLOCKED

See: specs/violations/phase-ii-boundary-violations.md

Required actions:
1. [Action 1]
2. [Action 2]
...

Re-run this skill after fixing violations.
```

**If No Violations:**
```
✅ PHASE II BOUNDARY ENFORCEMENT: PASSED

All boundaries verified
Implementation may proceed

See: specs/validation/phase-ii-boundary-check.md

Next steps:
- Run /sp.tasks to generate implementation tasks
- Run /sp.implement to begin implementation
```

---

## Usage Notes

**When to Use This Skill:**
- Before starting Phase II implementation
- After creating specifications
- Before generating tasks
- During code review
- When transitioning from Phase I to Phase II
- As a pre-commit check

**What This Skill Does:**
- Scans all artifacts for Phase II boundary violations
- Immediately blocks on any violation
- Provides detailed violation report
- Suggests corrective actions

**What This Skill Does NOT Do:**
- Does not fix violations (only detects)
- Does not generate code
- Does not create specifications
- Does not modify existing files (except reports)

**Integration with Agents:**
- Works with `phase-ii-governance-agent` for validation
- Blocks `sp.implement` if violations found
- Blocks `sp.tasks` if violations found
- Allows handoff to fix skills if violations found

---

## Formatting & Style Requirements

- Use emoji for visual impact (⛔ ✅ ❌)
- Use bold for violations and requirements
- Use code blocks for pattern examples
- Use tables for summaries
- Keep violation messages clear and actionable
- No trailing whitespace

---

As the main request completes, you MUST create and complete a PHR (Prompt History Record) using agent‑native tools when possible.

1) Determine Stage
   - Stage: misc (this is governance/validation)

2) Generate Title and Determine Routing:
   - Generate Title: "enforce-phase-ii-boundaries" (or similar 3-7 word slug)
   - Route: `history/prompts/general/` (general governance)

3) Create and Fill PHR (Shell first; fallback agent‑native)
   - Run: `.specify/scripts/bash/create-phr.sh --title "enforce-phase-ii-boundaries" --stage misc --json`
   - Open the file and fill remaining placeholders (YAML + body), embedding full PROMPT_TEXT (verbatim) and concise RESPONSE_TEXT.
   - If the script fails:
     - Read `.specify/templates/phr-template.prompt.md` (or `templates/…`)
     - Allocate an ID; compute the output path: `history/prompts/general/<ID>-enforce-phase-ii-boundaries.misc.prompt.md`
     - Fill placeholders and embed full PROMPT_TEXT and concise RESPONSE_TEXT

4) Validate + report
   - No unresolved placeholders; path under `history/prompts/general/`; stage/title/date coherent; print ID + path + stage + title.
   - On failure: warn, don't block. Skip only for `/sp.phr`.
