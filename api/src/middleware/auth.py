"""
Authentication middleware for Better Auth session validation.

This module provides FastAPI dependencies for authenticating users via Better Auth
session cookies and extracting user information from validated sessions.
"""
import os
import sqlite3
import logging
from datetime import datetime, timezone
from typing import Optional
from fastapi import Request, HTTPException, status
from fastapi.security import APIKeyCookie

# Configure logger
logger = logging.getLogger(__name__)


# Better Auth session cookie name
BETTER_AUTH_COOKIE_NAME = "better-auth.session_token"

# Path to Better Auth SQLite database
# Assuming Better Auth database is in web directory
BETTER_AUTH_DB_PATH = os.path.join(
    os.path.dirname(__file__),
    "../../../web/auth.db"
)


def get_better_auth_db_connection():
    """
    Create connection to Better Auth SQLite database.

    Returns:
        sqlite3.Connection: Database connection

    Raises:
        HTTPException: If database connection fails
    """
    try:
        conn = sqlite3.connect(BETTER_AUTH_DB_PATH)
        conn.row_factory = sqlite3.Row  # Enable column access by name
        return conn
    except sqlite3.Error as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to authentication database"
        )


def validate_session_token(session_token: str) -> Optional[dict]:
    """
    Validate Better Auth session token and return user information.

    Args:
        session_token: Session token from cookie

    Returns:
        dict with user_id and created_at if valid, None if invalid

    Raises:
        HTTPException: If database query fails
    """
    try:
        logger.debug(f"Validating session token (first 8 chars): {session_token[:8]}...")

        conn = get_better_auth_db_connection()
        cursor = conn.cursor()

        # Query session table for valid session
        cursor.execute("""
            SELECT s.userId, s.expiresAt, u.createdAt
            FROM session s
            JOIN user u ON s.userId = u.id
            WHERE s.token = ?
        """, (session_token,))

        result = cursor.fetchone()
        conn.close()

        if not result:
            logger.warning(f"Session token not found in database (first 8 chars): {session_token[:8]}")
            return None

        user_id = result[0]
        expires_at = result[1]
        created_at = result[2]

        # Check if session is expired
        # Better Auth stores timestamps as ISO strings
        try:
            expires_at_dt = datetime.fromisoformat(expires_at.replace('Z', '+00:00'))
            now = datetime.now(timezone.utc)

            if expires_at_dt < now:
                logger.warning(f"Session expired for user (first 8 chars): {user_id[:8]}")
                return None  # Session expired
        except (ValueError, AttributeError):
            # If timestamp parsing fails, consider session invalid
            logger.error(f"Failed to parse expiration timestamp for user (first 8 chars): {user_id[:8]}")
            return None

        logger.info(f"Session validated successfully for user (first 8 chars): {user_id[:8]}")
        return {
            "user_id": user_id,
            "created_at": created_at
        }

    except sqlite3.Error as e:
        logger.error(f"Database error during session validation: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to validate session"
        )


def reassemble_chunked_cookie(request: Request, cookie_name: str) -> Optional[str]:
    """
    Reassemble a chunked cookie from Better Auth.

    Better Auth splits large cookies into chunks with names like:
    - better-auth.session_token (first chunk)
    - better-auth.session_token.0 (additional chunks)
    - better-auth.session_token.1 (more chunks)

    Args:
        request: FastAPI request object
        cookie_name: Base cookie name to reassemble

    Returns:
        Reassembled cookie value or None if not found
    """
    # Get the base cookie value
    base_value = request.cookies.get(cookie_name)

    if not base_value:
        return None

    # Check for chunked cookies
    chunks = [base_value]
    chunk_index = 0

    while True:
        chunk_name = f"{cookie_name}.{chunk_index}"
        chunk_value = request.cookies.get(chunk_name)

        if not chunk_value:
            break

        chunks.append(chunk_value)
        chunk_index += 1

    # Reassemble all chunks
    full_value = "".join(chunks)

    logger.debug(f"Reassembled cookie '{cookie_name}': {len(chunks)} chunk(s), total length: {len(full_value)}")

    return full_value


async def get_current_user(request: Request) -> dict:
    """
    FastAPI dependency to get authenticated user from Better Auth session.

    Extracts session token from cookie, validates it, and returns user information.

    Args:
        request: FastAPI request object

    Returns:
        dict: User information with user_id and created_at

    Raises:
        HTTPException: 401 if not authenticated or session invalid
    """
    logger.debug("Attempting to authenticate user from session cookie")

    # Debug: Log all cookies with their full values
    logger.debug(f"All cookies: {list(request.cookies.keys())}")
    for cookie_name, cookie_value in request.cookies.items():
        logger.debug(f"Cookie '{cookie_name}': length={len(cookie_value)}, value={cookie_value[:50]}...")
    logger.debug(f"Looking for cookie: {BETTER_AUTH_COOKIE_NAME}")

    # Extract and reassemble session token from chunked cookies
    session_token = reassemble_chunked_cookie(request, BETTER_AUTH_COOKIE_NAME)

    # Debug: Log token length
    if session_token:
        logger.debug(f"Session token found, length: {len(session_token)}, value (first 8): {session_token[:8]}")
    else:
        logger.debug(f"Session token not found in cookies")

    if not session_token:
        logger.warning("Authentication failed: No session token found in cookies")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )

    # Validate session and get user info
    user_info = validate_session_token(session_token)

    if not user_info:
        logger.warning("Authentication failed: Invalid or expired session token")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired session"
        )

    logger.info(f"User authenticated successfully (first 8 chars): {user_info['user_id'][:8]}")
    return user_info


async def get_current_user_id(request: Request) -> str:
    """
    FastAPI dependency to get authenticated user ID.

    Convenience function that returns only the user_id.

    Args:
        request: FastAPI request object

    Returns:
        str: User ID from validated session

    Raises:
        HTTPException: 401 if not authenticated or session invalid
    """
    user_info = await get_current_user(request)
    return user_info["user_id"]
