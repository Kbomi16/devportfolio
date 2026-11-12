import { useRef, useState, type RefObject } from 'react'
import { createPortal } from 'react-dom'
import Display from '../components/common/Display'
import Label from '../components/common/Label'
import { canRender3D } from '../lib/can3D'
import { cn } from '../lib/cn'
import { ground } from '../lib/ground'
import { gsap, ScrollTrigger, SplitText, useGSAP } from '../lib/gsapSetup'
import { HERO_PIN } from '../lib/hero'
import { matchMediaPreset } from '../lib/media'
import SceneSlot from '../scene/SceneSlot'
import { heroTravelProgress } from '../scene/scrollProgress'

/** Hero — 좌우 복도의 도형이 스크롤에 앞으로 빨려 온다. 글자는 캔버스 위. */
export default function Hero() {
  const [sceneOn] = useState(canRender3D)

  const sectionRef = useRef<HTMLElement>(null)
  const chromeRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = matchMediaPreset(({ motion, desktop }) => {
        const applyChrome = () => {
          const section = sectionRef.current
          const chrome = chromeRef.current
          if (!section || !chrome) return
          const spacer = section.parentElement?.classList.contains('pin-spacer')
            ? section.parentElement
            : section
          const rect = spacer.getBoundingClientRect()
          const gone = rect.bottom <= 8 || rect.top >= window.innerHeight - 8
          const pull = gone ? 1 : heroTravelProgress('#about')
          const fade = gone ? 1 : Math.min(1, Math.max(0, (pull - 0.04) / 0.78))
          chrome.style.setProperty('--hero-fade', fade.toFixed(4))
          chrome.style.setProperty('--hero-scale', motion ? (1 + fade * 0.18).toFixed(4) : '1')
          chrome.classList.toggle('invisible', gone || fade > 0.985)
        }

        ScrollTrigger.addEventListener('refresh', applyChrome)
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: applyChrome,
          onToggle: applyChrome,
        })
        applyChrome()

        if (!motion) return () => ScrollTrigger.removeEventListener('refresh', applyChrome)

        const name = chromeRef.current?.querySelector('[data-hero-name]')
        if (name instanceof HTMLElement) {
          const nameSplit = SplitText.create(name, { type: 'chars', mask: 'chars' })
          gsap.from(nameSplit.chars, {
            yPercent: 110,
            duration: 0.9,
            stagger: 0.03,
            ease: 'expo.out',
          })
        }

        gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: desktop ? HERO_PIN.desktop : HERO_PIN.mobile,
            pin: true,
            scrub: 0.45,
            anticipatePin: 1,
            onUpdate: applyChrome,
            onLeave: applyChrome,
            onEnterBack: applyChrome,
          },
        }).to({}, { duration: 1 })

        return () => ScrollTrigger.removeEventListener('refresh', applyChrome)
      })
      return () => mm.revert()
    },
    { scope: sectionRef },
  )

  return (
    <section
      ref={sectionRef}
      className={cn(ground.dark, 'relative h-screen overflow-hidden bg-black')}
      id="about"
    >
      {sceneOn ? (
        <SceneSlot
          object={{ kind: 'hero' }}
          fallbackSrc="/images/bomi-landing.jpg"
          className="absolute inset-0"
        />
      ) : (
        <HeroShapeFallback />
      )}
      <HeroChrome chromeRef={chromeRef} />
    </section>
  )
}

function HeroChrome({ chromeRef }: { chromeRef: RefObject<HTMLDivElement | null> }) {
  return createPortal(
    <div ref={chromeRef} data-hero-chrome className="pointer-events-none fixed inset-0 z-[16]">
      <div
        className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_50%,transparent_18%,rgba(0,0,0,0.72)_100%)]"
        aria-hidden
      />
      <div
        data-hero-center
        className="absolute inset-0 flex origin-center flex-col items-center justify-center px-[var(--pad)] text-center text-dark-ink"
      >
        <Display
          as="h1"
          data-hero-name
          data-hero-parallax="name"
          className="max-w-[92vw] text-[clamp(48px,10vw,156px)] leading-[0.88] [text-shadow:0_10px_70px_rgba(0,0,0,0.45)]"
        >
          KIM BOMI
        </Display>
        <p data-hero-copy data-hero-parallax="ko" className="mt-5 text-[clamp(15px,1.5vw,20px)] font-medium tracking-[-0.01em] text-dark-ink/80">
          만들고, 남기고, 다시 꺼내는 메이커
        </p>
      </div>

      <Label
        data-hero-parallax="edge"
        className="absolute bottom-[var(--pad)] left-1/2 -translate-x-1/2 animate-hint-bob text-ink-2 motion-reduce:animate-none"
      >
        Scroll
      </Label>
    </div>,
    document.body,
  )
}

function HeroShapeFallback() {
  const marks = [
    'left-[8%] top-[22%] size-16 rounded-2xl',
    'left-[14%] top-[58%] size-10 rounded-full',
    'right-[10%] top-[28%] size-20 rounded-full',
    'right-[16%] bottom-[24%] size-12 rounded-2xl',
    'left-[28%] bottom-[18%] size-8 rounded-full',
  ]

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      {marks.map((mark) => (
        <span key={mark} className={cn('absolute border border-dark-ink/20 bg-dark-ink/10', mark)} />
      ))}
    </div>
  )
}
