# Implementation Plan: Chat-Based Frontend for Todo AI Chatbot

**Branch**: `002-chat-frontend` | **Date**: 2026-02-02 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-chat-frontend/spec.md`

## Summary

Build a chat-based frontend interface using OpenAI ChatKit that enables users to interact with the AI-powered todo assistant through natural language. The frontend integrates with the existing stateless backend (POST /api/v1/chat), maintains conversation continuity across sessions, and provides clear visual feedback for user and AI messages. All conversation state is persisted via backend - no local storage used.

**Technical Approach**: Integrate OpenAI ChatKit library with Next.js App Router, configure ChatKit domain key and allowlist, implement authentication-gated chat page, manage conversation_id state in React, and display messages with visual distinction between user and assistant roles.

## Technical Context

**Project Type**: Phase III Full-Stack Web Application (Frontend Extension)

### Phase III Frontend Chat Integration

**Chat UI Layer** (NEW):
- Chat Framework: OpenAI ChatKit (MANDATORY)
- Integration: ChatKit React components
- Configuration: Domain key, domain allowlist
- Message Display: User vs assistant styling
- State Management: conversation_id in React state (not localStorage)

**Frontend Stack** (Existing - Extended):
- Framework: Next.js 15+ with App Router
- UI Library: React 19+ with hooks
- Language: TypeScript 5+ (strict mode)
- Styling: Tailwind CSS 3+ (for custom styling around ChatKit)
- Authentication: NextAuth with JWT tokens
- HTTP Client: fetch API for backend communication
- Deployment: Vercel

**Backend Integration** (Existing - No Changes):
- Endpoint: POST /api/v1/chat
- Request: `{conversation_id?: UUID, message: string}`
- Response: `{conversation_id: UUID, response: string, tool_calls: array, timestamp: datetime}`
- Authentication: JWT token in Authorization header

**Performance Goals**:
- Page load: <2 seconds to display chat interface
- Message send: <100ms to display user message in UI
- AI response: <5 seconds total (including backend processing)
- Conversation load: <2 seconds to fetch and display history

**Constraints**:
- MUST use OpenAI ChatKit (no custom chat UI)
- NO local storage of conversation state (localStorage/sessionStorage)
- ALL messages persisted via backend API
- ChatKit domain key required (environment variable)
- Domain must be in ChatKit allowlist
- NextAuth JWT token required for API calls

**Scale/Scope**:
- Single conversation per page load
- Support 50+ messages per conversation
- Handle 100+ conversations per user
- Mobile-responsive (but desktop-first for hackathon)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Phase III Requirements

- ✅ Uses approved frontend stack (Next.js, React, TypeScript, Tailwind)
- ✅ ChatKit integration (user-specified constraint)
- ✅ NextAuth for authentication (existing)
- ✅ API-first architecture (Frontend → Backend API → Database)
- ✅ No local state storage (stateless frontend for conversation data)
- ✅ Backend API already exists (POST /api/v1/chat from feature 001)
- ✅ No manual coding (Claude generates all code)

### Phase II Requirements (Maintained)

- ✅ Uses approved technology stack (Next.js, TypeScript, Tailwind)
- ✅ Frontend-backend separation (API calls only, no direct DB access)
- ✅ Proper error handling and validation
- ✅ Authentication required for chat access

**Existing Architecture Review**:
- ✅ Backend POST /api/v1/chat endpoint exists and functional
- ✅ NextAuth authentication configured
- ✅ JWT token available in frontend session
- ✅ Conversation and message models exist in backend

## Project Structure

### Documentation (this feature)

```text
specs/002-chat-frontend/
├── spec.md                  # ✅ Complete (feature specification)
├── plan.md                  # ✅ This file (implementation plan)
├── research.md              # Phase 0 output (ChatKit integration research)
├── quickstart.md            # Phase 1 output (setup guide)
├── contracts/               # Phase 1 output (component contracts)
│   └── components.md        # Component specifications
├── checklists/
│   └── requirements.md      # ✅ Complete (spec quality checklist)
└── tasks.md                 # Phase 2 output (/sp.tasks command)
```

### Source Code (repository root)

```text
web/                                    # Next.js frontend (EXISTING + NEW)
├── src/
│   ├── app/
│   │   ├── chat/                      # ⚠️ NEW (chat page)
│   │   │   ├── page.tsx              # Chat interface page
│   │   │   └── layout.tsx            # Chat layout (if needed)
│   │   ├── dashboard/                 # ✅ Exists
│   │   └── auth/                      # ✅ Exists (NextAuth)
│   ├── components/
│   │   ├── chat/                      # ⚠️ NEW (chat components)
│   │   │   ├── ChatContainer.tsx     # Main chat container with ChatKit
│   │   │   ├── MessageList.tsx       # Message display component
│   │   │   ├── MessageInput.tsx      # Input field component
│   │   │   └── LoadingIndicator.tsx  # Loading state component
│   │   └── ui/                        # ✅ Exists (shadcn/ui components)
│   ├── lib/
│   │   ├── api/
│   │   │   └── chat.ts                # ⚠️ NEW (chat API client)
│   │   └── hooks/
│   │       └── useChat.ts             # ⚠️ NEW (chat state management hook)
│   └── types/
│       └── chat.ts                    # ⚠️ NEW (TypeScript types for chat)
├── public/                            # ✅ Exists
├── package.json                       # ⚠️ UPDATE (add ChatKit dependency)
└── .env.local                         # ⚠️ UPDATE (add CHATKIT_DOMAIN_KEY)

