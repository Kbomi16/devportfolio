import { useRef } from 'react'
import Display from '../components/common/Display'
import Label from '../components/common/Label'
import { CAREER, COMPANY, type CareerItem } from '../content/career'
import { HISTORY, type HistoryRow } from '../content/history'
import { outboundLinkProps } from '../lib/outboundLink'
import { cn } from '../lib/cn'
import { ground } from '../lib/ground'
import { gsap, useGSAP } from '../lib/gsapSetup'
import { revealOnce } from '../lib/reveal'
import { matchMediaPreset } from '../lib/media'
import SceneSlot from '../scene/SceneSlot'

/** CH4 — 경력(크로플 4개 항목) + 학력·수상·자격증 벤토 그리드. */
export default function Method() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = matchMediaPreset(({ motion, desktop }) => {
        if (!motion) return

        revealOnce(gsap.utils.toArray<HTMLElement>('[data-rv]'))

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
      <div className="mx-auto w-full max-w-[1200px]">
        <Label data-rv className="text-muted">
          경력
        </Label>
        <div data-rv className="mt-3 flex flex-col gap-2">
          <h2 className="max-w-[calc(100%-120px)] font-kr text-[clamp(24px,3vw,44px)] leading-[1.2] font-extrabold tracking-[-0.02em] max-md:max-w-none">
            {COMPANY.name}
          </h2>
          <Label className="text-muted">{COMPANY.period}</Label>
        </div>
        <p data-rv className="mt-4 max-w-[62ch] text-[15px] leading-[1.75] text-ink/70">
          {COMPANY.summary}
        </p>
        <ol className="mt-8 grid list-none gap-4 lg:grid-cols-2">
          {CAREER.map((item) => (
            <CareerCard key={item.title} item={item} />
          ))}
        </ol>
      </div>

      <div className="mx-auto w-full max-w-[1200px] pt-[4vh]">
        <Label data-rv className="text-muted">
          학력 · 수상·활동 · 자격증
        </Label>
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
  DEGREE: 'sm:col-span-2 lg:col-span-6',
  CAMP: 'sm:col-span-2 lg:col-span-4',
  AWARD: 'sm:col-span-2 lg:col-span-4',
  LEAD: 'lg:col-span-4',
  TUTOR: 'lg:col-span-4',
  CERT: 'sm:col-span-2 lg:col-span-4',
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

const CAREER_STEPS: { key: 'problem' | 'choice' | 'after'; label: string }[] = [
  { key: 'problem', label: '문제' },
  { key: 'choice', label: '선택' },
  { key: 'after', label: '이후' },
]

function CareerCard({ item }: { item: CareerItem }) {
  return (
    <li data-rv className="flex flex-col gap-4 rounded-xl border border-hairline bg-light-ground p-5 md:p-6">
      <div className="flex flex-col gap-1">
        <Label className="text-muted">{item.period}</Label>
        <Display className="font-kr text-[clamp(17px,1.6vw,22px)] leading-[1.3] font-bold tracking-[-0.01em]">
          {item.title}
        </Display>
      </div>
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-[13px] leading-[1.65]">
        <dt className="text-muted">역할</dt>
        <dd className="text-ink/70">{item.role}</dd>
        <dt className="text-muted">스택</dt>
        <dd className="text-ink/70">{item.stack}</dd>
        {item.extra?.map((row) => (
          <FragmentRow key={row.label} label={row.label} text={row.text} />
        ))}
        {item.live ? (
          <>
            <dt className="text-muted">라이브</dt>
            <dd className="flex flex-wrap gap-x-3">
              {item.live.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  {...outboundLinkProps(link.url)}
                  className="underline decoration-hairline underline-offset-4 hover:decoration-current"
                >
                  {link.label} ↗
                </a>
              ))}
            </dd>
          </>
        ) : null}
      </dl>
      <div className="flex flex-col gap-3 border-t border-hairline pt-4">
        {CAREER_STEPS.map((step) => (
          <div key={step.key} className="grid grid-cols-[2.5rem_1fr] gap-3">
            <Label className="pt-[3px] text-muted">{step.label}</Label>
            <p className="text-[13.5px] leading-[1.7] text-ink/70">{item[step.key]}</p>
          </div>
        ))}
      </div>
    </li>
  )
}

function FragmentRow({ label, text }: { label: string; text: string }) {
  return (
    <>
      <dt className="text-muted">{label}</dt>
      <dd className="text-ink/70">{text}</dd>
    </>
  )
}
