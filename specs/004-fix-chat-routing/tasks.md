# Tasks: Chat UI Routing Fix

**Input**: Design documents from `/specs/004-fix-chat-routing/`
**Prerequisites**: plan.md (complete), spec.md (complete), research.md (complete), quickstart.md (complete)

**Tests**: No test tasks included - tests not explicitly requested in feature specification. Manual testing will be performed using quickstart.md guide.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Phase II Web App**: `web/src/` (frontend only - no backend changes)
- This is a frontend-only bugfix with no backend, database, or API changes

---

## Phase 1: Setup (Not Required)

**Status**: ✅ SKIPPED - Existing project with all infrastructure in place

This is a bugfix on an existing Phase II web application. No setup tasks required.

---

## Phase 2: Foundational (Not Required)

**Status**: ✅ SKIPPED - No blocking prerequisites for this bugfix

This bugfix has no foundational dependencies. All user stories can proceed immediately.

**Checkpoint**: Foundation ready - user story implementation can begin immediately

---

## Phase 3: User Story 1 - Prevent Unintended Navigation (Priority: P1) 🎯 MVP

**Goal**: Remove all router navigation calls from chat components so that chat interactions (opening, sending messages, closing) never change the browser URL.

**Independent Test**: Open `/dashboard/todos`, click chat button, send multiple messages, verify URL never changes from `/dashboard/todos`.

**Acceptance Criteria**:
- Chat opens without URL change
- Sending messages does not change URL
- Multiple messages in sequence do not change URL
- URL remains stable across all chat interactions
- No navigation visible in browser address bar

### Implementation for User Story 1

- [x] T001 [US1] Remove `useRouter` import from `web/src/lib/hooks/useChat.ts`
- [x] T002 [US1] Remove `const router = useRouter()` declaration from `web/src/lib/hooks/useChat.ts`
- [x] T003 [US1] Remove `router.push('/chat')` call on line 87 (404 error handler) in `web/src/lib/hooks/useChat.ts`
- [x] T004 [US1] Remove `router.push(\`/chat/${response.conversation_id}\`)` call on line 126 (after first message) in `web/src/lib/hooks/useChat.ts`
- [x] T005 [US1] Remove `router.push('/chat')` call on line 163 (conversation reset) in `web/src/lib/hooks/useChat.ts`
- [x] T006 [US1] Update `resetConversation` function to not navigate (remove router.push or entire function if unused) in `web/src/lib/hooks/useChat.ts`
- [x] T007 [US1] Verify conversation ID is still passed to backend API in request body (no code change needed, just verification)
- [ ] T008 [US1] Test: Open `/dashboard/todos`, click chat button, verify URL remains `/dashboard/todos`
- [ ] T009 [US1] Test: Send message "Hello", verify URL remains `/dashboard/todos`
- [ ] T010 [US1] Test: Send 5 messages in sequence, verify URL never changes

**Checkpoint**: At this point, User Story 1 should be fully functional - chat interactions no longer cause URL navigation

---

## Phase 4: User Story 2 - Chat as Overlay Component (Priority: P2)

**Goal**: Ensure chat functions as an overlay component (not a full-page route) by removing or redirecting the `/chat` page route.

**Independent Test**: Navigate directly to `/chat` in browser, verify it redirects to `/dashboard/todos` instead of rendering a full-page chat.

**Acceptance Criteria**:
- Chat appears as overlay on top of current page
- Underlying page content still visible when chat is open
- No full-page `/chat` route accessible
- Direct navigation to `/chat` redirects to default page
- Chat closes without navigation when clicking outside or pressing Escape

### Implementation for User Story 2

- [x] T011 [P] [US2] Review `web/src/components/chatbot/ChatPanel.tsx` for any routing logic (verify no router.push calls)
- [x] T012 [P] [US2] Review `web/src/lib/hooks/useChatWidget.ts` for any routing logic (verify no router.push calls)
- [x] T013 [US2] Replace content of `web/src/app/chat/[[...conversationId]]/page.tsx` with redirect to `/dashboard/todos`
- [ ] T014 [US2] Verify `ChatWidget` component renders as overlay (modal/panel) not full-page (visual inspection)
- [ ] T015 [US2] Test: Navigate to `/chat` directly, verify redirect to `/dashboard/todos`
- [ ] T016 [US2] Test: Open chat on any page, verify underlying page content still visible
- [ ] T017 [US2] Test: Click outside chat area, verify chat closes without navigation
- [ ] T018 [US2] Test: Press Escape key with chat open, verify chat closes without navigation

