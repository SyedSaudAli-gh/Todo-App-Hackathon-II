# Feature Specification: Fix API Endpoint Path Mismatch

**Feature Branch**: `001-fix-api-404`
**Created**: 2026-01-19
**Status**: Draft
**Type**: Bug Fix
**Input**: User description: "Debug and fix frontend API Not Found (404) error - Frontend calling /api/todos but backend serves /api/tasks"

## Problem Statement

Users are unable to create or load todos in the application due to an API endpoint path mismatch. The frontend application is making requests to `/api/todos` while the backend API serves the todo endpoints at `/api/tasks`, resulting in 404 Not Found errors. This prevents all todo-related functionality from working, making the application unusable for its primary purpose.

## User Scenarios & Testing

### User Story 1 - Load Existing Todos (Priority: P1)

Users need to view their existing todos when they navigate to the todos page. Currently, the application displays an error instead of showing the todo list.

**Why this priority**: This is the most critical functionality - users cannot see any of their existing data, making the application completely non-functional for its core purpose.

**Independent Test**: Navigate to the todos page and verify that existing todos are displayed without errors. Success means the todo list loads and displays all user's todos.

**Acceptance Scenarios**:

1. **Given** a user has existing todos in the database, **When** they navigate to the todos page, **Then** all their todos are displayed without error messages
2. **Given** a user has no existing todos, **When** they navigate to the todos page, **Then** an empty state is displayed (not an error message)
3. **Given** a user is authenticated with a valid JWT token, **When** the todos page loads, **Then** the API request succeeds with a 200 status code

---

### User Story 2 - Create New Todos (Priority: P1)

Users need to create new todos through the application interface. Currently, attempting to create a todo results in a 404 error and the todo is not saved.

**Why this priority**: Creating todos is a core function of the application. Without this, users cannot add any new tasks, severely limiting the application's usefulness.

**Independent Test**: Submit the todo creation form with valid data and verify the todo is created and appears in the list. Success means the todo is persisted and visible immediately.

**Acceptance Scenarios**:

1. **Given** a user is on the todos page, **When** they submit a new todo with a title and description, **Then** the todo is created successfully and appears in their todo list
2. **Given** a user creates a new todo, **When** the creation request is sent, **Then** the API responds with a 201 status code and returns the created todo
3. **Given** a user creates a todo, **When** they refresh the page, **Then** the newly created todo persists and is still visible

---

### User Story 3 - Update Existing Todos (Priority: P2)

Users need to update their existing todos (mark as complete, edit title/description). Currently, update operations fail with 404 errors.

**Why this priority**: While less critical than viewing and creating, updating todos is essential for task management workflows.

**Independent Test**: Edit an existing todo and verify the changes are saved. Success means the updated todo reflects the changes immediately and after page refresh.

**Acceptance Scenarios**:

1. **Given** a user has an existing todo, **When** they mark it as complete, **Then** the todo's status updates and the API responds with a 200 status code
2. **Given** a user edits a todo's title or description, **When** they save the changes, **Then** the updated todo is persisted and visible immediately

---

### User Story 4 - Delete Todos (Priority: P2)

Users need to delete todos they no longer need. Currently, delete operations fail with 404 errors.

**Why this priority**: Deleting todos is important for maintaining a clean task list but is less critical than core CRUD operations.

**Independent Test**: Delete an existing todo and verify it is removed from the list. Success means the todo is permanently deleted and no longer appears.

**Acceptance Scenarios**:

1. **Given** a user has an existing todo, **When** they delete it, **Then** the todo is removed from the list and the API responds with a 204 status code
2. **Given** a user deletes a todo, **When** they refresh the page, **Then** the deleted todo does not reappear

---

### Edge Cases

- What happens when the API endpoint path is correct but the backend server is not running?
- How does the system handle network timeouts or connection errors?
- What happens if a user attempts an operation while their JWT token has expired?
- How does the system behave if the backend changes the endpoint path in the future?

