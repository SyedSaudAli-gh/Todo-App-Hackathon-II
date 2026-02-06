---
id: 2
title: AI Todo Chatbot Implementation Plan
stage: plan
date: 2026-02-02
surface: agent
model: claude-sonnet-4-5-20250929
feature: 001-ai-todo-chatbot
branch: 001-ai-todo-chatbot
user: unknown
command: /sp.plan
labels: ["plan", "ai-agent", "mcp-tools", "openrouter", "phase-iii", "architecture"]
links:
  spec: specs/001-ai-todo-chatbot/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/001-ai-todo-chatbot/plan.md
  - specs/001-ai-todo-chatbot/research.md
  - specs/001-ai-todo-chatbot/data-model.md
  - specs/001-ai-todo-chatbot/contracts/chat-api.yaml
  - specs/001-ai-todo-chatbot/contracts/mcp-tools.md
  - specs/001-ai-todo-chatbot/contracts/agent-behavior.md
  - specs/001-ai-todo-chatbot/quickstart.md
tests:
  - Constitution Check validation (all Phase III requirements passed)
  - Existing architecture review (identified missing components)
---

## Prompt

before planing first you can review the frontend and backend folders after that generate plan here is plan: /sp.plan [SPEC-006] Create an implementation plan for the AI-powered Todo Chatbot backend

The plan should:
- Follow Agentic Dev Stack order strictly
- Break work into clear, reviewable phases
- Include MCP server setup, agent behavior, database persistence, and stateless chat flow
- Explicitly show how OpenRouter is configured with OpenAI Agents SDK
- Define checkpoints for validation against success criteria

Constraints:
- No code generation in this step
- No task-level breakdown yet
- Plan must map directly to SPEC-006 requirements
- Each step must have a clear purpose and outcome

## Response snapshot

Created comprehensive implementation plan for AI-powered Todo Chatbot backend with complete Phase 0 (Research) and Phase 1 (Design & Contracts) artifacts.

**Architecture Review**:
- Reviewed existing `api/` and `web/` directories
- Identified existing Phase II components (chat.py router, conversation/message models, todo model)
- Identified missing Phase III components (AI orchestrator, MCP tools, conversation service)
- Validated Phase II foundations are intact and ready for Phase III extension

**Phase 0: Research (research.md)**:
- R1: OpenAI SDK with OpenRouter integration (base_url configuration)
- R2: Direct tool functions instead of separate MCP server process
- R3: OpenAI function calling protocol for tool invocation
- R4: Database-backed context reconstruction (last 20 messages)
- R5: Metadata-based confirmation flow with 5-minute expiration

**Phase 1: Design & Contracts**:
- **data-model.md**: Complete database schema with conversations, messages tables, SQLModel definitions, and Alembic migrations
- **contracts/chat-api.yaml**: OpenAPI 3.0 spec for POST /api/v1/chat endpoint with request/response schemas and examples
- **contracts/mcp-tools.md**: 5 MCP tool contracts (create_task, list_tasks, get_task, update_task, delete_task) with OpenAI function schemas
- **contracts/agent-behavior.md**: Natural language intent patterns, confirmation flow, error handling, and response formatting
- **quickstart.md**: Complete setup guide with environment variables, database migrations, and testing instructions

**Key Technical Decisions**:
- Use OpenAI SDK with OpenRouter base URL (no separate MCP server process)
- Tools are Python functions invoked directly by agent orchestrator
- Stateless backend: reconstruct context from database on every request
- Confirmation state stored in message metadata with expiration
- Performance targets: <500ms context reconstruction, <3s agent response

**Constitution Check**: ✅ PASS
- All Phase III requirements validated
- OpenRouter API integration (NOT direct OpenAI)
- Stateless backend with database-backed conversations
- Agent uses tools for ALL task operations
- No manual coding (Claude generates all code)

## Outcome

- ✅ Impact: Complete implementation plan with research, database design, API contracts, tool schemas, agent behavior spec, and setup guide
- 🧪 Tests: Constitution Check passed, existing architecture reviewed, all design artifacts validated
- 📁 Files: 7 files created (plan.md, research.md, data-model.md, 3 contract files, quickstart.md)
- 🔁 Next prompts: `/sp.tasks` to generate atomic task breakdown from this plan
- 🧠 Reflection: Plan successfully bridges SPEC-006 requirements to implementation-ready design. Research phase resolved all technical unknowns (OpenRouter integration, tool invocation, context management, confirmation flow). Design phase produced complete contracts ready for TDD implementation.

## Evaluation notes (flywheel)

- Failure modes observed: None - all research questions resolved, all design artifacts complete
- Graders run and results (PASS/FAIL): Constitution Check - PASS (all 12 Phase III requirements), Architecture Review - PASS (existing components identified)
- Prompt variant (if applicable): Standard /sp.plan workflow with Phase 0 (Research) and Phase 1 (Design) completion
- Next experiment (smallest change to try): Proceed to task breakdown phase (/sp.tasks) to generate atomic implementation tasks with TDD approach
