# Data Model: Dynamic Profile Statistics

**Feature**: 004-dynamic-profile-stats
**Date**: 2026-01-12
**Status**: Design Complete

## Overview

This document defines the data models for the dynamic profile statistics feature, including database schema changes, response models, and data relationships.

## Database Schema Changes

### Modified Table: todos

**Purpose**: Add user ownership to todos for statistics calculation

**Current Schema**:
```sql
CREATE TABLE todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(200) NOT NULL,
    description VARCHAR(2000),
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

**New Schema** (after migration):
```sql
CREATE TABLE todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id VARCHAR(255),  -- NEW: Better Auth user UUID
    title VARCHAR(200) NOT NULL,
    description VARCHAR(2000),
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_todos_user_id ON todos(user_id);  -- NEW: Performance index
```

**Migration Details**:
- **Column**: `user_id` VARCHAR(255) NULL
- **Index**: `idx_todos_user_id` on `user_id` column
- **Constraint**: None (users in separate Better Auth database)
- **Default**: NULL for existing todos
- **Required**: Yes for new todos (enforced in API layer)

**SQLModel Definition**:
```python
from sqlmodel import Field, SQLModel
from typing import Optional
from datetime import datetime

class Todo(SQLModel, table=True):
    __tablename__ = "todos"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True, description="Better Auth user UUID")
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=2000)
    completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
```

---

## Response Models

### UserStatsResponse

**Purpose**: API response model for user statistics

**Fields**:
| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| total_tasks | int | Total todos created by user | >= 0 |
| completed_tasks | int | Todos marked as completed | >= 0 |
| completion_rate | float | Percentage of completed todos | 0.0 - 100.0 |
| active_days | int | Days since account creation | >= 1 |

**Pydantic Schema**:
```python
from pydantic import BaseModel, Field

class UserStatsResponse(BaseModel):
    total_tasks: int = Field(ge=0, description="Total todos created by user")
    completed_tasks: int = Field(ge=0, description="Todos marked as completed")
    completion_rate: float = Field(ge=0.0, le=100.0, description="Completion percentage")
    active_days: int = Field(ge=1, description="Days since account creation (inclusive)")

    class Config:
        json_schema_extra = {
            "example": {
                "total_tasks": 10,
                "completed_tasks": 7,
                "completion_rate": 70.0,
                "active_days": 15
            }
        }
```

**Calculation Rules**:
- `total_tasks`: COUNT(*) WHERE user_id = {user_id}
- `completed_tasks`: COUNT(*) WHERE user_id = {user_id} AND completed = TRUE
- `completion_rate`: (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0.0
- `active_days`: (current_date - user.created_at).days + 1 (inclusive)

**Edge Cases**:
- Zero todos: Returns `{"total_tasks": 0, "completed_tasks": 0, "completion_rate": 0.0, "active_days": N}`
- Account created today: Returns `{"active_days": 1}` (inclusive counting)
- All todos completed: Returns `{"completion_rate": 100.0}`

---

## Data Relationships

### Todo → User (Implicit)

**Relationship Type**: Many-to-One (implicit, no foreign key)

**Description**: Each todo belongs to one user, identified by user_id

**Rationale**: No foreign key constraint because users are stored in separate Better Auth SQLite database

**Query Pattern**:
```python
# Get user's todos
todos = session.exec(
    select(Todo).where(Todo.user_id == user_id)
).all()

# Count user's todos
total = session.exec(
    select(func.count(Todo.id)).where(Todo.user_id == user_id)
).one()
```

---

## Data Integrity Rules

### User ID Validation
- **Format**: UUID string (e.g., "550e8400-e29b-41d4-a716-446655440000")
- **Source**: Better Auth session (validated)
- **Enforcement**: API layer (not database constraint)
- **Null Handling**: Existing todos may have NULL user_id (legacy data)

### Statistics Calculation
- **Atomicity**: All statistics calculated in single transaction
- **Consistency**: Queries filtered by authenticated user_id only
- **Isolation**: No cross-user data access
- **Durability**: Read-only operations (no data modification)

### Timestamp Handling
- **Timezone**: All timestamps stored in UTC
- **Format**: ISO 8601 (YYYY-MM-DD HH:MM:SS)
- **Precision**: Second-level precision
- **Calculation**: Date differences use UTC dates

---

## Migration Strategy

### Alembic Migration Script

**File**: `alembic/versions/{timestamp}_add_user_id_to_todos.py`

**Upgrade**:
```python
def upgrade() -> None:
    # Add user_id column (nullable)
    op.add_column('todos', sa.Column('user_id', sa.String(255), nullable=True))

    # Create index for performance
    op.create_index('idx_todos_user_id', 'todos', ['user_id'])
```

**Downgrade**:
```python
def downgrade() -> None:
    # Drop index
    op.drop_index('idx_todos_user_id', 'todos')

    # Drop user_id column
    op.drop_column('todos', 'user_id')
```

**Execution**:
```bash
# Generate migration
alembic revision --autogenerate -m "Add user_id to todos"

# Apply migration
alembic upgrade head

