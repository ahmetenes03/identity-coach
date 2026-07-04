from app.schemas.user import LoginRequest, Token, UserCreate, UserRead
from app.schemas.habit import HabitCreate, HabitRead, HabitUpdate
from app.schemas.check_in import CheckInCreate, CheckInRead

# Sprint 2+ TODO schemas:
# from app.schemas.coach import CoachRequest, CoachResponse
# from app.schemas.stats import WeeklyStats, UserStats, RecurringExcuseStats

__all__ = [
    "UserCreate",
    "UserRead",
    "Token",
    "LoginRequest",
    "HabitCreate",
    "HabitUpdate",
    "HabitRead",
    "CheckInCreate",
    "CheckInRead",
]
