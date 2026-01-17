---
description: Define RESTful API contracts for Todo features with CRUD endpoints, validation, and JSON-only communication.
handoffs:
  - label: Design Data Model
    agent: sp.design-persistent-todo-data
    prompt: Design the persistent data model that supports these API endpoints.
  - label: Plan API Implementation
    agent: sp.plan
    prompt: Create the implementation plan for the Todo REST API based on this specification.
  - label: Design Frontend UI
    agent: sp.specify
    prompt: Create the frontend UI specification that consumes these API endpoints.
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Outline

You are defining the RESTful API contract for the Todo application. This API will be implemented in FastAPI, communicate exclusively via JSON, and must be completely decoupled from any specific frontend framework. All endpoints must be fully documented with request/response models, validation rules, and error responses.

Follow this execution flow:

### 1. Pre-Flight Validation

Before proceeding, verify Phase II context and dependencies:
- Read `.specify/memory/constitution.md` and confirm it's Phase II (v2.x.x)
- **REJECT** if constitution is Phase I (v1.x.x) - APIs not in Phase I scope
- Verify FastAPI is the approved backend framework
- Check for existing data model specs in `specs/data-model/`
- Check for existing feature specs in `specs/*/spec.md`
- **REJECT** if no data model or feature requirements exist

### 2. Load Requirements and Context

Gather requirements from multiple sources:

**From Constitution:**
- Read `.specify/memory/constitution.md`
- Extract API design standards (REST, OpenAPI, validation)
- Extract security requirements (CORS, input validation, error handling)
- Note any API-specific principles

**From Data Model (if exists):**
- Read `specs/data-model/todo-data-model.md` or similar
- Extract entity fields and types
- Extract relationships and foreign keys
- Extract validation constraints
- Map data model to API request/response models

**From Feature Specs (if exist):**
- Scan `specs/*/spec.md` for Todo-related features
- Extract functional requirements (what operations are needed)
- Extract non-functional requirements (performance, security)
- Identify user flows that require API support

**From User Input:**
- Parse any additional requirements from $ARGUMENTS
- Identify any specific endpoints or features requested

**Validation:**
- **REJECT** if no requirements found (need data model or feature spec)
- **REJECT** if requirements mention frontend-specific logic (HTML rendering, session state)
- **REJECT** if requirements conflict with Phase II constitution

### 3. Define API Design Principles

Establish REST API design principles for this specification:

**RESTful Conventions:**
- Resource-based URLs (nouns, not verbs): `/api/v1/todos`, not `/api/v1/getTodos`
- HTTP methods for operations: GET (read), POST (create), PUT/PATCH (update), DELETE (delete)
- Proper HTTP status codes for all responses
- Stateless communication (no server-side sessions)
- Idempotent operations where appropriate (GET, PUT, DELETE)

**JSON-Only Communication:**
- All request bodies: `Content-Type: application/json`
- All response bodies: `Content-Type: application/json`
- No HTML rendering
- No XML, form-data, or other formats (except file uploads if needed)
- Structured error responses in JSON

**API Versioning:**
- Version in URL path: `/api/v1/...`
- Major version increments for breaking changes
- Maintain backward compatibility within major version

**Frontend Decoupling:**
- No frontend framework assumptions (works with React, Vue, Angular, vanilla JS)
- No HTML templates or server-side rendering
- No session-based authentication (use tokens if auth needed)
- No frontend-specific endpoints (e.g., `/api/react-data`)
- Clear separation of concerns: API provides data, frontend handles presentation

**Documentation:**
- Every endpoint fully documented
- Request/response models defined with Pydantic
- Validation rules explicit
- Error responses standardized
- OpenAPI/Swagger auto-generated

### 4. Define CRUD Endpoints

Design all CRUD endpoints for Todo resources:

