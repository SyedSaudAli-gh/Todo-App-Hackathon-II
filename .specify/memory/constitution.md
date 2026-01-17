<!--
Sync Impact Report:
- Version change: 1.1.0 → 2.0.0 (MAJOR - Phase II Architecture)
- Modified principles:
  - Principle II: "Phase Integrity" - Phase I (in-memory CLI) → Phase II (web + API + database)
  - Principle VI: "Python Standard Library Only" → "Technology Stack Compliance"
- Added sections:
  - API-First Architecture (new Principle VII)
  - Frontend-Backend Separation (new Principle VIII)
  - Data Integrity and Security (new Principle IX)
  - Phase I Deprecation (explicit deprecation notice)
  - Phase II Technology Stack (detailed stack requirements)
  - Phase II Quality Standards (API, database, frontend, security standards)
- Removed sections:
  - Phase I CLI-only constraints
  - Phase I in-memory storage constraints
  - Phase I Python stdlib-only constraint
- Templates requiring updates:
  - .specify/templates/plan-template.md ⚠ pending (add Phase II architecture sections)
  - .specify/templates/spec-template.md ⚠ pending (add API/database/frontend sections)
  - .specify/templates/tasks-template.md ⚠ pending (add Phase II task categories)
  - .claude/commands/*.md ⚠ pending (update for Phase II context)
- Follow-up TODOs:
  - Update all templates to reflect Phase II requirements
  - Review existing Phase I code for migration strategy
  - Create Phase II implementation guidelines
-->
# Phase II Constitution - Todo App (Full-Stack Web Application)

## Core Principles

### I. Spec-Driven Development
All implementation must strictly follow approved specifications. No implementation without proper specification and planning. This ensures traceability and prevents scope creep. Every feature must have a complete specification (spec.md), implementation plan (plan.md), and task breakdown (tasks.md) before any code is written.

### II. Phase II Integrity
Phase II introduces full-stack web architecture with persistent storage. The application MUST use:
- **Frontend**: Next.js 15+ with React 19+, TypeScript 5+, and Tailwind CSS 3+
- **Backend**: FastAPI 0.100+ with Python 3.13+, Pydantic v2, and SQLModel
- **Database**: Neon PostgreSQL (serverless) for all persistent storage

Phase II explicitly **FORBIDS**:
- In-memory storage for application data (use database)
- CLI-only interfaces for Phase II features (use web UI)
- Positional list indexing (use database primary keys)
- Direct database access from frontend (use API layer)
- Phase I patterns in Phase II code

### III. Reusability and Extension
Design must support future phases (Phase III+) through:
- API versioning strategy (v1, v2, etc.)
- Database migration support with Alembic
- Modular architecture enabling feature additions
- Clear contracts between layers (frontend ↔ API ↔ database)
- Backward compatibility within major API versions

### IV. Determinism and Testability
All components must be predictable and testable:
- **API**: Contract tests for all endpoints with OpenAPI/Swagger documentation
- **Database**: Transactional operations with rollback support
- **Frontend**: Unit tests for components, integration tests for user flows
- **End-to-End**: Critical user journeys tested across all layers
- All features must have clear, testable acceptance criteria

### V. Test-First Development (NON-NEGOTIABLE)
TDD remains mandatory across all layers:
- **API**: Write OpenAPI spec → Write tests → Implement endpoints → Tests pass → Refactor
- **Frontend**: Write component tests → Implement components → Tests pass → Refactor
- **Database**: Write schema tests → Create migrations → Tests pass → Refactor
- Red-Green-Refactor cycle strictly enforced at every layer

### VI. Technology Stack Compliance
Phase II requires specific technologies to ensure consistency and quality:

**Approved Frontend Stack**:
- Next.js 15+ (React framework with SSR/SSG)
- React 19+ (UI library)
- TypeScript 5+ (type safety)
- Tailwind CSS 3+ (styling)

**Approved Backend Stack**:
- FastAPI 0.100+ (Python web framework)
- Python 3.13+ (language)
- Pydantic v2 (validation)
- SQLModel (ORM combining SQLAlchemy + Pydantic)

**Approved Database**:
- Neon PostgreSQL (serverless, managed)
- Alembic (migrations)

**Prohibited**:
- Phase I patterns (in-memory storage, CLI interfaces, positional indexes)
- Unapproved frameworks or libraries without ADR justification
- Direct database access from frontend code
- Non-JSON API communication (except file uploads)

### VII. API-First Architecture
All data operations MUST go through the REST API layer:
- **Frontend → API → Database** (never Frontend → Database)
- RESTful conventions (resource-based URLs, proper HTTP methods)
- JSON-only communication for all requests and responses
- Proper HTTP status codes (200, 201, 400, 404, 422, 500)
- Request/response validation with Pydantic models
- OpenAPI/Swagger documentation auto-generated
- Framework-agnostic design (no frontend coupling)
- Stateless communication (no server-side sessions)

### VIII. Frontend-Backend Separation
Clear separation of concerns between layers:
- **Frontend**: Presentation, user interaction, client-side state
- **Backend**: Business logic, data validation, database operations
- **Database**: Data persistence, integrity constraints, relationships

**Frontend MUST**:
- Communicate with backend exclusively via REST API
- Handle loading, error, and success states for all operations
- Validate user input before API submission
- Never import database models or ORM code

**Backend MUST**:
- Expose REST API endpoints for all data operations
- Validate all inputs with Pydantic models
- Handle database transactions and error recovery
- Never render HTML or frontend-specific responses

**Database MUST**:
- Enforce data integrity with constraints and foreign keys
- Use migrations for all schema changes
- Support concurrent access with proper locking

### IX. Data Integrity and Security
Phase II introduces persistent data requiring robust security:

**Data Integrity**:
- All data persisted to Neon PostgreSQL
- Foreign key constraints enforced
- Database migrations version-controlled with Alembic
- Transactional operations with rollback on error
- Data survives application restarts

**Security**:
- Environment variables for secrets (never commit .env files)
- CORS configuration for API (restrict origins in production)
- Input validation on both frontend and backend
- SQL injection prevention through ORM usage (SQLModel)
- XSS prevention through React auto-escaping
- Proper error handling (no sensitive data in error messages)

## Phase II Technology Stack

### Frontend (Next.js)
- **Framework**: Next.js 15+ with App Router
- **UI Library**: React 19+ with hooks
- **Language**: TypeScript 5+ (strict mode enabled)
- **Styling**: Tailwind CSS 3+ (utility-first)
- **State Management**: React hooks, Context API
- **HTTP Client**: fetch API or axios
- **Deployment**: Vercel (recommended)

### Backend (FastAPI)
- **Framework**: FastAPI 0.100+
- **Language**: Python 3.13+
- **Validation**: Pydantic v2
- **ORM**: SQLModel (SQLAlchemy + Pydantic)
- **Migrations**: Alembic
- **Documentation**: OpenAPI/Swagger (auto-generated)
- **Deployment**: Railway, Render, or similar

### Database (Neon PostgreSQL)
- **Database**: Neon PostgreSQL (serverless)
- **ORM**: SQLModel
- **Migrations**: Alembic
- **Primary Keys**: UUID or auto-increment integers
- **Relationships**: Foreign keys with CASCADE/RESTRICT
- **Indexes**: Strategic indexing for query performance

## Phase II Quality Standards

### API Design Standards
- RESTful conventions (GET, POST, PUT, PATCH, DELETE)
- Resource-based URLs (nouns, not verbs): `/api/v1/todos`
- Proper HTTP status codes for all responses
- Request/response validation with Pydantic
- Structured error responses in JSON format
- API versioning in URL path (`/api/v1/...`)
- OpenAPI documentation accessible at `/api/v1/docs`
- CORS configuration for frontend communication

### Database Standards
- SQLModel for all ORM operations
- Alembic for all schema migrations
- Proper indexing for query performance
- Foreign key constraints enforced
- No raw SQL unless justified in ADR
- Connection pooling and transaction management
- Database operations wrapped in try-except blocks

### Frontend Standards
- TypeScript strict mode enabled
- Component-based architecture
- Server-side rendering (SSR) where appropriate
- Client-side state management with React hooks
- Responsive design (mobile-first approach)
- Accessibility (WCAG 2.1 AA minimum)
- Loading, error, and success states for all async operations
- No direct database access from frontend code

### Security Standards
- Environment variables for all secrets
- No hardcoded credentials or API keys
- CORS properly configured (no wildcard in production)
- Input validation on both frontend and backend
- SQL injection prevention through ORM
- XSS prevention through React auto-escaping
- Proper error handling (no stack traces to users)
- HTTPS in production

## Phase I Deprecation

The following Phase I constraints are **DEPRECATED** and MUST NOT be used in Phase II code:

### Deprecated Storage Patterns
- ❌ In-memory lists: `todos = []`
- ❌ In-memory dictionaries: `todos = {}`
- ❌ Session-based storage
- ❌ Data lost on restart
- ✅ **Use instead**: Neon PostgreSQL with SQLModel

### Deprecated Indexing Patterns
- ❌ Positional indexes: `todos[0]`, `todos[1]`
- ❌ List-based indexing
- ❌ Manual ID assignment based on list length
- ✅ **Use instead**: UUID or auto-increment primary keys

### Deprecated Interface Patterns
- ❌ CLI-only interfaces: `input()`, `print()`
- ❌ Terminal menus
- ❌ Console-based UI
- ✅ **Use instead**: Next.js web interface

### Deprecated Dependency Patterns
- ❌ Python standard library only
- ❌ No external dependencies
- ✅ **Use instead**: Approved Phase II technology stack

### Migration Path
- Phase I code remains in `src/` for reference
- Phase II code goes in `api/` (backend) and `web/` (frontend)
- No mixing of Phase I and Phase II patterns
- Phase I CLI may be maintained separately if needed

## Key Standards

### Feature Completeness
All features must have complete specifications before implementation:
- **Specification** (spec.md): User stories, acceptance criteria
- **API Contract**: Endpoints, request/response models, error responses
- **Data Model**: SQLModel schemas, relationships, migrations
- **User Flows**: End-to-end flows with loading/error/success states
- **Implementation Plan** (plan.md): Architecture decisions, technical approach
- **Tasks** (tasks.md): Atomic, testable tasks with acceptance criteria

### Code Quality
- Modular, clean, and readable code structure
- TypeScript for frontend (strict mode)
- Python type hints for backend
- Comprehensive documentation
- No manual code without corresponding task definition
- Code reviews verify Phase II compliance

### Task Mapping
Every code file must reference:
- Task ID from tasks.md
- Specification from spec.md
- Implementation plan from plan.md
This ensures traceability from specification through implementation.

## Constraints and Boundaries

### Phase II Scope (In Scope)
- Full-stack web application (Next.js + FastAPI + Neon)
- Persistent database storage
- REST API for all data operations
- Responsive web UI (mobile, tablet, desktop)
- CRUD operations for todos
- Filtering, sorting, pagination
- Error handling and loading states
- Basic security (input validation, CORS)

### Phase II Boundaries (Out of Scope)
- Real-time features (WebSockets, SSE) → Phase III+
- Advanced authentication (OAuth, SSO) → Phase III+
- File uploads/storage → Phase III+
- Email notifications → Phase III+
- Advanced analytics/reporting → Phase III+
- Mobile native apps → Phase III+
- Microservices architecture → Phase III+
- AI/ML features → Phase III+

## Success Criteria

### Phase II Completion Requires
- ✅ Web interface deployed and accessible
- ✅ REST API documented and functional (OpenAPI/Swagger)
- ✅ Database schema deployed to Neon PostgreSQL
- ✅ All CRUD operations work end-to-end
- ✅ Tests pass at all layers (unit, integration, e2e)
- ✅ No Phase I patterns in Phase II code
- ✅ Spec, plan, tasks, implementation fully traceable
- ✅ Code passes automated review for clean architecture
- ✅ Performance meets basic standards (API <500ms p95)
- ✅ Security standards met (validation, CORS, no secrets in code)

### Quality Gates
- All endpoints documented with OpenAPI
- All database operations use SQLModel
- All frontend components handle loading/error states
- No direct database access from frontend
- No Phase I patterns (in-memory, CLI, positional indexes)
- All tests passing (unit, integration, e2e)

## Governance

This constitution supersedes all other practices and requirements. Any deviation requires explicit amendment with proper approval through the `/sp.constitution` command.

### Amendment Procedure
1. Propose changes with clear rationale
2. Document impact on existing artifacts
3. Update constitution with version bump
4. Propagate changes to all dependent templates
5. Create ADR for significant architectural decisions

### Versioning Policy
- **MAJOR**: Backward incompatible changes (e.g., Phase I → Phase II)
- **MINOR**: New principles or expanded guidance
- **PATCH**: Clarifications, wording fixes, non-semantic changes

### Compliance Review
- All pull requests must verify compliance with Phase II principles
- Use `/sp.enforce-phase-ii-boundaries` to validate before implementation
- Phase II governance agent reviews all specifications and plans
- No implementation proceeds without passing boundary checks

### Phase II Enforcement
The constitution ensures focus on Phase II objectives:
- Full-stack web architecture
- Persistent database storage
- API-first design
- Frontend-backend separation
- Security and data integrity

All changes must maintain alignment with Spec-Driven Development methodology and Phase II architectural principles.

**Version**: 2.0.0 | **Ratified**: 2026-01-03 | **Last Amended**: 2026-01-06