**Checkpoint**: At this point, User Stories 1 AND 2 should both work - chat is overlay-only with no full-page route

---

## Phase 5: User Story 3 - Persistent Chat Access (Priority: P3)

**Goal**: Embed ChatWidget in dashboard layout so the floating chat button is accessible on all authenticated pages.

**Independent Test**: Navigate between `/dashboard/todos`, `/dashboard/profile`, and other dashboard pages, verify floating chat button remains visible and in same position.

**Acceptance Criteria**:
- Floating chat button visible on all authenticated pages
- Button positioned consistently (bottom-right corner)
- Button remains visible when navigating between pages
- Chat remains closed when navigating between pages
- Button positioned appropriately on mobile devices

### Implementation for User Story 3

- [x] T019 [US3] Read `web/src/app/dashboard/layout.tsx` to understand current structure
- [x] T020 [US3] Import `ChatWidgetWrapper` component in `web/src/app/dashboard/layout.tsx`
- [x] T021 [US3] Add `<ChatWidgetWrapper token={jwtToken} />` to dashboard layout JSX in `web/src/app/dashboard/layout.tsx`
- [x] T022 [US3] Verify JWT token is available in dashboard layout context (check auth integration)
- [x] T023 [US3] Review `web/src/components/chatbot/ChatWidget.tsx` to ensure it works without URL-based conversationId prop
- [x] T024 [US3] Review `web/src/components/chatbot/ChatWidgetWrapper.tsx` to ensure no routing logic present
- [ ] T025 [US3] Test: Navigate to `/dashboard/todos`, verify floating chat button visible
- [ ] T026 [US3] Test: Navigate to `/dashboard/profile`, verify floating chat button visible in same position
- [ ] T027 [US3] Test: Navigate between multiple dashboard pages, verify button remains visible
- [ ] T028 [US3] Test: Open chat on one page, close it, navigate to another page, verify chat remains closed
- [ ] T029 [US3] Test: Open chat on mobile device, verify button positioned appropriately

**Checkpoint**: All user stories should now be independently functional - chat is fully integrated as overlay component

---

## Phase 6: Testing & Verification

**Purpose**: Comprehensive manual testing following quickstart.md guide to verify all success criteria met

