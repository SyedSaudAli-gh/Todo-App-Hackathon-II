# Tasks: Chatbot UI Improvements and Connection Fix

**Input**: Design documents from `/specs/003-chatbot-ui-bugfix/`
**Prerequisites**: plan.md (required), spec.md (required for user stories)

**Tests**: Tests are NOT explicitly requested in the specification, so test tasks are excluded.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Phase III AI Agent App**: `api/src/` (backend + agent + MCP), `web/src/` (frontend + chat UI)
- This feature focuses primarily on `web/src/` with minimal `api/src/` changes

---

## Phase 1: Setup (Minimal - Most Infrastructure Exists)

**Purpose**: Install new dependencies and verify existing infrastructure

**Note**: Most infrastructure already exists from previous features. This phase only adds what's needed for ChatKit integration.

- [X] T001 [P] Verify OpenAI ChatKit is installed in `web/package.json` (@openai/chatkit-react)
- [X] T002 [P] Install ChatKit if missing: `npm install @openai/chatkit-react` in `web/`
- [X] T003 [P] Verify Framer Motion is installed in `web/package.json` (for animations)
- [X] T004 [P] Install Framer Motion if missing: `npm install framer-motion` in `web/`
- [X] T005 [P] Create chatbot components directory: `web/src/components/chatbot/`
- [X] T006 [P] Create ChatKit configuration directory: `web/src/lib/chatkit/`
- [X] T007 [P] Create chat icon directory: `web/public/icons/`
- [X] T008 Verify existing chat infrastructure in `web/src/components/chat/` and `web/src/lib/api/chat.ts`
- [X] T009 Verify backend chat API is functional at `api/src/routers/chat.py`
- [X] T010 Verify environment variables in `web/.env.local` and `api/.env`

**Checkpoint**: Dependencies installed, directories created, existing infrastructure verified

---

## Phase 2: Foundational (Research & Design)

**Purpose**: Research connection issues and design ChatKit integration before implementation

**⚠️ CRITICAL**: No user story work can begin until research and design are complete

### Research Tasks (from plan.md Phase 0)

- [ ] T011 [R1] Investigate connection error root cause by reviewing existing ChatKit implementation in `web/src/components/chat/`
- [ ] T012 [R1] Verify API endpoint configuration in `web/.env.local` (NEXT_PUBLIC_API_URL)
- [ ] T013 [R1] Review CORS configuration in `api/.env` (CORS_ORIGINS) and `api/src/main.py`
- [ ] T014 [R1] Verify JWT token generation in `web/src/app/api/token/route.ts`
- [ ] T015 [R1] Inspect browser network tab for failed requests and document findings
- [ ] T016 [R1] Document connection error root cause and solution in `specs/003-chatbot-ui-bugfix/research.md`
- [ ] T017 [P] [R2] Research ChatKit API adapter pattern for non-OpenAI backends
- [ ] T018 [P] [R2] Research ChatKit configuration options and custom styling
- [ ] T019 [P] [R2] Research ChatKit component architecture and state management
- [ ] T020 [P] [R2] Document ChatKit integration patterns in `specs/003-chatbot-ui-bugfix/research.md`
- [ ] T021 [P] [R3] Research floating button positioning strategies and z-index management
- [ ] T022 [P] [R3] Research modal vs. slide-out panel patterns and animations
- [ ] T023 [P] [R3] Research accessibility requirements (focus trap, Escape key, ARIA)
- [ ] T024 [P] [R3] Document floating widget UI patterns in `specs/003-chatbot-ui-bugfix/research.md`
- [ ] T025 [P] [R4] Validate frontend environment variables in `web/.env.local`
- [ ] T026 [P] [R4] Validate backend environment variables in `api/.env`
- [ ] T027 [P] [R4] Document required environment configuration in `specs/003-chatbot-ui-bugfix/research.md`

### Design Tasks (from plan.md Phase 1)

- [ ] T028 [D1] Document component architecture in `specs/003-chatbot-ui-bugfix/quickstart.md`
- [ ] T029 [D1] Define component hierarchy (ChatWidget → FloatingChatButton + ChatPanel)
- [ ] T030 [D1] Define state management approach (useChatWidget hook)
- [ ] T031 [D1] Define integration points (ChatKit adapter, authentication, error handling)
- [ ] T032 [D2] Create ChatKit API adapter contract in `specs/003-chatbot-ui-bugfix/contracts/chatkit-integration.md`
- [ ] T033 [D2] Define API adapter interface (sendMessage, getConversationHistory, handleError)
- [ ] T034 [D2] Define request/response formats for FastAPI backend
- [ ] T035 [D2] Define error handling patterns and authentication flow
- [ ] T036 [D3] Document floating button design in `specs/003-chatbot-ui-bugfix/quickstart.md`
- [ ] T037 [D3] Document chat panel design (desktop slide-out, mobile full-screen)
- [ ] T038 [D3] Define responsive breakpoints (mobile < 768px, tablet 768-1024px, desktop > 1024px)
- [ ] T039 [D3] Define accessibility requirements (focus trap, Escape key, ARIA labels)
- [ ] T040 [D4] Document message styling design in `specs/003-chatbot-ui-bugfix/quickstart.md`
- [ ] T041 [D4] Define user vs. assistant message styling (alignment, colors, borders)
- [ ] T042 [D4] Define message metadata and loading state design

