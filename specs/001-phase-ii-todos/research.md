# Research: Phase II Todo Management

**Feature**: Phase II Todo Management
**Branch**: `001-phase-ii-todos`
**Date**: 2026-01-06
**Status**: Complete

## Overview

This document captures technology decisions, best practices research, and architectural patterns for implementing the Phase II Todo Management feature. All decisions align with Phase II Constitution v2.0.0 requirements.

## Technology Stack Decisions

### Frontend: Next.js 15+ with React 19+

**Decision**: Use Next.js 15+ with App Router and React 19+ for the frontend.

**Rationale**:
- **Server-Side Rendering (SSR)**: Improves initial page load performance and SEO
- **App Router**: Modern routing with layouts, loading states, and error boundaries built-in
- **React Server Components**: Reduces client-side JavaScript bundle size
- **TypeScript Integration**: First-class TypeScript support with strict mode
- **Vercel Deployment**: Seamless deployment with zero configuration
- **Constitution Compliance**: Mandated by Phase II Constitution Principle VI

**Alternatives Considered**:
- **Create React App**: Rejected - deprecated, no SSR, larger bundle sizes
- **Vite + React**: Rejected - requires custom SSR setup, not mandated by constitution
- **Remix**: Rejected - not in approved stack, would require ADR justification

**Best Practices**:
- Use App Router (not Pages Router) for new projects
- Implement loading.tsx and error.tsx for better UX
- Use Server Components by default, Client Components only when needed
- Leverage Next.js Image component for optimized images
- Use environment variables for API base URL configuration

### Backend: FastAPI 0.100+

**Decision**: Use FastAPI 0.100+ with Python 3.13+ for the REST API backend.

**Rationale**:
- **Auto-Generated Documentation**: OpenAPI/Swagger docs at /api/v1/docs
- **Type Safety**: Pydantic v2 for request/response validation
- **Performance**: Async/await support for high concurrency
- **Developer Experience**: Automatic validation, serialization, and error handling
- **SQLModel Integration**: Seamless integration with SQLModel ORM
- **Constitution Compliance**: Mandated by Phase II Constitution Principle VI

**Alternatives Considered**:
- **Django REST Framework**: Rejected - heavier framework, not in approved stack
- **Flask**: Rejected - requires more manual setup, no auto-documentation
- **Express.js**: Rejected - would require Node.js backend, not in approved stack

**Best Practices**:
- Use Pydantic v2 models for all request/response schemas
- Implement dependency injection for database sessions
- Use APIRouter for modular endpoint organization
- Enable CORS with specific origins (no wildcard in production)
- Implement proper exception handlers for consistent error responses
- Use async endpoints for database operations

### Database: Neon PostgreSQL

**Decision**: Use Neon PostgreSQL (serverless) with SQLModel ORM and Alembic migrations.

**Rationale**:
- **Serverless**: Auto-scaling, pay-per-use pricing model
- **PostgreSQL Compatibility**: Full PostgreSQL feature set
- **Developer Experience**: Easy setup, connection pooling, branching support
- **SQLModel Integration**: Type-safe ORM combining SQLAlchemy + Pydantic
- **Alembic Migrations**: Version-controlled schema changes
- **Constitution Compliance**: Mandated by Phase II Constitution Principle VI

**Alternatives Considered**:
- **SQLite**: Rejected - not suitable for production, no concurrent writes
- **MongoDB**: Rejected - NoSQL not in approved stack, overkill for simple todos
- **Supabase**: Rejected - not in approved stack, would require ADR justification

**Best Practices**:
- Use SQLModel for all ORM operations (no raw SQL)
- Create Alembic migrations for all schema changes
- Use auto-increment integers for primary keys (simpler than UUIDs for MVP)
- Implement proper indexes for query performance
- Use database transactions for multi-step operations
- Configure connection pooling for production

### Styling: Tailwind CSS 3+

**Decision**: Use Tailwind CSS 3+ for styling.

**Rationale**:
- **Utility-First**: Rapid UI development with utility classes
- **Responsive Design**: Built-in responsive modifiers (sm:, md:, lg:)
- **Consistency**: Design system enforced through configuration
- **Performance**: Purges unused CSS in production
- **Developer Experience**: IntelliSense support in VS Code
- **Constitution Compliance**: Mandated by Phase II Constitution Principle VI

