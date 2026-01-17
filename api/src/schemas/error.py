"""
Error response Pydantic schemas.
"""
from typing import Optional, List, Any
from pydantic import BaseModel


class ErrorResponse(BaseModel):
    """Standard error response schema."""

    error: str
    message: str
    details: Optional[Any] = None


class ValidationErrorDetail(BaseModel):
    """Validation error detail."""

    field: str
    message: str
    type: str


class ValidationErrorResponse(BaseModel):
    """Validation error response schema."""

    error: str
    message: str
    details: List[ValidationErrorDetail]