#### **Create Todo**
```
POST /api/v1/todos
Content-Type: application/json

Request Body:
{
  "title": "string (required, 1-200 chars)",
  "description": "string (optional, max 2000 chars)",
  "priority": "integer (optional, 1-5)",
  "due_date": "string (optional, ISO 8601 datetime)"
}

Success Response (201 Created):
{
  "id": "uuid",
  "title": "string",
  "description": "string | null",
  "completed": false,
  "priority": "integer | null",
  "due_date": "string | null",
  "created_at": "string (ISO 8601)",
  "updated_at": "string (ISO 8601)"
}

Error Responses:
- 400 Bad Request: Invalid JSON
- 422 Unprocessable Entity: Validation errors
- 500 Internal Server Error: Server error
```

#### **List Todos**
```
GET /api/v1/todos?completed={bool}&priority={int}&sort={field}&order={asc|desc}&limit={int}&offset={int}

Query Parameters:
- completed: boolean (optional) - Filter by completion status
- priority: integer (optional, 1-5) - Filter by priority
- sort: string (optional) - Sort field (created_at, updated_at, due_date, priority)
- order: string (optional, default: desc) - Sort order (asc, desc)
- limit: integer (optional, default: 50, max: 100) - Page size
- offset: integer (optional, default: 0) - Pagination offset

Success Response (200 OK):
{
  "items": [
    {
      "id": "uuid",
      "title": "string",
      "description": "string | null",
      "completed": boolean,
      "priority": "integer | null",
      "due_date": "string | null",
      "created_at": "string (ISO 8601)",
      "updated_at": "string (ISO 8601)"
    }
  ],
  "total": integer,
  "limit": integer,
  "offset": integer
}

Error Responses:
- 400 Bad Request: Invalid query parameters
- 500 Internal Server Error: Server error
```

#### **Get Single Todo**
```
GET /api/v1/todos/{id}

Path Parameters:
- id: uuid (required) - Todo identifier

Success Response (200 OK):
{
  "id": "uuid",
  "title": "string",
  "description": "string | null",
  "completed": boolean,
  "priority": "integer | null",
  "due_date": "string | null",
  "created_at": "string (ISO 8601)",
  "updated_at": "string (ISO 8601)"
}

Error Responses:
- 404 Not Found: Todo does not exist
- 400 Bad Request: Invalid UUID format
- 500 Internal Server Error: Server error
```

#### **Update Todo (Full)**
```
PUT /api/v1/todos/{id}
Content-Type: application/json

Path Parameters:
- id: uuid (required) - Todo identifier

Request Body (all fields required):
{
  "title": "string (required, 1-200 chars)",
  "description": "string (optional, max 2000 chars)",
  "completed": boolean,
  "priority": "integer (optional, 1-5)",
  "due_date": "string (optional, ISO 8601 datetime)"
}

Success Response (200 OK):
{
  "id": "uuid",
  "title": "string",
  "description": "string | null",
  "completed": boolean,
  "priority": "integer | null",
  "due_date": "string | null",
  "created_at": "string (ISO 8601)",
  "updated_at": "string (ISO 8601)"
}

Error Responses:
- 404 Not Found: Todo does not exist
- 400 Bad Request: Invalid JSON or UUID
- 422 Unprocessable Entity: Validation errors
- 500 Internal Server Error: Server error
```

#### **Update Todo (Partial)**
```
PATCH /api/v1/todos/{id}
Content-Type: application/json

Path Parameters:
- id: uuid (required) - Todo identifier

Request Body (all fields optional):
{
  "title": "string (optional, 1-200 chars)",
  "description": "string (optional, max 2000 chars)",
  "completed": boolean (optional),
  "priority": "integer (optional, 1-5)",
  "due_date": "string (optional, ISO 8601 datetime)"
}

Success Response (200 OK):
{
  "id": "uuid",
  "title": "string",
  "description": "string | null",
  "completed": boolean,
  "priority": "integer | null",
  "due_date": "string | null",
  "created_at": "string (ISO 8601)",
  "updated_at": "string (ISO 8601)"
}

Error Responses:
- 404 Not Found: Todo does not exist
- 400 Bad Request: Invalid JSON or UUID
- 422 Unprocessable Entity: Validation errors
- 500 Internal Server Error: Server error
```

