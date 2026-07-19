"""Provider-agnostic LLM abstractions.

Every concrete provider (offline, gemini, openai, claude, ollama) implements
these interfaces so the rest of the app never imports a vendor SDK directly.
"""
from abc import ABC, abstractmethod
from typing import Any


class BaseLLM(ABC):
    """A chat-completion backend."""

    #: Human-readable provider id, e.g. "offline", "gemini". Used for auditing.
    name: str = "base"
    #: Model identifier actually used, surfaced in CoachInteraction records.
    model: str = ""

    @abstractmethod
    async def chat(
        self,
        messages: list[dict],
        tools: list[dict] | None = None,
        temperature: float = 0.7,
    ) -> dict[str, Any]:
        """Return {'content': str, 'tool_calls': list | None}."""
        ...


class BaseEmbedder(ABC):
    """A text-embedding backend. All vectors from one instance share a dim."""

    name: str = "base"
    model: str = ""

    @abstractmethod
    async def embed(self, texts: list[str]) -> list[list[float]]:
        ...
