---
description: Design SQLModel-based persistent Todo entities with PostgreSQL compatibility and ID-based referencing.
handoffs:
  - label: Create API Specification
    agent: sp.specify
    prompt: Create the API specification for the Todo CRUD endpoints based on the data model.
  - label: Plan Database Architecture
    agent: sp.plan
    prompt: Design the database architecture and migration strategy for the Todo data model.
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Outline

You are designing the persistent data model for the Todo application using SQLModel (SQLAlchemy + Pydantic). This model will be stored in Neon PostgreSQL and must support all CRUD operations with ID-based referencing (no positional indexes from Phase I).

Follow this execution flow:

### 1. Pre-Flight Validation

Before proceeding, verify Phase II context:
- Read `.specify/memory/constitution.md` and confirm it's Phase II (v2.x.x)
- **REJECT** if constitution is Phase I (v1.x.x) - in-memory patterns not allowed
- Verify PostgreSQL/Neon is the approved database
- Check for existing feature specs in `specs/` directory

### 2. Load Requirements and Specifications

Gather requirements from multiple sources:

**From Constitution:**
- Read `.specify/memory/constitution.md`
- Extract database standards (SQLModel, migrations, constraints)
- Extract security requirements (validation, injection prevention)
- Note any data modeling principles

**From Feature Specs (if exist):**
- Scan `specs/*/spec.md` for Todo-related features
- Extract data requirements (fields, relationships, constraints)
- Identify CRUD operations needed
- Note any special requirements (filtering, sorting, pagination)

**From User Input:**
- Parse any additional requirements from $ARGUMENTS
- Identify any specific fields or relationships requested

**Validation:**
- **REJECT** if no requirements found (need spec or user input)
- **REJECT** if requirements mention "in-memory" or "positional index"
- **REJECT** if requirements conflict with Phase II constitution

### 3. Design Core Todo Entity

Design the primary `Todo` SQLModel table:

**Required Fields:**
- `id`: Primary key (UUID or Integer with auto-increment)
  - Use UUID for distributed systems
  - Use Integer for simpler deployments
  - **NEVER** use positional index (1, 2, 3 based on list position)
- `title`: String, required, max length (e.g., 200 chars)
- `description`: Text, optional, can be long
- `completed`: Boolean, default False
- `created_at`: DateTime, auto-set on creation (UTC)
- `updated_at`: DateTime, auto-update on modification (UTC)

**Optional Fields (based on requirements):**
- `priority`: Enum (LOW, MEDIUM, HIGH) or Integer (1-5)
- `due_date`: DateTime, optional
- `tags`: Relationship to Tag table (many-to-many)
- `category_id`: Foreign key to Category table
- `user_id`: Foreign key to User table (if multi-user)
- `order`: Integer for custom ordering (NOT positional index)

**Constraints:**
- Primary key constraint on `id`
- NOT NULL on required fields
- Check constraints (e.g., priority in valid range)
- Unique constraints where appropriate
- Foreign key constraints with proper CASCADE/RESTRICT

**Indexes:**
- Primary key index (automatic)
- Index on `user_id` (if multi-user)
- Index on `completed` (for filtering)
- Index on `created_at` (for sorting)
- Composite indexes for common queries

### 4. Design Supporting Entities (if needed)

Based on requirements, design additional tables:

**Category Table (if categorization needed):**
```python
class Category(SQLModel, table=True):
    id: UUID | int (primary key)
    name: str (unique, required)
    description: str | None
    created_at: datetime

    # Relationship
    todos: list["Todo"] = Relationship(back_populates="category")
```

**Tag Table (if tagging needed):**
```python
class Tag(SQLModel, table=True):
    id: UUID | int (primary key)
    name: str (unique, required)

    # Many-to-many relationship
    todos: list["Todo"] = Relationship(back_populates="tags", link_model=TodoTag)

class TodoTag(SQLModel, table=True):
    todo_id: UUID | int (foreign key)
    tag_id: UUID | int (foreign key)
    # Composite primary key
```

**User Table (if multi-user needed):**
```python
class User(SQLModel, table=True):
    id: UUID | int (primary key)
    username: str (unique, required)
    email: str (unique, required)
    created_at: datetime

    # Relationship
    todos: list["Todo"] = Relationship(back_populates="user")
```

