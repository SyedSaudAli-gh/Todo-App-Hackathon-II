# Data Model: Authenticated Dashboard Upgrade

**Feature**: 002-authenticated-dashboard
**Date**: 2026-01-07
**Status**: Complete

## Overview

This feature does not introduce new database entities. All data models are either client-side (theme preferences) or managed by Better Auth (user sessions). The existing Todo database schema remains unchanged.

## Database Entities (Unchanged)

### Todo Table (Existing)

**Table**: `todos`
**Location**: Neon PostgreSQL database
**Status**: Unchanged - no modifications

**Schema**:
```sql
CREATE TABLE todos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Note**: No `user_id` field - todos remain shared across all users due to backend constraint (no database schema changes allowed).

**SQLModel Definition** (existing, unchanged):
```python
# api/src/models/todo.py
from sqlmodel import SQLModel, Field
from datetime import datetime

class Todo(SQLModel, table=True):
    __tablename__ = "todos"

    id: int | None = Field(default=None, primary_key=True)
    title: str = Field(max_length=255)
    description: str | None = None
    completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
```

## Client-Side Data Models (New)

### 1. User (Better Auth Managed)

**Storage**: Better Auth internal storage (cookies/localStorage)
**Persistence**: Session-based (not in application database)

**TypeScript Interface**:
```typescript
// web/src/types/auth.ts
export interface User {
  id: string
  email: string
  name?: string
  image?: string
  provider?: "email" | "google" | "facebook" | "linkedin"
  createdAt: Date
}
```

**Session Interface**:
```typescript
// web/src/types/auth.ts
export interface Session {
  user: User
  expiresAt: Date
  token: string
}
```

**Notes**:
- User data managed entirely by Better Auth
- No custom user table in Neon PostgreSQL
- Session stored in HTTP-only cookies (secure)
- User info accessible via Better Auth client

### 2. Theme Preference (localStorage)

**Storage**: Browser localStorage
**Key**: `"theme-preference"`
**Persistence**: Client-side only (not in database)

**TypeScript Type**:
```typescript
// web/src/types/theme.ts
export type Theme = "light" | "dark" | "system"

export interface ThemePreference {
  theme: Theme
  resolvedTheme: "light" | "dark" // Computed from system if theme is "system"
}
```

**localStorage Structure**:
```json
{
  "theme-preference": "dark"
}
```

**Notes**:
- Simple string value in localStorage
- No backend persistence (frontend-only feature)
- Falls back to "system" if not set
- System preference detected via `window.matchMedia("(prefers-color-scheme: dark)")`

### 3. Todo (Frontend Type - Existing)

**TypeScript Interface** (existing, unchanged):
```typescript
// web/src/types/todo.ts
export interface Todo {
  id: number
  title: string
  description?: string
  completed: boolean
  created_at: string // ISO 8601 date string
  updated_at: string // ISO 8601 date string
}

export interface CreateTodoRequest {
  title: string
  description?: string
}

export interface UpdateTodoRequest {
  title?: string
  description?: string
  completed?: boolean
}
```

**Notes**:
- Frontend representation of backend Todo model
- Matches backend Pydantic schema
- No user_id field (todos shared across users)

## Data Flow

### Authentication Flow

```
User Input (email/password or OAuth)
  ↓
Better Auth Client
  ↓
Better Auth Server (internal)
  ↓
Session Created (cookies/localStorage)
  ↓
User Object Available in Frontend
```

**No Database Interaction**: Better Auth manages user data internally, no application database changes.

### Theme Preference Flow

```
User Clicks Theme Toggle
  ↓
ThemeContext.setTheme(newTheme)
  ↓
localStorage.setItem("theme-preference", newTheme)
  ↓
document.documentElement.classList.add(newTheme)
  ↓
CSS Variables Applied
```

**No Database Interaction**: Theme preference stored only in browser localStorage.

### Todo CRUD Flow (Existing, Unchanged)

```
User Action (create/read/update/delete)
  ↓
Frontend API Client (fetch)
  ↓
Backend API (/api/v1/todos)
  ↓
SQLModel ORM
  ↓
Neon PostgreSQL Database
  ↓
Response to Frontend
  ↓
UI Update
```

**No Changes**: Existing todo data flow remains unchanged.

## Data Relationships

### User ↔ Todo Relationship

**Current State**: No relationship (todos shared across all users)

**Reason**: Backend constraint - no database schema changes allowed

**Future Enhancement** (out of scope):
```sql
-- Future: Add user_id to todos table
ALTER TABLE todos ADD COLUMN user_id INTEGER REFERENCES users(id);
```

**Current Workaround**: All authenticated users see all todos (shared workspace model).

### Theme ↔ User Relationship

**Current State**: No relationship (theme preference not tied to user account)

**Reason**: Theme preference is client-side only (localStorage)

**Behavior**:
- Theme preference persists per browser/device
- Not synced across devices
- Lost if localStorage cleared

**Future Enhancement** (out of scope):
- Store theme preference in user profile (requires backend changes)
- Sync across devices

## Data Validation

### User Data Validation (Better Auth)

**Email Validation**:
- Format: RFC 5322 email format
- Uniqueness: Enforced by Better Auth
- Required: Yes

**Password Validation**:
- Minimum length: 8 characters (Better Auth default)
- Complexity: Configurable (not specified in requirements)
- Required: Yes (for email/password auth)

### Theme Preference Validation

**Type Validation**:
```typescript
const isValidTheme = (value: string): value is Theme => {
  return ["light", "dark", "system"].includes(value)
}
```

**Fallback**: If invalid value in localStorage, default to "system"

### Todo Data Validation (Existing, Unchanged)

**Frontend Validation**:
- Title: Required, max 255 characters
- Description: Optional, max 1000 characters
- Completed: Boolean

**Backend Validation** (Pydantic):
- Title: Required, max 255 characters
- Description: Optional
- Completed: Boolean, default false

## Data Migrations

### Database Migrations

**Required**: None

**Reason**: No database schema changes for this feature

**Existing Migrations**: Remain unchanged

### Data Migrations

**Required**: None

**Reason**: No existing data needs transformation

## Data Security

### User Data Security (Better Auth)

- **Passwords**: Hashed with bcrypt (Better Auth default)
- **Sessions**: HTTP-only cookies (XSS protection)
- **OAuth Tokens**: Stored securely by Better Auth
- **HTTPS**: Required in production

### Theme Preference Security

- **Storage**: localStorage (client-side only)
- **Sensitivity**: Low (no sensitive data)
- **XSS Risk**: Minimal (simple string value)

### Todo Data Security (Existing)

- **API**: Existing CORS configuration
- **Validation**: Pydantic on backend
- **SQL Injection**: Prevented by SQLModel ORM

## Summary

### New Data Models

1. **User** (Better Auth managed): Client-side session, no database table
2. **Theme Preference** (localStorage): Client-side only, no database persistence

### Unchanged Data Models

1. **Todo** (Neon PostgreSQL): Existing schema unchanged, no user_id field

### Key Constraints

- No database schema changes allowed
- No backend API modifications allowed
- Todos remain shared across all users
- Theme preferences not synced across devices

### Data Flow Summary

- **Authentication**: Better Auth → Cookies/localStorage → Frontend
- **Theme**: localStorage → React Context → CSS Variables
- **Todos**: Frontend → API → Database (existing flow unchanged)
