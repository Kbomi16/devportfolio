import { useRef } from 'react'
import Display from '../components/common/Display'
import Hairline from '../components/common/Hairline'
import Label from '../components/common/Label'
import Pill from '../components/common/Pill'
import { cn } from '../lib/cn'
import { ground } from '../lib/ground'
import { gsap, useGSAP } from '../lib/gsapSetup'
import { prefersReducedMotion } from '../lib/motion'

const SKILLS_URL = 'https://github.com/Kbomi16/ai-skills'

type ProtocolStep = {
  no: string
  en: string
  kr: string
  shot: string
  alt: string
  fit: 'cover' | 'contain'
}

const PROTOCOL: ProtocolStep[] = [
  {
    no: '01',
    en: 'RULES FIRST',
    kr: '시키기 전에 쓰는 스킬 파일과 지금 구조를 먼저 넘깁니다.\n규칙 없이 맡기면 파일 위치부터 같은 이유로 여러 번 고치게 됩니다.',
    shot: '/images/pilot/01-rules-first.png',
    alt: 'GitHub에 올려 둔 FE-STYLE 스킬 파일. 시키기 전에 넘기는 규칙이다.',
    fit: 'contain',
  },
  {
    no: '02',
    en: 'SPLIT WORKTREES',
    kr: '사이트가 여러 개면 작업 폴더부터 나눕니다.\n기업·브랜드 웹을 한 창에서 고치면 문구와 기능이 섞여, git worktree로 사이트마다 엽니다.',
    shot: '/images/pilot/02-worktrees.png',
    alt: '기업·브랜드 웹을 사이트마다 폴더와 Cursor 창으로 나눈 git worktree.',
    fit: 'contain',
  },
  {
    no: '03',
    en: 'ONE SESSION, ONE JOB',
    kr: '기획 → 구현 → 검수. 한 세션에는 한 가지만 맡깁니다.\n한꺼번에 시키면 어디까지가 맞는지 볼 수 없습니다.',
    shot: '/images/pilot/03-session.png',
    alt: '기획 PLAN, 구현 BUILD, 검수 CHECK를 한 세션에 한 가지씩 나눈 순서.',
    fit: 'contain',
  },
  {
    no: '04',
    en: 'FLOW BEFORE PROMPT',
    kr: '기능을 들으면 상태·화면·API 흐름을 먼저 그려 보고, 그다음 맡깁니다.\n나온 결과가 맞는지는 제가 보고, 공부한 건 글로 남깁니다.',
    shot: '/images/pilot/04-flow.png',
    alt: 'Alleo에서 사이트 분석이 끝나야 글을 만들고 블로그와 SNS로 이어지는 화면 흐름.',
    fit: 'contain',
  },
  {
    no: '05',
    en: 'VERIFY & WRITE',
    kr: 'AI 속도에 맞춰 만들되, 확인과 기록은 제 몫입니다.\n혼자 작업할 때도 이 루틴이 있어, 같은 수정을 반복하지 않습니다.',
    shot: '/images/pilot/05-write.png',
    alt: '헤맸던 지점을 다시 꺼내 보도록 남긴 개발 블로그, 보리의 FE 개발 노트.',
    fit: 'contain',
  },
]

/** CH4.5 — AI 워크플로. 핀 + 스크럽으로 카드가 아래에서 올라와 이전 카드 위에 쌓인다. */
export default function Pilot() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    (context) => {
      if (prefersReducedMotion()) return

      const head = context.selector?.('[data-head]')?.[0] as HTMLElement | undefined
      const stack = context.selector?.('[data-stack]')?.[0] as HTMLElement | undefined
      const lines = (context.selector?.('[data-line]') ?? []) as HTMLElement[]
      const outro = context.selector?.('[data-outro]')?.[0] as HTMLElement | undefined
      const travel = stack?.offsetHeight ?? 360

      gsap.set(lines, { y: travel })
      if (outro) gsap.set(outro, { autoAlpha: 0, y: 16 })

      const tl = gsap.timeline({
        defaults: { ease: 'power2.out' },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=320%',
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
        },
      })

      if (head) tl.from(head, { y: 48, opacity: 0, duration: 0.7 })
      lines.forEach((line, i) => {
        tl.set(line, { zIndex: i + 1 }, '+=0.2')
        tl.to(line, { y: 0, duration: 0.55 }, '<')
        lines.slice(0, i).forEach((prev, j) => {
          tl.to(prev, { y: -((i - j) * 14), duration: 0.55 }, '<')
        })
      })
      if (outro) tl.to(outro, { autoAlpha: 1, y: 0, duration: 0.5 }, '+=0.2')
      tl.to({}, { duration: 0.4 })
    },
    { scope: sectionRef },
  )

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
              <ProtocolCard key={step.no} step={step} index={index} />
            ))}
          </ol>
        </div>

        <div data-outro className="flex shrink-0 flex-wrap items-center gap-4">
          <Pill href={SKILLS_URL} target="_blank" rel="noreferrer">
            반복 규칙은 스킬 파일로 → GitHub
          </Pill>
          <Label className="text-muted max-md:hidden">FE-STYLE · SEO-AUDIT · GIT SUMMARY</Label>
        </div>
      </div>
    </section>
  )
}

function ProtocolCard({ step, index }: { step: ProtocolStep; index: number }) {
  return (
    <Hairline
      as="li"
      data-line
      style={{ zIndex: index + 1 }}
      className="absolute inset-0 flex w-full flex-col gap-4 border border-hairline bg-dark-ground p-5 motion-reduce:static motion-reduce:inset-auto lg:grid lg:grid-cols-[minmax(300px,1fr)_minmax(220px,0.92fr)] lg:items-stretch lg:gap-5 lg:p-0"
    >
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
      <div className="flex min-h-[140px] min-w-0 items-center justify-center border-hairline bg-black/40 p-3 max-lg:max-h-[28vh] lg:h-full lg:border-l lg:p-4">
        <img
          src={step.shot}
          alt={step.alt}
          className="max-h-full max-w-full object-contain"
          decoding="async"
        />
      </div>
    </Hairline>
  )
}
