from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db
from app.dependencies import get_current_user

router = APIRouter(prefix="/habits", tags=["habits"])


@router.get("", response_model=list[schemas.HabitRead])
def list_habits(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
) -> list[models.Habit]:
    return list(
        db.scalars(
            select(models.Habit)
            .where(models.Habit.user_id == current_user.id)
            .order_by(models.Habit.created_at.desc())
        )
    )


@router.post("", response_model=schemas.HabitRead, status_code=status.HTTP_201_CREATED)
def create_habit(
    payload: schemas.HabitCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
) -> models.Habit:
    active_count = db.scalar(
        select(func.count(models.Habit.id)).where(
            models.Habit.user_id == current_user.id,
            models.Habit.is_active.is_(True),
        )
    )
    if active_count is not None and active_count >= 3:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="A user can track up to 3 active habits")

    habit = models.Habit(user_id=current_user.id, **payload.model_dump())
    db.add(habit)
    db.commit()
    db.refresh(habit)
    return habit


@router.patch("/{habit_id}", response_model=schemas.HabitRead)
def update_habit(
    habit_id: str,
    payload: schemas.HabitUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
) -> models.Habit:
    habit = db.scalar(select(models.Habit).where(models.Habit.id == habit_id, models.Habit.user_id == current_user.id))
    if not habit:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Habit not found")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(habit, field, value)

    db.commit()
    db.refresh(habit)
    return habit


@router.delete("/{habit_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_habit(
    habit_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
) -> None:
    habit = db.scalar(select(models.Habit).where(models.Habit.id == habit_id, models.Habit.user_id == current_user.id))
    if not habit:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Habit not found")

    db.delete(habit)
    db.commit()
