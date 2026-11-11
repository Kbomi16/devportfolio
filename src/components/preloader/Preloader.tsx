import { useRef, useState } from 'react'
import Display from '../common/Display'
import { GREETINGS } from '../../content/about'
import { gsap, useGSAP } from '../../lib/gsapSetup'
import { prefersReducedMotion } from '../../lib/motion'
import { preloadAssets } from '../../lib/preload'
import { lockScroll, unlockScroll } from '../../lib/useLenis'
import { HELLO_PATH, HELLO_VIEWBOX } from './helloPath'

type PreloaderMode = 'full' | 'reduce'

const GREET_STEP = 0.12

const pickMode = (): PreloaderMode => (prefersReducedMotion() ? 'reduce' : 'full')

/** 새로고침마다 hello 획 → 다국어 인사 → 곡선 커튼 퇴장. reduced-motion은 페이드. */
export default function Preloader() {
  const [mode] = useState<PreloaderMode>(pickMode)
  const [visible, setVisible] = useState(true)

  const rootRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const root = rootRef.current
      const path = root?.querySelector<SVGPathElement>('[data-hello-path]')
      if (!root || !path) return

      lockScroll('preloader')

      const handleFinish = () => {
        unlockScroll('preloader')
        setVisible(false)
      }

      if (mode === 'reduce') {
        gsap.set('[data-hello]', { autoAlpha: 0 })
        gsap.set('[data-greet]:last-child', { autoAlpha: 1 })
        gsap.to(root, { autoAlpha: 0, duration: 0.3, delay: 0.1, onComplete: handleFinish })
        return () => unlockScroll('preloader')
      }

      const exit = (tl: gsap.core.Timeline, duration: number) =>
        tl
          .to('[data-preloader-stage]', { yPercent: -100, duration, ease: 'power3.inOut' })
          .to(
            '[data-preloader-cap]',
            { scaleY: 1, duration: duration * 0.5, ease: 'power2.out' },
            '<',
          )

      const length = path.getTotalLength()
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length })
      gsap.set('[data-preloader-bar]', { scaleX: 0 })

      const ready = preloadAssets((ratio) => {
        gsap.to('[data-preloader-bar]', { scaleX: ratio, duration: 0.4, ease: 'power2.out' })
      })

      const tl = gsap.timeline({ onComplete: handleFinish })
      tl.to(path, { strokeDashoffset: 0, duration: 0.95, ease: 'power2.inOut' })
        .addPause('+=0', () => {
          ready.then(() => tl.resume())
        })
        .to('[data-hello]', { autoAlpha: 0, duration: 0.2 })

      gsap.utils.toArray<HTMLElement>('[data-greet]').forEach((greet, index) => {
        tl.set('[data-greet]', { autoAlpha: 0 }, index === 0 ? '>' : `+=${GREET_STEP}`)
        tl.set(greet, { autoAlpha: 1 }, '<')
      })

      tl.to('[data-preloader-bar]', { autoAlpha: 0, duration: 0.2 }, '+=0.15')
      exit(tl.to({}, { duration: 0.2 }), 0.8)

      return () => unlockScroll('preloader')
    },
    { scope: rootRef },
  )

  if (!visible) return null

  return (
    <div ref={rootRef} className="fixed inset-0 z-[100]" aria-hidden>
      <div data-preloader-stage className="absolute inset-x-0 top-0 flex h-[112vh] flex-col">
        <div className="relative flex h-screen shrink-0 items-center justify-center bg-dark-ground text-dark-ink">
          <svg data-hello className="w-[min(56vw,420px)]" viewBox={HELLO_VIEWBOX} fill="none">
            <path
              data-hello-path
              d={HELLO_PATH}
              stroke="currentColor"
              strokeWidth={9}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="absolute inset-0 grid place-items-center">
            {GREETINGS.map((greet, index) => (
              <Display
                key={`${greet}-${index}`}
                data-greet
                className="invisible col-start-1 row-start-1 font-kr text-[clamp(36px,6vw,88px)] opacity-0"
              >
                {greet}
              </Display>
            ))}
          </div>
          <span
            data-preloader-bar
            className="absolute bottom-[var(--pad)] left-[var(--pad)] h-px w-[calc(100%-var(--pad)*2)] origin-left scale-x-0 bg-dark-ink/40"
          />
        </div>
        <svg
          data-preloader-cap
          className="block h-[12vh] w-full origin-top scale-y-0"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path d="M0 0 Q50 100 100 0 Z" className="fill-dark-ground" />
        </svg>
      </div>
    </div>
  )
}
