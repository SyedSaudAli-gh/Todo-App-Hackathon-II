# Production-Grade Authentication & Data Isolation Architecture

## Executive Summary

This document describes the complete authentication and data isolation architecture for the Todo Application, designed for production deployment on Vercel with strict multi-user data isolation guarantees.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                           USER BROWSER                               │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    NEXT.JS FRONTEND (Vercel)                         │
│                                                                       │
│  ┌──────────────────┐         ┌──────────────────┐                 │
│  │  Better Auth     │         │  /api/token      │                 │
│  │  (Session Mgmt)  │────────▶│  (JWT Generator) │                 │
│  │                  │         │                  │                 │
│  │  - Login/Signup  │         │  - Validates     │                 │
│  │  - Session       │         │    Session       │                 │
│  │    Cookies       │         │  - Signs JWT     │                 │
│  │  - OAuth         │         │    with RS256    │                 │
│  └──────────────────┘         └──────────────────┘                 │
│           │                            │                             │
│           │ Session Cookie             │ JWT Token                  │
│           ▼                            ▼                             │
│  ┌───────────────────────────────────────────────┐                │
│  │         JWT Manager (Memory Cache)              │                │
│  │  - Caches JWT in memory                         │                │
│  │  - Auto-refresh before expiry                   │                │
│  │  - Clears on logout                             │                │
│  └────────────────────────────────────────────────┘                │
│                            │                                         │
└────────────────────────────┼─────────────────────────────────────────┘
                             │ Authorization: Bearer <JWT>
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    FASTAPI BACKEND (Neon DB)                         │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │              JWT Authentication Middleware                    │  │
│  │  1. Extract Bearer token from Authorization header           │  │
│  │  2. Verify JWT signature with JWT_PUBLIC_KEY (RS256)         │  │
│  │  3. Validate expiration and claims                           │  │
│  │  4. Extract user_id from 'sub' claim                         │  │
│  │  5. Inject user_id into request context                      │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                            │                                         │
│                            ▼                                         │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    Todo CRUD Endpoints                        │  │
│  │  - POST   /api/tasks      (create)                           │  │
│  │  - GET    /api/tasks      (list)                             │  │
│  │  - GET    /api/tasks/{id} (read)                             │  │
│  │  - PATCH  /api/tasks/{id} (update)                           │  │
│  │  - DELETE /api/tasks/{id} (delete)                           │  │
│  │                                                               │  │
│  │  ALL queries filtered by: WHERE user_id = <authenticated>    │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                            │                                         │
│                            ▼                                         │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │              PostgreSQL Database (Neon)                       │  │
│  │                                                               │  │
│  │  Table: todos                                                 │  │
│  │  ┌────────────────────────────────────────────────┐          │  │
│  │  │ id (PK)  │ user_id (FK, indexed) │ title │ ... │          │  │
│  │  ├──────────┼───────────────────────┼───────┼─────┤          │  │
│  │  │ 1        │ user_abc123           │ ...   │ ... │          │  │
│  │  │ 2        │ user_xyz789           │ ...   │ ... │          │  │
│  │  │ 3        │ user_abc123           │ ...   │ ... │          │  │
│  │  └──────────┴───────────────────────┴───────┴─────┘          │  │
│  │                                                               │  │
│  │  Index: idx_todos_user_id ON todos(user_id)                  │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

## Security Principles

### 1. Zero Trust Architecture
- **Never trust client input**: User ID always extracted from verified JWT, never from request body
- **Server-side validation**: All authentication and authorization happens server-side
- **Principle of least privilege**: Users can only access their own data

### 2. Defense in Depth
- **Layer 1**: Better Auth session validation (UI access)
- **Layer 2**: JWT signature verification (API access)
- **Layer 3**: Database-level user_id filtering (data isolation)

### 3. Secure by Default
- **No filesystem secrets**: All keys from environment variables
- **Automatic token refresh**: Prevents expired token errors
- **Secure token storage**: JWT in memory only (never localStorage)

## Authentication Flow (Detailed)

### Phase 1: User Login
```
1. User submits credentials to Better Auth
2. Better Auth validates credentials
3. Better Auth creates session in SQLite database
4. Better Auth sets httpOnly session cookie
5. User redirected to dashboard
```

