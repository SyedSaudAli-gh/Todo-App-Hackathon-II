# Research: Enable Real MCP Tool Execution in AI Todo Assistant

**Feature**: 006-enable-mcp-execution
**Date**: 2026-02-03
**Phase**: Phase 0 - Research & Discovery

## Overview

This document captures research findings for implementing real MCP tool execution in the AI Todo Assistant. The research focuses on integrating OpenAI Agents SDK with OpenRouter API, selecting an appropriate free model, implementing MCP server architecture, and designing conversation persistence.

## Research Questions & Findings

### 1. OpenAI Agents SDK with OpenRouter Integration

**Question**: How to configure OpenAI Agents SDK to use OpenRouter base URL instead of OpenAI?

**Findings**:

The OpenAI Agents SDK is built on top of the OpenAI Python SDK, which supports custom base URLs. OpenRouter provides an OpenAI-compatible API endpoint.

**Configuration Pattern**:
```python
from openai import OpenAI

# Configure OpenAI client for OpenRouter
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY")
)

# Use with Agents SDK
from openai import Agent

agent = Agent(
    client=client,
    model="mistralai/mistral-7b-instruct",  # or "qwen/qwen-2.5-7b-instruct"
    instructions="You are a helpful task management assistant..."
)
```

**Key Points**:
- OpenRouter API is OpenAI-compatible (same request/response format)
- Use `base_url="https://openrouter.ai/api/v1"` for OpenRouter
- Use `OPENROUTER_API_KEY` environment variable
- Model names use provider/model format (e.g., `mistralai/mistral-7b-instruct`)
- All OpenAI SDK features work with OpenRouter (including tool calling)

**Decision**: Use OpenAI Python SDK with custom base_url pointing to OpenRouter

**Rationale**:
- Minimal code changes from standard OpenAI integration
- Full compatibility with OpenAI Agents SDK
- Supports tool calling and streaming
- Easy to switch models by changing model name

---

### 2. Free Non-Gemini Model Selection

**Question**: Which free models on OpenRouter support tool calling (Mistral 7B vs Qwen 2.5)?

**Findings**:

**Mistral 7B Instruct** (`mistralai/mistral-7b-instruct`):
- ✅ Free tier available on OpenRouter
- ✅ Supports function/tool calling
- ✅ Good instruction following
- ✅ Fast inference (<2s typical)
- ✅ Well-documented tool calling format
- ⚠️ Limited context window (8k tokens)
- ⚠️ May struggle with complex multi-step reasoning

**Qwen 2.5 7B Instruct** (`qwen/qwen-2.5-7b-instruct`):
- ✅ Free tier available on OpenRouter
- ✅ Supports function/tool calling
- ✅ Larger context window (32k tokens)
- ✅ Strong reasoning capabilities
- ✅ Good multilingual support
- ⚠️ Slightly slower inference (~2-3s)
- ⚠️ Less widely adopted than Mistral

**Tool Calling Comparison**:

Both models support OpenAI-compatible tool calling format:
```json
{
  "tools": [
    {
      "type": "function",
      "function": {
        "name": "add_task",
        "description": "Create a new todo task",
        "parameters": {
          "type": "object",
          "properties": {
            "title": {"type": "string"},
            "description": {"type": "string"}
          },
          "required": ["title"]
        }
      }
    }
  ]
}
```

**Decision**: Use **Mistral 7B Instruct** as primary model

**Rationale**:
- Faster inference time (better user experience)
- Well-tested tool calling implementation
- Sufficient for task management use case
- Widely adopted with good community support
- 8k context window adequate for conversation history

**Alternatives Considered**:
- Qwen 2.5 7B: Larger context window not needed for current scope
- Gemini: Excluded per user constraint

---

### 3. MCP SDK Integration

**Question**: How to initialize MCP server in FastAPI application and register tools?

**Findings**:

The MCP (Model Context Protocol) SDK provides a Python implementation for creating tool servers. However, for this use case, we can implement a simpler pattern using OpenAI's function calling directly.

**Simplified Approach** (Recommended):

Instead of running a separate MCP server process, implement MCP tools as Python functions and register them with the OpenAI Agents SDK:

