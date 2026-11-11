import { useRef, type ReactNode } from 'react'
import Display from '../components/common/Display'
import Label from '../components/common/Label'
import { HISTORY, type HistoryRow } from '../content/history'
import { cn } from '../lib/cn'
import { ground } from '../lib/ground'
import { gsap, SplitText, useGSAP } from '../lib/gsapSetup'
import { matchMediaPreset } from '../lib/media'
import SceneSlot from '../scene/SceneSlot'

/** CH4 — 스테이트먼트 리빌 + 이력 벤토 그리드. */
export default function Method() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = matchMediaPreset(({ motion, desktop }) => {
        if (!motion) return

        const words = gsap.utils
          .toArray<HTMLElement>('[data-split-words]')
          .flatMap((el) => SplitText.create(el, { type: 'words', mask: 'words', aria: 'none' }).words)

        gsap.from(words, {
          yPercent: 110,
          stagger: 0.05,
          ease: 'none',
          scrollTrigger: {
            trigger: '[data-statement]',
            start: 'top 85%',
            end: 'top 45%',
            scrub: 0.6,
          },
        })

        gsap
          .timeline({
            scrollTrigger: {
              trigger: '[data-statement]',
              start: 'top 60%',
              end: 'top 25%',
              scrub: 0.6,
            },
          })
          .fromTo(
            '[data-mark-fill]',
            { scaleX: 0 },
            { scaleX: 1, ease: 'power3.inOut', transformOrigin: 'left center' },
          )
          .fromTo(
            '[data-mark-text]',
            { clipPath: 'inset(0 100% 0 0)' },
            { clipPath: 'inset(0 0% 0 0)', ease: 'power3.out' },
            '-=0.2',
          )

        const reach = desktop ? 140 : 64
        gsap.utils.toArray<HTMLElement>('[data-row]').forEach((row) => {
          const x = Number(row.dataset.x)
          const y = Number(row.dataset.y)
          const rotation = Number(row.dataset.r)
          const fromAxis = (value: number) => value - Math.sign(value || 1) * reach

          gsap.fromTo(
            row,
            { x: fromAxis(x), y: fromAxis(y), rotation: rotation * 3, autoAlpha: 0 },
            {
              x,
              y,
              rotation,
              autoAlpha: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: '[data-roster-grid]',
                start: 'top 96%',
                end: 'top 68%',
                scrub: 0.6,
              },
            },
          )
        })
      })
      return () => mm.revert()
    },
    { scope: sectionRef },
  )

  return (
    <section
      ref={sectionRef}
      className={cn(ground.light, 'relative flex flex-col gap-[6vh] px-[var(--pad)] py-[16vh]')}
      id="roster"
    >
      <SceneSlot
        object={{ kind: 'memo' }}
        fallbackSrc="/images/3d/workflow-memo.webp"
        className="absolute top-[12vh] right-[var(--pad)] size-[clamp(96px,10vw,160px)] max-md:size-[72px]"
      />
      <div data-statement className="mx-auto w-full max-w-[1200px]">
        <Label className="text-muted">일하는 방식</Label>
        <p className="mt-3 max-w-[16em] font-kr text-[clamp(26px,3.2vw,48px)] leading-[1.15] font-extrabold tracking-[-0.02em]">
          <span data-split-words>잘 모르는 걸 만나면 일단 적고,</span>
          <br />
          <MarkedPhrase>
            <span
              data-mark-text
              className="text-dark-ink [clip-path:inset(0_100%_0_0)] motion-reduce:[clip-path:none]"
            >
              다시 꺼낼 수 있는 형태
            </span>
          </MarkedPhrase>
          <span data-split-words>로 남깁니다.</span>
        </p>
        <p className="mt-3 max-w-[46ch] text-[15px] leading-[1.7] text-ink-2">
          나중에 헤매지 않으려고 적어 둔 메모가 블로그 100편이 됐습니다.
          <br />
          그 습관이 지금은 일하는 방식입니다.
        </p>
      </div>

      <ul
        data-roster-grid
        className="mx-auto grid w-full max-w-[1200px] list-none grid-cols-1 items-start gap-4 sm:grid-cols-2 lg:grid-cols-12"
      >
        {HISTORY.map((row, index) => (
          <IndexItem key={`${row.tag}-${row.name}`} row={row} gather={GATHER[index]} />
        ))}
      </ul>
    </section>
  )
}

type Gather = { x: number; y: number; r: number }

/** 멈춘 자리. 바깥쪽은 스크롤 동안 이 방향으로 들어와 겹친다. */
const GATHER: Gather[] = [
  { x: 12, y: 10, r: -1.4 },
  { x: -14, y: 8, r: 1.4 },
  { x: -10, y: 6, r: 1.1 },
  { x: -12, y: -6, r: -1.4 },
  { x: 10, y: -12, r: -1.1 },
  { x: 6, y: -10, r: 1.2 },
  { x: -8, y: -8, r: 1.4 },
  { x: -12, y: -10, r: -1 },
  { x: 12, y: -12, r: 0.8 },
]

const ITEM_SPAN: Record<HistoryRow['tag'], string> = {
  NOW: 'sm:col-span-2 lg:col-span-7',
  CAMP: 'sm:col-span-2 lg:col-span-5',
  DEGREE: 'sm:col-span-2 lg:col-span-6',
  AWARD: 'sm:col-span-2 lg:col-span-6',
  CERT: 'lg:col-span-4',
  LEAD: 'lg:col-span-4',
  TUTOR: 'sm:col-span-2 lg:col-span-4',
}

function IndexItem({ row, gather }: { row: HistoryRow; gather: Gather }) {
  return (
    <li
      data-row
      data-x={gather.x}
      data-y={gather.y}
      data-r={gather.r}
      tabIndex={0}
      style={{ transform: `translate(${gather.x}px, ${gather.y}px) rotate(${gather.r}deg)` }}
      className={cn(
        ITEM_SPAN[row.tag],
        'group flex flex-col gap-4 rounded-xl border border-hairline bg-light-ground p-5 outline-none',
        'hover:border-light-ink focus-visible:border-light-ink',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <Label className="text-muted">{row.tag}</Label>
        <Label className="shrink-0 whitespace-nowrap text-muted">{row.meta}</Label>
      </div>
      <Display className="font-kr text-[clamp(16px,1.5vw,22px)] leading-[1.3] font-bold tracking-[-0.01em]">
        {row.name}
      </Display>
      <p className="whitespace-pre-line font-ui text-[12.5px] leading-[1.65] text-ink-2">{row.note}</p>
    </li>
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
