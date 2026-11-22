export const SKILLS_URL = 'https://github.com/Kbomi16/ai-skills'

export type ProtocolStep = {
  no: string
  title: string
  kr: string
  shot: string
  alt: string
  fit: 'cover' | 'contain'
}

/** 노션 포폴 v3 「AI 옆에서도, 이렇게 만들어요.」 — 올해 들어 새로 생긴 생각 */
export const PROTOCOL: ProtocolStep[] = [
  {
    no: '01',
    title: '문제 정리를 먼저 해요.',
    kr: 'AI 도구를 다루는 일보다, 지금 푸는 문제가 누구의 어떤 불편인지를 먼저 적어요. 그다음에 도구를 고르고 작업을 나눠요.',
    shot: '/images/pilot/04-flow.png',
    alt: 'Alleo에서 사이트 분석이 끝나야 글을 만들고 블로그와 SNS로 이어지는 화면 흐름.',
    fit: 'contain',
  },
  {
    no: '02',
    title: '맡길 일과 직접 판단할 일을 나눠요.',
    kr: 'Cursor 에이전트와 PLAN / BUILD / CHECK 역할의 서브에이전트를 쓰되, 기존 코드 규칙과 스킬을 먼저 전달해요. 권한, 검색 설정, 문의 연결처럼 서비스에 바로 영향을 주는 결과는 가설로 보고 제가 확인해요.',
    shot: '/images/pilot/03-session.png',
    alt: '기획 PLAN, 구현 BUILD, 검수 CHECK를 한 세션에 한 가지씩 나눈 순서.',
    fit: 'contain',
  },
  {
    no: '03',
    title: '작업 공간을 나눠 맥락이 섞이지 않게 해요.',
    kr: '기업·브랜드 웹과 Alleo처럼 앱이 여러 개일 때는 git worktree로 사이트·앱별 공간을 나눠, 한 번에 하나의 문제에 집중해요.',
    shot: '/images/pilot/02-worktrees.png',
    alt: '기업·브랜드 웹을 사이트마다 폴더와 Cursor 창으로 나눈 git worktree.',
    fit: 'contain',
  },
  {
    no: '04',
    title: '반복되는 기준은 다시 꺼내 쓸 수 있게 남겨요.',
    kr: 'FE-STYLE, seo-audit, 깃 요약 같은 규칙을 스킬 파일로 고정하고, 채용 공고·메일·AI 뉴스처럼 반복되는 확인은 역할별 봇과 루틴으로 정리된 결과만 보고 판단해요.',
    shot: '/images/pilot/01-rules-first.png',
    alt: 'GitHub에 올려 둔 FE-STYLE 스킬 파일. 시키기 전에 넘기는 규칙이다.',
    fit: 'contain',
  },
]

/** 노션 포폴 v3 — 원래부터 갖고 있던 생각 */
export const ORIGINAL_THOUGHTS: { title: string; body: string; link?: { label: string; url: string } }[] = [
  {
    title: '잘 모르는 건 먼저 적고, 다시 공부해요.',
    body: '모르는 내용을 그냥 넘기지 않고 기록해 두었다가, 비슷한 문제를 다시 만났을 때 꺼내 써요.',
  },
  {
    title: '왜 그렇게 만들었는지 남겨요.',
    body: '해결한 과정과 이유를 블로그에 꾸준히 적어 왔어요. 한 번 해결한 문제를 다시 찾아볼 수 있게 만드는 습관이, 지금 문제와 범위를 나누고 AI에게 맥락을 설명할 때도 도움이 되고 있어요.',
    link: { label: '블로그', url: 'https://bori-note.tistory.com/' },
  },
  {
    title: '기능보다 쓰는 사람의 흐름을 먼저 봐요.',
    body: '관리 화면에서는 누가 어떤 권한으로 무엇을 볼 수 있는지를, 브랜드 웹에서는 방문자가 어디서 문의로 이어지는지를 기준으로 화면을 구성했어요.',
  },
]

export type SkillGroup = { name: string; items: string[] }

/** 노션 포폴 v3 Skills */
export const SKILLS_FAMILIAR: SkillGroup[] = [
  { name: 'Frontend', items: ['TypeScript', 'React', 'Next.js (Pages / App Router)', 'TanStack Query', 'Axios', 'Custom Hook'] },
  { name: 'UI · Styling', items: ['Tailwind CSS', 'shadcn/ui', 'Ant Design', 'Styled Components'] },
  { name: 'Web · SEO', items: ['next-intl', 'Metadata API', 'JSON-LD', 'Sitemap', 'Open Graph'] },
  { name: 'Collaboration', items: ['Jira', 'Notion', '스크럼 협업'] },
]

export const SKILLS_TRIED: SkillGroup[] = [
  { name: 'Animation · 3D', items: ['GSAP', 'Motion', 'Lenis', 'Lottie', 'Three.js', 'React Three Fiber'] },
  {
    name: 'External · Data',
    items: [
      'AWS',
      'Cloudflare',
      'Cloudflare D1',
      'Cloudflare R2',
      'Cloudflare Access',
      'Supabase',
      'MySQL',
      'Solapi',
      'zod',
      'TanStack Table',
    ],
  },
]

export const AI_TOOLS: { name: string; note: string }[] = [
  { name: 'Cursor', note: '코딩 agent / IDE' },
  { name: 'Claude', note: '어려운 설계나 GSAP 인터랙션을 다룰 때 사용' },
  { name: 'Adobe Firefly', note: 'AI 영상을 만들 때 사용' },
  { name: 'git worktree', note: '기업 웹·멀티 앱을 사이트·앱마다 따로 열어 병렬로 작업' },
  { name: '서브에이전트', note: 'PLAN / BUILD / CHECK처럼 역할을 나눠 사용' },
  { name: '스킬 파일', note: 'FE-STYLE, seo-audit, 깃 요약처럼 반복 규칙을 파일로 고정.' },
  {
    name: 'Grok Bot',
    note: '역할별 봇과 반복 루틴으로 AI 최신 뉴스·SEO 검사·GitHub 변경 사항 확인을 자동화하고, 정리된 결과를 보고 판단',
  },
]