### Phase 2: JWT Token Generation
```
1. Frontend calls GET /api/token with session cookie
2. Next.js API route validates Better Auth session
3. If valid, generates JWT with:
   - sub: user.id (CRITICAL: this is the user identifier)
   - email: user.email
   - name: user.name
   - iat: issued at timestamp
   - exp: expiration (7 days)
4. Signs JWT with JWT_PRIVATE_KEY using RS256
5. Returns JWT + expiry to frontend
6. Frontend caches JWT in memory
```

### Phase 3: API Request with JWT
```
1. Frontend calls backend API with Authorization: Bearer <JWT>
2. FastAPI extracts Bearer token from header
3. FastAPI verifies JWT signature with JWT_PUBLIC_KEY
4. FastAPI validates expiration and claims
5. FastAPI extracts user_id from 'sub' claim
6. FastAPI injects user_id into request context
7. Endpoint handler receives authenticated user_id
8. Database query filters by user_id
9. Response returned to frontend
```

### Phase 4: Token Refresh
```
1. JWT Manager checks token expiry before each request
2. If token expires in <5 minutes, fetch new token
3. New token cached in memory
4. Old token discarded
```

### Phase 5: Logout
```
1. User clicks logout
2. Frontend calls Better Auth logout
3. Better Auth deletes session from database
4. Frontend clears JWT from memory
5. User redirected to login page
```

## Data Isolation Guarantees

### Database Schema
```sql
CREATE TABLE todos (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR NOT NULL,  -- From Better Auth user.id
    title VARCHAR(200) NOT NULL,
    description VARCHAR(2000),
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_todos_user_id ON todos(user_id);
```

### Query Patterns (MANDATORY)

**✅ CORRECT - Always filter by user_id:**
```python
# Create
todo = Todo(user_id=authenticated_user_id, title="...", ...)
session.add(todo)

# List
todos = session.exec(
    select(Todo).where(Todo.user_id == authenticated_user_id)
).all()

# Get by ID
todo = session.exec(
    select(Todo).where(
        Todo.id == todo_id,
        Todo.user_id == authenticated_user_id  # CRITICAL
    )
).first()

# Update
todo = session.exec(
    select(Todo).where(
        Todo.id == todo_id,
        Todo.user_id == authenticated_user_id  # CRITICAL
    )
).first()
if todo:
    todo.title = new_title
    session.commit()

# Delete
todo = session.exec(
    select(Todo).where(
        Todo.id == todo_id,
        Todo.user_id == authenticated_user_id  # CRITICAL
    )
).first()
if todo:
    session.delete(todo)
    session.commit()
```

**❌ WRONG - Never query without user_id filter:**
```python
# SECURITY VULNERABILITY - User A can access User B's data
todo = session.exec(select(Todo).where(Todo.id == todo_id)).first()
```

## Environment Variables

### Frontend (.env.local / Vercel)
```bash
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8001
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Better Auth (Session Management)
BETTER_AUTH_SECRET=<random-32-byte-base64-string>
BETTER_AUTH_URL=http://localhost:3000
DATABASE_URL=file:auth.db

# JWT Private Key (RS256) - MUST be single line with \n escape sequences
JWT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG...\n-----END PRIVATE KEY-----"

# OAuth (Optional)
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
```

### Backend (.env)
```bash
# Database
DATABASE_URL=postgresql+psycopg://user:pass@host/db?sslmode=require

# JWT Public Key (RS256) - MUST be single line with \n escape sequences
JWT_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG...\n-----END PUBLIC KEY-----"
JWT_ALGORITHM=RS256

# API Configuration
API_VERSION=v1
DEBUG=false

# CORS (Frontend URL)
CORS_ORIGINS=http://localhost:3000,https://your-app.vercel.app

# Server
HOST=0.0.0.0
PORT=8001
```

## Key Generation (One-Time Setup)

