import type { WorkItem } from '../content/works'

type MarkProps = {
  slug: WorkItem['slug']
}

/**
 * 갤러리 카드당 도형 하나. GSAP 홈의 도구 그래픽처럼 색과 실루엣이 모두 다르다.
 * tcc 음표, sites 십자, alleo 아치, money 보석, useme 꽃, isle 언덕.
 */
export default function CardMark({ slug }: MarkProps) {
  return (
    <svg
      viewBox="0 0 300 400"
      className="pointer-events-none absolute inset-0 size-full origin-[50%_32%] transition-[transform,opacity] duration-300 group-hover:scale-[1.04] group-hover:opacity-0 group-focus-visible:opacity-0 motion-reduce:transition-none"
      aria-hidden
    >
      {slug === 'tcc' ? <Note id="tcc" /> : null}
      {slug === 'sites' ? <Plus id="sites" /> : null}
      {slug === 'alleo' ? <Arch id="alleo" /> : null}
      {slug === 'money' ? <Gem id="money" /> : null}
      {slug === 'useme' ? <Flower id="useme" /> : null}
      {slug === 'isle' ? <Hill id="isle" /> : null}
    </svg>
  )
}

function Note({ id }: { id: string }) {
  return (
    <g transform="translate(150 128)">
      <defs>
        <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="-100" y1="-90" x2="120" y2="110">
          <stop offset="0%" stopColor="#ffe7cc" />
          <stop offset="100%" stopColor="#ff6a16" />
        </linearGradient>
      </defs>
      <circle cx="-62" cy="50" r="52" fill={`url(#${id})`} />
      <rect x="-34" y="-82" width="138" height="128" rx="28" fill={`url(#${id})`} />
      <ellipse cx="-6" cy="-46" rx="46" ry="20" fill="#fff" opacity="0.38" />
    </g>
  )
}

function Plus({ id }: { id: string }) {
  return (
    <g transform="translate(150 124)">
      <defs>
        <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="-80" y1="-90" x2="80" y2="90">
          <stop offset="0%" stopColor="#d9f6ff" />
          <stop offset="100%" stopColor="#2f9bff" />
        </linearGradient>
      </defs>
      <rect x="-26" y="-84" width="52" height="58" fill={`url(#${id})`} />
      <rect x="-26" y="26" width="52" height="58" fill={`url(#${id})`} />
      <rect x="-84" y="-26" width="58" height="52" fill={`url(#${id})`} />
      <rect x="26" y="-26" width="58" height="52" fill={`url(#${id})`} />
      <ellipse cx="-4" cy="-62" rx="16" ry="8" fill="#fff" opacity="0.55" />
    </g>
  )
}

function Arch({ id }: { id: string }) {
  return (
    <g transform="translate(150 132)">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f6c2ff" />
          <stop offset="42%" stopColor="#d98cff" />
          <stop offset="100%" stopColor="#3aa0ff" />
        </linearGradient>
      </defs>
      <path
        d="M-74 46C-74 46-80-62 0-62C80-62 74 46 74 46C74 66 50 66 42 44C42 6 24-16 0-16C-24-16-42 6-42 44C-50 66-74 66-74 46Z"
        fill={`url(#${id})`}
      />
      <ellipse cx="-18" cy="-36" rx="28" ry="12" fill="#fff" opacity="0.4" />
    </g>
  )
}

function Gem({ id }: { id: string }) {
  return (
    <g transform="translate(150 126) rotate(45)">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffe08a" />
          <stop offset="48%" stopColor="#ff5f9a" />
          <stop offset="100%" stopColor="#9a45ff" />
        </linearGradient>
      </defs>
      <rect x="-64" y="-64" width="128" height="128" rx="28" fill={`url(#${id})`} />
      <ellipse cx="-18" cy="-24" rx="32" ry="14" fill="#fff" opacity="0.42" />
    </g>
  )
}

function Flower({ id }: { id: string }) {
  const r = 34

  return (
    <g transform="translate(150 124)">
      <defs>
        <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="-70" y1="-70" x2="70" y2="70">
          <stop offset="0%" stopColor="#ffd4ec" />
          <stop offset="55%" stopColor="#ff6aaa" />
          <stop offset="100%" stopColor="#ff2f86" />
        </linearGradient>
      </defs>
      <circle cy={-r * 0.9} r={r} fill={`url(#${id})`} />
      <circle cx={r * 0.9} r={r} fill={`url(#${id})`} />
      <circle cy={r * 0.9} r={r} fill={`url(#${id})`} />
      <circle cx={-r * 0.9} r={r} fill={`url(#${id})`} />
      <ellipse cx={-r * 0.35} cy={-r * 0.7} rx={r * 0.36} ry={r * 0.16} fill="#fff" opacity="0.45" />
    </g>
  )
}

function Hill({ id }: { id: string }) {
  const clip = `${id}-clip`

  return (
    <g transform="translate(150 178)">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3ee0c8" />
          <stop offset="50%" stopColor="#3ee86a" />
          <stop offset="100%" stopColor="#c6f56a" />
        </linearGradient>
        <clipPath id={clip}>
          <rect x="-120" y="-96" width="240" height="96" />
        </clipPath>
      </defs>
      <ellipse rx="112" ry="96" fill={`url(#${id})`} clipPath={`url(#${clip})`} />
      <ellipse cx="-22" cy="-48" rx="42" ry="14" fill="#fff" opacity="0.32" />
    </g>
  )
}
