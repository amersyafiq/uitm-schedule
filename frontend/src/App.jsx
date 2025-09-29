import { Routes, Route, Navigate } from 'react-router'
import { Home } from "./pages/Home/Home"
import { Course } from './pages/Course/Course'
import { Generate } from './pages/Generate/Generate'
import { Sidebar } from './components/layout/Sidebar/Sidebar'
import { Header } from './components/layout/Header/Header'
import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [currSession, setCurrSession] = useState('');
  const [isLoadingSession, setIsLoadingSession] = useState(true)
  const [schedCourses, setSchedCourses] = useState(() => {
    const saved = localStorage.getItem("schedule_courses");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await axios.get('/api/icress/session', {
          headers: { "X-API-Key": "67b09141-e39e-4e86-a729-fc45940c93e3" }
        })
        setCurrSession(response.data)
      } catch (err) {
        console.log(err.message)
      } finally {
        setIsLoadingSession(false)
      }
    }

    fetchSession()

  }, [])

  useEffect(() => {
        localStorage.setItem("schedule_courses", JSON.stringify(schedCourses))
    }, [schedCourses])

  return (
    <>
      <Sidebar />
      <div className="-z-10 bg-[url(./assets/main-wave-1.png)] absolute w-full h-full bg-center-top bg-no-repeat -top-0 opacity-15" />
      <div className="-z-10 bg-[url(./assets/main-wave-2.png)] absolute w-full h-full bg-center-top bg-no-repeat top-0 opacity-45" />
      <main className='ml-0 sm:ml-66.5 p-4.5 transition-[margin-left] duration-300 ease-[cubic-bezier(0.4, 0, 0.2, 1)]'>
        <Header />
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home
                                          currSession={currSession}
                                          isLoadingSession={isLoadingSession}
                                    />} />
          <Route path="/course" element={<Course
                                            currSession={currSession}
                                            isLoadingSession={isLoadingSession}
                                            schedCourses={schedCourses}
                                            setSchedCourses={setSchedCourses}
                                        />}/>
          <Route path="/generate" element={<Generate 
                                              schedCourses={schedCourses}
                                              setSchedCourses={setSchedCourses}
                                            />} />
        </Routes>
      </main>
    </>
  )
}

export default App
