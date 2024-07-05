import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import './App.css'
import Footer from './components/Footer'
import Header from './components/Header'
import HomePage from './pages/HomePage'
import { PAGES } from './constants/paths'

function App() {
  return (
    <Router>
      <Header />

      <AnimatePresence mode="wait">
        <Routes>
          <Route path={PAGES.home.link} element={<HomePage />} />
        </Routes>
      </AnimatePresence>

      <Footer />
    </Router>
  )
}

export default App
