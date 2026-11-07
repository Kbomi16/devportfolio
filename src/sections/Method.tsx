import { useRef, type ReactNode } from 'react'
import Display from '../components/common/Display'
import Hairline from '../components/common/Hairline'
import Label from '../components/common/Label'
import { HISTORY, type HistoryRow } from '../content/history'
import { cn } from '../lib/cn'
import { ground } from '../lib/ground'
import { gsap, SplitText, useGSAP } from '../lib/gsapSetup'
import { matchMediaPreset } from '../lib/media'
import SceneSlot from '../scene/SceneSlot'

/** CH4 — 스테이트먼트는 단어 마스크 리빌, 이력 행은 서로 다른 깊이로 스크럽되며 올라온다 (pin 없음). */
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

        const depths = desktop ? [24, 48, 72] : [20]
        gsap.utils.toArray<HTMLElement>('[data-row]').forEach((row, index) => {
          gsap.fromTo(
            row,
            { y: depths[index % depths.length], autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              ease: 'none',
              scrollTrigger: { trigger: row, start: 'top bottom', end: 'top 62%', scrub: 0.6 },
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

      <ul className="mx-auto w-full max-w-[1200px] list-none">
        {HISTORY.map((row) => (
          <IndexItem key={`${row.tag}-${row.name}`} row={row} />
        ))}
      </ul>
    </section>
  )
}

function IndexItem({ row }: { row: HistoryRow }) {
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
