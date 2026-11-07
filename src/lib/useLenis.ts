import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './gsapSetup'
import { prefersReducedMotion } from './motion'

export type ScrollState = {
  scroll: number
  velocity: number
  direction: number
}

type ScrollListener = (state: ScrollState) => void

let instance: Lenis | null = null
let lastVelocity = 0
const locks = new Set<string>()
const listeners = new Set<ScrollListener>()

/** reduced-motion이면 null */
export const getLenis = (): Lenis | null => instance

export const getScrollVelocity = (): number => lastVelocity

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

/** 즉시 이동 — 잠금 중에도 동작 (복원·전환용). 라우트 직후엔 Lenis의 스크롤 한계가 이전 페이지 기준이라 먼저 다시 잰다 */
export const scrollToY = (y: number): void => {
  if (instance) {
    instance.resize()
    instance.scrollTo(y, { immediate: true, force: true })
  } else window.scrollTo({ top: y, behavior: 'instant' })
}

const applyLock = (): void => {
  const locked = locks.size > 0
  document.documentElement.style.overflow = locked ? 'hidden' : ''
  if (!instance) return
  if (locked) instance.stop()
  else instance.start()
}

export const lockScroll = (key: string): void => {
  locks.add(key)
  applyLock()
}

export const unlockScroll = (key: string): void => {
  locks.delete(key)
  applyLock()
}

export const onScroll = (listener: ScrollListener): (() => void) => {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/** RootLayout에서 1회 — Lenis 기동 + ScrollTrigger·gsap.ticker 단일 RAF */
export const useLenis = (): void => {
  useEffect(() => {
    if (prefersReducedMotion()) return

    const lenis = new Lenis({ lerp: 0.09 })
    instance = lenis

    const handleScroll = (current: Lenis) => {
      ScrollTrigger.update()
      const state = {
        scroll: current.scroll,
        velocity: current.velocity,
        direction: current.direction,
      }
      listeners.forEach((listener) => listener(state))
    }

    const tick = (time: number) => {
      lenis.raf(time * 1000)
      lastVelocity = lenis.velocity
    }

    lenis.on('scroll', handleScroll)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    applyLock()

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      instance = null
      lastVelocity = 0
    }
  }, [])
}