**Checkpoint**: Research complete, design documented, ready for implementation

---

## Phase 3: User Story 1 - Reliable Chat Connection (Priority: P1) 🎯 MVP

**Goal**: Fix "Connection failed" errors to make chatbot functional

**Independent Test**: Open chat interface, send message "Hello", receive AI response within 5 seconds without connection errors

**Acceptance Scenarios**:
1. User sends message → message sent successfully → AI response received within 5 seconds
2. User on slow network → loading indicator appears → message eventually sends without errors
3. Multiple messages in quick succession → all processed in order without failures
4. Deployed environment → chat works identically to local environment

### Connection Fix Implementation

- [X] T043 [US1] Fix API base URL configuration in `web/src/lib/api/client.ts` based on research findings
- [X] T044 [US1] Update CORS_ORIGINS in `api/.env` to include Vercel deployment domain
- [X] T045 [US1] Validate CORS middleware configuration in `api/src/main.py`
- [X] T046 [US1] Fix JWT token passing to chat API in `web/src/lib/api/chat.ts`
- [X] T047 [US1] Validate API response format compatibility with existing chat code
- [X] T048 [US1] Update error handling in `web/src/lib/api/chat.ts` to show user-friendly messages
- [ ] T049 [US1] Test connection on local environment (localhost:3000 → localhost:8001)
- [ ] T050 [US1] Test connection on deployed environment (Vercel → Railway/Render)
- [ ] T051 [US1] Verify no "Connection failed" errors appear during normal usage
- [ ] T052 [US1] Verify messages are persisted in database (check Neon PostgreSQL)

**Checkpoint**: Connection errors fixed, chat functional on local and deployed environments

---

## Phase 4: User Story 2 - Modern Chat Interface (Priority: P2)

**Goal**: Create clean, professional chat interface with clear message distinction

**Independent Test**: Open chat interface, visually inspect message layout, colors, spacing - interface appears modern and professional

**Acceptance Scenarios**:
1. Chat window appears modern with clean typography and professional color scheme
2. User messages visually distinct from assistant messages (alignment, background, styling)
3. Conversation flow easy to follow with clear visual hierarchy
4. Mobile device → interface adapts responsively and remains usable
5. Tablet/desktop → interface uses space effectively without appearing cramped

### ChatKit Integration

- [X] T053 [P] [US2] Create ChatKit API adapter in `web/src/lib/chatkit/adapter.ts`
- [X] T054 [P] [US2] Implement sendMessage function in ChatKit adapter
- [X] T055 [P] [US2] Implement getConversationHistory function in ChatKit adapter
- [X] T056 [P] [US2] Implement error handling in ChatKit adapter
- [X] T057 [US2] Create ChatKit configuration in `web/src/lib/chatkit/config.ts`
- [X] T058 [US2] Configure ChatKit with custom API adapter
- [X] T059 [US2] Configure ChatKit authentication (JWT token injection)

### Message Styling

- [X] T060 [P] [US2] Create MessageBubble component in `web/src/components/chatbot/MessageBubble.tsx`
- [X] T061 [P] [US2] Style user messages (right-aligned, blue background, white text, rounded corners)
- [X] T062 [P] [US2] Style assistant messages (left-aligned, light gray background, dark text, rounded corners)
- [X] T063 [P] [US2] Add message metadata (timestamp, avatar, status indicator)
- [X] T064 [P] [US2] Create loading indicator component (three animated dots)
- [X] T065 [US2] Create custom ChatKit styles in `web/src/styles/chatkit-custom.css`
- [X] T066 [US2] Apply Tailwind CSS classes for responsive design

### Chat Panel Refactoring

- [ ] T067 [US2] Refactor ChatContainer in `web/src/components/chat/ChatContainer.tsx` to use ChatKit
- [ ] T068 [US2] Replace MessageList with ChatKit built-in message list
- [ ] T069 [US2] Replace MessageInput with ChatKit built-in input
- [ ] T070 [US2] Keep existing LoadingIndicator component
- [ ] T071 [US2] Update useChat hook in `web/src/lib/hooks/useChat.ts` for ChatKit compatibility
- [ ] T072 [US2] Test message rendering (user vs. assistant distinction)
- [ ] T073 [US2] Test responsive design on mobile (320px width)
- [ ] T074 [US2] Test responsive design on tablet (768px width)
- [ ] T075 [US2] Test responsive design on desktop (1920px width)

