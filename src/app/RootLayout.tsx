import { Outlet } from 'react-router-dom'
import NeonCursorRing from '../components/common/NeonCursorRing'

export default function RootLayout() {
  return (
    <>
      <NeonCursorRing />
      <Outlet />
    </>
  )
}
