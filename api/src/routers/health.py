"""
Health check endpoint for monitoring and deployment verification.
"""
from fastapi import APIRouter, Request
import logging

router = APIRouter()
logger = logging.getLogger(__name__)


@router.get("/health")
async def health_check():
    """
    Health check endpoint.

    Returns:
        dict: Health status information
    """
    return {
        "status": "healthy",
        "service": "todo-api",
        "version": "1.0.0",
    }


@router.get("/debug/cookies")
async def debug_cookies(request: Request):
    """
    Debug endpoint to inspect all cookies sent by the client.

    Returns:
        dict: All cookies with their names and values
    """
    cookies_info = {}

    logger.info("=== DEBUG: Inspecting all cookies ===")
    for cookie_name, cookie_value in request.cookies.items():
        cookies_info[cookie_name] = {
            "length": len(cookie_value),
            "value": cookie_value,
            "first_8": cookie_value[:8] if len(cookie_value) >= 8 else cookie_value,
            "last_8": cookie_value[-8:] if len(cookie_value) >= 8 else cookie_value,
        }
        logger.info(f"Cookie: {cookie_name}")
        logger.info(f"  Length: {len(cookie_value)}")
        logger.info(f"  Full value: {cookie_value}")

    return {
        "total_cookies": len(request.cookies),
        "cookies": cookies_info,
    }
