import { useRef, useState } from 'react'
import { motion, useReducedMotion, type PanInfo } from 'motion/react'
import Display from '../components/common/Display'
import Label from '../components/common/Label'
import MagneticButton from '../components/common/MagneticButton'
import { WORKS, type WorkItem } from '../content/works'
import { cn } from '../lib/cn'
import { ground } from '../lib/ground'

type GalleryProps = {
  onOpenWork: (slug: string) => void
}

const STEP_DEG = 20
const VISIBLE_RANGE = 2
const SWIPE_PX = 60

/** active 기준 -n/2 ~ n/2 사이의 원형 거리. 끝에서 처음으로 이어진다. */
const circularOffset = (index: number, active: number, total: number) => {
  const raw = (((index - active) % total) + total) % total
  return raw > total / 2 ? raw - total : raw
}

/**
 * CH3 GALLERY — 부채꼴 슬라이드. 가운데 카드만 똑바로 서고, 양옆은 아래 축을 중심으로 기운다.
 * 가운데 카드 클릭 → /work/[slug], 옆 카드 클릭·버튼·스와이프 → 한 칸 이동.
 */
export default function Gallery({ onOpenWork }: GalleryProps) {
  const [active, setActive] = useState(0)

  const pannedRef = useRef(false)

  const reduceMotion = useReducedMotion()

  const total = WORKS.length
  const current = WORKS[active]

  const handlePrev = () => setActive((index) => (index - 1 + total) % total)

  const handleNext = () => setActive((index) => (index + 1) % total)

  const handleSelect = (index: number) => {
    if (pannedRef.current) return
    if (index === active) onOpenWork(WORKS[index].slug)
    else setActive(index)
  }

  const handlePointerDown = () => {
    pannedRef.current = false
  }

  const handlePanStart = () => {
    pannedRef.current = true
  }

  const handlePanEnd = (_event: PointerEvent, info: PanInfo) => {
    if (info.offset.x <= -SWIPE_PX) handleNext()
    else if (info.offset.x >= SWIPE_PX) handlePrev()
  }

  return (
    <section
      className={cn(
        ground.light,
        'relative flex flex-col md:h-svh md:min-h-[640px] overflow-hidden px-[var(--pad)] pt-[calc(var(--nav-h)+22px)] pb-8',
      )}
      id="work"
    >
      <header className="mx-auto w-full max-w-[1200px]">
        <Label className="text-muted">PROJECTS</Label>
        <h2 className="mt-3 font-kr text-[clamp(26px,3.2vw,48px)] leading-[1.15] font-extrabold tracking-[-0.02em]">
          권한은 막고, 검색은 붙이고,{' '}
          <br className="max-md:hidden" />
          흐름은 이어 붙였습니다.
        </h2>
      </header>

      <motion.div
        className="relative mt-4 h-[min(100vw,68vh)] touch-pan-y md:h-auto md:min-h-[320px] md:flex-1"
        onPointerDownCapture={handlePointerDown}
        onPanStart={handlePanStart}
        onPanEnd={handlePanEnd}
      >
        <ul className="list-none" aria-label="프로젝트 슬라이드">
          {WORKS.map((work, index) => {
            const offset = circularOffset(index, active, total)
            const isActive = offset === 0
            const isVisible = Math.abs(offset) <= VISIBLE_RANGE

            return (
              <motion.li
                key={work.slug}
                className="absolute top-[8%] left-1/2 w-[240px] -ml-[120px] origin-[50%_220%] sm:w-[280px] sm:-ml-[140px] lg:w-[320px] lg:-ml-[160px]"
                style={{ zIndex: 10 - Math.abs(offset), pointerEvents: isVisible ? 'auto' : 'none' }}
                initial={false}
                animate={{ rotate: offset * STEP_DEG, opacity: isVisible ? 1 : 0 }}
                transition={
                  reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 170, damping: 24 }
                }
                aria-hidden={!isVisible}
              >
                <SlideCard
                  work={work}
                  index={index}
                  isActive={isActive}
                  tabIndex={isVisible ? 0 : -1}
                  onSelect={handleSelect}
                />
              </motion.li>
            )
          })}
        </ul>
      </motion.div>

      <div className="relative z-20 mx-auto mt-8 flex w-full max-w-[1200px] flex-col items-center gap-4 md:mt-6">
        <p className="mx-auto max-w-[min(100%,28rem)] text-center" aria-live="polite">
          <Label className="text-muted">{`0${active + 1} / 0${total}`}</Label>
          <span className="mt-1 block font-kr text-[15px] font-semibold">{current.title}</span>
        </p>
        <div className="flex gap-2">
          <MagneticButton
            aria-label="이전 프로젝트"
            className="grid size-10 place-items-center rounded-lg !border !border-light-ink/15 !bg-light-ink/[0.06] !font-ui !text-[18px] transition-colors hover:!border-neon hover:!bg-neon"
            strength={0.22}
            onClick={handlePrev}
          >
            ‹
          </MagneticButton>
          <MagneticButton
            aria-label="다음 프로젝트"
            className="grid size-10 place-items-center rounded-lg !border !border-light-ink/15 !bg-light-ink/[0.06] !font-ui !text-[18px] transition-colors hover:!border-neon hover:!bg-neon"
            strength={0.22}
            onClick={handleNext}
          >
            ›
          </MagneticButton>
        </div>
      </div>
    </section>
  )
}

function SlideCard({
  work,
  index,
  isActive,
  tabIndex,
  onSelect,
}: {
  work: WorkItem
  index: number
  isActive: boolean
  tabIndex: number
  onSelect: (index: number) => void
}) {
  const handleClick = () => onSelect(index)

  return (
    <button
      type="button"
      tabIndex={tabIndex}
      aria-label={isActive ? `${work.title} 케이스 스터디 열기` : `${work.title} 보기`}
      className="group relative block w-full overflow-hidden rounded-xl !bg-[#f4f0e8] text-left !text-dark-ink shadow-[0_18px_40px_rgba(0,0,0,0.18)]"
      onClick={handleClick}
    >
      <img
        src={work.thumb.src}
        alt=""
        className="aspect-[8/5] w-full object-cover"
        draggable={false}
      />
      <span className="flex flex-col gap-1.5 bg-dark-ground p-3.5">
        <span className="flex items-center gap-2">
          <Label className="text-neon">{`0${index + 1}`}</Label>
          {work.status ? (
            <Label className="rounded-full bg-neon px-2 py-0.5 text-dark-ground">{work.status}</Label>
          ) : null}
        </span>
        <Display className="text-[clamp(18px,1.35vw,22px)] leading-[0.95] break-words">{work.label}</Display>
        <Label className="text-dark-ink/70">{work.homeLine}</Label>
        {isActive ? (
          <Label className="mt-1 text-dark-ink group-hover:text-neon">OPEN CASE →</Label>
        ) : null}
      </span>
    </button>
  )
}
