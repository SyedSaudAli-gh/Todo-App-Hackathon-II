---
description: Specify end-to-end Todo user flows in a web UI with API-driven state changes and comprehensive error handling.
handoffs:
  - label: Design API Specification
    agent: sp.specify-rest-todo-api
    prompt: Create the REST API specification that supports these user flows.
  - label: Plan Frontend Implementation
    agent: sp.plan
    prompt: Design the Next.js implementation plan for these user flows.
  - label: Design UI Components
    agent: sp.specify
    prompt: Create detailed UI component specifications for these user flows.
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Outline

You are specifying end-to-end user flows for the Todo web application. These flows describe how users interact with the web UI to create, view, update, delete, and complete todos. All state changes must be API-driven (no direct database access), and all flows must handle loading, error, and success states comprehensively.

Follow this execution flow:

### 1. Pre-Flight Validation

Before proceeding, verify Phase II web context:
- Read `.specify/memory/constitution.md` and confirm it's Phase II (v2.x.x)
- **REJECT** if constitution is Phase I (v1.x.x) - web UI not in Phase I scope
- Verify Next.js is the approved frontend framework
- Check for existing API specs in `specs/api/`
- Check for existing feature specs in `specs/*/spec.md`
- **REJECT** if API specification doesn't exist (user flows depend on API)

### 2. Load Requirements and Context

Gather requirements from multiple sources:

**From Constitution:**
- Read `.specify/memory/constitution.md`
- Extract frontend standards (Next.js, React, TypeScript, Tailwind)
- Extract UI/UX requirements (responsive, accessible, error handling)
- Note any user flow principles

**From API Specification (if exists):**
- Read `specs/api/todo-api-spec.md` or similar
- Extract available endpoints and their contracts
- Extract request/response models
- Extract error responses
- Map API endpoints to user actions

**From Feature Specs (if exist):**
- Scan `specs/*/spec.md` for Todo-related features
- Extract user stories and acceptance criteria
- Extract UI requirements
- Identify user personas and use cases

**From User Input:**
- Parse any additional requirements from $ARGUMENTS
- Identify any specific flows or interactions requested

**Validation:**
- **REJECT** if no API specification exists (flows depend on API)
- **REJECT** if requirements mention CLI interactions
- **REJECT** if requirements mention direct database access from UI
- **REJECT** if requirements conflict with Phase II constitution

### 3. Define User Flow Principles

Establish principles for web user flows:

**API-Driven State Changes:**
- All data operations go through REST API
- No direct database access from frontend
- No server-side database queries in frontend code
- Clear separation: UI → API → Database

**State Management:**
- Loading states for all async operations
- Error states with user-friendly messages
- Success states with visual feedback
- Empty states with helpful guidance
- Optimistic updates where appropriate (with rollback on error)

**User Feedback:**
- Immediate visual feedback for all actions
- Loading indicators during API calls
- Success messages/toasts for completed actions
- Error messages with actionable guidance
- Validation feedback before API submission

**Responsive Design:**
- Mobile-first approach
- Touch-friendly interactions
- Responsive layouts (mobile, tablet, desktop)
- Accessible keyboard navigation

**Error Handling:**
- Network errors (offline, timeout)
- Validation errors (client-side and server-side)
- Not found errors (404)
- Server errors (500)
- Graceful degradation

### 4. Define Core User Flows

Specify all CRUD user flows in detail:

#### **Flow 1: View Todo List**

**User Goal:** See all their todos

**Entry Points:**
- User navigates to home page (`/`)
- User navigates to todos page (`/todos`)
- User refreshes the page

**Flow Steps:**

1. **Initial State (Loading)**
   - Page loads with skeleton UI or loading spinner
   - "Loading todos..." message displayed
   - No interaction possible during load

2. **API Call**
   - Frontend calls: `GET /api/v1/todos`
   - Query params: `?sort=created_at&order=desc&limit=50&offset=0`
   - Request includes any active filters (completed, priority)

3. **Success State**
   - Todos displayed in list/grid format
   - Each todo shows: title, description (truncated), completed status, priority, due date
   - Visual indicators: checkmark for completed, priority badge, overdue warning
   - Action buttons: Edit, Delete, Toggle Complete
   - If no todos: Empty state with "Create your first todo" CTA

4. **Error State**
   - Network error: "Unable to load todos. Check your connection." + Retry button
   - Server error: "Something went wrong. Please try again." + Retry button
   - Error persists: Show cached data (if available) with warning banner

