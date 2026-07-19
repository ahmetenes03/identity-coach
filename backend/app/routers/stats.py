from datetime import date

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db
from app.dependencies import get_current_user
from app.services import stats_service

router = APIRouter(prefix="/stats", tags=["stats"])


@router.get("/overview", response_model=schemas.UserStats)
def overview(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
) -> dict:
    return stats_service.get_user_stats(db, current_user.id)


@router.get("/weekly", response_model=list[schemas.DailyStat])
def weekly(
    today: date | None = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
) -> list[dict]:
    # Frontend kendi yerel tarihini gönderir; timezone kaymasında "bugün"
    # penceresinin dışında kalmasın.
    return stats_service.get_weekly_stats(db, current_user.id, today=today)


@router.get("/excuses", response_model=list[schemas.RecurringExcuse])
def recurring_excuses(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
) -> list[dict]:
    return stats_service.get_recurring_excuses(db, current_user.id)
