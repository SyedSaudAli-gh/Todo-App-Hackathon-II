# Tasks: Chat-Based Frontend for Todo AI Chatbot

**Input**: Design documents from `/specs/002-chat-frontend/`
**Prerequisites**: plan.md, spec.md, research.md, contracts/components.md, contracts/api-client.md, contracts/state-management.md

**Tests**: No test tasks included - tests were not explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Frontend**: `web/src/` (Next.js App Router with TypeScript)
- **Backend**: No backend changes required (existing API from feature 001)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and ChatKit integration setup

**⚠️ CRITICAL**: Complete all setup tasks before proceeding to foundational phase

- [x] T001 [P] Install OpenAI ChatKit package in web/package.json
- [x] T002 [P] Add NEXT_PUBLIC_CHATKIT_DOMAIN_KEY to web/.env.local
- [x] T003 [P] Add NEXT_PUBLIC_API_URL to web/.env.local (if not already present)
- [x] T004 [P] Create chat directory structure: web/src/app/chat/[[...conversationId]]/
- [x] T005 [P] Create chat components directory: web/src/components/chat/
- [x] T006 [P] Create chat API client directory: web/src/lib/api/
- [x] T007 [P] Create chat hooks directory: web/src/lib/hooks/
- [x] T008 [P] Create chat types file: web/src/types/chat.ts
- [x] T009 Verify ChatKit domain key is valid and domain is in allowlist
- [x] T010 Verify backend POST /api/v1/chat endpoint is accessible

**Checkpoint**: Setup complete - foundational implementation can now begin

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### TypeScript Types

- [x] T011 [P] Define Message interface in web/src/types/chat.ts
- [x] T012 [P] Define ToolCall interface in web/src/types/chat.ts
- [x] T013 [P] Define SendMessageRequest interface in web/src/types/chat.ts
- [x] T014 [P] Define SendMessageResponse interface in web/src/types/chat.ts
- [x] T015 [P] Define ApiError interface in web/src/types/chat.ts
- [x] T016 [P] Define ConversationHistoryResponse interface in web/src/types/chat.ts

### API Client Layer

- [x] T017 [P] Implement sendMessage function in web/src/lib/api/chat.ts
- [x] T018 [P] Implement getConversationHistory function in web/src/lib/api/chat.ts
- [x] T019 [P] Implement handleApiError utility in web/src/lib/api/chat.ts
- [x] T020 [P] Implement isAuthError utility in web/src/lib/api/chat.ts
- [x] T021 Add request validation (message length, token presence) in web/src/lib/api/chat.ts
- [x] T022 Add error handling for network failures in web/src/lib/api/chat.ts
- [x] T023 Add JWT token injection in Authorization header in web/src/lib/api/chat.ts

### State Management Hook

- [x] T024 Create useChat hook skeleton in web/src/lib/hooks/useChat.ts
- [x] T025 Implement conversation state management in web/src/lib/hooks/useChat.ts
- [x] T026 Implement sendMessage action in web/src/lib/hooks/useChat.ts
- [x] T027 Implement loadConversationHistory action in web/src/lib/hooks/useChat.ts
- [x] T028 Implement optimistic UI updates in web/src/lib/hooks/useChat.ts
- [x] T029 Implement error state management in web/src/lib/hooks/useChat.ts
- [x] T030 Implement loading state management in web/src/lib/hooks/useChat.ts

### Authentication Wrapper

- [x] T031 Create authentication check logic for chat page in web/src/app/chat/[[...conversationId]]/page.tsx
- [x] T032 Implement redirect to login for unauthenticated users in web/src/app/chat/[[...conversationId]]/page.tsx
- [x] T033 Implement JWT token extraction from NextAuth session in web/src/app/chat/[[...conversationId]]/page.tsx

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 & 2 - First-Time Chat & Multi-Turn Conversation (Priority: P1) 🎯 MVP

**Goal**: Users can access chat interface, send messages, and have multi-turn conversations with AI assistant

**Independent Test**:
1. Navigate to /chat, send "Create a task to buy groceries", verify AI responds
2. Send "What tasks do I have?", verify AI lists the groceries task

**Why Combined**: US1 and US2 use identical components - US2 is just testing multi-turn flow with same implementation

### Core Components

- [x] T034 [P] [US1] Create ChatPage component in web/src/app/chat/[[...conversationId]]/page.tsx
- [x] T035 [P] [US1] Create ChatContainer component in web/src/components/chat/ChatContainer.tsx
- [x] T036 [P] [US1] Create MessageList component in web/src/components/chat/MessageList.tsx
- [x] T037 [P] [US1] Create MessageInput component in web/src/components/chat/MessageInput.tsx
- [x] T038 [P] [US1] Create LoadingIndicator component in web/src/components/chat/LoadingIndicator.tsx