5. **Interactions Available:**
   - Click todo → Navigate to detail view
   - Click "New Todo" button → Navigate to create form
   - Click checkbox → Toggle complete (Flow 5)
   - Click edit icon → Navigate to edit form (Flow 3)
   - Click delete icon → Show delete confirmation (Flow 4)
   - Filter by completed/active
   - Sort by date, priority, title
   - Paginate (load more or page numbers)

**Exit Points:**
- Navigate to create todo flow
- Navigate to edit todo flow
- Navigate to todo detail view
- Trigger delete todo flow
- Trigger complete todo flow

---

#### **Flow 2: Create New Todo**

**User Goal:** Add a new todo item

**Entry Points:**
- Click "New Todo" button from list view
- Click "+" floating action button
- Navigate to `/todos/new`

**Flow Steps:**

1. **Initial State (Form Display)**
   - Empty form displayed with fields:
     - Title (text input, required, max 200 chars)
     - Description (textarea, optional, max 2000 chars)
     - Priority (dropdown: None, 1-5, optional)
     - Due Date (date picker, optional)
   - "Create Todo" button enabled
   - "Cancel" button to return to list

2. **Client-Side Validation (Real-Time)**
   - Title: Show character count (0/200)
   - Title: Show error if empty or whitespace only
   - Description: Show character count (0/2000)
   - Priority: Validate 1-5 range
   - Due Date: Validate future date (optional)
   - Disable submit if validation fails

3. **User Submits Form**
   - Click "Create Todo" button
   - Form disabled during submission
   - Button shows loading spinner: "Creating..."
   - Prevent double-submission

4. **API Call**
   - Frontend calls: `POST /api/v1/todos`
   - Request body: `{ title, description, priority, due_date }`
   - Content-Type: application/json

5. **Success State (201 Created)**
   - Success toast: "Todo created successfully!"
   - Navigate back to list view
   - New todo appears at top of list (or appropriate position)
   - Highlight new todo briefly (fade-in animation)

6. **Error State (400/422)**
   - Validation errors displayed inline:
     - Field-specific errors under each input
     - "Title is required" under title field
     - "Priority must be between 1 and 5" under priority field
   - Form remains editable
   - User can correct and resubmit
   - No navigation away from form

7. **Error State (500)**
   - Error toast: "Failed to create todo. Please try again."
   - Form remains editable with user's data
   - Retry button available
   - Option to save draft locally (optional)

**Exit Points:**
- Success → Navigate to list view
- Cancel → Navigate to list view
- Error → Remain on form for correction

---

#### **Flow 3: Edit Existing Todo**

**User Goal:** Update a todo's information

**Entry Points:**
- Click "Edit" button from list view
- Click "Edit" button from detail view
- Navigate to `/todos/{id}/edit`

**Flow Steps:**

1. **Initial State (Loading)**
   - Show loading spinner while fetching todo
   - "Loading todo..." message

2. **Fetch Todo Data**
   - Frontend calls: `GET /api/v1/todos/{id}`
   - Load existing todo data into form

3. **Form Display (Pre-Filled)**
   - Form populated with existing values:
     - Title (current value)
     - Description (current value)
     - Completed (checkbox, current value)
     - Priority (current value)
     - Due Date (current value)
   - "Save Changes" button enabled
   - "Cancel" button to return without saving

4. **Client-Side Validation (Real-Time)**
   - Same validation as create flow
   - Show which fields have changed (dirty state)
   - Warn if navigating away with unsaved changes

5. **User Submits Form**
   - Click "Save Changes" button
   - Form disabled during submission
   - Button shows loading spinner: "Saving..."

6. **API Call (Partial Update)**
   - Frontend calls: `PATCH /api/v1/todos/{id}`
   - Request body: Only changed fields
   - Content-Type: application/json

7. **Success State (200 OK)**
   - Success toast: "Todo updated successfully!"
   - Navigate back to previous view (list or detail)
   - Updated todo reflects changes immediately

8. **Error State (404 Not Found)**
   - Error message: "This todo no longer exists."
   - Option to create new todo with current form data
   - Navigate back to list

9. **Error State (400/422)**
   - Validation errors displayed inline
   - Form remains editable
   - User can correct and resubmit

10. **Error State (500)**
    - Error toast: "Failed to update todo. Please try again."
    - Form remains editable with user's changes
    - Retry button available

