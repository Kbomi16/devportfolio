import { useRef, useState } from 'react'
import Display from '../components/common/Display'
import FlipLightbox from '../components/common/FlipLightbox'
import Hairline from '../components/common/Hairline'
import Label from '../components/common/Label'
import Pill from '../components/common/Pill'
import { PROTOCOL, SKILLS_URL, type ProtocolStep } from '../content/workflow'
import { cn } from '../lib/cn'
import { ground } from '../lib/ground'
import { gsap, useGSAP } from '../lib/gsapSetup'
import { matchMediaPreset } from '../lib/media'
import { outboundLinkProps } from '../lib/outboundLink'
import SceneSlot from '../scene/SceneSlot'

type OpenShot = { index: number; origin: HTMLImageElement }

/** CH4.5 — AI 워크플로. 핀 + 스크럽으로 카드가 아래에서 올라오고, 이전 카드는 줄어들며 어두워진다. */
export default function Pilot() {
  const [openShot, setOpenShot] = useState<OpenShot | null>(null)

  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = matchMediaPreset(({ motion, mobile }) => {
        if (!motion) return

        const stack = sectionRef.current?.querySelector<HTMLElement>('[data-stack]')
        const lines = gsap.utils.toArray<HTMLElement>('[data-line]')
        const travel = stack?.offsetHeight ?? 360

        gsap.set(lines, { y: travel })
        gsap.set('[data-outro]', { autoAlpha: 0, y: 16 })

        const tl = gsap.timeline({
          defaults: { ease: 'power2.out' },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: mobile ? '+=220%' : '+=320%',
            pin: true,
            scrub: 0.5,
            anticipatePin: 1,
          },
        })

        tl.from('[data-head]', { y: 48, opacity: 0, duration: 0.7 })
        lines.forEach((line, i) => {
          tl.set(line, { zIndex: i + 1 }, '+=0.2')
          tl.to(line, { y: 0, duration: 0.55 }, '<')
          lines.slice(0, i).forEach((prev, j) => {
            const depth = i - j
            tl.to(
              prev,
              {
                y: -(depth * 14),
                scale: Math.max(0.84, 1 - depth * 0.08),
                transformOrigin: '50% 0%',
                duration: 0.55,
              },
              '<',
            )
            const dim = prev.querySelector('[data-dim]')
            if (dim) tl.to(dim, { opacity: Math.min(depth * 0.3, 0.6), duration: 0.55 }, '<')
          })
        })
        tl.to('[data-outro]', { autoAlpha: 1, y: 0, duration: 0.5 }, '+=0.2')
        tl.to({}, { duration: 0.4 })
      })
      return () => mm.revert()
    },
    { scope: sectionRef },
  )

  const handleOpen = (index: number, origin: HTMLImageElement) => {
    setOpenShot({ index, origin })
  }

  const handleClose = () => {
    setOpenShot(null)
  }

  const openStep = openShot ? PROTOCOL[openShot.index] : null

  return (
    <section
      ref={sectionRef}
      className={cn(
        ground.dark,
        'relative flex h-screen flex-col overflow-hidden px-[var(--pad)] pt-[calc(var(--nav-h)+12px)] pb-8',
        'motion-reduce:h-auto motion-reduce:overflow-visible motion-reduce:py-[16vh]',
      )}
      id="pilot"
    >
      <SceneSlot
        object={{ kind: 'cursor' }}
        fallbackSrc="/images/3d/workflow-cursor.webp"
        className="absolute top-[12vh] right-[var(--pad)] size-[clamp(96px,10vw,160px)] max-md:size-[72px]"
      />
      <div className="mx-auto flex min-h-0 w-full max-w-[1200px] flex-1 flex-col gap-3">
        <div data-head className="w-full">
          <Label className="text-muted">AI WORKFLOW · CURSOR</Label>
          <h2 className="mt-3 font-kr text-[clamp(26px,3.2vw,48px)] leading-[1.15] font-extrabold tracking-[-0.02em]">
            잘 아는 쪽이
            <br />
            파일럿이어야 합니다.
          </h2>
          <p className="mt-3 max-w-[46ch] text-[15px] leading-[1.7] text-ink-2">
            Cursor로 코드를 많이 맡기지만, AI가 빨라졌다고 공부를 빼지 않습니다. 제가 그 일을 알고
            있어야 나온 코드가 맞는지 볼 수 있습니다.
          </p>
        </div>

        <div
          data-stack
          className="relative min-h-[clamp(300px,44vh,440px)] flex-1 overflow-hidden pt-2"
        >
          <ol className="relative h-full min-h-[inherit] list-none motion-reduce:h-auto">
            {PROTOCOL.map((step, index) => (
              <ProtocolCard key={step.no} step={step} index={index} onOpen={handleOpen} />
            ))}
          </ol>
        </div>

        <div data-outro className="flex shrink-0 flex-wrap items-center gap-4">
          <Pill href={SKILLS_URL} target="_blank" {...outboundLinkProps(SKILLS_URL)}>
            반복 규칙은 스킬 파일로 → GitHub
          </Pill>
          <Label className="text-muted max-md:hidden">FE-STYLE · SEO-AUDIT · GIT SUMMARY</Label>
        </div>
      </div>
      {openShot && openStep ? (
        <FlipLightbox
          src={openStep.shot}
          alt={openStep.alt}
          origin={openShot.origin}
          onClose={handleClose}
        />
      ) : null}
    </section>
  )
}

function ProtocolCard({
  step,
  index,
  onOpen,
}: {
  step: ProtocolStep
  index: number
  onOpen: (index: number, origin: HTMLImageElement) => void
}) {
  const imageRef = useRef<HTMLImageElement>(null)

  const handleOpen = () => {
    if (imageRef.current) onOpen(index, imageRef.current)
  }

  return (
    <Hairline
      as="li"
      data-line
      style={{ zIndex: index + 1 }}
      className="absolute inset-0 flex w-full flex-col gap-4 border border-hairline bg-dark-ground p-5 motion-reduce:static motion-reduce:inset-auto lg:grid lg:grid-cols-[minmax(300px,1fr)_minmax(220px,0.92fr)] lg:items-stretch lg:gap-5 lg:p-0"
    >
      <span
        data-dim
        className="pointer-events-none absolute inset-0 z-[1] bg-black opacity-0"
        aria-hidden
      />
      <div className="min-w-0 lg:flex lg:flex-col lg:justify-center lg:py-7 lg:pr-4 lg:pl-6">
        <div className="flex flex-nowrap items-baseline gap-x-3">
          <Label className="shrink-0 text-muted">{step.no}</Label>
          <Display className="shrink-0 text-[clamp(16px,1.6vw,22px)] lg:whitespace-nowrap">
            {step.en}
          </Display>
        </div>
        <p className="mt-2 max-w-[42ch] font-kr whitespace-pre-line text-[clamp(13px,1.2vw,15px)] leading-[1.65] text-ink-2 lg:max-w-none">
          {step.kr}
        </p>
      </div>
      <button
        type="button"
        data-cursor="view"
        aria-label={`${step.en} 이미지 크게 보기`}
        className="flex min-h-[140px] min-w-0 items-center justify-center border-hairline bg-black/40 p-3 max-lg:max-h-[28vh] lg:h-full lg:border-l lg:p-4"
        onClick={handleOpen}
      >
        <img
          ref={imageRef}
          src={step.shot}
          alt={step.alt}
          className="pointer-events-none max-h-full max-w-full object-contain"
          loading="lazy"
          decoding="async"
        />
      </button>
    </Hairline>
  )
}
