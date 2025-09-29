import axios from 'axios';
import { useEffect, useState } from 'react'
import { DragDropContext } from "@hello-pangea/dnd";
import { CourseFilter } from './CourseFilter';
import { CourseSelect } from './CourseSelect';
import { CourseSchedule } from './CourseSchedule';

export function Course({ currSession, isLoadingSession, schedCourses, setSchedCourses }) {

    const [optionsCam, setOptionsCam] = useState([]);
    const [optionsFac, setOptionsFac] = useState([]);
    const [selectedCampus, setSelectedCampus] = useState({ "value": '', "label": 'Select...' });
    const [selectedFaculty, setSelectedFaculty] = useState({ "value": '', "label": 'Select...' });
    const [selectedCourse, setSelectedCourse] = useState({ "value": '', "label": 'Select...' });
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchFilterData = async () => {
            try {
                const [rawCam, rawFac] = await Promise.all([
                    axios.get("/api/icress/campus", {
                        headers: { "X-API-Key": "67b09141-e39e-4e86-a729-fc45940c93e3" },
                    }),
                    axios.get("/api/icress/faculty", {
                        headers: { "X-API-Key": "67b09141-e39e-4e86-a729-fc45940c93e3" },
                    }),
                ]);

                setOptionsCam(
                    rawCam.data.results.map((item) => ({
                        value: item.id,
                        label: item.text,
                    }))
                );

                setOptionsFac(
                    rawFac.data.results.map((item) => ({
                        value: item.id,
                        label: item.text,
                    }))
                );
            } catch (err) {
                console.error("Error fetching filter data:", err.message);
            }
        };

        fetchFilterData();

    }, []);

    useEffect(() => {
        if (!currSession || !currSession.session) return;
        const fetchCourses = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`/api/courses?campus=${selectedCampus.value}&faculty=${selectedFaculty.value}&session=${currSession.session}&code=${selectedCourse.value}`);
                setCourses(
                    response.data.filter((course) =>                        // Exclude that course if course returned false
                            !schedCourses.some((sched) =>                   // Returns False if matches code, session & campus
                                    sched.code === course.code &&
                                    sched.session === course.session &&
                                    sched.campus === course.campus
                            )
                    )
                );
            } catch (err) {
                console.error("Error fetching courses:", err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourses();
    }, [selectedCampus, selectedFaculty, selectedCourse, currSession, schedCourses]);

    const handleDragDrop = (results) => {
        const { source, destination, type } = results;

        if (!destination) return;
        if (source.droppableId === destination.droppableId && source.index === destination.index) return;

        if (type === "group") {
            // Reordering within the same list
            if (source.droppableId === destination.droppableId) {
                const reordered = source.droppableId === "select" ? [...courses] : [...schedCourses];
                const [movedItem] = reordered.splice(source.index, 1);
                reordered.splice(destination.index, 0, movedItem);

                if (source.droppableId === "select") {
                    setCourses(reordered);
                } else {
                    setSchedCourses(reordered);
                }
            } else {
                // Moving between lists
                const sourceList = source.droppableId === "select" ? [...courses] : [...schedCourses];
                const destList = destination.droppableId === "select" ? [...courses] : [...schedCourses];

                const [movedItem] = sourceList.splice(source.index, 1);

                // Only 9 courses can be selected for schedule
                if (destination.droppableId === "schedule" && destList.length == 9) {
                    destList.splice(0, 1) // Automatically remove the first one
                }

                destList.splice(destination.index, 0, movedItem);

                if (source.droppableId === "select") {
                    setCourses(sourceList);
                    setSchedCourses(destList);
                } else {
                    setSchedCourses(sourceList);
                    setCourses(destList);
                }
            }
        }
    };

    return (
        <DragDropContext onDragEnd={handleDragDrop}>
            <div className="flex w-full flex-col lg:flex-row">
                <div className="flex flex-5 flex-col lg:flex-row p-3">
                    <div className="bg-white rounded-xl w-full">
                        <CourseFilter
                            selectedCampus={selectedCampus}
                            selectedFaculty={selectedFaculty}
                            selectedCourse={selectedCourse}
                            setSelectedCampus={setSelectedCampus}
                            setSelectedFaculty={setSelectedFaculty}
                            setSelectedCourse={setSelectedCourse}
                            optionsCam={optionsCam}
                            optionsFac={optionsFac}
                            courses={courses}
                        />
                        <CourseSelect
                            isLoading={isLoading}
                            isLoadingSession={isLoadingSession}
                            courses={courses}
                        />
                    </div>
                </div>
                <div className="flex-2 flex-col lg:flex-row p-3">
                    <div className="bg-white rounded-xl w-full">
                        <div className='px-4 py-4 flex flex-col'>
                            <h1 className='font-bold text-xs text-gray-400 mb-2'>SELECTED COURSES</h1>
                            <p className='leading-5'>Drag and drop the courses you wish to generate a schedule with </p>
                        </div>
                        <CourseSchedule
                            schedCourses={schedCourses}
                            setSchedCourses={setSchedCourses}
                        />
                        <hr />
                    </div>
                </div>
            </div>
        </DragDropContext>
    );
}