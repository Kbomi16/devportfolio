import { useRef, useState } from 'react'
import Display from '../components/common/Display'
import Label from '../components/common/Label'
import OutlineText from '../components/common/OutlineText'
import { cn } from '../lib/cn'
import { ground } from '../lib/ground'
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
          end: '+=1000%',
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
        .to('.hero-mark', { scale: 1.16, autoAlpha: 0, duration: 0.14 }, 0)
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
      className={cn(ground.dark, 'relative h-screen overflow-hidden bg-black')}
      id="about"
    >
      <video
        ref={videoRef}
        className="absolute inset-0 size-full object-cover"
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
      <div
        className={cn(
          'hero-landing absolute inset-0 z-[2]',
          landed
            ? 'visible opacity-100 transition-opacity duration-[900ms] ease-linear'
            : 'invisible opacity-0',
        )}
      >
        <div className="hero-landing-zoom absolute inset-0 overflow-hidden will-change-transform">
          <img
            className="size-full object-cover will-change-transform select-none [-webkit-user-drag:none] [transform:translate3d(calc(var(--mx)*-16px),calc(var(--my)*-10px),0)_scale(1.06)] motion-reduce:will-change-auto motion-reduce:[transform:scale(1.02)]"
            src={IMAGE_SRC}
            alt="웅크린 자세로 정면을 응시하는 3D 바이닐 피규어 — 포트폴리오 표지"
          />
          <div
            className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_45%,transparent_55%,rgba(0,0,0,0.55)_100%)]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(560px_420px_at_calc(50%+var(--mx)*30%)_calc(40%+var(--my)*24%),rgba(242,240,235,0.14),transparent_60%)] mix-blend-soft-light motion-reduce:hidden"
            aria-hidden
          />
        </div>

        <div className="absolute top-1/2 right-[var(--pad)] z-[3] flex -translate-y-1/2 flex-col items-end gap-2.5 text-right text-dark-ink will-change-transform [transform:translate3d(calc(var(--mx)*26px),calc(var(--my)*14px),0)] max-md:top-auto max-md:right-auto max-md:bottom-[calc(var(--pad)+44px)] max-md:left-[var(--pad)] max-md:items-start max-md:translate-none max-md:text-left motion-reduce:will-change-auto motion-reduce:[transform:none]">
          <Label className="hero-copy-item text-dark-ink/60">FRONTEND</Label>
          <div className="will-change-transform [transform:translate3d(calc(var(--mx)*14px),calc(var(--my)*8px),0)] motion-reduce:will-change-auto motion-reduce:[transform:none]">
            <Display
              as="h1"
              className="hero-name hero-copy-item text-[clamp(56px,9vw,150px)] leading-[0.94] [text-shadow:0_4px_60px_rgba(0,0,0,0.5)]"
            >
              KIM BOMI
              <OutlineText>.</OutlineText>
            </Display>
          </div>
          <p className="hero-copy-item text-[clamp(17px,1.8vw,24px)] font-bold tracking-[-0.01em]">
            프론트엔드 개발자 김보미
          </p>
          <p className="hero-copy-item max-w-[36ch] font-ui text-[clamp(13px,1.2vw,16px)] text-dark-ink/72">
            Building interfaces that respond like they&rsquo;re alive.
          </p>
          <Label className="hero-copy-item mt-2 text-ink-2">DEVELOPER · SEOUL · 2026</Label>
        </div>

        <Label
          className="hero-float is-tl absolute top-[calc(var(--nav-h)+18px)] left-[var(--pad)] z-[3] text-dark-ink/55 will-change-transform [transform:translate3d(calc(var(--mx)*38px),calc(var(--my)*22px),0)] motion-reduce:will-change-auto motion-reduce:[transform:none]"
          aria-hidden
        >
          FIG. 01 — VINYL
        </Label>
        <Label
          className="hero-float is-bl absolute bottom-[var(--pad)] left-[var(--pad)] z-[3] text-dark-ink/55 will-change-transform [transform:translate3d(calc(var(--mx)*30px),calc(var(--my)*-18px),0)] max-md:hidden motion-reduce:will-change-auto motion-reduce:[transform:none]"
          aria-hidden
        >
          ↓ SCROLL
        </Label>
        <Label
          className="hero-float is-br absolute right-[var(--pad)] bottom-[var(--pad)] z-[3] text-dark-ink/55 will-change-transform [transform:translate3d(calc(var(--mx)*-34px),calc(var(--my)*-20px),0)] motion-reduce:will-change-auto motion-reduce:[transform:none]"
          aria-hidden
        >
          ONE CONTINUOUS SHOT
        </Label>
      </div>

      {/* 검은 문 (최상단 레이어) */}
      {mode !== 'auto' && (
        <div className="hero-door pointer-events-none absolute inset-0 z-[4] text-dark-ink" aria-hidden>
          <div className="hero-panel is-left absolute inset-y-0 left-0 w-[50.5vw] border-r border-hairline-on-dark bg-dark-ground will-change-transform" />
          <div className="hero-panel is-right absolute inset-y-0 right-0 w-[50.5vw] border-l border-hairline-on-dark bg-dark-ground will-change-transform" />

          <span className="hero-dot is-left absolute top-1/2 left-[calc(50%-16px)] size-1 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] will-change-transform" />
          <span className="hero-dot is-right absolute top-1/2 left-[calc(50%+12px)] size-1 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] will-change-transform" />

          <Display className="hero-mark absolute inset-0 flex items-center justify-center text-[clamp(64px,13vw,190px)] tracking-[0.01em] will-change-transform">
            <span className="hero-bo inline-block will-change-transform">BO</span>
            <span className="hero-mi inline-block will-change-transform">MI.</span>
          </Display>

          <div className="hero-chrome">
            <Label className="absolute top-[calc(var(--nav-h)+14px)] left-[var(--pad)] text-ink-2">
              KIM BOMI · FRONTEND
            </Label>
            <Label className="absolute top-[calc(var(--nav-h)+14px)] right-[var(--pad)] text-ink-2">
              2026
            </Label>
            <Label className="absolute bottom-[var(--pad)] left-[var(--pad)] text-ink-2">
              KROFFLE
            </Label>
            <Label className="absolute right-[var(--pad)] bottom-[var(--pad)] text-ink-2">
              SEOUL
            </Label>
            <Label className="absolute bottom-[var(--pad)] left-1/2 -translate-x-1/2 animate-hint-bob text-ink-2 motion-reduce:animate-none">
              Scroll
            </Label>
          </div>
        </div>
      )}
    </section>
  )
}