#### **Delete Todo**
```
DELETE /api/v1/todos/{id}

Path Parameters:
- id: uuid (required) - Todo identifier

Success Response (204 No Content):
(empty body)

Error Responses:
- 404 Not Found: Todo does not exist
- 400 Bad Request: Invalid UUID format
- 500 Internal Server Error: Server error
```

### 5. Define Request/Response Models

Define Pydantic models for all request and response bodies:

**TodoCreate (Request Model):**
```python
from pydantic import BaseModel, Field, validator
from datetime import datetime
from typing import Optional

class TodoCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200, description="Todo title")
    description: Optional[str] = Field(None, max_length=2000, description="Todo description")
    priority: Optional[int] = Field(None, ge=1, le=5, description="Priority level (1-5)")
    due_date: Optional[datetime] = Field(None, description="Due date (ISO 8601)")

    @validator('title')
    def title_not_empty(cls, v):
        if not v.strip():
            raise ValueError('Title cannot be empty or whitespace')
        return v.strip()

    class Config:
        json_schema_extra = {
            "example": {
                "title": "Buy groceries",
                "description": "Milk, eggs, bread",
                "priority": 3,
                "due_date": "2026-01-10T18:00:00Z"
            }
        }
```

**TodoUpdate (Request Model - Full Update):**
```python
class TodoUpdate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=2000)
    completed: bool
    priority: Optional[int] = Field(None, ge=1, le=5)
    due_date: Optional[datetime] = None

    @validator('title')
    def title_not_empty(cls, v):
        if not v.strip():
            raise ValueError('Title cannot be empty or whitespace')
        return v.strip()
```

**TodoPatch (Request Model - Partial Update):**
```python
class TodoPatch(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=2000)
    completed: Optional[bool] = None
    priority: Optional[int] = Field(None, ge=1, le=5)
    due_date: Optional[datetime] = None

    @validator('title')
    def title_not_empty(cls, v):
        if v is not None and not v.strip():
            raise ValueError('Title cannot be empty or whitespace')
        return v.strip() if v else v
```

**TodoRead (Response Model):**
```python
from uuid import UUID

class TodoRead(BaseModel):
    id: UUID
    title: str
    description: Optional[str]
    completed: bool
    priority: Optional[int]
    due_date: Optional[datetime]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True  # For SQLModel compatibility
        json_schema_extra = {
            "example": {
                "id": "550e8400-e29b-41d4-a716-446655440000",
                "title": "Buy groceries",
                "description": "Milk, eggs, bread",
                "completed": false,
                "priority": 3,
                "due_date": "2026-01-10T18:00:00Z",
                "created_at": "2026-01-06T10:00:00Z",
                "updated_at": "2026-01-06T10:00:00Z"
            }
        }
```

**TodoList (Response Model - List Endpoint):**
```python
class TodoList(BaseModel):
    items: list[TodoRead]
    total: int = Field(..., description="Total number of items matching filters")
    limit: int = Field(..., description="Page size")
    offset: int = Field(..., description="Pagination offset")

    class Config:
        json_schema_extra = {
            "example": {
                "items": [...],
                "total": 42,
                "limit": 50,
                "offset": 0
            }
        }
```

### 6. Define Error Response Models

Standardize error responses across all endpoints:

**ErrorResponse (Generic Error):**
```python
class ErrorResponse(BaseModel):
    error: str = Field(..., description="Error type")
    message: str = Field(..., description="Human-readable error message")
    details: Optional[dict] = Field(None, description="Additional error details")

    class Config:
        json_schema_extra = {
            "example": {
                "error": "not_found",
                "message": "Todo with id 550e8400-e29b-41d4-a716-446655440000 not found",
                "details": None
            }
        }
```

