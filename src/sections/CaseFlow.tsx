import Label from '../components/common/Label'
import type { FlowBox, FlowChoice, WorkFlow } from '../content/works'

export default function CaseFlow({ flow }: { flow: WorkFlow }) {
  return (
    <figure>
      <Label className="text-muted">{flow.title}</Label>
      <div className="mt-6">
        {flow.variant === 'isle' ? (
          <IsleChatFlow />
        ) : flow.variant === 'alleoArch' ? (
          <AlleoArchFlow />
        ) : (
          <PathFlow steps={flow.steps} />
        )}
      </div>
      <figcaption className="mx-auto mt-6 max-w-[62ch] text-[15px] leading-[1.7] text-ink-2">
        {flow.summary}
      </figcaption>
      {flow.variant === 'path' && flow.aside ? (
        <p className="mx-auto mt-3 max-w-[62ch] text-[14px] leading-[1.7] font-medium">{flow.aside}</p>
      ) : null}
    </figure>
  )
}

function PathFlow({ steps }: { steps: Array<FlowBox | FlowChoice> }) {
  return (
    <div className="flex flex-col items-center">
      {steps.map((step, index) => (
        <div key={index} className="flex w-full flex-col items-center">
          {index > 0 ? <DownArrow /> : null}
          {step.kind === 'box' ? <FlowCard text={step.text} hint={step.hint} /> : <ChoiceView step={step} />}
        </div>
      ))}
    </div>
  )
}