**Alternatives Considered**:
- **CSS Modules**: Rejected - more verbose, requires custom design system
- **Styled Components**: Rejected - runtime overhead, not in approved stack
- **Bootstrap**: Rejected - opinionated components, harder to customize

**Best Practices**:
- Configure Tailwind with custom colors and spacing if needed
- Use @apply for repeated utility combinations
- Implement dark mode support with class strategy
- Use Tailwind's form plugin for better form styling
- Leverage Tailwind's accessibility utilities

## Architecture Patterns

### API-First Architecture

**Pattern**: Frontend → API → Database (strict layer separation)

**Implementation**:
- Frontend communicates exclusively via REST API
- No direct database access from frontend code
- API layer handles all business logic and validation
- Database layer enforces data integrity constraints

**Benefits**:
- Clear separation of concerns
- Frontend and backend can be developed independently
- API can be consumed by multiple clients (web, mobile, CLI)
- Easier to test each layer in isolation

**Risks & Mitigations**:
- **Risk**: Network latency between layers
  - **Mitigation**: Optimize API response times (<500ms p95), implement caching
- **Risk**: API versioning complexity
  - **Mitigation**: Use URL versioning (/api/v1/), maintain backward compatibility

### RESTful API Design

**Pattern**: Resource-based URLs with standard HTTP methods

**Implementation**:
- Resources: `/api/v1/todos` (plural nouns)
- Methods: GET (read), POST (create), PATCH (update), DELETE (delete)
- Status Codes: 200 (success), 201 (created), 400 (bad request), 404 (not found), 422 (validation error), 500 (server error)
- Content-Type: application/json for all requests and responses

**Best Practices**:
- Use PATCH for partial updates (not PUT)
- Return created resource in POST response with 201 status
- Use 204 No Content for successful DELETE
- Include error details in 4xx/5xx responses
- Implement pagination for list endpoints (future enhancement)

### Component-Based Frontend

**Pattern**: Reusable React components with clear responsibilities

**Implementation**:
- **Container Components**: TodoList (data fetching, state management)
- **Presentation Components**: TodoItem, TodoForm (UI rendering)
- **UI Components**: Button, Input, LoadingSpinner (reusable primitives)

**Best Practices**:
- Keep components small and focused (single responsibility)
- Use TypeScript interfaces for props
- Implement loading, error, and success states
- Use React hooks for state management (useState, useEffect)
- Implement proper error boundaries

### Database Migration Strategy

**Pattern**: Version-controlled schema changes with Alembic

**Implementation**:
- All schema changes go through Alembic migrations
- Migrations are sequential and reversible
- Migration files committed to version control
- Migrations run automatically on deployment

**Best Practices**:
- Generate migrations with `alembic revision --autogenerate`
- Review auto-generated migrations before committing
- Test migrations on development database first
- Implement both upgrade() and downgrade() functions
- Use descriptive migration messages

## Environment Configuration

### Backend Environment Variables

**Required Variables**:
```
DATABASE_URL=postgresql://user:password@host:5432/dbname
CORS_ORIGINS=http://localhost:3000,https://yourdomain.com
API_VERSION=v1
DEBUG=false
```

**Best Practices**:
- Use Pydantic Settings for environment variable management
- Provide .env.example with all required variables
- Never commit .env files to version control
- Use different .env files for development/staging/production
- Validate environment variables on application startup

### Frontend Environment Variables

