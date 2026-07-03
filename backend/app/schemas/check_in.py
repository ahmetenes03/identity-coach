from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, Field


class CheckInCreate(BaseModel):
    habit_id: str
    check_date: date
    status: Literal["done", "missed"]
    mood_score: int | None = Field(default=None, ge=1, le=10)
    note: str | None = None


class CheckInRead(BaseModel):
    id: str
    habit_id: str
    check_date: date
    status: str
    mood_score: int | None
    note: str | None
    created_at: datetime

    model_config = {"from_attributes": True}
