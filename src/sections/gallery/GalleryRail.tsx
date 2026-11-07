import { useEffect, useRef, useState } from 'react'
import Display from '../../components/common/Display'
import Label from '../../components/common/Label'
import { WORKS, type WorkItem } from '../../content/works'
import { cn } from '../../lib/cn'
import { ground } from '../../lib/ground'
import { gsap, ScrollTrigger, useGSAP } from '../../lib/gsapSetup'
import { matchMediaPreset } from '../../lib/media'
import { invalidateScene } from '../../lib/sceneBus'
import { getLenis } from '../../lib/useLenis'
import DistortImageSlot from '../../scene/DistortImageSlot'
import type { HoverState } from '../../scene/types'
import GalleryControls from './GalleryControls'
import GalleryHeader from './GalleryHeader'

type GalleryRailProps = {
  onOpenWork: (slug: string) => void
}

/** 데스크톱 PROJECTS — 섹션을 pin하고 카드 트랙을 가로로 이동한다. 진행도로 active를 계산한다. */
export default function GalleryRail({ onOpenWork }: GalleryRailProps) {
  const [active, setActive] = useState(0)

  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLUListElement>(null)
  const triggerRef = useRef<ScrollTrigger | null>(null)

  const total = WORKS.length

  const scrollToCard = (index: number) => {
    const trigger = triggerRef.current
    const next = gsap.utils.clamp(0, total - 1, index)
    if (!trigger) {
      setActive(next)
      trackRef.current?.children[next]?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' })
      return
    }
    const y = trigger.start + (trigger.end - trigger.start) * (next / (total - 1))
    const lenis = getLenis()
    if (lenis) lenis.scrollTo(y, { duration: 1.1 })
    else window.scrollTo({ top: y, behavior: 'smooth' })
  }

  const handlePrev = () => scrollToCard(active - 1)

  const handleNext = () => scrollToCard(active + 1)

  useGSAP(
    () => {
      const mm = matchMediaPreset(({ motion }) => {
        const track = trackRef.current
        if (!motion || !track) return

        const getDistance = () => Math.max(0, track.scrollWidth - window.innerWidth)

        const tween = gsap.to(track, {
          x: () => -getDistance(),
          ease: 'none',
          onUpdate: invalidateScene,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: () => `+=${getDistance()}`,
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const next = Math.round(self.progress * (total - 1))
              setActive((prev) => (prev === next ? prev : next))
            },
          },
        })
        triggerRef.current = tween.scrollTrigger ?? null

        return () => {
          triggerRef.current = null
        }
      })
      return () => mm.revert()
    },
    { scope: sectionRef },
  )

  return (
    <section
      ref={sectionRef}
      className={cn(
        ground.light,
        'relative flex h-svh min-h-[640px] flex-col overflow-hidden pt-[calc(var(--nav-h)+22px)] pb-8',
      )}
      id="work"
    >
      <div className="px-[var(--pad)]">
        <GalleryHeader />
      </div>
      <div className="mt-8 min-h-0 flex-1 motion-reduce:overflow-x-auto">
        <ul
          ref={trackRef}
          className="flex h-full w-max list-none items-center gap-[clamp(20px,3vw,48px)] px-[var(--pad)]"
          aria-label="프로젝트 목록"
        >
          {WORKS.map((work, index) => (
            <RailCard key={work.slug} work={work} index={index} onOpen={onOpenWork} />
          ))}
        </ul>
      </div>
      <div className="px-[var(--pad)]">
        <GalleryControls
          active={active}
          total={total}
          title={WORKS[active].title}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      </div>
    </section>
  )
}

type RailCardProps = {
  work: WorkItem
  index: number
  onOpen: (slug: string) => void
}

function RailCard({ work, index, onOpen }: RailCardProps) {
  const hoverRef = useRef<HoverState>({ value: 0 })

  const handleClick = () => onOpen(work.slug)

  const handleHoverStart = () => {
    gsap.to(hoverRef.current, { value: 1, duration: 0.6, ease: 'power3.out', onUpdate: invalidateScene })
  }

  const handleHoverEnd = () => {
    gsap.to(hoverRef.current, { value: 0, duration: 0.8, ease: 'power3.out', onUpdate: invalidateScene })
  }

  useEffect(() => {
    const hover = hoverRef.current
    return () => {
      gsap.killTweensOf(hover)
    }
  }, [])

  const image = work.compare ?? work.thumb

  return (
    <li className="w-[clamp(320px,34vw,520px)] shrink-0">
      <button
        type="button"
        data-cursor="open"
        aria-label={`${work.title} 케이스 스터디 열기`}
        className="group block w-full overflow-hidden rounded-xl text-left !text-dark-ink shadow-[0_18px_40px_rgba(0,0,0,0.18)]"
        onClick={handleClick}
        onMouseEnter={handleHoverStart}
        onMouseLeave={handleHoverEnd}
        onFocus={handleHoverStart}
        onBlur={handleHoverEnd}
      >
        <DistortImageSlot
          src={image.src}
          alt={work.compare ? work.compare.alt : ''}
          fit={work.compare ? 'contain' : 'cover'}
          hover={hoverRef.current}
          className="aspect-[8/5] bg-card-ground"
          loading={index < 2 ? 'eager' : 'lazy'}
        />
        <span className="flex flex-col gap-1.5 bg-dark-ground p-4">
          <span className="flex items-center gap-2">
            <Label className="text-neon">{`0${index + 1}`}</Label>
            {work.status ? (
              <Label className="rounded-full bg-neon px-2 py-0.5 text-dark-ground">{work.status}</Label>
            ) : null}
          </span>
          {work.labelEyebrow ? (
            <Label className="text-dark-ink/55">{work.labelEyebrow}</Label>
          ) : null}
          <Display className="text-[clamp(22px,2vw,32px)] leading-[0.95] break-words">{work.label}</Display>
          <Label className="text-dark-ink/70">{work.homeLine}</Label>
          <Label className="mt-1 text-dark-ink group-hover:text-neon">OPEN CASE →</Label>
        </span>
      </button>
    </li>
  )
}
