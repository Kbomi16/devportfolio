import { createBrowserRouter } from 'react-router-dom'
import RootLayout from './RootLayout'
import Home from '../pages/Home'
import Work from '../pages/Work'

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/work/:slug', element: <Work /> },
    ],
  },
])