## Requirements

### Functional Requirements

- **FR-001**: System MUST use consistent API endpoint paths between frontend and backend for all todo operations
- **FR-002**: System MUST successfully load todos when users navigate to the todos page without displaying 404 errors
- **FR-003**: System MUST successfully create new todos when users submit the creation form without displaying 404 errors
- **FR-004**: System MUST successfully update existing todos when users modify them without displaying 404 errors
- **FR-005**: System MUST successfully delete todos when users remove them without displaying 404 errors
- **FR-006**: System MUST maintain JWT authentication for all API requests (Authorization: Bearer token)
- **FR-007**: System MUST display appropriate error messages for actual errors (network failures, server errors) distinct from the current 404 errors
- **FR-008**: System MUST preserve all existing authentication and authorization behavior during the fix

### Key Entities

- **Todo**: Represents a task item with title, description, completion status, and user ownership
- **API Request**: Represents communication between frontend and backend with endpoint path, HTTP method, headers (including JWT), and request/response data

## Success Criteria

### Measurable Outcomes

- **SC-001**: Users can successfully load their todo list without encountering 404 errors (100% success rate for valid requests)
- **SC-002**: Users can create new todos and see them appear in the list immediately (100% success rate for valid todo creation)
- **SC-003**: Users can update existing todos without errors (100% success rate for valid update operations)
- **SC-004**: Users can delete todos without errors (100% success rate for valid delete operations)
- **SC-005**: All API requests use the correct endpoint path that matches the backend implementation
- **SC-006**: JWT authentication continues to work correctly for all API operations (no regression in security)
- **SC-007**: Error messages displayed to users accurately reflect the actual error condition (not generic 404 errors)

## Scope

### In Scope

- Identifying the correct API endpoint path used by the backend
- Ensuring frontend API client uses the correct endpoint path
- Verifying all todo CRUD operations work without 404 errors
- Maintaining existing JWT authentication behavior
- Testing all todo operations end-to-end

### Out of Scope

- Changing the backend API endpoint paths (backend is correct, frontend needs to match)
- Modifying JWT authentication implementation
- Adding new todo features or functionality
- Changing the database schema
- Modifying the UI design or user experience beyond fixing the errors
- Performance optimization (unless directly related to the fix)

## Dependencies

- Backend API must be running and accessible on the configured port
- Backend API endpoints must be at `/api/tasks` (as specified in the problem description)
- JWT authentication must be working correctly (already confirmed working)
- Database must be accessible and contain the todos table

## Assumptions

- The backend API is correctly implemented and serves endpoints at `/api/tasks`
- The frontend has an API client module that centralizes API calls
- JWT tokens are being correctly attached to requests (authentication is working)
- The issue is purely a path mismatch, not a deeper architectural problem
- The backend supports the standard REST operations: GET, POST, PATCH, DELETE
- No other parts of the application are affected by this endpoint path issue

## Risks

- **Risk**: Changing endpoint paths might break other parts of the application that weren't identified
  - **Mitigation**: Comprehensive testing of all todo-related features after the fix

- **Risk**: The fix might inadvertently affect JWT authentication
  - **Mitigation**: Verify JWT tokens are still correctly attached after changes

- **Risk**: There might be multiple places in the codebase calling the wrong endpoint
  - **Mitigation**: Search the entire codebase for references to `/api/todos` and update all occurrences

## Validation Approach

### Testing Strategy

1. **Unit Testing**: Verify API client constructs correct endpoint URLs
2. **Integration Testing**: Test all CRUD operations against the actual backend
3. **End-to-End Testing**: Verify complete user workflows from UI to database
4. **Regression Testing**: Ensure JWT authentication and other features still work correctly

### Acceptance Criteria

- All todo CRUD operations complete successfully without 404 errors
- API requests use the correct endpoint path (`/api/tasks`)
- JWT authentication headers are present and valid in all requests
- Error handling displays appropriate messages for actual errors
- No regression in existing functionality
