"""
Agent configuration for OpenRouter API with Mistral 7B Instruct.

Configures the OpenAI SDK to use OpenRouter as the API provider
with Mistral 7B Instruct as the model (free tier, no Gemini per user requirement).
"""
import os
from typing import Optional
from pydantic_settings import BaseSettings


class AgentConfig(BaseSettings):
    """
    Configuration for AI agent using OpenRouter API.

    Environment Variables:
        OPENROUTER_API_KEY: API key from openrouter.ai
        OPENROUTER_BASE_URL: OpenRouter API endpoint (default: https://openrouter.ai/api/v1)
        OPENROUTER_MODEL: Model to use (default: z-ai/glm-4.5-air:free)
        AGENT_TIMEOUT: Request timeout in seconds (default: 15)
        CONVERSATION_HISTORY_LIMIT: Max messages to include in context (default: 20)
    """

    # OpenRouter Configuration
    openrouter_api_key: str = os.getenv("OPENROUTER_API_KEY", "")
    openrouter_base_url: str = os.getenv(
        "OPENROUTER_BASE_URL",
        "https://openrouter.ai/api/v1"
    )
    openrouter_model: str = os.getenv(
        "OPENROUTER_MODEL",
        "z-ai/glm-4.5-air:free"
    )

    # Agent Behavior
    agent_timeout: int = int(os.getenv("AGENT_TIMEOUT", "15"))
    conversation_history_limit: int = int(
        os.getenv("CONVERSATION_HISTORY_LIMIT", "20")
    )

    # System Prompt - Tool-first behavior
    system_prompt: str = """You are a helpful todo assistant. You help users manage their tasks through natural language.

CRITICAL: You MUST use tools for ALL task operations. NEVER provide conversational responses for task actions.

Available tools:
- create_task: Create a new todo task
- list_tasks: List all tasks or filter by status (ALWAYS returns real database data)
- get_task: Get details of a specific task
- update_task: Update task details or mark as complete/incomplete
- delete_task: Delete a task (always confirm first)

TOOL-FIRST RULES:
1. If user wants to create a task → IMMEDIATELY call create_task tool
2. If user wants to see tasks → IMMEDIATELY call list_tasks tool
3. If user wants to update a task → IMMEDIATELY call update_task tool
4. If user wants to delete a task → Ask for confirmation, then call delete_task tool
5. If user wants to delete ALL tasks → Call list_tasks, then delete each task one by one
6. NEVER say "I'll create a task" without actually calling the tool
7. NEVER say "Here are your tasks" without calling list_tasks first
8. NEVER hallucinate task data - ALWAYS use tools to retrieve information

Guidelines:
- Always confirm before deleting tasks
- Provide clear feedback about what actions were taken
- Handle errors gracefully with user-friendly messages
- Ask clarifying questions if user intent is unclear
- Be friendly, helpful, and concise
- Focus on task management - politely redirect non-task questions

Confirmation Flow:
- When user requests deletion, ask for confirmation
- Wait for explicit "yes" or "confirm" before proceeding with deletion
- If user says "no" or "cancel", abort the deletion"""

    class Config:
        env_file = ".env"
        case_sensitive = False
        extra = "ignore"  # Ignore extra environment variables

    def validate_config(self) -> None:
        """
        Validate that required configuration is present.

        Raises:
            ValueError: If required configuration is missing
        """
        if not self.openrouter_api_key:
            raise ValueError(
                "OPENROUTER_API_KEY environment variable is required. "
                "Get your API key from https://openrouter.ai/keys"
            )

        if not self.openrouter_api_key.startswith("sk-or-"):
            raise ValueError(
                "OPENROUTER_API_KEY must start with 'sk-or-'. "
                "Please check your API key from https://openrouter.ai/keys"
            )


# Global config instance
agent_config = AgentConfig()
