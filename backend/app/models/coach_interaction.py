from datetime import datetime

from sqlalchemy import JSON, DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base
from app.models.base import uuid_str


class CoachInteraction(Base):
    """An audit record of one coaching response: which strategies were used and
    which provider/model produced the message. Scoped to the owning user.
    """

    __tablename__ = "coach_interactions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_str)
    user_id: Mapped[str] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False
    )
    habit_id: Mapped[str] = mapped_column(
        ForeignKey("habits.id", ondelete="CASCADE"), index=True, nullable=False
    )
    failure_reflection_id: Mapped[str | None] = mapped_column(
        ForeignKey("failure_reflections.id", ondelete="SET NULL")
    )
    category: Mapped[str | None] = mapped_column(String(40))
    response_text: Mapped[str] = mapped_column(Text, nullable=False)
    strategy_ids: Mapped[list[str] | None] = mapped_column(JSON)
    provider: Mapped[str | None] = mapped_column(String(40))
    model: Mapped[str | None] = mapped_column(String(80))
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, nullable=False
    )