**Checkpoint**: Modern chat interface implemented, messages visually distinct, responsive design working

---

## Phase 5: User Story 3 - Floating Chat Widget (Priority: P3)

**Goal**: Implement bottom-right floating button with modal/slide-out panel

**Independent Test**: Navigate to any page, click floating button, chat opens in modal/slide-out panel, click outside or press Escape to close

**Acceptance Scenarios**:
1. Page loads → floating chat button appears in bottom-right corner
2. Click button → chat interface opens in modal/slide-out panel from right
3. Click outside or press close button → chat closes, floating button remains
4. Mobile device → chat takes full screen without overlapping critical UI
5. Navigate between pages → floating button remains consistently positioned

### Floating Button Component

- [ ] T076 [P] [US3] Create FloatingChatButton component in `web/src/components/chatbot/FloatingChatButton.tsx`
- [ ] T077 [P] [US3] Style floating button (fixed bottom-right, 56px mobile, 64px desktop)
- [ ] T078 [P] [US3] Add chat icon to `web/public/icons/chat-icon.svg`
- [ ] T079 [P] [US3] Add hover effect (scale 1.1, shadow increase)
- [ ] T080 [P] [US3] Set z-index to 1000 (above content, below modals)
- [ ] T081 [US3] Implement onClick handler to open chat widget

### Chat Widget Container

- [ ] T082 [P] [US3] Create ChatWidget component in `web/src/components/chatbot/ChatWidget.tsx`
- [ ] T083 [P] [US3] Implement open/close state management
- [ ] T084 [P] [US3] Create useChatWidget hook in `web/src/lib/hooks/useChatWidget.ts`
- [ ] T085 [US3] Implement click-outside-to-close functionality
- [ ] T086 [US3] Implement Escape key handler to close widget
- [ ] T087 [US3] Hide FloatingChatButton when widget is open

### Chat Panel Component

- [ ] T088 [P] [US3] Create ChatPanel component in `web/src/components/chatbot/ChatPanel.tsx`
- [ ] T089 [P] [US3] Wrap ChatKit component in ChatPanel
- [ ] T090 [P] [US3] Style desktop/tablet slide-out panel (400px width, 600px height, slide from right)
- [ ] T091 [P] [US3] Style mobile full-screen modal (100vw width, 100vh height, slide from bottom)
- [ ] T092 [US3] Implement slide-in animation (300ms ease-out) using Framer Motion
- [ ] T093 [US3] Implement slide-out animation (300ms ease-out)
- [ ] T094 [US3] Add close button to chat panel header

### Accessibility Implementation

- [ ] T095 [P] [US3] Implement focus trap (Tab cycles within chat panel when open)
- [ ] T096 [P] [US3] Add ARIA labels ("Open chat", "Close chat", "Chat panel")
- [ ] T097 [P] [US3] Ensure all interactive elements accessible via keyboard
- [ ] T098 [US3] Test keyboard navigation (Tab, Enter, Escape)

### Global Integration

- [ ] T099 [US3] Add ChatWidget to root layout in `web/src/app/layout.tsx`
- [ ] T100 [US3] Ensure widget appears on all pages
- [ ] T101 [US3] Test widget persistence across page navigation
- [ ] T102 [US3] Test responsive behavior on mobile (< 768px)
- [ ] T103 [US3] Test responsive behavior on tablet (768px - 1024px)
- [ ] T104 [US3] Test responsive behavior on desktop (> 1024px)
- [ ] T105 [US3] Verify widget doesn't overlap critical UI elements

**Checkpoint**: Floating chat widget implemented, accessible, responsive, works across all pages

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements and validation

- [X] T106 [P] Update existing chat page route in `web/src/app/chat/[[...conversationId]]/page.tsx` to use new components
- [ ] T107 [P] Remove or deprecate old chat components if fully replaced by ChatKit
- [X] T108 [P] Add loading states for all chat operations
- [X] T109 [P] Add error recovery mechanisms (retry button, clear error)
- [ ] T110 [P] Optimize ChatKit initialization for faster load times
- [X] T111 [P] Add smooth scroll to latest message
- [X] T112 [P] Handle empty message prevention (disable send button)
- [ ] T113 [P] Handle offline state (queue messages, show offline indicator)
- [ ] T114 [P] Handle long conversations (efficient scrolling, pagination if needed)
- [X] T115 Code cleanup and remove unused imports
- [X] T116 Update documentation in `specs/003-chatbot-ui-bugfix/quickstart.md` with final implementation notes
- [ ] T117 Verify all success criteria from spec.md are met
- [ ] T118 Final end-to-end testing on local environment
- [ ] T119 Final end-to-end testing on deployed environment
- [ ] T120 Performance validation (load time < 2s, smooth animations)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational completion - MVP priority
- **User Story 2 (Phase 4)**: Depends on Foundational completion - Can start after US1 or in parallel
- **User Story 3 (Phase 5)**: Depends on Foundational completion AND User Story 2 (needs ChatKit integration)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Independent - Can start after Foundational
- **User Story 2 (P2)**: Independent - Can start after Foundational (but logically after US1 for connection to work)
- **User Story 3 (P3)**: Depends on User Story 2 (needs ChatKit components to wrap in floating widget)

