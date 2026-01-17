# Validation Guide: Dynamic Profile Statistics

**Feature**: 004-dynamic-profile-stats
**Status**: Implementation Complete - Ready for Validation
**Date**: 2026-01-13

## Overview

This guide provides step-by-step instructions for validating the Dynamic Profile Statistics feature implementation. All code implementation is complete. These validation tests verify the feature works correctly end-to-end.

## Prerequisites

### 1. Backend Setup

```bash
# Navigate to API directory
cd api

# Create virtual environment (if not exists)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Apply database migrations
alembic upgrade head

# Verify migration applied
alembic current
# Should show: 002_add_user_id_to_todos (head)
```

### 2. Frontend Setup

```bash
# Navigate to web directory
cd web

# Install dependencies (if not done)
npm install

# Verify environment variables
# Check .env.local exists with:
# NEXT_PUBLIC_API_BASE_URL=http://localhost:8001
```

### 3. Start Servers

**Terminal 1 - Backend API:**
```bash
cd api
venv\Scripts\activate  # Windows
# source venv/bin/activate  # macOS/Linux
uvicorn src.main:app --reload --port 8001
```

**Terminal 2 - Frontend:**
```bash
cd web
npm run dev
```

**Verify servers are running:**
- Backend: http://localhost:8001/health (should return 200 OK)
- Frontend: http://localhost:3000 (should load)
- API Docs: http://localhost:8001/api/v1/docs (Swagger UI)

---

## Validation Tests (T053-T064)

### T053: Test Endpoint via Swagger UI ✅

**Objective**: Verify API endpoint works correctly via Swagger UI

**Steps:**
1. Navigate to http://localhost:8001/api/v1/docs
2. Locate `GET /api/v1/users/me/stats` endpoint
3. Click "Try it out"
4. Click "Execute"

**Expected Results:**
- **With valid session**: 200 OK response with JSON:
  ```json
  {
    "total_tasks": <number>,
    "completed_tasks": <number>,
    "completion_rate": <0-100>,
    "active_days": <number>
  }
  ```
- **Without session**: 401 Unauthorized with:
  ```json
  {
    "detail": "Not authenticated"
  }
  ```

**Acceptance Criteria:**
- [ ] Endpoint appears in Swagger UI
- [ ] Authenticated request returns 200 with correct schema
- [ ] Unauthenticated request returns 401
- [ ] Response matches UserStatsResponse schema

---

### T054: Test Frontend with Zero Todos ✅

**Objective**: Verify statistics display correctly when user has no todos

**Steps:**
1. Create a new user account (or delete all todos for existing user)
2. Navigate to http://localhost:3000/dashboard/profile
3. Observe statistics display

**Expected Results:**
- Total Tasks: 0
- Completed Tasks: 0
- Completion Rate: 0.0%
- Active Days: 1 (or more, depending on account age)
- No errors or crashes
- Loading spinner appears briefly, then statistics display

**Acceptance Criteria:**
- [ ] Statistics display without errors
- [ ] Completion rate shows 0.0% (not NaN or error)
- [ ] Active days shows at least 1
- [ ] UI remains functional

---

### T055: Test Frontend with Partial Completion ✅

**Objective**: Verify completion rate calculates correctly

**Steps:**
1. Log in as a user
2. Create 10 todos
3. Mark 7 todos as completed
4. Navigate to http://localhost:3000/dashboard/profile
5. Observe statistics

**Expected Results:**
- Total Tasks: 10
- Completed Tasks: 7
- Completion Rate: 70.0%
- Active Days: <varies by account age>

**Acceptance Criteria:**
- [ ] Total tasks count is accurate
- [ ] Completed tasks count is accurate
- [ ] Completion rate is exactly 70.0%
- [ ] Statistics update after page refresh

---

### T056: Test Frontend with Full Completion ✅

**Objective**: Verify 100% completion rate displays correctly

**Steps:**
1. Log in as a user
2. Create 5 todos
3. Mark all 5 todos as completed
4. Navigate to http://localhost:3000/dashboard/profile
5. Observe statistics

**Expected Results:**
- Total Tasks: 5
- Completed Tasks: 5
- Completion Rate: 100.0%
- Active Days: <varies by account age>

**Acceptance Criteria:**
- [ ] Completion rate shows exactly 100.0%
- [ ] No rounding errors
- [ ] UI displays correctly

---

### T057: Test Multiple Users for Data Isolation ✅

**Objective**: Verify each user sees only their own statistics

**Steps:**
1. Create User A account
2. Log in as User A
3. Create 10 todos (7 completed)
4. Note User A's statistics
5. Log out
6. Create User B account
7. Log in as User B
8. Create 5 todos (2 completed)
9. Note User B's statistics
10. Verify User B sees only their 5 todos
11. Log out and log back in as User A
12. Verify User A still sees their 10 todos

