import { scrollToProgress } from '../lib/useLenis'

const LINKS: { label: string; p: number }[] = [
  { label: '소개', p: 0.2 },
  { label: '작업', p: 0.33 },
  { label: '명단', p: 0.62 },
  { label: '기록', p: 0.78 },
  { label: '연락', p: 0.95 },
]

/** difference 블렌드 고정 내비 — 지면 반전(검↔흰)에 자동 대응 */
export function Nav() {
  return (
    <nav className="nav">
      <button className="nav-mark" onClick={() => scrollToProgress(0)}>
        BOMI<span className="nav-dot">.</span>
      </button>
      <div className="nav-links">
        {LINKS.map((l) => (
          <button key={l.label} className="label nav-link" onClick={() => scrollToProgress(l.p)}>
            {l.label}
          </button>
        ))}
      </div>
      <a className="pill nav-mail" href="mailto:bomi2172@gmail.com">
        메일
      </a>
    </nav>
  )
}
