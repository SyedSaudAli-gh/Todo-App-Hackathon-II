# Feature Specification: Dynamic Profile Statistics

**Feature Branch**: `004-dynamic-profile-stats`
**Created**: 2026-01-12
**Status**: Draft
**Input**: User description: "Upgrade the Profile Dashboard to show real, dynamic user activity statistics instead of static values"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Personal Activity Statistics (Priority: P1)

An authenticated user visits their profile page and sees their real-time activity statistics including total tasks created, tasks completed, completion rate percentage, and days since joining the platform.

**Why this priority**: This is the core value proposition of the feature - replacing static placeholder data with real user metrics. Without this, users cannot track their productivity or engagement with the application.

**Independent Test**: Can be fully tested by authenticating as a user, creating several todos (some completed, some not), navigating to the profile page, and verifying that displayed statistics match the actual data in the database.

**Acceptance Scenarios**:

1. **Given** a user has created 10 todos with 7 completed, **When** they view their profile page, **Then** they see "Total Tasks: 10", "Completed Tasks: 7", and "Completion Rate: 70%"
2. **Given** a user created their account 15 days ago, **When** they view their profile page, **Then** they see "Active Days: 15"
3. **Given** a user has no todos, **When** they view their profile page, **Then** they see "Total Tasks: 0", "Completed Tasks: 0", and "Completion Rate: 0%" (no division by zero error)

---

### User Story 2 - Real-Time Statistics Updates (Priority: P2)

When a user completes a todo or creates a new todo, their profile statistics update to reflect the change when they next visit or refresh the profile page.

**Why this priority**: Ensures data accuracy and builds user trust in the metrics. Users expect their actions to be reflected in their statistics.

**Independent Test**: Can be tested by viewing profile statistics, creating/completing todos, then refreshing the profile page to verify updated numbers.

**Acceptance Scenarios**:

1. **Given** a user has 5 total tasks and 3 completed, **When** they complete 1 more task and refresh their profile, **Then** they see "Completed Tasks: 4" and "Completion Rate: 80%"
2. **Given** a user has 10 total tasks, **When** they create 2 new tasks and refresh their profile, **Then** they see "Total Tasks: 12"

---

### User Story 3 - Isolated User Data (Priority: P1)

Each user sees only their own statistics, completely isolated from other users' data. Multiple users can use the application simultaneously without seeing each other's metrics.

**Why this priority**: Critical for data privacy and security. Users must never see other users' statistics or have their statistics affected by other users' actions.

**Independent Test**: Can be tested by creating two user accounts, having each create different numbers of todos, and verifying that each user's profile shows only their own statistics.

**Acceptance Scenarios**:

1. **Given** User A has 10 tasks and User B has 5 tasks, **When** User A views their profile, **Then** they see "Total Tasks: 10" (not 15)
2. **Given** User A completes a task, **When** User B views their profile, **Then** User B's statistics remain unchanged

---

### Edge Cases

- What happens when a user has zero todos? (Display 0% completion rate, avoid division by zero)
- What happens when the user is not authenticated? (Redirect to login or show 401 error)
- What happens when the API request fails? (Show error message, keep previous data if available)
- What happens when the user's account was created today? (Show "Active Days: 1" - inclusive counting)
- What happens when a user deletes all their todos? (Statistics update to show 0 total tasks)
- What happens when network is slow or unavailable? (Show loading state, then error message with retry option)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display the total number of todos created by the authenticated user
- **FR-002**: System MUST display the number of completed todos for the authenticated user
- **FR-003**: System MUST calculate and display completion rate as a percentage (completed / total × 100)
- **FR-004**: System MUST calculate active days as the number of days from user's account creation date to current date (inclusive)
- **FR-005**: System MUST filter all todo queries strictly by the authenticated user's ID
- **FR-006**: System MUST require authentication for accessing user statistics
- **FR-007**: System MUST return 401 Unauthorized for unauthenticated requests to statistics endpoint
- **FR-008**: System MUST handle empty todo lists without errors (display 0% completion rate)
- **FR-009**: System MUST use UTC timezone for all date calculations
- **FR-010**: System MUST fetch statistics from the backend API, not calculate them on the frontend
- **FR-011**: System MUST display error messages when statistics cannot be loaded
- **FR-012**: System MUST preserve existing ProfileStats component UI layout and design
- **FR-013**: System MUST use cookie-based session authentication for API requests

### Key Entities

