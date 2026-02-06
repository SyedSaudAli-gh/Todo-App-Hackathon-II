# Quickstart Guide: AI-Powered Todo Chatbot Backend

**Feature**: 001-ai-todo-chatbot
**Date**: 2026-02-02
**Purpose**: Setup and configuration guide for local development

## Overview

This guide walks you through setting up the AI-powered todo chatbot backend for local development. The system uses OpenAI Agents SDK with OpenRouter API, stateless FastAPI backend, and PostgreSQL database.

**Prerequisites**:
- Python 3.13+
- PostgreSQL (or Neon Serverless PostgreSQL account)
- OpenRouter API account and API key
- Git

---

## Step 1: Environment Setup

### 1.1 Clone Repository

```bash
git clone <repository-url>
cd Todo-App-Hackathon-II
git checkout 001-ai-todo-chatbot
```

### 1.2 Create Virtual Environment

```bash
cd api
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

### 1.3 Install Dependencies

Update `requirements.txt` with Phase III dependencies:

```bash
# Install existing + new dependencies
pip install -r requirements.txt
```

**New dependencies for Phase III**:
```text
openai>=1.0.0                    # OpenAI SDK (includes Agents functionality)
httpx>=0.24.0                    # HTTP client for OpenRouter
tenacity>=8.2.0                  # Retry logic for API calls
```

---

## Step 2: Database Configuration

### 2.1 Get Database Connection String

**Option A: Neon Serverless PostgreSQL (Recommended)**
1. Sign up at https://neon.tech
2. Create a new project
3. Copy the connection string (format: `postgresql://user:pass@host/dbname`)

**Option B: Local PostgreSQL**
1. Install PostgreSQL locally
2. Create database: `createdb todo_chatbot`
3. Connection string: `postgresql://localhost/todo_chatbot`

### 2.2 Configure Environment Variables

Create `.env` file in `api/` directory:

```bash
# Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# Authentication (existing)
JWT_SECRET_KEY=your-secret-key-here
CORS_ORIGINS=http://localhost:3000

# OpenRouter API (NEW - Phase III)
OPENROUTER_API_KEY=sk-or-v1-your-key-here
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
AGENT_MODEL=google/gemini-2.0-flash-exp
AGENT_TIMEOUT=15
CONVERSATION_HISTORY_LIMIT=20
```

**Important**:
- Use `OPENROUTER_API_KEY`, NOT `OPENAI_API_KEY`
- Get your OpenRouter API key from https://openrouter.ai/keys

### 2.3 Run Database Migrations

```bash
# From api/ directory
alembic upgrade head
```

This will create:
- `todos` table (existing)
- `conversations` table (new)
- `messages` table (new)

**Verify migrations**:
```bash
# Check current migration version
alembic current

# Should show: 004 (head)
```

---

## Step 3: Verify Installation

### 3.1 Check Database Tables

```bash
# Connect to database
psql $DATABASE_URL

# List tables
\dt

# Should see:
# - todos
# - conversations
# - messages
# - alembic_version

# Exit psql
\q
```

### 3.2 Test OpenRouter Connection

Create `test_openrouter.py`:

```python
import os
from openai import OpenAI

client = OpenAI(
    base_url=os.getenv("OPENROUTER_BASE_URL"),
    api_key=os.getenv("OPENROUTER_API_KEY")
)

response = client.chat.completions.create(
    model="google/gemini-2.0-flash-exp",
    messages=[{"role": "user", "content": "Hello!"}]
)

print(response.choices[0].message.content)
```

Run test:
```bash
python test_openrouter.py
# Should print a response from Gemini
```

---

## Step 4: Start Development Server

### 4.1 Start FastAPI Server

```bash
# From api/ directory
uvicorn src.main:app --reload --port 8000
```

**Expected output**:
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

### 4.2 Verify API is Running

Open browser to http://localhost:8000/docs

You should see:
- Swagger UI with API documentation
- `/api/v1/chat` endpoint (POST)
- `/api/v1/todos` endpoints (existing)
- `/health` endpoint

---

## Step 5: Test Chat Endpoint

### 5.1 Get Authentication Token

**Option A: Use existing user**
```bash
# If you have existing authentication setup
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password"}'
```

**Option B: Create test user**
```bash
# Sign up new user
curl -X POST http://localhost:8000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "testpass123"}'
```

Copy the JWT token from the response.

### 5.2 Send Chat Message

```bash
# Replace YOUR_JWT_TOKEN with actual token
curl -X POST http://localhost:8000/api/v1/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "message": "Create a task to buy groceries"
  }'
```

**Expected response**:
```json
{
  "conversation_id": "550e8400-e29b-41d4-a716-446655440000",
  "response": "I've created a task for you: 'Buy groceries'. Is there anything else you'd like me to help with?",
  "tool_calls": [
    {
      "tool_call_id": "call_abc123",
      "name": "create_task",
      "input": {
        "title": "Buy groceries"
      },
      "output": {
        "task_id": 1,
        "success": true,
        "message": "Created task: Buy groceries"
      }
    }
  ],
  "timestamp": "2026-02-02T14:30:00Z"
}
```

