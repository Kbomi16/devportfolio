import { useEffect } from 'react'
import Lenis from 'lenis'
import { useProgress } from './progress'
import { prefersReducedMotion } from './motion'

let instance: Lenis | null = null

/** Nav 앵커 등에서 사용. reduced-motion이면 null */
export function getLenis(): Lenis | null {
  return instance
}

/** 전체 진행도(0~1) 위치로 스크롤 */
export function scrollToProgress(p: number, immediate = false): void {
  const max = document.documentElement.scrollHeight - window.innerHeight
  const top = p * max
  if (instance) instance.scrollTo(top, { immediate })
  else window.scrollTo({ top, behavior: immediate ? 'instant' : 'smooth' })
}

function publish(p: number): void {
  useProgress.getState().setP(p)
  document.documentElement.style.setProperty('--p', String(p))
}

/** Home 루트에서 1회 호출 — Lenis 기동 + progress 발행 */
export function useLenis(): void {
  useEffect(() => {
    if (prefersReducedMotion()) {
      const onScroll = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight
        publish(max > 0 ? window.scrollY / max : 0)
      }
      window.addEventListener('scroll', onScroll, { passive: true })
      onScroll()
      return () => window.removeEventListener('scroll', onScroll)
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
