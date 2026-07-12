from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, Field, model_validator


class CheckInCreate(BaseModel):
    habit_id: str
    check_date: date
    status: Literal["done", "missed"]
    mood_score: int | None = Field(default=None, ge=1, le=10)
    note: str | None = None

    @model_validator(mode="after")
    def _mood_only_for_done(self) -> "CheckInCreate":
        # İş kuralı veri şeklinde yaşar: router'lar dışındaki her yazma yolu
        # (servisler, importlar) da aynı kuraldan geçer.
        if self.status != "done" and self.mood_score is not None:
            raise ValueError("Mood score is only saved for done habits")
        return self


class CheckInRead(BaseModel):
    id: str
    habit_id: str
    check_date: date
    status: str
    mood_score: int | None
    note: str | None
    created_at: datetime

    model_config = {"from_attributes": True}
