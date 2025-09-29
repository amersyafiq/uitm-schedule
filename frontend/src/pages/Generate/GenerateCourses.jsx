import { useState } from 'react'
import { GenerateClasses } from './GenerateClasses';

export function GenerateCourses({ cc, setSchedCourses }) {
    const [isActive, setIsActive] = useState(false)

    const handleSelectClass = (class_group) => {
        setSchedCourses((prev) =>
            prev.map((course) => {
                if (
                    course.code === cc.code &&
                    course.session === cc.session &&
                    course.campus === cc.campus
                ) {
                    return {
                        ...course,
                        classes: course.classes.map((c) =>
                            c.class_group === class_group
                                ? { ...c, select: !c.select }
                                : c
                        ),
                    };
                }
                return course;
            })
        );
    };


    return (
        <div className="">
            <div
                className="flex mx-3 py-2 cursor-pointer"
                onClick={() => setIsActive(!isActive)}
            >
                <div className="w-15 flex justify-center items-center">
                    {
                        cc.classes.some(c => c.select) ? (
                            <svg className="text-green-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm13.707-1.293a1 1 0 0 0-1.414-1.414L11 12.586l-1.793-1.793a1 1 0 0 0-1.414 1.414l2.5 2.5a1 1 0 0 0 1.414 0l4-4Z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            <svg className="text-red-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm7.707-3.707a1 1 0 0 0-1.414 1.414L10.586 12l-2.293 2.293a1 1 0 1 0 1.414 1.414L12 13.414l2.293 2.293a1 1 0 0 0 1.414-1.414L13.414 12l2.293-2.293a1 1 0 0 0-1.414-1.414L12 10.586 9.707 8.293Z" clipRule="evenodd" />
                            </svg>
                        )
                    }

                </div>
                <div className="w-full ml-2">
                    <h1 className='font-bold text-xs text-stone-700 leading-4'>{cc.code}</h1>
                    <p className="text-xs text-gray-500">{cc.classes.length} Available Classes</p>
                </div>
                <div className="flex justify-center items-center mr-1 text-gray-400">
                    {!isActive ? (
                        <svg className="hover:bg-stone-200 rounded-2xl cursor-pointer" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m8 10 4 4 4-4" />
                        </svg>
                    ) : (
                        <svg className="bg-stone-200 rounded-2xl cursor-pointer" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m16 14-4-4-4 4" />
                        </svg>
                    )
                    }
                </div>
            </div>
            {isActive &&
                <div className="overflow-scroll no-scrollbar bg-gray-200 shadow-inner max-h-70 px-6 py-3 flex flex-wrap gap-x-1 justify-center">
                    {
                        cc.classes.map((classGroup) => {
                            return (
                                <GenerateClasses
                                    key={classGroup.class_group}
                                    classGroup={classGroup}
                                    handleSelectClass={handleSelectClass}
                                />
                            );
                        })
                    }
                </div>
            }
        </div>
    );
}