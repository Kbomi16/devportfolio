import { useRef } from 'react'
import { motion } from 'motion/react'
import Display from '../components/common/Display'
import Label from '../components/common/Label'
import { WORKS } from '../content/works'
import { cn } from '../lib/cn'

const galleryLabelClass = (label: string) =>
  label.length > 5
    ? 'max-w-full text-[clamp(28px,5.2vw,68px)] leading-[0.92] tracking-[-0.03em]'
    : 'text-[clamp(56px,8vw,128px)]'
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
      <header className="absolute top-[calc(var(--nav-h)+22px)] left-[max(var(--pad),calc((100%-1200px)/2))] flex w-[min(calc(100%-2*var(--pad)),1200px)] flex-col motion-reduce:static motion-reduce:px-[var(--pad)] motion-reduce:pb-6">
        <Label className="text-muted">PROJECTS</Label>
        <h2 className="mt-3 font-kr text-[clamp(26px,3.2vw,48px)] leading-[1.15] font-extrabold tracking-[-0.02em]">
          권한은 막고, 검색은 붙이고,
          <br className="max-md:hidden" />
          흐름은 이어 붙였습니다.
        </h2>
      </header>

      <div
        ref={trackRef}
        className="mt-[clamp(148px,20vh,228px)] flex w-max items-center gap-[clamp(20px,3vw,48px)] px-[max(var(--pad),8vw)] will-change-transform motion-reduce:mt-0"
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
              <div className="flex items-start justify-between gap-3 text-ink-2">
                <span className="flex items-center gap-3">
                  <Label className="text-[20px] text-neon">{`0${i + 1}`}</Label>
                  {work.status ? (
                    <Label className="rounded-full bg-neon px-2 py-1 text-dark-ground">{work.status}</Label>
                  ) : null}
                </span>
                <Label className="text-right">{work.period}</Label>
              </div>
              <div className="flex flex-col gap-2">
                {work.labelEyebrow ? (
                  <Display className="text-[clamp(28px,4.5vw,72px)]">{work.labelEyebrow}</Display>
                ) : null}
                <Display className={galleryLabelClass(work.label)}>{work.label}</Display>
              </div>
              <div className="flex flex-col gap-3">
                <p className="max-w-[44ch] whitespace-pre-line text-[15px] leading-[1.6] text-dark-ink">{work.oneLiner}</p>
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
