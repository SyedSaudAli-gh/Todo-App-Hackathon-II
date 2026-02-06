"""
Configuration management using Pydantic Settings.
Loads environment variables from .env file.
"""
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Database
    DATABASE_URL: str

    # JWT Authentication (RS256)
    JWT_PUBLIC_KEY: str = ""  # RSA public key in PEM format from Better Auth
    JWT_ALGORITHM: str = "RS256"

    # API Configuration
    API_VERSION: str = "v1"
    DEBUG: bool = False

    # CORS Configuration
    CORS_ORIGINS: str = "http://localhost:3000"

    # Server Configuration
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # Phase III: AI Agent Configuration
    # Option 1: OpenAI Direct (Recommended - reliable tool calling)
    OPENAI_API_KEY: str = ""
    OPENAI_BASE_URL: str = "https://api.openai.com/v1"

    # Option 2: OpenRouter (fallback if OpenAI key not provided)
    OPENROUTER_API_KEY: str = ""
    OPENROUTER_BASE_URL: str = "https://openrouter.ai/api/v1"

    # Model selection - use OpenAI for reliable tool calling
    AGENT_MODEL: str = "gpt-4o-mini"  # Excellent tool calling, low cost (~$0.15/1M tokens)
    # Alternative: "gpt-3.5-turbo" (cheaper but less reliable)
    # For OpenRouter: "anthropic/claude-3-haiku" (paid but very reliable)
    AGENT_TIMEOUT: int = 15
    CONVERSATION_HISTORY_LIMIT: int = 20

    @property
    def cors_origins_list(self) -> List[str]:
        """Convert CORS_ORIGINS string to list."""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]

    class Config:
        env_file = ".env"
        case_sensitive = True


# Global settings instance
settings = Settings()
