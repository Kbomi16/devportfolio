import { useRef } from 'react'
import { motion } from 'motion/react'
import { gsap, useGSAP } from '../lib/gsapSetup'
import { prefersReducedMotion } from '../lib/motion'
import { WORKS } from '../content/works'

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
    <section ref={sectionRef} className="gallery ground-light" id="work">
      <header className="gallery-head">
        <span className="label">CATALOGUE</span>
        <h2 className="gallery-title">규칙이 이어지는 방식.</h2>
      </header>

      <div ref={trackRef} className="gallery-track">
        {WORKS.map((work, i) => (
          <motion.article
            key={work.slug}
            className="gallery-panel"
            whileHover={{ y: -14, rotate: -0.5 }}
            whileTap={{ scale: 0.985 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          >
            <button
              type="button"
              className="gallery-panel-btn"
              onClick={() => onOpenWork(work.slug)}
              aria-label={`${work.title} 케이스 스터디 열기`}
            >
              <div className="gallery-panel-top">
                <span className="label gallery-index">{`0${i + 1}`}</span>
                <span className="label gallery-period">{work.period}</span>
              </div>
              <span className="display gallery-name">{work.label}</span>
              <div className="gallery-panel-bottom">
                <p className="gallery-line">{work.oneLiner}</p>
                <span className="label gallery-meta">{work.homeLine}</span>
                <span className="label gallery-cta">OPEN CASE →</span>
              </div>
            </button>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