api/                                    # FastAPI backend (NO CHANGES)
├── src/
│   ├── routers/
│   │   └── chat.py                    # ✅ Exists (POST /chat endpoint)
│   ├── models/
│   │   ├── conversation.py            # ✅ Exists
│   │   └── message.py                 # ✅ Exists
│   └── ai/
│       └── orchestrator.py            # ✅ Exists
```

**Structure Decision**: Frontend-only feature extending existing Next.js application. Backend already complete from feature 001-ai-todo-chatbot. New chat page and components added to `web/src/app/chat/` and `web/src/components/chat/`.

## Complexity Tracking

No constitution violations. All requirements align with Phase III principles.

---

## Phase 0: Research & Technology Validation

**Objective**: Resolve all technical unknowns about ChatKit integration and validate approach.

### Research Tasks

#### R1: OpenAI ChatKit Integration
**Question**: How to integrate OpenAI ChatKit with Next.js App Router and React 19?

**Research Areas**:
- ChatKit npm package installation and setup
- ChatKit React component API
- Domain key configuration
- Domain allowlist setup in ChatKit dashboard
- Message format requirements (user vs assistant)
- Styling and customization options
- TypeScript type definitions

**Expected Outcome**: ChatKit integration pattern with Next.js App Router

#### R2: Stateless Frontend Architecture
**Question**: How to maintain conversation continuity without local storage?

**Research Areas**:
- conversation_id management in React state
- Fetching conversation history on page load
- Handling page refresh without losing conversation
- URL-based conversation routing (e.g., /chat/[conversation_id])
- Session storage alternatives (if any allowed)

**Expected Outcome**: State management pattern for stateless chat frontend

#### R3: Backend API Integration
**Question**: How to integrate with existing POST /api/v1/chat endpoint?

**Research Areas**:
- Request format: `{conversation_id?: UUID, message: string}`
- Response format: `{conversation_id: UUID, response: string, tool_calls: array, timestamp: datetime}`
- JWT token authentication with NextAuth
- Error handling for API failures
- Loading states during API calls

**Expected Outcome**: API client implementation pattern

#### R4: Message Display and Formatting
**Question**: How to display user vs assistant messages with visual distinction?

**Research Areas**:
- ChatKit message rendering
- Custom styling for user vs assistant messages
- Displaying tool call information
- Timestamp formatting
- Auto-scroll to latest message
- Loading indicators

**Expected Outcome**: Message display component pattern

#### R5: Authentication Flow
**Question**: How to protect chat page with NextAuth and pass JWT to backend?

**Research Areas**:
- NextAuth session management in App Router
- Protected route patterns
- JWT token extraction from session
- Token refresh handling
- Redirect to login if unauthenticated

**Expected Outcome**: Authentication integration pattern

### Research Output

**Deliverable**: `specs/002-chat-frontend/research.md`

**Format**:
```markdown
# Research: Chat-Based Frontend

## R1: OpenAI ChatKit Integration
- **Decision**: [Integration approach]
- **Rationale**: [Why this approach]
- **Alternatives Considered**: [Other options]
- **Code Example**: [Integration snippet]

## R2: Stateless Frontend Architecture
[Same format]

## R3: Backend API Integration
[Same format]

## R4: Message Display and Formatting
[Same format]

