"""Strategy pool management: load the behaviour-science strategies and their
embeddings so the retriever has grounding material.
"""
from __future__ import annotations

import json
import logging
from pathlib import Path

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models import Strategy
from app.rag.embedder import EmbedderService

logger = logging.getLogger("identity_coach.strategy")

SEED_PATH = Path(__file__).resolve().parents[2] / "strategies" / "seed.json"


def get_all_strategies(db: Session) -> list[Strategy]:
    return list(db.scalars(select(Strategy).order_by(Strategy.title)))


def count_strategies(db: Session) -> int:
    return db.scalar(select(func.count(Strategy.id))) or 0


def _load_seed() -> list[dict]:
    if not SEED_PATH.exists():
        logger.warning("Strategy seed file not found at %s", SEED_PATH)
        return []
    with SEED_PATH.open(encoding="utf-8") as fh:
        return json.load(fh)


async def seed_strategies(db: Session, embedder: EmbedderService | None = None) -> int:
    """Upsert strategies from seed.json (idempotent, keyed by title) and compute
    their embeddings. Returns the number of strategies inserted or updated.
    """
    entries = _load_seed()
    if not entries:
        return 0

    embedder = embedder or EmbedderService()
    texts = [f"{e.get('title', '')} {e.get('content', '')}".strip() for e in entries]
    embeddings = await embedder.embed_batch(texts)

    existing = {s.title: s for s in db.scalars(select(Strategy))}
    changed = 0
    for entry, embedding in zip(entries, embeddings):
        title = entry.get("title", "").strip()
        if not title:
            continue
        strategy = existing.get(title)
        if strategy is None:
            strategy = Strategy(title=title)
            db.add(strategy)
        strategy.source = entry.get("source")
        strategy.trigger_category = entry.get("trigger_category")
        strategy.content = entry.get("content", "")
        strategy.example_advice = entry.get("example_advice")
        strategy.embedding = embedding
        changed += 1

    db.commit()
    logger.info("Seeded %d strategies (embedder=%s)", changed, embedder.name)
    return changed


async def ensure_seeded(db: Session) -> int:
    """Seed when the pool is empty, and RE-seed when the configured embedder's
    dimension no longer matches the stored embeddings (e.g. offline 256-dim →
    OpenAI 1536-dim). Without this, every cosine similarity would silently be
    0.0 and RAG ranking would degrade to near-arbitrary. Safe to call on
    startup.
    """
    if count_strategies(db) == 0:
        return await seed_strategies(db)

    stored = db.scalar(
        select(Strategy).where(Strategy.embedding.is_not(None)).limit(1)
    )
    if stored is None or not stored.embedding:
        # Rows exist but embeddings are missing — compute them.
        return await seed_strategies(db)

    embedder = EmbedderService()
    probe = await embedder.embed_text("boyut kontrolü")
    if len(probe) != len(stored.embedding):
        logger.warning(
            "Embedding dimension changed (%d stored, %d current); re-seeding strategies.",
            len(stored.embedding),
            len(probe),
        )
        return await seed_strategies(db, embedder)
    return 0