### ChatPage Implementation

- [x] T039 [US1] Implement useSession hook for authentication in web/src/app/chat/[[...conversationId]]/page.tsx
- [x] T040 [US1] Implement loading state while checking auth in web/src/app/chat/[[...conversationId]]/page.tsx
- [x] T041 [US1] Extract conversationId from URL params in web/src/app/chat/[[...conversationId]]/page.tsx
- [x] T042 [US1] Pass token and conversationId to ChatContainer in web/src/app/chat/[[...conversationId]]/page.tsx

### ChatContainer Implementation

- [x] T043 [US1] Integrate useChat hook in web/src/components/chat/ChatContainer.tsx
- [x] T044 [US1] Implement message state management in web/src/components/chat/ChatContainer.tsx
- [x] T045 [US1] Implement handleSendMessage callback in web/src/components/chat/ChatContainer.tsx
- [x] T046 [US1] Implement conversation history loading on mount in web/src/components/chat/ChatContainer.tsx
- [x] T047 [US1] Implement URL update when new conversation created in web/src/components/chat/ChatContainer.tsx
- [x] T048 [US1] Connect MessageList, MessageInput, LoadingIndicator in web/src/components/chat/ChatContainer.tsx

### MessageList Implementation

- [x] T049 [US1] Implement messages array rendering in web/src/components/chat/MessageList.tsx
- [x] T050 [US1] Implement auto-scroll to bottom on new message in web/src/components/chat/MessageList.tsx
- [x] T051 [US1] Add messagesEndRef for scroll target in web/src/components/chat/MessageList.tsx

### MessageInput Implementation

- [x] T052 [US1] Implement input value state in web/src/components/chat/MessageInput.tsx
- [x] T053 [US1] Implement handleSend function with validation in web/src/components/chat/MessageInput.tsx
- [x] T054 [US1] Implement Enter key handler (Shift+Enter for newline) in web/src/components/chat/MessageInput.tsx
- [x] T055 [US1] Implement Send button with disabled state in web/src/components/chat/MessageInput.tsx
- [x] T056 [US1] Implement input clearing after successful send in web/src/components/chat/MessageInput.tsx

### LoadingIndicator Implementation

- [x] T057 [P] [US1] Implement animated loading dots in web/src/components/chat/LoadingIndicator.tsx
- [x] T058 [P] [US1] Add "AI is thinking..." text in web/src/components/chat/LoadingIndicator.tsx
- [x] T059 [P] [US1] Style with Tailwind CSS (gray background, bounce animation) in web/src/components/chat/LoadingIndicator.tsx

### Integration

- [x] T060 [US1] Test first message send creates new conversation
- [x] T061 [US1] Test conversation_id is stored and used for subsequent messages
- [x] T062 [US2] Test multi-turn conversation maintains context (send 3+ messages)
- [x] T063 [US2] Test AI understands references to previous messages ("Mark it as complete")

**Acceptance**:
- ✅ Users can send first message and receive AI response
- ✅ New conversation_id is created and stored
- ✅ Users can send multiple messages in same conversation
- ✅ AI maintains context across messages

**Checkpoint**: At this point, basic chat functionality is working - users can have conversations

---

## Phase 4: User Story 3 - Conversation Persistence Across Sessions (Priority: P2)

**Goal**: Users can refresh page or logout/login and resume conversation exactly where they left off

**Independent Test**: Send 3 messages, refresh page, verify all 3 messages are still visible and conversation continues

### URL-Based Routing

- [x] T064 [US3] Implement catch-all route [[...conversationId]] in web/src/app/chat/[[...conversationId]]/page.tsx
- [x] T065 [US3] Extract conversationId from params in ChatPage in web/src/app/chat/[[...conversationId]]/page.tsx
- [x] T066 [US3] Pass conversationId to useChat hook in web/src/components/chat/ChatContainer.tsx

### Conversation History Loading

- [x] T067 [US3] Implement conversation history fetch on mount in web/src/lib/hooks/useChat.ts
- [x] T068 [US3] Handle 404 error (conversation not found) by starting new conversation in web/src/lib/hooks/useChat.ts
- [x] T069 [US3] Convert backend message format to frontend Message type in web/src/lib/hooks/useChat.ts
- [x] T070 [US3] Set isInitialized flag after history loaded in web/src/lib/hooks/useChat.ts

### URL Updates

- [x] T071 [US3] Implement router.push to update URL when new conversation created in web/src/components/chat/ChatContainer.tsx
- [x] T072 [US3] Ensure URL format is /chat/[conversation_id] in web/src/components/chat/ChatContainer.tsx

### Integration

- [x] T073 [US3] Test page refresh preserves conversation (all messages visible)
- [x] T074 [US3] Test direct navigation to /chat/[id] loads conversation
- [x] T075 [US3] Test invalid conversation_id redirects to /chat (new conversation)
- [x] T076 [US3] Test logout/login preserves access to previous conversations