## R5: Authentication Flow
[Same format]
```

---

## Phase 1: Design & Contracts

**Prerequisites**: `research.md` complete with all decisions documented

### D1: Component Specifications

**Objective**: Define all React components with props, state, and behavior.

**Deliverable**: `specs/002-chat-frontend/contracts/components.md`

**Content**:
- ChatContainer component (main chat interface)
- MessageList component (displays messages)
- MessageInput component (user input field)
- LoadingIndicator component (loading states)
- Component props and TypeScript interfaces
- State management patterns
- Event handlers

**Validation**:
- All components from spec.md Phase III Frontend Components section
- Props and state clearly defined
- Interactions documented

### D2: API Client Contract

**Objective**: Define TypeScript API client for backend communication.

**Deliverable**: `specs/002-chat-frontend/contracts/api-client.md`

**Content**:
- sendMessage function signature
- getConversationHistory function signature (if needed)
- Request/response TypeScript types
- Error handling patterns
- Authentication token injection

**Validation**:
- Matches backend POST /api/v1/chat contract
- TypeScript types align with backend schemas
- Error cases documented

### D3: State Management Design

**Objective**: Define how conversation state is managed in React.

**Deliverable**: `specs/002-chat-frontend/contracts/state-management.md`

**Content**:
- conversation_id state management
- messages array state
- isLoading state
- error state
- Custom hook design (useChat)

**Validation**:
- No local storage used
- State persisted via backend only
- Page refresh handled correctly

### D4: Quickstart Guide

**Objective**: Document setup and configuration for local development.

**Deliverable**: `specs/002-chat-frontend/quickstart.md`

**Content**:
- Environment variable setup (CHATKIT_DOMAIN_KEY)
- ChatKit domain allowlist configuration
- npm package installation
- Development server startup
- Testing instructions

**Validation**:
- All environment variables documented
- Step-by-step setup instructions
- Verification commands included

---

## Phase 2: Implementation Readiness

**Prerequisites**: All Phase 1 artifacts complete and validated

### Validation Checklist

- [ ] research.md complete with all 5 research tasks resolved
- [ ] contracts/components.md complete with all component specifications
- [ ] contracts/api-client.md complete with API client design
- [ ] contracts/state-management.md complete with state patterns
- [ ] quickstart.md complete with setup instructions
- [ ] Constitution Check re-validated (no violations)
- [ ] All design decisions documented with rationale
- [ ] Performance targets defined and achievable
- [ ] Security considerations addressed (authentication, token handling)

### Next Steps

After Phase 2 validation passes:

1. **Run `/sp.tasks`** to generate atomic task breakdown from this plan
2. **Review tasks.md** for completeness and dependency order
3. **Begin implementation** following component-by-component approach
4. **Track progress** through task completion
5. **Validate against spec** at each milestone

### Implementation Order (High-Level)

1. **Setup**: Install ChatKit, configure environment variables
2. **Authentication**: Protect chat route with NextAuth
3. **API Client**: Implement chat API client with JWT authentication
4. **Components**: Build ChatContainer, MessageList, MessageInput
5. **State Management**: Implement useChat hook for conversation state
6. **Integration**: Connect components to API client
7. **Styling**: Apply Tailwind CSS for visual distinction
8. **Testing**: Manual testing of all user stories
9. **Documentation**: Update quickstart with final configuration

---

## Risk Assessment

### High-Priority Risks

**R1: ChatKit Domain Key Configuration**
- **Risk**: ChatKit domain key may not work or domain not in allowlist
- **Mitigation**: Test ChatKit setup early; verify domain allowlist configuration
- **Impact**: High (blocks entire feature)

**R2: Stateless Frontend Complexity**
- **Risk**: Managing conversation_id without local storage may be complex
- **Mitigation**: Use URL-based routing (/chat/[conversation_id]) or React state with careful refresh handling
- **Impact**: Medium (affects user experience)

**R3: NextAuth Token Expiration**
- **Risk**: JWT token may expire during active chat session
- **Mitigation**: Implement token refresh logic; handle 401 errors gracefully
- **Impact**: Medium (affects long chat sessions)

### Medium-Priority Risks

**R4: ChatKit Customization Limitations**
- **Risk**: ChatKit may not support all desired customizations
- **Mitigation**: Research ChatKit styling options early; accept some limitations
- **Impact**: Low (cosmetic issues only)

**R5: Message Display Performance**
- **Risk**: Large conversation histories may slow down UI
- **Mitigation**: Implement virtual scrolling or pagination if needed
- **Impact**: Low (only affects very long conversations)

---

## Success Criteria Mapping

| Success Criterion (from spec.md) | Implementation Component | Validation Method |
|----------------------------------|-------------------------|-------------------|
| SC-001: Full task workflow via chat | ChatContainer + API integration | Manual testing of create/list/update/delete |
| SC-002: <2s conversation load | API client + MessageList | Performance testing with 20-message conversation |
| SC-003: <100ms user message display | MessageInput + optimistic UI | UI responsiveness testing |
| SC-004: <5s AI response | Backend processing (existing) | End-to-end timing tests |
| SC-005: 100% message retention on refresh | State management + API client | Refresh testing with conversation history |
| SC-006: Visual distinction user/assistant | MessageList styling | Visual inspection |
| SC-007: 100% error message display | Error handling in all components | Error scenario testing |
| SC-008: Authentication scoping | NextAuth + JWT token | Multi-user testing |
| SC-009: ChatKit integration works | ChatKit configuration | Domain key and allowlist verification |
| SC-010: 95% interaction success rate | All components | Load testing with multiple users |

---

## Appendix: Technology Stack Summary

### Required Dependencies (package.json updates)

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "typescript": "^5.0.0",
    "@openai/chatkit": "^1.0.0",  // NEW: ChatKit library
    "next-auth": "^4.24.0",        // Existing
    "tailwindcss": "^3.0.0"        // Existing
  }
}
```

### Environment Variables

```bash
# Existing (maintained)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
NEXT_PUBLIC_API_URL=http://localhost:8000

# NEW: ChatKit Configuration
NEXT_PUBLIC_CHATKIT_DOMAIN_KEY=chatkit-domain-key-here
```

### ChatKit Configuration Steps

1. Obtain ChatKit domain key from OpenAI
2. Add domain to ChatKit allowlist (e.g., localhost:3000, your-app.vercel.app)
3. Configure domain key in environment variables
4. Test ChatKit integration with simple message

---

## Plan Completion

This implementation plan is complete and ready for task breakdown via `/sp.tasks`.

**Next Command**: `/sp.tasks` to generate atomic task list from this plan.