### 5. Define SQLModel Classes

Write complete SQLModel class definitions:

**Base Model Pattern:**
```python
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from uuid import UUID, uuid4
from typing import Optional

class TodoBase(SQLModel):
    """Base model with shared fields for validation"""
    title: str = Field(max_length=200, min_length=1)
    description: Optional[str] = Field(default=None)
    completed: bool = Field(default=False)
    priority: Optional[int] = Field(default=None, ge=1, le=5)
    due_date: Optional[datetime] = Field(default=None)

class Todo(TodoBase, table=True):
    """Database table model"""
    __tablename__ = "todos"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Foreign keys (if needed)
    user_id: Optional[UUID] = Field(default=None, foreign_key="users.id")
    category_id: Optional[UUID] = Field(default=None, foreign_key="categories.id")

    # Relationships (if needed)
    user: Optional["User"] = Relationship(back_populates="todos")
    category: Optional["Category"] = Relationship(back_populates="todos")
    tags: list["Tag"] = Relationship(back_populates="todos", link_model=TodoTag)

class TodoCreate(TodoBase):
    """Model for creating new todos (no id, timestamps)"""
    pass

class TodoUpdate(SQLModel):
    """Model for updating todos (all fields optional)"""
    title: Optional[str] = Field(default=None, max_length=200, min_length=1)
    description: Optional[str] = Field(default=None)
    completed: Optional[bool] = Field(default=None)
    priority: Optional[int] = Field(default=None, ge=1, le=5)
    due_date: Optional[datetime] = Field(default=None)

class TodoRead(TodoBase):
    """Model for reading todos (includes id, timestamps)"""
    id: UUID
    created_at: datetime
    updated_at: datetime
    # Include related data if needed
    user: Optional["UserRead"] = None
    category: Optional["CategoryRead"] = None
    tags: list["TagRead"] = []
```

### 6. Define CRUD Operation Support

Document how the model supports each CRUD operation:

**Create:**
- Use `TodoCreate` model for input validation
- Generate UUID automatically
- Set `created_at` and `updated_at` automatically
- Validate all constraints before insert
- Return `TodoRead` model with generated id

**Read:**
- Query by `id` (UUID) - primary lookup
- Query by `user_id` - user's todos
- Filter by `completed` - active/completed todos
- Filter by `category_id` - todos in category
- Filter by `tags` - todos with specific tags
- Sort by `created_at`, `updated_at`, `due_date`, `priority`
- Paginate results (offset/limit or cursor-based)
- Return `TodoRead` model(s)

**Update:**
- Use `TodoUpdate` model for partial updates
- Lookup by `id` (UUID)
- Update only provided fields
- Auto-update `updated_at` timestamp
- Validate constraints on updated values
- Return updated `TodoRead` model

**Delete:**
- Lookup by `id` (UUID)
- Handle foreign key constraints (CASCADE or RESTRICT)
- Soft delete option: add `deleted_at` field instead of hard delete
- Return success/failure status

### 7. PostgreSQL Compatibility Validation

Ensure all design choices are PostgreSQL compatible:

**Data Types:**
- ✅ UUID: Native PostgreSQL type
- ✅ VARCHAR(n): For bounded strings
- ✅ TEXT: For unbounded strings
- ✅ BOOLEAN: Native type
- ✅ INTEGER: Native type
- ✅ TIMESTAMP: Use with timezone (TIMESTAMPTZ)
- ✅ ENUM: PostgreSQL supports custom enums

**Features:**
- ✅ Foreign keys with CASCADE/RESTRICT
- ✅ Check constraints
- ✅ Unique constraints
- ✅ Composite indexes
- ✅ Partial indexes (e.g., WHERE deleted_at IS NULL)
- ✅ JSON/JSONB for flexible data (if needed)

**Neon-Specific:**
- ✅ Serverless connection pooling supported
- ✅ Auto-scaling supported
- ✅ Branching for dev/staging (schema versioning)

### 8. Reject In-Memory Assumptions

Scan the design for Phase I patterns and **REJECT** if found:

**Prohibited Patterns:**
- ❌ Positional indexes (todo at position 0, 1, 2)
- ❌ List-based storage (todos = [])
- ❌ In-memory dictionaries (todos = {})
- ❌ Session-based storage (data lost on restart)
- ❌ No persistence layer
- ❌ Manual ID assignment based on list length

