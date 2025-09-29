import random as rnd
from datetime import time
from typing import List, Optional
from fastapi import Depends, APIRouter, HTTPException, status
from sqlalchemy.orm import Session
from .. import schemas, database, models, api_key

router = APIRouter(
    prefix="/generate"
)


# ==============================================
#                PYTHON CLASSES
# ==============================================

class Course:
    def __init__(self, session, code, campus, faculty):
        self._session = session
        self._code = code
        self._campus = campus
        self._faculty = faculty
    def get_session(self): return self._session
    def get_code(self): return self._code
    def get_campus(self): return self._campus
    def get_faculty(self): return self._faculty
    def __str__(self): return str(self._code) + " (" + str(self._session) + ")"

class Class:
    def __init__(self, id, class_group, course, programme_code, timeslots):
        self._id = id
        self._class_group = class_group
        self._course = course
        self._programme_code = programme_code
        self._timeslots = timeslots
    def get_id(self): return self._id
    def get_class_group(self): return self._class_group
    def get_course(self): return self._course
    def get_programme_code(self): return self._programme_code
    def get_timeslots(self): return self._timeslots
    def __str__(self): return str(self._class_group) + ", " + str(self._course) + ", [" + " | ".join(map(str, self._timeslots)) + "]"
    def to_dict(self):
        return {
            "class_id": self._id,
            "class_group": self._class_group,
            "course_session": self._course.get_session(),
            "course_code": self._course.get_code(),
            "course_campus": self._course.get_campus(),
            "program": self._programme_code,
            "timeslots": [t.to_dict() for t in self._timeslots]
        }

class Timeslot:
    def __init__(self, id, day_of_week, start_time, end_time, room_code, mode, status):
        self._id = id
        self._day_of_week = day_of_week
        self._start_time = start_time
        self._end_time = end_time
        self._room_code = room_code
        self._mode = mode
        self._status = status
    def get_id(self): return self._id
    def get_day_of_week(self): return self._day_of_week
    def get_start_time(self): return self._start_time
    def get_end_time(self): return self._end_time
    def get_room_code(self): return self._room_code
    def get_mode(self): return self._mode
    def get_status(self): return self._status
    def print_day(self):
        match self._day_of_week:
            case 1: day = "Mon"
            case 2: day = "Tue"
            case 3: day = "Wed"
            case 4: day = "Thu"
            case 5: day = "Fri"
            case _: day = None
        return day
    def __str__(self): return str(self.print_day()) + " (" + str(self._start_time) + " - " + str(self._end_time) + ")"
    def __repr__(self): return self.__str__()
    def to_dict(self):
        return {
            "timeslot_id": self._id,
            "day_of_week": self._day_of_week,
            "start_time": str(self._start_time),
            "end_time": str(self._end_time),
            "room_code": self._room_code,
            "mode": self._mode,
            "status": self._status
        }

class Conflict:
    def __init__(self, conflictBetweenSessions):
        self._conflictType = "OVERLAP"
        self._conflictBetweenSessions = conflictBetweenSessions
    def get_conflictType(self): return self._conflictType
    def get_conflictBetweenSessions(self): return self._conflictBetweenSessions
    def __str__(self): return str(self._conflictType)+" "+str(" and ".join(map(str, self._conflictBetweenSessions)))


# ==============================================
#              DATABASE MANAGER
# ==============================================

class DBMgr:
    def __init__(self, db: Session, selected_courses: List[schemas.SelectedCourse]):
        self._db = db
        self._selected_courses = selected_courses
        self._courses = self.select_courses(selected_courses)
        self._classes = self.select_classes()
        self._numberOfClasses = len(self._courses)

    # Instantiate Courses based on selected courses by user
    def select_courses(self, selected):
        if not selected: return []

        selected_session = [s.session for s in selected]
        selected_code = [s.code for s in selected]
        selected_campus = [s.campus for s in selected]
        courses = self._db.query(models.Course).filter(models.Course.session.in_(selected_session)).filter(models.Course.code.in_(selected_code)).filter(models.Course.campus.in_(selected_campus)).all()
        
        returnCourses = [Course(course.session, course.code, course.campus, course.faculty) for course in courses]
        return returnCourses

    # Instantiate Classes based on the instantiated courses and allowed classes
    def select_classes(self):
        returnClasses = []
        for course in self._courses:
            # Find the matching SelectedCourse object (to see if it has restrictions)
            selected_course = next((s for s in self._selected_courses 
                                if s.session == course.get_session()
                                and s.code == course.get_code()
                                and s.campus == course.get_campus()), None)

            # allowed_classes = selected_course.classes if selected_course and selected_course.classes else None
            allowed_classes = [c.class_group for c in selected_course.classes if c.select]

            # Fetch classes for this course
            query = self._db.query(models.Class).filter(
                models.Class.course_session == course.get_session(),
                models.Class.course_code == course.get_code(),   
                models.Class.course_campus == course.get_campus(),   
            )

            query = query.filter(models.Class.class_group.in_(allowed_classes))
            classes = query.all()

            if not classes:
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail={
                        "code": "NO_CLASSES_SELECTED",
                        "message": "Please select at least one class for every course"
                    }
                )

            for class_ in classes:
                timeslots = [Timeslot(t.id, t.day_of_week, t.start_time, t.end_time,
                                    t.room_code, t.mode, t.status) for t in class_.timeslots]
                returnClasses.append(Class(class_.id, class_.class_group, course,
                                        class_.programme_code, timeslots))
        return returnClasses
    
    def get_classes_by_course(self, course):
        return [c for c in self._classes
                if c.get_course().get_session() == course.get_session()
                and c.get_course().get_code() == course.get_code()
                and c.get_course().get_campus() == course.get_campus()]
    def get_courses(self): return self._courses
    def get_classes(self): return self._classes
    def get_numberOfClasses(self): return self._numberOfClasses


