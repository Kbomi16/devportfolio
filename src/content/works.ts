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
  slug: 'tcc' | 'sites' | 'alleo' | 'money'
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
}

export const WORKS: WorkItem[] = [
  {
    slug: 'sites',
    label: 'SITES',
    labelEyebrow: 'SEO GEO AEO',
    title: '기업·브랜드 웹 10종',
    period: '2026.06 말 ~ 2026.11',
    role: '프론트엔드(공개 웹 10종, SEO/AEO·GEO, 문의 연결, 하나리더투어 관리 화면)',
    oneLiner:
      '기획부터 화면·검색 설정·문의 연결·배포까지 진행한 클라이언트 사이트.\n검색에 잡히고, 방문 문의가 담당자에게 닿는 일을 기준으로 봄',
    homeLine: '감탄누수 · 요셉씨의 빛자루 · 탑애드 · 현중고차 외 6곳',
    stack: ['Next.js', 'TypeScript', 'Tailwind', 'GSAP', 'Motion', 'Solapi', 'Cloudflare D1·R2·Access'],
    thumb: {
      src: '/images/works/card-sites.png',
      alt: '기업·브랜드 웹 10종 중 9곳의 공유 이미지. 감탄누수, 요셉씨의 빛자루, 하나리더투어, 현중고차, 가화 법률사무소, JL153, 시하디자인, 탑애드, 건국마루.',
    },
    compare: {
      src: '/images/works/brandweb-2-v2.png',
      alt: 'As-Is / To-Be. Metadata, sitemap, robots, JSON-LD로 검색과 AI가 읽게 한 흐름.',
    },
    entries: [
      {
        name: '감탄누수',
        note: '지역 페이지, JSON-LD, 견적 SMS',
        url: 'https://gamtannusu.com',
        image: { src: '/images/works/site-gamtan.jpg', alt: '감탄누수 공유 이미지. 전국 누수탐지·배관수리.' },
      },
      {
        name: '요셉씨의 빛자루',
        note: '견적·파트너십 폼',
        url: 'https://jcct.co.kr/',
        image: { src: '/images/works/site-bitzaru.jpg', alt: '요셉씨의 빛자루클린 공유 이미지.' },
      },
      {
        name: '탑애드',
        note: 'SEO·GEO·AEO, JSON-LD, 전화 상담',
        url: 'https://toplawyermarketing.com',
        image: { src: '/images/works/site-topad.jpg', alt: '탑애드컴퍼니 공유 이미지.' },
      },
      {
        name: '현중고차',
        note: '중고차 구매 상담, 딜러 브랜드 웹',
        url: 'https://hyunjoongcar.com',
        image: { src: '/images/works/site-hyunjoong.jpg', alt: '현중고차 공유 이미지. 책 쓰는 딜러, 차 파는 작가.' },
      },
      {
        name: '시하디자인',
        note: '3M 단열필름 시공, 지점·견적',
        url: 'https://sihadesign.com',
        image: { src: '/images/works/site-siha.jpg', alt: '시하디자인 공유 이미지. 3M 공식대리점.' },
      },
      {
        name: '건국마루',
        note: '마루 시공 업체 사이트',
        url: 'https://konkukflooring.com',
        image: { src: '/images/works/site-konkuk.jpg', alt: '건국마루 공유 이미지. 시흥 마루·장판·데코타일 시공.' },
      },
      {
        name: '하나리더투어',
        note: '사회적기업 여행사 공개 웹·관리자. D1·R2 공유, 관리자는 Cloudflare Access',
        url: 'https://hanaleadertour.or.kr',
        image: {
          src: '/images/works/site-hana.jpg',
          alt: '하나리더투어 공유 이미지. 사회적기업, 국내여행·전세버스·양평힐링센터.',
        },
      },
      {
        name: 'JL153',
        note: '건축·분양 시행사 사이트',
        url: 'https://jl153.kr',
        image: { src: '/images/works/site-jl153.jpg', alt: 'JL153 공유 이미지. 시행·시공·인테리어·산업 유통.' },
      },
      {
        name: '오남 리드앤톡',
        note: '영어 독서 학원 사이트',
        url: 'https://onamreadntalk.co.kr',
        image: { src: '/images/works/site-onam.jpg', alt: '오남 리드앤톡 공유 이미지. 남양주 오남 영어원서 전문학원.' },
      },
      {
        name: '가화 법률사무소',
        note: '부산 법률사무소 사이트',
        url: 'https://gahwalaw.com',
        image: { src: '/images/works/site-gahwa.jpg', alt: '가화 법률사무소 공유 이미지.' },
      },
    ],
    decisions: [
      {
        title: '검색과 문의',
        problem: '사이트마다 검색에 노출되고, 방문 문의가 담당자에게 닿아야 했음',
        choice: '검색·문의 전환을 기준으로 페이지·메타데이터·구조화 데이터와 문의 폼을 구성함',
        result:
          '문의가 접수되면 담당자에게 이어지는 흐름을 화면에 연결함. 감탄누수·요셉씨의 빛자루·현중고차·시하디자인·건국마루·오남 리드앤톡은 상담·견적 문의가 SMS로 전달되도록 함',
        shots: [
          {
            src: '/images/works/brandweb-2-v2.png',
            alt: 'As-Is / To-Be. Metadata, sitemap, robots, JSON-LD로 검색과 AI가 읽게 한 흐름.',
            caption: '페이지·메타데이터·구조화 데이터로 검색엔진·AI가 페이지 관계를 구분합니다.',
            wide: true,
          },
        ],
      },
      {
        title: '작업 공간 나누기',
        problem:
          '사이트가 비슷한 시기에 여러 개 돌아가 브랜치와 작업 맥락이 섞였습니다.',
        choice:
          '여러 사이트를 동시에 진행할 때는 git worktree로 작업 공간을 나눠 맥락이 섞이지 않게 함',
        result: '사이트마다 작업 폴더를 나눠, 한 사이트를 고칠 때 다른 사이트 맥락이 섞이지 않게 했습니다.',
        shots: [
          {
            src: '/images/works/brandweb-3-v2.png',
            alt: 'As-Is / To-Be. 사이트·기능 단위 git worktree와 Cursor 역할 분리.',
            caption: '사이트마다 작업 폴더를 나눠, 한 사이트를 고칠 때 다른 사이트 맥락이 섞이지 않게 했습니다.',
            wide: true,
          },
        ],
      },
      {
        title: '공개 웹과 관리자를 같이',
        problem:
          '하나리더투어는 공개 웹과 관리자가 상품·문의·이미지를 같이 써야 했습니다. 관리자에는 고객 연락처가 보여, 정해진 담당자만 들어가야 했습니다.',
        choice:
          '두 앱이 Cloudflare D1과 R2를 공유합니다. 관리자 로그인은 직접 만들지 않고, Cloudflare Access로 허용한 이메일만 인증 코드를 받아 들어오게 했습니다.',
        result: '짧은 일정에도 연락처가 있는 화면은 먼저 닫아 두었습니다. 담당자가 바뀌면 허용 목록만 고칩니다.',
        shots: [
          {
            src: '/images/works/brandweb-4-v2.png',
            alt: 'As-Is / To-Be. 하나 공개 웹과 관리자가 D1·R2를 공유하고 Access로 관리자를 닫는 구조.',
            caption: '공개 웹과 관리자가 데이터와 이미지를 공유하고, 관리자는 허용 이메일만 들어옵니다.',
            wide: true,
          },
          {
            src: '/images/works/hana-admin-dashboard.png',
            alt: '하나리더투어 관리자 대시보드. 읽지 않은 문의, 상품, 힐링센터, 공지 수.',
            caption: '관리자에서 문의 확인부터 상품·힐링센터·공지 등록까지 처리합니다.',
          },
        ],
      },
    ],
    links: [
      { label: '감탄누수', url: 'https://gamtannusu.com' },
      { label: '요셉씨의 빛자루', url: 'https://jcct.co.kr/' },
      { label: '탑애드', url: 'https://toplawyermarketing.com' },
      { label: '현중고차', url: 'https://hyunjoongcar.com' },
      { label: '시하디자인', url: 'https://sihadesign.com' },
      { label: '건국마루', url: 'https://konkukflooring.com' },
      { label: '하나리더투어', url: 'https://hanaleadertour.or.kr' },
      { label: 'JL153', url: 'https://jl153.kr' },
      { label: '오남 리드앤톡', url: 'https://onamreadntalk.co.kr' },
      { label: '가화 법률사무소', url: 'https://gahwalaw.com' },
    ],
  },
  {
    slug: 'alleo',
    label: 'ALLEO',
    title: 'Alleo · AI 콘텐츠 제품',
    period: '2026.04 ~ 현재',
    role: '프론트엔드(소개 웹, 공개 블로그, 사용자 콘솔, 관리자 콘솔, SNS 연동). 화면에 필요한 API 일부 수정',
    oneLiner:
      '소개 웹·공개 블로그·사용자 콘솔에서 진단→발행 흐름과 SNS 연결 화면을 맡음.\n영업용 마케팅 사이트는 1인으로 만들어 구축 사례의 검색 성과를 링크로 보여 줌',
    homeLine: '분석 → 추적 → SNS 발행',
    stack: ['Next.js App Router', 'TypeScript', 'TanStack Query', 'Tailwind'],
    thumb: {
      src: '/images/works/card-alleo.png',
      alt: 'alleo 소개 화면. AI 검색에 브랜드가 먼저 나오도록 진단하는 입력창.',
    },
    compare: {
      src: '/images/works/alleo-1-v2.png',
      alt: 'As-Is / To-Be. 흩어진 분석을 리포트, 개선 포인트, AI 추천 추적 순서로 이은 흐름.',
    },
    entries: [
      { name: 'alleo.kr', note: '소개 웹', url: 'https://alleo.kr' },
      { name: 'marketing.alleo.pro', note: '영업용 마케팅 사이트', url: 'https://marketing.alleo.pro' },
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
    slug: 'tcc',
    label: 'BACKOFFICE',
    title: '중대재해 관리 운영자용 관리 화면',
    period: '2025.05 ~ 2026.02',
    role: '프론트엔드(동적 메뉴, 권한 훅, 조직 선택 모달, 테이블 CRUD)',
    oneLiner: '권한·메뉴·조직 선택을 공통 구조로 맞춤.\n권한 훅 약 90개 파일, 조직 모달 약 50개 화면에서 재사용 중',
    homeLine: '권한 훅 ~90개 파일 · 조직 모달 ~50개 화면',
    stack: ['Next.js (Pages Router)', 'TypeScript', 'React Query', 'Ant Design'],
    thumb: {
      src: '/images/works/card-tcc.png',
      alt: '중대재해 관리 운영자용 관리 화면. 사이드바와 차트, 목록 화면.',
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
    slug: 'money',
    label: 'MONEY',
    title: '[내 돈 어디갔지?] 가계부',
    period: '2026.02 ~ 현재',
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
  },
]

export const workBySlug = (slug: string | undefined): WorkItem | undefined =>
  WORKS.find((w) => w.slug === slug)
