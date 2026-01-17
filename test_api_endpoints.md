# API Endpoints Testing Guide

## Current Status

✅ **Backend**: Running on `http://localhost:8001`
✅ **Frontend**: Running on `http://localhost:3000`
⚠️ **Authentication**: Chunked cookie reassembly implemented but needs browser testing

## Issue Analysis

The backend logs show it's still receiving only 8 characters of the session token instead of the full 32 characters. This means:

1. **Cookies are being sent** - We see "X8qSufjF" in logs
2. **Chunked cookie reassembly is not working** - No "Reassembled cookie" logs
3. **Need to test with actual browser** - curl doesn't send cookies automatically

## Testing Instructions

### Step 1: Test with Browser (REQUIRED)

**You must test with your browser to send actual cookies:**

1. **Open Browser DevTools**
   - Press F12 in your browser
   - Go to Console tab

2. **Navigate to Dashboard**
   ```
   http://localhost:3000/dashboard/profile
   ```

3. **Check Network Tab**
   - Open Network tab in DevTools
   - Look for requests to `http://localhost:8001/api/v1/users/me/stats`
   - Click on the request
   - Check "Request Headers" section
   - Look for "Cookie:" header
   - **Copy all cookie values you see**

4. **Expected Cookies**
   You should see cookies like:
   ```
   better-auth.session_token=X8qSufjF
   better-auth.session_token.0=tHJvqslBtuS0bqQKg7TPQZhh
   ```

### Step 2: Test All Endpoints

Once you're logged in, test these endpoints in order:

#### 1. Health Check (No Auth Required)
```bash
curl http://localhost:8001/api/v1/health
```
**Expected**: `{"status":"healthy","service":"todo-api","version":"1.0.0"}`

#### 2. Debug Cookies (No Auth Required)
Open in browser while logged in:
```
http://localhost:8001/api/v1/debug/cookies
```
**Expected**: JSON showing all cookies with their lengths

#### 3. Get User Stats (Auth Required)
In browser while logged in, navigate to:
```
http://localhost:3000/dashboard/profile
```
**Expected**: Profile page loads with stats (no 401 error)

#### 4. List Todos (Auth Required)
In browser while logged in, navigate to:
```
http://localhost:3000/dashboard/todos
```
**Expected**: Todos page loads with list (no 401 error)

#### 5. Create Todo (Auth Required)
In browser on todos page:
1. Click "Add Todo" button
2. Fill in title: "Test Todo"
3. Fill in description: "Testing authentication"
4. Click "Create"

**Expected**: Todo created successfully (no 401 error)

#### 6. Update Todo (Auth Required)
In browser on todos page:
1. Click edit on a todo
2. Change title or description
3. Save changes

**Expected**: Todo updated successfully (no 401 error)

#### 7. Delete Todo (Auth Required)
In browser on todos page:
1. Click delete on a todo
2. Confirm deletion

**Expected**: Todo deleted successfully (no 401 error)

### Step 3: Check Backend Logs

After testing in browser, check the backend terminal for these logs:

**✅ SUCCESS - You should see:**
```
Reassembled cookie 'better-auth.session_token': 2 chunk(s), total length: 32
Session validated successfully for user (first 8 chars): aGRzkzQO
GET /api/v1/users/me/stats 200 OK
```

**❌ FAILURE - If you see:**
```
Session token not found in database (first 8 chars): X8qSufjF
Authentication failed: Invalid or expired session token
GET /api/v1/users/me/stats 401 Unauthorized
```

### Step 4: Troubleshooting

If you still get 401 errors after testing in browser:

1. **Check Cookie Names**
   - Open browser DevTools → Application tab → Cookies
   - Look at cookies for `localhost:3000`
   - Find the session token cookie name
   - It should be `better-auth.session_token`

2. **Check Cookie Values**
   - If you see multiple cookies with `.0`, `.1` suffixes, chunking is happening
   - If you only see one cookie with full 32 chars, no chunking needed

3. **Clear Cookies and Re-login**
   ```
   1. Open DevTools → Application → Cookies
   2. Delete all cookies for localhost:3000
   3. Log out and log in again
   4. Test endpoints again
   ```

4. **Check Backend Logs for Cookie Details**
   - Look for "All cookies:" log line
   - Look for "Cookie 'better-auth.session_token':" log line
   - This will show what cookies the backend is receiving

## API Endpoints Reference

### Public Endpoints (No Auth)
- `GET /api/v1/health` - Health check
- `GET /api/v1/debug/cookies` - Debug cookie inspection

### Protected Endpoints (Auth Required)
- `GET /api/v1/users/me/stats` - Get current user statistics
- `GET /api/v1/todos` - List all todos for current user
- `POST /api/v1/todos` - Create new todo
- `GET /api/v1/todos/{id}` - Get specific todo
- `PATCH /api/v1/todos/{id}` - Update todo
- `DELETE /api/v1/todos/{id}` - Delete todo

## Expected Responses

### Success Responses

**User Stats (200 OK)**
```json
{
  "total_tasks": 5,
  "completed_tasks": 3,
  "completion_rate": 60.0,
  "active_days": 7
}
```

**List Todos (200 OK)**
```json
{
  "todos": [
    {
      "id": 1,
      "title": "Test Todo",
      "description": "Testing",
      "completed": false,
      "created_at": "2026-01-13T...",
      "updated_at": "2026-01-13T..."
    }
  ],
  "total": 1
}
```

**Create Todo (201 Created)**
```json
{
  "id": 2,
  "title": "New Todo",
  "description": "Description",
  "completed": false,
  "created_at": "2026-01-13T...",
  "updated_at": "2026-01-13T..."
}
```

### Error Responses

**401 Unauthorized**
```json
{
  "detail": "Not authenticated"
}
```

**404 Not Found**
```json
{
  "detail": "Todo with id 999 not found"
}
```

## Next Steps

1. **Test in browser** following Step 1 above
2. **Copy the results** of what you see in:
   - Browser DevTools → Network → Request Headers → Cookie
   - Backend terminal logs
3. **Report back** with:
   - What cookies you see in browser
   - What the backend logs show
   - Which endpoints work and which fail

This will help me identify the exact issue and provide the final fix.
