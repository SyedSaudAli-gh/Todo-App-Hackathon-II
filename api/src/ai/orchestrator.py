"""
AI Agent Orchestrator for processing chat messages with tool execution.

Handles LLM interaction via OpenRouter API and coordinates tool calls
for todo management operations.
"""
import asyncio
import json
import logging
from typing import Any, Dict, List, Optional
from openai import AsyncOpenAI
from sqlmodel import Session

from ai.config import agent_config
from ai.errors import AIAgentTimeoutError
from mcp.tools.create_task import create_task_tool
from mcp.tools.list_tasks import list_tasks_tool
from mcp.tools.get_task import get_task_tool
from mcp.tools.update_task import update_task_tool
from mcp.tools.delete_task import delete_task_tool

logger = logging.getLogger(__name__)


class AIAgentOrchestrator:
    """
    Orchestrates AI agent interactions with OpenRouter API.

    Handles:
    - Message processing with conversation context
    - Tool execution for todo operations
    - Response generation
    """

    def __init__(self):
        """Initialize the orchestrator with OpenRouter client."""
        agent_config.validate_config()

        self.client = AsyncOpenAI(
            api_key=agent_config.openrouter_api_key,
            base_url=agent_config.openrouter_base_url
        )

        self.tools = [
            {
                "type": "function",
                "function": {
                    "name": "create_task",
                    "description": "Create a new todo task",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "title": {"type": "string", "description": "Task title"},
                            "description": {"type": "string", "description": "Task description"},
                            "status": {"type": "string", "enum": ["pending", "in_progress", "completed"], "default": "pending"}
                        },
                        "required": ["title"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "list_tasks",
                    "description": "List all tasks or filter by status",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "status": {"type": "string", "enum": ["pending", "in_progress", "completed"], "description": "Filter by status"}
                        }
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "get_task",
                    "description": "Get details of a specific task by ID",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "task_id": {"type": "integer", "description": "Task ID"}
                        },
                        "required": ["task_id"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "update_task",
                    "description": "Update task details or mark as complete/incomplete",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "task_id": {"type": "integer", "description": "Task ID"},
                            "title": {"type": "string", "description": "New title"},
                            "description": {"type": "string", "description": "New description"},
                            "status": {"type": "string", "enum": ["pending", "in_progress", "completed"]}
                        },
                        "required": ["task_id"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "delete_task",
                    "description": "Delete a task by ID",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "task_id": {"type": "integer", "description": "Task ID"}
                        },
                        "required": ["task_id"]
                    }
                }
            }
        ]

    async def process_message(
        self,
        message: str,
        conversation_context: List[Dict[str, str]],
        user_id: str,
        db: Session,
        timeout: int = 15
    ) -> Dict[str, Any]:
        """
        Process a user message with AI agent and execute tools.

        Args:
            message: User message text
            conversation_context: Previous conversation messages
            user_id: User ID for tool execution
            db: Database session
            timeout: Request timeout in seconds

        Returns:
            Dict with 'response' and 'tool_calls' keys

        Raises:
            AIAgentTimeoutError: If request times out
            Exception: For other errors
        """
        try:
            # Add user message to context
            messages = conversation_context + [{"role": "user", "content": message}]

            logger.info(f"🤖 Calling OpenRouter API with {len(messages)} messages")

            # Call LLM with timeout
            response = await asyncio.wait_for(
                self.client.chat.completions.create(
                    model=agent_config.openrouter_model,
                    messages=messages,
                    tools=self.tools,
                    tool_choice="auto"
                ),
                timeout=timeout
            )

            assistant_message = response.choices[0].message
            tool_calls_data = []

            # Execute tool calls if present
            if assistant_message.tool_calls:
                logger.info(f"🔧 Executing {len(assistant_message.tool_calls)} tool calls")

                for tool_call in assistant_message.tool_calls:
                    tool_name = tool_call.function.name
                    tool_args = json.loads(tool_call.function.arguments)

                    logger.info(f"🔧 Tool: {tool_name}, Args: {tool_args}")

                    # Execute tool
                    tool_result = await self._execute_tool(
                        tool_name, tool_args, user_id, db
                    )

                    tool_calls_data.append({
                        "tool_name": tool_name,
                        "arguments": tool_args,
                        "result": tool_result
                    })

            # Get final response
            response_text = assistant_message.content or "Task completed successfully."

            return {
                "response": response_text,
                "tool_calls": tool_calls_data
            }

        except asyncio.TimeoutError:
            logger.error(f"⏱️ AI request timed out after {timeout}s")
            raise AIAgentTimeoutError(f"AI request timed out after {timeout} seconds")
        except Exception as e:
            logger.error(f"❌ AI orchestrator error: {str(e)}", exc_info=True)
            raise

    async def _execute_tool(
        self,
        tool_name: str,
        arguments: Dict[str, Any],
        user_id: str,
        db: Session
    ) -> Any:
        """Execute a tool by name with given arguments."""
        tool_map = {
            "create_task": create_task_tool,
            "list_tasks": list_tasks_tool,
            "get_task": get_task_tool,
            "update_task": update_task_tool,
            "delete_task": delete_task_tool
        }

        tool_func = tool_map.get(tool_name)
        if not tool_func:
            raise ValueError(f"Unknown tool: {tool_name}")

        # Execute tool with user_id and db session
        return await tool_func(user_id=user_id, db=db, **arguments)