# Rollback (if needed)
alembic downgrade -1
```

---

## Query Optimization

### Index Strategy

**Primary Index**: `idx_todos_user_id` on `user_id` column

**Purpose**: Optimize user-specific queries

**Impact**:
- Query time: O(log n) instead of O(n)
- Statistics query: <50ms for 1000 todos
- Disk space: ~5-10% increase (acceptable)

**Query Plan** (with index):
```sql
EXPLAIN SELECT COUNT(*) FROM todos WHERE user_id = '...';
-- Uses index scan (fast)
```

**Query Plan** (without index):
```sql
EXPLAIN SELECT COUNT(*) FROM todos WHERE user_id = '...';
-- Uses sequential scan (slow)
```

### Aggregation Query

**Optimized Query**:
```python
from sqlmodel import select, func, case

stmt = select(
    func.count(Todo.id).label("total_tasks"),
    func.sum(case((Todo.completed == True, 1), else_=0)).label("completed_tasks")
).where(Todo.user_id == user_id)

result = session.exec(stmt).one()
```

**Performance**:
- Single database round-trip
- Conditional counting in database (not Python)
- Result: <200ms for 1000 todos

---

## Data Access Patterns

### Statistics Service

**Pattern**: Service layer encapsulates data access logic

**Implementation**:
```python
class StatsService:
    def __init__(self, session: Session):
        self.session = session

    def get_user_stats(self, user_id: str, user_created_at: datetime) -> UserStatsResponse:
        # Query todos statistics
        stmt = select(
            func.count(Todo.id).label("total"),
            func.sum(case((Todo.completed == True, 1), else_=0)).label("completed")
        ).where(Todo.user_id == user_id)

        result = self.session.exec(stmt).one()

        total_tasks = result.total or 0
        completed_tasks = result.completed or 0
        completion_rate = (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0.0

        # Calculate active days
        now = datetime.now(timezone.utc)
        delta = now - user_created_at.replace(tzinfo=timezone.utc)
        active_days = max(1, delta.days + 1)

        return UserStatsResponse(
            total_tasks=total_tasks,
            completed_tasks=completed_tasks,
            completion_rate=round(completion_rate, 1),
            active_days=active_days
        )
```

---

## Testing Data

### Test Fixtures

**User 1** (Zero Todos):
```python
user_id = "550e8400-e29b-41d4-a716-446655440000"
created_at = datetime(2026, 1, 1, tzinfo=timezone.utc)
todos = []

expected_stats = {
    "total_tasks": 0,
    "completed_tasks": 0,
    "completion_rate": 0.0,
    "active_days": 12  # Assuming today is 2026-01-12
}
```

**User 2** (Partial Completion):
```python
user_id = "660e8400-e29b-41d4-a716-446655440001"
created_at = datetime(2025, 12, 28, tzinfo=timezone.utc)
todos = [
    Todo(user_id=user_id, title="Task 1", completed=True),
    Todo(user_id=user_id, title="Task 2", completed=True),
    Todo(user_id=user_id, title="Task 3", completed=False),
    Todo(user_id=user_id, title="Task 4", completed=False),
]

expected_stats = {
    "total_tasks": 4,
    "completed_tasks": 2,
    "completion_rate": 50.0,
    "active_days": 16  # Assuming today is 2026-01-12
}
```

**User 3** (Full Completion):
```python
user_id = "770e8400-e29b-41d4-a716-446655440002"
created_at = datetime(2026, 1, 12, tzinfo=timezone.utc)
todos = [
    Todo(user_id=user_id, title="Task 1", completed=True),
    Todo(user_id=user_id, title="Task 2", completed=True),
]

expected_stats = {
    "total_tasks": 2,
    "completed_tasks": 2,
    "completion_rate": 100.0,
    "active_days": 1  # Account created today
}
```

---

## Validation Rules

### Input Validation
- `user_id`: Must be valid UUID string from authenticated session
- No user input required (all data from database)

### Output Validation
- `total_tasks`: Non-negative integer
- `completed_tasks`: Non-negative integer, <= total_tasks
- `completion_rate`: Float between 0.0 and 100.0
- `active_days`: Positive integer >= 1

### Business Rules
- Statistics calculated on-demand (no caching)
- All queries filtered by authenticated user_id
- Division by zero returns 0.0 (not error)
- Inclusive day counting (today = day 1)

---

## Security Considerations

### Data Isolation
- All queries include `WHERE user_id = {authenticated_user_id}`
- User ID comes from validated session (cannot be spoofed)
- No cross-user data access possible

### Privacy
- Statistics are user-specific (no aggregated data)
- No personally identifiable information in statistics
- User ID not exposed in API response

### Performance
- Index on user_id prevents full table scans
- Query timeout: 30 seconds (database default)
- Connection pooling prevents resource exhaustion

---

## Summary

**Schema Changes**:
- ✅ Add `user_id` column to `todos` table
- ✅ Create index on `user_id` for performance
- ✅ Migration script for upgrade/downgrade

**Response Models**:
- ✅ `UserStatsResponse` with validation rules
- ✅ Edge case handling (zero todos, division by zero)
- ✅ Example data for documentation

**Data Access**:
- ✅ Service layer pattern for statistics calculation
- ✅ Optimized aggregation query
- ✅ User isolation and security

**Ready for Implementation**: All data models defined and validated.
