---
id: 2
title: Fix Chat UI Routing Plan
stage: plan
date: 2026-02-03
surface: agent
model: claude-sonnet-4-5-20250929
feature: 004-fix-chat-routing
branch: 004-fix-chat-routing
user: user
command: /sp.plan
labels: ["plan", "chat", "routing", "bugfix", "frontend"]
links:
  spec: ../spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/004-fix-chat-routing/plan.md
  - specs/004-fix-chat-routing/research.md
  - specs/004-fix-chat-routing/quickstart.md
tests:
  - None (planning phase)
---

## Prompt

```
/sp.plan [SPEC-006] Plan to fix chat routing and UI navigation issues

Steps:
1. Inspect chat send handler for router.push(), Link, or form submit navigation
2. Remove any automatic route changes tied to chat submit events
3. Ensure preventDefault() is applied to chat form submission
4. Restrict chat UI to modal or slide-out component only
5. Confirm chat open/close state is controlled by local UI state
6. Test that sending messages does not change URL

Verification:
- Open /dashboard/todos
- Open chat via floating button
- Send multiple messages
- URL never changes to /chat

Constraints:
- No redesign of chat UI layout
- No new routes introduced
```

## Response snapshot

Created comprehensive implementation plan for fixing chat UI routing issues. The plan identifies the root cause and provides a clear solution path.

**Problem Analysis**:
- Identified 3 `router.push()` calls in `useChat.ts` (lines 87, 126, 163)
- Chat was designed as full-page route with URL-based conversation tracking
- Conflicts with overlay-based chat requirement

**Solution Design**:
- Remove all routing logic from chat state management
- Manage conversation ID purely in React state (no URL sync)
- Remove or redirect `/chat` page route
- Embed ChatWidget in dashboard layout

**Planning Artifacts Created**:
1. **plan.md** (463 lines): Complete implementation plan with:
   - Technical context and architecture analysis
   - Constitution check (Phase II frontend bugfix)
   - Phase 0 research findings
   - Phase 1 design and component contracts
   - File modification summary (5 files to modify)
   - Testing strategy and risk mitigation

2. **research.md**: Detailed problem analysis with:
   - Root cause identification
   - Solution approach and rationale
   - Technology decisions (React hooks, dashboard layout placement)
   - Implementation strategy (4 phases)
   - Risk assessment with mitigation strategies

3. **quickstart.md**: Comprehensive testing guide with:
   - 8 test procedures covering all scenarios
   - Clear expected results and fail conditions
   - Success criteria checklist
   - Troubleshooting guide

**Key Findings**:
- Frontend-only changes (no backend modifications)
- Small refactoring: ~5 files to modify
- Low complexity (straightforward state management change)
- No new dependencies required
- Maintains existing chat functionality

**Implementation Strategy**:
- Phase 1: Remove routing logic from useChat hook
- Phase 2: Remove/redirect chat route
- Phase 3: Embed ChatWidget in dashboard layout
- Phase 4: Update ChatWidget props (if needed)

## Outcome

- ✅ Impact: Complete implementation plan ready for task breakdown. Clear path to fix critical UX bug preventing chat from working as intended overlay component.
- 🧪 Tests: 8 manual test procedures defined in quickstart.md covering all user scenarios
- 📁 Files: Created plan.md (463 lines), research.md (detailed analysis), quickstart.md (testing guide)
- 🔁 Next prompts: `/sp.tasks` to generate atomic task breakdown for implementation
- 🧠 Reflection: Plan clearly identifies root cause (router.push() calls in useChat hook) and provides minimal, focused solution. All changes are frontend-only with no backend modifications. Constitution check passes - this is a standard Phase II frontend bugfix within approved boundaries.

## Evaluation notes (flywheel)

- Failure modes observed: None. Planning followed template structure and identified clear solution path.
- Graders run and results (PASS/FAIL): Constitution check - PASS (Phase II frontend bugfix, no violations)
- Prompt variant (if applicable): Standard /sp.plan workflow with code analysis
- Next experiment (smallest change to try): Proceed to task breakdown phase to create atomic, testable tasks for implementation
