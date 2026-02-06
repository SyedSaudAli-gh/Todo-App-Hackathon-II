# Agent Context Update: Enable Real MCP Tool Execution

**Feature**: 006-enable-mcp-execution
**Date**: 2026-02-03
**Phase**: Phase 1 - Agent Context Update

## Technologies Added

The following technologies should be added to the Claude agent context file:

### AI/Agent Stack

```markdown
## Phase III AI Agent Technologies

### OpenAI Agents SDK
- **Purpose**: AI agent orchestration framework
- **Version**: Latest stable
- **Usage**: Configure agent with OpenRouter API, register MCP tools, handle tool execution
- **Key Patterns**:
  - Custom base URL configuration for OpenRouter
  - Tool registration with OpenAI function calling format
  - Synchronous tool execution with result feedback loop
  - Conversation context loading from database

### OpenRouter API
- **Purpose**: LLM provider with free tier models
- **Endpoint**: https://openrouter.ai/api/v1
- **Authentication**: OPENROUTER_API_KEY environment variable
- **Usage**: OpenAI-compatible API for model inference
- **Key Patterns**:
  - Configure OpenAI client with custom base_url
  - Use provider/model format for model names (e.g., mistralai/mistral-7b-instruct)
  - All OpenAI SDK features work with OpenRouter

### Mistral 7B Instruct
- **Purpose**: Free LLM for task management agent
- **Model ID**: mistralai/mistral-7b-instruct
- **Capabilities**: Function/tool calling, instruction following, fast inference
- **Context Window**: 8k tokens
- **Usage**: Primary model for AI agent responses
- **Key Patterns**:
  - Supports OpenAI function calling format
  - Fast inference (<2s typical)
  - Adequate for conversation history and tool calling

### MCP (Model Context Protocol)
- **Purpose**: Tool protocol for agent-database interaction
- **Implementation**: Python functions with OpenAI function calling format
- **Architecture**: Stateless tools with database-backed operations
- **Usage**: Expose task management operations to AI agent
- **Key Patterns**:
  - Tools as Python functions with Pydantic input validation
  - Database session passed per request (stateless)
  - Structured error responses
  - Permission validation before execution
```

### Database Schema Extensions

```markdown
## Phase III Database Tables

### conversations
- **Purpose**: Track user chat sessions with AI agent
- **Fields**: id, user_id, created_at, updated_at
- **Relationships**: Has many messages
- **Indexes**: user_id

### messages
- **Purpose**: Store user and agent messages
- **Fields**: id, conversation_id, role, content, created_at
- **Relationships**: Belongs to conversation, has many tool_calls
- **Indexes**: conversation_id, created_at

### tool_calls (optional)
- **Purpose**: Audit trail for agent tool invocations
- **Fields**: id, message_id, tool_name, tool_input, tool_output, status, created_at
- **Relationships**: Belongs to message
- **Indexes**: message_id
```

### API Patterns

```markdown
## Phase III API Patterns

### Chat API Endpoints
- POST /api/v1/chat/conversations - Create conversation
- GET /api/v1/chat/conversations - List user conversations
- GET /api/v1/chat/conversations/{id} - Get conversation history
- POST /api/v1/chat/conversations/{id}/messages - Send message to agent
- DELETE /api/v1/chat/conversations/{id} - Delete conversation

### Agent Service Pattern
```python
async def process_message(conversation_id: int, user_message: str, db: Session):
    # 1. Load conversation context from database
    messages = load_conversation_history(conversation_id, db)
    messages.append({"role": "user", "content": user_message})

    # 2. Create agent with tools
    client, tools = create_agent(user_id, db)

    # 3. Send to agent with tools
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

### MCP Tool Pattern
```python
def add_task(input: AddTaskInput, db: Session) -> dict:
    """Create a new todo task in the database."""
    try:
        # Validate permissions
        # Perform database operation
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
    except Exception as e:
        db.rollback()
        return {
            "error": str(e),
            "code": "DATABASE_ERROR"
        }
```
```

## Manual Update Instructions

Since the update script is not available in this environment, manually add the above content to:
- `.specify/memory/agent-context-claude.md` (if it exists)
- Or create a new section in the constitution or plan documentation

## Key Takeaways for Future Implementation

1. **OpenRouter Configuration**: Always use custom base_url with OpenAI SDK
2. **Stateless Architecture**: Load conversation context from database on every request
3. **Tool Execution**: Synchronous execution with result feedback to prevent hallucination
4. **Error Handling**: All tools return structured error responses, never raise exceptions
5. **Permission Validation**: Always verify user_id and task ownership
6. **Database Transactions**: Use transactions with rollback on error
7. **Conversation Persistence**: Save user messages, tool calls, and agent responses

## Next Steps

1. ✅ Agent context documented
2. → Re-validate Constitution Check
3. → Create PHR
4. → Report completion