```python
# api/src/mcp/tools/add_task.py
from pydantic import BaseModel
from sqlmodel import Session
from ..models.todo import Todo

class AddTaskInput(BaseModel):
    title: str
    description: str | None = None
    user_id: int

def add_task(input: AddTaskInput, db: Session) -> dict:
    """Create a new todo task in the database."""
    todo = Todo(
        title=input.title,
        description=input.description,
        user_id=input.user_id,
        status="pending"
    )
    db.add(todo)
    db.commit()
    db.refresh(todo)

    return {
        "task_id": todo.id,
        "title": todo.title,
        "status": todo.status
    }

# Tool definition for OpenAI
ADD_TASK_TOOL = {
    "type": "function",
    "function": {
        "name": "add_task",
        "description": "Create a new todo task",
        "parameters": {
            "type": "object",
            "properties": {
                "title": {"type": "string", "description": "Task title"},
                "description": {"type": "string", "description": "Task description (optional)"},
                "user_id": {"type": "integer", "description": "User ID"}
            },
            "required": ["title", "user_id"]
        }
    }
}
```

**Tool Registration Pattern**:
```python
# api/src/ai/agent.py
from openai import OpenAI
from ..mcp.tools import add_task, list_tasks, update_task, delete_task

def create_agent(user_id: int, db: Session):
    client = OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=os.getenv("OPENROUTER_API_KEY")
    )

    tools = [
        ADD_TASK_TOOL,
        LIST_TASKS_TOOL,
        UPDATE_TASK_TOOL,
        DELETE_TASK_TOOL
    ]

    return client, tools
```

**Decision**: Implement MCP tools as Python functions with OpenAI function calling format

**Rationale**:
- Simpler architecture (no separate MCP server process)
- Direct integration with OpenAI Agents SDK
- Easier to test and debug
- Stateless by design (database passed per request)
- Follows OpenAI function calling conventions

**Alternatives Considered**:
- Separate MCP server: Added complexity without clear benefit for this use case
- Direct database access from agent: Violates stateless architecture principle

---

### 4. Tool Execution Flow

**Question**: How does the agent request tool execution and how to handle results?

**Findings**:

**Tool Execution Flow**:

1. **User sends message** → Chat API receives request
2. **Load conversation context** → Fetch messages from database
3. **Agent processes message** → OpenAI Agents SDK analyzes intent
4. **Agent requests tool** → Returns tool_calls in response
5. **Execute tool** → Call Python function with database session
6. **Return tool result** → Send result back to agent
7. **Agent generates response** → Final message to user
8. **Persist everything** → Save message, tool calls, response to database

**Implementation Pattern**:

```python
# api/src/services/agent_service.py
async def process_message(conversation_id: int, user_message: str, db: Session):
    # 1. Load conversation context
    messages = load_conversation_history(conversation_id, db)
    messages.append({"role": "user", "content": user_message})

    # 2. Create agent with tools
    client, tools = create_agent(user_id, db)

    # 3. Send to agent
    response = client.chat.completions.create(
        model="mistralai/mistral-7b-instruct",
        messages=messages,
        tools=tools,
        tool_choice="auto"
    )

    # 4. Handle tool calls
    if response.choices[0].message.tool_calls:
        tool_results = []
        for tool_call in response.choices[0].message.tool_calls:
            result = execute_tool(tool_call, db)
            tool_results.append(result)

        # 5. Send tool results back to agent
        messages.append(response.choices[0].message)
        messages.append({"role": "tool", "content": json.dumps(tool_results)})

        final_response = client.chat.completions.create(
            model="mistralai/mistral-7b-instruct",
            messages=messages
        )

        # 6. Persist everything
        save_message(conversation_id, "user", user_message, db)
        save_message(conversation_id, "assistant", final_response.choices[0].message.content, db)
        save_tool_calls(tool_calls, tool_results, db)

        return final_response.choices[0].message.content
```

**Decision**: Implement synchronous tool execution with result feedback loop

**Rationale**:
- Agent receives tool results before generating final response
- Ensures agent can reference actual tool outcomes
- Prevents hallucination of tool results
- Allows agent to handle tool errors gracefully

---

### 5. Conversation Persistence

**Question**: What database schema is needed and how to load conversation context?

**Findings**:

**Database Schema**:

```sql
-- Conversations table
CREATE TABLE conversations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Messages table
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    conversation_id INTEGER NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Tool calls table (optional - for audit/debugging)
CREATE TABLE tool_calls (
    id SERIAL PRIMARY KEY,
    message_id INTEGER NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    tool_name VARCHAR(100) NOT NULL,
    tool_input JSONB NOT NULL,
    tool_output JSONB NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('success', 'error')),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_tool_calls_message_id ON tool_calls(message_id);
```

**Context Loading Pattern**:

