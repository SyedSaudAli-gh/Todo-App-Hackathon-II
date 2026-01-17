# Todo Management API - Backend

FastAPI backend for Phase II Todo Management application.

## Tech Stack

- **Framework**: FastAPI 0.100+
- **Language**: Python 3.13+
- **ORM**: SQLModel (SQLAlchemy + Pydantic)
- **Database**: Neon PostgreSQL (serverless)
- **Migrations**: Alembic
- **Validation**: Pydantic v2
- **Testing**: pytest, FastAPI TestClient

## Prerequisites

- Python 3.13 or higher
- Neon PostgreSQL account and database
- Virtual environment tool (venv)

## Setup Instructions

### 1. Create Virtual Environment

```bash
cd api
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Create `.env` file from example:

```bash
cp .env.example .env
```

Edit `.env` and set your Neon PostgreSQL connection string:

```env
DATABASE_URL=postgresql://username:password@host:5432/dbname?sslmode=require
CORS_ORIGINS=http://localhost:3000
API_VERSION=v1
DEBUG=true
HOST=0.0.0.0
PORT=8000
```

### 4. Run Database Migrations

```bash
# Create initial migration (if not exists)
alembic revision --autogenerate -m "Create todos table"

# Apply migrations
alembic upgrade head
```

### 5. Start Development Server

```bash
uvicorn src.main:app --reload --port 8001
```

The API will be available at:
- **API**: http://localhost:8000
- **Docs**: http://localhost:8000/api/v1/docs
- **ReDoc**: http://localhost:8000/api/v1/redoc

## Project Structure

```
api/
├── src/
│   ├── models/          # SQLModel database models
│   ├── schemas/         # Pydantic request/response models
│   ├── routers/         # API endpoints
│   ├── services/        # Business logic
│   ├── middleware/      # Custom middleware
│   ├── database.py      # Database connection
│   ├── config.py        # Configuration management
│   └── main.py          # FastAPI app initialization
├── alembic/             # Database migrations
│   └── versions/        # Migration files
├── tests/               # Test suite
│   ├── test_api/        # API endpoint tests
│   ├── test_models/     # Database model tests
│   └── test_services/   # Business logic tests
├── requirements.txt     # Python dependencies
└── .env.example         # Environment variable template
```

## API Endpoints

### Health Check
- `GET /health` - Health check endpoint

### Todos (Phase 3+)
- `GET /api/v1/todos` - List all todos
- `POST /api/v1/todos` - Create new todo
- `GET /api/v1/todos/{id}` - Get single todo
- `PATCH /api/v1/todos/{id}` - Update todo
- `DELETE /api/v1/todos/{id}` - Delete todo

### Users
- `GET /api/v1/users/me/stats` - Get authenticated user's activity statistics
  - **Authentication**: Required (Better Auth session cookie)
  - **Response**: User statistics including total tasks, completed tasks, completion rate, and active days
  - **Status Codes**: 200 (success), 401 (not authenticated), 500 (calculation failed)

## Testing

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=api.src --cov-report=html

# Run specific test file
pytest tests/test_api/test_todos.py

# Run with verbose output
pytest -v
```

## Development

### Adding New Endpoints

1. Create model in `src/models/`
2. Create Pydantic schemas in `src/schemas/`
3. Create service functions in `src/services/`
4. Create router in `src/routers/`
5. Register router in `src/main.py`
6. Create migration with `alembic revision --autogenerate`
7. Apply migration with `alembic upgrade head`

### Database Migrations

```bash
# Create new migration
alembic revision --autogenerate -m "Description of changes"

# Apply migrations
alembic upgrade head

# Rollback one migration
alembic downgrade -1

# View migration history
alembic history
```

## Deployment

### Railway / Render

1. Connect GitHub repository
2. Set environment variables (DATABASE_URL, CORS_ORIGINS)
3. Build command: `pip install -r requirements.txt`
4. Start command: `alembic upgrade head && uvicorn api.src.main:app --host 0.0.0.0 --port $PORT`

## Troubleshooting

### Database Connection Issues

- Verify DATABASE_URL in `.env` file
- Check Neon database is running
- Ensure `?sslmode=require` is in connection string

### Import Errors

- Activate virtual environment
- Install dependencies: `pip install -r requirements.txt`
- Check Python version: `python --version` (should be 3.13+)

### Migration Errors

- Reset migrations: `alembic downgrade base && alembic upgrade head`
- Check database connection
- Verify models are imported in `alembic/env.py`

## Documentation

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SQLModel Documentation](https://sqlmodel.tiangolo.com/)
- [Alembic Documentation](https://alembic.sqlalchemy.org/)
- [Pydantic Documentation](https://docs.pydantic.dev/)

## License

MIT
