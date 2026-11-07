import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Display from '../common/Display'
import { gsap, ScrollTrigger, useGSAP } from '../../lib/gsapSetup'
import { prefersReducedMotion } from '../../lib/motion'
import { PageTransitionContext, type TransitionTarget } from '../../lib/pageTransition'
import { getLenis, lockScroll, unlockScroll } from '../../lib/useLenis'

type PageTransitionProps = {
  children: ReactNode
}

/** 커튼 전환 — 볼록 캡과 함께 아래에서 올라와 덮고, 이동 뒤 오목 캡을 남기며 위로 빠진다 */
export default function PageTransition({ children }: PageTransitionProps) {
  const [label, setLabel] = useState('')

  const rootRef = useRef<HTMLDivElement>(null)
  const runningRef = useRef(false)
  const pendingRef = useRef(false)

  const navigate = useNavigate()
  const location = useLocation()
  const { contextSafe } = useGSAP({ scope: rootRef })

  const handleGo = contextSafe((target: TransitionTarget) => {
    if (runningRef.current) return
    if (prefersReducedMotion()) {
      target.onCovered?.()
      navigate(target.to)
      return
    }

    runningRef.current = true
    lockScroll('transition')
    setLabel(target.label)

    gsap
      .timeline({
        onComplete: () => {
          target.onCovered?.()
          pendingRef.current = true
          navigate(target.to)
        },
      })
      .set('[data-curtain]', { autoAlpha: 1, yPercent: 100 })
      .set('[data-curtain-top]', { scaleY: 1 })
      .set('[data-curtain-bottom]', { scaleY: 0 })
      .set('[data-curtain-label]', { yPercent: 110 })
      .to('[data-curtain]', { yPercent: 0, duration: 0.8, ease: 'power3.inOut' })
      .to('[data-curtain-top]', { scaleY: 0, duration: 0.55, ease: 'power2.out' }, '-=0.45')
      .to('[data-curtain-label]', { yPercent: 0, duration: 0.6, ease: 'expo.out' }, '-=0.35')
  })

  useEffect(() => {
    if (!pendingRef.current) return

    const raf = requestAnimationFrame(() => {
      pendingRef.current = false
      ScrollTrigger.refresh()
      getLenis()?.resize()
      unlockScroll('transition')

      gsap
        .timeline({
          onComplete: () => {
            runningRef.current = false
            gsap.set('[data-curtain]', { autoAlpha: 0 })
          },
        })
        .to('[data-curtain-label]', { yPercent: -110, duration: 0.45, ease: 'power3.in' })
        .to('[data-curtain-bottom]', { scaleY: 1, duration: 0.4, ease: 'power2.out' }, '-=0.1')
        .to('[data-curtain]', { yPercent: -100, duration: 0.85, ease: 'power3.inOut' }, '<')
    })

    return () => cancelAnimationFrame(raf)
  }, [location.key])

  return (
    <PageTransitionContext.Provider value={{ go: handleGo }}>
      {children}
      <div ref={rootRef} className="pointer-events-none fixed inset-0 z-[90]" aria-hidden>
        <div
          data-curtain
          className="invisible absolute inset-x-0 top-[-12vh] flex h-[124vh] flex-col opacity-0"
        >
          <svg
            data-curtain-top
            className="block h-[12vh] w-full origin-bottom"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path d="M0 100 Q50 0 100 100 Z" className="fill-dark-ground" />
          </svg>
          <div className="flex h-screen shrink-0 items-center justify-center bg-dark-ground text-dark-ink">
            <span className="overflow-hidden">
              <Display data-curtain-label className="block text-[clamp(40px,7vw,120px)]">
                {label}
              </Display>
            </span>
          </div>
          <svg
            data-curtain-bottom
            className="block h-[12vh] w-full origin-top"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path d="M0 0 Q50 100 100 0 Z" className="fill-dark-ground" />
          </svg>
        </div>
      </div>
    </PageTransitionContext.Provider>
  )
}
