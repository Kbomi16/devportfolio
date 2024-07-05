import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import './App.css'
import HomePage from './pages/HomePage'
import { PAGES } from './constants/paths'

function App() {
  return (
    <Router>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path={PAGES.home.link} element={<HomePage />} />
        </Routes>
      </AnimatePresence>
    </Router>
  )
}

export default App
