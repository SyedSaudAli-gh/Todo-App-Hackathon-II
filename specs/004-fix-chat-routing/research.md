# Research: Chat UI Routing Fix

**Feature**: 004-fix-chat-routing
**Date**: 2026-02-03
**Status**: Complete

## Problem Analysis

### Current Behavior
- `useChat` hook calls `router.push()` in 3 locations
- Creates unwanted navigation to `/chat` routes
- Disrupts user workflow by changing URL
- User loses context of current page when interacting with chat

### Root Cause
- Chat was originally designed as a full-page route with URL-based conversation tracking
- `useChat` hook automatically syncs conversation state to URL via `router.push()`
- This design conflicts with the overlay-based chat requirement
- The full-page `/chat/[[...conversationId]]/page.tsx` route exists and is accessible

### Specific Issues Identified

**Issue 1: Line 87 in useChat.ts**
```typescript
router.push('/chat');
```
- Triggered on 404 error when conversation not found
- Navigates user away from current page

**Issue 2: Line 126 in useChat.ts**
```typescript
router.push(`/chat/${response.conversation_id}`);
```
- Triggered after sending first message in new conversation
- Navigates user to chat route with conversation ID

**Issue 3: Line 163 in useChat.ts**
```typescript
router.push('/chat');
```
- Triggered when resetting conversation
- Navigates user away from current page

## Solution Design

### Approach
Remove routing logic from chat state management and manage conversation state purely in React.

### Changes Required

1. **Remove all `router.push()` calls from `useChat` hook**
   - Delete lines 87, 126, 163
   - Remove `useRouter` import and usage
   - Conversation ID managed in React state only

2. **Manage conversation ID in React state only (no URL sync)**
   - Conversation ID stored in `useState`
   - Passed to backend API in request body
   - No URL changes on any chat action

3. **Remove or redirect `/chat` page route**
   - Delete `web/src/app/chat/[[...conversationId]]/page.tsx`
   - Add redirect from `/chat` to `/dashboard/todos`
   - Handle existing bookmarks gracefully

4. **Embed `ChatWidget` in dashboard layout**
   - Add to `web/src/app/dashboard/layout.tsx`
   - Available on all authenticated pages
   - No prop dependencies on URL parameters

### No Backend Changes Required
- Chat API already supports conversation ID in request body
- Conversation persistence works independently of URL
- No API endpoint modifications needed

## Technology Decisions

### State Management
**Decision**: Use React hooks (useState, useCallback) for conversation state
**Rationale**:
- Already in use throughout the application
- No additional dependencies required
- Sufficient for managing conversation ID and messages

**Alternatives Considered**:
- Context API: Overkill for this simple state
- URL parameters: Current approach causing the problem
- Local storage: Unnecessary complexity

### Chat Widget Placement
**Decision**: Add ChatWidget to dashboard layout
**Rationale**:
- Dashboard layout wraps all authenticated pages
- Ensures chat is available everywhere users need it
- Maintains authentication boundary

**Alternatives Considered**:
- Root layout: Would show chat on login/signup pages (undesirable)
- Individual pages: Would require adding to every page (maintenance burden)

### Route Handling
**Decision**: Redirect `/chat` to `/dashboard/todos`
**Rationale**:
- Handles existing bookmarks gracefully
- Provides clear default destination
- Prevents 404 errors

**Alternatives Considered**:
- Delete route entirely: Would break existing bookmarks
- Keep route but hide it: Confusing and unnecessary complexity

## Implementation Strategy

### Phase 1: Remove Routing Logic
**Files**: `web/src/lib/hooks/useChat.ts`

**Changes**:
1. Remove `import { useRouter } from 'next/navigation'`
2. Remove `const router = useRouter()`
3. Delete line 87: `router.push('/chat')`
4. Delete line 126: `router.push(\`/chat/${response.conversation_id}\`)`
5. Delete line 163: `router.push('/chat')` or modify `resetConversation` to not navigate

**Testing**: Verify messages send without URL changes

### Phase 2: Remove Chat Route
**Files**: `web/src/app/chat/[[...conversationId]]/page.tsx`

**Changes**:
1. Replace page content with redirect logic
2. Redirect to `/dashboard/todos`

**Alternative**: Delete file entirely and add redirect in middleware

**Testing**: Navigate to `/chat` and verify redirect

### Phase 3: Embed Chat Widget
**Files**: `web/src/app/dashboard/layout.tsx`

**Changes**:
1. Import `ChatWidgetWrapper`
2. Add `<ChatWidgetWrapper token={jwtToken} />` to layout
3. Ensure token is available from auth context

**Testing**: Verify chat button appears on all dashboard pages

### Phase 4: Update ChatWidget Props
**Files**: `web/src/components/chatbot/ChatWidget.tsx`

**Changes** (if needed):
1. Remove `conversationId` prop dependency
2. Let `useChat` hook manage conversation ID internally

**Testing**: Verify chat works without URL-based conversation ID

## Testing Strategy

### Manual Testing (Primary)
Follow quickstart guide test procedures:
1. Chat opens without navigation
2. Sending messages without navigation
3. Multiple messages without navigation
4. Chat works on different pages
5. Chat route redirects correctly
6. Browser navigation works correctly

### Verification Points
- URL never changes during chat interactions
- Conversation history persists correctly
- Chat button visible on all dashboard pages
- No `/chat` route accessible
- Browser back/forward buttons work correctly

## Risk Assessment

### Risk 1: Conversation Persistence
**Risk**: Removing router.push() may break conversation persistence
**Likelihood**: Low
**Impact**: High
**Mitigation**: Conversation ID still passed to backend API in request body
**Verification**: Test conversation history retrieval after page refresh

### Risk 2: Existing Bookmarks
**Risk**: Users may have bookmarked `/chat` URLs
**Likelihood**: Medium
**Impact**: Low
**Mitigation**: Implement redirect from `/chat` to default page
**Verification**: Test direct navigation to `/chat` URL

### Risk 3: Chat Widget Visibility
**Risk**: Chat widget may not appear on all pages
**Likelihood**: Low
**Impact**: Medium
**Mitigation**: Add to dashboard layout which wraps all authenticated pages
**Verification**: Test chat button visibility on multiple pages

### Risk 4: Authentication Integration
**Risk**: Chat widget may not have access to JWT token in layout
**Likelihood**: Low
**Impact**: High
**Mitigation**: Dashboard layout already has auth context access
**Verification**: Test chat functionality with authentication

## Best Practices Applied

1. **Separation of Concerns**: Routing logic separated from business logic (chat state)
2. **Minimal Changes**: Only modify files directly related to routing issue
3. **Graceful Degradation**: Redirect old `/chat` route instead of breaking it
4. **Stateful UI Components**: Chat overlay state managed entirely in React (no URL coupling)
5. **No Backend Changes**: All changes are frontend-only, maintaining API stability

## Success Criteria

- ✅ All router.push() calls removed from useChat hook
- ✅ Chat route removed or redirected
- ✅ ChatWidget embedded in dashboard layout
- ✅ URL never changes during chat interactions
- ✅ Conversation history persists correctly
- ✅ Chat functions as overlay on all pages
- ✅ No `/chat` route accessible
- ✅ All manual tests pass

## Next Steps

1. Implement Phase 1: Remove routing logic from useChat hook
2. Implement Phase 2: Remove/redirect chat route
3. Implement Phase 3: Embed ChatWidget in dashboard layout
4. Implement Phase 4: Update ChatWidget props (if needed)
5. Execute manual testing following quickstart guide
6. Verify all success criteria met
