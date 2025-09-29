import { Schedule } from "../../components/schedule/Schedule";
import { useState } from 'react'
import axios from 'axios';
import { GenerateSelector } from './GenerateSelector';
import { GenerateForm } from "./GenerateForm";
import { GenerateError } from "./GenerateError";

export function Generate({ schedCourses, setSchedCourses }) {
    const [schedTitle, setSchedTitle] = useState('');
    const [selectedPriority, setSelectedPriority] = useState('');
    const [scheduleOut, setScheduleOut] = useState([]);
    const [isLoadingSchedOut, setIsLoadingSchedOut] = useState(false)
    const [errorModal, setErrorModal] = useState([])

    const handleFetchSchedule = async () => {
        setIsLoadingSchedOut(true)
        try {
            const priority = selectedPriority.value ? selectedPriority.value : 0;
            const response = await axios.post(`/api/generate?arrangement_priority=${priority}`, schedCourses, {
                headers: { "X-API-Key": "67b09141-e39e-4e86-a729-fc45940c93e3" },
            })
            setScheduleOut(response.data)
        } catch (err) {

            if (err.response) {
                const { code, message, clashes } = err.response.data?.detail || {}

                switch (code) {
                    case "NO_CLASSES_SELECTED":
                    case "INVALID_PRIORITY":
                        setErrorModal([...errorModal, message])
                        break
                    case "CLASHED_CLASSES":
                        {
                            const clashMsg = clashes ? clashes.map(c => `${c.class1} ⟷ ${c.class2}`).join("\n") : ""
                            setErrorModal([...errorModal, `${message}\n${clashMsg}`])
                            break
                        }
                    default:
                        setErrorModal([...errorModal, "Unexpected error occurred"])
                }

                setScheduleOut([])
            }

        } finally {
            setIsLoadingSchedOut(false)
        }
    }

    const handleSubmitSchedule = () => {

    }

    return (
        <div className="flex w-full flex-col lg:flex-row">
            <GenerateSelector schedCourses={schedCourses} setSchedCourses={setSchedCourses} />
            <div className="flex-6 p-3">
                <div className="bg-white rounded-xl w-full pb-3 relative">
                    <div className="flex flex-col px-6 py-6">
                        <GenerateForm
                            schedTitle={schedTitle}
                            setSchedTitle={setSchedTitle}
                            selectedPriority={selectedPriority}
                            setSelectedPriority={setSelectedPriority}
                            scheduleOut={scheduleOut}
                            handleFetchSchedule={handleFetchSchedule}
                        />
                    </div>
                    <Schedule schedule={scheduleOut.schedule} isLoadingSched={isLoadingSchedOut} />
                    <div className='fixed right-3 bottom-3 flex flex-col gap-2'>
                        {
                            errorModal.map((err, idx) => {
                                return (
                                    <GenerateError key={idx} err={err} setErrorModal={setErrorModal} idx={idx} />
                                );
                            })
                        }

                    </div>
                </div>
            </div>
        </div>
    );
}
