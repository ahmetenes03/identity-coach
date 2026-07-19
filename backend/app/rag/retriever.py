"""RAG retriever: turns a failure reason into grounding context for the coach."""
from __future__ import annotations

from typing import Any

from sqlalchemy.orm import Session

from app.rag.embedder import EmbedderService
from app.rag.vector_store import VectorStore


class Retriever:
    def __init__(
        self,
        embedder: EmbedderService | None = None,
        vector_store: VectorStore | None = None,
    ) -> None:
        self._embedder = embedder or EmbedderService()
        self._store = vector_store or VectorStore()

    async def retrieve_for_coaching(
        self,
        db: Session,
        user_id: str,
        failure_reason: str,
        category: str | None = None,
        top_k_strategies: int = 3,
        top_k_failures: int = 3,
        exclude_reflection_id: str | None = None,
    ) -> dict[str, Any]:
        embedding = await self._embedder.embed_text(failure_reason)

        strategies = self._store.search_similar_strategies(
            db, embedding, limit=top_k_strategies, category=category
        )
        past_failures = self._store.search_similar_failures(
            db,
            user_id,
            embedding,
            limit=top_k_failures,
            exclude_id=exclude_reflection_id,
        )
        return {
            "embedding": embedding,
            "strategies": strategies,
            "past_failures": past_failures,
        }