**ValidationErrorResponse (422 Errors):**
```python
class ValidationError(BaseModel):
    field: str = Field(..., description="Field name that failed validation")
    message: str = Field(..., description="Validation error message")

class ValidationErrorResponse(BaseModel):
    error: str = "validation_error"
    message: str = "Request validation failed"
    errors: list[ValidationError] = Field(..., description="List of validation errors")

    class Config:
        json_schema_extra = {
            "example": {
                "error": "validation_error",
                "message": "Request validation failed",
                "errors": [
                    {
                        "field": "title",
                        "message": "Title must be between 1 and 200 characters"
                    },
                    {
                        "field": "priority",
                        "message": "Priority must be between 1 and 5"
                    }
                ]
            }
        }
```

### 7. Define HTTP Status Codes

Document standard status codes for all scenarios:

**Success Codes:**
- `200 OK`: Successful GET, PUT, PATCH requests
- `201 Created`: Successful POST request (resource created)
- `204 No Content`: Successful DELETE request

**Client Error Codes:**
- `400 Bad Request`: Malformed JSON, invalid UUID format, invalid query parameters
- `404 Not Found`: Resource does not exist
- `422 Unprocessable Entity`: Validation errors (valid JSON but invalid data)

**Server Error Codes:**
- `500 Internal Server Error`: Unexpected server error (database connection, etc.)

### 8. Define Validation Rules

Document all validation rules explicitly:

**Title Field:**
- Required for POST, PUT
- Optional for PATCH
- Min length: 1 character (after trimming whitespace)
- Max length: 200 characters
- Cannot be empty or only whitespace
- Trimmed automatically

**Description Field:**
- Optional for all operations
- Max length: 2000 characters
- Can be null

**Completed Field:**
- Required for PUT
- Optional for POST (defaults to false), PATCH
- Must be boolean (true/false)

**Priority Field:**
- Optional for all operations
- Must be integer between 1 and 5 (inclusive)
- Can be null

**Due Date Field:**
- Optional for all operations
- Must be valid ISO 8601 datetime string
- Must be parseable to datetime object
- Can be null

**ID Field (Path Parameter):**
- Required for GET, PUT, PATCH, DELETE
- Must be valid UUID format
- Return 400 if invalid format
- Return 404 if valid format but doesn't exist

### 9. Define Query Parameters and Filtering

Document filtering, sorting, and pagination:

**Filtering:**
- `completed`: Filter by completion status (true/false)
- `priority`: Filter by priority level (1-5)
- Multiple filters combine with AND logic

**Sorting:**
- `sort`: Field to sort by (created_at, updated_at, due_date, priority, title)
- `order`: Sort direction (asc, desc)
- Default: `sort=created_at&order=desc` (newest first)

**Pagination:**
- `limit`: Number of items per page (default: 50, max: 100)
- `offset`: Number of items to skip (default: 0)
- Response includes `total` count for client-side pagination UI

**Examples:**
- Get completed todos: `GET /api/v1/todos?completed=true`
- Get high priority todos: `GET /api/v1/todos?priority=5`
- Get todos sorted by due date: `GET /api/v1/todos?sort=due_date&order=asc`
- Paginate: `GET /api/v1/todos?limit=20&offset=40` (page 3)

### 10. Reject Undocumented Endpoints

Validate that all endpoints are fully documented:

**Required Documentation for Each Endpoint:**
- ✅ HTTP method and URL path
- ✅ Path parameters (if any) with types and descriptions
- ✅ Query parameters (if any) with types, defaults, and descriptions
- ✅ Request body schema (if applicable) with Pydantic model
- ✅ Success response schema with Pydantic model
- ✅ All possible error responses with status codes
- ✅ Example request and response
- ✅ Validation rules for all fields
- ✅ Business logic constraints

**REJECT if:**
- ❌ Endpoint has no description
- ❌ Request/response models not defined
- ❌ Validation rules not specified
- ❌ Error responses not documented
- ❌ No examples provided
- ❌ Query parameters not documented
- ❌ Status codes not specified

### 11. Reject Frontend Coupling

Validate that API is decoupled from frontend:

**Prohibited Patterns (REJECT if found):**
- ❌ HTML rendering or templates
- ❌ Session-based state (use stateless tokens if auth needed)
- ❌ Frontend framework-specific endpoints (e.g., `/api/react-todos`)
- ❌ Returning frontend-specific data structures
- ❌ Server-side rendering of UI components
- ❌ Endpoints that assume specific frontend routing
- ❌ Non-JSON responses (except for file downloads)
- ❌ JSONP or other legacy frontend patterns
- ❌ Endpoints that return JavaScript code
- ❌ Tight coupling to specific frontend state management

**Required Patterns:**
- ✅ Pure JSON request/response
- ✅ Stateless communication
- ✅ Framework-agnostic design
- ✅ Clear API versioning
- ✅ CORS configuration (but not frontend-specific)
- ✅ Standard HTTP methods and status codes
- ✅ Resource-based URLs
- ✅ Self-contained responses (no frontend assumptions)

### 12. Define OpenAPI/Swagger Specification

Document how to generate OpenAPI specification:

**FastAPI Auto-Generation:**
```python
from fastapi import FastAPI

app = FastAPI(
    title="Todo API",
    description="RESTful API for Todo application",
    version="1.0.0",
    docs_url="/api/v1/docs",
    redoc_url="/api/v1/redoc",
    openapi_url="/api/v1/openapi.json"
)

# Endpoints automatically generate OpenAPI spec
# Access at: http://localhost:8000/api/v1/docs
```

**OpenAPI Features:**
- Interactive documentation (Swagger UI)
- Request/response examples
- Try-it-out functionality
- Schema validation
- Auto-generated client SDKs

### 13. Define CORS Configuration

Document CORS setup for frontend communication:

**CORS Settings:**
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js dev server
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
    allow_headers=["Content-Type", "Authorization"],
)
```

**Production CORS:**
- Restrict origins to deployed frontend domains
- No wildcard (*) in production
- Document allowed origins in deployment guide

### 14. Output API Specification Document

Create comprehensive API specification:

**File**: `specs/api/todo-api-spec.md`

**Contents:**
```markdown
# Todo REST API Specification

## Overview
RESTful API for Todo application built with FastAPI. Communicates exclusively via JSON.

## Base URL
- Development: `http://localhost:8000/api/v1`
- Production: `https://api.example.com/api/v1`

## Authentication
(None for Phase II MVP - add in Phase III if needed)

## API Design Principles
[Document REST conventions, JSON-only, versioning, decoupling]

## Endpoints

### Create Todo
[Complete endpoint documentation with examples]

### List Todos
[Complete endpoint documentation with examples]

### Get Single Todo
[Complete endpoint documentation with examples]

### Update Todo (Full)
[Complete endpoint documentation with examples]

### Update Todo (Partial)
[Complete endpoint documentation with examples]

### Delete Todo
[Complete endpoint documentation with examples]

## Request/Response Models
[Complete Pydantic model definitions]

## Error Responses
[Standard error format and all error codes]

## Validation Rules
[All validation rules documented]

## Query Parameters
[Filtering, sorting, pagination documentation]

## OpenAPI Documentation
[How to access Swagger UI]

## CORS Configuration
[CORS setup for frontend]

## Testing
[How to test API endpoints]

