import { useEffect, useRef, useState } from 'react'
import { gsap, useGSAP } from '../lib/gsapSetup'
import { prefersReducedMotion } from '../lib/motion'

const VIDEO_SRC = '/video/hero.mp4'
const POSTER_SRC = '/images/bomi-landing.jpg'

/**
 * CH1 FILM — 검은 문이 열리면 한 컷짜리 필름이 스크롤에 감긴다.
 * 스크럽 모드: pin +350%, 문 개폐(0–0.18) → video.currentTime(0.12–0.94) → 화이트 아웃(0.94–1).
 * 폴백(auto): reduced-motion·영상 오류 시 문 열린 상태 + 1회 일반 재생.
 */
export default function Film() {
  const [mode, setMode] = useState<'scrub' | 'auto'>(() =>
    prefersReducedMotion() ? 'auto' : 'scrub',
  )
  const [metaReady, setMetaReady] = useState(false)

  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleLoadedMetadata = () => setMetaReady(true)

  const handleVideoError = () => setMode('auto')

  // 캐시 등으로 loadedmetadata가 마운트 전에 끝난 경우 보정
  useEffect(() => {
    const video = videoRef.current
    if (video && video.readyState >= 1) setMetaReady(true)
  }, [])

  useGSAP(
    () => {
      if (mode !== 'scrub' || !metaReady) return
      const video = videoRef.current
      if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return
      video.pause()

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=350%',
          pin: true,
          scrub: 0.4,
          anticipatePin: 1,
        },
      })

      // 문 열림 (0 – 0.18) — 역스크롤 시 다시 닫힌다
      tl.to('.film-panel.is-left', { xPercent: -110, duration: 0.18 }, 0)
        .to('.film-panel.is-right', { xPercent: 110, duration: 0.18 }, 0)
        .to('.film-bo', { xPercent: -52, duration: 0.18 }, 0)
        .to('.film-mi', { xPercent: 52, duration: 0.18 }, 0)
        .to('.film-mark', { scale: 1.16, letterSpacing: '-0.04em', duration: 0.18 }, 0)
        .to('.film-dot.is-left', { x: '-46vw', y: '-42vh', duration: 0.18 }, 0)
        .to('.film-dot.is-right', { x: '46vw', y: '42vh', duration: 0.18 }, 0)
        .to('.film-chrome', { opacity: 0, duration: 0.08 }, 0.05)
        // 필름 스크럽 (0.12 – 0.94) — 스크롤이 곧 재생 헤드
        .fromTo(
          video,
          { currentTime: 0 },
          { currentTime: video.duration, duration: 0.82 },
          0.12,
        )
        // 화이트 아웃 (0.94 – 1) → CH2 랜딩으로 연결
        .to('.film-white', { opacity: 1, duration: 0.06 }, 0.94)
    },
    { scope: sectionRef, dependencies: [mode, metaReady] },
  )

  return (
    <section
      ref={sectionRef}
      className={`film ground-dark${mode === 'auto' ? ' is-auto' : ''}`}
      id="top"
    >
      <video
        ref={videoRef}
        className="film-video"
        src={VIDEO_SRC}
        poster={POSTER_SRC}
        muted
        playsInline
        preload="auto"
        autoPlay={mode === 'auto'}
        onLoadedMetadata={handleLoadedMetadata}
        onError={handleVideoError}
        aria-hidden
      />

      <div className="film-white" aria-hidden />

      <div className="film-door" aria-hidden>
        <div className="film-panel is-left" />
        <div className="film-panel is-right" />

        <span className="film-dot is-left" />
        <span className="film-dot is-right" />

        <div className="display film-mark">
          <span className="film-bo">BO</span>
          <span className="film-mi">MI.</span>
        </div>

        <div className="film-chrome">
          <span className="label film-corner is-tl">KIM BOMI · FRONTEND</span>
          <span className="label film-corner is-tr">2026</span>
          <span className="label film-corner is-bl">KROFFLE</span>
          <span className="label film-corner is-br">SEOUL</span>
          <span className="label film-hint">Scroll</span>
        </div>
      </div>
    </section>
  )
}
