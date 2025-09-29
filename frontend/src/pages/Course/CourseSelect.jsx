import { tailspin } from 'ldrs'
import { Droppable, Draggable } from "@hello-pangea/dnd";

export function CourseSelect({ isLoading, isLoadingSession, courses}) {
    tailspin.register()
    return (
        <div className="overflow-scroll no-scrollbar relative bg-gray-100 shadow-inner mb-5 h-115 p-6">
            <table className="w-full border-separate border-spacing-y-1">
                <thead>
                    <tr className="text-sm text-stone-500">
                        <th className="px-4 text-start w-15 pb-2">#</th>
                        <th className="px-2 text-start w-30 pb-2">COURSE</th>
                        <th className="px-2 text-start w-25 pb-2">SESSION</th>
                        <th className="px-2 text-start w-20 pb-2">CAMPUS</th>
                        <th className="px-2 text-start w-20 pb-2">FACULTY</th>
                        <th className="px-2 text-start w-30 pb-2">TOTAL CLASSES</th>
                        <th className="px-2 text-start w-20 pb-2">ACTION</th>
                    </tr>
                </thead>
                <Droppable droppableId="select" type="group">
                    {(provided) => (
                        <tbody
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            {(isLoading || isLoadingSession) ? (
                                <tr>
                                    <td colSpan="100%" className="text-center">
                                        <div className="flex justify-center items-center h-95">
                                            <l-tailspin size="40" stroke="5" speed="0.9" color="black" />
                                        </div>
                                    </td>
                                </tr>
                            ) : courses?.length ? (
                                courses.map((course, index) => (
                                    <Draggable
                                        draggableId={`select-${course.code}-${course.session}-${course.campus}`}
                                        key={`${course.code}-${course.session}-${course.campus}`}
                                        index={index}
                                    >
                                        {(provided) => (
                                            <tr
                                                className="bg-white shadow rounded-lg overflow-hidden font-light select-none"
                                                {...provided.dragHandleProps}
                                                {...provided.draggableProps}
                                                ref={provided.innerRef}
                                            >
                                                <td className="py-1 px-4 w-15 rounded-l-lg">{index + 1}</td>
                                                <td className="py-1 px-2 w-30">{course.code}</td>
                                                <td className="py-1 px-2 w-25">{course.session}</td>
                                                <td className="py-1 px-2 w-20">{course.campus}</td>
                                                <td className="py-1 px-2 w-20">{course.faculty}</td>
                                                <td className="py-1 px-2 w-30">{course.classes.length}</td>
                                                <td className="py-1 px-2 w-20 rounded-r-lg">
                                                    <svg className="hover:bg-gray-200 rounded-sm ml-auto mr-2 cursor-pointer" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" >
                                                        <path stroke="currentColor" strokeLinecap="round" strokeWidth="1" d="M5 7h14M5 12h14M5 17h14" />
                                                    </svg>
                                                </td>
                                            </tr>
                                        )}
                                    </Draggable>
                                ))
                            ) : (
                                <tr className="bg-white shadow rounded-lg overflow-hidden">
                                    <td colSpan={7} className="py-2 px-4 rounded-lg text-center">
                                        Cannot find any data
                                    </td>
                                </tr>
                            )}

                            {provided.placeholder}
                        </tbody>
                    )}
                </Droppable>
            </table>
        </div>
    );
}