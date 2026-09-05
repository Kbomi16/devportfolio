import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './gsapSetup'
import { prefersReducedMotion } from './motion'

let instance: Lenis | null = null

/** Nav 앵커 등에서 사용. reduced-motion이면 null */
export const getLenis = (): Lenis | null => instance

/** 섹션 id로 스크롤 */
export const scrollToId = (id: string): void => {
  if (instance) instance.scrollTo(`#${id}`)
  else document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

/** 페이지 최상단으로 */
export const scrollToTop = (): void => {
  if (instance) instance.scrollTo(0)
  else window.scrollTo({ top: 0, behavior: 'smooth' })
}

/** Home 루트에서 1회 호출 — Lenis 기동 + ScrollTrigger 동기화 */
export const useLenis = (): void => {
  useEffect(() => {
    if (prefersReducedMotion()) return

    const lenis = new Lenis({ lerp: 0.09 })
    instance = lenis
    lenis.on('scroll', ScrollTrigger.update)

    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      instance = null
    }
  }, [])
}
