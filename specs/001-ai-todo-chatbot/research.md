# Research: AI-Powered Todo Chatbot Backend

**Feature**: 001-ai-todo-chatbot
**Date**: 2026-02-02
**Purpose**: Resolve technical unknowns before design phase

## R1: OpenAI Agents SDK + OpenRouter Integration

### Decision
Configure OpenAI Python SDK (which includes Agents functionality) to use OpenRouter's OpenAI-compatible API endpoint by setting custom `base_url` and using `OPENROUTER_API_KEY`.

### Rationale
- OpenRouter provides OpenAI-compatible API at `https://openrouter.ai/api/v1`
- OpenAI Python SDK supports custom base URLs via `base_url` parameter
- This allows using Gemini models via OpenRouter without direct OpenAI API dependency
- Maintains compatibility with OpenAI SDK patterns and documentation

### Alternatives Considered
1. **Direct OpenAI API**: Rejected - requires paid OpenAI API key (constraint violation)
2. **Custom LLM wrapper**: Rejected - adds unnecessary complexity and maintenance burden
3. **LangChain**: Rejected - overkill for simple agent orchestration needs

### Implementation Pattern

```python
from openai import OpenAI

# Initialize OpenAI client with OpenRouter
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY")
)

# Use chat completions with tool calling
response = client.chat.completions.create(
    model="google/gemini-2.0-flash-exp",
    messages=[...],
    tools=[...],  # MCP tools as OpenAI function definitions
    tool_choice="auto"
)
```

### Key Configuration
- Environment variable: `OPENROUTER_API_KEY` (NOT `OPENAI_API_KEY`)
- Base URL: `https://openrouter.ai/api/v1`
- Recommended model: `google/gemini-2.0-flash-exp` (fast, cost-effective)
- Fallback model: `google/gemini-pro` (more capable, higher cost)

---

## R2: MCP SDK Python Implementation

### Decision
Use OpenAI function calling format to define MCP tools, as there is no official standalone MCP SDK for Python. Tools are defined as OpenAI function schemas and invoked by the agent through standard function calling.

### Rationale
- MCP (Model Context Protocol) is primarily a conceptual framework for tool-based agent interactions
- OpenAI's function calling provides the same capabilities: structured tool definitions, parameter validation, and result handling
- No need for separate MCP server process - tools are Python functions called directly by the agent orchestrator
- Simpler architecture: Agent → Tool Functions → Database (no separate MCP server process)

### Alternatives Considered
1. **Separate MCP Server Process**: Rejected - adds deployment complexity without benefit for single-instance deployment
2. **Custom Tool Protocol**: Rejected - reinventing OpenAI function calling
3. **LangChain Tools**: Rejected - unnecessary dependency for simple tool definitions

### Implementation Pattern

```python
# Define tool as OpenAI function schema
create_task_tool = {
    "type": "function",
    "function": {
        "name": "create_task",
        "description": "Create a new todo task",
        "parameters": {
            "type": "object",
            "properties": {
                "title": {"type": "string", "description": "Task title"},
                "description": {"type": "string", "description": "Task description"},
                "status": {"type": "string", "enum": ["pending", "completed"]}
            },
            "required": ["title"]
        }
    }
}

# Tool implementation (stateless, database-backed)
def create_task(title: str, description: str = None, status: str = "pending",
                user_id: str = None, db: Session = None) -> dict:
    """Create task in database and return result."""
    task = Todo(
        user_id=user_id,
        title=title,
        description=description,
        completed=(status == "completed")
    )
    db.add(task)
    db.commit()
    db.refresh(task)

    return {
        "task_id": task.id,
        "success": True,
        "message": f"Created task: {title}"
    }
```

### Tool Design Principles
- **Stateless**: Each tool receives database session as parameter
- **Database-backed**: All operations persist immediately
- **Structured responses**: Return dict with success, message, and data
- **Error handling**: Catch exceptions and return structured error responses
- **Validation**: Use Pydantic for input validation before database operations

---

## R3: Agent-MCP Integration Pattern

### Decision
Agent orchestrator invokes tools directly as Python functions after receiving tool calls from OpenAI API. Tool results are formatted and sent back to the API in the next request.

