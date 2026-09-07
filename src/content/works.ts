export type WorkStat = {
  value: string
  label: string
}

export type WorkEntry = {
  name: string
  note: string
  url?: string
}

export type WorkItem = {
  slug: 'tcc' | 'sites' | 'alleo'
  /** 갤러리 라벨 (홈 CH3) */
  label: string
  /** 갤러리 라벨 위 보조 줄 (선택) */
  labelEyebrow?: string
  title: string
  period: string
  oneLiner: string
  /** 홈 라벨 밑줄 — 결과 숫자 한 줄 */
  homeLine: string
  stack: string[]
  cover: { src: string; alt: string }
  stats?: WorkStat[]
  entries?: WorkEntry[]
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
    oneLiner: '버튼만 숨기면 끝인 줄 알았습니다.\n권한을 메뉴·기능·조직 선택까지 공통 구조로 묶었습니다.',
    homeLine: '권한 훅 ~90개 파일 · 조직 모달 ~50개 화면',
    stack: ['Next.js', 'TypeScript', 'React Query', 'Ant Design'],
    cover: {
      src: '/images/works/work-tcc.jpg',
      alt: '중대재해 관리 백오피스 — 사이드바 메뉴와 점검 테이블이 보이는 관리자 화면',
    },
    stats: [
      { value: '90', label: '권한 훅 재사용 파일' },
      { value: '50', label: '조직 선택 모달 화면' },
      { value: '0', label: '메뉴 변경 시 재배포' },
    ],
    problem:
      'URL을 직접 치면 버튼이 없어도 화면이 열렸습니다. 메뉴를 프론트 코드에 고정하면 항목 하나만 바꿔도 배포가 필요했고, 화면마다 권한 if를 짜다 보니 같은 실수가 반복됐습니다. 조직·사용자 선택도 화면마다 UX가 달랐습니다.',
    choice:
      '서버 menuTree로 사이드바를 그리고, 경로에 맞는 menuId로 접근 권한을 한 번 더 확인했습니다. 수정·승인·다운로드 같은 기능 권한은 useAdminCheckPermissionFuncAccess 훅에 코드만 넘기게 했고, 조직 타입과 선택 규칙은 CommonOrganizationModal props로 모았습니다.',
    result:
      '권한 훅 약 90개 파일, 조직 선택 모달 약 50개 화면에서 재사용. 메뉴 구조는 서버 설정만으로 바뀌어 프론트 재배포가 필요 없어졌습니다.',
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
    labelEyebrow: 'SEO GEO AEO',
    title: 'SITES — 기업·브랜드 웹 5종',
    period: '2026.01 — 2026.08',
    oneLiner:
      '같은 Next.js라도, 검색되는 방식을 설계했습니다.\n권한보다 검색 노출과 문의 전환이 우선입니다.',
    homeLine: '크로플 · 감탄누수 · 요셉씨의 빛자루 · 고야차트 · 탑애드컴퍼니',
    stack: ['Next.js 16', 'React 19', 'TypeScript', 'Tailwind CSS 4', 'shadcn/ui', 'next-intl', 'Solapi', 'GSAP'],
    cover: {
      src: '/images/works/work-sites.jpg',
      alt: '다국어 기업 웹 랜딩 — 언어 전환과 히어로가 보이는 브랜드 사이트',
    },
    entries: [
      {
        name: '크로플',
        note: '4개 국어 URL(/kr · /us · /jp · /cn), Metadata, 커피챗 Solapi',
        url: 'https://www.kroffle.com/kr',
      },
      {
        name: '감탄누수',
        note: '지역 랜딩, JSON-LD, 견적 접수 시 관리자 LMS + 신청자 확인 SMS',
        url: 'https://gamtannusu.com',
      },
      {
        name: '요셉씨의 빛자루',
        note: '견적·파트너십 문의 폼, Solapi 문자 발송',
        url: 'https://joecbroom-web.pages.dev/',
      },
      {
        name: '고야차트',
        note: '상담 문의 폼과 Solapi 문자 발송',
        url: 'https://exproject.work',
      },
      {
        name: '탑애드컴퍼니',
        note: 'SEO · GEO · AEO, JSON-LD, 전화 상담 전환',
        url: 'https://www.toplawyermarketing.com',
      },
    ],
    problem:
      '크로플·감탄누수·요셉씨의 빛자루·고야차트·탑애드컴퍼니 — 다섯 사이트 모두 "완성된 웹"이 아니라, 검색에 노출되고 문의로 이어지는 웹이 필요했습니다. 화면 문구만 번역하면 URL·메타가 어긋나고, 문의는 화면에서 끊기기 쉬웠습니다.',
    choice:
      'next-intl로 언어별 URL과 메타데이터를 한 세트로 맞추고 Sitemap·JSON-LD·hreflang까지 챙겼습니다. 문의가 접수되면 Solapi로 담당자 알림과 신청자 확인 문자를 붙였고, 애니메이션은 히어로와 핵심 메시지에만 남겼습니다.',
    result:
      '크로플 4개 locale 다국어 SEO, 여러 사이트에 Solapi 문의 알림 연결. 검색엔진이 언어 URL 관계를 구분하고, 문의가 담당자에게 실제로 도착하는 흐름을 만들었습니다.',
    learned:
      '같은 Next.js인데도 제품 목적이 다르면 집착해야 하는 지점이 달라진다는 걸, 백오피스와 공개 웹을 오가며 몸으로 익혔습니다.',
    links: [
      { label: '크로플', url: 'https://www.kroffle.com/kr' },
      { label: '감탄누수', url: 'https://gamtannusu.com' },
      { label: '요셉씨의 빛자루', url: 'https://joecbroom-web.pages.dev/' },
      { label: '고야차트', url: 'https://exproject.work' },
      { label: '탑애드컴퍼니', url: 'https://www.toplawyermarketing.com' },
    ],
  },
  {
    slug: 'alleo',
    label: 'ALLEO',
    title: 'ALLEO — AI 검색 최적화 · 콘텐츠 자동화 SaaS',
    period: '2026.04 — 2026.08',
    oneLiner:
      '분석에서 발행까지, 다음 작업이 이어지게 만들었습니다.\n사이트 분석 → 글 생성 → 블로그 발행 → SNS가 한 흐름입니다.',
    homeLine: 'intro · blog · wiki · console',
    stack: [
      'Next.js 16',
      'React 19',
      'TanStack Query',
      'Zustand',
      'BFF (Route Handler)',
      'OpenNext + Cloudflare Workers',
    ],
    cover: {
      src: '/images/works/work-alleo.jpg',
      alt: 'Alleo 콘솔 — 사이트 분석 점수와 콘텐츠 파이프라인이 보이는 SaaS 화면',
    },
    entries: [
      { name: 'intro', note: '소개 웹 · 다국어', url: 'https://alleo.pro' },
      { name: 'blog', note: '사용자 커스텀 블로그', url: 'https://alleo.blog' },
      { name: 'wiki', note: '도움말 문서', url: 'https://alleo.wiki' },
      { name: 'console', note: '분석 · SNS OAuth', url: 'https://console.alleo.pro' },
    ],
    problem:
      '분석 리포트가 없는데도 다음 단계로 넘어가면 흐름이 끊겼습니다. 멀티 앱을 한 브랜치에서 고치면 소개 웹 작업이 콘솔과 섞였고, 같은 요청에서 getMe를 여러 번 부르며 개발 서버가 바빠졌습니다.',
    choice:
      '분석 리포트가 있어야만 추적 화면으로 가게 단계 의존을 고정했습니다. SNS OAuth는 성공·실패와 관계없이 연동 화면으로 돌아오게 했고, React cache()로 서버 세션 조회를 요청 단위로 묶었습니다. 앱·기능마다 브랜치를 나누고 git worktree로 체크아웃을 겹치지 않게 띄웠습니다.',
    result:
      'intro / blog / wiki / console 4개 앱을 한 제품 흐름으로 연결. proxy 준비 이벤트 1,532→33, /api/blog/primary 약 48→2로 중복 요청을 줄였습니다.',
    learned:
      '에이전트에게 일을 시키기 전에 규칙과 레거시를 먼저 넘기는 편이 됐습니다. 스킬과 워크트리를 남겨 두면 다음 브랜치에서 같은 실수를 반복하지 않습니다.',
    links: [
      { label: 'alleo.pro', url: 'https://alleo.pro' },
      { label: 'alleo.blog', url: 'https://alleo.blog' },
      { label: 'console.alleo.pro', url: 'https://console.alleo.pro' },
      {
        label: '케이스 노트 (Notion)',
        url: 'https://volcano-fisherman-e31.notion.site/Alleo-AI-SaaS-39e3307fa7e680628ef3f87e6e520d7d',
      },
    ],
  },
]

export const workBySlug = (slug: string | undefined): WorkItem | undefined =>
  WORKS.find((w) => w.slug === slug)
