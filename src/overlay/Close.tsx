import { useReveal } from './useReveal'

const RESUME_URL =
  'https://volcano-fisherman-e31.notion.site/31a3307fa7e6803cb79de92068674178'

/** CH6 — 다시 검정, 컨택트 + 크롭 워드마크 */
export function Close() {
  const ref = useReveal<HTMLElement>()

  return (
    <section ref={ref} className="close-section" id="contact">
      <div className="close-body">
        <p className="close-copy reveal">
          커피보다 짧은 메모도 환영합니다.
          <br />
          캐릭터를 눌러 인사해 보세요.
        </p>
        <div className="close-actions reveal" style={{ ['--reveal-delay' as never]: '0.12s' }}>
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