```python
def load_conversation_history(conversation_id: int, db: Session, limit: int = 50):
    """Load recent messages from conversation."""
    messages = db.query(Message)\
        .filter(Message.conversation_id == conversation_id)\
        .order_by(Message.created_at.desc())\
        .limit(limit)\
        .all()

    # Convert to OpenAI format
    return [
        {"role": msg.role, "content": msg.content}
        for msg in reversed(messages)
    ]
```

**Decision**: Use three-table schema (conversations, messages, tool_calls)

**Rationale**:
- Conversations: Track user sessions
- Messages: Store all user/assistant messages
- Tool_calls: Audit trail for debugging (optional for MVP)
- Supports unlimited conversation history
- Efficient querying with proper indexes
- Stateless backend (all state in database)

---

### 6. Streaming Responses

**Question**: Does OpenAI Agents SDK support streaming with OpenRouter?

**Findings**:

**Streaming Support**:
- ✅ OpenAI SDK supports streaming with `stream=True`
- ✅ OpenRouter supports streaming for compatible models
- ✅ Mistral 7B supports streaming
- ⚠️ Tool calling with streaming is complex (tools returned first, then content)

**Streaming Pattern**:

```python
# With streaming
response = client.chat.completions.create(
    model="mistralai/mistral-7b-instruct",
    messages=messages,
    tools=tools,
    stream=True
)

for chunk in response:
    if chunk.choices[0].delta.content:
        yield chunk.choices[0].delta.content
```

**Streaming with Tool Calls**:
- Tool calls are returned in initial chunks
- Must collect all chunks to get complete tool call
- Execute tools after streaming completes
- Send tool results back for final response

**Decision**: Implement non-streaming for MVP, add streaming in future iteration

**Rationale**:
- Tool calling with streaming adds significant complexity
- Non-streaming provides simpler, more reliable implementation
- Response times <3s acceptable for MVP
- Can add streaming later without breaking changes
- Focus on correctness over perceived performance

**Alternatives Considered**:
- Streaming with tool calls: Too complex for MVP
- Streaming without tool calls: Doesn't solve core requirement

---

## Technology Decisions Summary

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **LLM Provider** | OpenRouter | Free tier, OpenAI-compatible API |
| **Model** | Mistral 7B Instruct | Fast, reliable tool calling, free |
| **Agent Framework** | OpenAI Agents SDK | Standard, well-documented, compatible |
| **Tool Architecture** | Python functions with OpenAI format | Simple, stateless, testable |
| **Database Schema** | 3 tables (conversations, messages, tool_calls) | Complete audit trail, efficient queries |
| **Streaming** | Non-streaming for MVP | Simpler implementation, adequate performance |
| **Tool Execution** | Synchronous with feedback loop | Prevents hallucination, handles errors |

## Implementation Approach

### Phase 1: Core Infrastructure
1. Create database migrations (conversations, messages, tool_calls)
2. Implement MCP tool functions (add_task, list_tasks, update_task, delete_task)
3. Configure OpenAI client with OpenRouter base URL
4. Implement conversation context loading

### Phase 2: Agent Integration
1. Implement agent service with tool execution
2. Create chat API endpoints (create conversation, send message, get history)
3. Implement tool call persistence
4. Add error handling and validation

### Phase 3: Frontend Integration
1. Update chat API client for new endpoints
2. Display tool execution results in chat UI
3. Add loading states and error handling
4. Implement E2E tests

## Risk Mitigation

**Risk**: OpenRouter API rate limits or downtime
- **Mitigation**: Implement retry logic with exponential backoff
- **Fallback**: Cache recent responses, show user-friendly error messages

**Risk**: Model produces invalid tool calls
- **Mitigation**: Validate tool call format before execution
- **Fallback**: Return error to agent, ask for clarification

**Risk**: Database connection failures during tool execution
- **Mitigation**: Implement database connection pooling and retry logic
- **Fallback**: Return error to agent, preserve conversation state

**Risk**: Agent hallucinates tool results
- **Mitigation**: Strict tool-only architecture, always return actual tool results
- **Fallback**: Validate tool results before showing to user

## Next Steps

1. ✅ Research complete
2. → Proceed to Phase 1: Design & Contracts
   - Create data-model.md
   - Create contracts/chat-api.yaml
   - Create contracts/mcp-tools.yaml
   - Create quickstart.md
3. → Update agent context with new technologies
4. → Re-validate Constitution Check
5. → Proceed to /sp.tasks for task breakdown
