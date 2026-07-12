from datetime import datetime

from sqlalchemy import JSON, DateTime, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base
from app.models.base import uuid_str


class Strategy(Base):
    __tablename__ = "strategies"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_str)
    title: Mapped[str] = mapped_column(String(160), nullable=False)
    source: Mapped[str | None] = mapped_column(String(160))
    trigger_category: Mapped[str | None] = mapped_column(String(80))
    content: Mapped[str] = mapped_column(Text, nullable=False)
    example_advice: Mapped[str | None] = mapped_column(Text)
    # Precomputed embedding of "title + content" for RAG. Portable JSON column
    # (works on both SQLite and Postgres); similarity is computed in Python.
    embedding: Mapped[list[float] | None] = mapped_column(JSON)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
