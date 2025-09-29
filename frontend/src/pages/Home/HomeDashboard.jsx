import axios from 'axios'
import { useState, useEffect } from 'react'
import scheduleIcon from "../../assets/schedule_icon.png"
import userIcon from "../../assets/user_icon.png"
import sessionIcon from "../../assets/session_icon.png"
import { tailspin } from 'ldrs'
import HomeDashboardCard from './HomeDashboardCard'

export function HomeDashboard({ currSession, isLoadingSession }) {
    const [userData, setUserData] = useState('0');
    const [scheduleData, setScheduleData] = useState('0');
    const [isLoadingUser, setIsLoadingUser] = useState(true);
    const [isLoadingSchedule, setIsLoadingSchedule] = useState(true);

    tailspin.register()

    useEffect(() => {

        const fetchData = async () => {
            try {
                const [scheduleRes, userRes] = await Promise.all([
                    axios.get('/api/schedule/count', {
                        headers: { 'X-API-Key': '67b09141-e39e-4e86-a729-fc45940c93e3' },
                    }),
                    axios.get('/api/users/count', {
                        headers: { 'X-API-Key': '67b09141-e39e-4e86-a729-fc45940c93e3' },
                    }),
                ]);

                setScheduleData(scheduleRes.data.count);
                setUserData(userRes.data.count);
            } catch (err) {
                console.log(err.message);
            } finally {
                setIsLoadingSchedule(false);
                setIsLoadingUser(false);
            }
        };

        fetchData();

    }, [])

    return (
        <div className="p-3 flex flex-col gap-5 w-full h-110 lg:flex-row lg:h-full">
            <HomeDashboardCard
                bgColor="bg-[#727FF1]"
                icon={scheduleIcon}
                value={scheduleData}
                label="GENERATED SCHEDULES"
                labelColor="text-indigo-300"
                isLoading={isLoadingSchedule}
            />
            <HomeDashboardCard
                bgColor="bg-[#FF7783]"
                icon={userIcon}
                value={userData}
                label="TOTAL USERS"
                labelColor="text-red-200"
                isLoading={isLoadingUser}
            />
            <HomeDashboardCard
                bgColor="bg-[#FFBA5A]"
                icon={sessionIcon}
                value={currSession.session}
                label="CURRENT SESSION"
                labelColor="text-orange-100"
                isLoading={isLoadingSession}
            />
        </div>
    );
}