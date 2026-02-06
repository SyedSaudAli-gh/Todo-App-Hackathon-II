# Tasks: Chatbot UX Polish, Layout Stability & Interaction Fixes

**Input**: Design documents from `/specs/007-chatbot-ux-polish/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, quickstart.md

**Tests**: Tests are NOT explicitly requested in the specification, so test tasks are omitted per template guidelines.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Phase III AI Agent App**: `api/src/` (backend + agent + MCP), `web/src/` (frontend + chat UI)
- This feature: Frontend-only changes in `web/src/components/`

---

## Phase 1: Setup (Verification Only)

**Purpose**: Verify existing project structure and dependencies

**Note**: This is an existing project with all infrastructure in place. Setup phase only verifies prerequisites.

- [ ] T001 [P] Verify Next.js development environment running at `web/`
- [ ] T002 [P] Verify Framer Motion installed in `web/package.json`
- [ ] T003 [P] Verify Tailwind CSS configured in `web/tailwind.config.js`
- [ ] T004 [P] Verify existing chat components in `web/src/components/chatbot/` and `web/src/components/chat/`
- [ ] T005 [P] Verify useChat hook exists in `web/src/lib/hooks/useChat.ts`
- [ ] T006 Verify chatbot functional in development environment (can open, send messages, receive responses)

**Checkpoint**: Development environment ready - user story implementation can begin

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

**Note**: Minimal foundational work required since this is frontend-only modifications to existing components.

- [ ] T007 Read and understand current ChatPanel implementation in `web/src/components/chatbot/ChatPanel.tsx`
- [ ] T008 Read and understand current ChatContainer implementation in `web/src/components/chat/ChatContainer.tsx`
- [ ] T009 Read and understand current MessageList implementation in `web/src/components/chat/MessageList.tsx`
- [ ] T010 Read and understand current MessageInput implementation in `web/src/components/chat/MessageInput.tsx`
- [ ] T011 Read and understand current LoadingIndicator implementation in `web/src/components/chat/LoadingIndicator.tsx`
- [ ] T012 Read and understand current useChat hook implementation in `web/src/lib/hooks/useChat.ts`
- [ ] T013 Document current component hierarchy and prop flow in research notes
- [ ] T014 Identify exact code locations for modifications (line numbers) per quickstart.md

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 & 4 - Stable Visibility & Explicit Close Controls (Priority: P1) 🎯 MVP

**Goal**: Fix critical usability issues - chatbot remains open during page interactions and provides clear close controls

**Why Combined**: Both P1 stories are closely related (both about close behavior) and modify the same components

**Independent Test**:
1. Open chatbot
2. Click on todo items, sidebar, page background - verify chatbot stays open
3. Verify close button visible in ChatPanel header
4. Verify close button visible in ChatContainer header
5. Click either close button - verify chatbot closes smoothly
6. Press Escape key - verify chatbot closes

### Implementation for User Stories 1 & 4

**ChatPanel.tsx Modifications** (Remove click-outside, add Escape key):

- [ ] T015 [US1] Remove click-outside handler useEffect block (lines 71-92) in `web/src/components/chatbot/ChatPanel.tsx`
- [ ] T016 [US1] Add Escape key handler useEffect in `web/src/components/chatbot/ChatPanel.tsx`
- [ ] T017 [US1] Remove onClick={onClose} from backdrop div (line 105) in `web/src/components/chatbot/ChatPanel.tsx`
- [ ] T018 [US1] Verify close button in ChatPanel header remains functional (lines 157-165)

**ChatContainer.tsx Modifications** (Add close button, pass onClose):

- [ ] T019 [P] [US4] Add onClose prop to ChatContainerProps interface in `web/src/components/chat/ChatContainer.tsx`
- [ ] T020 [P] [US4] Add X icon import from lucide-react in `web/src/components/chat/ChatContainer.tsx`
- [ ] T021 [US4] Update ChatContainer component signature to accept onClose prop in `web/src/components/chat/ChatContainer.tsx`
- [ ] T022 [US4] Add close button to ChatContainer header (next to "New Conversation" button) in `web/src/components/chat/ChatContainer.tsx`
- [ ] T023 [US4] Style close button to match ChatPanel close button styling in `web/src/components/chat/ChatContainer.tsx`

**ChatPanel.tsx Integration** (Pass onClose to ChatContainer):

- [ ] T024 [US4] Pass onClose prop to ChatContainer component in `web/src/components/chatbot/ChatPanel.tsx` (line 170)

**Verification**:

- [ ] T025 [US1] Test chatbot remains open when clicking outside (todos, sidebar, background)
- [ ] T026 [US1] Test Escape key closes chatbot
- [ ] T027 [US4] Test ChatPanel close button closes chatbot
- [ ] T028 [US4] Test ChatContainer close button closes chatbot
- [ ] T029 [US1] [US4] Test close animations smooth (300ms target)
- [ ] T030 [US1] [US4] Test rapid open/close cycles (edge case)

**Acceptance**:
- ✅ Chatbot remains open during 100% of user interactions with other page elements
- ✅ Users can identify and use close buttons within 2 seconds
- ✅ Both close buttons trigger same smooth close animation
- ✅ Escape key provides keyboard alternative to close

**Checkpoint**: At this point, User Stories 1 & 4 should be fully functional and testable independently. This is the MVP.

---

## Phase 4: User Story 2 - Visual Integration and Theme Consistency (Priority: P2)

**Goal**: Ensure chatbot visually integrates with application design system

**Independent Test**:
1. Open chatbot
2. Compare colors, borders, shadows, spacing against main application
3. Verify rounded corners consistent
4. Verify shadow matches other elevated elements
5. Verify animations smooth and match application style

### Implementation for User Story 2

**Design System Audit**:

- [ ] T031 [P] [US2] Review Tailwind theme variables in `web/src/styles/globals.css`
- [ ] T032 [P] [US2] Document color palette from existing components (Sidebar, DashboardLayout)
- [ ] T033 [P] [US2] Document spacing scale, border radius, shadow styles from design system

**ChatPanel.tsx Styling Updates**:

- [ ] T034 [US2] Replace hardcoded colors with Tailwind theme variables in `web/src/components/chatbot/ChatPanel.tsx`
- [ ] T035 [US2] Verify rounded corners use consistent values (rounded-lg, rounded-2xl) in `web/src/components/chatbot/ChatPanel.tsx`
- [ ] T036 [US2] Verify shadow uses theme values (shadow-2xl) in `web/src/components/chatbot/ChatPanel.tsx`
- [ ] T037 [US2] Verify animation timing matches 300ms target in `web/src/components/chatbot/ChatPanel.tsx`

**ChatContainer.tsx Styling Updates**:

- [ ] T038 [P] [US2] Replace hardcoded colors with Tailwind theme variables in `web/src/components/chat/ChatContainer.tsx`
- [ ] T039 [P] [US2] Ensure header styling matches application theme in `web/src/components/chat/ChatContainer.tsx`
- [ ] T040 [P] [US2] Verify button styling consistent with application buttons in `web/src/components/chat/ChatContainer.tsx`

**MessageList.tsx Styling Updates**:

- [ ] T041 [P] [US2] Verify message spacing consistent with design system in `web/src/components/chat/MessageList.tsx`
- [ ] T042 [P] [US2] Ensure background colors use theme variables in `web/src/components/chat/MessageList.tsx`

**MessageInput.tsx Styling Updates**:

- [ ] T043 [P] [US2] Verify input field styling matches application inputs in `web/src/components/chat/MessageInput.tsx`
- [ ] T044 [P] [US2] Verify button styling matches application buttons in `web/src/components/chat/MessageInput.tsx`
- [ ] T045 [P] [US2] Ensure disabled state styling clear and consistent in `web/src/components/chat/MessageInput.tsx`

**LoadingIndicator.tsx Styling Updates**:

- [ ] T046 [P] [US2] Verify loading dots and text colors use theme variables in `web/src/components/chat/LoadingIndicator.tsx`

**Verification**:

- [ ] T047 [US2] Visual comparison: chatbot colors match application theme
- [ ] T048 [US2] Visual comparison: chatbot borders and shadows match application
- [ ] T049 [US2] Visual comparison: chatbot spacing matches application
- [ ] T050 [US2] Test animations smooth across desktop, tablet, mobile viewports
- [ ] T051 [US2] Test responsive design at breakpoints (768px, 1024px, 1280px)

**Acceptance**:
- ✅ Chatbot visual elements match design system with 100% consistency
- ✅ Colors, borders, shadows verified by design review
- ✅ Chatbot animations complete smoothly within 300ms

**Checkpoint**: At this point, User Stories 1, 2, & 4 should all work independently

---

## Phase 5: User Story 3 - Clear Interaction Feedback (Priority: P3)

**Goal**: Provide clear visual feedback during chatbot interactions (loading states, tool status, user-friendly errors, auto-scroll)

**Independent Test**:
1. Send message - verify typing indicator appears
2. Trigger tool execution - verify status message ("Creating task...")
3. Verify Send button disabled during processing
4. Trigger error - verify user-friendly message (not technical error)
5. Send multiple messages - verify auto-scroll to latest
6. Test Enter sends message, Shift+Enter inserts newline

### Implementation for User Story 3

**LoadingIndicator.tsx Enhancement** (Add tool status support):

- [ ] T052 [P] [US3] Add status prop to LoadingIndicatorProps interface in `web/src/components/chat/LoadingIndicator.tsx`
- [ ] T053 [P] [US3] Update LoadingIndicator component signature to accept optional status prop in `web/src/components/chat/LoadingIndicator.tsx`
- [ ] T054 [US3] Update display text to show status if provided, otherwise "AI is thinking..." in `web/src/components/chat/LoadingIndicator.tsx`

**useChat Hook Enhancement** (Add tool execution status tracking):

- [ ] T055 [US3] Add toolExecutionStatus state to useChat hook in `web/src/lib/hooks/useChat.ts`
- [ ] T056 [US3] Create parseToolStatus function to extract tool info from messages in `web/src/lib/hooks/useChat.ts`
- [ ] T057 [US3] Update sendMessage to set toolExecutionStatus during tool execution in `web/src/lib/hooks/useChat.ts`
- [ ] T058 [US3] Clear toolExecutionStatus after tool completion (2 second delay) in `web/src/lib/hooks/useChat.ts`
- [ ] T059 [US3] Add toolExecutionStatus to useChat return value in `web/src/lib/hooks/useChat.ts`

**ChatContainer.tsx Enhancement** (Pass tool status, improve error display):

- [ ] T060 [US3] Destructure toolExecutionStatus from useChat hook in `web/src/components/chat/ChatContainer.tsx`
- [ ] T061 [US3] Pass toolExecutionStatus to LoadingIndicator component in `web/src/components/chat/ChatContainer.tsx`
- [ ] T062 [P] [US3] Create mapErrorToUserFriendly function before component in `web/src/components/chat/ChatContainer.tsx`
- [ ] T063 [US3] Update error display to use mapErrorToUserFriendly function in `web/src/components/chat/ChatContainer.tsx`
- [ ] T064 [US3] Add console.error for detailed error logging in `web/src/components/chat/ChatContainer.tsx`

**Error Message Mapping** (User-friendly error messages):

- [ ] T065 [P] [US3] Map "Network error" to "Unable to connect. Please check your internet connection." in mapErrorToUserFriendly
- [ ] T066 [P] [US3] Map "500" errors to "Something went wrong. Please try again." in mapErrorToUserFriendly
- [ ] T067 [P] [US3] Map "401" errors to "Your session has expired. Please sign in again." in mapErrorToUserFriendly
- [ ] T068 [P] [US3] Map "timeout" errors to "The request took too long. Please try again." in mapErrorToUserFriendly
- [ ] T069 [P] [US3] Add generic fallback message for unknown errors in mapErrorToUserFriendly

**MessageList.tsx Enhancement** (Improve auto-scroll stability):

- [ ] T070 [US3] Add shouldAutoScroll state to MessageList component in `web/src/components/chat/MessageList.tsx`
- [ ] T071 [US3] Add containerRef for scroll container in `web/src/components/chat/MessageList.tsx`
- [ ] T072 [US3] Create handleScroll function to track scroll position in `web/src/components/chat/MessageList.tsx`
- [ ] T073 [US3] Update auto-scroll useEffect to only scroll if shouldAutoScroll is true in `web/src/components/chat/MessageList.tsx`
- [ ] T074 [US3] Add scroll event listener useEffect in `web/src/components/chat/MessageList.tsx`
- [ ] T075 [US3] Update container div to use containerRef and onScroll handler in `web/src/components/chat/MessageList.tsx`
- [ ] T076 [US3] Update scrollIntoView to use block: 'end' for smoother scrolling in `web/src/components/chat/MessageList.tsx`

**MessageInput.tsx Verification** (Keyboard shortcuts already implemented):

- [ ] T077 [US3] Verify Enter key sends message in `web/src/components/chat/MessageInput.tsx` (lines 29-34)
- [ ] T078 [US3] Verify Shift+Enter inserts newline in `web/src/components/chat/MessageInput.tsx` (lines 29-34)
- [ ] T079 [US3] Verify Send button disabled when loading in `web/src/components/chat/MessageInput.tsx` (line 54)
- [ ] T080 [US3] Verify Send button disabled when input empty in `web/src/components/chat/MessageInput.tsx` (line 54)

**Verification**:

- [ ] T081 [US3] Test typing indicator appears when sending message
- [ ] T082 [US3] Test tool execution status displays ("Creating task...", "Updating task...")
- [ ] T083 [US3] Test Send button disabled during AI processing
- [ ] T084 [US3] Test user-friendly error messages for network errors
- [ ] T085 [US3] Test user-friendly error messages for 500 errors
- [ ] T086 [US3] Test user-friendly error messages for 401 errors
- [ ] T087 [US3] Test auto-scroll to latest message
- [ ] T088 [US3] Test auto-scroll does NOT interrupt when user scrolled up
- [ ] T089 [US3] Test Enter key sends message
- [ ] T090 [US3] Test Shift+Enter inserts newline
- [ ] T091 [US3] Test feedback appears within 500ms of interaction

**Acceptance**:
- ✅ Users receive feedback within 500ms of any interaction
- ✅ Error messages understandable to non-technical users (90% comprehension)
- ✅ 100% of keyboard interactions work as specified
- ✅ Auto-scroll stable without jank

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements and validation across all user stories

**Performance Optimization**:

- [ ] T092 [P] Verify all animations complete within 300ms using Chrome DevTools Performance tab
- [ ] T093 [P] Verify no layout shifts during chatbot open/close using Lighthouse
- [ ] T094 [P] Verify smooth 60fps animations on lower-end devices

**Accessibility Validation**:

- [ ] T095 [P] Verify keyboard navigation works (Tab, Shift+Tab, Enter, Escape)
- [ ] T096 [P] Verify ARIA labels present on all interactive elements
- [ ] T097 [P] Verify focus trap works when chatbot open
- [ ] T098 [P] Verify screen reader compatibility (test with NVDA or VoiceOver)

**Cross-Browser Testing**:

- [ ] T099 [P] Test chatbot in Chrome (latest)
- [ ] T100 [P] Test chatbot in Firefox (latest)
- [ ] T101 [P] Test chatbot in Safari (latest)
- [ ] T102 [P] Test chatbot in Edge (latest)

**Responsive Testing**:

- [ ] T103 [P] Test chatbot on mobile viewport (< 768px)
- [ ] T104 [P] Test chatbot on tablet viewport (768px - 1024px)
- [ ] T105 [P] Test chatbot on desktop viewport (> 1024px)

**Edge Case Testing**:

- [ ] T106 Test rapid open/close cycles (10+ times quickly)
- [ ] T107 Test network disconnection during message send
- [ ] T108 Test AI response timeout (> 30 seconds)
- [ ] T109 Test viewport resize while chatbot open
- [ ] T110 Test navigation to different page while chatbot open
- [ ] T111 Test session expiry during chat interaction

**Documentation**:

- [ ] T112 [P] Update quickstart.md with any implementation deviations
- [ ] T113 [P] Document any edge cases discovered during testing
- [ ] T114 [P] Create deployment checklist in quickstart.md

**Final Validation**:

- [ ] T115 Run all acceptance scenarios from spec.md
- [ ] T116 Verify all 8 success criteria met (SC-001 through SC-008)
- [ ] T117 Verify zero UI crashes during error scenarios
- [ ] T118 Conduct design review with stakeholders
- [ ] T119 Conduct accessibility audit with WCAG 2.1 AA checklist
- [ ] T120 Final code review and cleanup

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - US1 & US4 (Phase 3): Can start after Foundational - No dependencies on other stories
  - US2 (Phase 4): Can start after Foundational - No dependencies on other stories (can run parallel with Phase 3)
  - US3 (Phase 5): Can start after Foundational - No dependencies on other stories (can run parallel with Phase 3 & 4)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 & 4 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - No dependencies on other stories

**Key Insight**: All user stories are independent and can be implemented in parallel after Foundational phase completes.

### Within Each User Story

- **US1 & US4**: ChatPanel changes before ChatContainer changes (onClose prop dependency)
- **US2**: All styling tasks can run in parallel (different aspects of same components)
- **US3**: LoadingIndicator and error mapping can run in parallel; useChat hook before ChatContainer integration

### Parallel Opportunities

- **Phase 1 (Setup)**: All 6 verification tasks can run in parallel
- **Phase 2 (Foundational)**: All 8 reading tasks can run in parallel
- **Phase 3 (US1 & US4)**: T019, T020 can run in parallel; T025-T030 verification tasks can run in parallel
- **Phase 4 (US2)**: T031-T033 audit tasks in parallel; T034-T046 styling tasks in parallel; T047-T051 verification in parallel
- **Phase 5 (US3)**: T052-T054, T062, T065-T069 can run in parallel; T081-T091 verification in parallel
- **Phase 6 (Polish)**: Most tasks marked [P] can run in parallel

**Once Foundational completes, all three user story phases (3, 4, 5) can proceed in parallel if team capacity allows.**

---

## Parallel Example: User Story 1 & 4

```bash
# After Foundational phase completes, launch these in parallel:

# ChatContainer modifications (can run together):
Task T019: "Add onClose prop to ChatContainerProps interface"
Task T020: "Add X icon import from lucide-react"

# Verification tasks (can run together after implementation):
Task T025: "Test chatbot remains open when clicking outside"
Task T026: "Test Escape key closes chatbot"
Task T027: "Test ChatPanel close button closes chatbot"
Task T028: "Test ChatContainer close button closes chatbot"
Task T029: "Test close animations smooth"
Task T030: "Test rapid open/close cycles"
```

---

## Parallel Example: User Story 2

```bash
# Design system audit (can run together):
Task T031: "Review Tailwind theme variables"
Task T032: "Document color palette from existing components"
Task T033: "Document spacing scale, border radius, shadow styles"

# Styling updates (can run together - different components):
Task T034: "Replace hardcoded colors in ChatPanel.tsx"
Task T038: "Replace hardcoded colors in ChatContainer.tsx"
Task T041: "Verify message spacing in MessageList.tsx"
Task T043: "Verify input field styling in MessageInput.tsx"
Task T046: "Verify loading dots colors in LoadingIndicator.tsx"

# Verification (can run together):
Task T047: "Visual comparison: colors"
Task T048: "Visual comparison: borders and shadows"
Task T049: "Visual comparison: spacing"
Task T050: "Test animations smooth"
Task T051: "Test responsive design"
```

---

## Parallel Example: User Story 3

```bash
# Component enhancements (can run together - different files):
Task T052: "Add status prop to LoadingIndicatorProps"
Task T053: "Update LoadingIndicator component signature"
Task T062: "Create mapErrorToUserFriendly function"