**Exit Points:**
- Success → Navigate to list or detail view
- Cancel → Navigate to previous view
- Not Found → Navigate to list view
- Error → Remain on form for correction

---

#### **Flow 4: Delete Todo**

**User Goal:** Remove a todo permanently

**Entry Points:**
- Click "Delete" button from list view
- Click "Delete" button from detail view
- Keyboard shortcut (optional)

**Flow Steps:**

1. **Confirmation Dialog**
   - Modal/dialog appears: "Delete this todo?"
   - Show todo title for context
   - Warning: "This action cannot be undone."
   - Buttons: "Cancel" (default focus), "Delete" (destructive style)

2. **User Confirms Deletion**
   - Click "Delete" button
   - Dialog disabled during deletion
   - Button shows loading spinner: "Deleting..."

3. **Optimistic Update (Optional)**
   - Immediately remove todo from UI (fade-out animation)
   - Show undo toast: "Todo deleted. Undo?"
   - If undo clicked within 5 seconds, cancel deletion

4. **API Call**
   - Frontend calls: `DELETE /api/v1/todos/{id}`
   - No request body

5. **Success State (204 No Content)**
   - Todo removed from list
   - Success toast: "Todo deleted successfully!"
   - If on detail view, navigate to list
   - Update todo count

6. **Error State (404 Not Found)**
   - Info message: "This todo was already deleted."
   - Remove from UI anyway
   - Navigate to list if on detail view

7. **Error State (500)**
   - Error toast: "Failed to delete todo. Please try again."
   - Restore todo in UI (if optimistic update was used)
   - Retry button available

**Exit Points:**
- Success → Remain on list view or navigate from detail
- Cancel → Close dialog, no changes
- Error → Close dialog, todo remains

---

#### **Flow 5: Toggle Todo Completion**

**User Goal:** Mark todo as complete or incomplete

**Entry Points:**
- Click checkbox in list view
- Click "Mark Complete" button in detail view
- Keyboard shortcut (space bar when focused)

**Flow Steps:**

1. **Optimistic Update**
   - Immediately toggle checkbox state
   - Apply visual changes:
     - Completed: Strikethrough text, muted color, checkmark icon
     - Incomplete: Normal text, full color, empty checkbox
   - Show loading indicator (small spinner near checkbox)

2. **API Call**
   - Frontend calls: `PATCH /api/v1/todos/{id}`
   - Request body: `{ "completed": true/false }`
   - Content-Type: application/json

3. **Success State (200 OK)**
   - Remove loading indicator
   - Keep optimistic update
   - Optional success toast: "Todo marked as complete/incomplete"
   - Update completed count

4. **Error State (404 Not Found)**
   - Revert optimistic update
   - Error toast: "This todo no longer exists."
   - Remove from UI

5. **Error State (500)**
   - Revert optimistic update
   - Error toast: "Failed to update todo. Please try again."
   - Retry button in toast

**Exit Points:**
- Success → Remain on current view
- Error → Remain on current view with reverted state

---

#### **Flow 6: View Todo Detail**

**User Goal:** See full details of a todo

**Entry Points:**
- Click todo item from list view
- Navigate to `/todos/{id}`
- Deep link from notification/email

**Flow Steps:**

1. **Initial State (Loading)**
   - Show loading spinner
   - "Loading todo details..." message

2. **API Call**
   - Frontend calls: `GET /api/v1/todos/{id}`

3. **Success State (200 OK)**
   - Display full todo details:
     - Title (large, prominent)
     - Description (full text, formatted)
     - Completed status (badge)
     - Priority (badge with color)
     - Due date (formatted, with overdue warning)
     - Created date
     - Last updated date
   - Action buttons: Edit, Delete, Toggle Complete
   - Back button to return to list

4. **Error State (404 Not Found)**
   - Error message: "Todo not found."
   - Explanation: "This todo may have been deleted."
   - Button: "Back to Todos"

5. **Error State (500)**
   - Error message: "Unable to load todo details."
   - Retry button
   - Button: "Back to Todos"

**Exit Points:**
- Click Edit → Navigate to edit flow
- Click Delete → Trigger delete flow
- Click Back → Navigate to list view
- Not Found → Navigate to list view

---

#### **Flow 7: Filter and Sort Todos**

**User Goal:** Find specific todos by filtering and sorting

**Entry Points:**
- Click filter button in list view
- Click sort dropdown in list view

