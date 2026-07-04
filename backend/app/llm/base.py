# Sprint 2 TODO: Base abstract classes
from abc import ABC, abstractmethod
from typing import Any


class BaseLLM(ABC):
    @abstractmethod
    async def chat(self, messages: list[dict], tools: list[dict] | None = None, temperature: float = 0.7) -> dict[str, Any]:
        """Returns {'content': str, 'tool_calls': list | None}"""
        ...


class BaseEmbedder(ABC):
    @abstractmethod
    async def embed(self, texts: list[str]) -> list[list[float]]:
        ...
