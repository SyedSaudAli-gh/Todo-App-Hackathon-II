# Quickstart: Testing Chat UI Routing Fix

**Feature**: 004-fix-chat-routing
**Date**: 2026-02-03
**Purpose**: Verify that chat interactions do not cause browser URL navigation

## Prerequisites

- Application running locally (frontend + backend)
- User account created and logged in
- Browser with visible address bar (for URL verification)

## Setup

1. Start the backend server:
   ```bash
   cd api
   python -m uvicorn src.main:app --reload
   ```

2. Start the frontend server:
   ```bash
   cd web
   npm run dev
   ```

3. Open browser and navigate to `http://localhost:3000`
4. Log in with test credentials

## Test Procedures

### Test 1: Chat Opens Without Navigation ✅

**Objective**: Verify chat opens as overlay without changing URL

**Steps**:
1. Navigate to `/dashboard/todos`
2. Note the current URL in address bar: `http://localhost:3000/dashboard/todos`
3. Click the floating chat button (bottom-right corner)
4. Observe the chat panel opens

**Expected Result**:
- ✅ Chat opens as overlay (modal or slide-out panel)
- ✅ URL remains `http://localhost:3000/dashboard/todos`
- ✅ Underlying page content still visible (dimmed or partially visible)

**Fail Conditions**:
- ❌ URL changes to `/chat` or any other route
- ❌ Page navigates away from `/dashboard/todos`
- ❌ Full-page chat route renders

---

### Test 2: Sending Messages Without Navigation ✅

**Objective**: Verify sending messages does not change URL

**Steps**:
1. With chat open on `/dashboard/todos`
2. Type a message: "Hello"
3. Press Enter or click Send button
4. Wait for AI response
5. Observe URL in address bar

**Expected Result**:
- ✅ Message sent successfully
- ✅ AI response received and displayed
- ✅ URL remains `http://localhost:3000/dashboard/todos` throughout
- ✅ No navigation occurs

**Fail Conditions**:
- ❌ URL changes at any point during message sending
- ❌ URL changes after receiving response
- ❌ Browser navigates to `/chat` route

---

### Test 3: Multiple Messages Without Navigation ✅

**Objective**: Verify multiple messages in sequence do not cause navigation

**Steps**:
1. With chat open on `/dashboard/todos`
2. Send 5 messages in sequence:
   - "Create a task"
   - "List my tasks"
   - "Mark task as complete"
   - "Delete a task"
   - "Show task details"
3. Wait for responses after each message
4. Observe URL after each message

**Expected Result**:
- ✅ All 5 messages sent successfully
- ✅ All responses received
- ✅ URL remains `http://localhost:3000/dashboard/todos` after every message
- ✅ No navigation occurs at any point

**Fail Conditions**:
- ❌ URL changes after any message
- ❌ Navigation occurs during conversation
- ❌ Chat route appears in URL

---

### Test 4: Chat Works on Different Pages ✅

**Objective**: Verify chat works on all pages without navigation

**Steps**:
1. Navigate to `/dashboard/profile`
2. Note URL: `http://localhost:3000/dashboard/profile`
3. Click floating chat button
4. Send a message: "Test message"
5. Observe URL remains `/dashboard/profile`
6. Close chat
7. Navigate to `/dashboard/todos`
8. Note URL: `http://localhost:3000/dashboard/todos`
9. Click floating chat button
10. Observe conversation history from previous page

**Expected Result**:
- ✅ Chat works on `/dashboard/profile` without URL change
- ✅ Chat works on `/dashboard/todos` without URL change
- ✅ Conversation history preserved across page navigation
- ✅ Same conversation continues on different pages

**Fail Conditions**:
- ❌ URL changes on any page
- ❌ Conversation history lost
- ❌ New conversation started on different page

---

### Test 5: Chat Route Redirect ✅

**Objective**: Verify `/chat` route redirects to default page

**Steps**:
1. In browser address bar, type: `http://localhost:3000/chat`
2. Press Enter
3. Observe where browser navigates

**Expected Result**:
- ✅ Browser redirects to `/dashboard/todos` (or configured default page)
- ✅ No full-page chat route renders
- ✅ Floating chat button visible on redirected page

**Fail Conditions**:
- ❌ Full-page chat route renders
- ❌ 404 error page appears
- ❌ No redirect occurs

---

### Test 6: Browser Navigation ✅

**Objective**: Verify browser back/forward buttons work correctly

**Steps**:
1. Navigate to `/dashboard/profile`
2. Navigate to `/dashboard/todos`
3. Open chat
4. Send a message: "Test"
5. Click browser back button
6. Observe URL and page

**Expected Result**:
- ✅ Browser navigates back to `/dashboard/profile`
- ✅ No chat-related URLs in browser history
- ✅ Chat closes when navigating back
- ✅ Browser forward button works correctly

**Fail Conditions**:
- ❌ Chat-related URL appears in history
- ❌ Browser back button navigates to `/chat`
- ❌ Navigation broken or unexpected

---

### Test 7: Chat Closes Without Navigation ✅

**Objective**: Verify closing chat does not change URL

**Steps**:
1. Navigate to `/dashboard/todos`
2. Open chat
3. Send a message
4. Click outside chat area (or press Escape key)
5. Observe chat closes
6. Observe URL

**Expected Result**:
- ✅ Chat closes smoothly
- ✅ Floating button reappears
- ✅ URL remains `/dashboard/todos`
- ✅ No navigation occurs

**Fail Conditions**:
- ❌ URL changes when closing chat
- ❌ Navigation occurs
- ❌ Chat doesn't close properly

---

### Test 8: Page Refresh Preserves Conversation ✅

**Objective**: Verify conversation persists after page refresh

**Steps**:
1. Navigate to `/dashboard/todos`
2. Open chat
3. Send a message: "Test message"
4. Wait for response
5. Refresh page (F5 or Ctrl+R)
6. Open chat again
7. Observe conversation history

**Expected Result**:
- ✅ Page refreshes successfully
- ✅ URL remains `/dashboard/todos`
- ✅ Chat opens with previous conversation history
- ✅ Previous messages visible

**Fail Conditions**:
- ❌ Conversation history lost
- ❌ URL changes after refresh
- ❌ Chat doesn't work after refresh

---

## Success Criteria Checklist

After completing all tests, verify:

- [ ] ✅ All 8 tests pass
- [ ] ✅ URL never changes during any chat interaction
- [ ] ✅ Chat functions as overlay on all pages
- [ ] ✅ Conversation history persists correctly
- [ ] ✅ No `/chat` route accessible (redirects to default page)
- [ ] ✅ Browser back/forward buttons work correctly
- [ ] ✅ Chat closes without navigation
- [ ] ✅ Page refresh preserves conversation

## Troubleshooting

### Issue: Chat button not visible
**Solution**: Check that ChatWidget is added to dashboard layout

### Issue: URL still changes when sending messages
**Solution**: Verify all router.push() calls removed from useChat hook

### Issue: Conversation history lost
**Solution**: Check backend API is working and conversation ID is passed correctly

### Issue: /chat route still accessible
**Solution**: Verify redirect logic is implemented in chat page component

## Reporting Issues

If any test fails, document:
1. Test number and name
2. Steps to reproduce
3. Expected result
4. Actual result
5. Browser and version
6. Console errors (if any)

## Next Steps

After all tests pass:
1. Mark feature as complete
2. Create pull request
3. Request code review
4. Deploy to staging environment
5. Perform final verification on staging