# ==============================================
#           GENETIC ALGORITHM CORES
# ==============================================

POPULATION_SIZE = 9                  # Number of schedules in each population
NUMB_OF_ELITE_SCHEDULES = 1          # Number of top schedules carried unchanged to next generation
TOURNAMENT_SELECTION_SIZE = 3        # Size of the tournament selection pool
MUTATION_RATE = 0.1                  # Probability of mutation in a session

class Schedule:
    def __init__(self, dbMgr):
        self._dbMgr = dbMgr
        self._classes = []
        self._conflicts = []
        self._fitness = -1
        self._isFitnessChanged = True

    def get_classes(self):
        self._isFitnessChanged = True
        return self._classes

    def get_conflicts(self): return self._conflicts

    # Fitness is recalculated only when needed
    def get_fitness(self, arrangement):
        if self._isFitnessChanged:
            self._fitness = self.calculate_fitness(arrangement)
            self._isFitnessChanged = False
        return self._fitness
    
    def initialize(self):
        courses = self._dbMgr.get_courses()
        for course in courses:
            classes = self._dbMgr.get_classes_by_course(course)
            chosen_class = rnd.choice(classes)
            self._classes.append(chosen_class)
        return self
    
    def timeslots_overlap(self, t1, t2):
        if t1.get_day_of_week() == t2.get_day_of_week():
            if t1.get_start_time() < t2.get_end_time() and t2.get_start_time() < t1.get_end_time():
                return True
        return False
    
    def calculate_fitness(self, arrangement):
        self._conflicts = []
        classes = self.get_classes()

        # Check for timeslots overlapping
        for i in range(0, len(classes)):
            for j in range(i+1, len(classes)):
                for t1 in classes[i].get_timeslots():
                    for t2 in classes[j].get_timeslots():
                        if self.timeslots_overlap(t1, t2):
                            self._conflicts.append(Conflict([classes[i], classes[j]]))

        # Bonus point for morning classes
        bonus_point = 0
        for c in classes:
            for t in c.get_timeslots():
                if arrangement == 1:
                    if t.get_start_time() < time(12,0):
                        bonus_point += 1
                if arrangement == 2:
                    if t.get_start_time() > time(12,0):
                        bonus_point += 1
        

        # Reward / Penalize
        return (1 + 0.01 * bonus_point) / (1.0 * len(self._conflicts) + 1)
    
    def __str__(self):
        returnValue = ""
        for i in range(0, len(self._classes)-1): 
            returnValue += str(self._classes[i]) + ", "
        returnValue += str(self._classes[len(self._classes) - 1])
        return returnValue
    
    def to_dict(self):
        schedule_dict = {i: [] for i in range(1, 6)} 
        for c in self._classes:
            for t in c._timeslots:
                schedule_dict[t._day_of_week].append({
                    "class_id": c._id,
                    "class_group": c._class_group,
                    "course_session": str(c._course.get_session()),
                    "course_code": str(c._course.get_code()),
                    "course_campus": str(c._course.get_campus()),
                    "programme_code": c._programme_code,
                    "timeslot": t.to_dict()
                })
        return schedule_dict


class Population:
    def __init__(self, size, dbMgr):
        self._size = size
        self._schedules = []
        for i in range(0, size):
            self._schedules.append(Schedule(dbMgr).initialize())
    def get_schedules(self): return self._schedules


