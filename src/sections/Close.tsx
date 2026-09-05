import { useRef } from 'react'
import Display from '../components/common/Display'
import Label from '../components/common/Label'
import Pill from '../components/common/Pill'
import Hairline from '../components/common/Hairline'
import { cn } from '../lib/cn'
import { ground } from '../lib/ground'
import { gsap, useGSAP } from '../lib/gsapSetup'
import { prefersReducedMotion } from '../lib/motion'
import { revealOnce } from '../lib/reveal'

const RESUME_URL =
  'https://volcano-fisherman-e31.notion.site/31a3307fa7e6803cb79de92068674178'

/** CH6 — 다시 검정. 컨택트 + 크롭 워드마크(스크럽 패럴랙스) */
export default function Close() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    (context) => {
      if (prefersReducedMotion()) return
      revealOnce((context.selector?.('[data-rv]') ?? []) as HTMLElement[])

      gsap.fromTo(
        '[data-close-mark]',
        { yPercent: 36 },
        {
          yPercent: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom bottom',
            scrub: true,
          },
        },
      )
    },
    { scope: sectionRef },
  )

  return (
    <section
      ref={sectionRef}
      className={cn(
        ground.dark,
        'relative flex min-h-screen flex-col justify-center gap-[6vh] overflow-hidden px-[var(--pad)] pt-[20vh]',
      )}
      id="contact"
    >
      <div>
        <p
          data-rv
          className="text-[clamp(18px,2vw,26px)] leading-normal font-semibold"
        >
          커피보다 짧은 메모도 환영합니다.
          <br />
          읽으면 빠르게 답장합니다.
        </p>
        <div data-rv className="mt-0 flex flex-wrap gap-3">
          <Pill href="mailto:bomi2172@gmail.com">bomi2172@gmail.com</Pill>
          <Pill href="https://github.com/Kbomi16" target="_blank" rel="noreferrer">
            GitHub
          </Pill>
          <Pill href={RESUME_URL} target="_blank" rel="noreferrer">
            Resume
          </Pill>
        </div>
      </div>

      <Hairline
        as="footer"
        className="mb-[clamp(90px,16vw,240px)] flex justify-between py-4 text-muted"
      >
        <Label>© 2026 KIM BOMI</Label>
        <Label>bomi2172@gmail.com</Label>
      </Hairline>

      <Display
        data-close-mark
        className="pointer-events-none absolute right-0 bottom-0 left-0 translate-y-[18%] text-center text-[clamp(130px,24vw,380px)] leading-[0.78]"
        aria-hidden
      >
        BOMI.
      </Display>
    </section>
  )
}
