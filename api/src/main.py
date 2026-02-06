"""
FastAPI application initialization with CORS, error handlers, and router registration.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from .config import settings
from .middleware.error_handler import (
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

# Configure CORS with wildcard support for Vercel
# Allow all Vercel preview deployments and production domains
import re

def is_allowed_origin(origin: str) -> bool:
    """Check if origin is allowed (supports Vercel wildcard patterns)."""
    allowed_patterns = [
        r"^https://.*\.vercel\.app$",  # All Vercel deployments
        r"^http://localhost:\d+$",      # Local development
    ]

    # Also check explicit origins from settings
    if origin in settings.cors_origins_list:
        return True

    # Check against patterns
    for pattern in allowed_patterns:
        if re.match(pattern, origin):
            return True

    return False

# Custom CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"^https://.*\.vercel\.app$|^http://localhost:\d+$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
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
from .routers.health import router as health_router
app.include_router(health_router, prefix=f"/api/{settings.API_VERSION}", tags=["health"])

# Register todos router at both paths for compatibility
from .routers.todos import router as todos_router
app.include_router(todos_router, prefix=f"/api/{settings.API_VERSION}", tags=["todos"])
# Specification-compliant path: /api/tasks (without version prefix)
app.include_router(todos_router, prefix="/api", tags=["tasks"])

# Register users router
from .routers.users import router as users_router
app.include_router(users_router, prefix=f"/api/{settings.API_VERSION}", tags=["users"])

# Register chat router (Phase III)
from .routers.chat import router as chat_router
app.include_router(chat_router, prefix=f"/api/{settings.API_VERSION}", tags=["chat"])