**Flow Steps:**

1. **Filter Panel Display**
   - Show filter options:
     - Status: All, Active, Completed
     - Priority: All, 1, 2, 3, 4, 5
   - Show sort options:
     - Created Date (newest/oldest)
     - Updated Date (newest/oldest)
     - Due Date (soonest/latest)
     - Priority (highest/lowest)
     - Title (A-Z/Z-A)

2. **User Selects Filters**
   - Click filter option
   - Update URL query params (for bookmarking)
   - Show active filters as badges

3. **API Call**
   - Frontend calls: `GET /api/v1/todos?completed={bool}&priority={int}&sort={field}&order={asc|desc}`
   - Show loading state in list

4. **Success State**
   - Display filtered/sorted results
   - Show count: "Showing X of Y todos"
   - Show active filters with remove option
   - Empty state if no results: "No todos match your filters"

5. **Clear Filters**
   - Click "Clear All" button
   - Reset to default view (all todos, newest first)

**Exit Points:**
- Remain on list view with filtered results

---

#### **Flow 8: Handle Offline/Network Errors**

**User Goal:** Continue using app when network is unavailable

**Flow Steps:**

1. **Detect Offline State**
   - Browser offline event detected
   - Show banner: "You're offline. Some features may be limited."

2. **Cached Data Display**
   - Show last loaded todos from cache
   - Disable create/edit/delete actions
   - Show "Offline" badge on each todo

3. **Queue Actions (Optional)**
   - Allow user to create/edit todos
   - Queue actions locally
   - Show "Pending sync" indicator

4. **Reconnect**
   - Browser online event detected
   - Show banner: "Back online. Syncing..."
   - Sync queued actions
   - Refresh data from API

5. **Sync Conflicts**
   - If todo was modified elsewhere, show conflict resolution
   - Options: Keep local, Keep server, Merge

**Exit Points:**
- Online → Resume normal operation

---

### 5. Define UI States

Document all possible UI states for each flow:

**Loading States:**
- Initial page load (skeleton UI)
- Fetching todo list (spinner in list area)
- Fetching single todo (spinner in detail area)
- Submitting form (disabled form, button spinner)
- Deleting todo (disabled dialog, button spinner)
- Toggling completion (small spinner near checkbox)

**Empty States:**
- No todos: "You don't have any todos yet. Create your first one!"
- No filtered results: "No todos match your filters. Try adjusting them."
- No completed todos: "You haven't completed any todos yet."

**Error States:**
- Network error: "Unable to connect. Check your internet connection."
- Server error: "Something went wrong on our end. Please try again."
- Not found: "This todo doesn't exist anymore."
- Validation error: Field-specific messages under inputs
- Unauthorized (if auth added): "Please log in to continue."

**Success States:**
- Todo created: Success toast with checkmark
- Todo updated: Success toast with checkmark
- Todo deleted: Success toast with undo option
- Todo completed: Visual feedback (strikethrough, checkmark)

### 6. Define Error Handling Patterns

Standardize error handling across all flows:

**Client-Side Validation:**
- Validate before API call
- Show errors inline (under fields)
- Prevent submission if invalid
- Clear errors when user corrects

**API Error Handling:**
- 400 Bad Request: Show generic error, log details
- 404 Not Found: Show "not found" message, navigate away
- 422 Validation: Show field-specific errors
- 500 Server Error: Show retry option, log error
- Network Error: Show offline message, retry option

**Error Recovery:**
- Retry button for transient errors
- Undo option for destructive actions
- Save draft for failed submissions
- Graceful degradation (show cached data)

**Error Logging:**
- Log all errors to console (development)
- Send errors to monitoring service (production)
- Include context: user action, API endpoint, error details

### 7. Reject CLI Assumptions

Validate that flows are web-specific:

**Prohibited Patterns (REJECT if found):**
- ❌ Command-line interactions (e.g., "type 'add' to create todo")
- ❌ Terminal-based navigation
- ❌ Keyboard-only interfaces (must support mouse/touch)
- ❌ Text-based menus
- ❌ STDIN/STDOUT references
- ❌ Console output for user feedback
- ❌ File system operations from UI
- ❌ Process management references

**Required Patterns:**
- ✅ Graphical user interface (buttons, forms, lists)
- ✅ Mouse/touch interactions
- ✅ Visual feedback (colors, icons, animations)
- ✅ Browser-based navigation (URLs, links)
- ✅ HTML forms and inputs
- ✅ Modal dialogs and toasts
- ✅ Responsive layouts

