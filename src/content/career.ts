export type CareerItem = {
  title: string
  period: string
  role: string
  stack: string
  /** 숫자·라이브처럼 있는 항목만 */
  extra?: { label: string; text: string }[]
  live?: { label: string; url: string }[]
  problem: string
  choice: string
  after: string
}

/** 노션 포폴 v3 경력 — 주식회사 크로플 */
export const COMPANY = {
  name: '주식회사 크로플 · Frontend Developer',
  period: '2025.05 ~ 현재',
  summary:
    '중대재해 관리 운영자용 관리 화면에서 시작해, 회사 공식 웹, 기업·브랜드 웹 10종과 AI 콘텐츠 제품까지 프론트엔드 담당. 주어진 기능을 구현하는 데서 나아가, 누구의 어떤 불편인지 정의하고 화면·범위·배포 이후 흐름까지 이어서 봄',
} as const

export const CAREER: CareerItem[] = [
  {
    title: '중대재해 관리 운영자용 관리 화면 · 권한·메뉴·조직 선택',
    period: '2025.05 ~ 2026.02',
    role: '프론트엔드(동적 메뉴, 권한 훅, 조직 선택 모달, 테이블 CRUD)',
    stack: 'Next.js (Pages Router), TypeScript, React Query, Ant Design',
    extra: [{ label: '숫자', text: '권한 훅 약 90개 파일, 조직 모달 약 50개 화면에서 재사용 중' }],
    problem:
      '메뉴가 프론트 코드에 고정되어 변경 때마다 재배포가 필요했고, 사이드바에서 숨긴 화면도 주소만 알면 들어갈 수 있었음. 조회·수정·승인 권한 확인이 화면마다 달라 운영자가 자기 권한에 맞는 화면만 보기 어려웠음',
    choice:
      '서버에서 받은 메뉴로 사이드바를 구성하고, 페이지 진입 시 menuId로 권한을 다시 확인함. 권한 확인은 훅 하나로, 조직·사람 선택은 공통 모달로 모음',
    after:
      '정책이 바뀌면 훅과 권한 코드 위주로 수정하면 되고, 운영자는 어느 화면에서든 같은 기준으로 자기 권한에 맞는 버튼만 보게 됨',
  },
  {
    title: '크로플 공식 웹 · 다국어·문의',
    period: '2026.01 ~ 현재',
    role: '프론트엔드(다국어, 문의 화면, 브랜드 인터랙션)',
    stack: 'Next.js, TypeScript, next-intl, GSAP, Tailwind',
    live: [{ label: 'kroffle.com', url: 'https://www.kroffle.com' }],
    problem:
      '한국어뿐 아니라 영어·일본어·중국어로 같은 서비스 정보를 주어야 했고, 문구만 번역하면 주소·메뉴·메타데이터가 어긋날 수 있었음. 문의 첨부를 서버를 거쳐 올리던 방식에서는 용량 제한에 걸려 접수가 막히는 경우가 있었음',
    choice:
      'next-intl로 언어별 주소를 나누고, 본문·메뉴·문의 문구와 메타데이터를 같은 번역 데이터로 맞춤. 문의는 단계형 질문으로 구성하고, 첨부는 브라우저에서 바로 올리도록 바꿔 파일당 20MB·최대 10개까지 받을 수 있게 함',
    after:
      '주소부터 화면 내용, 메타데이터까지 하나의 언어 규칙으로 보게 됨. 문의 첨부가 용량 제한에 걸려 멈추는 문제를 화면 흐름 안에서 해결함',
  },
  {
    title: '기업·브랜드 웹 10종 · 검색·문의·관리 화면',
    period: '2026.06 말 ~ 2026.11 (사이트별 구축·운영 기간 상이)',
    role: '프론트엔드(공개 웹 10종, SEO/AEO·GEO, 문의 연결, 하나리더투어 관리 화면)',
    stack: 'Next.js, TypeScript, Tailwind, GSAP, Motion, Solapi, Cloudflare D1·R2·Access',
    problem:
      '사이트마다 검색에 노출되고, 방문 문의가 담당자에게 닿아야 했음. 하나리더투어 관리 화면에는 고객 연락처가 보여, 정해진 담당자만 들어갈 수 있어야 했음',
    choice:
      '검색·문의 전환을 기준으로 페이지·메타데이터·구조화 데이터와 문의 폼을 구성함. 여러 사이트를 동시에 진행할 때는 git worktree로 작업 공간을 나눠 맥락이 섞이지 않게 함. 하나리더투어 관리 화면은 로그인을 직접 만들지 않고, Cloudflare Access 허용 이메일에 관리자만 두고 이메일 인증 코드로 들어가게 함',
    after:
      '문의가 접수되면 담당자에게 이어지는 흐름을 화면에 연결함. 감탄누수·요셉씨의 빛자루·현중고차·시하디자인·건국마루·오남 리드앤톡은 상담·견적 문의가 SMS로 전달되도록 함',
  },
  {
    title: 'Alleo · AI 콘텐츠 제품',
    period: '2026.04 ~ 현재',
    role: '프론트엔드(소개 웹, 공개 블로그, 사용자 콘솔, 관리자 콘솔, SNS 연동). 화면에 필요한 API 일부 수정',
    stack: 'Next.js App Router, TypeScript, TanStack Query, Tailwind',
    live: [
      { label: 'alleo.kr', url: 'https://alleo.kr' },
      { label: 'marketing.alleo.pro', url: 'https://marketing.alleo.pro' },
    ],
    problem:
      '분석 리포트가 없는데 추적부터 쓰면 잘못된 판단으로 이어질 수 있었음. 영업은 검색 성과를 데이터 없이 설명해야 했고, SNS 연동은 콜백 주소가 조금만 달라도 중간에 끊겼음',
    choice:
      '최근 분석 리포트가 없으면 추적을 바로 쓰지 못하게 해 진단→개선→추적 순서로 쓰게 함. 블로그 생성·에디터·발행에서 SNS 채널 연결까지 콘솔 흐름을 이음. 소개 웹·콘솔·마케팅 사이트가 섞이지 않게 git worktree로 앱별 작업 공간을 나눔',
    after: '영업용 마케팅 사이트를 만들어, 구축 사례별 검색 성과를 링크로 보여 줄 수 있게 함',
  },
]
