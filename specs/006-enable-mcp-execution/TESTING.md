# Testing Guide: MCP Tool Execution

## Prerequisites

1. **OpenRouter API Key**: Set in `api/.env`
   ```bash
   OPENROUTER_API_KEY=sk-or-v1-your-actual-key-here
   ```

2. **Database**: Neon PostgreSQL connection configured
   ```bash
   DATABASE_URL=postgresql+psycopg://...
   ```

## Start Backend

```bash
cd api
uvicorn src.main:app --reload --port 8000
```

Expected output:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete.
```

## Start Frontend

```bash
cd web
npm run dev
```

Expected output:
```
▲ Next.js 15.0.0
- Local:        http://localhost:3000
```

## Test Scenarios

### Test 1: Create Task (User Story 1)

**Navigate to**: http://localhost:3000/chat

**Send message**: "Create a task to buy groceries"

**Expected behavior**:
1. Loading indicator appears
2. Agent responds with confirmation
3. Tool execution visible (if UI displays it)
4. Response: "I've created a task 'Buy groceries' for you (Task ID: X)"

**Verify in database**:
```bash
cd api
python -c "
from sqlalchemy import create_engine, text
from src.config import settings
engine = create_engine(settings.DATABASE_URL)
with engine.connect() as conn:
    result = conn.execute(text('SELECT id, title, completed FROM todos ORDER BY id DESC LIMIT 5'))
    print('Recent tasks:')
    for row in result:
        print(f'  ID {row[0]}: {row[1]} (completed: {row[2]})')
"
```

### Test 2: List Tasks (User Story 2)

**Send message**: "Show me my tasks"

**Expected behavior**:
1. Agent calls list_tasks tool
2. Returns actual tasks from database
3. Response format: "You have X tasks: 1. Buy groceries (pending), ..."

**Verify tool execution**:
- Check backend logs for "AI orchestrator" messages
- Look for tool_calls in the response

### Test 3: Verify No Simulation

**Key verification**: The agent should NOT say things like:
- ❌ "I don't have access to your tasks"
- ❌ "I can't create tasks"
- ❌ "Here's an example of what I could do"

Instead, it should:
- ✅ Actually create the task in the database
- ✅ Return real task data from the database
- ✅ Show tool execution results

## Debugging

### Backend Logs

Watch for these log messages:
```
✅ Step 6: Calling AI orchestrator
✅ Step 6: AI response received
```

### Check Tool Execution

```bash
cd api
python -c "
from src.ai.orchestrator import AIAgentOrchestrator
orch = AIAgentOrchestrator()
print('Tools registered:', list(orch.tools.keys()))
print('Tool schemas:', len([t['schema'] for t in orch.tools.values()]))
"
```

### Test Chat API Directly

```bash
curl -X POST http://localhost:8000/api/v1/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Create a task to test the API"}'
```

Expected response:
```json
{
  "conversation_id": "...",
  "response": "I've created a task...",
  "tool_calls": [
    {
      "name": "create_task",
      "input": {"title": "test the API"},
      "output": {"success": true, "task_id": 123}
    }
  ],
  "timestamp": "..."
}
```

## Common Issues

### Issue 1: "AI error: ..."

**Cause**: OpenRouter API key not set or invalid

**Fix**: Check `api/.env` has valid `OPENROUTER_API_KEY`

### Issue 2: Agent doesn't call tools

**Cause**: Model doesn't support tool calling

**Fix**: Verify using Mistral 7B Instruct (supports tools)

### Issue 3: "Task not found" when listing

**Cause**: No tasks in database for the user

**Fix**: Create a task first, then list

### Issue 4: Database connection error

**Cause**: DATABASE_URL not configured

**Fix**: Check `api/.env` has valid Neon PostgreSQL URL

## Success Criteria

✅ **User Story 1 (Create Task)**:
- Message "Create a task to buy groceries" → task appears in database
- Agent confirms with task ID
- Task visible in todo list UI

✅ **User Story 2 (List Tasks)**:
- Message "Show me my tasks" → returns actual database tasks
- Response includes task titles and statuses
- No simulated/fake data

## Next Steps After Testing

If tests pass:
- ✅ Mark US1 and US2 integration tasks as complete
- Continue with US3 (Update Task) and US4 (Delete Task)
- Add UI enhancements for tool result display

If tests fail:
- Check backend logs for errors
- Verify OpenRouter API key is valid
- Test tool execution directly (see debugging section)
- Review orchestrator code for issues
