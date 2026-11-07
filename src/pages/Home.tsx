import { useEffect, useRef } from 'react'
import Nav from '../components/Nav'
import Hero from '../sections/Hero'
import Marquee from '../sections/Marquee'
import Gallery from '../sections/Gallery'
import Method from '../sections/Method'
import Pilot from '../sections/Pilot'
import Journal from '../sections/Journal'
import Close from '../sections/Close'
import { workBySlug } from '../content/works'
import { ScrollTrigger, useGSAP } from '../lib/gsapSetup'
import { usePageTransition } from '../lib/pageTransition'
import { refreshOnImageLoad } from '../lib/refreshOnImageLoad'
import { scrollToY } from '../lib/useLenis'

export default function Home() {
  const pageRef = useRef<HTMLElement>(null)

  const { go } = usePageTransition()

  // 갤러리 클릭: 복귀용 위치 저장 → 커튼 → 라우팅
  const handleOpenWork = (slug: string) => {
    const work = workBySlug(slug)
    if (!work) return
    sessionStorage.setItem('home-scroll', String(Math.round(window.scrollY)))
    go({ to: `/work/${slug}`, label: work.label })
  }

  useGSAP(() => refreshOnImageLoad(document), { scope: pageRef })

  // 케이스 페이지에서 복귀 시 갤러리 위치 복원 (StrictMode 대응: rAF 안에서 키 제거)
  useEffect(() => {
    if (sessionStorage.getItem('home-scroll') === null) return
    const raf = requestAnimationFrame(() => {
      const saved = sessionStorage.getItem('home-scroll')
      sessionStorage.removeItem('home-scroll')
      ScrollTrigger.refresh()
      if (saved !== null) scrollToY(Number(saved))
    })
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <>
      <Nav />
      <main ref={pageRef}>
        <Hero />
        <Marquee />
        <Gallery onOpenWork={handleOpenWork} />
        <Method />
        <Pilot />
        <Journal />
        <Close />
      </main>
    </>
  )
}
