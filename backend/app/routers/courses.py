from datetime import datetime
from typing import Optional
from fastapi import Depends, APIRouter, HTTPException, status as stat
from sqlalchemy.orm import Session
from sqlalchemy import func
from .. import schemas, database, models, api_key
from bs4 import BeautifulSoup
import requests
import re

router = APIRouter(
    prefix="/courses"
)

@router.get("/")
def get_courses(db: Session = Depends(database.get_db),
                campus: Optional[str] = "",
                faculty: Optional[str] = "",
                session: Optional[str] = "",
                code: Optional[str] = ""):
    
    courses = db.query( models.Course) \
                .outerjoin( models.Class, (models.Class.course_code == models.Course.code) & (models.Class.course_campus == models.Course.campus) & (models.Class.course_session == models.Course.session), )
    if campus:
        courses = courses.filter(models.Course.campus == campus)
    if faculty:
        courses = courses.filter(models.Course.faculty == faculty)
    if code:
        courses = courses.filter(models.Course.code == code)

    results = courses.filter(models.Course.session == session) \
                     .group_by( models.Course.code, models.Course.campus, models.Course.session, models.Course.faculty, ) \
                     .order_by(models.Course.session, models.Course.code, models.Course.campus) \
                     .all()

    response = [
        {
            "code": course.code,
            "campus": course.campus,
            "session": course.session,
            "faculty": course.faculty,
            "classes": [
                {
                    "class_group": c.class_group,
                    "select": False
                }
                for c in course.classes
            ]
        }
        for course in results
    ]

    return response

@router.post("/")
def scrap_courses(
    db: Session = Depends(database.get_db),
    api_key: str = Depends(api_key.validate_api_key),
    code: Optional[str] = "",
    session: Optional[str] = "",
    campus: Optional[str] = "",
    faculty: Optional[str] = ""
):
    # ===================================================
    # 1. Check if course already exists in DB
    # ===================================================
    course = (
        db.query(models.Course)
        .filter(models.Course.code == code)
        .filter(models.Course.session == session)
        .filter(models.Course.campus == campus)
    )

    if faculty:
        course = course.filter(models.Course.faculty == faculty)

    course = course.first()
    if course:
        raise HTTPException(
            status_code=stat.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Course already exists"
        )

    # ===================================================
    # 2. Scraping course list
    # ===================================================
    form_data = {
        "search_campus": campus,
        "search_faculty": faculty,
        "search_course": code,
    }

    headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0",
        "Referer": "https://simsweb4.uitm.edu.my/estudent/class_timetable/index.html",
    }

    url = "https://simsweb4.uitm.edu.my/estudent/class_timetable/index_result.cfm"
    http_session = requests.Session()
    response = http_session.post(url, data=form_data, headers=headers)
    soup = BeautifulSoup(response.text, "lxml")

    course = soup.find("tr", attrs={"class": "gradeU"})
    if not course:
        raise HTTPException(
            status_code=stat.HTTP_404_NOT_FOUND,
            detail="This course is not offered in this semester",
        )

    num = course.find("td")
    course_name = num.find_next().text
    course_link = course.find("button")["onclick"].split("'")[1]

    # ===================================================
    # 3. Scraping course details
    # ===================================================
    search_url = (
        "https://simsweb4.uitm.edu.my/estudent/class_timetable/" + course_link
    )
    response2 = http_session.get(search_url, headers=headers)
    soup = BeautifulSoup(response2.text, "lxml")

    scrapped_info = (
        soup.find("strong").decode_contents().replace("<br/>", " ").strip().split()
    )
    scrapped_session = scrapped_info[2]
    scrapped_course = scrapped_info[6]
    scrapped_campus = campus

    # ===================================================
    # 4. Insert Course into DB (fix FK error)
    # ===================================================
    new_course = models.Course(
        session=scrapped_session,
        code=scrapped_course,
        campus=scrapped_campus,
        faculty=faculty,
    )
    db.add(new_course)
    db.commit()
    db.refresh(new_course)

    # ===================================================
    # 5. Insert Classes & Timeslots
    # ===================================================
    rows = soup.find("tbody").find_all("tr")
    day_mapping = {
        "MONDAY": 1,
        "TUESDAY": 2,
        "WEDNESDAY": 3,
        "THURSDAY": 4,
        "FRIDAY": 5,
        "SATURDAY": 6,
        "SUNDAY": 7,
    }

    for row in rows:
        columns = row.find_all("td")
        row_data = [col.get_text(separator=" ").strip() for col in columns]
        # Example row_data:
        # ['10.', 'FRIDAY (  08:00 AM-10:00 AM  )', 'JCDCS1434E', 'Fulltime',
        #  'First Timer Only', 'SL_110-111 CS2', 'CDCS143', 'CD']

        # Day
        day = row_data[1].split(" (")[0].strip().upper()
        day_of_week = day_mapping.get(day)

        # Time parsing
        start_time_raw, end_time_raw = (
            row_data[1].split(" (  ")[1].split("  )")[0].split("-")
        )

        def normalize_time(t: str) -> str:
            t = t.strip()
            has_am = "AM" in t
            has_pm = "PM" in t
            t = t.replace("AM", "").replace("PM", "").strip()
            hour, minute = map(int, t.split(":"))
            if has_pm and hour < 12:
                hour += 12
            if has_am and hour == 12:
                hour = 0
            return f"{hour:02d}:{minute:02d}:00"

        start_time = normalize_time(start_time_raw)
        end_time = normalize_time(end_time_raw)

        # Class info
        class_group = row_data[2]
        mode = row_data[3]
        status = row_data[4]
        location = row_data[5] if row_data[5] else "ONLINE"

        # Insert Class
        existing_class = (
            db.query(models.Class)
            .filter(models.Class.course_code == scrapped_course)
            .filter(models.Class.course_session == scrapped_session)
            .filter(models.Class.course_campus == scrapped_campus)
            .filter(models.Class.class_group == class_group)
            .first()
        )

        if not existing_class:
            new_class = models.Class(
                class_group=class_group,
                course_session=scrapped_session,
                course_code=scrapped_course,
                course_campus=scrapped_campus,
                programme_code=""
            )
            db.add(new_class)
            db.commit()
            db.refresh(new_class)
            class_id = new_class.id
        else:
            class_id = existing_class.id

        # Insert Timeslot
        existing_timeslot = (
            db.query(models.Timeslot)
            .filter(models.Timeslot.class_id == class_id)
            .filter(models.Timeslot.day_of_week == day_of_week)
            .filter(models.Timeslot.start_time == start_time)
            .filter(models.Timeslot.end_time == end_time)
            .first()
        )
        if not existing_timeslot:
            new_timeslot = models.Timeslot(
                day_of_week=day_of_week,
                start_time=start_time,
                end_time=end_time,
                room_code=location,
                mode=mode,
                status=status,
                class_id=class_id,
            )
            db.add(new_timeslot)
            db.commit()

    return {"message": "Course and classes scrapped & saved successfully"}



        # results.append({
        #     "day": day,
        #     "start_time": start_time,
        #     "end_time": end_time,
        #     "location": location,
        #     "mode": mode,
        #     "status": status,
        #     "class_code": class_code
        # })
 
    