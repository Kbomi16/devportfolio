import { useRef, type ReactNode } from 'react'
import Display from '../components/common/Display'
import Hairline from '../components/common/Hairline'
import Label from '../components/common/Label'
import { cn } from '../lib/cn'
import { ground } from '../lib/ground'
import { gsap, useGSAP } from '../lib/gsapSetup'
import { prefersReducedMotion } from '../lib/motion'

type IndexRow = {
  tag: string
  name: string
  meta: string
  note: string
}

const INDEX: IndexRow[] = [
  {
    tag: 'NOW',
    name: '주식회사 크로플 · Frontend Developer',
    meta: '2025.05 —',
    note:
      '중대재해 관리 백오피스 FE.\n메뉴·권한·조직 선택을 공통 구조로 묶었습니다.\n\n공개 웹 7종.\n다국어 주소, 검색, 문의까지 같은 규칙으로 맞췄습니다.\n\nAlleo AI SaaS.\n분석부터 글·발행까지 이어지는 콘솔 프론트를 맡았습니다.',
  },
  {
    tag: 'CAMP',
    name: '코드잇 프론트엔드 부트캠프 · 팀장',
    meta: '2024.03 — 08',
    note: '팀장으로 스크럼 회의를 진행하고, 리뷰만 보는 시간을 따로 두어 리뷰가 끊기지 않게 했습니다.',
  },
  {
    tag: 'DEGREE',
    name: '명지전문대학교 전공심화',
    meta: '2023.03 — 2024.02',
    note: '정보통신공학과 전공심화 과정. 학점 4.00 / 4.50.',
  },
  {
    tag: 'AWARD',
    name: '학습 포트폴리오 공모전 「보미의 갓생 라이프」 은상',
    meta: '2023.07',
    note: '「보미의 갓생 라이프」. 투두 앱으로 일과를 나눠, 자격증을 따고 멘토링까지 시간을 알차게 쓴 학습 기록입니다.',
  },
  {
    tag: 'AWARD',
    name: '학과 캡스톤 디자인 대회 은상 · 향수 추천 쇼핑몰',
    meta: '2023.12',
    note: 'Fumease. 키워드 색으로 취향을 고르면 OpenAI가 향수를 추천하고, 그 결과에서 바로 살 수 있게 만든 쇼핑몰입니다.',
  },
  {
    tag: 'CERT',
    name: '정보처리산업기사',
    meta: '2022.11',
    note: '한국산업인력공단 · 최종합격.',
  },
  {
    tag: 'LEAD',
    name: '정보통신공학과 학생회장',
    meta: '2022.03 — 12',
    note: '명지전문대학교 정보통신공학과 학생회장.',
  },
  {
    tag: 'TUTOR',
    name: '명지튜터링 · 인터넷 프로그래밍 튜터',
    meta: '2021.09 — 12',
    note: '신입생 대상 HTML/CSS, 웹 기초를 맡았습니다.',
  },
  {
    tag: 'DEGREE',
    name: '명지전문대학 정보통신공학과',
    meta: '2020.03 — 2023.02',
    note: '정보통신공학과 졸업. 학점 3.76 / 4.50.',
  },
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
      <div data-statement className="mx-auto w-full max-w-[1200px]">
        <Label className="text-muted">일하는 방식</Label>
        <p className="mt-3 max-w-[16em] font-kr text-[clamp(26px,3.2vw,48px)] leading-[1.15] font-extrabold tracking-[-0.02em]">
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
        <p className="mt-3 max-w-[46ch] text-[15px] leading-[1.7] text-ink-2">
          나중에 헤매지 않으려고 적어 둔 메모가 블로그 100편이 됐습니다.
          <br />
          그 습관이 지금은 일하는 방식입니다.
        </p>
      </div>

      <ul className="mx-auto w-full max-w-[1200px] list-none">
        {INDEX.map((row) => (
          <IndexItem key={`${row.tag}-${row.name}`} row={row} />
        ))}
      </ul>
    </section>
  )
}

function IndexItem({ row }: { row: IndexRow }) {
  return (
    <Hairline
      as="li"
      data-row
      tabIndex={0}
      className="group grid grid-cols-[96px_1fr_auto] items-start gap-x-[16px] py-[10px] outline-none focus-visible:bg-ink/[0.03] max-md:grid-cols-[64px_1fr] max-md:gap-x-3"
    >
      <Label className="pt-[3px] text-muted">{row.tag}</Label>
      <div>
        <Display className="font-kr text-[clamp(14px,1.5vw,21px)] font-bold tracking-[-0.01em]">
          {row.name}
        </Display>
        <p className="grid grid-rows-[0fr] overflow-hidden transition-[grid-template-rows] duration-300 ease-out group-hover:grid-rows-[1fr] group-focus:grid-rows-[1fr] motion-reduce:transition-none">
          <span className="min-h-0 overflow-hidden">
            <span className="mt-1.5 block max-w-[48ch] whitespace-pre-line font-ui text-[12.5px] leading-[1.6] text-ink-2">
              {row.note}
            </span>
          </span>
        </p>
      </div>
      <Label className="pt-[3px] text-muted max-md:col-start-2">{row.meta}</Label>
    </Hairline>
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
