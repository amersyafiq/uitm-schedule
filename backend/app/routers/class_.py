from fastapi import Depends, APIRouter, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from .. import schemas, database, models, api_key

router = APIRouter(
    prefix="/class"
)

@router.post("/")
def get_classes_course(courses: list[schemas.ClassIn],
                       db: Session = Depends(database.get_db),
                       api_key: str = Depends(api_key.validate_api_key)):
    courses_with_classes = [] 
    for course in courses:
        classes = db.query(models.Class) \
                    .filter(models.Class.course_code == course.code) \
                    .filter(models.Class.course_session == course.session) \
                    .filter(models.Class.course_campus == course.campus).all()
        courses_with_classes.append({
            "code": course.code, 
            "session": course.session, 
            "campus": course.campus, 
            "classes": 
            [
                {
                    "group": class_.class_group, 
                    "select": False
                } 
                for class_ in classes
            ]
            
        })

    return courses_with_classes
    