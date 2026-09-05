import { useRef, useState } from 'react'
import { gsap, useGSAP } from '../lib/gsapSetup'
import { prefersReducedMotion } from '../lib/motion'

const VIDEO_SRC = '/video/hero.mp4'
const IMAGE_SRC = '/images/bomi-landing.jpg'

/**
 * HERO (CH1+CH2 통합) — 단일 핀 타임라인으로 끊김 없이 연결:
 * 문 개폐(0–0.14) → 필름 스크럽(0.10–0.66) → 랜딩 크로스페이드(0.66–0.76)
 * → 이미지 위 타이포 리빌(0.76–0.9) → 홀드.
 * 랜딩은 풀블리드 이미지 + 마우스(--mx/--my)에 따라 사진·하이라이트·타이포·플로팅
 * 라벨이 서로 다른 깊이로 움직인다 (zustand 홈 스타일, CSS calc 바인딩).
 * 폴백(auto): reduced-motion·영상 오류 → 문 열린 상태 + 1회 재생 후 랜딩 노출.
 */
export default function Hero() {
  const [mode, setMode] = useState<'scrub' | 'auto'>(() =>
    prefersReducedMotion() ? 'auto' : 'scrub',
  )
  const [landed, setLanded] = useState(false)

  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleEnded = () => setLanded(true)

  const handleVideoError = () => {
    setMode('auto')
    setLanded(true)
  }

  useGSAP(
    () => {
      if (mode !== 'scrub') return
      const video = videoRef.current
      if (!video) return
      video.pause()

      // duration은 메타데이터 로드 후 lazily 읽는다 — 핀은 마운트 즉시 생성되어
      // 트리거 순서·레이아웃이 흔들리지 않는다 (구간 튐 방지)
      const scrubState = { t: 0 }

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=450%',
          pin: true,
          scrub: 0.4,
          anticipatePin: 1,
        },
      })

      // 문 열림 (0 – 0.14) — 역스크롤 시 다시 닫힌다
      tl.to('.hero-panel.is-left', { xPercent: -110, duration: 0.14 }, 0)
        .to('.hero-panel.is-right', { xPercent: 110, duration: 0.14 }, 0)
        .to('.hero-bo', { xPercent: -52, duration: 0.14 }, 0)
        .to('.hero-mi', { xPercent: 52, duration: 0.14 }, 0)
        .to('.hero-mark', { scale: 1.16, duration: 0.14 }, 0)
        .to('.hero-dot.is-left', { x: '-46vw', y: '-42vh', duration: 0.14 }, 0)
        .to('.hero-dot.is-right', { x: '46vw', y: '42vh', duration: 0.14 }, 0)
        .to('.hero-chrome', { opacity: 0, duration: 0.07 }, 0.04)
        // 필름 스크럽 (0.10 – 0.66) — 스크롤이 곧 재생 헤드
        .to(
          scrubState,
          {
            t: 1,
            duration: 0.56,
            onUpdate: () => {
              const d = video.duration
              if (Number.isFinite(d) && d > 0) video.currentTime = scrubState.t * d
            },
          },
          0.1,
        )
        // 영상 마지막 프레임 → 랜딩 이미지 크로스페이드 (같은 피규어·같은 검은 무대)
        .fromTo('.hero-landing', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.1 }, 0.66)
        .fromTo('.hero-landing-zoom', { scale: 1.14 }, { scale: 1.02, duration: 0.26 }, 0.66)
        // 이미지 위 타이포 리빌
        .fromTo(
          '.hero-copy-item',
          { y: 56, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.09, stagger: 0.025 },
          0.76,
        )
        .fromTo('.hero-float', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.08, stagger: 0.03 }, 0.82)
        // 홀드 — 마우스 패럴랙스 무대
        .to({}, { duration: 0.1 }, 0.9)
    },
    { scope: sectionRef, dependencies: [mode], revertOnUpdate: true },
  )

  return (
    <section
      ref={sectionRef}
      className={`hero ground-dark${mode === 'auto' ? ' is-auto' : ''}${landed ? ' is-landed' : ''}`}
      id="about"
    >
      <video
        ref={videoRef}
        className="hero-video"
        src={VIDEO_SRC}
        poster={IMAGE_SRC}
        muted
        playsInline
        preload="auto"
        autoPlay={mode === 'auto'}
        onEnded={handleEnded}
        onError={handleVideoError}
        aria-hidden
      />

      {/* 풀블리드 랜딩 — 레이어별 깊이가 다른 마우스 패럴랙스 */}
      <div className="hero-landing">
        <div className="hero-landing-zoom">
          <img
            className="hero-photo"
            src={IMAGE_SRC}
            alt="웅크린 자세로 정면을 응시하는 3D 바이닐 피규어 — 포트폴리오 표지"
          />
          <div className="hero-vignette" aria-hidden />
          <div className="hero-sheen" aria-hidden />
        </div>

        <div className="hero-copy">
          <span className="label hero-copy-item">FRONTEND</span>
          <div className="hero-name-depth">
            <h1 className="display hero-name hero-copy-item">
              KIM BOMI<span className="outline-text">.</span>
            </h1>
          </div>
          <p className="hero-kr hero-copy-item">프론트엔드 개발자 김보미</p>
          <p className="hero-en hero-copy-item">
            Building interfaces that respond like they&rsquo;re alive.
          </p>
          <span className="label hero-meta-line hero-copy-item">DEVELOPER · SEOUL · 2026</span>
        </div>

        <span className="label hero-float is-tl" aria-hidden>
          FIG. 01 — VINYL
        </span>
        <span className="label hero-float is-bl" aria-hidden>
          ↓ SCROLL
        </span>
        <span className="label hero-float is-br" aria-hidden>
          ONE CONTINUOUS SHOT
        </span>
      </div>

      {/* 검은 문 (최상단 레이어) */}
      <div className="hero-door" aria-hidden>
        <div className="hero-panel is-left" />
        <div className="hero-panel is-right" />

        <span className="hero-dot is-left" />
        <span className="hero-dot is-right" />

        <div className="display hero-mark">
          <span className="hero-bo">BO</span>
          <span className="hero-mi">MI.</span>
        </div>

        <div className="hero-chrome">
          <span className="label hero-corner is-tl">KIM BOMI · FRONTEND</span>
          <span className="label hero-corner is-tr">2026</span>
          <span className="label hero-corner is-bl">KROFFLE</span>
          <span className="label hero-corner is-br">SEOUL</span>
          <span className="label hero-hint">Scroll</span>
        </div>
      </div>
    </section>
  )
}
