from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


class HabitCreate(BaseModel):
    title: str = Field(min_length=2, max_length=160)
    goal_text: str | None = None
    frequency: Literal["daily", "weekly"]
    preferred_time: str | None = Field(default=None, max_length=40)
    identity_text: str | None = None


class HabitUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=2, max_length=160)
    goal_text: str | None = None
    frequency: Literal["daily", "weekly"] | None = None
    preferred_time: str | None = Field(default=None, max_length=40)
    identity_text: str | None = None
    is_active: bool | None = None


class HabitRead(BaseModel):
    id: str
    title: str
    goal_text: str | None
    frequency: str
    preferred_time: str | None
    identity_text: str | None
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
