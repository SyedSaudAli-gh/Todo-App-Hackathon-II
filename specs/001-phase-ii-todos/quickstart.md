# Quickstart: Phase II Todo Management

**Feature**: Phase II Todo Management
**Branch**: `001-phase-ii-todos`
**Date**: 2026-01-06
**Status**: Complete

## Overview

This guide provides step-by-step instructions for setting up and running the Phase II Todo Management application locally. The application consists of three components:
1. **Database**: Neon PostgreSQL (serverless)
2. **Backend**: FastAPI (Python 3.13+)
3. **Frontend**: Next.js (Node.js 18+)

## Prerequisites

### Required Software

- **Python 3.13+**: [Download](https://www.python.org/downloads/)
- **Node.js 18+**: [Download](https://nodejs.org/)
- **Git**: [Download](https://git-scm.com/)
- **Neon Account**: [Sign up](https://neon.tech/) (free tier available)

### Verify Installation

```bash
# Check Python version
python --version  # Should be 3.13 or higher

# Check Node.js version
node --version  # Should be 18 or higher

# Check npm version
npm --version

# Check Git version
git --version
```

## Database Setup (Neon PostgreSQL)

### 1. Create Neon Project

1. Go to [Neon Console](https://console.neon.tech/)
2. Click "Create Project"
3. Choose a project name: `todo-app-phase-ii`
4. Select region closest to you
5. Click "Create Project"

### 2. Get Database Connection String

1. In Neon Console, go to your project
2. Click "Connection Details"
3. Copy the connection string (format: `postgresql://user:password@host/dbname`)
4. Save this for later - you'll need it for backend configuration

**Example Connection String**:
```
postgresql://username:password@ep-cool-darkness-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
```

### 3. Create Database (Optional)

Neon creates a default database (`neondb`). You can use this or create a new one:

```sql
-- Connect to Neon using psql or Neon SQL Editor
CREATE DATABASE todos_db;
```

## Backend Setup (FastAPI)

### 1. Navigate to Backend Directory

```bash
cd api
```

### 2. Create Virtual Environment

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

### 3. Install Dependencies

```bash
# Install Python packages
pip install -r requirements.txt
```

**requirements.txt** should contain:
```
fastapi==0.100.0
uvicorn[standard]==0.23.0
sqlmodel==0.0.14
alembic==1.12.0
pydantic==2.4.0
pydantic-settings==2.0.0
psycopg2-binary==2.9.9
python-dotenv==1.0.0
pytest==7.4.0
pytest-asyncio==0.21.0
httpx==0.24.0
```

### 4. Configure Environment Variables

Create `.env` file in `api/` directory:

```bash
# Copy example file
cp .env.example .env

# Edit .env with your values
```

**.env** contents:
```env
# Database
DATABASE_URL=postgresql://username:password@host/dbname?sslmode=require

# API Configuration
API_VERSION=v1
DEBUG=true

# CORS (Frontend URL)
CORS_ORIGINS=http://localhost:3000

# Server
HOST=0.0.0.0
PORT=8000
```

**Important**: Replace `DATABASE_URL` with your Neon connection string from step 2.

### 5. Run Database Migrations

```bash
# Initialize Alembic (first time only)
alembic init alembic

# Create initial migration
alembic revision --autogenerate -m "Create todos table"

# Apply migrations
alembic upgrade head
```

### 6. Start Backend Server

```bash
# Start development server
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

**Expected Output**:
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [12345] using StatReload
INFO:     Started server process [12346]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

### 7. Verify Backend

Open browser and navigate to:
- **API Docs**: http://localhost:8000/api/v1/docs
- **Health Check**: http://localhost:8000/health

You should see the Swagger UI with all API endpoints.

## Frontend Setup (Next.js)

### 1. Navigate to Frontend Directory

Open a **new terminal** (keep backend running) and navigate to frontend:

```bash
cd web
```

### 2. Install Dependencies

```bash
# Install Node packages
npm install
```

**package.json** should contain:
```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "typescript": "^5.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "tailwindcss": "^3.0.0",
    "autoprefixer": "^10.0.0",
    "postcss": "^8.0.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "^15.0.0"
  }
}
```

### 3. Configure Environment Variables

Create `.env.local` file in `web/` directory:

```bash
# Copy example file
cp .env.local.example .env.local

# Edit .env.local with your values
```

**.env.local** contents:
```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_API_VERSION=v1
```

### 4. Start Frontend Server

```bash
# Start development server
npm run dev
```

**Expected Output**:
```
   ▲ Next.js 15.0.0
   - Local:        http://localhost:3000
   - Network:      http://192.168.1.100:3000

 ✓ Ready in 2.5s
```

### 5. Verify Frontend

Open browser and navigate to:
- **Home Page**: http://localhost:3000

You should see the Todo application interface.

## Testing the Application

### 1. Create a Todo

1. Open http://localhost:3000
2. Enter a title: "Buy groceries"
3. (Optional) Enter description: "Milk, eggs, bread"
4. Click "Create Todo"
5. Todo should appear in the list

### 2. Mark Todo Complete

1. Click the checkbox next to the todo
2. Todo should show strikethrough styling
3. Refresh page - completion status should persist

### 3. Update Todo

1. Click "Edit" button on a todo
2. Change title or description
3. Click "Save"
4. Changes should be reflected immediately

### 4. Delete Todo

1. Click "Delete" button on a todo
2. Confirm deletion in dialog
3. Todo should disappear from list

## Running Tests

### Backend Tests

```bash
# Navigate to backend directory
cd api

# Run all tests
pytest

# Run with coverage
pytest --cov=src --cov-report=html

# Run specific test file
pytest tests/test_api/test_todos.py

# Run with verbose output
pytest -v
```

### Frontend Tests

```bash
# Navigate to frontend directory
cd web

# Run unit tests
npm test

# Run with coverage
npm test -- --coverage

# Run E2E tests
npm run test:e2e

# Run specific test file
npm test -- TodoList.test.tsx
```

## Development Workflow

### 1. Start All Services

**Terminal 1 - Backend**:
```bash
cd api
source venv/bin/activate  # or venv\Scripts\activate on Windows
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend**:
```bash
cd web
npm run dev
```

### 2. Make Changes

- **Backend**: Edit files in `api/src/`, server auto-reloads
- **Frontend**: Edit files in `web/src/`, page auto-refreshes
- **Database**: Create migration with `alembic revision --autogenerate`

### 3. Run Tests

Always run tests before committing:
```bash
# Backend
cd api && pytest

# Frontend
cd web && npm test
```

### 4. Commit Changes

```bash
git add .
git commit -m "feat: add todo completion toggle"
git push origin 001-phase-ii-todos
```

## Troubleshooting

### Backend Issues

**Problem**: `ModuleNotFoundError: No module named 'fastapi'`
- **Solution**: Activate virtual environment and install dependencies
  ```bash
  source venv/bin/activate
  pip install -r requirements.txt
  ```

**Problem**: `sqlalchemy.exc.OperationalError: could not connect to server`
- **Solution**: Check DATABASE_URL in `.env` file
- Verify Neon database is running
- Check network connectivity

**Problem**: `alembic.util.exc.CommandError: Can't locate revision identified by`
- **Solution**: Reset migrations
  ```bash
  alembic downgrade base
  alembic upgrade head
  ```

### Frontend Issues

**Problem**: `Error: Cannot find module 'next'`
- **Solution**: Install dependencies
  ```bash
  npm install
  ```

**Problem**: `Failed to fetch todos`
- **Solution**: Check backend is running at http://localhost:8000
- Verify NEXT_PUBLIC_API_BASE_URL in `.env.local`
- Check CORS configuration in backend

**Problem**: `TypeError: Cannot read property 'map' of undefined`
- **Solution**: Check API response format matches TypeScript types
- Verify backend is returning correct JSON structure

### Database Issues

**Problem**: `relation "todos" does not exist`
- **Solution**: Run migrations
  ```bash
  cd api
  alembic upgrade head
  ```

**Problem**: `password authentication failed`
- **Solution**: Verify Neon connection string in `.env`
- Check username and password are correct
- Ensure `?sslmode=require` is in connection string

## Environment Variables Reference

### Backend (.env)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| DATABASE_URL | Yes | - | Neon PostgreSQL connection string |
| API_VERSION | No | v1 | API version prefix |
| DEBUG | No | false | Enable debug mode |
| CORS_ORIGINS | Yes | - | Allowed frontend origins (comma-separated) |
| HOST | No | 0.0.0.0 | Server host |
| PORT | No | 8000 | Server port |

### Frontend (.env.local)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| NEXT_PUBLIC_API_BASE_URL | Yes | - | Backend API base URL |
| NEXT_PUBLIC_API_VERSION | No | v1 | API version to use |

## Production Deployment

### Backend (Railway/Render)

1. **Connect Repository**: Link GitHub repository
2. **Configure Environment**: Set DATABASE_URL, CORS_ORIGINS
3. **Build Command**: `pip install -r requirements.txt`
4. **Start Command**: `alembic upgrade head && uvicorn src.main:app --host 0.0.0.0 --port $PORT`
5. **Health Check**: `/health` endpoint

### Frontend (Vercel)

1. **Connect Repository**: Link GitHub repository
2. **Configure Environment**: Set NEXT_PUBLIC_API_BASE_URL
3. **Build Settings**: Auto-detected by Vercel
4. **Deploy**: Automatic on push to main branch

### Database (Neon)

- Already hosted and managed
- No additional deployment needed
- Consider upgrading to paid tier for production

## Next Steps

After completing this quickstart:

1. **Review Documentation**:
   - [spec.md](./spec.md) - Feature specification
   - [plan.md](./plan.md) - Implementation plan
   - [data-model.md](./data-model.md) - Database schema
   - [contracts/](./contracts/) - API contracts

2. **Run Tests**: Ensure all tests pass
   ```bash
   cd api && pytest
   cd web && npm test
   ```

3. **Explore API**: Use Swagger UI at http://localhost:8000/api/v1/docs

4. **Customize**: Modify components, add features, improve styling

## Support

For issues or questions:
- Check [Troubleshooting](#troubleshooting) section
- Review error logs in terminal
- Consult documentation in `specs/001-phase-ii-todos/`
- Check Phase II Constitution in `.specify/memory/constitution.md`

## References

- [Next.js Documentation](https://nextjs.org/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Neon Documentation](https://neon.tech/docs)
- [SQLModel Documentation](https://sqlmodel.tiangolo.com/)
- [Alembic Documentation](https://alembic.sqlalchemy.org/)

---

**Last Updated**: 2026-01-06
**Version**: 1.0.0
**Status**: Ready for Implementation
