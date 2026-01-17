# API Contracts: Phase II Todo Management

**Feature**: Phase II Todo Management
**Branch**: `001-phase-ii-todos`
**Date**: 2026-01-06
**Status**: Complete

## Overview

This directory contains the API contract specifications for the Phase II Todo Management feature. The contracts define the REST API interface between the Next.js frontend and FastAPI backend.

## Contract Files

### todos-api.yaml

OpenAPI 3.1.0 specification for the Todo Management API.

**Base URL**: `/api/v1`

**Endpoints**:
- `GET /todos` - List all todos
- `POST /todos` - Create a new todo
- `GET /todos/{id}` - Get a single todo
- `PATCH /todos/{id}` - Update a todo
- `DELETE /todos/{id}` - Delete a todo

**Documentation**: Auto-generated Swagger UI available at `/api/v1/docs` when backend is running

## Using the Contracts

### Backend Implementation

The FastAPI backend MUST implement all endpoints exactly as specified in the OpenAPI contract.

**Validation**:
```bash
# Install OpenAPI validator
pip install openapi-spec-validator

# Validate contract
openapi-spec-validator contracts/todos-api.yaml
```

**Contract Tests**:
```python
# tests/test_api/test_contract.py
import pytest
from fastapi.testclient import TestClient
from openapi_core import Spec
from openapi_core.contrib.requests import RequestsOpenAPIRequest
from openapi_core.contrib.requests import RequestsOpenAPIResponse

def test_list_todos_matches_contract(client: TestClient, spec: Spec):
    """Verify GET /todos response matches OpenAPI contract."""
    response = client.get("/api/v1/todos")

    # Validate response against contract
    openapi_request = RequestsOpenAPIRequest(response.request)
    openapi_response = RequestsOpenAPIResponse(response)

    result = spec.validate_response(openapi_request, openapi_response)
    assert result.errors == []
```

### Frontend Implementation

The Next.js frontend MUST call endpoints exactly as specified in the OpenAPI contract.

**TypeScript Types**:
Generate TypeScript types from OpenAPI contract:
```bash
# Install openapi-typescript
npm install -D openapi-typescript

# Generate types
npx openapi-typescript contracts/todos-api.yaml -o web/src/types/api.ts
```

**API Client**:
```typescript
// web/src/lib/api/todos.ts
import type { paths } from '@/types/api';

type TodoListResponse = paths['/todos']['get']['responses']['200']['content']['application/json'];
type TodoCreateRequest = paths['/todos']['post']['requestBody']['content']['application/json'];

export async function listTodos(): Promise<TodoListResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/todos`);
  if (!response.ok) throw new Error('Failed to fetch todos');
  return response.json();
}