- [ ] T030 Execute Test 1 from quickstart.md: Chat Opens Without Navigation
- [ ] T031 Execute Test 2 from quickstart.md: Sending Messages Without Navigation
- [ ] T032 Execute Test 3 from quickstart.md: Multiple Messages Without Navigation
- [ ] T033 Execute Test 4 from quickstart.md: Chat Works on Different Pages
- [ ] T034 Execute Test 5 from quickstart.md: Chat Route Redirect
- [ ] T035 Execute Test 6 from quickstart.md: Browser Navigation
- [ ] T036 Execute Test 7 from quickstart.md: Chat Closes Without Navigation
- [ ] T037 Execute Test 8 from quickstart.md: Page Refresh Preserves Conversation
- [ ] T038 Verify Success Criterion SC-001: 100% of chat interactions occur without URL change
- [ ] T039 Verify Success Criterion SC-002: Full conversation (5+ messages) without navigation
- [ ] T040 Verify Success Criterion SC-003: Browser back/forward buttons work correctly
- [ ] T041 Verify Success Criterion SC-004: Chat overlay opens/closes in under 300ms
- [ ] T042 Verify Success Criterion SC-005: Floating button visible on 100% of authenticated pages
- [ ] T043 Verify Success Criterion SC-006: Zero instances of navigation to `/chat` route
- [ ] T044 Verify Success Criterion SC-007: Works identically on desktop, tablet, mobile
- [ ] T045 Verify Success Criterion SC-008: Navigation between pages preserves conversation history
- [ ] T046 Document any issues found during testing in GitHub issue or bug report
- [ ] T047 Mark feature as complete if all tests pass and success criteria met

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: ✅ SKIPPED - Existing project
- **Foundational (Phase 2)**: ✅ SKIPPED - No blocking prerequisites
- **User Story 1 (Phase 3)**: Can start immediately - No dependencies
- **User Story 2 (Phase 4)**: Can start after US1 complete (recommended) or in parallel
- **User Story 3 (Phase 5)**: Can start after US1 complete (recommended) or in parallel
- **Testing (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: No dependencies - Can start immediately
- **User Story 2 (P2)**: Independent of US1 but recommended to complete US1 first (routing logic must be removed before verifying overlay behavior)
- **User Story 3 (P3)**: Independent of US1/US2 but recommended to complete US1 first (routing logic must be removed before embedding in layout)

### Within Each User Story

- **US1**: Tasks T001-T006 can be done together (all modify same file), then T007 verification, then T008-T010 testing
- **US2**: Tasks T011-T012 are parallel reviews, T013 is implementation, T014-T018 are testing
- **US3**: T019 is prerequisite for T020-T021, T022-T024 are parallel reviews, T025-T029 are testing

### Parallel Opportunities

- Tasks T011 and T012 (US2 reviews) can run in parallel
- Tasks T022, T023, T024 (US3 reviews) can run in parallel
- User Stories 2 and 3 can be worked on in parallel after US1 is complete
- All testing tasks within a phase can be executed in parallel if multiple testers available

---

## Parallel Example: User Story 1

```bash
# All modifications to useChat.ts can be done in one editing session:
Task: "Remove useRouter import, router declaration, and all 3 router.push() calls from web/src/lib/hooks/useChat.ts"

# Then run tests sequentially:
Task: "Test chat opens without navigation"
Task: "Test sending messages without navigation"
Task: "Test multiple messages without navigation"
```

---

## Parallel Example: User Story 2

```bash
# Launch review tasks in parallel:
Task: "Review ChatPanel.tsx for routing logic"
Task: "Review useChatWidget.ts for routing logic"

# Then implement redirect:
Task: "Replace chat page with redirect logic"

# Then run tests:
Task: "Test all overlay behaviors"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 3: User Story 1 (Remove routing logic)
2. **STOP and VALIDATE**: Test US1 independently using T008-T010
3. Verify chat works without URL navigation
4. Deploy/demo if ready (core bug fixed)

### Incremental Delivery

1. Complete User Story 1 → Test independently → Core bug fixed! 🎯
2. Add User Story 2 → Test independently → Overlay behavior verified
3. Add User Story 3 → Test independently → Full integration complete
4. Execute Phase 6 testing → Comprehensive validation
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Developer A: Complete User Story 1 (T001-T010)
2. Once US1 is done:
   - Developer B: User Story 2 (T011-T018)
   - Developer C: User Story 3 (T019-T029)
3. All developers: Phase 6 testing together (T030-T047)

---

## Task Summary

**Total Tasks**: 47
- User Story 1 (P1): 10 tasks (T001-T010)
- User Story 2 (P2): 8 tasks (T011-T018)
- User Story 3 (P3): 11 tasks (T019-T029)
- Testing & Verification: 18 tasks (T030-T047)

**Parallel Opportunities**: 5 tasks marked [P]
- T011, T012 (US2 reviews)
- T019 (US3 read layout)
- T022, T023, T024 (US3 reviews)

**Independent Test Criteria**:
- US1: Chat interactions never change URL
- US2: No full-page `/chat` route accessible
- US3: Floating button visible on all authenticated pages

**Suggested MVP Scope**: User Story 1 only (T001-T010) - fixes core navigation bug

---

## Notes

- [P] tasks = different files, no dependencies, can run in parallel
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- No automated tests requested - manual testing per quickstart.md
- Commit after each user story completion
- Stop at any checkpoint to validate story independently
- Frontend-only changes - no backend, database, or API modifications
- No new dependencies required - uses existing React hooks and Next.js routing
