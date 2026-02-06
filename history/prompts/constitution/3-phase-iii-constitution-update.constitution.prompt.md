---
id: 3
title: Phase III Constitution Update
stage: constitution
date: 2026-02-02
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: 006-chat-api-persistence
user: user
command: /sp.constitution
labels: ["constitution", "phase-iii", "governance", "ai-agent", "mcp", "openai-agents-sdk", "openrouter", "stateless-backend"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests:
  - none
---

## Prompt

```text
# 📜 Project Constitution — Hackathon Phase III
## Todo AI Chatbot (Agentic + MCP Architecture)

### 🔒 Constitution Version
**Phase:** III
**Project:** Todo AI Chatbot
**Methodology:** Agentic Dev Stack (Spec → Plan → Tasks → Implement)
**Manual Coding:** ❌ Strictly Prohibited

---

## 🎯 Phase III Objective

Build a **stateless, AI-powered Todo Chatbot** that allows users to manage tasks via **natural language**, using:

- OpenAI Agents SDK (framework)
- MCP (Model Context Protocol) Server
- Stateless FastAPI backend
- Persistent database-backed conversation memory

The system must demonstrate **tool-based reasoning**, **agent orchestration**, and **clean separation of concerns**.

---

## 🧠 Core Development Rules (NON-NEGOTIABLE)

### 1. Agentic Dev Stack Enforcement
Claude MUST follow this order strictly:

1. Write **formal specifications**
2. Generate **implementation plan**
3. Break plan into **atomic tasks**
4. Implement tasks via **Claude Code**
5. Review outputs against spec

⚠️ Skipping or merging steps is NOT allowed.

---

### 2. No Manual Coding Policy
- Human (developer) **will not write code**
- Claude generates ALL:
  - Specs
  - Plans
  - Tasks
  - Code
  - Fixes
- Any instruction that implies manual coding must be rejected.

---

### 3. AI Framework & API Key Constraint

- **Framework:** OpenAI Agents SDK (MANDATORY)
- **API Provider:** OpenRouter (NOT OpenAI directly)
- Claude must:
  - Configure Agents SDK to use OpenRouter-compatible base URL
  - Accept OpenRouter API key via environment variable
  - Never assume OpenAI-paid API key exists

Example constraint:
- `OPENAI_API_KEY` ❌
- `OPENROUTER_API_KEY` ✅

---

### 4. MCP Architecture Requirement

Claude MUST implement:

- Official MCP SDK
- MCP Server exposing task tools
- MCP tools MUST be:
  - Stateless
  - Database-backed
  - Callable by AI agent only

Direct DB access by agent logic is **FORBIDDEN**.

---

### 5. Stateless Backend Rule

FastAPI server MUST:

- Hold **no in-memory state**
- Fetch conversation history from DB on every request
- Persist:
  - Conversations
  - Messages
  - Tool calls
- Be restart-safe without data loss

---

### 6. Folder Ownership & Review Policy

Claude MUST respect project boundaries:

#### `/backend`
- FastAPI
- OpenAI Agents SDK
- MCP Server
- Database models
- Chat API

#### `/frontend`
- OpenAI ChatKit UI
- Stateless chat client
- Auth integration

Claude MUST:
- Review existing backend + frontend code
- Identify architectural or spec violations
- Fix ONLY through generated code (no advice-only answers)

---

### 7. Agent Behavior Contract

AI Agent MUST:

- Use MCP tools for ALL task operations
- NEVER hallucinate task state
- Always confirm user actions
- Handle errors gracefully (task not found, invalid input)

---

### 8. Spec-First Documentation Requirement

All Phase III work MUST produce:

- `/specs/agent.md`
- `/specs/mcp-tools.md`
- `/specs/chat-api.md`
- `/specs/database.md`
- `/specs/architecture.md`

Code without matching spec = INVALID.

---

## 🏁 Phase II
```

## Response snapshot

Updated Project Constitution from Phase II (v2.0.0) to Phase III (v3.0.0) with AI Agent and MCP architecture requirements.

**Version Change**: 2.0.0 → 3.0.0 (MAJOR - Phase III AI Agent Architecture)

**Key Additions**:
- Principle X: AI Framework & API Key Constraint (OpenRouter mandatory)
- Principle XI: MCP Architecture Requirement (stateless, database-backed tools)
- Principle XII: Stateless Backend Rule (no in-memory conversation state)
- Principle XIII: Agent Behavior Contract (tool-based reasoning, no hallucinations)
- Principle XIV: Folder Ownership & Review Policy
- Principle XV: Spec-First Documentation Requirement

**Modified Principles**:
- Principle I: Enhanced with Agentic Dev Stack enforcement
- Principle II: Phase II Integrity → Phase III Integrity (AI agent architecture)
- Principle VI: Technology Stack expanded with AI/Agent layer

**New Sections**:
- Phase III Objective (stateless AI chatbot with natural language interface)
- Phase III Technology Stack (OpenAI Agents SDK, OpenRouter, MCP, Gemini)
- Phase III Quality Standards (Agent, MCP Server, Chat API standards)
- No Manual Coding Policy (explicit enforcement)
- Phase III Scope and Boundaries

**Maintained**:
- All Phase II foundations (Next.js + FastAPI + Neon PostgreSQL)
- Phase I deprecations (in-memory storage, CLI, positional indexes)
- API-first architecture
- Frontend-backend separation
- Data integrity and security standards

**Technology Stack Additions**:
- OpenAI Agents SDK (agent orchestration framework)
- OpenRouter API (LLM provider - NOT OpenAI directly)
- MCP SDK (Model Context Protocol server)
- Gemini models via OpenRouter (recommended)
- `OPENROUTER_API_KEY` environment variable (replaces `OPENAI_API_KEY`)

**Sync Impact Report** embedded at top of constitution identifies pending template updates:
- .specify/templates/spec-template.md
- .specify/templates/plan-template.md
- .specify/templates/tasks-template.md
- .specify/templates/commands/*.md

## Outcome

- ✅ Impact: Constitution successfully upgraded to Phase III with comprehensive AI agent, MCP, and stateless backend requirements. All Phase II foundations maintained while adding new architectural layers.
- 🧪 Tests: No tests (documentation update)
- 📁 Files: 1 file modified (.specify/memory/constitution.md)
- 🔁 Next prompts: Update templates (spec, plan, tasks) to reflect Phase III requirements; Create Phase III specifications (agent.md, mcp-tools.md, chat-api.md, database.md, architecture.md); Review backend code for Phase III integration points
- 🧠 Reflection: Phase III represents a major architectural evolution introducing AI agent orchestration while maintaining Phase II web foundations. The constitution now enforces stateless design, tool-based reasoning, and OpenRouter integration. Critical constraints include no manual coding, no direct database access from agent logic, and mandatory MCP tool usage.

## Evaluation notes (flywheel)

- Failure modes observed: None - constitution update completed successfully with comprehensive coverage of Phase III requirements
- Graders run and results (PASS/FAIL): N/A (documentation update, no automated grading)
- Prompt variant (if applicable): Standard constitution update workflow
- Next experiment (smallest change to try): Validate constitution compliance by reviewing existing backend code against new Phase III principles; identify any violations requiring remediation
