"""
FastAPI application initialization with CORS, error handlers, and router registration.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from src.config import settings
from src.middleware.error_handler import (
    http_exception_handler,
    validation_exception_handler,
    general_exception_handler,
)

# Initialize FastAPI app
app = FastAPI(
    title="Todo Management API",
    description="RESTful API for managing todo items with JWT authentication (RS256). User identity extracted from 'sub' claim.",
    version="1.0.0",
    docs_url=f"/api/{settings.API_VERSION}/docs",
    redoc_url=f"/api/{settings.API_VERSION}/redoc",
    openapi_url=f"/api/{settings.API_VERSION}/openapi.json",
    swagger_ui_parameters={
        "persistAuthorization": True,
    },
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register error handlers
app.add_exception_handler(StarletteHTTPException, http_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(Exception, general_exception_handler)


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "Todo Management API",
        "version": settings.API_VERSION,
        "docs": f"/api/{settings.API_VERSION}/docs",
    }


# Register health check router
from src.routers.health import router as health_router
app.include_router(health_router, prefix=f"/api/{settings.API_VERSION}", tags=["health"])

# Register todos router at both paths for compatibility
from src.routers.todos import router as todos_router
app.include_router(todos_router, prefix=f"/api/{settings.API_VERSION}", tags=["todos"])
# Specification-compliant path: /api/tasks (without version prefix)
app.include_router(todos_router, prefix="/api", tags=["tasks"])

# Register users router
from src.routers.users import router as users_router
app.include_router(users_router, prefix=f"/api/{settings.API_VERSION}", tags=["users"])