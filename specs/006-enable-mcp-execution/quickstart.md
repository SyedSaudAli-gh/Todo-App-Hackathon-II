# Quickstart Guide: Enable Real MCP Tool Execution

**Feature**: 006-enable-mcp-execution
**Date**: 2026-02-03
**Phase**: Phase 1 - Design & Contracts

## Overview

This guide walks you through setting up and testing the AI Todo Assistant with real MCP tool execution. By the end, you'll have a working chatbot that performs actual database operations for task management.

## Prerequisites

### Required Software

- **Python**: 3.13 or higher
- **Node.js**: 18 or higher
- **PostgreSQL**: Neon PostgreSQL account (free tier)
- **Git**: For cloning the repository

### Required Accounts

- **OpenRouter**: Free account with API key ([openrouter.ai](https://openrouter.ai))
- **Neon**: PostgreSQL database ([neon.tech](https://neon.tech))

### Development Tools

- Code editor (VS Code recommended)
- Terminal/Command line
- Web browser (Chrome/Firefox recommended)

---

## Step 1: Clone and Setup Repository

```bash
# Clone the repository
git clone <repository-url>
cd Todo-App-Hackathon-II

# Checkout the feature branch
git checkout 006-enable-mcp-execution
```

---

## Step 2: Backend Setup

### 2.1 Install Python Dependencies

```bash
cd api

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2.2 Configure Environment Variables

Create `.env` file in `api/` directory:

```bash
# Database Configuration
DATABASE_URL=postgresql://user:password@host/database

# OpenRouter API Configuration
OPENROUTER_API_KEY=your_openrouter_api_key_here

# Model Configuration
OPENROUTER_MODEL=mistralai/mistral-7b-instruct

# Application Configuration
SECRET_KEY=your_secret_key_here
ENVIRONMENT=development
```

**Getting your OpenRouter API Key**:
1. Sign up at [openrouter.ai](https://openrouter.ai)
2. Navigate to API Keys section
3. Create a new API key
4. Copy the key to your `.env` file

**Getting your Neon Database URL**:
1. Sign up at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Paste into `DATABASE_URL` in `.env`

### 2.3 Run Database Migrations

```bash
# Run migrations to create tables
alembic upgrade head

# Verify migrations
alembic current
```

Expected output:
```
INFO  [alembic.runtime.migration] Running upgrade -> 003, Create conversations table
INFO  [alembic.runtime.migration] Running upgrade 003 -> 004, Create messages table
INFO  [alembic.runtime.migration] Running upgrade 004 -> 005, Create tool_calls table
```

### 2.4 Start Backend Server

```bash
# Start FastAPI server
uvicorn src.main:app --reload --port 8000
```

Expected output:
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

**Verify backend is running**:
- Open browser to http://localhost:8000/docs
- You should see the Swagger API documentation

---

## Step 3: Frontend Setup

### 3.1 Install Node Dependencies

Open a new terminal window:

```bash
cd web

# Install dependencies
npm install
```

### 3.2 Configure Environment Variables

Create `.env.local` file in `web/` directory:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# Authentication (if applicable)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here
```

### 3.3 Start Frontend Server

```bash
# Start Next.js development server
npm run dev
```

Expected output:
```
   ▲ Next.js 15.0.0
   - Local:        http://localhost:3000
   - Ready in 2.3s
```

**Verify frontend is running**:
- Open browser to http://localhost:3000
- You should see the Todo App homepage

---

## Step 4: Testing the Agent

### 4.1 Create a Test User (if needed)

If you don't have a user account, create one through the signup flow or use the API:

```bash
curl -X POST http://localhost:8000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpassword123"
  }'
```

### 4.2 Start a Conversation

**Via Frontend**:
1. Navigate to http://localhost:3000/chat
2. Click "New Conversation"
3. You should see an empty chat interface

**Via API**:
```bash
curl -X POST http://localhost:8000/api/v1/chat/conversations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "user_id": 1
  }'
```

Expected response:
```json
{
  "conversation_id": 1,
  "user_id": 1,
  "created_at": "2026-02-03T10:30:00Z",
  "updated_at": "2026-02-03T10:30:00Z"
}
```

### 4.3 Test Task Creation

**Via Frontend**:
1. Type: "Create a task to buy groceries"
2. Press Enter
3. Wait for agent response (should be <3 seconds)

**Expected Agent Response**:
```
I've created a task 'Buy groceries' for you (Task ID: 1)
```

**Via API**:
```bash
curl -X POST http://localhost:8000/api/v1/chat/conversations/1/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "content": "Create a task to buy groceries"
  }'
```

Expected response:
```json
{
  "message_id": 2,
  "conversation_id": 1,
  "role": "assistant",
  "content": "I've created a task 'Buy groceries' for you (Task ID: 1)",
  "tool_calls": [
    {
      "id": 1,
      "tool_name": "add_task",
      "tool_input": {
        "title": "Buy groceries",
        "user_id": 1
      },
      "tool_output": {
        "task_id": 1,
        "title": "Buy groceries",
        "status": "pending"
      },
      "status": "success"
    }
  ],
  "created_at": "2026-02-03T10:35:00Z"
}
```

### 4.4 Verify Database Persistence

**Check the database**:
```sql
-- Connect to your Neon database
psql $DATABASE_URL

-- Check if task was created
SELECT * FROM todos WHERE id = 1;

-- Check conversation and messages
SELECT * FROM conversations WHERE id = 1;
SELECT * FROM messages WHERE conversation_id = 1;
SELECT * FROM tool_calls WHERE message_id = 2;
```

Expected results:
- Todo with ID 1 should exist with title "Buy groceries"
- Conversation with ID 1 should exist
- Two messages should exist (user message and agent response)
- One tool call should exist for add_task

### 4.5 Test Task Listing

**Via Frontend**:
1. Type: "Show me my tasks"
2. Press Enter

**Expected Agent Response**:
```
You have 1 task:
1. Buy groceries (pending)
```

**Via API**:
```bash
curl -X POST http://localhost:8000/api/v1/chat/conversations/1/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "content": "Show me my tasks"
  }'
```

### 4.6 Test Task Update

**Via Frontend**:
1. Type: "Mark task 1 as complete"
2. Press Enter

**Expected Agent Response**:
```
I've marked task 1 'Buy groceries' as completed
```

**Verify in database**:
```sql
SELECT status FROM todos WHERE id = 1;
-- Should return: completed
```

### 4.7 Test Task Deletion

**Via Frontend**:
1. Type: "Delete task 1"
2. Agent should ask for confirmation: "Are you sure you want to delete task 1 'Buy groceries'? (yes/no)"
3. Type: "yes"
4. Press Enter

**Expected Agent Response**:
```
I've deleted task 1 'Buy groceries'
```

**Verify in database**:
```sql
SELECT * FROM todos WHERE id = 1;
-- Should return: no rows
```

---

## Step 5: Verification Checklist

Use this checklist to verify everything is working correctly:

### Backend Verification

- [ ] FastAPI server running on http://localhost:8000
- [ ] Swagger docs accessible at http://localhost:8000/docs
- [ ] Database migrations applied successfully
- [ ] OpenRouter API key configured correctly
- [ ] Database connection working

### Frontend Verification

- [ ] Next.js server running on http://localhost:3000
- [ ] Chat interface accessible
- [ ] Can create new conversations
- [ ] Can send messages to agent

### Agent Verification

- [ ] Agent responds to messages within 3 seconds
- [ ] Agent calls add_task tool when asked to create tasks
- [ ] Agent calls list_tasks tool when asked to show tasks
- [ ] Agent calls update_task tool when asked to modify tasks
- [ ] Agent calls delete_task tool when asked to delete tasks
- [ ] Agent asks for confirmation before deleting tasks

### Database Verification

- [ ] Tasks created via chat appear in todos table
- [ ] Conversations persist in conversations table
- [ ] Messages persist in messages table
- [ ] Tool calls persist in tool_calls table
- [ ] Data survives server restart

### Integration Verification

- [ ] Tasks created via chat appear in todo list UI
- [ ] Task updates via chat reflect in todo list UI
- [ ] Task deletions via chat remove from todo list UI
- [ ] Conversation history loads correctly
- [ ] No simulated responses (all operations use real tools)

---

## Troubleshooting

### Backend Issues

**Problem**: `ModuleNotFoundError: No module named 'openai'`
- **Solution**: Install dependencies: `pip install -r requirements.txt`

**Problem**: `sqlalchemy.exc.OperationalError: could not connect to server`
- **Solution**: Check DATABASE_URL in .env file, verify Neon database is accessible

**Problem**: `openai.AuthenticationError: Invalid API key`
- **Solution**: Verify OPENROUTER_API_KEY in .env file, check key is valid on OpenRouter

**Problem**: Agent responses are slow (>5 seconds)
- **Solution**: Check OpenRouter API status, consider switching to faster model

### Frontend Issues

**Problem**: `Error: connect ECONNREFUSED 127.0.0.1:8000`
- **Solution**: Ensure backend server is running on port 8000

**Problem**: Chat interface not loading
- **Solution**: Check browser console for errors, verify API URL in .env.local

**Problem**: Messages not sending
- **Solution**: Check authentication token, verify user is logged in

### Database Issues

**Problem**: Migrations fail with "relation already exists"
- **Solution**: Drop tables and re-run migrations: `alembic downgrade base && alembic upgrade head`

**Problem**: Tool calls not persisting
- **Solution**: Check tool_calls table exists, verify migration 005 ran successfully

### Agent Issues

**Problem**: Agent returns "I don't have access to that information"
- **Solution**: Verify tools are registered correctly, check agent configuration

**Problem**: Agent hallucinates task data instead of using tools
- **Solution**: Verify tool definitions are passed to agent, check agent instructions

**Problem**: Tool execution errors not handled gracefully
- **Solution**: Check error handling in tool functions, verify error responses are structured

---

## Next Steps

After completing this quickstart:

1. **Explore the codebase**:
   - Review MCP tool implementations in `api/src/mcp/tools/`
   - Review agent service in `api/src/services/agent_service.py`
   - Review chat API endpoints in `api/src/routers/chat.py`

2. **Run tests**:
   ```bash
   # Backend tests
   cd api
   pytest

   # Frontend tests
   cd web
   npm test
   ```

3. **Review documentation**:
   - Read `specs/006-enable-mcp-execution/data-model.md` for database schema
   - Read `specs/006-enable-mcp-execution/contracts/` for API contracts
   - Read `specs/006-enable-mcp-execution/research.md` for technical decisions

4. **Customize the agent**:
   - Modify agent instructions in `api/src/ai/config.py`
   - Add new tools in `api/src/mcp/tools/`
   - Update tool definitions in `api/src/ai/agent.py`

---

## Support

If you encounter issues not covered in this guide:

1. Check the project documentation in `specs/006-enable-mcp-execution/`
2. Review error logs in terminal output
3. Check database logs in Neon dashboard
4. Review OpenRouter API logs in OpenRouter dashboard
5. Create an issue in the project repository

---

## Summary

You now have a working AI Todo Assistant with real MCP tool execution:

✅ Backend server running with FastAPI
✅ Frontend server running with Next.js
✅ Database configured with Neon PostgreSQL
✅ Agent configured with OpenRouter API
✅ MCP tools executing real database operations
✅ Conversation history persisting across sessions
✅ Tool calls tracked for audit purposes

The agent can now:
- Create tasks via natural language
- List tasks with filtering
- Update task status and details
- Delete tasks with confirmation
- Maintain conversation context
- Handle errors gracefully

All operations persist to the database and are immediately visible in the UI!
