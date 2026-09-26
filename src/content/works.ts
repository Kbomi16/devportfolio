export type WorkStat = {
  value: string
  label: string
}

export type WorkShot = {
  src: string
  alt: string
  caption: string
}

export type WorkEntry = {
  name: string
  note: string
  url?: string
  image?: { src: string; alt: string }
}

export type WorkItem = {
  slug: 'tcc' | 'sites' | 'alleo' | 'money' | 'useme' | 'isle'
  /** 갤러리 라벨 (홈 CH3) */
  label: string
  /** 갤러리 라벨 위 보조 줄 (선택) */
  labelEyebrow?: string
  title: string
  period: string
  /** 아직 만드는 중이거나, 배포 뒤에도 기능을 더하는 경우 */
  status?: string
  role: string
  oneLiner: string
  /** 홈 라벨 밑줄 — 결과 숫자 한 줄 */
  homeLine: string
  stack: string[]
  cover: { src: string; alt: string; fit?: 'cover' | 'contain' }
  shots?: WorkShot[]
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
    role: '프론트엔드 — 동적 메뉴, 권한 훅, 조직 선택 모달',
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
    role: '프론트엔드 — 공개 웹 7종, 다국어, SEO, 문의 연결',
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
        image: { src: '/images/works/site-kroffle.jpg', alt: '크로플 공유 이미지. 내부 팀처럼 일하는 IT 개발 파트너.' },
      },
      {
        name: '감탄누수',
        note: '지역 랜딩, JSON-LD, 견적 접수 시 관리자 LMS + 신청자 확인 SMS',
        url: 'https://gamtannusu.com',
        image: { src: '/images/works/site-gamtan.jpg', alt: '감탄누수 공유 이미지. 전국 누수탐지·배관수리.' },
      },
      {
        name: '요셉씨의 빛자루',
        note: '견적·파트너십 문의 폼, Solapi 문자 발송',
        url: 'https://joecbroom-web.pages.dev/',
        image: { src: '/images/works/site-bitzaru.jpg', alt: '요셉씨의 빛자루클린 공유 이미지.' },
      },
      {
        name: '고야차트',
        note: '상담 문의 폼과 Solapi 문자 발송',
        url: 'https://exproject.work',
        image: { src: '/images/works/site-goya.jpg', alt: '고야차트 공유 이미지. AI 기반 시세 방향성 시그널.' },
      },
      {
        name: '탑애드컴퍼니',
        note: 'SEO · GEO · AEO, JSON-LD, 전화 상담 전환',
        url: 'https://www.toplawyermarketing.com',
        image: { src: '/images/works/site-topad.jpg', alt: '탑애드컴퍼니 공유 이미지.' },
      },
      {
        name: '현중고차',
        note: '검색에 잡히고 문의로 이어지는 공개 웹',
        url: 'https://hyunjoongcar.com/',
        image: { src: '/images/works/site-hyunjoong.jpg', alt: '현중고차 공유 이미지. 책 쓰는 딜러, 차 파는 작가.' },
      },
      {
        name: '시하디자인',
        note: '검색에 잡히고 문의로 이어지는 공개 웹',
        url: 'https://sihadesign.com/',
        image: { src: '/images/works/site-siha.jpg', alt: '시하디자인 공유 이미지. 3M 공식대리점.' },
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
    role: '프론트엔드 — 소개 웹, 블로그, 관리자, 사용자 콘솔',
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
      {
        name: 'intro',
        note: '소개 웹 · 다국어',
        url: 'https://alleo.pro',
        image: {
          src: '/images/works/alleo-og.jpg',
          alt: 'Alleo 소개 공유 이미지. AI 검색에 강한 블로그 자산 자동화.',
        },
      },
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
  {
    slug: 'money',
    label: 'MONEY',
    title: '내 돈 어디갔지?',
    period: '2026.02 — 현재',
    status: '진행 중',
    role: '기획·UI·기능·배포·운영',
    oneLiner: '달력·리스트로 기록하고, 할부·반복 지출까지\n실제 쓰는 패턴을 반영했습니다.',
    homeLine: '직접 쓰며 운영 · PWA',
    stack: ['Next.js', 'TypeScript', 'Tailwind', 'Zustand', 'Firebase', 'PWA'],
    cover: {
      src: '/images/works/money-login.jpg',
      alt: '내 돈 어디갔지? 로그인 화면. 이메일과 비밀번호로 가계부에 들어갑니다.',
      fit: 'contain',
    },
    problem:
      '기능이 많으면 기록이 귀찮아집니다. 할부·구독처럼 매달 반복되는 지출은, 단건 입력만 있으면 같은 내용을 다시 적어야 했습니다.',
    choice:
      '달력과 리스트, 이번 달 요약으로 기록 경로를 짧게 만들었습니다. 할부와 반복 지출은 쓰다가 막히는 지점을 보고 나중에 넣었습니다. 인증과 저장은 Firebase, 휴대폰은 PWA로 맞췄습니다.',
    result:
      '기록·확인·수정이 한 흐름으로 이어집니다. 출시 뒤에도 직접 쓰면서 할부, 반복 지출, 결제 수단을 더하고 있습니다.',
    learned:
      '혼자 만드는 서비스는 기획이 곧 우선순위입니다. 완벽한 가계부보다, 쓰면서 막히는 지점을 기능으로 올리는 쪽이 맞았습니다.',
    links: [
      { label: '배포', url: 'https://where-is-my-money-track-expenses.vercel.app/' },
      { label: 'GitHub', url: 'https://github.com/Kbomi16/where-is-my-money' },
    ],
  },
  {
    slug: 'useme',
    label: 'USEME',
    title: 'useMe — 토이프로젝트 어필·체험',
    period: '2026.09 — 현재',
    status: '진행 중',
    role: '기획·UI·기능·인프라',
    oneLiner: '토이프로젝트를 어필 카드로 바꿔 공유하고,\n도착한 사람이 체험하며 피드백을 남깁니다.',
    homeLine: '공개 웹 · 운영 콘솔',
    stack: ['Next.js', 'TypeScript', 'Tailwind', 'TanStack Query', 'Zustand', 'Supabase'],
    cover: {
      src: '/images/works/useme-discover.png',
      alt: 'useMe 둘러보기. 어떤 프로젝트를 써 볼까요, 검색과 오늘의 카드.',
      fit: 'contain',
    },
    shots: [
      {
        src: '/images/works/useme-project.png',
        alt: 'useMe 프로젝트 카드. 왜, 뭘, 얼마나 세 칸과 써 보기 버튼.',
        caption: '어필 3칸. 왜 만들었는지, 무엇을 쓰는지, 얼마나 걸렸는지.',
      },
      {
        src: '/images/works/useme-comments.png',
        alt: 'useMe 받은 피드백. 피드백, 질문, 버그, 응원으로 나뉜 댓글.',
        caption: '체험 뒤 남기는 반응. 피드백·질문·버그·응원.',
      },
    ],
    problem:
      '토이프로젝트는 만들었다고 끝나기 쉽습니다. 써 봐 달라는 말을 카드로 뿌리고, 도착한 사람이 체험한 뒤 반응을 남기는 고리가 없었습니다.',
    choice:
      '등록에서 어필 3칸, 홍보팩, 공유, 체험과 반응, 다음 등록까지를 하나의 고리로 고정했습니다. 공개 웹과 운영 콘솔은 모노레포에서 나누고, 크레딧은 마이페이지에만 둡니다.',
    result:
      '둘러보기, 프로젝트 카드, 소셜 로그인까지 화면 단위로 올리는 중입니다. 크레딧과 티어는 홍보 화면에 섞지 않습니다.',
    learned:
      '실무에서 쓰던 앱 분리와 BFF를 개인 프로젝트에 그대로 적용해 보고 있습니다. 기능을 많이 넣기보다, 고리 하나가 도는지부터 확인합니다.',
    links: [{ label: 'GitHub', url: 'https://github.com/Kbomi16/useme' }],
  },
  {
    slug: 'isle',
    label: 'ISLE',
    title: '모이섬 — Three.js 소셜 마을',
    period: '2026.09 — 현재',
    status: '진행 중',
    role: '기획부터 구현까지',
    oneLiner: '이름을 고르고 마을에 들어와 걷고,\n사람을 보고, 말하고, 내 방을 꾸밉니다.',
    homeLine: '걷기 → 만나기 → 말하기',
    stack: ['Three.js', 'React Three Fiber', 'Vite', 'TypeScript', 'Socket.IO'],
    cover: {
      src: '/images/works/isle-cover.svg',
      alt: '모이섬. 걷기, 만나기, 말하기. 전투와 점수는 만들지 않습니다.',
      fit: 'cover',
    },
    problem:
      '포트폴리오를 건물로 늘어놓으면, 다른 사람이 들어와 만나고 말하는 경험은 없습니다. 그래픽을 목표로 잡으면 범위가 걷잡을 수 없습니다.',
    choice:
      '게임은 만들지 않습니다. 전투·점수·퀘스트는 빼 두고, 한 방문의 성공을 말하고 방을 만져 볼 수 있는가로 고정했습니다. 카메라와 이동은 놀이터에서 먼저 확인하고 본 프로젝트로 옮깁니다.',
    result:
      '1차 고리는 걷기, 만나기, 말입니다. WASD로 움직이고, 가까워지면 슬래시로 입력창이 열리게 만드는 중입니다.',
    learned:
      '덜 익숙한 축은 재현 가능한 단위로 쪼개 남깁니다. 범위를 기획서에서 먼저 고정하면, 만들지 않을 것이 구현을 잡아먹지 않습니다.',
    links: [{ label: 'GitHub', url: 'https://github.com/Kbomi16/moi-isle' }],
  },
]

export const workBySlug = (slug: string | undefined): WorkItem | undefined =>
  WORKS.find((w) => w.slug === slug)
