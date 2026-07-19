"""Selects the concrete LLM / embedder from settings.

Design rules:
- Never raise from the factory during a request. If a real provider is selected
  but its API key or SDK is missing, we log a warning (never the key) and fall
  back to the deterministic offline provider so coaching keeps working.
- Only SUCCESSFUL provider construction is cached. A transient failure returns
  a fresh offline instance without caching it, so the next call retries the
  real provider instead of pinning the degraded fallback until restart.
"""
from __future__ import annotations

import logging

from app.config import get_settings
from app.llm.base import BaseEmbedder, BaseLLM
from app.llm.providers.offline import OfflineEmbedder, OfflineLLM

logger = logging.getLogger("identity_coach.llm")

_llm_cache: BaseLLM | None = None
_embedder_cache: BaseEmbedder | None = None


def _build_llm(provider: str) -> BaseLLM:
    settings = get_settings()

    if provider == "offline":
        return OfflineLLM()

    if provider == "openai":
        key = settings.openai_api_key.get_secret_value()
        if not key:
            raise ValueError("OPENAI_API_KEY is not set")
        from app.llm.providers.openai import OpenAILLM

        return OpenAILLM(key, settings.llm_model, settings.llm_timeout_seconds)

    if provider == "gemini":
        key = settings.gemini_api_key.get_secret_value()
        if not key:
            raise ValueError("GEMINI_API_KEY is not set")
        from app.llm.providers.gemini import GeminiLLM

        return GeminiLLM(key, settings.llm_model, settings.llm_timeout_seconds)

    if provider == "claude":
        key = settings.anthropic_api_key.get_secret_value()
        if not key:
            raise ValueError("ANTHROPIC_API_KEY is not set")
        from app.llm.providers.claude import ClaudeLLM

        return ClaudeLLM(
            key,
            settings.llm_model,
            settings.llm_timeout_seconds,
            settings.llm_max_tokens,
        )

    if provider == "ollama":
        from app.llm.providers.ollama import OllamaLLM

        return OllamaLLM(
            settings.ollama_base_url, settings.llm_model, settings.llm_timeout_seconds
        )

    raise ValueError(f"Unknown llm_provider '{provider}'")


def _build_embedder(provider: str) -> BaseEmbedder:
    settings = get_settings()

    if provider in ("offline", "claude"):
        # Claude has no first-party embeddings; use the portable offline one.
        return OfflineEmbedder(settings.offline_embedding_dim)

    if provider == "openai":
        key = settings.openai_api_key.get_secret_value()
        if not key:
            raise ValueError("OPENAI_API_KEY is not set")
        from app.llm.providers.openai import OpenAIEmbedder

        return OpenAIEmbedder(key, settings.embedding_model, settings.llm_timeout_seconds)

    if provider == "gemini":
        key = settings.gemini_api_key.get_secret_value()
        if not key:
            raise ValueError("GEMINI_API_KEY is not set")
        from app.llm.providers.gemini import GeminiEmbedder

        return GeminiEmbedder(key, settings.embedding_model, settings.llm_timeout_seconds)

    if provider == "ollama":
        from app.llm.providers.ollama import OllamaEmbedder

        return OllamaEmbedder(
            settings.ollama_base_url, settings.embedding_model, settings.llm_timeout_seconds
        )

    raise ValueError(f"Unknown embedding provider '{provider}'")


def get_llm() -> BaseLLM:
    global _llm_cache
    if _llm_cache is not None:
        return _llm_cache

    provider = (get_settings().llm_provider or "offline").lower()
    try:
        _llm_cache = _build_llm(provider)
        return _llm_cache
    except Exception as exc:  # noqa: BLE001 - degrade gracefully, no secrets logged
        logger.warning(
            "LLM provider '%s' unavailable (%s); using offline coach.", provider, exc
        )
        return OfflineLLM()


def get_embedder() -> BaseEmbedder:
    global _embedder_cache
    if _embedder_cache is not None:
        return _embedder_cache

    settings = get_settings()
    provider = settings.resolved_embedding_provider.lower()
    try:
        _embedder_cache = _build_embedder(provider)
        return _embedder_cache
    except Exception as exc:  # noqa: BLE001 - degrade gracefully, no secrets logged
        logger.warning(
            "Embedding provider '%s' unavailable (%s); using offline embedder.",
            provider,
            exc,
        )
        return OfflineEmbedder(settings.offline_embedding_dim)
