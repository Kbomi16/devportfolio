import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsapSetup'
import { prefersReducedMotion } from '../lib/motion'

const IMAGE_SRC = '/images/bomi-landing.jpg'

/**
 * CH2 LANDING — 하얀 무대 위 표지. pin +120%.
 * 마우스(--mx/--my)에 따라 그림자·뒤 볼륨·카드·하이라이트·타이포가
 * 각각 다른 깊이로 움직인다 (CSS calc 바인딩, sections.css).
 */
export default function Landing() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=120%',
          pin: true,
          scrub: 0.4,
          anticipatePin: 1,
        },
      })

      // 진입: 카드 정착 + 타이포 리빌 → 이후 홀드 (마우스 패럴랙스 무대)
      tl.fromTo('.landing-stage', { scale: 1.06, yPercent: 5 }, { scale: 1, yPercent: 0, duration: 0.3 }, 0)
        .fromTo('.landing-copy', { y: 64, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3 }, 0.04)
        .to({}, { duration: 0.66 }, 0.34)
    },
    { scope: sectionRef },
  )

  return (
    <section ref={sectionRef} className="landing ground-light" id="about">
      <div className="landing-frame">
        <div className="landing-stage">
          <div className="landing-depth" aria-hidden />
          <div className="landing-shadow" aria-hidden />
          <div className="landing-card">
            <img
              src={IMAGE_SRC}
              alt="웅크린 자세로 정면을 응시하는 3D 바이닐 피규어 — 포트폴리오 표지"
            />
            <div className="landing-sheen" aria-hidden />
          </div>
        </div>

        <div className="landing-copy">
          <span className="label">FRONTEND</span>
          <h1 className="display landing-name">
            KIM BOMI<span className="outline-text">.</span>
          </h1>
          <p className="landing-kr">프론트엔드 개발자 김보미</p>
          <p className="landing-en">
            Building interfaces that respond like they&rsquo;re alive.
          </p>
          <span className="label landing-meta">DEVELOPER · SEOUL · 2026</span>
        </div>
      </div>

      <span className="label landing-hint hairline-top" aria-hidden>
        ↓ WORK
      </span>
    </section>
  )
}
