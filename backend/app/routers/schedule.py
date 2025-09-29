from fastapi import Depends, APIRouter, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from .. import schemas, database, models, api_key, oauth2

router = APIRouter(
    prefix="/schedule"
)

@router.get("/count", response_model=schemas.ScheduleNum)
def get_schedule_count(db: Session = Depends(database.get_db),
                       api_key: str = Depends(api_key.validate_api_key)):
    count = db.query(func.count(models.Schedule.id)).scalar()
    return {"count": count}

# @router.post("/")
# def create_schedule(schedule: schemas.ScheduleOut,
#                     db: Session = Depends(database.get_db),
#                     curr_user: int = Depends(oauth2.get_current_user))