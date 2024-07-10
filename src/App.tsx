import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import HomePage from './pages/HomePage'
import { PAGES } from './constants/paths'
import ProjectPage from './pages/ProjectPage'

function App() {
  return (
    <Router>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path={PAGES.home.link} element={<HomePage />} />
          <Route path={`${PAGES.project.link}/:id`} element={<ProjectPage />} />
        </Routes>
      </AnimatePresence>
    </Router>
  )
}

export default App
