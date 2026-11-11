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
          chrome.style.setProperty('--hero-scale', motion ? (1 + fade * 1.85).toFixed(4) : '1')
          chrome.classList.toggle('invisible', gone || fade > 0.985)
        }

        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: applyChrome,
          onToggle: applyChrome,
        })
        applyChrome()

        if (!motion) return

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
      <Label data-hero-parallax="edge" className="absolute top-[calc(var(--nav-h)+14px)] left-[var(--pad)] text-ink-2">
        KIM BOMI · FRONTEND
      </Label>
      <Label data-hero-parallax="edge" className="absolute top-[calc(var(--nav-h)+14px)] right-[var(--pad)] text-ink-2">
        2026
      </Label>
      <Label
        data-hero-parallax="edge"
        className="absolute bottom-[var(--pad)] left-1/2 -translate-x-1/2 animate-hint-bob text-ink-2 motion-reduce:animate-none"
      >
        Scroll
      </Label>
      <Label data-hero-parallax="edge" className="absolute right-[var(--pad)] bottom-[var(--pad)] text-ink-2">
        SEOUL
      </Label>

      <div
        data-hero-center
        className="absolute inset-0 flex origin-center flex-col items-center justify-center px-[var(--pad)] text-center text-dark-ink"
      >
        <Label data-hero-copy data-hero-parallax="lead" className="text-dark-ink/60">
          FRONTEND
        </Label>
        <Display
          as="h1"
          data-hero-name
          data-hero-parallax="name"
          className="mt-2 max-w-[92vw] text-[clamp(40px,9.2vw,140px)] leading-[0.9] [text-shadow:0_8px_60px_rgba(0,0,0,0.55)]"
        >
          KIM BOMI
        </Display>
        <p data-hero-copy data-hero-parallax="ko" className="mt-4 text-[clamp(16px,1.8vw,24px)] font-bold tracking-[-0.01em]">
          만들고, 남기고, 다시 꺼내는 메이커
        </p>
        <p data-hero-copy data-hero-parallax="en" className="mt-1 font-ui text-[clamp(13px,1.2vw,16px)] text-dark-ink/72">
          Make it. Leave it. Bring it back.
        </p>
        <Label data-hero-copy data-hero-parallax="meta" className="mt-3 text-ink-2">
          DEVELOPER · SEOUL · 2026
        </Label>
      </div>

      <Label
        data-hero-parallax="edge"
        className="absolute top-[calc(var(--nav-h)+18rem)] left-[var(--pad)] text-dark-ink/72 max-md:hidden"
        aria-hidden
      >
        YOU CAN HOVER NAV ↓
      </Label>
      <Label
        data-hero-parallax="edge"
        className="absolute right-[var(--pad)] bottom-[calc(var(--pad)+28px)] text-dark-ink/55"
        aria-hidden
      >
        MAKER KIMBOMI
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
