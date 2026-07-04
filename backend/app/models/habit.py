from sqlalchemy import Boolean, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.base import TimestampMixin, uuid_str


class Habit(TimestampMixin, Base):
    __tablename__ = "habits"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_str)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    title: Mapped[str] = mapped_column(String(160), nullable=False)
    goal_text: Mapped[str | None] = mapped_column(Text)
    frequency: Mapped[str] = mapped_column(String(20), nullable=False)
    preferred_time: Mapped[str | None] = mapped_column(String(40))
    identity_text: Mapped[str | None] = mapped_column(Text)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    user: Mapped["User"] = relationship(back_populates="habits")
    check_ins: Mapped[list["CheckIn"]] = relationship(back_populates="habit", cascade="all, delete-orphan")