**Acceptance**:
- ✅ Page refresh loads full conversation history
- ✅ Direct URL navigation to /chat/[id] works
- ✅ Invalid conversation_id handled gracefully
- ✅ Conversations persist across logout/login

**Checkpoint**: At this point, conversations persist across sessions - users never lose their chat history

---

## Phase 5: User Story 4 - Real-Time Message Display (Priority: P2)

**Goal**: Users see messages and AI responses displayed clearly with proper formatting and visual distinction

**Independent Test**: Send message, verify it appears immediately as "user" message, then verify AI response appears as "assistant" message with different styling

### Message Component

- [x] T077 [P] [US4] Create Message component in web/src/components/chat/Message.tsx
- [x] T078 [P] [US4] Implement role-based styling (user vs assistant) in web/src/components/chat/Message.tsx
- [x] T079 [P] [US4] Implement message content display in web/src/components/chat/Message.tsx
- [x] T080 [P] [US4] Implement timestamp formatting and display in web/src/components/chat/Message.tsx
- [x] T081 [P] [US4] Add conditional ToolCallDisplay rendering in web/src/components/chat/Message.tsx

### ToolCallDisplay Component

- [x] T082 [P] [US4] Create ToolCallDisplay component in web/src/components/chat/ToolCallDisplay.tsx
- [x] T083 [P] [US4] Implement collapsible toggle button in web/src/components/chat/ToolCallDisplay.tsx
- [x] T084 [P] [US4] Implement tool call details display (name, args, result) in web/src/components/chat/ToolCallDisplay.tsx
- [x] T085 [P] [US4] Format JSON arguments and results readably in web/src/components/chat/ToolCallDisplay.tsx

### Styling and Visual Distinction

- [x] T086 [US4] Style user messages (right-aligned, blue background) in web/src/components/chat/Message.tsx
- [x] T087 [US4] Style assistant messages (left-aligned, gray background) in web/src/components/chat/Message.tsx
- [x] T088 [US4] Add max-width constraint (80% of container) in web/src/components/chat/Message.tsx
- [x] T089 [US4] Add padding, border-radius, and spacing in web/src/components/chat/Message.tsx
- [x] T090 [US4] Style timestamps (small gray text) in web/src/components/chat/Message.tsx

### Optimistic UI

- [x] T091 [US4] Implement optimistic user message display in web/src/lib/hooks/useChat.ts
- [x] T092 [US4] Generate temporary message ID for optimistic message in web/src/lib/hooks/useChat.ts
- [x] T093 [US4] Remove optimistic message on API error in web/src/lib/hooks/useChat.ts

### Integration

- [x] T094 [US4] Integrate Message component into MessageList in web/src/components/chat/MessageList.tsx
- [x] T095 [US4] Test user message appears within 100ms of clicking Send
- [x] T096 [US4] Test assistant message appears with different styling
- [x] T097 [US4] Test tool calls are displayed and collapsible
- [x] T098 [US4] Test timestamps are formatted correctly

**Acceptance**:
- ✅ User messages appear immediately with blue styling
- ✅ Assistant messages appear with gray styling
- ✅ Visual distinction is clear at a glance
- ✅ Tool calls are displayed and collapsible
- ✅ Timestamps are visible and formatted

**Checkpoint**: At this point, chat UI is polished and user-friendly with clear visual feedback

---

## Phase 6: User Story 5 - Error Handling and Recovery (Priority: P3)

**Goal**: Users receive clear error messages when something goes wrong and can recover gracefully

**Independent Test**: Disconnect network, send message, verify error message is displayed, reconnect, verify user can retry

### Error Display Component

- [x] T099 [P] [US5] Create ErrorDisplay component in web/src/components/chat/ErrorDisplay.tsx
- [x] T100 [P] [US5] Implement error message display in web/src/components/chat/ErrorDisplay.tsx
- [x] T101 [P] [US5] Add retry button for recoverable errors in web/src/components/chat/ErrorDisplay.tsx
- [x] T102 [P] [US5] Style error banner with Tailwind CSS in web/src/components/chat/ErrorDisplay.tsx

### Error Handling in API Client

- [x] T103 [US5] Implement network error handling in web/src/lib/api/chat.ts
- [x] T104 [US5] Implement 401 error detection in web/src/lib/api/chat.ts
- [x] T105 [US5] Implement 404 error handling in web/src/lib/api/chat.ts
- [x] T106 [US5] Implement 500 error handling in web/src/lib/api/chat.ts
- [x] T107 [US5] Format error messages to be user-friendly in web/src/lib/api/chat.ts

### Error Handling in useChat Hook

