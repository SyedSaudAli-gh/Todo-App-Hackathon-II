---
id: 002
title: Chatbot UI Bugfix Implementation Plan
stage: plan
date: 2026-02-02
surface: agent
model: claude-sonnet-4-5
feature: 003-chatbot-ui-bugfix
branch: 003-chatbot-ui-bugfix
user: Claude Code Agent
command: /sp.plan
labels: ["chatbot", "ui", "bugfix", "connection-error", "openai-chatkit", "implementation-plan"]
links:
  spec: specs/003-chatbot-ui-bugfix/spec.md
  plan: specs/003-chatbot-ui-bugfix/plan.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/003-chatbot-ui-bugfix/plan.md
tests:
  - Constitution check validation
---

## Prompt

/sp.plan [SPEC-UI-BUGFIX] Implementation plan for improved Chatbot UI and connection fix

The plan should include:
1. **UI Button Placement**
   - Add floating chat button at bottom-right
   - Button triggers opening chat panel/modal
2. **Chat Panel Design**
   - Slide-out or modal aligned to right
   - Distinguish user vs assistant messages visually
   - Apply smooth animations for opening/closing
3. **Connection Fix**
   - Investigate current ChatKit initialization
   - Ensure API domain allowlist is correct (Vercel / localhost)
   - Validate OpenRouter API key usage in Agents SDK
   - Test connectivity in local and deployed environment
4. **Styling & Responsiveness**
   - Use Tailwind CSS or existing project styling
   - Ensure mobile and desktop layout compatibility
5. **Testing**
   - Click chat button → chat panel opens → send/receive messages
   - Confirm "Connection failed" does not appear
   - Verify messages persisted in database

Constraints:
- Only frontend UI changes allowed, except minimal backend fixes for connection

## Response snapshot

Created comprehensive implementation plan for chatbot UI improvements and connection error fixes:

**Feature**: 003-chatbot-ui-bugfix
**Branch**: 003-chatbot-ui-bugfix
**Plan File**: specs/003-chatbot-ui-bugfix/plan.md

**Plan Structure**:

1. **Summary**: Three-priority approach (P1: Connection fix, P2: Modern UI, P3: Floating widget)

2. **Technical Context**:
   - Phase III AI Agent Architecture (existing, no changes)
   - Phase II Full-Stack Web Application (frontend focus)
   - OpenAI ChatKit integration (primary focus)
   - Minimal backend changes (CORS validation only)

3. **Constitution Check**: ✅ ALL PASSED
   - Phase III requirements met (stateless backend, MCP tools, conversation persistence)
   - Phase II requirements met (API-first, frontend-backend separation)
   - OpenAI ChatKit approved for Phase III chat UI
   - Frontend-only focus aligns with constraints

4. **Project Structure**:
   - Frontend: New components in `web/src/components/chatbot/`
   - ChatKit integration: `web/src/lib/chatkit/`
   - Backend: Minimal validation in `api/src/routers/chat.py`

5. **Phase 0: Research & Investigation** (4 tasks):
   - R1: Connection Error Root Cause Analysis
   - R2: OpenAI ChatKit Integration Best Practices
   - R3: Floating Chat Widget UI Patterns
   - R4: Environment Configuration Validation

6. **Phase 1: Design & Contracts** (4 artifacts):
   - D1: Component Architecture (quickstart.md)
   - D2: ChatKit API Adapter Contract (contracts/chatkit-integration.md)
   - D3: Floating Chat Widget Design
   - D4: Message Styling Design

7. **Phase 2: Task Breakdown**: Placeholder for /sp.tasks command

**Key Decisions**:
- Use OpenAI ChatKit for chat UI (required by spec)
- Slide-out panel from right (desktop/tablet), full-screen modal (mobile)
- Framer Motion or Tailwind CSS for animations
- Custom API adapter for FastAPI backend integration
- Focus trap and Escape key handler for accessibility

**Risk Mitigation**:
- ChatKit compatibility: Test early, fallback to custom UI if needed
- CORS issues: Validate settings, add Vercel domain
- Responsive design: Mobile-first approach
- Keyboard accessibility: Custom handlers if ChatKit conflicts

**Next Steps**:
1. Execute Phase 0 research tasks (R1-R4)
2. Create Phase 1 design artifacts (quickstart.md, contracts/)
3. Run /sp.tasks to generate atomic task breakdown
4. Begin implementation in priority order

## Outcome

- ✅ Impact: Created comprehensive implementation plan with research tasks, design artifacts, and clear execution path
- 🧪 Tests: Constitution check passed (all Phase III and Phase II requirements met)
- 📁 Files: plan.md (590 lines)
- 🔁 Next prompts: Execute Phase 0 research, then /sp.tasks for task breakdown
- 🧠 Reflection: Plan successfully balances frontend-only constraint with comprehensive UI improvements and connection fix. Research phase will identify root cause before implementation begins.

## Evaluation notes (flywheel)

- Failure modes observed: None - plan completed successfully
- Graders run and results (PASS/FAIL): Constitution check PASS (all requirements met)
- Prompt variant (if applicable): Standard /sp.plan workflow with user-provided implementation guidance
- Next experiment (smallest change to try): Execute Phase 0 research to identify connection error root cause and validate ChatKit integration approach