function ChoiceView({ step }: { step: FlowChoice }) {
  return (
    <div className="flex w-full max-w-[520px] flex-col items-center">
      <Diamond text={step.question} />
      <div className="mt-1 grid w-full grid-cols-2 gap-3">
        <div className="flex flex-col items-center">
          <BranchLabel>{step.noLabel}</BranchLabel>
          <DownArrow />
          <FlowCard text={step.no.text} hint={step.no.hint} />
        </div>
        <div className="flex flex-col items-center">
          <BranchLabel>{step.yesLabel}</BranchLabel>
          <DownArrow />
          {step.yes.map((box, index) => (
            <div key={`${box.text}-${index}`} className="flex w-full flex-col items-center">
              {index > 0 ? <DownArrow /> : null}
              <FlowCard text={box.text} hint={box.hint} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

type ArchApp = {
  id: string
  title: string
  desc: string
  linkLabel: string
}

const ALLEO_APPS: ArchApp[] = [
  {
    id: 'intro',
    title: 'aleo-intro-web',
    desc: '서비스 소개 · 가이드 · 콘텐츠 마케팅',
    linkLabel: '콘솔 유입 · 결제 CTA',
  },
  {
    id: 'blog',
    title: 'aleo-blog-web',
    desc: '고객 공개 블로그 · 커스텀 도메인',
    linkLabel: '/blog API · 분석 수집',
  },
  {
    id: 'console',
    title: 'aleo-console-web',
    desc: '분석 · AI 추천 추적 · 블로그 · SNS',
    linkLabel: '/console API',
  },
  {
    id: 'admin',
    title: 'aleo-admin-web',
    desc: '사용자 · 워크스페이스 · 결제 · 고객센터',
    linkLabel: '/admin API',
  },
]

const ALLEO_INFRA = [
  { title: 'Cloudflare D1 / R2', desc: '데이터 · 파일' },
  { title: 'Firebase Functions / Cloud Tasks', desc: '장시간 AI 작업' },
  { title: '외부 연동', desc: 'Anthropic · SNS · Toss' },
]

function AlleoArchFlow() {
  const [intro, blog, consoleApp, admin] = ALLEO_APPS

  return (
    <div className="mx-auto w-full max-w-[720px]">
      <div className="relative hidden min-h-[480px] md:block">
        <AlleoArchLines />
        <div className="absolute left-0 top-0 w-[46%]">
          <ArchAppBox app={intro} />
          <p className="mt-2 text-center text-[10px] leading-snug text-muted">{intro.linkLabel}</p>
        </div>
        <div className="absolute right-0 top-0 w-[46%]">
          <ArchAppBox app={consoleApp} />
          <p className="mt-2 text-center text-[10px] leading-snug text-muted">{consoleApp.linkLabel}</p>
        </div>
        <div className="absolute left-0 top-[48%] w-[46%]">
          <ArchAppBox app={blog} />
          <p className="mt-2 text-center text-[10px] leading-snug text-muted">{blog.linkLabel}</p>
        </div>
        <div className="absolute right-0 top-[48%] w-[46%]">
          <ArchAppBox app={admin} />
          <p className="mt-2 text-center text-[10px] leading-snug text-muted">{admin.linkLabel}</p>
        </div>
        <div className="absolute left-1/2 top-[26%] w-[min(100%,280px)] -translate-x-1/2">
          <ArchServerBox />
        </div>
        <div className="absolute inset-x-0 bottom-0 grid grid-cols-3 gap-2">
          {ALLEO_INFRA.map((item) => (
            <ArchInfraBox key={item.title} title={item.title} desc={item.desc} />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4 md:hidden">
        <div className="grid grid-cols-2 gap-3">
          {ALLEO_APPS.map((app) => (
            <div key={app.id}>
              <ArchAppBox app={app} />
              <p className="mt-1.5 text-[10px] leading-snug text-muted">{app.linkLabel}</p>
            </div>
          ))}
        </div>
        <DownArrow />
        <ArchServerBox />
        <DownArrow />
        <div className="grid gap-2">
          {ALLEO_INFRA.map((item) => (
            <ArchInfraBox key={item.title} title={item.title} desc={item.desc} />
          ))}
        </div>
      </div>

      <p className="mt-6 text-center font-ui text-[11px] font-medium tracking-[0.08em] text-ink-2">
        Next.js 프론트엔드 4개 + 통합 API 서버 1개
      </p>
    </div>
  )
}

function AlleoArchLines() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 size-full text-muted"
      viewBox="0 0 720 480"
      preserveAspectRatio="none"
    >
      <defs>
        <marker id="alleo-arch-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill="currentColor" />
        </marker>
      </defs>
      <g fill="none" stroke="currentColor" strokeWidth="1.2" markerEnd="url(#alleo-arch-arrow)">
        <path d="M160 72 L320 168" />
        <path d="M560 72 L400 168" />
        <path d="M160 320 L320 228" />
        <path d="M560 320 L400 228" />
        <path d="M360 268 L360 340" />
        <path d="M360 340 L160 400" />
        <path d="M360 340 L360 400" />
        <path d="M360 340 L560 400" />
      </g>
    </svg>
  )
}

function ArchAppBox({ app }: { app: ArchApp }) {
  return (
    <div className="rounded-lg border border-hairline bg-white px-3 py-2.5">
      <p className="font-ui text-[11px] font-semibold tracking-[0.04em]">{app.title}</p>
      <p className="mt-1 text-[11px] leading-snug text-ink-2">{app.desc}</p>
    </div>
  )
}

function ArchServerBox() {
  return (
    <div className="rounded-xl border-2 border-light-ink/20 bg-white px-4 py-3 text-center shadow-[inset_0_0_0_1px_rgba(10,10,11,0.04)]">
      <p className="font-ui text-[12px] font-semibold tracking-[0.06em]">aleo-server</p>
      <p className="mt-1 text-[11px] leading-snug text-ink-2">NestJS API · Cloudflare Workers</p>
    </div>
  )
}

function ArchInfraBox({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-lg border border-hairline bg-white px-2.5 py-2 text-center">
      <p className="text-[10px] font-semibold leading-snug">{title}</p>
      <p className="mt-0.5 text-[10px] leading-snug text-muted">{desc}</p>
    </div>
  )
}

function IsleChatFlow() {
  return (
    <div className="mx-auto flex w-full max-w-[760px] flex-col items-center">
      <FlowCard text="채팅 전송" hint="ChatPanel · Enter 또는 보내기" />
      <DownArrow />
      <FlowCard text="문장 정리" hint="normalizeChat" />
      <p className="mt-5 mb-3 text-[12px] text-muted">동시에</p>
      <div className="grid w-full grid-cols-1 items-start gap-4 sm:grid-cols-3">
        <div className="flex flex-col items-center">
          <FlowCard text="내 말풍선" hint="BUBBLE_MS" />
        </div>
        <div className="flex flex-col items-center">
          <FlowCard text="대화 로그에 한 줄" hint="chatLog" />
        </div>
        <div className="flex flex-col items-center">
          <Diamond text={'범위 안\n가장 가까운 주민?'} />
        </div>
      </div>

      <div className="mt-1 grid w-full grid-cols-1 sm:grid-cols-3">
        <div className="hidden sm:block" />
        <div className="grid grid-cols-2 gap-3 sm:col-span-2">
          <div className="flex flex-col items-center">
            <BranchLabel>없음</BranchLabel>
            <DownArrow />
            <FlowCard text="로그만 남김" hint="NPC는 답하지 않음" />
          </div>
          <div className="flex flex-col items-center">
            <BranchLabel>있음</BranchLabel>
            <DownArrow />
            <FlowCard text="잠시 기다린 뒤" hint="DUMMY_REPLY_MS" />
          </div>
        </div>
      </div>

      <div className="mt-4 grid w-full grid-cols-1 sm:grid-cols-3">
        <div className="hidden sm:block" />
        <div className="flex flex-col items-center sm:col-span-2">
          <p className="text-[12px] text-muted">있을 때만 이어서 확인</p>
          <DownArrow />
          <Diamond text={'아직\n가까이 있나?'} />
        </div>
      </div>
      <div className="mt-1 grid w-full grid-cols-1 sm:grid-cols-3">
        <div className="hidden sm:block" />
        <div className="grid grid-cols-2 gap-3 sm:col-span-2">
          <div className="flex flex-col items-center">
            <BranchLabel>예</BranchLabel>
            <DownArrow />
            <FlowCard text="NPC 말풍선" hint="로그에 답 저장" />
          </div>
          <div className="flex flex-col items-center">
            <BranchLabel>아니오</BranchLabel>
            <DownArrow />
            <FlowCard text="답장 생략" />
          </div>
        </div>
      </div>
    </div>
  )
}

function FlowCard({ text, hint }: { text: string; hint?: string }) {
  return (
    <div className="w-full max-w-[220px] rounded-md border border-hairline bg-white px-3 py-2.5 text-center">
      <p className="text-[13px] leading-snug font-medium whitespace-pre-line">{text}</p>
      {hint ? <p className="mt-1 text-[11px] leading-snug text-muted">{hint}</p> : null}
    </div>
  )
}

function Diamond({ text }: { text: string }) {
  return (
    <div className="relative grid size-[132px] shrink-0 place-items-center sm:size-[148px]">
      <div className="absolute size-[92px] rotate-45 rounded-sm border border-hairline bg-white sm:size-[104px]" />
      <p className="relative z-[1] max-w-[84px] text-center text-[12px] leading-snug font-medium whitespace-pre-line sm:max-w-[96px]">
        {text}
      </p>
    </div>
  )
}

function BranchLabel({ children }: { children: string }) {
  return <p className="text-[12px] font-medium text-ink-2">{children}</p>
}

function DownArrow() {
  return (
    <div aria-hidden className="flex flex-col items-center py-0.5">
      <span className="h-3.5 w-px bg-muted" />
      <span className="size-0 border-x-[4px] border-t-[5px] border-x-transparent border-t-muted" />
    </div>
  )
}
