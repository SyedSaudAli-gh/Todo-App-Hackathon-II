"""
JWT authentication and security utilities.

This module provides JWT token validation using RS256 algorithm
for Better Auth tokens. User identity is extracted from the 'sub' claim.
"""
import logging
from typing import Optional
from jose import jwt, JWTError
from fastapi import HTTPException, status
from src.config import settings

logger = logging.getLogger(__name__)


def validate_jwt_token(token: str) -> dict:
    """
    Validate JWT token and extract payload.

    Args:
        token: JWT token string

    Returns:
        dict: Decoded JWT payload

    Raises:
        HTTPException: 401 if token is invalid, expired, or malformed
    """
    if not settings.JWT_PUBLIC_KEY:
        logger.error("JWT_PUBLIC_KEY not configured")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="JWT authentication not configured"
        )

    try:
        # Decode and validate JWT token with RS256
        payload = jwt.decode(
            token,
            settings.JWT_PUBLIC_KEY,
            algorithms=[settings.JWT_ALGORITHM]
        )
        return payload

    except jwt.ExpiredSignatureError:
        logger.warning("JWT token has expired")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired"
        )
    except jwt.JWTError as e:
        logger.warning(f"JWT validation failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )
    except Exception as e:
        logger.error(f"Unexpected error during JWT validation: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication failed"
        )


def extract_user_id_from_jwt(payload: dict) -> str:
    """
    Extract user_id from JWT payload 'sub' claim.

    Args:
        payload: Decoded JWT payload

    Returns:
        str: User ID from 'sub' claim

    Raises:
        HTTPException: 401 if 'sub' claim is missing
    """
    user_id = payload.get("sub")

    if not user_id:
        logger.error("JWT token missing 'sub' claim")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token: missing user identifier"
        )

    return user_id
