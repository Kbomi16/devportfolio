import { useEffect } from 'react'
import Lenis from 'lenis'
import { useProgress } from './progress'
import { prefersReducedMotion } from './motion'

let instance: Lenis | null = null

/** Nav 앵커 등에서 사용. reduced-motion이면 null */
export const getLenis = (): Lenis | null => instance

/** 전체 진행도(0~1) 위치로 스크롤 */
export const scrollToProgress = (p: number, immediate = false): void => {
  const max = document.documentElement.scrollHeight - window.innerHeight
  const top = p * max
  if (instance) instance.scrollTo(top, { immediate })
  else window.scrollTo({ top, behavior: immediate ? 'instant' : 'smooth' })
}

const publish = (p: number): void => {
  useProgress.getState().setP(p)
  document.documentElement.style.setProperty('--p', String(p))
}

/** Home 루트에서 1회 호출 — Lenis 기동 + progress 발행 */
export const useLenis = (): void => {
  useEffect(() => {
    if (prefersReducedMotion()) {
      const handleScroll = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight
        publish(max > 0 ? window.scrollY / max : 0)
      }
      window.addEventListener('scroll', handleScroll, { passive: true })
      handleScroll()
      return () => window.removeEventListener('scroll', handleScroll)
    }

    const lenis = new Lenis({ lerp: 0.09 })
    instance = lenis
    lenis.on('scroll', (e: { progress: number }) => publish(e.progress))

    let raf = requestAnimationFrame(function loop(t) {
      lenis.raf(t)
      raf = requestAnimationFrame(loop)
    })

    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      instance = null
    }
  }, [])
}
