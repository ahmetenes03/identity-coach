from datetime import datetime

from sqlalchemy import JSON, DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base
from app.models.base import uuid_str


class FailureReflection(Base):
    """A user's recorded reason for missing a habit, plus its classification
    and embedding. Used to build the RAG "past failures" context and the
    recurring-excuse statistics. Always scoped to the owning user.
    """

    __tablename__ = "failure_reflections"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_str)
    user_id: Mapped[str] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False
    )
    habit_id: Mapped[str] = mapped_column(
        ForeignKey("habits.id", ondelete="CASCADE"), index=True, nullable=False
    )
    check_in_id: Mapped[str | None] = mapped_column(
        ForeignKey("check_ins.id", ondelete="SET NULL")
    )
    reason_text: Mapped[str] = mapped_column(Text, nullable=False)
    category: Mapped[str] = mapped_column(String(40), nullable=False)
    embedding: Mapped[list[float] | None] = mapped_column(JSON)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, nullable=False
    )
