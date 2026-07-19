from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db
from app.dependencies import get_current_user
from app.services import coach_service, habit_service, strategy_service

router = APIRouter(prefix="/coach", tags=["coach"])


@router.post("/reflect", response_model=schemas.CoachResponse)
async def reflect_on_failure(
    payload: schemas.CoachRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
) -> dict:
    # Ownership check first: never coach on a habit the user does not own.
    habit = habit_service.get_owned_habit(db, current_user.id, payload.habit_id)
    if not habit:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Habit not found")

    # If a check-in is being linked, it must belong to this user and habit —
    # otherwise a foreign check_in_id could be attached to the reflection.
    if payload.check_in_id:
        check_in = habit_service.get_owned_check_in(
            db, current_user.id, payload.check_in_id, habit_id=habit.id
        )
        if not check_in:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Check-in not found"
            )

    return await coach_service.process_reflection(
        db,
        user=current_user,
        habit=habit,
        reason_text=payload.reason_text,
        check_in_id=payload.check_in_id,
    )


@router.get("/strategies", response_model=list[schemas.StrategyOut])
def list_strategies(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
) -> list[models.Strategy]:
    return strategy_service.get_all_strategies(db)
