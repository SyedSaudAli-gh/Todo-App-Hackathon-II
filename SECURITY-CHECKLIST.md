# Security & Data Isolation Verification Checklist

Use this checklist before deploying to production to ensure your authentication and data isolation are properly configured.

## Pre-Deployment Security Checklist

### 1. Key Management ✓

- [ ] RSA key pair generated (minimum 2048-bit)
- [ ] Private key stored in `JWT_PRIVATE_KEY` environment variable (frontend)
- [ ] Public key stored in `JWT_PUBLIC_KEY` environment variable (backend)
- [ ] Keys are in single-line format with `\n` escape sequences
- [ ] PEM files deleted from filesystem (`private_key.pem`, `public_key.pem`)
- [ ] `.gitignore` excludes `*.pem` files
- [ ] No hardcoded keys in source code
- [ ] Keys match (public derived from private)

### 2. Environment Variables ✓

**Frontend (.env.local / Vercel):**
- [ ] `JWT_PRIVATE_KEY` set (single-line format)
- [ ] `BETTER_AUTH_SECRET` set (32+ byte random string)
- [ ] `BETTER_AUTH_URL` set (correct domain)
- [ ] `NEXT_PUBLIC_API_BASE_URL` set (backend URL)
- [ ] `NEXT_PUBLIC_APP_URL` set (frontend URL)
- [ ] `DATABASE_URL` set (SQLite for Better Auth)

**Backend (.env):**
- [ ] `JWT_PUBLIC_KEY` set (single-line format)
- [ ] `JWT_ALGORITHM=RS256` set
- [ ] `DATABASE_URL` set (PostgreSQL connection string)
- [ ] `CORS_ORIGINS` includes frontend domain
- [ ] `DEBUG=false` in production
- [ ] `API_VERSION` set

### 3. Code Security ✓

**Frontend:**
- [ ] No `fs.readFileSync` for secrets
- [ ] JWT signing only in API routes (not client components)
- [ ] JWT stored in memory only (not localStorage)
- [ ] Session cookies are httpOnly
- [ ] No private keys in client-side code

**Backend:**
- [ ] All endpoints require authentication
- [ ] User ID extracted from JWT `sub` claim (never from request body)
- [ ] All database queries filter by `user_id`
- [ ] No SQL injection vulnerabilities
- [ ] Input validation on all endpoints

### 4. Database Schema ✓

- [ ] `todos` table has `user_id` column
- [ ] `user_id` is indexed for performance
- [ ] `user_id` is required (NOT NULL)
- [ ] Foreign key relationship to users table (if applicable)
- [ ] All queries include `WHERE user_id = authenticated_user_id`

### 5. Authentication Flow ✓

- [ ] Better Auth session creation works
- [ ] Session cookies are set correctly
- [ ] `/api/token` endpoint validates session
- [ ] `/api/token` generates valid JWT
- [ ] JWT includes `sub` claim with user ID
- [ ] JWT expiration is set (7 days recommended)
- [ ] Frontend caches JWT in memory
- [ ] Frontend auto-refreshes JWT before expiry
- [ ] Logout clears JWT from memory

### 6. API Security ✓

- [ ] All API requests include `Authorization: Bearer <token>` header
- [ ] Backend validates JWT signature
- [ ] Backend checks JWT expiration
- [ ] Backend extracts user_id from `sub` claim
- [ ] Invalid tokens return 401 Unauthorized
- [ ] Expired tokens return 401 Unauthorized
- [ ] Missing tokens return 401 Unauthorized

## Data Isolation Testing

### Test 1: Cross-User Todo Access ✓

```bash
# Create User A and User B
# Login as User A, create todo
# Login as User B, try to access User A's todo by ID
# Expected: 404 Not Found (not 403, to avoid leaking existence)
```

**Steps:**
1. Create User A account
2. Login as User A
3. Create a todo (note the todo ID)
4. Logout
5. Create User B account
6. Login as User B
7. Try to GET `/api/tasks/{user_a_todo_id}`
8. **Expected Result**: 404 Not Found
9. Try to PATCH `/api/tasks/{user_a_todo_id}`
10. **Expected Result**: 404 Not Found
11. Try to DELETE `/api/tasks/{user_a_todo_id}`
12. **Expected Result**: 404 Not Found

**✅ PASS**: User B cannot access User A's todos
**❌ FAIL**: User B can see/modify User A's todos → FIX IMMEDIATELY

### Test 2: Todo List Isolation ✓