**Expected Results:**
- User A sees: 10 total, 7 completed, 70.0% rate
- User B sees: 5 total, 2 completed, 40.0% rate
- No cross-contamination of data

**Acceptance Criteria:**
- [ ] User A sees only their statistics
- [ ] User B sees only their statistics
- [ ] Statistics remain consistent after switching users
- [ ] No data leakage between users

---

### T058: Test Unauthenticated Access Returns 401 ✅

**Objective**: Verify authentication is required

**Steps:**
1. Log out of the application
2. Navigate to http://localhost:3000/dashboard/profile
3. Observe behavior

**Expected Results:**
- Error message displays: "Failed to load statistics: Not authenticated"
- Retry button appears
- No statistics display
- No application crash

**Acceptance Criteria:**
- [ ] 401 error handled gracefully
- [ ] User-friendly error message displayed
- [ ] Retry button present
- [ ] No console errors (except expected 401)

---

### T059: Test API Unavailable Shows Error Message ✅

**Objective**: Verify graceful degradation when API is down

**Steps:**
1. Log in to the application
2. Navigate to http://localhost:3000/dashboard/profile
3. Verify statistics load correctly
4. Stop the backend API server (Ctrl+C in Terminal 1)
5. Refresh the profile page
6. Observe behavior

**Expected Results:**
- Error message displays: "Failed to load statistics: Failed to fetch user statistics"
- Retry button appears
- No application crash
- Loading spinner appears initially

**Acceptance Criteria:**
- [ ] Error message displayed
- [ ] Retry button functional
- [ ] No unhandled exceptions
- [ ] User can retry after API restarts

---

### T060: Test Statistics Update After Creating/Completing Todos ✅

**Objective**: Verify real-time updates (via page refresh)

**Steps:**
1. Log in to the application
2. Navigate to http://localhost:3000/dashboard/profile
3. Note current statistics (e.g., 5 total, 3 completed, 60.0%)
4. Navigate to todos page
5. Create 2 new todos
6. Mark 1 as completed
7. Navigate back to profile page (or refresh)
8. Observe updated statistics

**Expected Results:**
- Total Tasks: 7 (was 5, added 2)
- Completed Tasks: 4 (was 3, added 1)
- Completion Rate: 57.1% (4/7)
- Statistics reflect current database state

**Acceptance Criteria:**
- [ ] Statistics update after page refresh
- [ ] New todos counted in total
- [ ] Completed todos counted correctly
- [ ] Completion rate recalculates accurately

---

### T061: Test Active Days for Account Created Today ✅

**Objective**: Verify active days calculation for new accounts

**Steps:**
1. Create a brand new user account today
2. Navigate to http://localhost:3000/dashboard/profile
3. Observe Active Days statistic

**Expected Results:**
- Active Days: 1

**Acceptance Criteria:**
- [ ] Active days shows 1 for account created today
- [ ] No zero or negative values
- [ ] Calculation is inclusive (today counts as day 1)

---

### T062: Test Active Days for Account Created 15 Days Ago ✅

**Objective**: Verify active days calculation for older accounts

**Steps:**
1. Identify a user account created 15 days ago
   - Check Better Auth database: `web/auth.db`
   - Query: `SELECT id, createdAt FROM user WHERE createdAt < datetime('now', '-14 days')`
2. Log in as that user
3. Navigate to http://localhost:3000/dashboard/profile
4. Observe Active Days statistic

**Expected Results:**
- Active Days: 15 (or appropriate number based on actual creation date)

**Acceptance Criteria:**
- [ ] Active days calculated correctly from creation date
- [ ] Calculation uses UTC timezone
- [ ] Inclusive counting (creation day = day 1)

**Note**: If no 15-day-old account exists, manually update a user's `createdAt` in the database for testing.

---

### T063: Verify API Response Time <500ms with 1000 Todos ✅

**Objective**: Verify performance meets requirements

**Steps:**
1. Create a test user account
2. Use a script to create 1000 todos for the user:
   ```python
   # create_test_todos.py
   import requests

   API_URL = "http://localhost:8001/api/v1/todos"

   for i in range(1000):
       response = requests.post(
           API_URL,
           json={"title": f"Test Todo {i}", "description": "Performance test"},
           cookies={"better-auth.session_token": "YOUR_SESSION_TOKEN"}
       )
       if i % 100 == 0:
           print(f"Created {i} todos")
   ```
3. Navigate to http://localhost:3000/dashboard/profile
4. Open browser DevTools → Network tab
5. Refresh the page
6. Find the request to `/api/v1/users/me/stats`
7. Check the response time

**Expected Results:**
- Response time: < 500ms
- Statistics calculate correctly even with 1000 todos
- No timeout errors

**Acceptance Criteria:**
- [ ] API responds in < 500ms
- [ ] Statistics are accurate
- [ ] No performance degradation
- [ ] Single optimized query used

---

### T064: Verify No Cross-User Data Leakage with Concurrent Requests ✅

