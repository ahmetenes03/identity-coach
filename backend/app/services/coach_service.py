"""Coach service — the failure-reflection pipeline.

process_reflection ties together classification, RAG retrieval, the LLM coach,
and persistence. The habit is looked up ownership-checked by the caller, so this
layer trusts that the habit belongs to the user.
"""
from __future__ import annotations

import logging
from typing import Any

from sqlalchemy.orm import Session

from app.agents import (
    CoachAgent,
    classify_failure_reason,
    get_current_streak,
    get_user_failure_patterns,
)
from app.config import get_settings
from app.llm.prompt_format import CATEGORY_LABELS_TR
from app.llm.providers.offline import OfflineLLM
from app.models import CoachInteraction, FailureReflection, Habit, User
from app.rag.retriever import Retriever

logger = logging.getLogger("identity_coach.coach")


async def process_reflection(
    db: Session,
    user: User,
    habit: Habit,
    reason_text: str,
    check_in_id: str | None = None,
) -> dict[str, Any]:
    settings = get_settings()
    reason_text = reason_text.strip()

    category = classify_failure_reason(reason_text)

    # 1. Retrieve grounding context (embedding + strategies + past failures).
    #    Retrieving before persisting keeps the new reflection out of its own
    #    "past failures" set.
    retriever = Retriever()
    retrieved = await retriever.retrieve_for_coaching(
        db,
        user_id=user.id,
        failure_reason=reason_text,
        category=category,
        top_k_strategies=settings.coach_strategy_top_k,
    )
    strategies = [item["strategy"] for item in retrieved["strategies"]]

    # 2. Persist the reflection with its embedding.
    reflection = FailureReflection(
        user_id=user.id,
        habit_id=habit.id,
        check_in_id=check_in_id,
        reason_text=reason_text,
        category=category,
        embedding=retrieved["embedding"],
    )
    db.add(reflection)
    db.flush()  # assign reflection.id without committing yet

    # 3. Tool context.
    streak = get_current_streak(db, user.id, habit.id)
    patterns = get_user_failure_patterns(db, user.id, habit.id)

    # 4. Generate the coaching message; degrade to offline on any LLM error so
    #    the endpoint never fails because of an external provider.
    coach_kwargs = dict(
        identity_text=habit.identity_text,
        habit_title=habit.title,
        category=category,
        streak=streak,
        top_pattern=patterns.get("top_category"),
        strategies=strategies,
        reason_text=reason_text,
        temperature=settings.llm_temperature,
    )
    agent = CoachAgent()
    try:
        message = await agent.coach(**coach_kwargs)
        provider, model = agent.provider, agent.model
        if not message:
            raise ValueError("empty coaching response")
    except Exception as exc:  # noqa: BLE001 - resilient fallback, no secrets
        logger.warning("Coach LLM failed (%s); using offline coach.", exc)
        agent = CoachAgent(OfflineLLM())
        message = await agent.coach(**coach_kwargs)
        provider, model = agent.provider, agent.model

    # 5. Persist the interaction for auditing.
    interaction = CoachInteraction(
        user_id=user.id,
        habit_id=habit.id,
        failure_reflection_id=reflection.id,
        category=category,
        response_text=message,
        strategy_ids=[s.id for s in strategies],
        provider=provider,
        model=model,
    )
    db.add(interaction)
    db.commit()

    return {
        "reflection_id": reflection.id,
        "category": category,
        "category_label": CATEGORY_LABELS_TR.get(category, category),
        "message": message,
        "strategies": strategies,
        "streak": streak,
        "top_pattern": patterns.get("top_category"),
        "provider": provider,
        "model": model,
    }
