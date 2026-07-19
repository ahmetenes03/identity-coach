"""Local Ollama provider over its HTTP API (uses httpx, already a dependency)."""
from __future__ import annotations

import asyncio
from typing import Any

import httpx

from app.llm.base import BaseEmbedder, BaseLLM

DEFAULT_MODEL = "llama3.1"
DEFAULT_EMBED_MODEL = "nomic-embed-text"


class OllamaLLM(BaseLLM):
    name = "ollama"

    def __init__(self, base_url: str, model: str = "", timeout: float = 30.0) -> None:
        self.model = model or DEFAULT_MODEL
        self._base_url = base_url.rstrip("/")
        self._timeout = timeout

    async def chat(
        self,
        messages: list[dict],
        tools: list[dict] | None = None,
        temperature: float = 0.7,
    ) -> dict[str, Any]:
        async with httpx.AsyncClient(timeout=self._timeout) as client:
            resp = await client.post(
                f"{self._base_url}/api/chat",
                json={
                    "model": self.model,
                    "messages": messages,
                    "stream": False,
                    "options": {"temperature": temperature},
                },
            )
            resp.raise_for_status()
            data = resp.json()
        return {"content": data.get("message", {}).get("content", ""), "tool_calls": None}


class OllamaEmbedder(BaseEmbedder):
    name = "ollama"

    def __init__(self, base_url: str, model: str = "", timeout: float = 30.0) -> None:
        self.model = model or DEFAULT_EMBED_MODEL
        self._base_url = base_url.rstrip("/")
        self._timeout = timeout

    async def embed(self, texts: list[str]) -> list[list[float]]:
        # İstekler bağımsız; toplu seed'de seri bekleme yerine paralel gönder.
        async with httpx.AsyncClient(timeout=self._timeout) as client:
            responses = await asyncio.gather(
                *(
                    client.post(
                        f"{self._base_url}/api/embeddings",
                        json={"model": self.model, "prompt": text},
                    )
                    for text in texts
                )
            )
        vectors: list[list[float]] = []
        for resp in responses:
            resp.raise_for_status()
            vectors.append(resp.json()["embedding"])
        return vectors