**Objective**: Verify data isolation under concurrent load

**Steps:**
1. Create 2 user accounts (User A and User B)
2. Create different numbers of todos for each user
3. Use a script to make concurrent requests:
   ```python
   # concurrent_test.py
   import requests
   import concurrent.futures

   def get_stats(session_token, user_name):
       response = requests.get(
           "http://localhost:8001/api/v1/users/me/stats",
           cookies={"better-auth.session_token": session_token}
       )
       data = response.json()
       print(f"{user_name}: {data}")
       return data

   with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
       futures = []
       for i in range(50):
           futures.append(executor.submit(get_stats, "USER_A_TOKEN", "User A"))
           futures.append(executor.submit(get_stats, "USER_B_TOKEN", "User B"))

       results = [f.result() for f in futures]
   ```
4. Verify each user consistently receives their own statistics

**Expected Results:**
- User A always receives User A's statistics
- User B always receives User B's statistics
- No mixed or incorrect data
- All requests succeed

**Acceptance Criteria:**
- [ ] No cross-user data leakage
- [ ] Statistics consistent across concurrent requests
- [ ] No race conditions
- [ ] All requests return correct user-specific data

---

## Validation Checklist Summary

### Phase 3: Integration and Validation (T053-T064)

- [ ] T053: Test endpoint via Swagger UI
- [ ] T054: Test frontend with zero todos
- [ ] T055: Test frontend with partial completion
- [ ] T056: Test frontend with full completion
- [ ] T057: Test multiple users for data isolation
- [ ] T058: Test unauthenticated access returns 401
- [ ] T059: Test API unavailable shows error message
- [ ] T060: Test statistics update after creating/completing todos
- [ ] T061: Test active days for account created today
- [ ] T062: Test active days for account created 15 days ago
- [ ] T063: Verify API response time <500ms with 1000 todos
- [ ] T064: Verify no cross-user data leakage with concurrent requests

---

## Troubleshooting

### Issue: Backend won't start

**Symptoms**: `uvicorn` command fails or database connection errors

**Solutions**:
1. Verify virtual environment is activated
2. Check DATABASE_URL in `api/.env`
3. Verify Neon PostgreSQL database is accessible
4. Run `alembic upgrade head` to apply migrations
5. Check Python version: `python --version` (should be 3.13+)

### Issue: Frontend won't start

**Symptoms**: `npm run dev` fails or module not found errors

**Solutions**:
1. Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
2. Clear Next.js cache: `rm -rf .next`
3. Verify Node.js version: `node --version` (should be 18+)
4. Check `.env.local` has correct API URL

### Issue: 401 Unauthorized even when logged in

**Symptoms**: API returns 401 despite being authenticated

**Solutions**:
1. Check Better Auth session cookie exists in browser DevTools
2. Verify cookie name is `better-auth.session_token`
3. Check cookie domain matches frontend domain
4. Verify Better Auth database path in `api/src/middleware/auth.py`
5. Check session hasn't expired

### Issue: Statistics show 0 for all values

**Symptoms**: All statistics display as 0 even with todos

**Solutions**:
1. Verify `user_id` column exists in todos table
2. Check todos have `user_id` populated
3. Verify user_id matches authenticated user
4. Check database migration applied: `alembic current`

### Issue: CORS errors in browser console

**Symptoms**: "Access to fetch blocked by CORS policy"

**Solutions**:
1. Verify CORS configuration in `api/src/main.py`
2. Check `allow_origins` includes `http://localhost:3000`
3. Verify `allow_credentials=True` is set
4. Restart backend server after CORS changes

---

## Success Criteria

The feature is considered fully validated when:

1. ✅ All 12 validation tests (T053-T064) pass
2. ✅ No errors in browser console (except expected 401 for unauthenticated tests)
3. ✅ No errors in backend logs (except expected authentication failures)
4. ✅ Statistics display correctly for all scenarios
5. ✅ Data isolation verified between users
6. ✅ Performance meets <500ms requirement
7. ✅ Error handling works gracefully

---

## Next Steps After Validation

Once all validation tests pass:

1. **Document Results**: Update `tasks.md` with test results
2. **Create Commit**: Commit all implementation changes
3. **Create Pull Request**: Submit PR for code review
4. **Deploy**: Deploy to staging/production environment

---

## Support

**Documentation**:
- Feature Specification: `specs/004-dynamic-profile-stats/spec.md`
- Implementation Plan: `specs/004-dynamic-profile-stats/plan.md`
- Tasks List: `specs/004-dynamic-profile-stats/tasks.md`
- Quickstart Guide: `specs/004-dynamic-profile-stats/quickstart.md`

**API Documentation**:
- Swagger UI: http://localhost:8001/api/v1/docs
- ReDoc: http://localhost:8001/api/v1/redoc

**Contact**:
- For issues or questions, refer to project documentation
- Check backend logs for detailed error messages
- Use browser DevTools Network tab for API debugging
