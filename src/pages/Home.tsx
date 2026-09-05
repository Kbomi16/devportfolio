import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Nav from '../components/Nav'
import Film from '../sections/Film'
import Landing from '../sections/Landing'
import Gallery from '../sections/Gallery'
import Method from '../sections/Method'
import Journal from '../sections/Journal'
import Close from '../sections/Close'
import { ScrollTrigger } from '../lib/gsapSetup'
import { useLenis, getLenis } from '../lib/useLenis'
import { usePointer } from '../lib/usePointer'

export default function Home() {
  const [leaving, setLeaving] = useState(false)

  useLenis()
  usePointer()
  const navigate = useNavigate()

  // 갤러리 클릭: 스크롤 잠금 → 블랙 페이드 → 라우팅 (복귀용 위치 저장)
  const handleOpenWork = (slug: string) => {
    if (leaving) return
    setLeaving(true)
    sessionStorage.setItem('home-scroll', String(Math.round(window.scrollY)))
    getLenis()?.stop()
    setTimeout(() => navigate(`/work/${slug}`), 650)
  }

  // 케이스 페이지에서 복귀 시 갤러리 위치 복원
  useEffect(() => {
    const saved = sessionStorage.getItem('home-scroll')
    if (saved === null) return
    sessionStorage.removeItem('home-scroll')
    requestAnimationFrame(() => {
      ScrollTrigger.refresh()
      window.scrollTo({ top: Number(saved), behavior: 'instant' })
    })
  }, [])

  return (
    <>
      <Nav />
      <main>
        <Film />
        <Landing />
        <Gallery onOpenWork={handleOpenWork} />
        <Method />
        <Journal />
        <Close />
      </main>
      <div className={`route-fade${leaving ? ' is-on' : ''}`} aria-hidden />
    </>
  )
}