**Required Patterns:**
- ✅ Database-generated IDs (UUID or auto-increment)
- ✅ Persistent storage (survives restart)
- ✅ Transactional operations
- ✅ Concurrent access support
- ✅ Foreign key relationships
- ✅ Query-based retrieval (not index-based)

### 9. Validate Against Specifications

Prevent schema drift by validating against specs:

**Spec Validation:**
- Read all relevant specs in `specs/*/spec.md`
- Extract data requirements from specs
- Compare designed model against spec requirements
- **REJECT** if model missing required fields from spec
- **REJECT** if model adds fields not in spec (without justification)
- **REJECT** if constraints differ from spec

**Constitution Validation:**
- Verify model follows database standards from constitution
- Verify security requirements met (validation, constraints)
- Verify naming conventions followed
- **REJECT** if constitution principles violated

**Documentation Validation:**
- Ensure all fields documented with purpose
- Ensure all relationships documented
- Ensure all constraints documented with rationale
- Ensure migration strategy documented

### 10. Generate Migration Strategy

Document how to implement this schema:

**Alembic Migration:**
```python
# migrations/versions/001_create_todos_table.py
def upgrade():
    op.create_table(
        'todos',
        sa.Column('id', sa.UUID(), primary_key=True),
        sa.Column('title', sa.String(200), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('completed', sa.Boolean(), default=False),
        sa.Column('created_at', sa.TIMESTAMP(timezone=True), nullable=False),
        sa.Column('updated_at', sa.TIMESTAMP(timezone=True), nullable=False),
        # Add indexes
        sa.Index('ix_todos_completed', 'completed'),
        sa.Index('ix_todos_created_at', 'created_at'),
    )

def downgrade():
    op.drop_table('todos')
```

**Migration Checklist:**
- [ ] Create migration file with Alembic
- [ ] Test migration on local PostgreSQL
- [ ] Test migration on Neon branch
- [ ] Verify indexes created
- [ ] Verify constraints enforced
- [ ] Test rollback (downgrade)
- [ ] Document migration in ADR if significant

### 11. Output Data Model Specification

Create a comprehensive data model document:

**File**: `specs/data-model/todo-data-model.md`

**Contents:**
```markdown
# Todo Data Model Specification

## Overview
SQLModel-based persistent data model for Todo application using Neon PostgreSQL.

## Entity Relationship Diagram
[Describe relationships between tables]

## Tables

### Todo Table
**Purpose**: Store individual todo items with metadata

**Fields**:
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| title | VARCHAR(200) | NOT NULL | Todo title |
| description | TEXT | NULL | Optional description |
| completed | BOOLEAN | DEFAULT FALSE | Completion status |
| created_at | TIMESTAMPTZ | NOT NULL | Creation timestamp |
| updated_at | TIMESTAMPTZ | NOT NULL | Last update timestamp |

**Indexes**:
- PRIMARY KEY on id
- INDEX on completed
- INDEX on created_at

**Relationships**:
[Document foreign keys and relationships]

## SQLModel Classes
[Include complete class definitions]

## CRUD Operations
[Document how each operation works]

## Migration Strategy
[Document Alembic migration approach]

## Validation Rules
[Document all constraints and validation]

## Security Considerations
[Document SQL injection prevention, input validation]
```

### 12. Failure Handling (CRITICAL)

**REJECT and ABORT if:**
- Constitution is Phase I (in-memory patterns)
- Design includes positional indexes or list-based storage
- Design includes in-memory assumptions (session storage, etc.)
- Schema drifts from approved specifications
- Required fields missing from specs
- PostgreSQL incompatible types or features used
- No migration strategy provided
- Constraints not properly defined
- Foreign keys without CASCADE/RESTRICT specification

**On rejection:**
- Output clear error message explaining violation
- List specific patterns or requirements that failed validation
- Suggest corrections needed
- Do NOT proceed with partial data model
- Do NOT create output files for rejected design

### 13. Validation Checklist

Before finalizing, verify:

- ✅ All tables have primary keys (UUID or auto-increment)
- ✅ All foreign keys have CASCADE/RESTRICT defined
- ✅ All required fields have NOT NULL constraint
- ✅ All string fields have max length defined
- ✅ All timestamps use UTC timezone
- ✅ All enums have valid values defined
- ✅ All indexes support common queries
- ✅ All relationships properly defined (back_populates)
- ✅ All CRUD operations supported
- ✅ No positional indexes or in-memory patterns
- ✅ PostgreSQL compatible types only
- ✅ Migration strategy documented
- ✅ Validation rules documented
- ✅ Matches specifications (no drift)

### 14. Output Summary to User

Provide:
- ✅ Data model designed: [list tables]
- 📊 Entity relationships: [summarize relationships]
- 🔑 Primary keys: UUID-based (or Integer)
- 🔗 Foreign keys: [list relationships]
- 📋 CRUD operations: All supported
- ✅ PostgreSQL compatible: Verified
- ✅ No in-memory patterns: Verified
- ✅ Spec alignment: Verified
- 📁 Output file: `specs/data-model/todo-data-model.md`
- 🔄 Migration strategy: Alembic-based
- ⚠️ Manual follow-up needed: [list any items]
- 💬 Suggested commit message:
  ```
  docs: add Todo persistent data model specification

  - Design SQLModel-based Todo entity with UUID primary key
  - Add support for all CRUD operations
  - Define PostgreSQL-compatible schema
  - Document migration strategy with Alembic
  - Validate against Phase II constitution
  - Ensure no Phase I in-memory patterns
  ```

### 15. Handoff Recommendations

Suggest next steps:
- "Run `/sp.specify` to create API specification for CRUD endpoints"
- "Run `/sp.plan` to design database architecture and migration plan"
- "Use `data-modeling-agent` for detailed schema review"
- "Use `api-spec-agent` to design REST API matching this data model"

---

## Formatting & Style Requirements

- Use Markdown tables for field definitions
- Include complete SQLModel class code in fenced blocks
- Use emoji sparingly for visual markers (✅ ❌ 📊 🔑 🔗 📋 🔄 ⚠️ 💬)
- Keep lines under 100 characters where practical
- Single blank line between sections
- No trailing whitespace

---

## Example Output Structure

```markdown
# Todo Data Model Specification

## Overview
This document defines the persistent data model for the Todo application using SQLModel and Neon PostgreSQL.

## Design Principles
- ID-based referencing (no positional indexes)
- UUID primary keys for distributed compatibility
- Timestamp tracking (created_at, updated_at)
- Proper foreign key constraints
- PostgreSQL native types

## Entity Relationship Diagram
```
Todo (1) ----< (N) TodoTag (N) >---- (1) Tag
Todo (N) ----< (1) Category
Todo (N) ----< (1) User
```

## Tables

### Todo Table
[Complete table definition with fields, constraints, indexes]

### Supporting Tables
[Category, Tag, TodoTag, User if needed]

## SQLModel Classes
[Complete Python code for all models]

## CRUD Operations
[Detailed documentation of each operation]

## Migration Strategy
[Alembic migration code and process]

## Validation Rules
[All constraints and validation logic]

## Security Considerations
[SQL injection prevention, input validation]
```

---

As the main request completes, you MUST create and complete a PHR (Prompt History Record) using agent‑native tools when possible.

1) Determine Stage
   - Stage: spec (this is data model specification)

2) Generate Title and Determine Routing:
   - Generate Title: "design-persistent-todo-data" (or similar 3-7 word slug)
   - Route: `history/prompts/<feature-name>/` (feature-specific)

3) Create and Fill PHR (Shell first; fallback agent‑native)
   - Run: `.specify/scripts/bash/create-phr.sh --title "design-persistent-todo-data" --stage spec --feature "todo-data-model" --json`
   - Open the file and fill remaining placeholders (YAML + body), embedding full PROMPT_TEXT (verbatim) and concise RESPONSE_TEXT.
   - If the script fails:
     - Read `.specify/templates/phr-template.prompt.md` (or `templates/…`)
     - Allocate an ID; compute the output path: `history/prompts/todo-data-model/<ID>-design-persistent-todo-data.spec.prompt.md`
     - Fill placeholders and embed full PROMPT_TEXT and concise RESPONSE_TEXT

4) Validate + report
   - No unresolved placeholders; path under `history/prompts/<feature-name>/`; stage/title/date coherent; print ID + path + stage + title.
   - On failure: warn, don't block. Skip only for `/sp.phr`.
