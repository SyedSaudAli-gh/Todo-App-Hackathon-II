# Tasks: Chat History & Header UX

**Input**: Design documents from `/specs/008-chat-history-ux/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Tests are NOT explicitly requested in the specification, so test tasks are OPTIONAL and marked accordingly.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Phase III AI Agent App**: `api/src/` (backend + agent + MCP), `web/src/` (frontend + chat UI)
- Backend: FastAPI in `api/src/`
- Frontend: Next.js in `web/src/`

---

## Phase 1: Setup (Verify Existing Infrastructure)

**Purpose**: Verify existing Phase III chat infrastructure is operational

**Note**: Infrastructure is 80% complete. This phase verifies what exists rather than creating from scratch.

- [x] T001 Verify database models exist: Conversation and Message in `api/src/models/`
- [x] T002 Verify ConversationService exists with core methods in `api/src/services/conversation.py`
- [x] T003 Verify existing chat endpoint POST /api/v1/chat in `api/src/routers/chat.py`
- [x] T004 Verify ChatContainer component exists in `web/src/components/chat/ChatContainer.tsx`
- [x] T005 Verify useChat hook exists in `web/src/lib/hooks/useChat.ts`
- [ ] T006 Run existing backend tests to confirm infrastructure works: `pytest api/tests/`
- [ ] T007 Run existing frontend tests to confirm UI works: `npm test` in `web/`

**Checkpoint**: Existing infrastructure verified and operational ✅

---

## Phase 2: Foundational (Backend Extensions)

**Purpose**: Extend existing backend services with conversation history methods

**⚠️ CRITICAL**: These backend extensions MUST be complete before ANY user story frontend work can begin

### Backend Service Extensions

- [x] T008 [P] Extend ConversationService with `get_user_conversations()` method in `api/src/services/conversation.py`
- [x] T009 [P] Extend ConversationService with `get_conversation_messages()` method in `api/src/services/conversation.py`
- [x] T010 [P] Add ConversationSummary Pydantic schema in `api/src/schemas/chat.py`
- [x] T011 [P] Add MessageListResponse Pydantic schema in `api/src/schemas/chat.py`
- [x] T012 [P] Add ConversationListResponse Pydantic schema in `api/src/schemas/chat.py`

### Backend API Endpoints

- [x] T013 Implement GET /api/v1/chat/conversations endpoint in `api/src/routers/chat.py`
- [x] T014 Implement GET /api/v1/chat/conversations/{conversation_id}/messages endpoint in `api/src/routers/chat.py`
- [x] T015 Implement POST /api/v1/chat/conversations endpoint in `api/src/routers/chat.py`
- [x] T016 Add authentication validation to all new endpoints in `api/src/routers/chat.py`
- [x] T017 Add pagination support (limit, offset) to conversation list endpoint
- [x] T018 Add error handling for 404 (conversation not found) and 401 (unauthorized)

### Backend Testing (OPTIONAL)

- [ ] T019 [P] Write API tests for GET /conversations in `api/tests/test_api/test_chat_history.py`
- [ ] T020 [P] Write API tests for GET /conversations/{id}/messages in `api/tests/test_api/test_chat_history.py`
- [ ] T021 [P] Write API tests for POST /conversations in `api/tests/test_api/test_chat_history.py`
- [ ] T022 [P] Write service tests for conversation history methods in `api/tests/test_services/test_conversation_history.py`

**Checkpoint**: Backend API ready - frontend implementation can now begin in parallel

---

## Phase 3: User Story 1 - View Conversation History (Priority: P1) 🎯 MVP

**Goal**: Users can view a list of their past conversations and click to load any conversation

**Independent Test**: Create 3 conversations, close chatbot, reopen, click History button, verify all 3 conversations displayed with preview text, click one conversation, verify messages load

### Frontend API Client

- [x] T023 [P] [US1] Add `getConversations()` function in `web/src/lib/api/chat.ts`
- [x] T024 [P] [US1] Add `getConversationMessages()` function in `web/src/lib/api/chat.ts`
- [x] T025 [P] [US1] Add TypeScript types for Conversation and ConversationSummary in `web/src/types/chat.ts`

### Frontend State Management

- [x] T026 [US1] Create `useChatHistory` hook in `web/src/lib/hooks/useChatHistory.ts`
- [x] T027 [US1] Add state: conversations array, isLoading, error in `useChatHistory`
- [x] T028 [US1] Add method: fetchConversations() in `useChatHistory`
- [x] T029 [US1] Add method: refreshConversations() in `useChatHistory`
- [x] T030 [US1] Extend `useChat` hook with isHistoryOpen state in `web/src/lib/hooks/useChat.ts`
- [x] T031 [US1] Extend `useChat` hook with toggleHistory() method in `web/src/lib/hooks/useChat.ts`
- [x] T032 [US1] Extend `useChat` hook with loadConversation(id) method in `web/src/lib/hooks/useChat.ts`

### Frontend Components

- [x] T033 [P] [US1] Create HistoryPanel component in `web/src/components/chat/HistoryPanel.tsx`
- [x] T034 [P] [US1] Create ConversationList component in `web/src/components/chat/ConversationList.tsx`
- [x] T035 [P] [US1] Create ConversationItem component in `web/src/components/chat/ConversationItem.tsx`
- [x] T036 [US1] Add History button to ChatContainer header in `web/src/components/chat/ChatContainer.tsx`
- [x] T037 [US1] Integrate HistoryPanel into ChatContainer in `web/src/components/chat/ChatContainer.tsx`
- [x] T038 [US1] Add slide-in animation for HistoryPanel using Tailwind transitions
- [x] T039 [US1] Add empty state message for no conversations in HistoryPanel
- [x] T040 [US1] Add loading skeleton for conversation list in HistoryPanel
- [x] T041 [US1] Highlight active conversation in ConversationList
- [x] T042 [US1] Display preview text (first 100 chars of last message) in ConversationItem
- [x] T043 [US1] Display timestamp in ConversationItem with relative time (e.g., "2 hours ago")

### Integration

- [ ] T044 [US1] Test: Click History button → panel opens with conversation list
- [ ] T045 [US1] Test: Click conversation → messages load in chat area
- [ ] T046 [US1] Test: Empty state displays when user has no conversations
- [ ] T047 [US1] Test: Loading state displays while fetching conversations
- [ ] T048 [US1] Test: Error handling for network failures

### Frontend Testing (OPTIONAL)

- [ ] T049 [P] [US1] Write component tests for HistoryPanel in `web/tests/unit/components/HistoryPanel.test.tsx`
- [ ] T050 [P] [US1] Write component tests for ConversationList in `web/tests/unit/components/ConversationList.test.tsx`
- [ ] T051 [P] [US1] Write hook tests for useChatHistory in `web/tests/unit/hooks/useChatHistory.test.ts`

**Acceptance Criteria**:
- ✅ User with 3 conversations sees all 3 in history panel with timestamps/preview
- ✅ Clicking conversation loads full message history
- ✅ Empty state displays for users with no conversations

**Checkpoint**: User Story 1 complete - users can view and load conversation history

---

## Phase 4: User Story 2 - Start New Conversation (Priority: P1)

**Goal**: Users can start a fresh conversation without losing previous conversation history

**Independent Test**: Have active conversation with 5 messages, click "New Chat", verify chat clears, send new message, verify new conversation created, check history to confirm old conversation still exists

### Frontend API Client

- [x] T052 [P] [US2] Add `createConversation()` function in `web/src/lib/api/chat.ts`

### Frontend State Management

- [x] T053 [US2] Extend `useChat` hook with createNewConversation() method in `web/src/lib/hooks/useChat.ts`
- [x] T054 [US2] Add logic to clear messages array when new conversation starts
- [x] T055 [US2] Add logic to update currentConversationId when new conversation created

### Frontend Components

- [x] T056 [US2] Add "New Chat" button to ChatContainer header in `web/src/components/chat/ChatContainer.tsx`
- [x] T057 [US2] Connect "New Chat" button to createNewConversation() method
- [ ] T058 [US2] Add confirmation dialog if user has unsaved input (OPTIONAL enhancement)
- [x] T059 [US2] Show empty state in chat area after clicking "New Chat"

### Integration

- [ ] T060 [US2] Test: Click "New Chat" → chat area clears
- [ ] T061 [US2] Test: Send message after "New Chat" → new conversation created
- [ ] T062 [US2] Test: Check history → old conversation still exists
- [ ] T063 [US2] Test: New conversation appears in history after first message sent

### Frontend Testing (OPTIONAL)

- [ ] T064 [P] [US2] Write integration tests for new conversation flow in `web/tests/integration/new-conversation.test.ts`

**Acceptance Criteria**:
- ✅ Clicking "New Chat" clears chat area
- ✅ Sending message after "New Chat" creates new conversation
- ✅ Previous conversations remain in history unchanged

**Checkpoint**: User Story 2 complete - users can start new conversations

---

## Phase 5: User Story 5 - Conversation Persistence Across Sessions (Priority: P1)

**Goal**: Conversation history persists across browser sessions and page refreshes

**Independent Test**: Create 3 conversations, close browser, reopen application, sign in, verify all 3 conversations still available

**Note**: This functionality already exists via database persistence. This phase verifies and documents it.

### Verification Tasks

- [ ] T065 [US5] Verify conversations persist in database after page refresh
- [ ] T066 [US5] Verify messages persist in database after browser close
- [ ] T067 [US5] Verify user_id scoping prevents cross-user conversation visibility
- [ ] T068 [US5] Test: Create conversation → refresh page → conversation still exists
- [ ] T069 [US5] Test: Create conversation → close browser → reopen → sign in → conversation still exists
- [ ] T070 [US5] Test: User A cannot see User B's conversations

### Documentation

- [ ] T071 [US5] Document persistence behavior in `specs/008-chat-history-ux/quickstart.md`

**Acceptance Criteria**:
- ✅ Conversations survive page refresh
- ✅ Conversations survive browser close/reopen
- ✅ User only sees their own conversations

**Checkpoint**: User Story 5 verified - persistence works across sessions

---

## Phase 6: User Story 3 - Clean Header Navigation (Priority: P2)

**Goal**: Clean, uncluttered chatbot header with clear navigation controls

**Independent Test**: Open chatbot, verify header shows "AI Todo Assistant" title, History button, New Chat button, and Close (❌) button with no duplicate elements

### Frontend Components

- [x] T072 [P] [US3] Create ChatHeader component in `web/src/components/chat/ChatHeader.tsx`
- [x] T073 [US3] Add "AI Todo Assistant" title to ChatHeader
- [x] T074 [US3] Add History button to ChatHeader with icon
- [x] T075 [US3] Add New Chat button to ChatHeader with icon
- [x] T076 [US3] Add Close (❌) button to ChatHeader with icon
- [x] T077 [US3] Remove "✕ New Conversation ✕" text from ChatContainer in `web/src/components/chat/ChatContainer.tsx`
- [x] T078 [US3] Replace existing header in ChatContainer with new ChatHeader component
- [x] T079 [US3] Style header with Tailwind CSS consistent with site theme
- [x] T080 [US3] Add responsive design for mobile (stack buttons on small screens)
- [x] T081 [US3] Add ARIA labels for accessibility (aria-label="Close chat", etc.)
- [x] T082 [US3] Add hover states for all buttons

### Integration

- [ ] T083 [US3] Test: Header displays exactly 4 elements (title + 3 buttons)
- [ ] T084 [US3] Test: No "✕ New Conversation ✕" text visible
- [ ] T085 [US3] Test: All buttons are clickable and functional
- [ ] T086 [US3] Test: Header is responsive on mobile devices

### Frontend Testing (OPTIONAL)

- [ ] T087 [P] [US3] Write component tests for ChatHeader in `web/tests/unit/components/ChatHeader.test.tsx`
- [ ] T088 [P] [US3] Write visual regression tests for header in `web/tests/e2e/chat-header.spec.ts`

**Acceptance Criteria**:
- ✅ Header shows "AI Todo Assistant", History, New Chat, Close buttons
- ✅ No "✕ New Conversation ✕" text visible
- ✅ Single close button (❌) only

**Checkpoint**: User Story 3 complete - clean header navigation

---

## Phase 7: User Story 4 - Persistent Chatbot State (Priority: P2)

**Goal**: Chatbot remains open when clicking outside, only closes via Close button

**Independent Test**: Open chatbot, click outside chatbot window, verify it remains open, click Close button, verify it closes

### Frontend Behavior Changes

- [x] T089 [US4] Remove click-outside event listener from ChatContainer in `web/src/components/chat/ChatContainer.tsx`
- [x] T090 [US4] Verify Close button still closes chatbot
- [x] T091 [US4] Add Escape key handler to close chatbot (accessibility)
- [x] T092 [US4] Add focus trap within chatbot (Tab cycles through interactive elements)
- [ ] T093 [US4] Ensure focus returns to trigger button when chatbot closes

### Integration

- [ ] T094 [US4] Test: Click outside chatbot → chatbot remains open
- [ ] T095 [US4] Test: Click Close button → chatbot closes
- [ ] T096 [US4] Test: Press Escape key → chatbot closes
- [ ] T097 [US4] Test: Tab key cycles through chatbot elements only
- [ ] T098 [US4] Test: Focus returns to trigger button after close

### Frontend Testing (OPTIONAL)

- [ ] T099 [P] [US4] Write E2E tests for click-outside behavior in `web/tests/e2e/chatbot-state.spec.ts`

**Acceptance Criteria**:
- ✅ Clicking outside chatbot does NOT close it
- ✅ Clicking Close button closes chatbot
- ✅ Escape key closes chatbot (accessibility)

**Checkpoint**: User Story 4 complete - persistent chatbot state

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

### UX Enhancements

- [x] T100 [P] Add smooth transitions (300ms) for all UI state changes
- [x] T101 [P] Add loading skeletons for conversation list and messages
- [x] T102 [P] Implement optimistic UI updates for new conversations
- [ ] T103 [P] Add error toast notifications for API failures
- [ ] T104 [P] Add retry logic for failed API requests

### Performance Optimization

- [ ] T105 [P] Implement conversation list pagination (load more button)
- [ ] T106 [P] Add message virtualization for conversations with 100+ messages
- [ ] T107 [P] Optimize database queries with proper indexes (verify existing indexes)
- [ ] T108 [P] Add caching for conversation list in sessionStorage

### JSON Filtering (Server-Side)

- [x] T109 Verify tool_calls are stored separately from message_text in `api/src/services/conversation.py`
- [x] T110 Verify message_text contains only conversational text (no JSON)
- [x] T111 Test: Send message with tool calls → verify UI shows only conversational text

### Documentation

- [ ] T112 [P] Update API documentation (OpenAPI/Swagger) with new endpoints
- [ ] T113 [P] Update README with conversation history feature description
- [ ] T114 [P] Create user guide for conversation history in `docs/user-guide.md`

### Code Quality

- [x] T115 [P] Run linter on all modified files (backend and frontend)
- [x] T116 [P] Run type checker on TypeScript files: `npm run type-check`
- [ ] T117 [P] Review and refactor any duplicate code
- [ ] T118 [P] Add JSDoc comments to new functions and components

### Final Validation

- [ ] T119 Run all backend tests: `pytest api/tests/`
- [ ] T120 Run all frontend tests: `npm test` in `web/`
- [ ] T121 Run E2E tests for complete user flows
- [ ] T122 Verify all 10 success criteria from spec.md
- [ ] T123 Run quickstart.md validation steps
- [ ] T124 Performance test: Verify conversation list loads in <2s
- [ ] T125 Performance test: Verify conversation switch completes in <3s

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup verification - BLOCKS all user story frontend work
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - US1 (P1): View History - Can start after Foundational
  - US2 (P1): New Conversation - Can start after Foundational (may integrate with US1)
  - US5 (P1): Persistence - Can verify after Foundational (already exists)
  - US3 (P2): Clean Header - Can start after Foundational (independent)
  - US4 (P2): Persistent State - Can start after Foundational (independent)
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

- **US1 (P1)**: Independent - no dependencies on other stories
- **US2 (P1)**: May integrate with US1 (New Chat button in same header) but independently testable
- **US5 (P1)**: Independent - verification only, no implementation
- **US3 (P2)**: Independent - header redesign doesn't affect other stories
- **US4 (P2)**: Independent - click-outside behavior doesn't affect other stories

### Within Each User Story

**Backend-First Pattern**:
1. Backend API endpoints (Phase 2)
2. Frontend API client
3. Frontend state management
4. Frontend components
5. Integration testing

**Parallel Opportunities Within Stories**:
- API client functions marked [P] can run in parallel
- Components marked [P] can run in parallel
- Tests marked [P] can run in parallel

### Parallel Opportunities Across Stories

Once Foundational (Phase 2) completes:
- US1, US2, US3, US4, US5 can all be worked on in parallel by different developers
- Each story is independently testable
- Stories can be deployed incrementally

---

## Parallel Example: User Story 1

```bash
# After Foundational phase completes, launch these in parallel:

# API Client (different files, no dependencies)
Task T023: "Add getConversations() function in web/src/lib/api/chat.ts"
Task T024: "Add getConversationMessages() function in web/src/lib/api/chat.ts"
Task T025: "Add TypeScript types in web/src/types/chat.ts"

# Components (different files, no dependencies)
Task T033: "Create HistoryPanel component in web/src/components/chat/HistoryPanel.tsx"
Task T034: "Create ConversationList component in web/src/components/chat/ConversationList.tsx"
Task T035: "Create ConversationItem component in web/src/components/chat/ConversationItem.tsx"
```

---

## Implementation Strategy

### MVP First (P1 Stories Only)

1. Complete Phase 1: Setup (verify infrastructure)
2. Complete Phase 2: Foundational (backend extensions) - CRITICAL
3. Complete Phase 3: US1 (View History)
4. Complete Phase 4: US2 (New Conversation)
5. Complete Phase 5: US5 (Verify Persistence)
6. **STOP and VALIDATE**: Test all P1 stories independently
7. Deploy/demo MVP

### Incremental Delivery

1. Foundation ready (Phase 1-2) → Backend API ready
2. Add US1 → Test independently → Users can view history
3. Add US2 → Test independently → Users can start new chats
4. Verify US5 → Test independently → Persistence confirmed
5. Add US3 → Test independently → Clean header
6. Add US4 → Test independently → Persistent state
7. Polish (Phase 8) → Production ready

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together (Phase 1-2)
2. Once Foundational is done:
   - Developer A: US1 (View History)
   - Developer B: US2 (New Conversation) + US5 (Verify Persistence)
   - Developer C: US3 (Clean Header) + US4 (Persistent State)
3. Stories complete and integrate independently
4. Team completes Polish together (Phase 8)

---

## Task Summary

**Total Tasks**: 125 tasks

**By Phase**:
- Phase 1 (Setup): 7 tasks
- Phase 2 (Foundational): 15 tasks (7 optional tests)
- Phase 3 (US1 - View History): 29 tasks (3 optional tests)
- Phase 4 (US2 - New Conversation): 13 tasks (1 optional test)
- Phase 5 (US5 - Persistence): 7 tasks
- Phase 6 (US3 - Clean Header): 16 tasks (2 optional tests)
- Phase 7 (US4 - Persistent State): 11 tasks (1 optional test)
- Phase 8 (Polish): 27 tasks

**Parallel Opportunities**: 45 tasks marked [P] can run in parallel within their phase

**Independent Stories**: All 5 user stories can be implemented and tested independently after Foundational phase

**MVP Scope**: Phases 1-5 (US1, US2, US5 - all P1 stories) = 71 tasks

---

## Notes

- [P] tasks = different files, no dependencies within phase
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Tests are OPTIONAL (not explicitly requested in spec)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Existing infrastructure is 80% complete - focus on extensions, not rebuilds
