from functools import lru_cache

from pydantic import SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Identity Coach API"
    environment: str = "development"
    database_url: str = "sqlite:///./identity_coach.db"
    secret_key: str = "change-this-secret-key"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24

    # Comma-separated allowed CORS origins. Explicit origins (not "*") so that
    # allow_credentials=True stays valid and browsers actually honour it.
    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"

    # --- AI / LLM layer ---------------------------------------------------
    # provider: offline | gemini | openai | claude | ollama
    # "offline" needs no API key and produces deterministic coaching output,
    # so the app (and the test suite) runs fully without any secret.
    llm_provider: str = "offline"
    llm_model: str = ""  # empty -> provider default
    llm_temperature: float = 0.7
    llm_max_tokens: int = 800
    llm_timeout_seconds: float = 30.0

    # Embedding provider defaults to the LLM provider when left empty.
    embedding_provider: str = ""
    embedding_model: str = ""
    # Dimension used by the dependency-free offline embedder.
    offline_embedding_dim: int = 256

    # Secrets are SecretStr so they never leak into logs / repr / tracebacks.
    gemini_api_key: SecretStr = SecretStr("")
    openai_api_key: SecretStr = SecretStr("")
    anthropic_api_key: SecretStr = SecretStr("")
    ollama_base_url: str = "http://localhost:11434"

    # --- Coaching guardrails ---------------------------------------------
    # Upper bound on user-supplied free text sent to the model. Bounds prompt
    # size, cost, and prompt-injection surface.
    coach_reason_max_chars: int = 2000
    coach_strategy_top_k: int = 3
    # Seed the strategy pool on startup when the table is empty.
    auto_seed_strategies: bool = True

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @property
    def resolved_embedding_provider(self) -> str:
        return self.embedding_provider or self.llm_provider

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
