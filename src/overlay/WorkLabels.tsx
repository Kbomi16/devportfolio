import { WORKS } from '../content/works'
import { useProgress } from '../lib/progress'
import { useReveal } from './useReveal'

/** 트랙 내 배치 오프셋 (IMPLEMENTATION.md 챕터 ↔ 트랙 표) */
const TOPS = ['31%', '41%', '51%'] as const

/** CH3 — 전시물 옆 타이포. 링크는 3D 클릭과 같은 전환 플로우를 탄다 (키보드 접근 대응). */
export function WorkLabels() {
  const ref = useReveal<HTMLDivElement>()
  const setPendingSlug = useProgress((s) => s.setPendingSlug)

  return (
    <div ref={ref}>
      <header className="work-eyebrow" style={{ top: '27.5%' }}>
        <span className="label reveal">CATALOGUE</span>
        <h2 className="display work-title reveal" style={{ ['--reveal-delay' as never]: '0.1s' }}>
          규칙이 이어지는 방식.
        </h2>
      </header>

      {WORKS.map((work, i) => (
        <article key={work.slug} className="work-label" style={{ top: TOPS[i] }}>
          <span className="label reveal">{`0${i + 1}`}</span>
          <h3 className="display work-name reveal" style={{ ['--reveal-delay' as never]: '0.08s' }}>
            {work.label}
          </h3>
          <p className="work-line reveal" style={{ ['--reveal-delay' as never]: '0.16s' }}>
            {work.oneLiner}
          </p>
          <p className="label work-meta reveal" style={{ ['--reveal-delay' as never]: '0.22s' }}>
            {work.homeLine} · {work.period}
          </p>
          <button
            className="pill reveal"
            style={{ ['--reveal-delay' as never]: '0.3s' }}
            onClick={() => setPendingSlug(work.slug)}
          >
            케이스 보기 →
          </button>
        </article>
      ))}
    </div>
  )
}
