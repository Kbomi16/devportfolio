import { useReveal } from './useReveal'

/** CH2 — 하얀 무대 위 포즈(캔버스, 좌측) + 영문 네임 스택(우측) */
export function Reveal() {
  const ref = useReveal<HTMLElement>()

  return (
    <section ref={ref} className="reveal-section" id="about">
      <div className="reveal-stack">
        <span className="label reveal">FRONTEND</span>
        <span className="display reveal-name reveal" style={{ ['--reveal-delay' as never]: '0.1s' }}>
          KIM
        </span>
        <span className="display reveal-name reveal" style={{ ['--reveal-delay' as never]: '0.2s' }}>
          BOMI<span className="outline-text">.</span>
        </span>
        <span
          className="label reveal reveal-meta"
          style={{ ['--reveal-delay' as never]: '0.34s' }}
        >
          DEVELOPER · SEOUL · 2026
        </span>
      </div>
      <span className="label reveal-hint hairline-top">↓ WORK</span>
    </section>
  )
}
