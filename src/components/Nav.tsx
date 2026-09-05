import { scrollToId } from '../lib/useLenis'

const LINKS: { label: string; id: string }[] = [
  { label: '소개', id: 'about' },
  { label: '작업', id: 'work' },
  { label: '명단', id: 'roster' },
  { label: '기록', id: 'journal' },
  { label: '연락', id: 'contact' },
]

const handleMarkClick = () => scrollToId('top')

const handleLinkClick = (id: string) => scrollToId(id)

/** difference 블렌드 고정 내비 — 지면 반전(검↔흰)에 자동 대응 */
export default function Nav() {
  return (
    <nav className="nav">
      <button className="nav-mark" onClick={handleMarkClick}>
        BOMI<span className="nav-dot">.</span>
      </button>
      <div className="nav-links">
        {LINKS.map((l) => (
          <button key={l.id} className="label nav-link" onClick={() => handleLinkClick(l.id)}>
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