- **User Statistics**: Aggregated metrics for a single user including total_tasks (count of all todos), completed_tasks (count of completed todos), completion_rate (percentage), and active_days (days since account creation)
- **User**: Existing entity with created_at timestamp used to calculate active days
- **Todo**: Existing entity with user_id for filtering and completed status for counting

### Phase II API Endpoints

**Base URL**: `/api/v1/users`

#### Endpoint 1: Get Current User Statistics
- **Method**: GET
- **Path**: `/api/v1/users/me/stats`
- **Purpose**: Retrieve aggregated activity statistics for the authenticated user
- **Authentication**: Required (cookie-based session)
- **Request**: No body or query parameters required
- **Response**: JSON object containing total_tasks, completed_tasks, completion_rate, active_days
- **Status Codes**:
  - 200: Success - returns statistics
  - 401: Unauthorized - user not authenticated
  - 500: Server error - database or calculation failure

**Response Example**:
```json
{
  "total_tasks": 10,
  "completed_tasks": 7,
  "completion_rate": 70.0,
  "active_days": 15
}
```

**Note**: Detailed API contracts (request/response models, validation rules) will be defined during implementation planning.

### Phase II Database Schema

This feature uses existing database tables and does not require schema changes:

#### Existing Table: users
- **Purpose**: Stores user account information
- **Key Fields Used**: id, created_at
- **Usage**: created_at field is used to calculate active_days

#### Existing Table: todos
- **Purpose**: Stores user todo items
- **Key Fields Used**: id, user_id, completed
- **Usage**: Filtered by user_id to count total and completed tasks

**Note**: No database migrations required for this feature.

### Phase II Frontend Components

#### Page 1: Profile Page
- **Route**: `/dashboard/profile` (assumed based on existing structure)
- **Purpose**: Display user profile information including activity statistics
- **Components**: ProfileStats (existing component that will receive real data)
- **State**: userStats (statistics object), loading (boolean), error (string or null)
- **API Calls**: GET /api/v1/users/me/stats

#### Component 1: ProfileStats (Existing - Modified Usage)
- **Purpose**: Display user activity statistics in card format
- **Props**: totalTasks, completedTasks, completionRate, activeDays (all numbers)
- **State**: None (stateless presentation component)
- **Interactions**: None (display only)
- **Changes**: Will receive real data from API instead of hardcoded values

**Note**: No UI redesign or layout changes - only data source changes from static to dynamic.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can view their accurate activity statistics within 2 seconds of loading the profile page
- **SC-002**: Statistics update correctly within 5 seconds when a user creates or completes a todo and refreshes their profile
- **SC-003**: 100% of users see only their own statistics, with zero data leakage between users
- **SC-004**: System handles 100 concurrent users viewing their profile statistics without performance degradation
- **SC-005**: Zero division errors occur when users have no todos (displays 0% completion rate)
- **SC-006**: API endpoint returns statistics in under 500ms for users with up to 1000 todos
- **SC-007**: Profile page displays appropriate error messages for 100% of failed API requests
- **SC-008**: Active days calculation is accurate to within 1 day for all users across all timezones

## Assumptions

- The ProfileStats component already exists and accepts props for statistics values
- The Better Auth session cookie is automatically included in API requests from the frontend
- The user's created_at timestamp is stored in UTC in the database
- The todos table has a user_id foreign key and a completed boolean field
- The profile page route already exists and is accessible to authenticated users
- Network failures and API errors will be handled with user-friendly error messages
- Statistics do not need to update in real-time (page refresh is acceptable)

## Out of Scope

- Historical statistics tracking (e.g., statistics over time, trends, graphs)
- Comparative statistics (e.g., comparing with other users, leaderboards)
- Advanced metrics (e.g., average completion time, productivity scores)
- Caching or optimization of statistics calculations
- Real-time updates without page refresh (WebSocket/polling)
- Export or download of statistics data
- Customization of which statistics to display
- Statistics for specific time periods (e.g., this week, this month)

## Dependencies

- Existing Better Auth authentication system must be functional
- Existing todos table must have user_id and completed fields
- Existing users table must have created_at field
- Frontend must have access to the ProfileStats component
- Backend must have access to the database ORM for querying todos and users

## Constraints

- Must not modify the visual design or layout of the ProfileStats component
- Must use cookie-based session authentication (no JWT or other auth methods)
- Must calculate all statistics on the backend (no frontend calculations)
- Must use UTC for all date/time operations
- Must follow existing project structure and coding patterns
- Must not introduce any hardcoded or mock data
- Must handle all error cases gracefully without crashes
