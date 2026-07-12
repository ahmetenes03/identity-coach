"""Google Gemini provider. SDK (`google-genai`) is imported lazily."""
from __future__ import annotations

from typing import Any

from app.llm.base import BaseEmbedder, BaseLLM

DEFAULT_MODEL = "gemini-2.0-flash"
DEFAULT_EMBED_MODEL = "text-embedding-004"


def _client(api_key: str):
    try:
        from google import genai
    except ImportError as exc:  # pragma: no cover - optional dependency
        raise RuntimeError("google-genai package is not installed") from exc
    return genai.Client(api_key=api_key)


def _to_contents(messages: list[dict]) -> tuple[str, str]:
    """Return (system_instruction, joined_user_assistant_text)."""
    system_parts = [m["content"] for m in messages if m.get("role") == "system"]
    convo_parts = [
        f"{m.get('role')}: {m.get('content')}"
        for m in messages
        if m.get("role") != "system"
    ]
    return "\n".join(system_parts), "\n\n".join(convo_parts)


class GeminiLLM(BaseLLM):
    name = "gemini"

    def __init__(self, api_key: str, model: str = "", timeout: float = 30.0) -> None:
        self.model = model or DEFAULT_MODEL
        self._client = _client(api_key)

    async def chat(
        self,
        messages: list[dict],
        tools: list[dict] | None = None,
        temperature: float = 0.7,
    ) -> dict[str, Any]:
        from google.genai import types

        system, contents = _to_contents(messages)
        resp = await self._client.aio.models.generate_content(
            model=self.model,
            contents=contents,
            config=types.GenerateContentConfig(
                system_instruction=system or None,
                temperature=temperature,
            ),
        )
        return {"content": resp.text or "", "tool_calls": None}


class GeminiEmbedder(BaseEmbedder):
    name = "gemini"

    def __init__(self, api_key: str, model: str = "", timeout: float = 30.0) -> None:
        self.model = model or DEFAULT_EMBED_MODEL
        self._client = _client(api_key)

    async def embed(self, texts: list[str]) -> list[list[float]]:
        resp = await self._client.aio.models.embed_content(
            model=self.model, contents=texts
        )
        return [list(e.values) for e in resp.embeddings]
