import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import HomePage from './pages/HomePage'
import ProjectDetailPage from './pages/ProjectDetailPage'
import { useEffect, useState } from 'react'
import Loading from './pages/LoadingPage'
import { PATHS } from './constants/PATHS'

function App() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 6000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {isLoading && isLoading ? (
        <Loading />
      ) : (
        <Router>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path={PATHS.home.link} element={<HomePage />} />
              <Route
                path={`${PATHS.project.link}/:id`}
                element={<ProjectDetailPage />}
              />
            </Routes>
          </AnimatePresence>
        </Router>
      )}
    </>
  )
}

export default App
