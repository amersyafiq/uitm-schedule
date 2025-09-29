from fastapi import Depends, APIRouter, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from .. import schemas, database, models, api_key

router = APIRouter(
    prefix='/users'
)

@router.get("/count", response_model=schemas.StudentNum)
def get_user_count(db: Session = Depends(database.get_db),
                   api_key: str = Depends(api_key.validate_api_key)):
    count = db.query(func.count(models.Student.id)).scalar()
    return {"count": count}
