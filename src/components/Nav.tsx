import Label from './common/Label'
import OutlineText from './common/OutlineText'
import Pill from './common/Pill'
import { scrollToId, scrollToTop } from '../lib/useLenis'

const LINKS: { label: string; id: string }[] = [
  { label: '소개', id: 'about' },
  { label: '작업', id: 'work' },
  { label: '명단', id: 'roster' },
  { label: '기록', id: 'journal' },
  { label: '연락', id: 'contact' },
]

const handleMarkClick = () => scrollToTop()

const handleLinkClick = (id: string) => scrollToId(id)

/** difference 블렌드 고정 내비 — 지면 반전(검↔흰)에 자동 대응 */
export default function Nav() {
  return (
    <nav className="fixed inset-x-0 top-0 z-20 flex h-[var(--nav-h)] items-center justify-between gap-6 px-[var(--pad)] text-white mix-blend-difference">
      <button
        type="button"
        className="font-display text-[15px] font-extrabold tracking-[-0.02em]"
        onClick={handleMarkClick}
      >
        BOMI
        <OutlineText className="[-webkit-text-stroke:1px_#fff]">.</OutlineText>
      </button>
      <div className="flex gap-[22px] max-md:hidden">
        {LINKS.map((l) => (
          <Label
            as="button"
            key={l.id}
            type="button"
            className="hover:underline hover:underline-offset-4"
            onClick={() => handleLinkClick(l.id)}
          >
            {l.label}
          </Label>
        ))}
      </div>
      <Pill className="border-white/40 hover:border-white" href="mailto:bomi2172@gmail.com">
        메일
      </Pill>
    </nav>
  )
}