### 8. Reject Direct Database Access

Validate that all data operations go through API:

**Prohibited Patterns (REJECT if found):**
- ❌ Direct database queries from frontend code
- ❌ SQL statements in React components
- ❌ Database connection strings in frontend
- ❌ ORM usage in frontend (SQLModel, Prisma, etc.)
- ❌ Server-side database code in frontend files
- ❌ Database migrations triggered from UI
- ❌ Direct file system access for persistence
- ❌ LocalStorage as primary data store (cache only)

**Required Patterns:**
- ✅ All data operations via REST API calls
- ✅ Fetch/Axios for HTTP requests
- ✅ API endpoints for all CRUD operations
- ✅ JSON request/response bodies
- ✅ HTTP status codes for error handling
- ✅ API error responses parsed and displayed
- ✅ LocalStorage only for caching/offline support
- ✅ Clear separation: UI → API → Database

### 9. Define API Integration Points

Map user flows to API endpoints:

**Flow → API Mapping:**

| User Flow | API Endpoint | Method | Purpose |
|-----------|--------------|--------|---------|
| View List | `/api/v1/todos` | GET | Fetch all todos |
| View Detail | `/api/v1/todos/{id}` | GET | Fetch single todo |
| Create Todo | `/api/v1/todos` | POST | Create new todo |
| Edit Todo | `/api/v1/todos/{id}` | PATCH | Update todo |
| Delete Todo | `/api/v1/todos/{id}` | DELETE | Remove todo |
| Toggle Complete | `/api/v1/todos/{id}` | PATCH | Update completed status |
| Filter/Sort | `/api/v1/todos?params` | GET | Fetch filtered todos |

**Request/Response Handling:**
- All requests: `Content-Type: application/json`
- All responses: Parse JSON body
- Success: Extract data, update UI
- Error: Parse error response, show user-friendly message
- Loading: Show loading state during request
- Timeout: Show timeout error after 30 seconds

### 10. Define Component Structure

Outline high-level component architecture:

**Page Components:**
- `TodoListPage`: Main list view with filters
- `TodoDetailPage`: Single todo detail view
- `TodoCreatePage`: Create new todo form
- `TodoEditPage`: Edit existing todo form

**Feature Components:**
- `TodoList`: List of todo items
- `TodoItem`: Single todo in list
- `TodoForm`: Reusable form for create/edit
- `TodoFilters`: Filter and sort controls
- `TodoStats`: Summary statistics

**UI Components:**
- `Button`: Reusable button with loading state
- `Input`: Text input with validation
- `Textarea`: Multi-line text input
- `Select`: Dropdown select
- `DatePicker`: Date selection
- `Checkbox`: Checkbox with label
- `Modal`: Confirmation dialogs
- `Toast`: Success/error notifications
- `LoadingSpinner`: Loading indicator
- `EmptyState`: Empty state messages

**State Management:**
- React hooks (useState, useEffect)
- Context API for global state (optional)
- SWR or React Query for API caching (optional)

### 11. Output User Flow Specification

Create comprehensive user flow document:

**File**: `specs/user-flows/todo-web-flows.md`

**Contents:**
```markdown
# Todo Web Application User Flows

## Overview
End-to-end user flows for the Todo web application built with Next.js.

## Design Principles
[API-driven, state management, user feedback, responsive, error handling]

## Core User Flows

### Flow 1: View Todo List
[Complete flow documentation with steps, states, API calls]

### Flow 2: Create New Todo
[Complete flow documentation]

### Flow 3: Edit Existing Todo
[Complete flow documentation]

### Flow 4: Delete Todo
[Complete flow documentation]

### Flow 5: Toggle Todo Completion
[Complete flow documentation]

### Flow 6: View Todo Detail
[Complete flow documentation]

### Flow 7: Filter and Sort Todos
[Complete flow documentation]

### Flow 8: Handle Offline/Network Errors
[Complete flow documentation]

## UI States
[Loading, empty, error, success states]

## Error Handling
[Client-side validation, API errors, recovery patterns]

## API Integration
[Flow to endpoint mapping, request/response handling]

## Component Architecture
[Page, feature, and UI components]

## Accessibility
[Keyboard navigation, screen readers, ARIA labels]

## Performance
[Loading optimization, caching, pagination]
```

### 12. Validation Checklist