- [x] T108 [US5] Implement error state management in web/src/lib/hooks/useChat.ts
- [x] T109 [US5] Implement clearError action in web/src/lib/hooks/useChat.ts
- [x] T110 [US5] Handle auth errors with redirect to login in web/src/lib/hooks/useChat.ts
- [x] T111 [US5] Handle 404 errors by starting new conversation in web/src/lib/hooks/useChat.ts
- [x] T112 [US5] Remove optimistic message on error in web/src/lib/hooks/useChat.ts

### Error Handling in Components

- [x] T113 [US5] Integrate ErrorDisplay in ChatContainer in web/src/components/chat/ChatContainer.tsx
- [x] T114 [US5] Implement retry logic in ChatContainer in web/src/components/chat/ChatContainer.tsx
- [x] T115 [US5] Disable MessageInput during error state in web/src/components/chat/MessageInput.tsx
- [x] T116 [US5] Show loading spinner during auth check in web/src/app/chat/[[...conversationId]]/page.tsx

### Integration

- [x] T117 [US5] Test network error displays "Connection failed" message
- [x] T118 [US5] Test 401 error redirects to login page
- [x] T119 [US5] Test 404 error starts new conversation
- [x] T120 [US5] Test 500 error displays "AI assistant unavailable" message
- [x] T121 [US5] Test retry button sends message again successfully
- [x] T122 [US5] Test error message clears when new message sent

**Acceptance**:
- ✅ Network errors display clear message
- ✅ Auth errors redirect to login
- ✅ Server errors display user-friendly message
- ✅ Users can retry failed messages
- ✅ Errors don't break conversation state

**Checkpoint**: At this point, error handling is robust and user-friendly

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements and validation

- [x] T123 [P] Add loading skeleton for conversation history in web/src/components/chat/MessageList.tsx
- [x] T124 [P] Implement message content sanitization (XSS prevention) in web/src/components/chat/Message.tsx
- [x] T125 [P] Add "New Conversation" button in web/src/components/chat/ChatContainer.tsx
- [x] T126 [P] Implement message truncation for very long messages (>1000 chars) in web/src/components/chat/Message.tsx
- [x] T127 [P] Add mobile-responsive styling with Tailwind CSS breakpoints across all components
- [x] T128 [P] Add aria-labels for accessibility in web/src/components/chat/MessageInput.tsx
- [x] T129 Verify all environment variables are documented in web/.env.example
- [x] T130 Update quickstart.md with final configuration and testing instructions
- [x] T131 Run manual testing checklist from quickstart.md
- [x] T132 Verify all success criteria from spec.md are met

**Checkpoint**: Feature complete and ready for demo

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories 1 & 2 (Phase 3)**: Depends on Foundational phase completion
- **User Story 3 (Phase 4)**: Depends on Phase 3 completion (needs basic chat working)
- **User Story 4 (Phase 5)**: Depends on Phase 3 completion (needs basic chat working)
- **User Story 5 (Phase 6)**: Depends on Phase 3 completion (needs basic chat working)
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **User Stories 1 & 2 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 3 (P2)**: Can start after Phase 3 - Requires basic chat functionality
- **User Story 4 (P2)**: Can start after Phase 3 - Requires basic chat functionality (can run parallel with US3)
- **User Story 5 (P3)**: Can start after Phase 3 - Requires basic chat functionality (can run parallel with US3/US4)

### Within Each User Story

- Core components before integration
- API client and hooks before components
- Basic functionality before styling
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Phase 3 completes, US3, US4, and US5 can be worked on in parallel (if team capacity allows)
- All component creation tasks marked [P] within a phase can run in parallel
- Styling tasks marked [P] can run in parallel

---

## Parallel Example: User Story 1 & 2

```bash
# Launch all core components together:
Task: "Create ChatPage component in web/src/app/chat/[[...conversationId]]/page.tsx"
Task: "Create ChatContainer component in web/src/components/chat/ChatContainer.tsx"
Task: "Create MessageList component in web/src/components/chat/MessageList.tsx"
Task: "Create MessageInput component in web/src/components/chat/MessageInput.tsx"
Task: "Create LoadingIndicator component in web/src/components/chat/LoadingIndicator.tsx"
```

---

## Implementation Strategy

### MVP First (User Stories 1 & 2 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Stories 1 & 2
4. **STOP and VALIDATE**: Test basic chat functionality
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Stories 1 & 2 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 3 → Test independently → Deploy/Demo
4. Add User Story 4 → Test independently → Deploy/Demo
5. Add User Story 5 → Test independently → Deploy/Demo
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Phase 3 is done:
   - Developer A: User Story 3 (Persistence)
   - Developer B: User Story 4 (Display)
   - Developer C: User Story 5 (Error Handling)
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- No test tasks included (not requested in spec)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Backend API already exists - no backend changes needed
- ChatKit domain key must be configured before testing
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
