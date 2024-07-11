import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import HomePage from './pages/HomePage'
import { PAGES } from './constants/paths'
import ProjectDetailPage from './pages/ProjectDetailPage'
import { useEffect, useState } from 'react'
import Loading from './pages/LoadingPage'

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
              <Route path={PAGES.home.link} element={<HomePage />} />
              <Route
                path={`${PAGES.project.link}/:id`}
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