```bash
# User A creates 3 todos
# User B creates 2 todos
# User A lists todos → should see only 3
# User B lists todos → should see only 2
```

**Steps:**
1. Login as User A
2. Create 3 todos
3. GET `/api/tasks` → count todos
4. **Expected Result**: 3 todos returned
5. Logout
6. Login as User B
7. Create 2 todos
8. GET `/api/tasks` → count todos
9. **Expected Result**: 2 todos returned (not 5)

**✅ PASS**: Each user sees only their own todos
**❌ FAIL**: Users see each other's todos → FIX IMMEDIATELY

### Test 3: JWT Token Validation ✓

```bash
# Test with no token
curl -X GET http://localhost:8001/api/tasks
# Expected: 401 Unauthorized

# Test with invalid token
curl -X GET http://localhost:8001/api/tasks \
  -H "Authorization: Bearer invalid.token.here"
# Expected: 401 Unauthorized

# Test with expired token
curl -X GET http://localhost:8001/api/tasks \
  -H "Authorization: Bearer <expired-token>"
# Expected: 401 Unauthorized

# Test with valid token
curl -X GET http://localhost:8001/api/tasks \
  -H "Authorization: Bearer <valid-token>"
# Expected: 200 OK with user's todos
```

**✅ PASS**: All invalid tokens rejected with 401
**❌ FAIL**: Invalid tokens accepted → FIX IMMEDIATELY

### Test 4: SQL Injection Prevention ✓

```bash
# Try SQL injection in todo_id parameter
curl -X GET "http://localhost:8001/api/tasks/1' OR '1'='1" \
  -H "Authorization: Bearer <valid-token>"
# Expected: 404 Not Found (not SQL error)

# Try SQL injection in title field
curl -X POST http://localhost:8001/api/tasks \
  -H "Authorization: Bearer <valid-token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test'; DROP TABLE todos;--"}'
# Expected: 201 Created (title stored as-is, not executed)
```

**✅ PASS**: No SQL injection possible
**❌ FAIL**: SQL injection works → FIX IMMEDIATELY

### Test 5: Token Refresh ✓

```bash
# Login and get JWT
# Wait 5 minutes
# Make API call
# Expected: New token fetched automatically
# Check browser console for "✓ JWT token fetched and cached"
```

**✅ PASS**: Token auto-refreshes before expiry
**❌ FAIL**: Token expires and causes errors → CHECK JWT_MANAGER

## Common Security Mistakes

### ❌ CRITICAL: Trusting Client Input

```python
# WRONG - User can fake their ID
@router.post("/tasks")
async def create_todo(user_id: str, todo_data: TodoCreate):
    todo = Todo(user_id=user_id, ...)  # SECURITY VULNERABILITY
```

```python
# CORRECT - Extract from JWT
@router.post("/tasks")
async def create_todo(
    todo_data: TodoCreate,
    user_id: Annotated[str, Depends(get_current_user_id)]
):
    todo = Todo(user_id=user_id, ...)  # SECURE
```

### ❌ CRITICAL: Missing User Filter