# Error mappings (can run together - different error types):
Task T065: "Map Network error"
Task T066: "Map 500 errors"
Task T067: "Map 401 errors"
Task T068: "Map timeout errors"
Task T069: "Add generic fallback"

# Verification (can run together):
Task T081: "Test typing indicator"
Task T082: "Test tool execution status"
Task T083: "Test Send button disabled"
Task T084-T087: "Test error messages"
Task T088-T091: "Test auto-scroll and keyboard"
```

---

## Implementation Strategy

### MVP First (User Stories 1 & 4 Only)

1. Complete Phase 1: Setup (verify environment)
2. Complete Phase 2: Foundational (understand current code)
3. Complete Phase 3: User Stories 1 & 4 (stable visibility + close controls)
4. **STOP and VALIDATE**: Test US1 & US4 independently
5. Deploy/demo if ready

**Rationale**: US1 & US4 are both P1 and fix the most critical usability issues. This is the minimum viable improvement.

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Stories 1 & 4 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo (visual polish)
4. Add User Story 3 → Test independently → Deploy/Demo (interaction feedback)
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together (quick - just reading code)
2. Once Foundational is done:
   - Developer A: User Stories 1 & 4 (P1 - most critical)
   - Developer B: User Story 2 (P2 - visual polish)
   - Developer C: User Story 3 (P3 - feedback improvements)
3. Stories complete and integrate independently
4. Team reconvenes for Phase 6: Polish & validation

---

## Task Summary

**Total Tasks**: 120 tasks

**Task Count by Phase**:
- Phase 1 (Setup): 6 tasks
- Phase 2 (Foundational): 8 tasks
- Phase 3 (US1 & US4): 16 tasks
- Phase 4 (US2): 21 tasks
- Phase 5 (US3): 40 tasks
- Phase 6 (Polish): 29 tasks

**Task Count by User Story**:
- User Story 1 & 4 (P1): 16 tasks
- User Story 2 (P2): 21 tasks
- User Story 3 (P3): 40 tasks
- Setup/Foundational/Polish: 43 tasks

**Parallel Opportunities**:
- Phase 1: 6 tasks can run in parallel
- Phase 2: 8 tasks can run in parallel
- Phase 3: 2 tasks in parallel (T019, T020), 6 verification tasks in parallel
- Phase 4: 3 audit tasks, 13 styling tasks, 5 verification tasks can run in parallel
- Phase 5: 8 tasks in parallel (LoadingIndicator, error mapping), 11 verification tasks in parallel
- Phase 6: 20+ tasks can run in parallel

**Suggested MVP Scope**: Phase 1 + Phase 2 + Phase 3 (User Stories 1 & 4) = 30 tasks

**Estimated Completion**:
- MVP (US1 & US4): ~30 tasks
- MVP + Visual Polish (US1, US4, US2): ~51 tasks
- Full Feature (All stories): ~120 tasks

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- No tests explicitly requested in spec, so test tasks omitted per template guidelines
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Frontend-only changes - no backend, database, or API modifications
- All changes use existing infrastructure (Next.js, React, TypeScript, Tailwind, Framer Motion)
