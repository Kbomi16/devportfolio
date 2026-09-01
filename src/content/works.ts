export type WorkItem = {
  slug: 'tcc' | 'sites' | 'alleo'
  /** 갤러리 라벨 (홈 CH3) */
  label: string
  title: string
  period: string
  oneLiner: string
  /** 홈 라벨 밑줄 — 결과 숫자 한 줄 */
  homeLine: string
  stack: string[]
  problem: string
  choice: string
  result: string
  learned: string
  links: { label: string; url: string }[]
}

export const WORKS: WorkItem[] = [
  {
    slug: 'tcc',
    label: 'TCC',
    title: 'TCC — 중대재해 관리 백오피스',
    period: '2025.05 — 2026.03',
    oneLiner: '권한을 버튼 숨기기로 끝내지 않고, 메뉴·기능 권한·조직 선택을 공통 구조로 묶었습니다.',
    homeLine: '권한 훅 ~90개 파일 · 조직 모달 ~50개 화면',
    stack: ['Next.js', 'TypeScript', 'React Query', 'Ant Design'],
    problem:
      'URL을 직접 치면 버튼이 없어도 화면이 열렸습니다. 메뉴를 프론트 코드에 고정하면 항목 하나만 바꿔도 배포가 필요했고, 화면마다 권한 if를 짜다 보니 같은 실수가 반복됐습니다.',
    choice:
      '서버 menuTree로 사이드바를 그리고, 경로에 맞는 menuId로 접근 권한을 한 번 더 확인했습니다. 수정·승인 같은 기능 권한은 커스텀 훅으로 표준화해 화면에서는 권한 코드만 넘기게 했고, 조직·사용자 선택은 선택 정책을 props로 받는 공통 모달 하나로 모았습니다.',
    result: '권한 훅 약 90개 파일, 조직 선택 모달 약 50개 화면에서 재사용.',
    learned:
      '관리자 화면에서 진짜 비싼 건 페이지를 하나 더 만드는 시간이 아니라, 정책이 바뀔 때마다 코드를 헤집는 시간이었습니다. 관리자 FE의 핵심이 CRUD가 아니라 운영 변경 비용을 낮추는 설계임을 배웠습니다.',
    links: [
      {
        label: '케이스 노트 (Notion)',
        url: 'https://volcano-fisherman-e31.notion.site/31a3307fa7e6803bb1b3e52b52d4d3bd',
      },
    ],
  },
  {
    slug: 'sites',
    label: 'SITES',
    title: 'SITES — 기업·브랜드 웹 4종',
    period: '2026.01 — 2026.07',
    oneLiner:
      '공개 웹에서는 권한이 아니라 검색 노출과 문의 전환이 우선입니다. 목적이 다르면 집착하는 지점이 달라집니다.',
    homeLine: '크로플 · 감탄누수 · 요셉씨의 빛자루 · 고야차트',
    stack: ['Next.js 16', 'React 19', 'TypeScript', 'Tailwind CSS 4', 'shadcn/ui', 'Solapi', 'GSAP'],
    problem:
      '크로플·감탄누수·요셉씨의 빛자루·고야차트 — 네 사이트 모두 "완성된 웹"이 아니라, 검색에 노출되고 문의로 이어지는 웹이 필요했습니다.',
    choice:
      'next-intl로 언어별 URL과 메타데이터를 맞추고 Sitemap·JSON-LD·hreflang까지 챙겼습니다. 문의가 화면에서 끝나지 않게 Solapi로 담당자 알림과 신청자 확인 문자를 붙였고, 애니메이션은 욕심내지 않고 히어로와 핵심 메시지에만 남겼습니다.',
    result: '크로플 4개 locale 다국어 SEO, 3개 사이트에 Solapi 문의 알림 연결.',
    learned:
      '같은 Next.js인데도 제품 목적이 다르면 집착해야 하는 지점이 달라진다는 걸, 백오피스와 공개 웹을 오가며 몸으로 익혔습니다.',
    links: [
      { label: '크로플', url: 'https://www.kroffle.com/kr' },
      { label: '감탄누수', url: 'https://gamtannusu.com' },
      { label: '요셉씨의 빛자루', url: 'https://joecbroom-web.pages.dev/' },
      { label: '고야차트', url: 'https://exproject.work' },
    ],
  },
  {
    slug: 'alleo',
    label: 'ALLEO',
    title: 'ALLEO — AI 검색 최적화 · 콘텐츠 자동화 SaaS',
    period: '2026.04 —',
    oneLiner:
      '소개 웹·공개 블로그·관리자·콘솔로 나뉜 멀티 앱에서, 분석→글→발행→SNS가 한 흐름으로 이어지게 프론트를 붙였습니다.',
    homeLine: 'intro · blog · admin · console — worktree · 서브에이전트',
    stack: [
      'Next.js 16',
      'React 19',
      'TanStack Query',
      'Zustand',
      'BFF (Route Handler)',
      'OpenNext + Cloudflare Workers',
    ],
    problem:
      '멀티 앱을 한 브랜치에서 고치면 소개 웹 작업이 콘솔과 섞였고, 에이전트에 규칙 없이 시키면 파일 위치와 마크업을 같은 이유로 여러 번 고쳤습니다.',
    choice:
      '앱·기능마다 브랜치를 나누고 git worktree로 체크아웃을 겹치지 않게 띄웠습니다. Cursor 세션은 한 가지 일만 맡기고, 기획(PLAN)·구현(BUILD)·검수(CHECK)로 서브에이전트의 역할을 나눴습니다.',
    result: 'intro / blog / admin / console 4개 앱 — 사이트 분석 · SNS OAuth · 공개 웹 SEO · 콘솔 UI 담당.',
    learned:
      '에이전트에게 일을 시키기 전에 규칙과 레거시를 먼저 넘기는 편이 됐습니다. 스킬과 워크트리를 남겨 두면 다음 브랜치에서 같은 실수를 반복하지 않습니다.',
    links: [
      { label: 'alleo.pro', url: 'https://alleo.pro' },
      {
        label: '케이스 노트 (Notion)',
        url: 'https://volcano-fisherman-e31.notion.site/Alleo-AI-SaaS-39e3307fa7e680628ef3f87e6e520d7d',
      },
    ],
  },
]

export const workBySlug = (slug: string | undefined): WorkItem | undefined =>
  WORKS.find((w) => w.slug === slug)