```python
# WRONG - Returns any user's todo
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

### ❌ CRITICAL: Filesystem Secrets

```typescript
// WRONG - Breaks on Vercel
const privateKey = fs.readFileSync('private_key.pem', 'utf8');
```

```typescript
// CORRECT - Use environment variables
const privateKey = process.env.JWT_PRIVATE_KEY!;
```

### ❌ CRITICAL: Client-Side JWT Signing

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

### ❌ HIGH: Storing JWT in localStorage

```typescript
// WRONG - Vulnerable to XSS
localStorage.setItem('jwt', token);
```

```typescript
// CORRECT - Store in memory only
let cachedToken: string | null = null;
```

### ❌ HIGH: Multi-Line Environment Variables

```bash
# WRONG - Breaks parsing
JWT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG...
-----END PRIVATE KEY-----"
```

```bash
# CORRECT - Single line with \n
JWT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG...\n-----END PRIVATE KEY-----"
```

## Production Deployment Checklist

### Vercel (Frontend)

- [ ] Code pushed to GitHub
- [ ] Project imported in Vercel
- [ ] Environment variables configured:
  - [ ] `JWT_PRIVATE_KEY`
  - [ ] `BETTER_AUTH_SECRET`
  - [ ] `BETTER_AUTH_URL` (Vercel domain)
  - [ ] `NEXT_PUBLIC_API_BASE_URL` (backend URL)
  - [ ] `NEXT_PUBLIC_APP_URL` (Vercel domain)
- [ ] Build successful
- [ ] Deployment successful
- [ ] HTTPS enabled (automatic)

### Backend (Railway/Render/Fly.io)

- [ ] Code pushed to GitHub
- [ ] Service created
- [ ] Environment variables configured:
  - [ ] `DATABASE_URL` (Neon PostgreSQL)
  - [ ] `JWT_PUBLIC_KEY`
  - [ ] `JWT_ALGORITHM=RS256`
  - [ ] `CORS_ORIGINS` (Vercel domain)
  - [ ] `DEBUG=false`
- [ ] Database migrations run
- [ ] Build successful
- [ ] Deployment successful
- [ ] HTTPS enabled

### Post-Deployment Verification

- [ ] Backend health check passes
- [ ] Frontend loads without errors
- [ ] User signup works
- [ ] User login works
- [ ] JWT token generation works
- [ ] Todo creation works
- [ ] Todo listing works (only user's todos)
- [ ] Todo update works
- [ ] Todo deletion works
- [ ] Cross-user access denied (Test 1)
- [ ] Logout works
- [ ] Login again works (session persists)

## Monitoring & Alerts

### Key Metrics to Monitor

- [ ] JWT generation rate (should be low)
- [ ] JWT validation failures (should be near zero)
- [ ] 401 Unauthorized rate (track authentication issues)
- [ ] Cross-user access attempts (should be zero)
- [ ] Database query performance
- [ ] API response times

### Recommended Alerts

- [ ] Alert on JWT validation failure spike
- [ ] Alert on 401 rate increase
- [ ] Alert on database connection failures
- [ ] Alert on API error rate increase
- [ ] Alert on slow query performance

## Security Audit Log

Document your security verification:

```
Date: _______________
Auditor: _______________

✓ Key Management: PASS / FAIL
✓ Environment Variables: PASS / FAIL
✓ Code Security: PASS / FAIL
✓ Database Schema: PASS / FAIL
✓ Authentication Flow: PASS / FAIL
✓ API Security: PASS / FAIL
✓ Cross-User Access Test: PASS / FAIL
✓ Todo List Isolation Test: PASS / FAIL
✓ JWT Validation Test: PASS / FAIL
✓ SQL Injection Test: PASS / FAIL
✓ Token Refresh Test: PASS / FAIL

Issues Found:
1. _______________
2. _______________
3. _______________

Remediation Actions:
1. _______________
2. _______________
3. _______________

Final Status: APPROVED / NEEDS WORK

Signature: _______________
```

## Emergency Procedures

### If Private Key is Compromised

1. **Immediately** generate new RSA key pair
2. Update `JWT_PRIVATE_KEY` in frontend environment
3. Update `JWT_PUBLIC_KEY` in backend environment
4. Redeploy both frontend and backend
5. All existing JWTs will be invalidated
6. Users must login again
7. Investigate how key was compromised
8. Review access logs for suspicious activity

### If User Data is Leaked

1. **Immediately** investigate the cause
2. Review all database queries for missing `user_id` filters
3. Check authentication logs for unauthorized access
4. Notify affected users
5. Force password reset for all users
6. Review and fix security vulnerabilities
7. Document incident and remediation

### If SQL Injection is Found

1. **Immediately** take affected endpoint offline
2. Review all database queries
3. Ensure parameterized queries are used
4. Add input validation
5. Test thoroughly
6. Redeploy with fixes
7. Audit database for unauthorized changes

## Final Sign-Off

Before going to production, all team members must verify:

- [ ] **Security Lead**: All security tests pass
- [ ] **Backend Developer**: All API endpoints secured
- [ ] **Frontend Developer**: No secrets in client code
- [ ] **DevOps**: Environment variables configured correctly
- [ ] **QA**: All test scenarios pass
- [ ] **Product Owner**: Acceptance criteria met

**Production Deployment Approved**: YES / NO

**Date**: _______________

**Signatures**: _______________

---

## Quick Reference: Security Principles

1. **Zero Trust**: Never trust client input
2. **Defense in Depth**: Multiple security layers
3. **Least Privilege**: Users access only their data
4. **Secure by Default**: Security built-in, not bolted-on
5. **Fail Securely**: Errors don't leak information
6. **Audit Everything**: Log all security events
7. **Encrypt in Transit**: HTTPS everywhere
8. **Rotate Credentials**: Regular key rotation
9. **Monitor Continuously**: Watch for anomalies
10. **Respond Quickly**: Have incident response plan

Your Todo Application is production-ready when ALL items in this checklist are verified ✓
