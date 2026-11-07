export const SKILLS_URL = 'https://github.com/Kbomi16/ai-skills'

export type ProtocolStep = {
  no: string
  en: string
  kr: string
  shot: string
  alt: string
  fit: 'cover' | 'contain'
}

export const PROTOCOL: ProtocolStep[] = [
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
