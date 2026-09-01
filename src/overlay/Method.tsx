import { useReveal } from './useReveal'

const ROSTER = [
  { tag: 'NOW', name: '주식회사 크로플', count: '01' },
  { tag: 'CAMP', name: '코드잇 프론트엔드', count: '01' },
  { tag: 'DEGREE', name: '명지전문대학교', count: '02' },
  { tag: 'CERT', name: '정보처리산업기사', count: '02' },
  { tag: 'NOTE', name: '블로그', count: '100+' },
]

const DATES = [
  { when: '2025.05 —', title: '주식회사 크로플', role: 'Frontend · TCC · 기업 웹 · Alleo' },
  { when: '2024.03 — 08', title: '코드잇 프론트엔드 부트캠프', role: '팀장 · 스크럼' },
  { when: '2023.03 — 2024.02', title: '명지전문대학교 정보통신공학 전공심화', role: '4.00 / 4.50' },
  { when: '2020.03 — 2023.02', title: '명지전문대학 정보통신공학과', role: '3.76 / 4.50' },
]

/** CH4 — 일하는 방식 스테이트먼트 + 로스터 + 데이츠 (호흡 구간, HTML만) */
export function Method() {
  const ref = useReveal<HTMLElement>()

  return (
    <section ref={ref} className="method-section" id="roster">
      <div className="method-statement">
        <span className="label reveal">일하는 방식</span>
        <span className="display method-index outline-text reveal">01</span>
        <p className="method-copy reveal" style={{ ['--reveal-delay' as never]: '0.12s' }}>
          잘 모르는 걸 만나면 일단 적고,
          <br />
          <span className="outline-text">다시 꺼낼 수 있는 형태</span>로 남깁니다.
        </p>
      </div>

      <ul className="roster">
        {ROSTER.map((row, i) => (
          <li
            key={row.tag}
            className="roster-row hairline-top reveal"
            style={{ ['--reveal-delay' as never]: `${i * 0.06}s` }}
          >
            <span className="label">{row.tag}</span>
            <span className="display roster-name">{row.name}</span>
            <span className="label roster-count">{row.count}</span>
          </li>
        ))}
      </ul>

      <div className="dates">
        <div className="dates-head label hairline-top reveal">
          <span>WHEN</span>
          <span>TITLE</span>
          <span>ROLE</span>
        </div>
        {DATES.map((row, i) => (
          <div
            key={row.when}
            className="dates-row hairline-top reveal"
            style={{ ['--reveal-delay' as never]: `${i * 0.06}s` }}
          >
            <span className="dates-when">{row.when}</span>
            <span className="display dates-title">{row.title}</span>
            <span className="dates-role">{row.role}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
