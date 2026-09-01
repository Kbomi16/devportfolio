import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CinemaCanvas from '../scene/CinemaCanvas'
import Stage from '../scene/Stage'
import CameraRig from '../scene/CameraRig'
import Character from '../scene/Character'
import Exhibits from '../scene/exhibits/Exhibits'
import Nav from '../overlay/Nav'
import Portal from '../overlay/Portal'
import Reveal from '../overlay/Reveal'
import WorkLabels from '../overlay/WorkLabels'
import Method from '../overlay/Method'
import Journal from '../overlay/Journal'
import Close from '../overlay/Close'
import { useLenis, getLenis, scrollToProgress } from '../lib/useLenis'
import { useProgress } from '../lib/progress'

export default function Home() {
  const [leaving, setLeaving] = useState(false)

  useLenis()
  const navigate = useNavigate()
  const pendingSlug = useProgress((s) => s.pendingSlug)

  // 케이스 전환: 스크롤 잠금 → 카메라 푸시인(CameraRig) + 블랙 페이드 → 라우팅
  useEffect(() => {
    if (!pendingSlug) return
    setLeaving(true)
    getLenis()?.stop()
    sessionStorage.setItem('home-progress', String(useProgress.getState().p))
    const id = setTimeout(() => {
      navigate(`/work/${pendingSlug}`)
      useProgress.getState().setPendingSlug(null)
    }, 750)
    return () => clearTimeout(id)
  }, [pendingSlug, navigate])

  // 케이스 페이지에서 복귀 시 CH3 위치 복원
  useEffect(() => {
    const saved = sessionStorage.getItem('home-progress')
    if (saved !== null) {
      sessionStorage.removeItem('home-progress')
      requestAnimationFrame(() => scrollToProgress(Number(saved), true))
    }
  }, [])

  return (
    <>
      <CinemaCanvas>
        <Stage />
        <CameraRig />
        <Character />
        <Exhibits />
      </CinemaCanvas>

      <main className="track">
        <Reveal />
        <WorkLabels />
        <Method />
        <Journal />
        <Close />
      </main>

      <Portal />
      <Nav />

      <div className={`route-fade${leaving ? ' is-on' : ''}`} aria-hidden />
    </>
  )
}
