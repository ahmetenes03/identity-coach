"""Thin service wrapper around the configured embedding provider."""
from __future__ import annotations

from app.llm import get_embedder
from app.llm.base import BaseEmbedder


class EmbedderService:
    def __init__(self, embedder: BaseEmbedder | None = None) -> None:
        self._embedder = embedder or get_embedder()

    @property
    def name(self) -> str:
        return self._embedder.name

    async def embed_text(self, text: str) -> list[float]:
        vectors = await self._embedder.embed([text])
        return vectors[0]

    async def embed_batch(self, texts: list[str]) -> list[list[float]]:
        if not texts:
            return []
        return await self._embedder.embed(texts)
