"""
FastAPI dependencies for authentication and authorization.

Provides get_current_user dependency that validates JWT tokens
and extracts user_id from the 'sub' claim.
"""
import logging
from typing import Annotated
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from core.security import validate_jwt_token, extract_user_id_from_jwt

logger = logging.getLogger(__name__)

# HTTP Bearer token security scheme
security = HTTPBearer()


async def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(security)]
) -> str:
    """
    FastAPI dependency to get authenticated user from JWT token.

    Validates JWT token from Authorization header (Bearer token),
    extracts user_id from 'sub' claim, and returns it.

    Args:
        credentials: HTTP Bearer credentials (injected by FastAPI)

    Returns:
        str: User ID extracted from JWT 'sub' claim

    Raises:
        HTTPException: 401 if token is missing, invalid, or expired
    """
    try:
        # Extract token from Bearer credentials
        token = credentials.credentials

        # Debug logging
        logger.info(f"🔑 Received JWT token (first 20 chars): {token[:20]}...")
        logger.info(f"📝 Token length: {len(token)}")
        logger.info(f"📝 Token segments: {len(token.split('.'))}")

        # Validate JWT and get payload
        payload = validate_jwt_token(token)

        # Extract user_id from 'sub' claim
        user_id = extract_user_id_from_jwt(payload)

        logger.info(f"✅ User authenticated via JWT: {user_id[:8]}...")
        return user_id

    except HTTPException:
        # Re-raise HTTP exceptions from security module
        raise
    except Exception as e:
        logger.error(f"❌ Unexpected error in get_current_user: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication failed"
        )


# Alias for convenience
get_current_user_id = get_current_user
