import { style } from '../../utils/select';
import Select from 'react-select'

export function CourseFilter({ selectedCampus, selectedFaculty, selectedCourse, setSelectedCampus, setSelectedFaculty, setSelectedCourse, optionsCam, optionsFac, courses }) {
    return (
        <div className="flex flex-col xl:flex-row xl:items-end gap-5 px-6 py-6">
            <div className='flex-1'>
                <h1 className='font-bold text-xs text-gray-400 mb-1'>SELECT CAMPUS</h1>
                <Select
                    value={selectedCampus}
                    onChange={(option) => setSelectedCampus(option)}
                    options={optionsCam}
                    isSearchable={true}
                    className="text-sm"
                    styles={style}
                />
            </div>
            <div className='flex-1'>
                <h1 className='font-bold text-xs text-gray-400 mb-1'>SELECT FACULTY</h1>
                <Select
                    value={selectedCampus?.value === 'B' ? selectedFaculty : ""}
                    onChange={(option) => setSelectedFaculty(option)}
                    isDisabled={selectedCampus?.value === 'B' ? false : true}
                    options={optionsFac}
                    isSearchable={true}
                    styles={style}
                />
            </div>
            <div className='flex-1'>
                <h1 className='font-bold text-xs text-gray-400 mb-1'>SELECT COURSE</h1>
                <Select
                    value={selectedCourse}
                    onChange={(option) => setSelectedCourse(option)}
                    options={[]}
                    isSearchable={true}
                    styles={style}
                />
            </div>
            {courses?.length ? (<div></div>) : (
                <div className='w-fit h-full flex items-end'>
                    <button className='bg-stone-700 text-white px-3 py-1 rounded-sm cursor-pointer'>Add Course</button>
                </div>
            )
            }
        </div>
    );
}