Before finalizing, verify:

- ✅ All CRUD flows defined (create, read, update, delete, complete)
- ✅ All flows use API calls (no direct DB access)
- ✅ Loading states defined for all async operations
- ✅ Error states defined for all failure scenarios
- ✅ Success states with user feedback
- ✅ Empty states with helpful guidance
- ✅ No CLI assumptions (web-specific interactions)
- ✅ No direct database access from UI
- ✅ API integration points mapped
- ✅ Component structure outlined
- ✅ Error handling patterns standardized
- ✅ Offline/network error handling
- ✅ Optimistic updates where appropriate
- ✅ Responsive design considerations
- ✅ Accessibility considerations
- ✅ Follows Phase II constitution

### 13. Failure Handling (CRITICAL)

**REJECT and ABORT if:**
- Constitution is Phase I (web UI not in scope)
- No API specification exists (flows depend on API)
- Flows include CLI interactions (terminal commands, text menus)
- Flows include direct database access from UI
- Flows missing loading/error/success states
- API integration not defined
- Error handling not specified
- No user feedback mechanisms
- Frontend coupled to backend implementation details

**On rejection:**
- Output clear error message explaining violation
- List specific flows or patterns that failed validation
- Suggest corrections needed
- Do NOT proceed with partial user flow specification
- Do NOT create output files for rejected design

### 14. Output Summary to User

Provide:
- ✅ User flows specified: Todo Web Application
- 📋 Flows defined: [list all 8 flows]
- 🔄 API-driven: All state changes via REST API
- ⏳ Loading states: Defined for all async operations
- ❌ Error handling: Comprehensive error states and recovery
- ✅ Success feedback: Toasts and visual indicators
- 📱 Responsive: Mobile-first design
- ♿ Accessible: Keyboard navigation and ARIA
- 🌐 Offline support: Cached data and sync queue
- 📁 Output file: `specs/user-flows/todo-web-flows.md`
- ⚠️ Manual follow-up needed: [list any items]
- 💬 Suggested commit message:
  ```
  docs: add Todo web application user flows

  - Define 8 core user flows (CRUD + filter + offline)
  - Specify API-driven state changes for all operations
  - Document loading, error, and success states
  - Add comprehensive error handling patterns
  - Ensure no CLI assumptions or direct DB access
  - Map flows to API endpoints
  - Outline component architecture
  ```

### 15. Handoff Recommendations

Suggest next steps:
- "Run `/sp.specify-rest-todo-api` to ensure API supports these flows"
- "Run `/sp.plan` to design Next.js implementation for these flows"
- "Use `web-ui-spec-agent` for detailed UI component specifications"
- "Use `phase-ii-governance-agent` to validate compliance before implementation"

---

## Formatting & Style Requirements

- Use numbered lists for flow steps
- Use tables for flow-to-API mappings
- Use emoji sparingly for visual markers (✅ ❌ 📋 🔄 ⏳ 📱 ♿ 🌐 📁 ⚠️ 💬)
- Keep lines under 100 characters where practical
- Single blank line between sections
- No trailing whitespace
- Use Markdown formatting for emphasis

---

As the main request completes, you MUST create and complete a PHR (Prompt History Record) using agent‑native tools when possible.

1) Determine Stage
   - Stage: spec (this is user flow specification)

2) Generate Title and Determine Routing:
   - Generate Title: "define-web-user-flows" (or similar 3-7 word slug)
   - Route: `history/prompts/<feature-name>/` (feature-specific)

3) Create and Fill PHR (Shell first; fallback agent‑native)
   - Run: `.specify/scripts/bash/create-phr.sh --title "define-web-user-flows" --stage spec --feature "todo-web-ui" --json`
   - Open the file and fill remaining placeholders (YAML + body), embedding full PROMPT_TEXT (verbatim) and concise RESPONSE_TEXT.
   - If the script fails:
     - Read `.specify/templates/phr-template.prompt.md` (or `templates/…`)
     - Allocate an ID; compute the output path: `history/prompts/todo-web-ui/<ID>-define-web-user-flows.spec.prompt.md`
     - Fill placeholders and embed full PROMPT_TEXT and concise RESPONSE_TEXT

4) Validate + report
   - No unresolved placeholders; path under `history/prompts/<feature-name>/`; stage/title/date coherent; print ID + path + stage + title.
   - On failure: warn, don't block. Skip only for `/sp.phr`.
