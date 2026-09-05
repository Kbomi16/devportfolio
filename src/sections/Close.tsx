import { useRef } from 'react'
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
      revealOnce((context.selector?.('.rv') ?? []) as HTMLElement[])

      gsap.fromTo(
        '.close-mark',
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
    <section ref={sectionRef} className="close-section ground-dark" id="contact">
      <div className="close-body">
        <p className="close-copy rv">
          커피보다 짧은 메모도 환영합니다.
          <br />
          읽으면 빠르게 답장합니다.
        </p>
        <div className="close-actions rv">
          <a className="pill" href="mailto:bomi2172@gmail.com">
            bomi2172@gmail.com
          </a>
          <a className="pill" href="https://github.com/Kbomi16" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a className="pill" href={RESUME_URL} target="_blank" rel="noreferrer">
            Resume
          </a>
        </div>
      </div>

      <footer className="close-footer hairline-top">
        <span className="label">© 2026 KIM BOMI</span>
        <span className="label">bomi2172@gmail.com</span>
      </footer>

      <span className="display close-mark" aria-hidden>
        BOMI.
      </span>
    </section>
  )
}
