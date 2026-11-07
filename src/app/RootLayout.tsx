import { Outlet } from 'react-router-dom'
import NeonCursorRing from '../components/common/NeonCursorRing'
import Preloader from '../components/preloader/Preloader'
import PageTransition from '../components/transition/PageTransition'
import { useLenis } from '../lib/useLenis'
import { usePointer } from '../lib/usePointer'
import SceneRoot from '../scene/SceneRoot'

export default function RootLayout() {
  useLenis()
  usePointer()

  return (
    <PageTransition>
      <NeonCursorRing />
      <Preloader />
      <Outlet />
      <SceneRoot />
    </PageTransition>
  )
}
