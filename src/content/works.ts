export type WorkStat = {
  value: string
  label: string
}

export type WorkShot = {
  src: string
  alt: string
  caption: string
  /** 가로로 긴 구조도. 두 칸을 쓴다. */
  wide?: boolean
}

export type WorkEntry = {
  name: string
  note: string
  url?: string
  image?: { src: string; alt: string }
}

export type WorkDecision = {
  title: string
  problem: string
  choice: string
  result: string
  /** 해당 섹션 제목 바로 아래에 둘 구조도 */
  shots?: WorkShot[]
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
  /** 상세 히어로에 쓰는 가로 썸네일 */
  thumb: { src: string; alt: string }
  /** 갤러리 카드에 올리는 As-Is / To-Be. 없으면 thumb */
  compare?: { src: string; alt: string }
  stats?: WorkStat[]
  entries?: WorkEntry[]
  decisions: WorkDecision[]
  links: { label: string; url: string }[]
  /** 배포 링크 옆 체험용 로그인 (Notion 케이스 노트와 동일) */
  testAccount?: { email: string; password: string }
}

export const WORKS: WorkItem[] = [
  {
    slug: 'tcc',
    label: 'BACKOFFICE',
    title: '중대재해 관리 백오피스',
    period: '2025.05 — 2026.02',
    role: '프론트엔드, 동적 메뉴, 권한 훅, 조직 선택 모달, 테이블 CRUD',
    oneLiner: '사이드바를 숨겨도 주소로 치면 화면이 열렸습니다.\n메뉴와 버튼 권한을 서버 기준으로 바꿨습니다.',
    homeLine: '권한 훅 ~90개 파일 · 조직 모달 ~50개 화면',
    stack: ['Next.js Pages Router', 'TypeScript', 'React Query', 'Jotai', 'Axios', 'Ant Design', 'Styled Components'],
    thumb: {
      src: '/images/works/card-tcc.png',
      alt: '중대재해 관리 백오피스. 사이드바와 차트, 목록 화면.',
    },
    compare: {
      src: '/images/works/backoffice-1-v2.png',
      alt: 'As-Is / To-Be. 하드코딩 메뉴와 URL 직접 접근을 서버 menuTree와 menuId 권한 검증으로 바꾼 흐름.',
    },
    stats: [
      { value: '90', label: '권한 훅 재사용 파일' },
      { value: '50', label: '조직 선택 모달 화면' },
      { value: '0', label: '메뉴 변경 시 재배포' },
    ],
    decisions: [
      {
        title: '메뉴와 주소 접근',
        problem:
          '사이드바에서 메뉴를 숨겨도 주소만 알면 화면이 열렸습니다. 메뉴가 프론트 코드에 있으면 항목 하나만 바꿔도 다시 배포해야 했습니다.',
        choice:
          '서버가 내려주는 menuTree로 사이드바를 그립니다. 들어온 주소와 맞는 menuId를 찾아 권한 API에 묻고, 없으면 에러 후 다른 화면으로 보냅니다.',
        result: '메뉴 구조는 서버 설정만으로 바뀝니다. 주소로 직접 들어오는 접근도 같은 기준으로 막습니다.',
        shots: [
          {
            src: '/images/works/backoffice-1-v2.png',
            alt: '동적 메뉴 흐름. 하드코딩과 URL 직접 접근을 menuTree와 권한 검증으로 바꾸는 구조도.',
            caption: '서버 menuTree로 메뉴를 그리고, 주소로 들어올 때는 menuId로 다시 검증합니다.',
            wide: true,
          },
        ],
      },
      {
        title: '버튼 권한',
        problem:
          '조회·수정·삭제·승인 체크가 화면마다 달랐습니다. 권한 코드가 바뀌면 여러 화면을 다시 열어야 했습니다.',
        choice:
          '화면은 기능 코드만 훅에 넘깁니다. 훅이 서버 권한을 조회하고 버튼 노출과 실행을 가립니다. 같은 코드는 React Query 캐시를 씁니다.',
        result: '같은 훅을 약 90개 파일에서 씁니다. 정책이 바뀌면 훅과 권한 코드만 보면 됩니다.',
        shots: [
          {
            src: '/images/works/backoffice-2-v2.png',
            alt: 'As-Is / To-Be. 화면마다 흩어진 권한 체크를 func_code 훅 하나로 모은 흐름.',
            caption: '화면은 기능 코드만 넘기고, 버튼 노출과 실행은 같은 훅이 가립니다.',
            wide: true,
          },
        ],
      },
      {
        title: '조직·사람 선택',
        problem:
          '조직과 사람을 고르는 창이 화면마다 따로였습니다. 일반 조직도와 안전보건 조직도의 규칙도 달랐고, 검색하면 부모 트리가 사라져 어디를 고른 건지 알기 어려웠습니다.',
        choice:
          '공통 모달에 선택 규칙을 props로 넘깁니다. 일반·안전보건, 한 명·여러 명, 조직만, 하위 포함 여부를 모달이 계산하고, 검색해도 맞는 노드의 부모는 남깁니다.',
        result: '약 50개 화면이 같은 모달을 씁니다.',
        shots: [
          {
            src: '/images/works/backoffice-3-v2.png',
            alt: '조직 선택 모달 공통화 구조도. 공통 모달, props 정책, 부모 트리 유지.',
            caption: '조직 선택은 공통 모달 하나. 유형·방식·범위는 props로 나누고, 검색해도 부모 트리는 남깁니다.',
            wide: true,
          },
        ],
      },
    ],
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
    title: '기업·브랜드 웹 7종',
    period: '2026.01 — 2026.08',
    role: '프론트엔드, 공개 웹 7종, 다국어, SEO, 문의 연결',
    oneLiner:
      '공개 웹 7종의 우선순위는 검색 노출과 문의 전환이었습니다.\n다국어·SEO·인터랙션·문의를 리드 전환형으로 맞췄습니다.',
    homeLine: '크로플 · 감탄누수 · 빛자루 · 고야차트 · 탑애드 · 현중고차 · 시하디자인',
    stack: ['Next.js 16', 'React 19', 'TypeScript', 'Tailwind CSS 4', 'shadcn/ui', 'next-intl', 'GSAP', 'Motion', 'Solapi'],
    thumb: {
      src: '/images/works/card-sites.png',
      alt: '크로플 기업 웹 첫 화면. 외주는 그만, 팀처럼 개발.',
    },
    compare: {
      src: '/images/works/brandweb-1-v2.png',
      alt: 'As-Is / To-Be. 문구만 번역하던 다국어를 URL·본문·메타데이터가 같은 locale 규칙을 보게 바꾼 흐름.',
    },
    entries: [
      {
        name: '크로플',
        note: 'IT 아웃소싱 공식 웹. 4개 국어 URL·메타, 커피챗 Solapi',
        url: 'https://www.kroffle.com/kr',
        image: { src: '/images/works/site-kroffle.jpg', alt: '크로플 공유 이미지. 내부 팀처럼 일하는 IT 개발 파트너.' },
      },
      {
        name: '감탄누수',
        note: '지역 페이지, JSON-LD, 견적 SMS',
        url: 'https://gamtannusu.com',
        image: { src: '/images/works/site-gamtan.jpg', alt: '감탄누수 공유 이미지. 전국 누수탐지·배관수리.' },
      },
      {
        name: '요셉씨의 빛자루',
        note: '견적·파트너십 문의 폼',
        url: 'https://joecbroom-web.pages.dev/',
        image: { src: '/images/works/site-bitzaru.jpg', alt: '요셉씨의 빛자루클린 공유 이미지.' },
      },
      {
        name: '고야차트',
        note: '상담 문의 Solapi',
        url: 'https://exproject.work',
        image: { src: '/images/works/site-goya.jpg', alt: '고야차트 공유 이미지. AI 기반 시세 방향성 시그널.' },
      },
      {
        name: '탑애드컴퍼니',
        note: 'SEO·GEO·AEO, JSON-LD, 전화 상담',
        url: 'https://www.toplawyermarketing.com',
        image: { src: '/images/works/site-topad.jpg', alt: '탑애드컴퍼니 공유 이미지.' },
      },
      {
        name: '현중고차',
        note: '중고차 구매 상담, 딜러 브랜드 웹',
        url: 'https://hyunjoongcar.com/',
        image: { src: '/images/works/site-hyunjoong.jpg', alt: '현중고차 공유 이미지. 책 쓰는 딜러, 차 파는 작가.' },
      },
      {
        name: '시하디자인',
        note: '3M 단열필름 시공, 지점·견적',
        url: 'https://sihadesign.com/',
        image: { src: '/images/works/site-siha.jpg', alt: '시하디자인 공유 이미지. 3M 공식대리점.' },
      },
    ],
    decisions: [
      {
        title: '언어가 섞이지 않게',
        problem:
          '화면 문구만 바꾸면 주소, 메뉴, 메타데이터가 서로 다른 기준이 됩니다. 언어가 섞이거나 검색 정보와 본문이 어긋납니다.',
        choice:
          'next-intl로 한국어·영어·일본어·중국어를 관리하고 URL을 /kr · /us · /jp · /cn으로 나눴습니다. 링크는 현재 언어를 유지하고, 본문과 메타데이터는 같은 번역 파일을 봅니다.',
        result: '페이지를 옮겨도 고른 언어가 유지됩니다. 문구를 고칠 때 컴포넌트를 직접 열지 않습니다.',
        shots: [
          {
            src: '/images/works/brandweb-1-v2.png',
            alt: 'As-Is / To-Be. next-intl locale로 URL, 문구, 메타데이터를 연결한 흐름.',
            caption: '언어별 URL과 본문, 메타데이터가 같은 locale 규칙을 봅니다.',
            wide: true,
          },
        ],
      },
      {
        title: '검색과 AI가 읽게',
        problem:
          '다국어 페이지는 canonical과 언어별 대체 URL이 틀리면 같은 글이 중복으로 잡힙니다. 검색엔진과 AI 검색이 회사·서비스 정보를 읽으려면 문장 밖에 구조도 필요했습니다.',
        choice:
          '언어·페이지별 title, description, Open Graph, canonical을 만들고, sitemap에 언어별 대체 URL과 x-default를 넣었습니다. 회사·FAQ·서비스는 JSON-LD로 적습니다.',
        result: '검색엔진이 언어별 URL의 관계와 대표 페이지를 구분할 기반이 있습니다.',
        shots: [
          {
            src: '/images/works/brandweb-2-v2.png',
            alt: 'As-Is / To-Be. Metadata, sitemap, robots, JSON-LD로 검색과 AI가 읽게 한 흐름.',
            caption: '언어별 대표 URL과 구조화 데이터로 검색엔진·AI가 페이지 관계를 구분합니다.',
            wide: true,
          },
          {
            src: '/images/works/sites-sitemap.png',
            alt: '크로플 sitemap. 언어별 URL과 hreflang alternate, x-default.',
            caption: '언어별 URL에 alternate와 x-default를 넣어, 같은 글의 대표 페이지를 구분합니다.',
          },
          {
            src: '/images/works/sites-meta.png',
            alt: 'Google 리치 결과 테스트. 지역 업체, 회사, 리뷰 스니펫이 감지된 화면.',
            caption: '회사·지역 업체·리뷰 스니펫이 리치 결과에 잡히도록 구조화 데이터를 맞췄습니다.',
          },
        ],
      },
      {
        title: '문의와 작업 나누기',
        problem:
          '문의가 폼에만 쌓이면 담당자가 바로 받지 못합니다. 사이트 7개가 비슷한 시기에 돌아가 브랜치와 작업 맥락이 섞였습니다.',
        choice:
          '문의 폼이 있는 사이트는 Solapi로 담당자에게 문자를 보냅니다. 사이트마다 git worktree로 작업 폴더를 나눴습니다.',
        result: '공개 웹 7종입니다. 문의가 있는 사이트는 제출이 담당자 문자까지 이어집니다.',
        shots: [
          {
            src: '/images/works/brandweb-3-v2.png',
            alt: 'As-Is / To-Be. 사이트·기능 단위 git worktree와 Cursor 역할 분리.',
            caption: '사이트마다 작업 폴더를 나눠, 한 사이트를 고칠 때 다른 사이트 맥락이 섞이지 않게 했습니다.',
            wide: true,
          },
        ],
      },
    ],
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
    title: 'AI 검색 최적화 · 콘텐츠 자동화 SaaS',
    period: '2026.04 — 현재',
    role: '프론트엔드·일부 API, 소개 웹, 공개 블로그, 사용자 콘솔, 관리자',
    oneLiner:
      '검색·AI 노출 진단부터 블로그, SNS 발행까지 이어집니다.\n소개 웹·블로그·콘솔·관리자를 나눠 만들었습니다.',
    homeLine: '분석 → 추적 → SNS 발행',
    stack: [
      'Next.js 16',
      'React 19',
      'TypeScript',
      'TanStack Query',
      'Zustand',
      'Tailwind CSS 4',
      'NestJS',
      'Cloudflare',
    ],
    thumb: {
      src: '/images/works/card-alleo.png',
      alt: 'alleo 소개 화면. AI 검색에 브랜드가 먼저 나오도록 진단하는 입력창.',
    },
    compare: {
      src: '/images/works/alleo-1-v2.png',
      alt: 'As-Is / To-Be. 흩어진 분석을 리포트, 개선 포인트, AI 추천 추적 순서로 이은 흐름.',
    },
    entries: [
      { name: 'intro', note: '소개 웹 · 다국어', url: 'https://alleo.pro' },
      { name: 'blog', note: '사용자 커스텀 블로그', url: 'https://alleo.blog' },
      { name: 'wiki', note: '도움말 문서', url: 'https://alleo.wiki' },
      { name: 'console', note: '분석 · SNS OAuth', url: 'https://console.alleo.pro' },
    ],
    decisions: [
      {
        title: '사이트 분석과 노출 추적',
        problem:
          '사이트가 검색과 AI에 어떻게 보이는지 한눈에 보기 어려웠습니다. 분석과 추적이 흩어지면 다음 행동으로 이어지지 않습니다.',
        choice:
          '점수, 개선 포인트, 리포트 목록과 차트로 분석 화면을 만들었습니다. AI 추천 추적, 경쟁사, 키워드 기회를 같은 흐름에 두고, 리포트가 없으면 추적 질문을 제한했습니다.',
        result: '분석하고, 고칠 점을 보고, 그다음 추적하는 순서로 콘솔을 쓰게 됩니다.',
        shots: [
          {
            src: '/images/works/alleo-1-v2.png',
            alt: 'As-Is / To-Be. 분석 리포트에서 개선 포인트, AI 추천 추적으로 이어지는 흐름.',
            caption: '리포트가 없으면 추적을 제한해, 진단 다음에 추적하게 했습니다.',
            wide: true,
          },
        ],
      },
      {
        title: 'SNS 계정 연결',
        problem:
          '글을 올리려면 Facebook, Instagram, LinkedIn 계정을 먼저 연결해야 합니다. 개발자 콘솔에 등록한 redirect와 실제 주소가 조금만 달라도 연동이 중간에 끊깁니다.',
        choice:
          '채널별 OAuth를 시작하고, 등록된 콜백에서 code와 state를 확인한 뒤 계정을 연결합니다. 끝나면 연동 화면으로 돌아와 성공과 실패를 보여 줍니다. 글 본문과 AI 초안은 협업으로 진행했고, 연동 화면과 연결 흐름을 맡았습니다.',
        result: '소셜 로그인 후 콘솔에서 연결 완료를 확인합니다. 이후 업로드는 연결된 채널 기준으로 진행합니다.',
        shots: [
          {
            src: '/images/works/alleo-2-v2.png',
            alt: 'SNS 연동 구조도. OAuth 시작, 콜백의 code·state 확인, 연동 화면 복귀.',
            caption: '채널별 OAuth 뒤 등록된 콜백으로 돌아와, 연동 화면에서 성공과 실패를 보여 줍니다.',
            wide: true,
          },
        ],
      },
      {
        title: '구축 사례의 검색 성과',
        problem:
          '영업할 때 검색에 잘 나온다는 말을 근거 없이 설명해야 했습니다. 성과는 Search Console과 네이버 서치어드바이저에 흩어져 있고, 네이버는 사이트 성과를 조회하는 공개 API가 없습니다.',
        choice:
          '영업용 마케팅 사이트를 만들고 사례마다 검색 성과를 보여 줍니다. Search Console 데이터는 D1에 저장하고, 네이버는 서치어드바이저 데이터를 시드로 넣습니다. 키워드 순위는 진행 중인 작업을 재사용하고, 화면은 3초 간격으로 폴링합니다.',
        result: '영업 담당이 말 대신 사례별 순위와 성과 차트를 링크로 보여 줍니다.',
        shots: [
          {
            src: '/images/works/alleo-3-v3.png',
            alt: 'As-Is / To-Be. 키워드 순위 검사를 재사용하고 Google·네이버를 동시에 조회한 뒤 폴링하는 흐름.',
            caption: '같은 순위 검사는 다시 만들지 않고, 화면은 끝날 때까지 폴링합니다.',
            wide: true,
          },
        ],
      },
    ],
    links: [
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
    oneLiner: '기록은 짧게, 할부와 구독은 매달 다시 적지 않게.\n직접 쓰면서 기능을 더하는 가계부입니다.',
    homeLine: '직접 쓰며 운영 · PWA',
    stack: ['Next.js 16', 'React 19', 'TypeScript', 'Tailwind CSS 4', 'shadcn/ui', 'Zustand', 'Firebase', 'PWA'],
    thumb: {
      src: '/images/works/card-money.png',
      alt: '내 돈 어디갔지 대시보드. 이번 달 수입·지출과 월 비교 차트.',
    },
    compare: {
      src: '/images/works/moneywhere-1-v2.png',
      alt: 'As-Is / To-Be. 단건 기록을 대시보드·달력·리스트와 Firebase 저장으로 바꾼 흐름.',
    },
    decisions: [
      {
        title: '기록 경로',
        problem: '기능이 많을수록 기록이 귀찮아집니다. 날짜별로 얼마를 썼는지 보고, 바로 고칠 수 있어야 했습니다.',
        choice:
          '이번 달 요약을 두고 달력과 리스트를 바꿔 보게 했습니다. 로그인 후 Firestore에 거래를 저장하고, 통계에서 뺄 수도 있습니다.',
        result: '기록, 확인, 수정이 짧은 경로로 이어집니다.',
        shots: [
          {
            src: '/images/works/moneywhere-1-v2.png',
            alt: 'As-Is / To-Be. 대시보드, 달력·리스트, Firebase 로그인과 저장 흐름.',
            caption: '요약, 달력, 리스트로 보고, 기록은 Firebase에 저장합니다.',
            wide: true,
          },
        ],
      },
      {
        title: '할부와 반복 지출',
        problem: '구독과 할부는 매달 같은 내용을 다시 적게 됩니다. 단건 입력만 있으면 쓰다가 멈춥니다.',
        choice:
          '할부는 총액과 기간을 나눠 월 지출로 넣습니다. 반복 지출은 기간을 정한 뒤 마이페이지에서 중단할 수 있고, 중단 전에 한 번 더 확인합니다.',
        result: '출시 뒤에 직접 쓰면서 할부, 반복 지출, 결제 수단을 더했습니다.',
        shots: [
          {
            src: '/images/works/moneywhere-2-v2.png',
            alt: 'As-Is / To-Be. 할부와 반복 지출을 등록하고 마이페이지에서 중단하는 흐름.',
            caption: '할부는 월 지출로 나누고, 반복 지출은 마이페이지에서 중단합니다.',
            wide: true,
          },
        ],
      },
      {
        title: '휴대폰에서 바로 적기',
        problem: '가계부는 밖에서 바로 적습니다. 브라우저 북마크보다 홈 화면 앱이 편합니다.',
        choice:
          'PWA로 홈 화면 추가를 지원하고 라이트·다크 모드를 넣었습니다. 인증과 저장은 Firebase로 두어 별도 서버 없이 배포까지 이었습니다.',
        result: '스마트폰에서 앱처럼 설치해 씁니다. 피드백 채널을 열어 두고 직접 쓰면서 고치고 있습니다.',
        shots: [
          {
            src: '/images/works/moneywhere-3-v2.png',
            alt: 'As-Is / To-Be. PWA 홈 화면 추가와 라이트·다크 모드.',
            caption: '홈 화면에 추가해 앱처럼 쓰고, 라이트·다크 모드를 바꿉니다.',
            wide: true,
          },
        ],
      },
    ],
    links: [
      { label: '배포', url: 'https://where-is-my-money-track-expenses.vercel.app/' },
      { label: 'GitHub', url: 'https://github.com/Kbomi16/where-is-my-money' },
    ],
    testAccount: { email: 'whereismymoney@test.com', password: 'Abcd1234' },
  },
  {
    slug: 'useme',
    label: 'USEME',
    title: '토이프로젝트 어필·체험',
    period: '2026.09 — 현재',
    status: '진행 중',
    role: '기획·UI·기능·인프라',
    oneLiner: '토이프로젝트를 어필 카드로 바꿔 공유하고,\n써 본 사람이 피드백을 남기는 플랫폼입니다.',
    homeLine: '공개 웹 · 운영 콘솔',
    stack: ['Next.js', 'TypeScript', 'Tailwind', 'TanStack Query', 'Zustand', 'Supabase'],
    thumb: {
      src: '/images/works/card-useme.png',
      alt: 'useMe 첫 화면. 링크만 보내지 말고, 써 보라고 해요.',
    },
    decisions: [
      {
        title: '코어 루프',
        problem:
          '토이프로젝트는 만들었다고 끝나기 쉽습니다. 써 봐 달라는 말과, 써 본 뒤의 반응이 이어지지 않았습니다.',
        choice:
          '등록, 어필 3칸, 홍보팩, 공유, 체험과 반응, 다음 등록을 하나의 고리로 고정했습니다. 크레딧과 티어는 마이페이지에만 두고, 랜딩과 홍보 버튼에는 섞지 않습니다.',
        result: '둘러보기, 프로젝트 카드, 소셜 로그인까지 화면 단위로 올리는 중입니다.',
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
      },
      {
        title: '공개 웹과 운영 콘솔',
        problem: '공개 웹과 운영 콘솔을 한곳에서 고치면 방문자 화면과 운영 도구가 섞입니다.',
        choice:
          'Turborepo로 web과 admin을 나누고, 공통 UI는 packages/ui에 둡니다. 데이터는 /api BFF를 거치고, 로그인은 Supabase 쿠키 세션으로 이메일·Google·Kakao를 받습니다.',
        result: '실무에서 쓰던 앱 분리와 쿠키 세션을 개인 프로젝트에서 같은 방식으로 적용하고 있습니다.',
      },
    ],
    links: [
      { label: '배포', url: 'https://useme-web-beige.vercel.app/' },
      { label: 'GitHub', url: 'https://github.com/Kbomi16/useme' },
    ],
  },
  {
    slug: 'isle',
    label: 'ISLE',
    title: '모이섬 Three.js 소셜 마을',
    period: '2026.09 — 현재',
    status: '진행 중',
    role: '기획부터 구현까지',
    oneLiner: '이름을 고르고 들어와, 가까이 있는 주민에게만 말이 닿습니다.\n멀어지면 답은 오지 않습니다.',
    homeLine: '걷기 → 만나기 → 말하기',
    stack: ['Three.js', 'React Three Fiber', 'Vite', 'TypeScript', 'Socket.IO'],
    thumb: {
      src: '/images/works/card-isle.png',
      alt: '모이섬 입장 화면. 캐릭터를 고르고 이름과 직군을 적은 뒤 섬으로 들어갑니다.',
    },
    decisions: [
      {
        title: '만들지 않을 것',
        problem:
          '포트폴리오를 건물로 늘어놓으면 다른 사람이 들어와 말하는 경험은 없습니다. 그래픽이나 전투를 목표로 잡으면 범위가 걷잡을 수 없습니다.',
        choice:
          '게임은 만들지 않습니다. 전투, 점수, 퀘스트는 빼 두고, 한 방문의 성공을 말하고 방을 만져 볼 수 있는가로 고정했습니다.',
        result: '1차 고리는 걷기, 만나기, 말입니다. WASD로 움직이고, 가까워지면 / 로 입력창이 열립니다.',
      },
      {
        title: '답이 오는 조건',
        problem:
          '멀리 있는 주민까지 대답하면 마을이 아니라 채팅창이 됩니다. 말을 건 뒤에 걸어가면, 이미 없는 사람에게 답이 뜨는 것도 어색합니다.',
        choice:
          '전송하면 내 말풍선과 로그는 바로 남깁니다. 답은 위 흐름처럼, 범위 안에 있고 잠시 뒤에도 가까이 있을 때만 남깁니다.',
        result: '대화는 옆에 있는 사람에게만 생깁니다. 로그에는 실제로 오간 말만 쌓입니다.',
      },
      {
        title: '익숙하지 않은 축',
        problem: '카메라, 이동, 실시간 동기화는 웹에서 덜 익숙한 축입니다. 한 번에 본 프로젝트에 넣으면 원인 찾기가 어렵습니다.',
        choice:
          '놀이터에서 카메라와 이동을 먼저 확인하고, 검증된 것만 본 프로젝트로 옮깁니다. 접속자, 대화, 방 상태는 Socket.IO로 맞춥니다.',
        result: '클레이 비율 캐릭터와 로우폴리 낮 마을 톤은 잡아 둔 상태이고, 말하기 고리를 붙이는 중입니다.',
      },
    ],
    links: [
      { label: '배포', url: 'https://moi-isle.vercel.app/' },
      { label: 'GitHub', url: 'https://github.com/Kbomi16/moi-isle' },
    ],
  },
]

export const workBySlug = (slug: string | undefined): WorkItem | undefined =>
  WORKS.find((w) => w.slug === slug)
