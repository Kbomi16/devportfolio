import { useRef } from 'react'
import Display from '../components/common/Display'
import Hairline from '../components/common/Hairline'
import Label from '../components/common/Label'
import OutlineText from '../components/common/OutlineText'
import { cn } from '../lib/cn'
import { ground } from '../lib/ground'
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
    <section
      ref={sectionRef}
      className={cn(
        ground.light,
        'flex flex-col gap-[9vh] px-[var(--pad)] py-[18vh] [&>*]:mx-auto [&>*]:w-full [&>*]:max-w-[1200px]',
      )}
      id="roster"
    >
      <div className="relative max-md:flex max-md:flex-col">
        <Label className="rv">일하는 방식</Label>
        <Display
          className="rv absolute top-0 right-0 text-[clamp(90px,11vw,180px)] opacity-60 max-md:static max-md:order-first"
          as={OutlineText}
        >
          01
        </Display>
        <p className="rv mt-[18px] max-w-[22ch] text-[clamp(24px,3.6vw,52px)] leading-[1.25] font-bold tracking-[-0.01em]">
          잘 모르는 걸 만나면 일단 적고,
          <br />
          <OutlineText>다시 꺼낼 수 있는 형태</OutlineText>로 남깁니다.
        </p>
      </div>

      <ul className="list-none">
        {ROSTER.map((row) => (
          <Hairline
            as="li"
            key={row.tag}
            className="rv grid grid-cols-[110px_1fr_auto] items-baseline gap-[18px] py-5 max-md:grid-cols-[72px_1fr_auto]"
          >
            <Label className="text-muted">{row.tag}</Label>
            <Display className="font-kr text-[clamp(20px,2.4vw,34px)] font-bold tracking-[-0.01em]">
              {row.name}
            </Display>
            <Label className="text-muted">{row.count}</Label>
          </Hairline>
        ))}
      </ul>

      <div>
        <Label
          as={Hairline}
          className="rv grid grid-cols-[180px_1.4fr_1fr] gap-[18px] py-4 text-muted max-md:hidden"
        >
          <span>WHEN</span>
          <span>TITLE</span>
          <span>ROLE</span>
        </Label>
        {DATES.map((row) => (
          <Hairline
            key={row.when}
            className="rv grid grid-cols-[180px_1.4fr_1fr] gap-[18px] py-4 max-md:grid-cols-1 max-md:gap-1"
          >
            <span className="font-ui text-[13px] text-ink-2">{row.when}</span>
            <Display className="font-kr text-[clamp(16px,1.6vw,22px)] font-bold tracking-[-0.01em]">
              {row.title}
            </Display>
            <span className="font-ui text-[13px] text-ink-2">{row.role}</span>
          </Hairline>
        ))}
      </div>
    </section>
  )
}
