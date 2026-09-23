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
    label: 'BACKOFFICE',
    title: '중대재해 관리 백오피스',
    period: '2025.05 — 2026.03',
    oneLiner: '서버에서 내려주는 메뉴로 사이드바를 그렸습니다.\n주소로 들어오는 화면도 한 번 더 막았습니다.',
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
      '버튼을 숨겨도 주소로 치면 화면이 열렸습니다. 메뉴를 프론트 코드에 두면 항목 하나만 바꿔도 다시 배포해야 했습니다.',
    choice:
      '서버에서 내려주는 메뉴로 사이드바를 그리고, 주소로 들어오는 화면도 한 번 더 막았습니다. 수정·승인 권한은 훅 하나로, 조직·사람을 고르는 창은 공통 모달로 뺐습니다. 정책이 바뀌면 그곳만 고칩니다.',
    result:
      '권한 훅 약 90개 파일, 조직 모달 약 50개 화면에서 재사용 중입니다.',
    learned:
      '관리자 화면에서 비싼 건 페이지를 더 만드는 시간이 아닙니다. 정책이 바뀔 때 한곳만 고치게 만드는 일입니다.',
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
    title: 'SITES — 기업·브랜드 웹 7종',
    period: '2026.01 — 2026.08',
    oneLiner:
      '권한이 아니라, 검색에 잡히고 문의가 가는 일이 우선입니다.\n언어별 주소·문구·메타데이터는 같은 규칙으로 맞췄습니다.',
    homeLine: '크로플 · 감탄누수 · 빛자루 · 고야차트 · 탑애드 · 현중고차 · 시하디자인',
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
      {
        name: '현중고차',
        note: '검색에 잡히고 문의로 이어지는 공개 웹',
        url: 'https://hyunjoongcar.com/',
      },
      {
        name: '시하디자인',
        note: '검색에 잡히고 문의로 이어지는 공개 웹',
        url: 'https://sihadesign.com/',
      },
    ],
    problem:
      '일곱 사이트 모두 완성된 화면보다, 검색에 잡히고 문의가 담당자에게 가는 일이 우선이었습니다. 문구만 바꾸면 주소와 메타데이터가 어긋났습니다.',
    choice:
      '언어별 주소·문구·메타데이터를 같은 규칙으로 맞췄습니다. 크로플·감탄누수·고야차트는 문의가 오면 Solapi로 담당자에게 바로 가게 연결했고, 사이트가 여러 개라 작업 폴더를 나눠 진행했습니다.',
    result:
      '공개 웹 7종을 같은 규칙으로 맞췄습니다. 크로플은 4개 국어 URL, 문의가 오는 사이트는 담당자 문자까지 이어집니다.',
    learned:
      '같은 Next.js라도 목적이 다르면 붙잡아야 하는 지점이 달라집니다. 백오피스는 권한, 공개 웹은 검색과 문의였습니다.',
    links: [
      { label: '크로플', url: 'https://www.kroffle.com/kr' },
      { label: '감탄누수', url: 'https://gamtannusu.com' },
      { label: '요셉씨의 빛자루', url: 'https://joecbroom-web.pages.dev/' },
      { label: '고야차트', url: 'https://exproject.work' },
      { label: '탑애드컴퍼니', url: 'https://www.toplawyermarketing.com' },
      { label: '현중고차', url: 'https://hyunjoongcar.com/' },
      { label: '시하디자인', url: 'https://sihadesign.com/' },
    ],
  },
  {
    slug: 'alleo',
    label: 'ALLEO',
    title: 'ALLEO — AI 검색 최적화 · 콘텐츠 자동화 SaaS',
    period: '2026.04 — 2026.08',
    oneLiner:
      '소개 웹·블로그·관리자·콘솔을 한 흐름으로 이어 붙였습니다.\n느릴 때는 감으로 지우지 않고, 요청 횟수부터 봤습니다.',
    homeLine: '같은 요청 1,532 → 33',
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
      '한 폴더에서 같이 고치면 소개 문구와 콘솔 작업이 섞였습니다. 개발 서버가 느릴 때 어디를 지워야 하는지도 감으로만 보였습니다.',
    choice:
      '앱마다 작업 공간을 나눴습니다. 요청이 몇 번 나가는지부터 세고, 세션 조회를 묶고 필요 없는 미리 불러오기를 끊었습니다.',
    result:
      '같은 길이 1,532번 반복되던 요청이 33번대로 줄었습니다. intro · blog · wiki · console은 앱마다 폴더를 나눠 진행합니다.',
    learned:
      '느릴 때는 감으로 지우지 않습니다. 같은 요청이 몇 번 나가는지부터 보면, 어디를 끊을지가 보입니다.',
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
