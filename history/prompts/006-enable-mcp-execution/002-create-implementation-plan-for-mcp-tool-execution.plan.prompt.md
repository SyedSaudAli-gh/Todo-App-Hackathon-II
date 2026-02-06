---
id: 002
title: Create implementation plan for MCP tool execution
stage: plan
date: 2026-02-03
surface: agent
model: claude-sonnet-4-5-20250929
feature: 006-enable-mcp-execution
branch: 006-enable-mcp-execution
user: user
command: /sp.plan
labels: ["planning", "phase-iii", "mcp-tools", "openrouter", "mistral", "architecture"]
links:
  spec: specs/006-enable-mcp-execution/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/006-enable-mcp-execution/plan.md
  - specs/006-enable-mcp-execution/research.md
  - specs/006-enable-mcp-execution/data-model.md
  - specs/006-enable-mcp-execution/contracts/chat-api.yaml
  - specs/006-enable-mcp-execution/contracts/mcp-tools.yaml
  - specs/006-enable-mcp-execution/quickstart.md
  - specs/006-enable-mcp-execution/agent-context-update.md
tests:
  - None (planning phase)
---

## Prompt

```text
[SPEC-007] Plan to enable real MCP tool execution for chat assistant

Steps:
1. Register all MCP tools with proper schemas and handlers
2. Initialize MCP server during backend startup
3. Pass tool definitions explicitly to the agent runner
4. Enable tool calling mode in agent configuration
5. Execute MCP tools when agent requests them
6. Capture tool results and return them in API response
7. Persist tool outcomes in database
8. Render tool results in chat UI

Verification:
- "Add task Buy groceries" creates a DB record
- "Show all todos" returns real tasks
- "Mark task 1 complete" updates DB state
- No tool call is simulated in text only

Constraints:
- No Gemini models
- Use a free non-Gemini OpenRouter model (e.g. Mistral or Qwen)
- No UI routing changes
```

## Response snapshot

Created comprehensive implementation plan for enabling real MCP tool execution in the AI Todo Assistant. The planning phase included:

**Phase 0: Research & Discovery**
- Researched OpenAI Agents SDK integration with OpenRouter API
- Compared Mistral 7B vs Qwen 2.5 for tool calling capabilities
- Selected Mistral 7B Instruct as primary model (faster inference, reliable tool calling)
- Designed MCP tool architecture using Python functions with OpenAI function calling format
- Designed conversation persistence schema (conversations, messages, tool_calls tables)
- Decided on non-streaming implementation for MVP (simpler, adequate performance)

**Phase 1: Design & Contracts**
- Created data model with 3 new tables (conversations, messages, tool_calls)
- Designed 3 Alembic migrations (003, 004, 005)
- Created OpenAPI 3.0 specification for Chat API (5 endpoints)
- Created MCP tool contracts for 4 tools (add_task, list_tasks, update_task, delete_task)
- Documented tool execution flow with synchronous feedback loop
- Created comprehensive quickstart guide with setup and testing instructions
- Documented agent context updates for new technologies

**Key Technical Decisions**:
1. **OpenRouter Integration**: Use OpenAI SDK with custom base_url="https://openrouter.ai/api/v1"
2. **Model Selection**: Mistral 7B Instruct (fast, reliable, free)
3. **Tool Architecture**: Python functions with OpenAI format (simpler than separate MCP server)
4. **Stateless Design**: Load conversation context from database per request
5. **Tool Execution**: Synchronous with result feedback to prevent hallucination
6. **Database Schema**: 3 tables for complete audit trail
7. **Streaming**: Non-streaming for MVP (add later if needed)

**Constitution Check**: ✅ PASSED (all Phase III requirements met)

## Outcome

- ✅ Impact: Complete implementation plan ready for task breakdown
- 🧪 Tests: Planning artifacts validated against constitution requirements
- 📁 Files: Created 7 planning documents (plan, research, data-model, 2 contracts, quickstart, agent-context)
- 🔁 Next prompts: `/sp.tasks` to break plan into atomic tasks for implementation
- 🧠 Reflection: Successfully designed stateless AI agent architecture with real tool execution, balancing simplicity (no separate MCP server) with correctness (tool-based reasoning, no hallucination)

## Evaluation notes (flywheel)

- Failure modes observed: None - planning phase completed successfully
- Graders run and results (PASS/FAIL): Constitution Check - PASS (all Phase III requirements met)
- Prompt variant (if applicable): Standard /sp.plan workflow with Phase 0 research and Phase 1 design
- Next experiment (smallest change to try): Consider streaming implementation in future iteration if response times become an issue
