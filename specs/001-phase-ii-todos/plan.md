# Implementation Plan: Phase II Todo Management

**Branch**: `001-phase-ii-todos` | **Date**: 2026-01-06 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-phase-ii-todos/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement a full-stack web application for todo management with persistent storage. Users can create, view, update, delete, and mark todos as complete through a Next.js web interface that communicates with a FastAPI backend, which persists data to Neon PostgreSQL. The implementation follows Phase II architecture with strict separation between frontend (Next.js), API layer (FastAPI), and database (Neon PostgreSQL with SQLModel ORM).

## Technical Context

**Project Type**: Phase II Full-Stack Web Application

### Phase II Full-Stack Web Application

**Frontend**:
- Framework: Next.js 15+ with App Router
- UI Library: React 19+ with hooks
- Language: TypeScript 5+ (strict mode)
- Styling: Tailwind CSS 3+
- State Management: React hooks, Context API
- HTTP Client: fetch API (native)
- Deployment: Vercel (recommended)

**Backend**:
- Framework: FastAPI 0.100+
- Language: Python 3.13+
- Validation: Pydantic v2
- ORM: SQLModel (SQLAlchemy + Pydantic)
- Migrations: Alembic
- Documentation: OpenAPI/Swagger (auto-generated)
- Deployment: Railway, Render, or similar

**Database**:
- Database: Neon PostgreSQL (serverless)
- ORM: SQLModel
- Migrations: Alembic
- Primary Keys: Auto-increment integers (id)
- Relationships: None for MVP (single table)

**Testing**:
- Frontend: Jest, React Testing Library
- Backend: pytest, FastAPI TestClient
- E2E: Playwright (recommended)
- API: Contract tests with OpenAPI validation

### Performance Goals

From spec.md Success Criteria:
- API response time: <500ms for 95th percentile
- Page load time: <2 seconds for initial load
- Todo list rendering: <100ms for lists up to 100 items
- Todo creation: <10 seconds from click to display
- Completion toggle: <1 second visual feedback

### Constraints

From spec.md Non-Functional Requirements:
- 99% uptime for API endpoints
- Zero data loss for successful operations
- Graceful degradation when API unavailable
- Support up to 1000 todos without performance degradation
- Responsive design (mobile and desktop)
- Accessible (keyboard navigation, screen reader support)

### Scale/Scope

Phase II MVP scope:
- Single-user system (no authentication in Phase II)
- Up to 1000 todos per user
- English language only
- Text-only todos (no attachments)
- Standard web connectivity (not optimized for offline)
- Desktop and mobile web browsers

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Phase II Requirements

- ✅ **Uses approved technology stack**: Next.js 15+, FastAPI 0.100+, Neon PostgreSQL
- ✅ **API-first architecture**: Frontend → API → Database (no direct DB access)
- ✅ **Frontend-backend separation**: Clear boundaries between layers
- ✅ **Persistent storage**: Neon PostgreSQL with SQLModel ORM (no in-memory)
- ✅ **No Phase I patterns**: No CLI, no in-memory lists, no positional indexes
- ✅ **Database migrations**: Alembic for all schema changes
- ✅ **OpenAPI/Swagger documentation**: Auto-generated at /api/v1/docs
- ✅ **Proper error handling**: Validation on both frontend and backend
- ✅ **Spec-driven development**: Complete spec.md exists and validated
- ✅ **Test-first development**: TDD at all layers (API, frontend, database)

### Constitution Compliance Summary

**Status**: ✅ PASS - All Phase II requirements met

This feature fully complies with Phase II Constitution v2.0.0:
- Principle II (Phase II Integrity): Uses approved stack, forbids Phase I patterns
- Principle VII (API-First Architecture): RESTful API layer between frontend and database
- Principle VIII (Frontend-Backend Separation): Clear layer boundaries
- Principle IX (Data Integrity and Security): Persistent storage, migrations, validation

**No violations detected**. No complexity tracking required.

## Project Structure

### Documentation (this feature)

