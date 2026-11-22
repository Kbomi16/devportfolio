/** 히어로에서 내린 크롬. 화면에는 안 쓰고, 문구 검사만 통과시킨다. */
export const HERO_CHROME = ['↓ SCROLL'] as const

export const HERO_VIDEO_SRC = '/video/hero.mp4'

export const HERO_IMAGE = {
  src: '/images/bomi-landing.jpg',
  alt: '웅크린 자세로 정면을 응시하는 3D 바이닐 피규어 — 포트폴리오 표지',
} as const

/** 속도 반응 마퀴 — 홈에서 내린 섹션(Marquee.tsx)용 */
export const MARQUEE_ROWS = [
  ['KIM BOMI · FRONTEND'],
  ['Make it. Leave it. Bring it back.', 'MAKER KIMBOMI'],
] as const

/** 노션 포폴 v3 About 헤드라인 */
export const HEADLINE =
  '기능을 만드는 일을 넘어, 문제를 정의하고 기획부터 결과까지 확인하는 프론트엔드 개발자 김보미입니다.'

/** 노션 포폴 v3 About 본문 (굵게 쓴 부분은 strong) */
export const ABOUT_PARAGRAPHS: { text: string; strong?: string }[] = [
  {
    text: '잘 모르는 걸 만나면 일단 적어 두고, 나중에 다시 꺼내 볼 수 있게 정리해 둬요. 나중에 헤매지 않으려고 남겨 둔 메모가 어느새 블로그 글 {strong}이 됐고, 지금은 그 습관이 문제와 범위를 나누고, AI에게 맡길 일과 제가 확인할 일을 정할 때도 이어지고 있어요.',
    strong: '100편 이상',
  },
  {
    text: '2025년 5월부터 주식회사 크로플에서 프론트엔드 개발자로 일하며, {strong}의 검색·문의와 관리 화면, 중대재해 관리 화면의 권한·메뉴, AI 콘텐츠 제품의 분석·발행 흐름을 맡았어요. 기능을 만드는 데 그치지 않고, 누가 어디서 불편한지를 먼저 본 뒤 화면과 범위를 정하고, 배포 이후에도 실제로 쓰이는 흐름을 다시 살펴요. 코드는 도구가 대신 작성할 수 있어도, 무엇을 만들지 정하고 결과가 맞는지 확인하는 일은 제가 해요.',
    strong: '기업·브랜드 웹 10종',
  },
]

export type Point = { title: string; body: string }

/** 노션 포폴 v3 「이렇게 일해요.」 */
export const WORK_STYLE: Point[] = [
  {
    title: '고객의 불편에서 문제를 정의해요.',
    body: '운영자용 관리 화면에서는 누가 어디까지 볼 수 있는지를, 브랜드 웹에서는 방문자가 어디서 문의로 이어지는지를, 가계부에서는 기능이 많아질수록 기록이 귀찮아진다는 점을 먼저 봤어요. 화면을 늘리기 전에 해결할 문제와 만들지 않을 범위를 정해요.',
  },
  {
    title: '기획부터 배포, 그다음 사용까지 이어서 봐요.',
    body: '기업·브랜드 웹은 기획 문서부터 화면·검색 설정·문의 연결·배포까지 이어서 진행했어요. 개인 가계부는 기획·화면·기능·배포·운영을 혼자 진행했고, 직접 쓰면서 할부·반복 지출을 더했어요. Alleo 영업용 마케팅 사이트는 1인으로 만들어, 구축 사례의 검색 성과를 링크로 보여 줄 수 있게 했어요. 회사 업무에서도 문의가 담당자에게 가는지, 관리 화면에 고객 연락처가 열려 있지는 않은지처럼 출시 이후 흐름까지 화면에 반영해요.',
  },
  {
    title: 'AI에게 맡길 일과 직접 판단할 일을 나눠요.',
    body: 'Cursor 에이전트와 역할별 서브에이전트, 스킬 파일로 반복 규칙을 전달하되, 결과는 가설로 보고 제가 확인해요. 권한·검색 설정·문의 연결처럼 서비스에 바로 영향을 주는 부분은 직접 보고, 반복되는 기준은 다시 스킬 파일로 남겨요.',
  },
]

/** 프리로더 인사 — 처음과 끝이 모두 안녕하세요 */
export const GREETINGS = [
  '안녕하세요',
  'Hello',
  'こんにちは',
  'Bonjour',
  'Hola',
  'Ciao',
  'Hallo',
  '你好',
  '안녕하세요',
] as const
