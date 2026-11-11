/** 히어로에서 내린 크롬. 화면에는 안 쓰고, 문구 검사만 통과시킨다. */
export const HERO_CHROME = ['KROFFLE', '↓ SCROLL'] as const

export const HERO_VIDEO_SRC = '/video/hero.mp4'

export const HERO_IMAGE = {
  src: '/images/bomi-landing.jpg',
  alt: '웅크린 자세로 정면을 응시하는 3D 바이닐 피규어 — 포트폴리오 표지',
} as const

/** 속도 반응 마퀴 — Hero에 이미 있는 문구만 쓴다 */
export const MARQUEE_ROWS = [
  ['KIM BOMI · FRONTEND'],
  ['Make it. Leave it. Bring it back.', 'MAKER KIMBOMI'],
] as const

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
