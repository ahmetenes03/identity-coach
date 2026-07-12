"""Portable similarity search over embeddings stored as JSON.

Embeddings live in ordinary JSON columns, so this works identically on SQLite
(local/tests) and Postgres (Supabase). Candidate rows are loaded and ranked in
Python with cosine similarity. The strategy pool and a single user's failure
history are both small, so this is comfortably fast; the ``VectorStore``
interface can later be swapped for a pgvector implementation without touching
callers.
"""
from __future__ import annotations

import math
from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import FailureReflection, Strategy


def cosine_similarity(a: list[float], b: list[float]) -> float:
    # Guard against dimension mismatch (e.g. embeddings produced by a different
    # provider than the current query) instead of raising.
    if not a or not b or len(a) != len(b):
        return 0.0
    dot = 0.0
    na = 0.0
    nb = 0.0
    for x, y in zip(a, b):
        dot += x * y
        na += x * x
        nb += y * y
    if na == 0.0 or nb == 0.0:
        return 0.0
    return dot / (math.sqrt(na) * math.sqrt(nb))


class VectorStore:
    def search_similar_strategies(
        self,
        db: Session,
        embedding: list[float],
        limit: int = 3,
        category: str | None = None,
    ) -> list[dict[str, Any]]:
        strategies = list(db.scalars(select(Strategy)))
        scored: list[dict[str, Any]] = []
        for strategy in strategies:
            if not strategy.embedding:
                continue
            score = cosine_similarity(embedding, strategy.embedding)
            # Small bonus when the strategy targets the classified trigger, so a
            # topically-matched strategy is preferred on near-ties.
            if category and strategy.trigger_category == category:
                score += 0.1
            scored.append({"strategy": strategy, "score": score})

        scored.sort(key=lambda item: item["score"], reverse=True)
        return scored[:limit]

    def search_similar_failures(
        self,
        db: Session,
        user_id: str,
        embedding: list[float],
        limit: int = 3,
        exclude_id: str | None = None,
    ) -> list[dict[str, Any]]:
        # Strictly scoped to the owning user — never leak another user's history.
        query = select(FailureReflection).where(FailureReflection.user_id == user_id)
        if exclude_id:
            query = query.where(FailureReflection.id != exclude_id)

        scored: list[dict[str, Any]] = []
        for reflection in db.scalars(query):
            if not reflection.embedding:
                continue
            score = cosine_similarity(embedding, reflection.embedding)
            scored.append({"reflection": reflection, "score": score})

        scored.sort(key=lambda item: item["score"], reverse=True)
        return scored[:limit]
