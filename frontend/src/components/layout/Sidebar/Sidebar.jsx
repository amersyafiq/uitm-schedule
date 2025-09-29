import uitmLogo from '../../../assets/uitm-logo.png'
import { useState, useEffect } from 'react'
import { SidebarSection } from './SidebarSection';
import { SidebarNotice } from './SidebarNotice';
import { useLocation } from 'react-router';

export function Sidebar() {
    const location = useLocation();
    const [selected, setSelected] = useState("Home");
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (location.pathname === "/home") {
            setSelected("Home");
        } else if (location.pathname === "/course") {
            setSelected("Find Courses");
        } else if (location.pathname === "/generate") {
            setSelected("Generate Schedule");
        } else if (location.pathname === "/history") {
            setSelected("Schedule History");
        } else if (location.pathname === "/profile") {
            setSelected("User Profile");
        } else if (location.pathname === "/users") {
            setSelected("User Management");
        }
    }, [location]);

    return (
        <nav className="fixed top-0 left-0 z-40 w-70 p-4 h-screen transition-transform -translate-x-full sm:translate-x-0">
            <div className="h-full rounded-2xl bg-white py-4 px-6 overflow-y-auto no-scrollbar text-black shadow-sm relative">
                <div className='flex flex-col items-center justify-center'>
                    <div className='flex items-center pt-2 justify-between'>
                        <img src={uitmLogo} alt='UiTM Logo' className="w-28" />
                        <span className='h-13 border-l-1 border-gray-400 mx-2'></span>
                        <p className='leading-4 text-gray-600 font-serif text-2sm w-18'>UiTM Schedule Generator</p>
                    </div>
                    <div className='bg-gray-200 rounded-2xl px-4 py-0.5 mt-2'>
                        <p className='text-xs'>v1.0.0</p>
                    </div>
                </div>
                <hr className="flex-shrink-0 border-0 h-[0.0625rem] my-4 opacity-25 bg-gradient-to-r from-transparent via-gray-700 to-transparent" />

                <SidebarSection
                    title={"MAIN MENU"}
                    items={[{
                        item: "Home",
                        path: "/",
                        svg: (<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24" className='mr-5'>
                            <path fillRule="evenodd" d="M11.293 3.293a1 1 0 0 1 1.414 0l6 6 2 2a1 1 0 0 1-1.414 1.414L19 12.414V19a2 2 0 0 1-2 2h-3a1 1 0 0 1-1-1v-3h-2v3a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2v-6.586l-.293.293a1 1 0 0 1-1.414-1.414l2-2 6-6Z" clipRule="evenodd" />
                        </svg>)
                    }, {
                        item: "Find Courses",
                        path: "/course",
                        svg: (<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24" className='mr-5'>
                            <path fillRule="evenodd" d="M11 4.717c-2.286-.58-4.16-.756-7.045-.71A1.99 1.99 0 0 0 2 6v11c0 1.133.934 2.022 2.044 2.007 2.759-.038 4.5.16 6.956.791V4.717Zm2 15.081c2.456-.631 4.198-.829 6.956-.791A2.013 2.013 0 0 0 22 16.999V6a1.99 1.99 0 0 0-1.955-1.993c-2.885-.046-4.76.13-7.045.71v15.081Z" clipRule="evenodd" />
                        </svg>)
                    }, {
                        item: "Generate Schedule",
                        path: "/generate",
                        svg: (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" className='mr-5'>
                            <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492M5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0" />
                            <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115z" />
                        </svg>)
                    }, {
                        item: "Schedule History",
                        path: "/history",
                        svg: (<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" className='mr-5'>
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3M3.22302 14C4.13247 18.008 7.71683 21 12 21c4.9706 0 9-4.0294 9-9 0-4.97056-4.0294-9-9-9-3.72916 0-6.92858 2.26806-8.29409 5.5M7 9H3V5" />
                        </svg>)
                    }]}
                    selected={selected}
                    setSelected={setSelected}
                />

                <hr className="flex-shrink-0 border-0 h-[0.0625rem] my-4 opacity-25 bg-gradient-to-r from-transparent via-gray-700 to-transparent" />

                <SidebarSection
                    title={"PROFILE"}
                    items={[{
                        item: "User Profile",
                        path: "/profile",
                        svg: (<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24" className='mr-5'>
                            <path fillRule="evenodd" d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4h-4Z" clipRule="evenodd" />
                        </svg>)
                    }, {
                        item: "User Management",
                        path: "/users",
                        svg: (<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24" className='mr-5'>
                            <path d="M10.83 5a3.001 3.001 0 0 0-5.66 0H4a1 1 0 1 0 0 2h1.17a3.001 3.001 0 0 0 5.66 0H20a1 1 0 1 0 0-2h-9.17ZM4 11h9.17a3.001 3.001 0 0 1 5.66 0H20a1 1 0 1 1 0 2h-1.17a3.001 3.001 0 0 1-5.66 0H4a1 1 0 1 1 0-2Zm1.17 6H4a1 1 0 1 0 0 2h1.17a3.001 3.001 0 0 0 5.66 0H20a1 1 0 1 0 0-2h-9.17a3.001 3.001 0 0 0-5.66 0Z" />
                        </svg>)
                    }]}
                    selected={selected}
                    setSelected={setSelected}
                />

                <hr className="flex-shrink-0 border-0 h-[0.0625rem] my-4 opacity-20 bg-gradient-to-r from-transparent via-gray-700 to-transparent" />

                <SidebarNotice
                    text={"This website is still under development."}
                    type={"Announcement"}
                    isVisible={isVisible}
                    setIsVisible={setIsVisible}
                />

            </div>
        </nav>
    );
}