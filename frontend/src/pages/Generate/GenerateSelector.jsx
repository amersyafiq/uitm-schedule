import { GenerateCourses } from './GenerateCourses';

export function GenerateSelector({ schedCourses, setSchedCourses }) {
    const handleSelectAll = (bool) => {
        setSchedCourses((prev) =>
            prev.map((course) => ({
                ...course,
                classes: course.classes.map((c) => ({
                    ...c,
                    select: bool,
                })),
            }))
        );
    };

    return (
        <div className="flex-2 flex p-3 gap-3 h-fit min-w-70">
            <div className="bg-white rounded-xl w-full pb-4">
                <div className="p-4">
                    <h1 className='font-bold text-xs text-gray-400 mb-1'>SELECT CLASSES</h1>
                    <p className='leading-5'>Choose which classes to be included in the generation process</p>
                </div>
                <div className='px-4 mb-1 flex gap-2'>
                    <button
                        className="bg-stone-700 text-white text-sm px-3 py-1 rounded-sm cursor-pointer hover:bg-stone-500"
                        onClick={() => handleSelectAll(true)}
                    >
                        Select All
                    </button>
                    <button
                        className="bg-stone-700 text-white text-sm px-3 py-1 rounded-sm cursor-pointer hover:bg-stone-500"
                        onClick={() => handleSelectAll(false)}
                    >
                        Reset
                    </button>
                </div>
                {schedCourses.map((cc) => (
                    <GenerateCourses key={cc.code} cc={cc} setSchedCourses={setSchedCourses} />
                ))}
            </div>
        </div>
    )
}