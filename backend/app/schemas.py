from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, EmailStr, Field


class UserCreate(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class UserRead(BaseModel):
    id: str
    name: str
    email: EmailStr
    created_at: datetime

    model_config = {"from_attributes": True}


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserRead


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


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