```bash
# Generate RSA key pair (2048-bit)
openssl genrsa -out private_key.pem 2048
openssl rsa -in private_key.pem -pubout -out public_key.pem

# Convert to single-line format for environment variables
# Private key (for JWT_PRIVATE_KEY)
awk 'NF {sub(/\r/, ""); printf "%s\\n",$0;}' private_key.pem

# Public key (for JWT_PUBLIC_KEY)
awk 'NF {sub(/\r/, ""); printf "%s\\n",$0;}' public_key.pem

# IMPORTANT: Delete private_key.pem and public_key.pem after copying to .env
# NEVER commit these files to git
```

## Deployment Checklist

### Pre-Deployment
- [ ] Generate RSA key pair (2048-bit minimum)
- [ ] Convert keys to single-line format with \n escape sequences
- [ ] Add JWT_PRIVATE_KEY to Vercel environment variables
- [ ] Add JWT_PUBLIC_KEY to backend environment variables
- [ ] Verify JWT_ALGORITHM=RS256 in backend
- [ ] Delete private_key.pem and public_key.pem files
- [ ] Verify .gitignore excludes *.pem files
- [ ] Set BETTER_AUTH_SECRET (32-byte random base64)
- [ ] Configure DATABASE_URL for Neon PostgreSQL
- [ ] Update CORS_ORIGINS with production URLs

