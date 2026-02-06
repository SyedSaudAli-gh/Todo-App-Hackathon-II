"""
AI agent error classes.

Custom exceptions for AI agent operations.
"""


class AIAgentError(Exception):
    """Base exception for AI agent errors."""

    def __init__(self, message: str):
        """
        Initialize AIAgentError.

        Args:
            message: Error message
        """
        self.message = message
        super().__init__(self.message)


class AIAgentTimeoutError(AIAgentError):
    """Exception raised when AI agent processing times out."""

    def __init__(self, message: str = "AI agent processing timed out"):
        """
        Initialize AIAgentTimeoutError.

        Args:
            message: Error message (default: "AI agent processing timed out")
        """
        super().__init__(message)


class AIAgentToolError(AIAgentError):
    """Exception raised when MCP tool execution fails."""

    def __init__(self, tool_name: str, message: str):
        """
        Initialize AIAgentToolError.

        Args:
            tool_name: Name of the tool that failed
            message: Error message
        """
        self.tool_name = tool_name
        super().__init__(f"Tool '{tool_name}' failed: {message}")