```text
specs/001-phase-ii-todos/
├── spec.md              # Feature specification (completed)
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (technology decisions)
├── data-model.md        # Phase 1 output (SQLModel schemas)
├── quickstart.md        # Phase 1 output (setup instructions)
├── contracts/           # Phase 1 output (API contracts)
│   ├── todos-api.yaml   # OpenAPI specification
│   └── README.md        # Contract documentation
├── checklists/          # Quality validation
│   └── requirements.md  # Spec validation (completed)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
api/                          # FastAPI backend
├── src/
│   ├── models/              # SQLModel database models
│   │   ├── __init__.py
│   │   └── todo.py          # Todo SQLModel class
│   ├── schemas/             # Pydantic request/response models
│   │   ├── __init__.py
│   │   ├── todo.py          # TodoCreate, TodoUpdate, TodoResponse
│   │   └── error.py         # Error response models
│   ├── routers/             # API endpoints
│   │   ├── __init__.py
│   │   └── todos.py         # /api/v1/todos endpoints
│   ├── services/            # Business logic
│   │   ├── __init__.py
│   │   └── todo_service.py  # Todo CRUD operations
│   ├── database.py          # Database connection and session
│   ├── config.py            # Pydantic settings (env vars)
│   └── main.py              # FastAPI app initialization
├── alembic/                 # Database migrations
│   ├── versions/            # Migration files
│   ├── env.py               # Alembic environment
│   └── alembic.ini          # Alembic configuration
├── tests/
│   ├── __init__.py
│   ├── conftest.py          # Pytest fixtures
│   ├── test_api/            # API endpoint tests
│   │   └── test_todos.py    # Todo endpoint tests
│   ├── test_models/         # Database model tests
│   │   └── test_todo.py     # Todo model tests
│   └── test_services/       # Business logic tests
│       └── test_todo_service.py
├── .env.example             # Environment variable template
├── requirements.txt         # Python dependencies
└── README.md                # Backend setup instructions

web/                          # Next.js frontend
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Home page (todo list)
│   │   └── globals.css      # Global styles
│   ├── components/          # React components
│   │   ├── todos/           # Todo-specific components
│   │   │   ├── TodoList.tsx
│   │   │   ├── TodoItem.tsx
│   │   │   ├── TodoForm.tsx
│   │   │   └── EmptyState.tsx
│   │   └── ui/              # Reusable UI components
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       └── LoadingSpinner.tsx
│   ├── lib/                 # Utilities and API client
│   │   ├── api/             # API client functions
│   │   │   ├── client.ts    # Base API client
│   │   │   └── todos.ts     # Todo API functions
│   │   └── utils.ts         # Helper functions
│   └── types/               # TypeScript types
│       ├── todo.ts          # Todo type definitions
│       └── api.ts           # API response types
├── public/                  # Static assets
│   └── favicon.ico
├── tests/
│   ├── unit/                # Component tests
│   │   └── todos/           # Todo component tests
│   └── e2e/                 # End-to-end tests
│       └── todos.spec.ts    # Todo user flow tests
├── .env.local.example       # Environment variable template
├── package.json             # Node dependencies
├── tsconfig.json            # TypeScript configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── next.config.js           # Next.js configuration
└── README.md                # Frontend setup instructions
```

**Structure Decision**: Phase II Web Application architecture selected. This structure provides:
- **Clear separation**: Backend (api/) and frontend (web/) are independent projects
- **Layer isolation**: Models → Services → Routers in backend; Components → API client in frontend
- **Testability**: Dedicated test directories at each layer
- **Scalability**: Modular structure supports future feature additions
- **Standards compliance**: Follows Phase II constitution requirements

## Complexity Tracking

No violations detected. Complexity tracking not required.

---

## Phase 0: Research & Technology Decisions

**Status**: ✅ Complete

**Output**: [research.md](./research.md)

### Technology Stack Decisions

All technology decisions align with Phase II Constitution v2.0.0:

1. **Frontend**: Next.js 15+ with React 19+ and TypeScript 5+
   - Rationale: SSR, App Router, first-class TypeScript support
   - Alternatives considered: CRA (deprecated), Vite (not in approved stack)

2. **Backend**: FastAPI 0.100+ with Python 3.13+
   - Rationale: Auto-generated docs, Pydantic validation, async support
   - Alternatives considered: Django REST (heavier), Flask (manual setup)

3. **Database**: Neon PostgreSQL (serverless)
   - Rationale: Serverless, PostgreSQL compatibility, easy setup
   - Alternatives considered: SQLite (not production-ready), MongoDB (not in stack)

4. **Styling**: Tailwind CSS 3+
   - Rationale: Utility-first, responsive, consistent design system
   - Alternatives considered: CSS Modules (verbose), Styled Components (runtime overhead)

### Architecture Patterns

- **API-First**: Frontend → API → Database (strict separation)
- **RESTful Design**: Resource-based URLs, standard HTTP methods
- **Component-Based**: Reusable React components with clear responsibilities
- **Migration Strategy**: Version-controlled schema changes with Alembic

### Environment Configuration

- Backend: DATABASE_URL, CORS_ORIGINS, API_VERSION, DEBUG
- Frontend: NEXT_PUBLIC_API_BASE_URL, NEXT_PUBLIC_API_VERSION

### Testing Strategy

- Backend: pytest, FastAPI TestClient, contract tests
- Frontend: Jest, React Testing Library, Playwright E2E

**No NEEDS CLARIFICATION items remain**. All technology decisions finalized.

---

## Phase 1: Design & Contracts

**Status**: ✅ Complete

**Outputs**:
- [data-model.md](./data-model.md) - SQLModel schema and Pydantic models
- [contracts/todos-api.yaml](./contracts/todos-api.yaml) - OpenAPI 3.1.0 specification
- [contracts/README.md](./contracts/README.md) - Contract documentation
- [quickstart.md](./quickstart.md) - Setup and development guide

