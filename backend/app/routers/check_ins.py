from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db
from app.dependencies import get_current_user

router = APIRouter(prefix="/check-ins", tags=["check-ins"])


@router.post("", response_model=schemas.CheckInRead, status_code=status.HTTP_201_CREATED)
def create_check_in(
    payload: schemas.CheckInCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
) -> models.CheckIn:
    habit = db.scalar(
        select(models.Habit).where(
            models.Habit.id == payload.habit_id,
            models.Habit.user_id == current_user.id,
            models.Habit.is_active.is_(True),
        )
    )
    if not habit:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Active habit not found")

    existing_check_in = db.scalar(
        select(models.CheckIn).where(
            models.CheckIn.habit_id == payload.habit_id,
            models.CheckIn.check_date == payload.check_date,
        )
    )
    if existing_check_in:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Habit already checked in for this date")

    # "mood_score yalnızca done için" kuralı CheckInCreate şemasında doğrulanır.
    check_in = models.CheckIn(user_id=current_user.id, **payload.model_dump())
    db.add(check_in)
    db.commit()
    db.refresh(check_in)
    return check_in


@router.get("", response_model=list[schemas.CheckInRead])
def list_check_ins(
    habit_id: str | None = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
) -> list[models.CheckIn]:
    query = select(models.CheckIn).where(models.CheckIn.user_id == current_user.id)
    if habit_id:
        query = query.where(models.CheckIn.habit_id == habit_id)
    query = query.order_by(models.CheckIn.check_date.desc(), models.CheckIn.created_at.desc())
    return list(db.scalars(query))