### Post-Deployment
- [ ] Test login flow (email/password)
- [ ] Test OAuth flow (if configured)
- [ ] Verify JWT token generation (/api/token)
- [ ] Test todo creation (verify user_id set correctly)
- [ ] Test todo listing (verify only user's todos returned)
- [ ] Test todo update (verify cross-user access denied)
- [ ] Test todo deletion (verify cross-user access denied)
- [ ] Test logout (verify JWT cleared)
- [ ] Test expired token handling
- [ ] Monitor logs for authentication errors

## Common Mistakes to Avoid

### ❌ Mistake 1: Filesystem-based secrets
```typescript
// WRONG - Breaks on Vercel
const privateKey = fs.readFileSync('private_key.pem', 'utf8');
```
```typescript
// CORRECT - Use environment variables
const privateKey = process.env.JWT_PRIVATE_KEY!;
```

### ❌ Mistake 2: Client-side JWT signing
```typescript
// WRONG - Never sign JWTs in client components
'use client';
import jwt from 'jsonwebtoken';
const token = jwt.sign({...}, privateKey);
```
```typescript
// CORRECT - Sign JWTs only in API routes
// app/api/token/route.ts
export async function GET(request: NextRequest) {
  const token = jwt.sign({...}, privateKey);
  return NextResponse.json({ token });
}
```

### ❌ Mistake 3: Trusting client-provided user_id
```python
# WRONG - User can fake their ID
@router.post("/tasks")
async def create_todo(todo_data: TodoCreate, user_id: str):
    todo = Todo(user_id=user_id, ...)  # SECURITY VULNERABILITY
```
```python
# CORRECT - Extract user_id from JWT
@router.post("/tasks")
async def create_todo(
    todo_data: TodoCreate,
    user_id: Annotated[str, Depends(get_current_user_id)]
):
    todo = Todo(user_id=user_id, ...)  # SECURE
```

### ❌ Mistake 4: Missing user_id filter in queries
```python
# WRONG - Returns todos from all users
todo = session.exec(select(Todo).where(Todo.id == todo_id)).first()
```
```python
# CORRECT - Filter by user_id
todo = session.exec(
    select(Todo).where(
        Todo.id == todo_id,
        Todo.user_id == authenticated_user_id
    )
).first()
```

### ❌ Mistake 5: Storing JWT in localStorage
```typescript
// WRONG - Vulnerable to XSS attacks
localStorage.setItem('jwt', token);
```
```typescript
// CORRECT - Store in memory only
let cachedToken: string | null = null;
```

### ❌ Mistake 6: Multi-line environment variables
```bash
# WRONG - Breaks parsing
JWT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG...
-----END PRIVATE KEY-----"
```
```bash
# CORRECT - Single line with \n escape sequences
JWT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG...\n-----END PRIVATE KEY-----"
```

## Security Testing

### Test 1: Cross-User Data Access
```bash
# Login as User A
curl -X POST http://localhost:3000/api/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{"email":"usera@example.com","password":"password"}'

# Get JWT for User A
JWT_A=$(curl -X GET http://localhost:3000/api/token \
  -H "Cookie: better-auth.session_token=..." | jq -r '.token')

# Create todo as User A
TODO_ID=$(curl -X POST http://localhost:8001/api/tasks \
  -H "Authorization: Bearer $JWT_A" \
  -H "Content-Type: application/json" \
  -d '{"title":"User A Todo"}' | jq -r '.id')

# Login as User B
curl -X POST http://localhost:3000/api/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{"email":"userb@example.com","password":"password"}'

# Get JWT for User B
JWT_B=$(curl -X GET http://localhost:3000/api/token \
  -H "Cookie: better-auth.session_token=..." | jq -r '.token')

# Try to access User A's todo as User B (MUST FAIL)
curl -X GET http://localhost:8001/api/tasks/$TODO_ID \
  -H "Authorization: Bearer $JWT_B"
# Expected: 404 Not Found

# Try to update User A's todo as User B (MUST FAIL)
curl -X PATCH http://localhost:8001/api/tasks/$TODO_ID \
  -H "Authorization: Bearer $JWT_B" \
  -H "Content-Type: application/json" \
  -d '{"title":"Hacked"}'
# Expected: 404 Not Found

# Try to delete User A's todo as User B (MUST FAIL)
curl -X DELETE http://localhost:8001/api/tasks/$TODO_ID \
  -H "Authorization: Bearer $JWT_B"
# Expected: 404 Not Found
```

### Test 2: Invalid JWT Handling
```bash
# No token
curl -X GET http://localhost:8001/api/tasks
# Expected: 401 Unauthorized

# Invalid token
curl -X GET http://localhost:8001/api/tasks \
  -H "Authorization: Bearer invalid.token.here"
# Expected: 401 Unauthorized

# Expired token (wait 7 days or manipulate exp claim)
curl -X GET http://localhost:8001/api/tasks \
  -H "Authorization: Bearer $EXPIRED_JWT"
# Expected: 401 Unauthorized
```

### Test 3: SQL Injection Prevention
```bash
# Try SQL injection in todo_id parameter
curl -X GET "http://localhost:8001/api/tasks/1' OR '1'='1" \
  -H "Authorization: Bearer $JWT"
# Expected: 404 Not Found (not SQL error)
```

## Performance Considerations

### JWT Caching
- Tokens cached in memory for 7 days
- Auto-refresh 5 minutes before expiry
- Reduces /api/token calls by ~99%

### Database Indexing
- Index on `todos.user_id` for fast filtering
- Composite index on `(user_id, created_at)` for sorted queries

### Connection Pooling
- SQLModel with PostgreSQL connection pooling
- Recommended pool size: 10-20 connections

## Monitoring & Logging

### Key Metrics
- JWT generation rate (should be low due to caching)
- JWT validation failures (indicates attack or misconfiguration)
- Cross-user access attempts (should be 0)
- Token expiration errors (indicates caching issues)

### Log Examples
```
✓ Generated JWT token for user: abc123...
✓ User authenticated via JWT: abc123...
⚠ JWT token has expired
⚠ JWT validation failed: Invalid signature
⚠ Session token not found in database
✗ Authentication failed: No session token found
```

## Troubleshooting

### Issue: "Not authenticated" errors
**Cause**: JWT token not generated or expired
**Solution**: Check /api/token endpoint, verify Better Auth session

### Issue: "Invalid authentication credentials"
**Cause**: JWT signature verification failed
**Solution**: Verify JWT_PUBLIC_KEY matches JWT_PRIVATE_KEY

### Issue: User sees other users' todos
**Cause**: Missing user_id filter in database queries
**Solution**: Review all queries, ensure user_id filter present

### Issue: "JWT authentication not configured"
**Cause**: JWT_PUBLIC_KEY not set in backend
**Solution**: Add JWT_PUBLIC_KEY to backend .env file

### Issue: Vercel deployment fails
**Cause**: Filesystem-based secret loading
**Solution**: Use environment variables, not fs.readFileSync

## Conclusion

This architecture provides:
- ✅ Production-grade security
- ✅ Strict multi-user data isolation
- ✅ Vercel-compatible deployment
- ✅ No filesystem dependencies
- ✅ Automatic token management
- ✅ Defense in depth

All security requirements are met with zero shortcuts.