### 5.3 Continue Conversation

```bash
# Use conversation_id from previous response
curl -X POST http://localhost:8000/api/v1/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "conversation_id": "550e8400-e29b-41d4-a716-446655440000",
    "message": "What tasks do I have?"
  }'
```

---

## Step 6: Verify Stateless Architecture

### 6.1 Test Server Restart

1. Send a chat message and note the conversation_id
2. Stop the FastAPI server (Ctrl+C)
3. Restart the server: `uvicorn src.main:app --reload --port 8000`
4. Send another message with the same conversation_id
5. Verify the agent has full conversation context

**This proves the stateless architecture**: All conversation state is reconstructed from the database on every request.

### 6.2 Check Database Persistence

```bash
# Connect to database
psql $DATABASE_URL

# Check conversations
SELECT * FROM conversations;

# Check messages
SELECT conversation_id, role, message_text, timestamp
FROM messages
ORDER BY timestamp;

# Check tool calls (embedded in messages)
SELECT message_text, tool_calls
FROM messages
WHERE tool_calls IS NOT NULL;

# Exit
\q
```

---

## Troubleshooting

### Issue: "OPENROUTER_API_KEY not found"

**Solution**: Ensure `.env` file exists in `api/` directory and contains `OPENROUTER_API_KEY=sk-or-v1-...`

**Verify**:
```bash
cd api
cat .env | grep OPENROUTER_API_KEY
```

### Issue: "Database connection failed"

**Solution**: Check `DATABASE_URL` in `.env` file

**Verify**:
```bash
# Test connection
psql $DATABASE_URL -c "SELECT 1;"
```

### Issue: "Alembic migration failed"

**Solution**: Check if database exists and is accessible

**Debug**:
```bash
# Check current migration
alembic current

# Check migration history
alembic history

# Downgrade and re-upgrade
alembic downgrade -1
alembic upgrade head
```

### Issue: "OpenRouter API error"

**Solution**: Verify API key is valid and has credits

**Test**:
```bash
curl https://openrouter.ai/api/v1/models \
  -H "Authorization: Bearer $OPENROUTER_API_KEY"
```

### Issue: "Agent timeout"

**Solution**: Increase `AGENT_TIMEOUT` in `.env`

```bash
# Increase timeout to 30 seconds
AGENT_TIMEOUT=30
```

### Issue: "Tool call failed"

**Solution**: Check database connection and tool implementation

**Debug**:
```bash
# Check FastAPI logs for detailed error
# Look for tool execution errors in console output
```

---

## Development Workflow

### Running Tests

```bash
# From api/ directory
pytest tests/

# Run specific test file
pytest tests/test_api/test_chat.py

# Run with coverage
pytest --cov=src tests/
```

### Database Migrations

**Create new migration**:
```bash
alembic revision -m "description"
```

**Apply migrations**:
```bash
alembic upgrade head
```

**Rollback migration**:
```bash
alembic downgrade -1
```

### Code Formatting

```bash
# Format code with black
black src/

# Check types with mypy
mypy src/

# Lint with flake8
flake8 src/
```

---

## Next Steps

After completing this quickstart:

1. **Review Implementation Plan**: Read `specs/001-ai-todo-chatbot/plan.md`
2. **Review Contracts**: Study API and tool contracts in `specs/001-ai-todo-chatbot/contracts/`
3. **Run Tests**: Execute test suite to verify everything works
4. **Start Development**: Begin implementing tasks from `tasks.md` (after running `/sp.tasks`)

---

## Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | Yes | - | PostgreSQL connection string |
| `JWT_SECRET_KEY` | Yes | - | Secret key for JWT tokens |
| `CORS_ORIGINS` | Yes | - | Allowed CORS origins (comma-separated) |
| `OPENROUTER_API_KEY` | Yes | - | OpenRouter API key (NOT OpenAI key) |
| `OPENROUTER_BASE_URL` | No | `https://openrouter.ai/api/v1` | OpenRouter API base URL |
| `AGENT_MODEL` | No | `google/gemini-2.0-flash-exp` | LLM model to use |
| `AGENT_TIMEOUT` | No | `15` | Agent processing timeout (seconds) |
| `CONVERSATION_HISTORY_LIMIT` | No | `20` | Max messages for context |

---

## Additional Resources

- **OpenRouter Documentation**: https://openrouter.ai/docs
- **OpenAI SDK Documentation**: https://platform.openai.com/docs/api-reference
- **FastAPI Documentation**: https://fastapi.tiangolo.com
- **SQLModel Documentation**: https://sqlmodel.tiangolo.com
- **Alembic Documentation**: https://alembic.sqlalchemy.org

---

## Support

If you encounter issues not covered in this guide:

1. Check the troubleshooting section above
2. Review the implementation plan and contracts
3. Check FastAPI logs for detailed error messages
4. Verify all environment variables are set correctly
5. Ensure database migrations are up to date

**Setup complete! You're ready to start development.**
