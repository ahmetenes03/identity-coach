from datetime import date, datetime

from sqlalchemy import Date, DateTime, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.base import uuid_str


class CheckIn(Base):
    __tablename__ = "check_ins"
    __table_args__ = (UniqueConstraint("habit_id", "check_date", name="uq_check_ins_habit_date"),)

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_str)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    habit_id: Mapped[str] = mapped_column(ForeignKey("habits.id", ondelete="CASCADE"), index=True, nullable=False)
    check_date: Mapped[date] = mapped_column(Date, nullable=False)
    status: Mapped[str] = mapped_column(String(20), nullable=False)
    mood_score: Mapped[int | None] = mapped_column(Integer)
    note: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    user: Mapped["User"] = relationship(back_populates="check_ins")
    habit: Mapped["Habit"] = relationship(back_populates="check_ins")