### Rationale
- OpenAI function calling provides native tool invocation protocol
- Agent receives tool calls in API response, executes functions, and sends results back
- No separate MCP server needed - tools are Python functions in the same process
- Simpler error handling and debugging

### Alternatives Considered
1. **Separate MCP Server with HTTP**: Rejected - adds network latency and complexity
2. **Message Queue for Tool Calls**: Rejected - overkill for synchronous operations
3. **Async Tool Execution**: Rejected - adds complexity without clear benefit for hackathon scope

### Implementation Pattern

```python
class AIAgentOrchestrator:
    def __init__(self):
        self.client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=os.getenv("OPENROUTER_API_KEY")
        )
        self.tools = self._register_tools()

    def _register_tools(self) -> dict:
        """Register tool functions with their schemas."""
        return {
            "create_task": {
                "schema": create_task_tool,
                "function": create_task
            },
            # ... other tools
        }

    async def process_message(self, user_message: str, context: list,
                             user_id: str, db: Session, timeout: int = 15) -> dict:
        """Process user message with agent and execute tool calls."""
        messages = context + [{"role": "user", "content": user_message}]

        # Call OpenAI API with tools
        response = self.client.chat.completions.create(
            model="google/gemini-2.0-flash-exp",
            messages=messages,
            tools=[tool["schema"] for tool in self.tools.values()],
            tool_choice="auto"
        )

        # Check for tool calls
        if response.choices[0].message.tool_calls:
            tool_results = []
            for tool_call in response.choices[0].message.tool_calls:
                # Execute tool function
                tool_name = tool_call.function.name
                tool_args = json.loads(tool_call.function.arguments)

                # Inject user_id and db session
                tool_args["user_id"] = user_id
                tool_args["db"] = db

                # Call tool function
                result = self.tools[tool_name]["function"](**tool_args)
                tool_results.append({
                    "tool_call_id": tool_call.id,
                    "name": tool_name,
                    "input": tool_args,
                    "output": result
                })

            # Send tool results back to API for final response
            messages.append(response.choices[0].message)
            messages.append({
                "role": "tool",
                "tool_call_id": tool_results[0]["tool_call_id"],
                "content": json.dumps(tool_results[0]["output"])
            })

            final_response = self.client.chat.completions.create(
                model="google/gemini-2.0-flash-exp",
                messages=messages
            )

            return {
                "response": final_response.choices[0].message.content,
                "tool_calls": tool_results
            }

        # No tool calls - return direct response
        return {
            "response": response.choices[0].message.content,
            "tool_calls": []
        }
```

### Error Handling
- Tool execution errors caught and returned as structured error responses
- API errors (timeout, rate limit) caught and returned as user-friendly messages
- Database errors rolled back and reported to user

---

## R4: Conversation Context Management

### Decision
Retrieve last 20 messages from database, format as OpenAI message array, and include in each API request. Use database indexes on conversation_id and timestamp for fast retrieval.

### Rationale
- 20 messages provides sufficient context for most conversations (~10 user-agent exchanges)
- Database query with proper indexing achieves <100ms retrieval time
- Stateless design: no in-memory caching needed
- Simple implementation: single SELECT query with ORDER BY and LIMIT

### Alternatives Considered
1. **Full conversation history**: Rejected - may exceed LLM context window and slow down queries
2. **Context summarization**: Rejected - adds complexity and potential information loss
3. **Redis caching**: Rejected - violates stateless constraint and adds infrastructure dependency

### Implementation Pattern

```python
class ConversationContextBuilder:
    def build_context(self, messages: list[Message], system_prompt: str) -> list[dict]:
        """Build OpenAI message array from database messages."""
        context = [{"role": "system", "content": system_prompt}]

        for msg in messages:
            message_dict = {
                "role": msg.role.value,  # "user" or "assistant"
                "content": msg.message_text
            }

            # Include tool calls for assistant messages
            if msg.role == MessageRole.ASSISTANT and msg.tool_calls:
                message_dict["tool_calls"] = msg.tool_calls

            context.append(message_dict)

        return context

    def get_default_system_prompt(self) -> str:
        """Return default system prompt for todo assistant."""
        return """You are a helpful todo assistant. You help users manage their tasks through natural language.

Available tools:
- create_task: Create a new todo task
- list_tasks: List all tasks or filter by status
- get_task: Get details of a specific task
- update_task: Update task details or mark as complete
- delete_task: Delete a task (always confirm first)

Guidelines:
- Always confirm before deleting tasks
- Provide clear feedback about what actions were taken
- Handle errors gracefully with user-friendly messages
- Ask clarifying questions if user intent is unclear"""
```

