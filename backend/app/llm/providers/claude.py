"""Anthropic Claude provider. SDK (`anthropic`) is imported lazily.

Anthropic does not offer a first-party embedding API, so no ClaudeEmbedder is
provided; the factory falls back to the offline embedder for RAG when Claude is
the selected chat provider.
"""
from __future__ import annotations

from typing import Any

from app.llm.base import BaseLLM

DEFAULT_MODEL = "claude-sonnet-5"


class ClaudeLLM(BaseLLM):
    name = "claude"

    def __init__(self, api_key: str, model: str = "", timeout: float = 30.0, max_tokens: int = 800) -> None:
        try:
            from anthropic import AsyncAnthropic
        except ImportError as exc:  # pragma: no cover - optional dependency
            raise RuntimeError("anthropic package is not installed") from exc
        self.model = model or DEFAULT_MODEL
        self.max_tokens = max_tokens
        self._client = AsyncAnthropic(api_key=api_key, timeout=timeout)

    async def chat(
        self,
        messages: list[dict],
        tools: list[dict] | None = None,
        temperature: float = 0.7,
    ) -> dict[str, Any]:
        system = "\n".join(m["content"] for m in messages if m.get("role") == "system")
        convo = [
            {"role": m["role"], "content": m["content"]}
            for m in messages
            if m.get("role") in ("user", "assistant")
        ]
        resp = await self._client.messages.create(
            model=self.model,
            system=system or None,
            messages=convo,
            max_tokens=self.max_tokens,
            temperature=temperature,
        )
        text = "".join(
            block.text for block in resp.content if getattr(block, "type", None) == "text"
        )
        return {"content": text, "tool_calls": None}
