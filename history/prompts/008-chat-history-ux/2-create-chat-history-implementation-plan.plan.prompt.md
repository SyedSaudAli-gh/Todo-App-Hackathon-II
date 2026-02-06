---
id: 2
title: Create Chat History Implementation Plan
stage: plan
date: 2026-02-05
surface: agent
model: claude-sonnet-4-5
feature: 008-chat-history-ux
branch: 008-chat-history-ux
user: user
command: /sp.plan
labels: ["phase-iii", "chat", "history", "ux", "planning"]
links:
  spec: specs/008-chat-history-ux/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/008-chat-history-ux/plan.md
  - specs/008-chat-history-ux/research.md
  - specs/008-chat-history-ux/data-model.md
  - specs/008-chat-history-ux/quickstart.md
  - specs/008-chat-history-ux/contracts/get-conversations.yaml
  - specs/008-chat-history-ux/contracts/get-messages.yaml
  - specs/008-chat-history-ux/contracts/create-conversation.yaml
tests:
  - Constitution check passed (all Phase III requirements satisfied)
  - Existing infrastructure analysis completed
  - No schema migrations required
---

## Prompt

/sp.plan Phase III – Chat History & Header UX

Plan Overview:

Phase 1: Backend
1. Ensure conversations table exists (id, user_id, title, created_at)
2. Ensure messages table stores role, content, conversation_id
3. APIs:
   - GET /chat/conversations (list history)
   - GET /chat/conversations/{id} (load chat)
   - POST /chat/new (start new chat)

Phase 2: Frontend – State
4. Add ChatContext:
   - activeConversationId
   - conversations[]
   - messages[]
5. New Chat:
   - Reset messages
   - Create new conversation via API

Phase 3: Header UI
6. Replace header with:
   - Title: "AI Todo Assistant"
   - History button (opens history list)
   - New Chat button
   - Close ❌ button (only closes chatbot)
7. Remove "✕ New Conversation ✕" completely

Phase 4: History UI
8. History panel:
   - List conversations (latest first)
   - Click → load messages
9. Highlight active conversation

Phase 5: UX Rules
10. Disable click-outside close
11. Close only via ❌
12. Smooth transitions, no JSON in UI

Phase 6: Testing
13. Reload page → history persists
14. Switch chats → messages load correctly
15. New chat doesn't delete old chats

Deliverable:
- Clean header
- Working chat history
- Stable UX with no console errors

## Response snapshot

Created comprehensive implementation plan for Chat History & Header UX feature (008-chat-history-ux):

**Planning Artifacts Created**:

1. **plan.md** (Main Implementation Plan):
   - Technical context (Phase III AI Agent + Phase II Full-Stack)
   - Constitution check (✅ ALL PASSED - no violations)
   - Project structure (existing + new files)
   - Implementation phases (Phase 0: Research, Phase 1: Design)
   - Success criteria mapping
   - Risk analysis (5 risks identified with mitigations)

2. **research.md** (Phase 0 Research):
   - R1: Infrastructure analysis (80% complete, identified gaps)
   - R2: Conversation list patterns (Decision: Offset-based pagination)
   - R3: State management (Decision: Fetch on demand)
   - R4: Click-outside behavior (Decision: Remove handler entirely)
   - R5: JSON filtering (Decision: Server-side filtering)

3. **data-model.md** (Phase 1 Data Model):
   - Existing schema documentation (Conversation, Message tables)
   - Query patterns (4 optimized queries documented)
   - Index optimization recommendations
   - ✅ NO MIGRATIONS REQUIRED (schema is complete)

4. **quickstart.md** (Phase 1 Developer Guide):
   - 5-minute setup verification
   - Implementation workflow (backend → frontend → integration)
   - API testing examples (curl, Python)
   - Debugging tips and common pitfalls
   - Performance benchmarks
   - Success checklist

5. **contracts/** (Phase 1 API Contracts):
   - get-conversations.yaml (OpenAPI 3.0 spec for GET /conversations)
   - get-messages.yaml (OpenAPI 3.0 spec for GET /conversations/{id}/messages)
   - create-conversation.yaml (OpenAPI 3.0 spec for POST /conversations)

**Key Findings**:

**Infrastructure Status**:
- ✅ Database models complete (Conversation, Message)
- ✅ Existing chat endpoint (POST /chat)
- ✅ ConversationService with core methods
- ❌ Missing: Conversation list endpoint
- ❌ Missing: Message retrieval endpoint
- ❌ Missing: Frontend history components

**Design Decisions**:
- Pagination: Offset-based (simple, performant for expected scale)
- State: Fetch on demand (scalable, clear loading states)
- Click-outside: Remove handler (simplest, meets requirement)
- JSON filtering: Server-side (most reliable)
- Preview text: Last message, first 100 chars

**No Schema Changes Required**:
- Existing tables support all requirements
- Indexes are sufficient for expected queries
- No migrations needed

**Constitution Compliance**: ✅ PASS
- All Phase III requirements satisfied
- All Phase II requirements maintained
- No violations detected

## Outcome

- ✅ Impact: Complete implementation plan with research, design, and contracts. Ready for task generation with `/sp.tasks`.
- 🧪 Tests: Constitution check passed, infrastructure analysis completed, no schema migrations required
- 📁 Files: Created plan.md, research.md, data-model.md, quickstart.md, and 3 OpenAPI contract files
- 🔁 Next prompts: Run `/sp.tasks` to generate atomic, testable tasks for implementation
- 🧠 Reflection: Planning phase complete. Existing infrastructure is 80% ready - only need to add 3 API endpoints and frontend history components. No database changes required, which significantly reduces implementation risk.

## Evaluation notes (flywheel)

- Failure modes observed: None - planning workflow completed successfully
- Graders run and results (PASS/FAIL): Constitution Check - PASS (all requirements satisfied)
- Prompt variant (if applicable): Standard /sp.plan workflow with Phase 0 research and Phase 1 design
- Next experiment (smallest change to try): Generate tasks with `/sp.tasks` to break down implementation into atomic, testable units
