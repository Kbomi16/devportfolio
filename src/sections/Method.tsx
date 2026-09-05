import { useRef } from 'react'
import { useGSAP } from '../lib/gsapSetup'
import { prefersReducedMotion } from '../lib/motion'
import { revealOnce } from '../lib/reveal'

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

/** CH4 — 일하는 방식 스테이트먼트 + 로스터 + 데이츠 (호흡 구간, GSAP 1회 리빌) */
export default function Method() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    (context) => {
      if (prefersReducedMotion()) return
      revealOnce((context.selector?.('.rv') ?? []) as HTMLElement[])
    },
    { scope: sectionRef },
  )

  return (
    <section ref={sectionRef} className="method-section ground-light" id="roster">
      <div className="method-statement">
        <span className="label rv">일하는 방식</span>
        <span className="display method-index outline-text rv">01</span>
        <p className="method-copy rv">
          잘 모르는 걸 만나면 일단 적고,
          <br />
          <span className="outline-text">다시 꺼낼 수 있는 형태</span>로 남깁니다.
        </p>
      </div>

      <ul className="roster">
        {ROSTER.map((row) => (
          <li key={row.tag} className="roster-row hairline-top rv">
            <span className="label">{row.tag}</span>
            <span className="display roster-name">{row.name}</span>
            <span className="label roster-count">{row.count}</span>
          </li>
        ))}
      </ul>

      <div className="dates">
        <div className="dates-head label hairline-top rv">
          <span>WHEN</span>
          <span>TITLE</span>
          <span>ROLE</span>
        </div>
        {DATES.map((row) => (
          <div key={row.when} className="dates-row hairline-top rv">
            <span className="dates-when">{row.when}</span>
            <span className="display dates-title">{row.title}</span>
            <span className="dates-role">{row.role}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
