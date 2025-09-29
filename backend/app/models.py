from sqlalchemy import TIME, Column, ForeignKey, ForeignKeyConstraint, Integer, String
from sqlalchemy.sql.expression import text
from sqlalchemy.sql.sqltypes import TIMESTAMP
from sqlalchemy.orm import relationship

from .database import Base


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, nullable=False, autoincrement=True)
    email = Column(String, nullable=False)
    password = Column(String, nullable=False)
    name = Column(String, nullable=False)
    faculty = Column(String, nullable=False)
    program = Column(String, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=text('NOW()'), nullable=False)

    schedules = relationship("Schedule", back_populates="stu", cascade="all, delete-orphan")


class Schedule(Base):
    __tablename__ = "schedules"

    id = Column(Integer, primary_key=True, nullable=False)
    title = Column(String, nullable=False)
    session = Column(String, nullable=False)
    arrange_type = Column(Integer, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=text('NOW()'), nullable=False)
    stu_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False)

    stu = relationship("Student", back_populates="schedules")
    scheduled_classes = relationship("Scheduled_Class", back_populates="schedule", cascade="all, delete-orphan")


class Course(Base):
    __tablename__ = "courses"

    session = Column(String, primary_key=True, nullable=False)
    code = Column(String, primary_key=True, nullable=False)
    campus = Column(String, primary_key=True, nullable=False)
    faculty = Column(String, nullable=True)

    classes = relationship("Class", back_populates="course", cascade="all, delete-orphan")


class Class(Base):
    __tablename__ = "class"

    id = Column(Integer, primary_key=True, autoincrement=True)
    class_group = Column(String, nullable=False)
    programme_code = Column(String, nullable=True)
    course_session = Column(String, nullable=False)
    course_code = Column(String, nullable=False)
    course_campus = Column(String, nullable=False)

    __table_args__ = (
        ForeignKeyConstraint(
            ["course_session", "course_code", "course_campus"],
            ["courses.session", "courses.code", "courses.campus"],
            ondelete="CASCADE"
        ),
    )

    course = relationship("Course", back_populates="classes")
    timeslots = relationship("Timeslot", back_populates="class_", cascade="all, delete-orphan")
    scheduled_classes = relationship("Scheduled_Class", back_populates="class_", cascade="all, delete-orphan")


class Scheduled_Class(Base):
    __tablename__ = "scheduled_class"

    schedule_id = Column(Integer, ForeignKey("schedules.id", ondelete="CASCADE"), primary_key=True)
    class_id = Column(Integer, ForeignKey("class.id", ondelete="CASCADE"), primary_key=True)

    schedule = relationship("Schedule", back_populates="scheduled_classes")
    class_ = relationship("Class", back_populates="scheduled_classes")


class Timeslot(Base):
    __tablename__ = "timeslot"

    id = Column(Integer, primary_key=True, nullable=False, autoincrement=True)
    day_of_week = Column(Integer, nullable=False)
    start_time = Column(TIME(timezone=False), nullable=False)
    end_time = Column(TIME(timezone=False), nullable=False)
    room_code = Column(String, nullable=True)
    mode = Column(String, nullable=True)
    status = Column(String, nullable=True)
    class_id = Column(Integer, ForeignKey('class.id', ondelete='CASCADE'), nullable=False)

    class_ = relationship("Class", back_populates="timeslots")