class GeneticAlgorithm:
    def __init__(self, dbMgr):
        self._dbMgr = dbMgr

    def evolve(self, pop, arrangement):
        return self._mutate_population(self._crossover_population(pop, arrangement))
    
    def _crossover_population(self, pop, arrangement):
        crossover_pop = Population(0, self._dbMgr) # Create a population of size 0 (empty container, _schedules = [])
        
        # Population has been sorted in descending order, 
        # top 3 best fitness classes stay, rest perform crossover
        for i in range(0, NUMB_OF_ELITE_SCHEDULES):
            crossover_pop.get_schedules().append(pop.get_schedules()[i])

        i = NUMB_OF_ELITE_SCHEDULES # 3
        while i < POPULATION_SIZE:  # 3 < 9
            schedule1 = self._select_tournament_population(pop, self._dbMgr, arrangement).get_schedules()[0]
            schedule2 = self._select_tournament_population(pop, self._dbMgr, arrangement).get_schedules()[0]
            crossover_pop.get_schedules().append(self._crossover_schedule(schedule1, schedule2, self._dbMgr))
            i += 1
        return crossover_pop

    def _mutate_population(self, pop):
        for i in range(NUMB_OF_ELITE_SCHEDULES, POPULATION_SIZE):
            self._mutate_schedule(pop.get_schedules()[i], self._dbMgr)
        return pop
    
    @staticmethod
    def _crossover_schedule(schedule1, schedule2, dbMgr):
        crossoverSchedule = Schedule(dbMgr).initialize()
        for i in range(0, len(crossoverSchedule.get_classes())):
            if rnd.random() > 0.5: # Uniform crossover (change gene depend on coin flip)
                crossoverSchedule.get_classes()[i] = schedule1.get_classes()[i]
            else: 
                crossoverSchedule.get_classes()[i] = schedule2.get_classes()[i]
        return crossoverSchedule

    @staticmethod
    def _mutate_schedule(mutateSchedule, dbMgr):
        schedule = Schedule(dbMgr).initialize()
        for i in range(0, len(mutateSchedule.get_classes())):
            if MUTATION_RATE > rnd.random(): 
                mutateSchedule.get_classes()[i] = schedule.get_classes()[i]
        return mutateSchedule

    @staticmethod
    def _select_tournament_population(pop, dbMgr, arrangement):
        tournament_pop = Population(0, dbMgr)
        i = 0
        while i < TOURNAMENT_SELECTION_SIZE:
            tournament_pop.get_schedules().append(pop.get_schedules()[rnd.randrange(0, POPULATION_SIZE)])
            i += 1
        tournament_pop.get_schedules().sort(key=lambda x: x.get_fitness(arrangement), reverse=True)
        return tournament_pop


def find_fittest_schedule(dbMgr, arrangement):
    generationNumber = 0
    population = Population(POPULATION_SIZE, dbMgr)
    population.get_schedules().sort(key=lambda x: x.get_fitness(arrangement), reverse=True)
    geneticAlgorithm = GeneticAlgorithm(dbMgr)
    
    best_schedule = population.get_schedules()[0]
    best_fitness = best_schedule.get_fitness(arrangement)
    bestGeneration = 0

    while best_fitness != 1.10 and generationNumber != 2000:
        generationNumber += 1
        population = geneticAlgorithm.evolve(population, arrangement)
        population.get_schedules().sort(key=lambda x: x.get_fitness(arrangement), reverse=True)

        current_best = population.get_schedules()[0]
        current_fitness = current_best.get_fitness(arrangement)

        if current_fitness > best_fitness:
            best_fitness = current_fitness
            best_schedule = current_best
            bestGeneration = generationNumber

    return best_schedule, bestGeneration

def find_clash(schedule):
    clashed = []
    for i in range(0, len(schedule._classes)):
        for j in range(i+1, len(schedule._classes)):
            for t1 in schedule._classes[i].get_timeslots():
                for t2 in schedule._classes[j].get_timeslots():
                    if t1.get_day_of_week() == t2.get_day_of_week():
                        if t1.get_start_time() < t2.get_end_time() and t2.get_start_time() < t1.get_end_time():
                            clashed.append((schedule._classes[i].get_course().get_code(),schedule._classes[j].get_course().get_code()))

    return clashed


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schemas.ScheduleOut)
def generate_schedule(selected: List[schemas.SelectedCourse],
                      db: Session = Depends(database.get_db),
                      api_key: str = Depends(api_key.validate_api_key),
                      arrangement_priority: int = 0):
    
    if arrangement_priority not in [1, 2]:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={
                "code": "INVALID_PRIORITY",
                "message": "Please select the arrangement priority"
            }
        )
    
    dbMgr = DBMgr(db, selected)
    schedule, generation = find_fittest_schedule(dbMgr, arrangement_priority)

    # If user selects only 1 class per course
    clashed_code = find_clash(schedule)
    if len(clashed_code) > 0:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={
                "code": "CLASHED_CLASSES",
                "message": "Some classes are clashing",
                "clashes": [
                    {"class1": c1, "class2": c2} for c1, c2 in clashed_code
                ]
            }
        )

    return {
        "schedule": schedule.to_dict(), 
        "fitness": schedule.get_fitness(arrangement_priority),
        "generation": generation
    }
