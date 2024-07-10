import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import HomePage from './pages/HomePage'
import { PAGES } from './constants/paths'
import ProjectDetailPage from './pages/ProjectDetailPage'

function App() {
  return (
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
  )
}

export default App
