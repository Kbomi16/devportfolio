import { createBrowserRouter } from 'react-router-dom'
import Home from '../pages/Home'
import Work from '../pages/Work'

export const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/work/:slug', element: <Work /> },
])