## Rate Limiting
(None for Phase II MVP - add in Phase III if needed)
```

### 15. Validation Checklist

Before finalizing, verify:

- ✅ All CRUD operations defined (Create, Read, List, Update, Delete)
- ✅ All endpoints use JSON-only communication
- ✅ All request bodies have Pydantic models
- ✅ All response bodies have Pydantic models
- ✅ All validation rules explicitly documented
- ✅ All error responses standardized
- ✅ All HTTP status codes documented
- ✅ Query parameters for filtering, sorting, pagination
- ✅ No frontend coupling (framework-agnostic)
- ✅ No HTML rendering or templates
- ✅ No session-based state
- ✅ OpenAPI/Swagger documentation plan
- ✅ CORS configuration documented
- ✅ Examples provided for all endpoints
- ✅ Matches data model (if exists)
- ✅ Follows Phase II constitution

### 16. Failure Handling (CRITICAL)

**REJECT and ABORT if:**
- Constitution is Phase I (APIs not in scope)
- No data model or feature requirements exist
- Endpoints are undocumented (missing models, validation, errors)
- Frontend coupling detected (HTML, sessions, framework-specific)
- Non-JSON communication used
- REST conventions violated (verbs in URLs, wrong HTTP methods)
- Validation rules missing or incomplete
- Error responses not standardized
- Status codes not specified
- No examples provided
- Query parameters not documented

**On rejection:**
- Output clear error message explaining violation
- List specific endpoints or patterns that failed validation
- Suggest corrections needed
- Do NOT proceed with partial API specification
- Do NOT create output files for rejected design

### 17. Output Summary to User

Provide:
- ✅ API specification created: Todo REST API v1.0.0
- 📋 Endpoints defined: [list all endpoints]
- 🔒 Validation: All fields validated with Pydantic
- ❌ Error handling: Standardized error responses
- 📊 Filtering: completed, priority filters
- 🔄 Sorting: created_at, updated_at, due_date, priority
- 📄 Pagination: limit/offset based
- 🌐 JSON-only: No HTML or other formats
- 🔓 Decoupled: Framework-agnostic design
- 📚 Documentation: OpenAPI/Swagger auto-generated
- 📁 Output file: `specs/api/todo-api-spec.md`
- ⚠️ Manual follow-up needed: [list any items]
- 💬 Suggested commit message:
  ```
  docs: add Todo REST API specification

  - Define CRUD endpoints for Todo resources
  - Add Pydantic models for request/response validation
  - Standardize error responses with proper status codes
  - Document filtering, sorting, and pagination
  - Ensure JSON-only communication
  - Decouple API from frontend frameworks
  - Generate OpenAPI/Swagger documentation
  ```

### 18. Handoff Recommendations

Suggest next steps:
- "Run `/sp.design-persistent-todo-data` to ensure data model supports these endpoints"
- "Run `/sp.plan` to design the FastAPI implementation architecture"
- "Use `api-spec-agent` for detailed API contract review"
- "Use `phase-ii-governance-agent` to validate compliance before implementation"

---

## Formatting & Style Requirements

- Use Markdown code blocks for endpoint definitions
- Use Python code blocks for Pydantic models
- Use tables for field documentation where appropriate
- Use emoji sparingly for visual markers (✅ ❌ 📋 🔒 📊 🔄 📄 🌐 🔓 📚 📁 ⚠️ 💬)
- Keep lines under 100 characters where practical
- Single blank line between sections
- No trailing whitespace

---

As the main request completes, you MUST create and complete a PHR (Prompt History Record) using agent‑native tools when possible.

1) Determine Stage
   - Stage: spec (this is API specification)

2) Generate Title and Determine Routing:
   - Generate Title: "specify-rest-todo-api" (or similar 3-7 word slug)
   - Route: `history/prompts/<feature-name>/` (feature-specific)

3) Create and Fill PHR (Shell first; fallback agent‑native)
   - Run: `.specify/scripts/bash/create-phr.sh --title "specify-rest-todo-api" --stage spec --feature "todo-api" --json`
   - Open the file and fill remaining placeholders (YAML + body), embedding full PROMPT_TEXT (verbatim) and concise RESPONSE_TEXT.
   - If the script fails:
     - Read `.specify/templates/phr-template.prompt.md` (or `templates/…`)
     - Allocate an ID; compute the output path: `history/prompts/todo-api/<ID>-specify-rest-todo-api.spec.prompt.md`
     - Fill placeholders and embed full PROMPT_TEXT and concise RESPONSE_TEXT

4) Validate + report
   - No unresolved placeholders; path under `history/prompts/<feature-name>/`; stage/title/date coherent; print ID + path + stage + title.
   - On failure: warn, don't block. Skip only for `/sp.phr`.
