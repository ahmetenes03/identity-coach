"""Statistics computed on demand from check-ins and failure reflections.

All queries are user-scoped. Kept read-only and derived (no denormalised
counters to drift); the strategy pool is small and per-user history is bounded.
"""
from __future__ import annotations

from datetime import date, timedelta
from typing import Any

from sqlalchemy import case, func, select
from sqlalchemy.orm import Session

from app.models import CheckIn, FailureReflection, Habit


def get_user_stats(db: Session, user_id: str) -> dict[str, Any]:
    # Two integers via SQL — check-in history grows unboundedly, so full-row
    # hydration on the dashboard's hottest endpoint would be wasted work.
    total, done = db.execute(
        select(
            func.count(CheckIn.id),
            func.coalesce(func.sum(case((CheckIn.status == "done", 1), else_=0)), 0),
        ).where(CheckIn.user_id == user_id)
    ).one()
    missed = total - done

    habit_count = db.scalar(
        select(func.count(Habit.id)).where(Habit.user_id == user_id)
    ) or 0
    active_habit_count = db.scalar(
        select(func.count(Habit.id)).where(
            Habit.user_id == user_id, Habit.is_active.is_(True)
        )
    ) or 0

    return {
        "total_check_ins": total,
        "done_count": done,
        "missed_count": missed,
        "completion_rate": round(done / total, 2) if total else 0.0,
        "habit_count": habit_count,
        "active_habit_count": active_habit_count,
    }


def get_weekly_stats(
    db: Session, user_id: str, days: int = 7, today: date | None = None
) -> list[dict[str, Any]]:
    # ``today`` gelmezse sunucu tarihi kullanılır; frontend kendi yerel tarihini
    # gönderir ki kullanıcı sunucudan ileri bir dilimdeyken bugünkü check-in
    # pencere dışında kalmasın.
    today = today or date.today()
    start = today - timedelta(days=days - 1)

    check_ins = list(
        db.scalars(
            select(CheckIn).where(
                CheckIn.user_id == user_id,
                CheckIn.check_date >= start,
                CheckIn.check_date <= today,
            )
        )
    )
    by_date: dict[date, dict[str, int]] = {
        start + timedelta(days=i): {"done": 0, "missed": 0} for i in range(days)
    }
    for check_in in check_ins:
        bucket = by_date.get(check_in.check_date)
        if bucket is None:
            continue
        if check_in.status == "done":
            bucket["done"] += 1
        else:
            bucket["missed"] += 1

    return [
        {
            "date": day.isoformat(),
            "done": counts["done"],
            "missed": counts["missed"],
            "total": counts["done"] + counts["missed"],
        }
        for day, counts in sorted(by_date.items())
    ]


def get_recurring_excuses(db: Session, user_id: str) -> list[dict[str, Any]]:
    rows = db.execute(
        select(FailureReflection.category, func.count(FailureReflection.id))
        .where(FailureReflection.user_id == user_id)
        .group_by(FailureReflection.category)
        .order_by(func.count(FailureReflection.id).desc())
    ).all()
    return [{"category": category, "count": count} for category, count in rows]
