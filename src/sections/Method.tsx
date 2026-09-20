import { useRef, type ReactNode } from 'react'
import Display from '../components/common/Display'
import Hairline from '../components/common/Hairline'
import Label from '../components/common/Label'
import OutlineText from '../components/common/OutlineText'
import { cn } from '../lib/cn'
import { ground } from '../lib/ground'
import { gsap, useGSAP } from '../lib/gsapSetup'
import { prefersReducedMotion } from '../lib/motion'

const INDEX = [
  { tag: 'NOW', name: '주식회사 크로플 — Frontend Developer', meta: '2025.05 —' },
  { tag: 'CAMP', name: '코드잇 프론트엔드 부트캠프 · 팀장', meta: '2024.03 — 08' },
  { tag: 'DEGREE', name: '명지전문대학교 전공심화 · 4.00 / 4.50', meta: '2023.03 — 2024.02' },
  { tag: 'AWARD', name: '학습 포트폴리오 공모전 「보미의 갓생 라이프」 은상', meta: '2023.07' },
  { tag: 'AWARD', name: '학과 캡스톤 디자인 대회 은상 — 향수 추천 쇼핑몰', meta: '교내' },
  { tag: 'CERT', name: '정보처리산업기사', meta: '2022.11' },
  { tag: 'LEAD', name: '정보통신공학과 학생회장', meta: '2022.03 — 12' },
  { tag: 'TUTOR', name: '명지튜터링 — 인터넷 프로그래밍 튜터', meta: '2021.09 — 12' },
  { tag: 'DEGREE', name: '명지전문대학 정보통신공학과 · 3.76 / 4.50', meta: '2020.03 — 2023.02' },
  { tag: 'NOTE', name: '블로그 — 실무에서 막힌 지점의 기록', meta: '100+' },
]

/** CH4 — 핀 + 스크럽 인덱스. 스테이트먼트가 먼저 열리고, 이력 행이 스크롤에 맞춰 한 줄씩 쌓인다. */
export default function Method() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    (context) => {
      if (prefersReducedMotion()) return

      const statement = context.selector?.('[data-statement]')?.[0] as HTMLElement | undefined
      const rows = (context.selector?.('[data-row]') ?? []) as HTMLElement[]
      const fill = context.selector?.('[data-mark-fill]')?.[0] as HTMLElement | undefined
      const text = context.selector?.('[data-mark-text]')?.[0] as HTMLElement | undefined

      gsap.set(rows, { autoAlpha: 0, y: 26 })
      if (fill) gsap.set(fill, { scaleX: 0, transformOrigin: 'left center' })
      if (text) gsap.set(text, { clipPath: 'inset(0 100% 0 0)' })

      const tl = gsap.timeline({
        defaults: { ease: 'power2.out' },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=240%',
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
        },
      })

      if (statement) tl.from(statement, { y: 48, opacity: 0, duration: 0.7 })
      if (fill && text) {
        tl.to(fill, { scaleX: 1, duration: 0.5, ease: 'power3.inOut' }).to(
          text,
          { clipPath: 'inset(0 0% 0 0)', duration: 0.45, ease: 'power3.out' },
          '-=0.2',
        )
      }
      rows.forEach((row) => {
        tl.to(row, { autoAlpha: 1, y: 0, duration: 0.4 }, '+=0.14')
      })
      tl.to({}, { duration: 0.5 })
    },
    { scope: sectionRef },
  )

  return (
    <section
      ref={sectionRef}
      className={cn(
        ground.light,
        'relative flex h-screen flex-col justify-center gap-[4.5vh] overflow-hidden px-[var(--pad)]',
        'motion-reduce:h-auto motion-reduce:overflow-visible motion-reduce:py-[16vh]',
      )}
      id="roster"
    >
      <div data-statement className="relative mx-auto w-full max-w-[1200px] max-md:flex max-md:flex-col">
        <Label>일하는 방식</Label>
        <Display
          className="absolute top-0 right-0 text-[clamp(72px,9vw,150px)] opacity-60 max-md:static max-md:order-first"
          as={OutlineText}
        >
          01
        </Display>
        <p className="mt-[16px] max-w-[24ch] text-[clamp(22px,3.2vw,46px)] leading-[1.25] font-bold tracking-[-0.01em]">
          잘 모르는 걸 만나면 일단 적고,
          <br />
          <MarkedPhrase>
            <span
              data-mark-text
              className="text-dark-ink [clip-path:inset(0_100%_0_0)] motion-reduce:[clip-path:none]"
            >
              다시 꺼낼 수 있는 형태
            </span>
          </MarkedPhrase>
          로 남깁니다.
        </p>
        <p className="mt-3 max-w-[52ch] font-ui text-[clamp(12px,1.1vw,14px)] text-ink-2">
          &lsquo;왜 이렇게 되지?&rsquo;를 그냥 넘기지 못한 습관이 일이 됐습니다. 아래는 그 습관이
          지나온 자리입니다.
        </p>
      </div>

      <ul className="mx-auto w-full max-w-[1200px] list-none">
        {INDEX.map((row) => (
          <Hairline
            as="li"
            key={`${row.tag}-${row.name}`}
            data-row
            className="grid grid-cols-[96px_1fr_auto] items-baseline gap-[16px] py-[10px] max-md:grid-cols-[64px_1fr] max-md:gap-x-3"
          >
            <Label className="text-muted">{row.tag}</Label>
            <Display className="font-kr text-[clamp(14px,1.5vw,21px)] font-bold tracking-[-0.01em]">
              {row.name}
            </Display>
            <Label className="text-muted max-md:col-start-2">{row.meta}</Label>
          </Hairline>
        ))}
      </ul>
    </section>
  )
}

function MarkedPhrase({ children }: { children: ReactNode }) {
  return (
    <span
      data-mark
      className="relative inline-block overflow-hidden align-baseline motion-reduce:overflow-visible"
    >
      <span
        data-mark-fill
        className="pointer-events-none absolute inset-0 origin-left scale-x-0 bg-ink motion-reduce:scale-x-100"
        aria-hidden
      />
      <span className="relative">{children}</span>
    </span>
  )
}
