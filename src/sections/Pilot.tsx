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

const PROTOCOL = [
  {
    no: '01',
    en: 'RULES FIRST',
    kr: '시키기 전에 쓰는 스킬 파일과 지금 구조를 먼저 넘깁니다.\n규칙 없이 맡기면 파일 위치부터 같은 이유로 여러 번 고치게 됩니다.',
  },
  {
    no: '02',
    en: 'SPLIT WORKTREES',
    kr: '사이트가 여러 개면 git worktree로 작업 폴더부터 나눕니다.\n소개 웹과 콘솔을 한 창에서 고치면 문구와 기능이 섞입니다.',
  },
  {
    no: '03',
    en: 'ONE SESSION, ONE JOB',
    kr: '기획 → 구현 → 검수. 한 세션에는 한 가지만 맡깁니다.\n한꺼번에 시키면 어디까지가 맞는지 볼 수 없습니다.',
  },
  {
    no: '04',
    en: 'FLOW BEFORE PROMPT',
    kr: '기능을 들으면 상태·화면·API 흐름을 먼저 그려 보고,\n그다음 맡깁니다.',
  },
  {
    no: '05',
    en: 'VERIFY & WRITE',
    kr: 'AI 속도에 맞춰 일하되, 나온 결과 확인과 기록은 제 몫으로 남깁니다.\n그래서 같은 수정을 반복하지 않습니다.',
  },
]

/** CH4.5 — AI 워크플로. 핀 + 스크럽으로 프로토콜이 한 줄씩 점등되고, 지난 줄은 흐려진다. */
export default function Pilot() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    (context) => {
      if (prefersReducedMotion()) return

      const head = context.selector?.('[data-head]')?.[0] as HTMLElement | undefined
      const lines = (context.selector?.('[data-line]') ?? []) as HTMLElement[]
      const outro = context.selector?.('[data-outro]')?.[0] as HTMLElement | undefined

      gsap.set(lines, { autoAlpha: 0, y: 30 })
      if (outro) gsap.set(outro, { autoAlpha: 0, y: 20 })

      const tl = gsap.timeline({
        defaults: { ease: 'power2.out' },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=260%',
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
        },
      })

      if (head) tl.from(head, { y: 48, opacity: 0, duration: 0.7 })
      lines.forEach((line, i) => {
        tl.to(line, { autoAlpha: 1, y: 0, duration: 0.5 }, '+=0.2')
        if (i > 0) tl.to(lines[i - 1], { opacity: 0.38, duration: 0.5 }, '<')
      })
      if (outro) tl.to(outro, { autoAlpha: 1, y: 0, duration: 0.5 }, '+=0.2')
      tl.to({}, { duration: 0.5 })
    },
    { scope: sectionRef },
  )

  return (
    <section
      ref={sectionRef}
      className={cn(
        ground.dark,
        'relative flex h-screen flex-col justify-center gap-[4vh] overflow-hidden px-[var(--pad)]',
        'motion-reduce:h-auto motion-reduce:overflow-visible motion-reduce:py-[16vh]',
      )}
      id="pilot"
    >
      <div data-head className="mx-auto w-full max-w-[1100px]">
        <Label className="text-muted">AI WORKFLOW · CURSOR</Label>
        <Display
          as="h2"
          className="mt-[14px] font-kr text-[clamp(26px,3.6vw,56px)] leading-[1.15] font-extrabold tracking-[-0.02em]"
        >
          잘 아는 쪽이
          <br />
          파일럿이어야 합니다.
        </Display>
        <p className="mt-4 max-w-[46ch] font-ui text-[clamp(13px,1.2vw,15px)] leading-[1.7] text-ink-2">
          Cursor에 코드를 많이 맡기지만,
          <br />
          AI가 빨라졌다고 공부를 빼지 않습니다.
          <br />
          제가 그 일을 알고 있어야 나온 코드가 맞는지 볼 수 있습니다.
        </p>
      </div>

      <ol className="mx-auto w-full max-w-[1100px] list-none">
        {PROTOCOL.map((step) => (
          <Hairline
            as="li"
            key={step.no}
            data-line
            className="grid grid-cols-[64px_230px_1fr] items-baseline gap-[18px] py-[14px] max-md:grid-cols-[48px_1fr] max-md:gap-x-3"
          >
            <Label className="text-muted">{step.no}</Label>
            <Display className="text-[clamp(13px,1.3vw,17px)]">{step.en}</Display>
            <p className="font-kr whitespace-pre-line text-[clamp(13px,1.3vw,16px)] leading-[1.65] text-ink-2 max-md:col-start-2">
              {step.kr}
            </p>
          </Hairline>
        ))}
      </ol>

      <div data-outro className="mx-auto flex w-full max-w-[1100px] items-center gap-4">
        <Pill href={SKILLS_URL} target="_blank" rel="noreferrer">
          반복 규칙은 스킬 파일로 → GitHub
        </Pill>
        <Label className="text-muted max-md:hidden">FE-STYLE · SEO-AUDIT · GIT SUMMARY</Label>
      </div>
    </section>
  )
}
