"""Read-only agent tools. All queries are scoped to the owning user, so the
coach can never surface another user's data. Aggregations run in SQL — history
grows unboundedly and these run on the latency-sensitive coaching path.
"""
from __future__ import annotations

from datetime import timedelta
from typing import Any

from sqlalchemy import case, func, select
from sqlalchemy.orm import Session

from app.models import CheckIn, FailureReflection

# Streak lookback window; a streak longer than this is reported as the cap.
_STREAK_WINDOW = 90


def get_current_streak(db: Session, user_id: str, habit_id: str) -> int:
    """Consecutive 'done' days for the habit.

    Coaching runs right AFTER today's miss is recorded, so leading non-done
    check-ins are skipped: the coach should reference the streak the user had
    going into the miss, not always 0.
    """
    rows = db.execute(
        select(CheckIn.check_date, CheckIn.status)
        .where(CheckIn.user_id == user_id, CheckIn.habit_id == habit_id)
        .order_by(CheckIn.check_date.desc())
        .limit(_STREAK_WINDOW)
    ).all()

    index = 0
    while index < len(rows) and rows[index].status != "done":
        index += 1

    streak = 0
    expected_date = None
    for row in rows[index:]:
        if row.status != "done":
            break
        if expected_date is not None and row.check_date != expected_date:
            break
        streak += 1
        expected_date = row.check_date - timedelta(days=1)
    return streak


def get_user_failure_patterns(
    db: Session, user_id: str, habit_id: str | None = None
) -> dict[str, Any]:
    """Aggregate the user's recorded failure categories and completion rate."""
    reflection_query = (
        select(FailureReflection.category, func.count(FailureReflection.id))
        .where(FailureReflection.user_id == user_id)
        .group_by(FailureReflection.category)
    )
    check_in_query = select(
        func.count(CheckIn.id),
        func.coalesce(func.sum(case((CheckIn.status == "done", 1), else_=0)), 0),
    ).where(CheckIn.user_id == user_id)
    if habit_id:
        reflection_query = reflection_query.where(FailureReflection.habit_id == habit_id)
        check_in_query = check_in_query.where(CheckIn.habit_id == habit_id)

    category_counts: dict[str, int] = dict(db.execute(reflection_query).all())
    total, done = db.execute(check_in_query).one()
    completion_rate = round(done / total, 2) if total else 0.0

    top_category = None
    if category_counts:
        top_category = max(category_counts, key=category_counts.get)

    return {
        "top_category": top_category,
        "category_counts": category_counts,
        "total_reflections": sum(category_counts.values()),
        "completion_rate": completion_rate,
    }
