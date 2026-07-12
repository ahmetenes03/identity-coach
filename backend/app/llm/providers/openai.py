"""OpenAI provider. SDK (`openai`) is imported lazily so it stays optional."""
from __future__ import annotations

from typing import Any

from app.llm.base import BaseEmbedder, BaseLLM

DEFAULT_MODEL = "gpt-4o-mini"
DEFAULT_EMBED_MODEL = "text-embedding-3-small"


def _client(api_key: str, timeout: float):
    try:
        from openai import AsyncOpenAI
    except ImportError as exc:  # pragma: no cover - optional dependency
        raise RuntimeError("openai package is not installed") from exc
    return AsyncOpenAI(api_key=api_key, timeout=timeout)


class OpenAILLM(BaseLLM):
    name = "openai"

    def __init__(self, api_key: str, model: str = "", timeout: float = 30.0) -> None:
        self.model = model or DEFAULT_MODEL
        self._client = _client(api_key, timeout)

    async def chat(
        self,
        messages: list[dict],
        tools: list[dict] | None = None,
        temperature: float = 0.7,
    ) -> dict[str, Any]:
        resp = await self._client.chat.completions.create(
            model=self.model,
            messages=messages,
            temperature=temperature,
        )
        return {"content": resp.choices[0].message.content or "", "tool_calls": None}


class OpenAIEmbedder(BaseEmbedder):
    name = "openai"

    def __init__(self, api_key: str, model: str = "", timeout: float = 30.0) -> None:
        self.model = model or DEFAULT_EMBED_MODEL
        self._client = _client(api_key, timeout)

    async def embed(self, texts: list[str]) -> list[list[float]]:
        resp = await self._client.embeddings.create(model=self.model, input=texts)
        return [item.embedding for item in resp.data]
