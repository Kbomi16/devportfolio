import Label from './common/Label'
import Pill from './common/Pill'
import { cn } from '../lib/cn'
import { scrollToId, scrollToTop } from '../lib/useLenis'

const LINKS: { label: string; id: string; line: string }[] = [
  { label: '소개', id: 'about', line: 'w-[52px]' },
  { label: '작업', id: 'work', line: 'w-[42px]' },
  { label: '명단', id: 'roster', line: 'w-[32px]' },
  { label: '기록', id: 'journal', line: 'w-[22px]' },
  { label: '연락', id: 'contact', line: 'w-[12px]' },
]

const handleMarkClick = () => scrollToTop()

const handleLinkClick = (id: string) => scrollToId(id)

function NavLine({ label, id, line }: (typeof LINKS)[number]) {
  const handleClick = () => handleLinkClick(id)

  return (
    <li>
      <button
        type="button"
        aria-label={label}
        className="group flex items-center gap-3 py-[5px]"
        onClick={handleClick}
      >
        <span
          className={cn(
            'block h-1 bg-current opacity-35 transition-[width,opacity] duration-300 ease-linear motion-reduce:transition-none',
            'group-hover:w-[52px] group-hover:opacity-100 group-focus-visible:w-[52px] group-focus-visible:opacity-100',
            line,
          )}
        />
        <Label className="translate-x-1 opacity-0 transition-[opacity,translate] duration-300 ease-linear group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 motion-reduce:transition-none">
          {label}
        </Label>
      </button>
    </li>
  )
}

/** difference 블렌드 고정 내비 — 지면 반전(검↔흰)에 자동 대응 */
export default function Nav() {
  return (
    <>
      <nav
        aria-label="사이트"
        className="fixed inset-x-0 top-0 z-20 flex h-[var(--nav-h)] items-center justify-between px-[var(--pad)] text-white mix-blend-difference"
      >
        <button
          type="button"
          className="font-display text-[15px] font-extrabold tracking-[-0.02em]"
          onClick={handleMarkClick}
        >
          KIM BOMI
        </button>
        <Pill className="border-white/40 hover:border-white" href="mailto:bomi2172@gmail.com">
          contact me
        </Pill>
      </nav>

      <nav
        aria-label="섹션"
        className="fixed top-1/2 left-[var(--pad)] z-20 -translate-y-1/2 text-white mix-blend-difference"
      >
        <ul>
          {LINKS.map((link) => (
            <NavLine key={link.id} {...link} />
          ))}
        </ul>
      </nav>
    </>
  )
}
