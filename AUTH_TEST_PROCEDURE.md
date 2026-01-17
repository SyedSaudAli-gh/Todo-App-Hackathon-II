# Authentication Test Procedure

## Test Environment
- Better Auth: 1.4.10
- Next.js Dev Server: http://localhost:3000
- Date: 2026-01-17

## Pre-Test Checklist
- [ ] Next.js dev server running (`npm run dev` in web directory)
- [ ] Browser console open (F12)
- [ ] Server logs visible in terminal

## Test 1: Signup Flow

### Steps
1. Navigate to signup page: http://localhost:3000/signup (or wherever signup form is)
2. Fill in the form:
   - Name: "Test User"
   - Email: "test@example.com"
   - Password: "testpass123"
   - Confirm Password: "testpass123"
3. Click "Create account" button

### Expected Results
- ✅ No validation errors in browser console
- ✅ Server logs show:
  ```
  Signup called with: { email: 'test@example.com', password: '***', name: 'Test User' }
  Sending signup payload: { name: 'Test User', email: 'test@example.com', password: '***', payloadKeys: ['name', 'email', 'password'] }
  ```
- ✅ Better Auth route logs show:
  ```
  Body.name type: string
  Body.name value: Test User
  Body.email type: string
  Body.email value: test@example.com
  ```
- ✅ Response status: 200
- ✅ User redirected to /dashboard
- ✅ Session cookie set in browser

### Failure Indicators
- ❌ Error: "[body.name] Invalid input: expected string, received undefined"
- ❌ Error: "Name is required"
- ❌ No redirect occurs
- ❌ Console shows error messages

## Test 2: Signin Flow

### Steps
1. Sign out if currently signed in
2. Navigate to signin page
3. Fill in the form:
   - Email: "test@example.com"
   - Password: "testpass123"
4. Click "Sign in" button

### Expected Results
- ✅ No validation errors
- ✅ Response status: 200
- ✅ User redirected to /dashboard
- ✅ Session cookie set in browser
- ✅ User data available in session

### Failure Indicators
- ❌ Error: "Invalid credentials"
- ❌ No redirect occurs
- ❌ Session not established

## Test 3: Validation Edge Cases

### Test 3a: Empty Name
1. Try to signup with empty name field
2. Expected: "Name is required" error before API call

### Test 3b: Whitespace-only Name
1. Try to signup with name = "   " (spaces only)
2. Expected: "Name is required" error (trimmed to empty)

### Test 3c: Short Password
1. Try to signup with password = "short"
2. Expected: "Password must be at least 8 characters" error

### Test 3d: Mismatched Passwords
1. Try to signup with password ≠ confirmPassword
2. Expected: "Passwords do not match" error

## Test 4: Database Verification

### Steps
1. After successful signup, check database:
```bash
cd web
node -e "const Database = require('better-sqlite3'); const db = new Database('auth.db'); const user = db.prepare('SELECT * FROM user WHERE email = ?').get('test@example.com'); console.log(JSON.stringify(user, null, 2));"
```

### Expected Results
- ✅ User record exists
- ✅ `name` field is populated: "Test User"
- ✅ `email` field is populated: "test@example.com"
- ✅ `emailVerified` is 0 (false)
- ✅ `createdAt` and `updatedAt` timestamps present

## Debugging Commands

### View all users
```bash
cd web
node -e "const Database = require('better-sqlite3'); const db = new Database('auth.db'); const users = db.prepare('SELECT id, email, name, createdAt FROM user').all(); console.log(JSON.stringify(users, null, 2));"
```

### Clear test user
```bash
cd web
node -e "const Database = require('better-sqlite3'); const db = new Database('auth.db'); db.prepare('DELETE FROM user WHERE email = ?').run('test@example.com'); console.log('Test user deleted');"
```

### View sessions
```bash
cd web
node -e "const Database = require('better-sqlite3'); const db = new Database('auth.db'); const sessions = db.prepare('SELECT * FROM session').all(); console.log(JSON.stringify(sessions, null, 2));"
```

## Success Criteria

All tests must pass:
- ✅ Signup creates user with name field populated
- ✅ Signin works with created credentials
- ✅ Validation catches invalid inputs before API calls
- ✅ No "[body.name] Invalid input" errors
- ✅ Session management works correctly

## Rollback Plan

If tests fail:
1. Check server logs for exact error messages
2. Verify payload structure in browser network tab
3. Check Better Auth version compatibility
4. Review recent changes to auth configuration
5. Restore from git if necessary: `git checkout HEAD -- web/src/lib/auth/ web/src/contexts/AuthContext.tsx`