**Required Variables**:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_API_VERSION=v1
```

**Best Practices**:
- Prefix public variables with NEXT_PUBLIC_
- Use .env.local for local development
- Provide .env.local.example with all required variables
- Configure different API URLs for development/staging/production
- Never expose backend secrets in frontend environment variables

## Testing Strategy

### Backend Testing

**Layers**:
1. **Model Tests**: Test SQLModel classes and database operations
2. **Service Tests**: Test business logic in isolation
3. **API Tests**: Test endpoints with FastAPI TestClient
4. **Contract Tests**: Validate OpenAPI specification compliance

**Tools**:
- pytest for test runner
- FastAPI TestClient for API testing
- pytest-asyncio for async test support
- pytest fixtures for test data setup

**Best Practices**:
- Use in-memory SQLite for fast test execution
- Implement database fixtures with rollback after each test
- Test both success and error cases
- Validate request/response schemas
- Aim for >80% code coverage

### Frontend Testing

**Layers**:
1. **Unit Tests**: Test individual components in isolation
2. **Integration Tests**: Test component interactions
3. **E2E Tests**: Test complete user flows

**Tools**:
- Jest for unit/integration tests
- React Testing Library for component testing
- Playwright for E2E tests
- MSW (Mock Service Worker) for API mocking

**Best Practices**:
- Test user behavior, not implementation details
- Mock API calls in unit/integration tests
- Use real API in E2E tests
- Test loading, error, and success states
- Implement accessibility tests (screen reader, keyboard navigation)

## Security Considerations

### Input Validation

**Implementation**:
- Frontend: Client-side validation for immediate feedback
- Backend: Server-side validation with Pydantic (source of truth)
- Database: Constraints and foreign keys for data integrity

**Best Practices**:
- Validate on both frontend and backend (defense in depth)
- Use Pydantic validators for complex validation rules
- Sanitize user input to prevent XSS
- Use parameterized queries (SQLModel handles this)

### CORS Configuration

**Implementation**:
- Configure allowed origins in backend
- Use specific origins (no wildcard in production)
- Allow credentials if needed for future authentication

**Best Practices**:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Error Handling

**Implementation**:
- Never expose stack traces to users
- Return structured error responses
- Log detailed errors server-side
- Use appropriate HTTP status codes

**Best Practices**:
```python
# Backend error response format
{
    "error": "ValidationError",
    "message": "Title is required",
    "details": {
        "field": "title",
        "constraint": "required"
    }
}
```

## Performance Optimization

### Backend Performance

**Targets** (from spec.md):
- API response time: <500ms for 95th percentile
- Support up to 1000 todos without degradation

**Strategies**:
- Use async/await for database operations
- Implement database connection pooling
- Add indexes on frequently queried fields
- Use pagination for large result sets (future enhancement)
- Implement caching for read-heavy operations (future enhancement)

### Frontend Performance

**Targets** (from spec.md):
- Page load time: <2 seconds for initial load
- Todo list rendering: <100ms for lists up to 100 items

**Strategies**:
- Use Next.js Server Components for initial render
- Implement code splitting with dynamic imports
- Optimize images with Next.js Image component
- Use React.memo for expensive components
- Implement virtual scrolling for large lists (future enhancement)

## Deployment Strategy

### Backend Deployment

**Recommended Platform**: Railway or Render

**Requirements**:
- Python 3.13+ runtime
- PostgreSQL database (Neon)
- Environment variables configured
- Health check endpoint at /health

**Deployment Steps**:
1. Connect GitHub repository
2. Configure environment variables
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `uvicorn src.main:app --host 0.0.0.0 --port $PORT`
5. Run database migrations: `alembic upgrade head`

### Frontend Deployment

**Recommended Platform**: Vercel

**Requirements**:
- Node.js 18+ runtime
- Environment variables configured
- API base URL configured

**Deployment Steps**:
1. Connect GitHub repository
2. Configure environment variables (NEXT_PUBLIC_API_BASE_URL)
3. Vercel auto-detects Next.js and configures build
4. Deploy to production

## Open Questions & Future Research

### Phase III Considerations

**Authentication & Authorization**:
- Research: OAuth 2.0 vs JWT vs session-based auth
- Decision deferred to Phase III

**Real-Time Updates**:
- Research: WebSockets vs Server-Sent Events vs polling
- Decision deferred to Phase III

**File Uploads**:
- Research: S3 vs Cloudinary vs local storage
- Decision deferred to Phase III

### Performance Monitoring

**Observability**:
- Research: Sentry vs DataDog vs custom logging
- Decision deferred to Phase III

**Analytics**:
- Research: Google Analytics vs Plausible vs custom events
- Decision deferred to Phase III

## References

- [Next.js Documentation](https://nextjs.org/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SQLModel Documentation](https://sqlmodel.tiangolo.com/)
- [Neon Documentation](https://neon.tech/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Alembic Documentation](https://alembic.sqlalchemy.org/)
- [Pydantic Documentation](https://docs.pydantic.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev/)

## Conclusion

All technology decisions align with Phase II Constitution v2.0.0 requirements. The approved stack (Next.js, FastAPI, Neon PostgreSQL) provides a solid foundation for building a scalable, maintainable, and performant todo management application. No additional research required - ready to proceed to Phase 1 (Design & Contracts).