### Data Model

**Entity**: Todo (single table for MVP)

**SQLModel Schema**:
- `id`: Integer (auto-increment primary key)
- `title`: String (required, 1-200 chars)
- `description`: String (optional, max 2000 chars)
- `completed`: Boolean (default false)
- `created_at`: DateTime (auto-generated)
- `updated_at`: DateTime (auto-updated)

**Indexes**:
- `idx_todos_created_at`: Optimize sorting (newest first)
- `idx_todos_completed`: Optimize filtering by status

**Pydantic Schemas**:
- `TodoCreate`: Request schema for POST
- `TodoUpdate`: Request schema for PATCH
- `TodoResponse`: Response schema for all operations
- `TodoListResponse`: Response schema for GET list

### API Contracts

**Base URL**: `/api/v1`

**Endpoints**:
1. `GET /todos` - List all todos (sorted by created_at DESC)
2. `POST /todos` - Create new todo
3. `GET /todos/{id}` - Get single todo
4. `PATCH /todos/{id}` - Update todo (partial)
5. `DELETE /todos/{id}` - Delete todo (hard delete)

**Status Codes**:
- 200 (success), 201 (created), 204 (no content)
- 400 (bad request), 404 (not found), 422 (validation error)
- 500 (server error)

**Validation**:
- Title: Required, 1-200 characters, trimmed
- Description: Optional, max 2000 characters, trimmed
- Completed: Boolean only

**Documentation**: OpenAPI/Swagger at `/api/v1/docs`

### Quickstart Guide

Complete setup instructions for:
- Database: Neon PostgreSQL provisioning
- Backend: FastAPI with virtual environment, migrations
- Frontend: Next.js with environment configuration
- Testing: pytest and npm test commands
- Troubleshooting: Common issues and solutions

### Constitution Re-Check (Post-Design)

**Status**: ✅ PASS - All Phase II requirements still met

- ✅ **Uses approved technology stack**: Confirmed in design artifacts
- ✅ **API-first architecture**: OpenAPI contract defines clear interface
- ✅ **Frontend-backend separation**: Contracts enforce layer boundaries
- ✅ **Persistent storage**: SQLModel schema for Neon PostgreSQL
- ✅ **No Phase I patterns**: No in-memory, CLI, or positional indexes
- ✅ **Database migrations**: Alembic migration strategy documented
- ✅ **OpenAPI/Swagger documentation**: Contract in YAML format
- ✅ **Proper error handling**: Error response schemas defined

**Design Quality**:
- Data model supports all user stories (P1-P4)
- API contracts cover all functional requirements (FR-001 through FR-015)
- Performance targets documented (API <500ms p95, page load <2s)
- Security considerations addressed (CORS, validation, error handling)

---

## Phase 2: Task Breakdown

**Status**: ⏸️ Pending - Use `/sp.tasks` command

The `/sp.plan` command stops here. Next steps:

1. **Review Planning Artifacts**:
   - Verify all design decisions align with requirements
   - Confirm no NEEDS CLARIFICATION items remain
   - Validate Constitution compliance

2. **Generate Tasks**: Run `/sp.tasks` to create tasks.md
   - Tasks will be organized by user story (P1, P2, P3, P4)
   - Each task will be atomic and testable
   - Dependencies will be clearly marked

3. **Begin Implementation**: After tasks.md is approved
   - Follow TDD at all layers (red-green-refactor)
   - Implement in priority order (P1 → P2 → P3 → P4)
   - Each user story should be independently testable

---

## Planning Summary

### Artifacts Created

1. **plan.md** (this file) - Implementation plan with technical context
2. **research.md** - Technology decisions and best practices
3. **data-model.md** - SQLModel schema and Pydantic models
4. **contracts/todos-api.yaml** - OpenAPI 3.1.0 specification
5. **contracts/README.md** - Contract documentation and usage
6. **quickstart.md** - Setup and development guide

### Key Decisions

- **Architecture**: Phase II full-stack web (Next.js + FastAPI + Neon)
- **Data Model**: Single table (todos) with 6 fields
- **API Design**: RESTful with 5 endpoints, JSON-only
- **Primary Keys**: Auto-increment integers (simpler than UUIDs for MVP)
- **Validation**: Pydantic on backend, client-side on frontend
- **Testing**: pytest (backend), Jest (frontend), Playwright (E2E)

### Constitution Compliance

✅ All Phase II requirements met:
- Approved technology stack used
- API-first architecture enforced
- Frontend-backend separation maintained
- Persistent storage with migrations
- No Phase I patterns present

### Ready for Next Phase

- ✅ All NEEDS CLARIFICATION items resolved
- ✅ Constitution check passed (pre and post-design)
- ✅ Data model supports all user stories
- ✅ API contracts cover all functional requirements
- ✅ Performance and security considerations documented
- ✅ Quickstart guide provides clear setup instructions

**Next Command**: `/sp.tasks` to generate task breakdown