### Performance Optimization
- Index on `(conversation_id, timestamp)` for fast message retrieval
- Limit to 20 messages (configurable via environment variable)
- Use `SELECT * FROM messages WHERE conversation_id = ? ORDER BY timestamp DESC LIMIT 20`
- Reverse order in Python to get chronological order

### Context Window Management
- 20 messages ≈ 2000-4000 tokens (estimated)
- Gemini 2.0 Flash context window: 1M tokens (plenty of headroom)
- If context exceeds limits, reduce CONVERSATION_HISTORY_LIMIT environment variable

---

## R5: Agent Confirmation Flow

### Decision
Store pending confirmations as special messages in the database with metadata indicating confirmation state. Agent checks for pending confirmations in conversation history and handles yes/no responses.

### Rationale
- Stateless design: confirmation state persisted in database
- Simple implementation: no separate confirmation table needed
- Natural conversation flow: confirmations are part of message history
- Timeout handling: check message timestamp to expire old confirmations

### Alternatives Considered
1. **Separate confirmations table**: Rejected - adds schema complexity without clear benefit
2. **In-memory confirmation state**: Rejected - violates stateless constraint
3. **Session-based confirmations**: Rejected - violates stateless constraint

### Implementation Pattern

```python
# Store confirmation request in message metadata
confirmation_message = Message(
    conversation_id=conversation_id,
    role=MessageRole.ASSISTANT,
    message_text="Are you sure you want to delete task 'buy groceries'? Reply yes to confirm.",
    message_metadata={
        "pending_confirmation": {
            "action": "delete_task",
            "task_id": 123,
            "expires_at": (datetime.utcnow() + timedelta(minutes=5)).isoformat()
        }
    }
)

# Check for pending confirmation in context
def check_pending_confirmation(messages: list[Message]) -> dict | None:
    """Check if last assistant message has pending confirmation."""
    if not messages:
        return None

    last_message = messages[-1]
    if last_message.role != MessageRole.ASSISTANT:
        return None

    if not last_message.message_metadata:
        return None

    confirmation = last_message.message_metadata.get("pending_confirmation")
    if not confirmation:
        return None

    # Check expiration
    expires_at = datetime.fromisoformat(confirmation["expires_at"])
    if datetime.utcnow() > expires_at:
        return None  # Expired

    return confirmation

# Handle confirmation response
if pending_confirmation := check_pending_confirmation(context_messages):
    user_response = user_message.lower().strip()

    if user_response in ["yes", "y", "confirm", "ok"]:
        # Execute the pending action
        action = pending_confirmation["action"]
        task_id = pending_confirmation["task_id"]
        result = delete_task(task_id=task_id, user_id=user_id, db=db)
        return {"response": result["message"], "tool_calls": []}

    elif user_response in ["no", "n", "cancel", "nevermind"]:
        return {"response": "Okay, I've cancelled that action.", "tool_calls": []}
```

### Timeout Handling
- Confirmations expire after 5 minutes (configurable)
- Expired confirmations ignored - user must re-request action
- Clear expiration message if user responds after timeout

---

## Research Summary

All technical unknowns resolved. Key decisions:

1. **OpenAI SDK with OpenRouter**: Use `base_url` parameter for OpenRouter API
2. **Direct Tool Functions**: No separate MCP server - tools are Python functions
3. **Function Calling Protocol**: OpenAI function calling provides tool invocation
4. **Database-backed Context**: Retrieve last 20 messages per request
5. **Metadata-based Confirmations**: Store confirmation state in message metadata

**Ready for Phase 1 (Design & Contracts)**.
