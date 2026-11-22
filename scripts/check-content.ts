import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const collect = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) return collect(path)
    return /\.(tsx?|html)$/.test(name) ? [path] : []
  })

const normalize = (text: string): string =>
  text.replace(/\\n/g, ' ').replace(/\s+/g, ' ').trim()

const corpus = normalize(
  [...collect('src'), 'index.html'].map((file) => readFileSync(file, 'utf8')).join('\n'),
)

const REQUIRED: string[] = [
  // 메타
  '김보미 — Frontend Developer',
  '기능을 만드는 일을 넘어, 문제를 정의하고 기획부터 결과까지 확인하는 프론트엔드 개발자 김보미입니다.',
  'https://kimbomi-devportfolio.netlify.app/', 'og:image', 'summary_large_image', 'rel="canonical"',
  // Nav
  'KIM BOMI', 'contact me', 'mailto:bomi2172@gmail.com',
  "'소개'", "'프로젝트'", "'경력'", "'AI WORKFLOW'", "'skills'", "'blog'", "'contact'",
  // About · 이렇게 일해요 (노션 포폴 v3)
  '이렇게 일해요.', '고객의 불편에서 문제를 정의해요.', '기획부터 배포, 그다음 사용까지 이어서 봐요.',
  'AI에게 맡길 일과 직접 판단할 일을 나눠요.', '100편 이상', '기업·브랜드 웹 10종',
  // Projects
  'PROJECTS', '중대재해 관리 운영자용 관리 화면', 'Alleo · AI 콘텐츠 제품', '[내 돈 어디갔지?] 가계부',
  '2026.06 말 ~ 2026.11',
  'https://gamtannusu.com', 'https://jcct.co.kr/', 'https://toplawyermarketing.com', 'https://hyunjoongcar.com',
  'https://sihadesign.com', 'https://konkukflooring.com', 'https://hanaleadertour.or.kr', 'https://jl153.kr',
  'https://onamreadntalk.co.kr', 'https://gahwalaw.com', 'https://alleo.kr', 'https://marketing.alleo.pro',
  // 경력
  '주식회사 크로플 · Frontend Developer', '2025.05 ~ 현재',
  '중대재해 관리 운영자용 관리 화면 · 권한·메뉴·조직 선택', '크로플 공식 웹 · 다국어·문의',
  '기업·브랜드 웹 10종 · 검색·문의·관리 화면',
  // 학력 · 수상 · 자격증
  '명지전문대학교 정보통신공학과 전공심화 (졸업)', '명지전문대학 정보통신공학과 (졸업)',
  '명지전문대학교 정보통신공학과 학술제 은상', '학습 포트폴리오 공모전 「보미의 갓생 라이프」 은상',
  '정보처리산업기사', '최종합격 · 한국산업인력공단',
  // AI · Skills
  'AI 옆에서도,', '이렇게 만들어요.', '올해 들어 새로 생긴 생각', '원래부터 갖고 있던 생각',
  '익숙해요', '써봤어요', '일할 때 쓰는 AI', 'https://github.com/Kbomi16/ai-skills',
  // Journal
  'JOURNAL · 100+', 'https://bori-note.tistory.com/103', 'https://bori-note.tistory.com/107',
  'https://bori-note.tistory.com/117',
  // Contact
  'Contact', "'GitHub'", "'Blog'", "'Resume'", 'https://bori-note.tistory.com/',
  'https://volcano-fisherman-e31.notion.site/Frontend-Developer-31a3307fa7e6803cb79de92068674178',
  '© 2026 KIM BOMI', 'BOMI.',
  // 상세 페이지 라벨
  '문제', '선택', '이후', '구성', '열기 ↗', '← 홈', '다른 케이스',
]

/** v3에서 뺀 항목·금지 문자열. 화면 소스 어디에도 남으면 안 된다. */
const FORBIDDEN: RegExp[] = [
  /\buseMe\b/, /\buseme\b/i, /모이섬/, /exproject\.work/, /고야차트/, /홈앤힐/, /workers\.dev/,
  /\/\/alleo\.pro/, /console\.alleo\.pro/, /테스트 계정/, /testAccount/,
  /volcano-fisherman-e31\.notion\.site\/31a3307fa7e6803cb79de92068674178/,
]

const found = FORBIDDEN.filter((pattern) => pattern.test(corpus))
if (found.length > 0) {
  console.error(`금지 문자열 ${found.length}건`)
  found.forEach((pattern) => console.error(`  - ${pattern}`))
  process.exit(1)
}

const missing = REQUIRED.filter((needle) => !corpus.includes(normalize(needle)))

if (missing.length > 0) {
  console.error(`누락 ${missing.length}건`)
  missing.forEach((needle) => console.error(`  - ${needle}`))
  process.exit(1)
}

console.log(`OK — ${REQUIRED.length}개 문구 확인`)