export async function createTodo(data: TodoCreateRequest): Promise<TodoResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create todo');
  return response.json();
}
```

## Contract Principles

### RESTful Conventions

**Resource-Based URLs**:
- ✅ `/api/v1/todos` (plural noun)
- ❌ `/api/v1/getTodos` (verb in URL)
- ❌ `/api/v1/todo` (singular noun)

**HTTP Methods**:
- `GET` - Read operations (idempotent, safe)
- `POST` - Create operations (not idempotent)
- `PATCH` - Partial update operations (not idempotent)
- `DELETE` - Delete operations (idempotent)

**Status Codes**:
- `200 OK` - Successful GET, PATCH
- `201 Created` - Successful POST
- `204 No Content` - Successful DELETE
- `400 Bad Request` - Invalid JSON or request format
- `404 Not Found` - Resource doesn't exist
- `422 Unprocessable Entity` - Validation error
- `500 Internal Server Error` - Unexpected server error

### JSON-Only Communication

All requests and responses use `application/json` content type.

**Request Headers**:
```
Content-Type: application/json
```

**Response Headers**:
```
Content-Type: application/json
```

### Error Response Format

All error responses follow a consistent structure:

**Standard Error**:
```json
{
  "error": "NotFound",
  "message": "Todo not found",
  "details": "No todo with ID 1"
}
```

**Validation Error**:
```json
{
  "error": "ValidationError",
  "message": "Validation failed",
  "details": [
    {
      "field": "title",
      "message": "Title is required",
      "type": "value_error"
    }
  ]
}
```

## Validation Rules

### Request Validation

**TodoCreate**:
- `title`: Required, 1-200 characters, trimmed
- `description`: Optional, max 2000 characters, trimmed

**TodoUpdate**:
- `title`: Optional, 1-200 characters if provided, trimmed
- `description`: Optional, max 2000 characters if provided, trimmed
- `completed`: Optional, boolean if provided

### Response Validation

**TodoResponse**:
- `id`: Integer, always present
- `title`: String, always present
- `description`: String or null
- `completed`: Boolean, always present
- `created_at`: ISO 8601 datetime, always present
- `updated_at`: ISO 8601 datetime, always present

## Performance Requirements

From spec.md Success Criteria:

- **API Response Time**: <500ms for 95th percentile
- **Create Todo**: <10 seconds from request to display
- **Toggle Complete**: <1 second visual feedback

## Security Considerations

### CORS Configuration

Backend MUST configure CORS to allow frontend origin:

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

### Input Validation

- **Backend**: Pydantic validates all requests (source of truth)
- **Frontend**: Client-side validation for immediate feedback
- **Database**: Constraints enforce data integrity

### Error Handling

- Never expose stack traces to clients
- Return structured error responses
- Log detailed errors server-side
- Use appropriate HTTP status codes

## Testing Strategy

### Contract Tests

Verify that implementation matches OpenAPI specification:

**Backend**:
```python
# Validate all endpoints against contract
def test_openapi_contract_compliance():
    spec = Spec.from_file_path('contracts/todos-api.yaml')
    # Test each endpoint
```

**Frontend**:
```typescript
// Verify API client matches contract
describe('API Client Contract', () => {
  it('should match OpenAPI types', () => {
    // TypeScript compilation ensures type safety
  });
});
```

### Integration Tests

Test actual API calls between frontend and backend:

**E2E Tests**:
```typescript
// tests/e2e/todos.spec.ts
test('create and view todo', async ({ page }) => {
  await page.goto('/');
  await page.fill('[data-testid="todo-title"]', 'Buy groceries');
  await page.click('[data-testid="create-todo"]');
  await expect(page.locator('text=Buy groceries')).toBeVisible();
});
```

## Versioning Strategy

### Current Version: v1

**URL Pattern**: `/api/v1/todos`

**Stability**: Stable - no breaking changes within v1

**Breaking Changes**: Require new version (v2)
- Removing endpoints
- Removing required fields
- Changing field types
- Changing status codes

**Non-Breaking Changes**: Allowed in v1
- Adding new endpoints
- Adding optional fields
- Adding new status codes
- Improving error messages

### Future Versions

When breaking changes are needed:
- Create `/api/v2/todos` endpoints
- Maintain v1 for backward compatibility
- Document migration path
- Deprecate v1 with sunset date

## Documentation

### Swagger UI

Interactive API documentation available at:
- **Development**: http://localhost:8000/api/v1/docs
- **Production**: https://api.yourdomain.com/api/v1/docs

### ReDoc

Alternative documentation format:
- **Development**: http://localhost:8000/api/v1/redoc
- **Production**: https://api.yourdomain.com/api/v1/redoc

## Compliance

### Phase II Constitution

- ✅ **Principle VII (API-First Architecture)**: RESTful conventions, JSON-only, proper status codes
- ✅ **Principle VIII (Frontend-Backend Separation)**: Clear API contract, no coupling
- ✅ **Principle IX (Data Integrity and Security)**: Input validation, CORS configuration

### Specification Alignment

- ✅ **FR-001 through FR-015**: All functional requirements supported by API endpoints
- ✅ **Success Criteria**: Performance targets documented
- ✅ **Validation Rules**: All validation rules enforced

## References

- [OpenAPI Specification 3.1.0](https://spec.openapis.org/oas/v3.1.0)
- [FastAPI OpenAPI Support](https://fastapi.tiangolo.com/tutorial/metadata/)
- [openapi-typescript](https://github.com/drwpow/openapi-typescript)
- [OpenAPI Validator](https://github.com/p1c2u/openapi-spec-validator)

## Conclusion

The API contracts provide a clear, testable interface between frontend and backend. All implementations MUST adhere to these contracts to ensure compatibility and maintainability.
