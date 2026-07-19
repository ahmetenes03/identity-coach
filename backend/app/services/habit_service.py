"""Habit ownership helpers shared by the AI services.

The Sprint 1 habits router still runs its own queries; this module only exposes
the small, security-critical lookups the coach/stats layers need so they never
operate on a habit the requesting user does not own.
"""
from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import CheckIn, Habit


def get_owned_habit(db: Session, user_id: str, habit_id: str) -> Habit | None:
    """Return the habit only if it belongs to ``user_id`` (else None)."""
    return db.scalar(
        select(Habit).where(Habit.id == habit_id, Habit.user_id == user_id)
    )


def get_owned_check_in(
    db: Session, user_id: str, check_in_id: str, habit_id: str | None = None
) -> CheckIn | None:
    """Return the check-in only if it belongs to ``user_id`` (and habit)."""
    query = select(CheckIn).where(
        CheckIn.id == check_in_id, CheckIn.user_id == user_id
    )
    if habit_id:
        query = query.where(CheckIn.habit_id == habit_id)
    return db.scalar(query)
