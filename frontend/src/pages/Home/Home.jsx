// import axios from 'axios';
import { Link } from "react-router";
import { useState, useEffect } from 'react'
import { Schedule } from "../../components/schedule/Schedule";
import { HomeDashboard } from "./HomeDashboard";
import { schedule } from '../../utils/ScheduleData';

export function Home({ currSession, isLoadingSession }) {
    // const [schedule, setSchedule] = useState({})
    const [isLoadingSched, setIsLoadingSched] = useState(true)

    useEffect(() => {
        // const fetchSchedule = async () => {
        //     try {
        //         const response = await axios.post(
        //             '/api/generate',
        //             data,
        //             {
        //                 headers: {
        //                     'Content-Type': 'application/json',
        //                     'X-API-Key': '67b09141-e39e-4e86-a729-fc45940c93e3'
        //                 }
        //             }
        //         );

        //         setSchedule(response.data);
        //         localStorage.setItem("schedule", JSON.stringify(response.data));
        //     } catch (err) {
        //         console.log(err.message);
        //     } finally {
        //         setIsLoadingSched(false);
        //     }
        // };

        // fetchSchedule();

        setTimeout(() => {
            (async () => setIsLoadingSched(false))();
        }, 2000)
    }, []);


    return (
        <div className="flex w-full flex-col xl:flex-row">
            <div className="flex flex-3 flex-col">
                <HomeDashboard currSession={currSession} isLoadingSession={isLoadingSession} />
                <div className="p-3 h-full">
                    <div className="bg-white rounded-xl py-3">
                        <div className="flex justify-between items-center px-6 pb-3">
                            <h1 className="font-semibold text-lg">Schedule</h1>
                            <div className="flex">
                                <Link to="/generate" className="bg-stone-600 text-white flex items-center gap-2 text-sm py-2 px-5 rounded-xl hover:bg-stone-500">
                                    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14m-7 7V5" />
                                    </svg>
                                    New Schedule
                                </Link>
                            </div>
                        </div>
                        <Schedule schedule={schedule.schedule} isLoadingSched={isLoadingSched} />
                    </div>
                </div>

            </div>
            <div className="flex-1">
                sss
            </div>

        </div>
    );
}