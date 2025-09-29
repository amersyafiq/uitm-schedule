from datetime import datetime, time
from typing import Dict, List, Optional
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Annotated


# ================ DASHBOARD ====================
class StudentNum(BaseModel):
    count: int

class ScheduleNum(BaseModel):
    count: int

class CurrentSession(BaseModel):
    session: str


# ================ TIMESLOT ====================
class TimeslotOut(BaseModel):
    timeslot_id: int
    day_of_week: int
    start_time: time
    end_time: time
    room_code: str
    mode: str
    status: str


# ================ CLASS ====================
class ClassIn(BaseModel):
    code: str
    session: str
    campus: str

class ScheduleClassOut(BaseModel):
    class_id: int
    class_group: str
    course_session: str
    course_code: str
    course_campus: str
    programme_code: str
    timeslot: TimeslotOut

    class Config:
        from_attributes: True

class SelectedClassIn(BaseModel):
    class_group: str
    select: bool


# ================ SCHEDULE ====================
class ScheduleOut(BaseModel):
    schedule: Dict[int, List[ScheduleClassOut]]
    fitness: float
    generation: int
    
    class Config:
        from_attributes: True


# ================ GENERATE ====================
class SelectedCourse(BaseModel):
    code: str
    session: str
    campus: str
    faculty: str
    classes: List[SelectedClassIn] 

    class Config:
        from_attributes = True