### Within Each User Story

- **US1**: Connection fixes are sequential (diagnose → fix → test)
- **US2**: ChatKit adapter and styling tasks can run in parallel, then integration
- **US3**: Button and panel components can be built in parallel, then integrated

### Parallel Opportunities

- **Phase 1**: All setup tasks (T001-T010) can run in parallel
- **Phase 2 Research**: R2, R3, R4 can run in parallel after R1 completes
- **Phase 2 Design**: All design tasks (T028-T042) can run in parallel after research
- **Phase 4 (US2)**: ChatKit adapter (T053-T056), message styling (T060-T064), and custom CSS (T065-T066) can run in parallel
- **Phase 5 (US3)**: FloatingChatButton (T076-T081), useChatWidget hook (T084), and ChatPanel styling (T088-T094) can run in parallel
- **Phase 6**: Most polish tasks (T106-T114) can run in parallel

---

## Parallel Example: User Story 2 (Modern Chat Interface)

```bash
# Launch ChatKit integration tasks in parallel:
Task: "Create ChatKit API adapter in web/src/lib/chatkit/adapter.ts"
Task: "Implement sendMessage function in ChatKit adapter"
Task: "Implement getConversationHistory function in ChatKit adapter"
Task: "Implement error handling in ChatKit adapter"

# Launch message styling tasks in parallel:
Task: "Create MessageBubble component in web/src/components/chatbot/MessageBubble.tsx"
Task: "Style user messages (right-aligned, blue background, white text, rounded corners)"
Task: "Style assistant messages (left-aligned, light gray background, dark text, rounded corners)"
Task: "Add message metadata (timestamp, avatar, status indicator)"
Task: "Create loading indicator component (three animated dots)"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T010)
2. Complete Phase 2: Foundational - Research & Design (T011-T042)
3. Complete Phase 3: User Story 1 - Connection Fix (T043-T052)
4. **STOP and VALIDATE**: Test connection on local and deployed environments
5. Deploy/demo if connection is stable

**MVP Deliverable**: Functional chatbot with reliable connection (no UI improvements yet)

### Incremental Delivery

1. **Foundation**: Setup + Research & Design → Ready for implementation
2. **MVP (US1)**: Connection fix → Test independently → Deploy/Demo
3. **Enhanced UI (US2)**: Modern interface → Test independently → Deploy/Demo
4. **Full Feature (US3)**: Floating widget → Test independently → Deploy/Demo
5. **Polished (Phase 6)**: Final improvements → Deploy/Demo

### Parallel Team Strategy

With multiple developers:

1. **Team completes Setup + Foundational together** (T001-T042)
2. **Once Foundational is done**:
   - Developer A: User Story 1 (T043-T052) - Priority
   - Developer B: Start User Story 2 research/prep (can't fully implement until US1 connection works)
3. **After US1 complete**:
   - Developer A: User Story 3 (T076-T105)
   - Developer B: User Story 2 (T053-T075)
4. **After US2 & US3 complete**:
   - Team: Polish together (T106-T120)

---

## Task Summary

- **Total Tasks**: 120
- **Setup Tasks**: 10 (T001-T010)
- **Foundational Tasks**: 32 (T011-T042)
  - Research: 17 tasks
  - Design: 15 tasks
- **User Story 1 Tasks**: 10 (T043-T052) - Connection Fix
- **User Story 2 Tasks**: 23 (T053-T075) - Modern UI
- **User Story 3 Tasks**: 30 (T076-T105) - Floating Widget
- **Polish Tasks**: 15 (T106-T120)

**Parallel Opportunities**: 45+ tasks marked [P] can run in parallel within their phase

**MVP Scope**: Phase 1 + Phase 2 + Phase 3 (52 tasks) = Functional chatbot with reliable connection

---

## Notes

- [P] tasks = different files, no dependencies, can run in parallel
- [Story] label maps task to specific user story for traceability
- [R#] label = Research task from plan.md Phase 0
- [D#] label = Design task from plan.md Phase 1
- Each user story should be independently completable and testable
- Tests are NOT included (not requested in specification)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Focus on US1 first (MVP) - connection must work before UI improvements make sense
