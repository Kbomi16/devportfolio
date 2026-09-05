import { useRef } from 'react'
import { motion } from 'motion/react'
import Display from '../components/common/Display'
import Label from '../components/common/Label'
import { WORKS } from '../content/works'
import { cn } from '../lib/cn'
import { ground } from '../lib/ground'
import { gsap, useGSAP } from '../lib/gsapSetup'
import { prefersReducedMotion } from '../lib/motion'

type GalleryProps = {
  onOpenWork: (slug: string) => void
}

/**
 * CH3 GALLERY — 핀 고정 가로 스크롤. 세로 스크롤이 검은 패널 3장을 왼쪽으로 민다.
 * 호버(motion 스프링)·클릭 → /work/[slug]. reduced-motion은 가로 네이티브 스크롤.
 */
export default function Gallery({ onOpenWork }: GalleryProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const track = trackRef.current
      if (!track) return

      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth)

      gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      })
    },
    { scope: sectionRef },
  )

  return (
    <section
      ref={sectionRef}
      className={cn(
        ground.light,
        'relative flex h-screen flex-col justify-center overflow-hidden motion-reduce:h-auto motion-reduce:overflow-x-auto motion-reduce:py-[14vh]',
      )}
      id="work"
    >
      <header className="absolute top-[calc(var(--nav-h)+22px)] left-[var(--pad)] flex flex-col gap-2 motion-reduce:static motion-reduce:px-[var(--pad)] motion-reduce:pb-6">
        <Label className="text-muted">CATALOGUE</Label>
        <h2 className="font-kr text-[clamp(22px,2.6vw,36px)] font-extrabold tracking-[-0.02em]">
          규칙이 이어지는 방식.
        </h2>
      </header>

      <div
        ref={trackRef}
        className="flex w-max items-center gap-[clamp(20px,3vw,48px)] px-[max(var(--pad),8vw)] will-change-transform"
      >
        {WORKS.map((work, i) => (
          <motion.article
            key={work.slug}
            className="w-[min(76vw,780px)] shrink-0 rounded-xl bg-dark-ground text-dark-ink max-md:w-[84vw]"
            whileHover={{ y: -14, rotate: -0.5 }}
            whileTap={{ scale: 0.985 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          >
            <button
              type="button"
              className="group flex h-[min(62vh,560px)] w-full flex-col justify-between gap-7 p-[clamp(24px,3vw,44px)] text-left"
              onClick={() => onOpenWork(work.slug)}
              aria-label={`${work.title} 케이스 스터디 열기`}
            >
              <div className="flex justify-between text-ink-2">
                <Label className="text-[20px] text-transparent [-webkit-text-stroke:1px_var(--dark-ink)]">
                  {`0${i + 1}`}
                </Label>
                <Label>{work.period}</Label>
              </div>
              <Display className="text-[clamp(56px,8vw,128px)]">{work.label}</Display>
              <div className="flex flex-col gap-3">
                <p className="max-w-[44ch] text-[15px] leading-[1.6] text-dark-ink">{work.oneLiner}</p>
                <Label className="text-ink-2">{work.homeLine}</Label>
                <Label className="mt-2 text-dark-ink group-hover:underline group-hover:underline-offset-4">
                  OPEN CASE →
                </Label>
              </div>
            </button>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
