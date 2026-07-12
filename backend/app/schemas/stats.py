from pydantic import BaseModel


class UserStats(BaseModel):
    total_check_ins: int
    done_count: int
    missed_count: int
    completion_rate: float
    habit_count: int
    active_habit_count: int


class DailyStat(BaseModel):
    date: str
    done: int
    missed: int
    total: int


class RecurringExcuse(BaseModel):
    category: str
    count: int
