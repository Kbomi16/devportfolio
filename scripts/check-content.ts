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
  '만들고, 남기고, 다시 꺼내는 프론트엔드 개발자 김보미. 잘 모르는 건 적어 두고, 다음 작업에서 다시 꺼냅니다.',
  // Nav
  'KIM BOMI', 'contact me', 'mailto:bomi2172@gmail.com',
  "'소개'", "'프로젝트'", "'일하는 방식'", "'AI WORKFLOW'", "'blog'", "'contact'",
  // Hero
  '/video/hero.mp4', '/images/bomi-landing.jpg',
  '웅크린 자세로 정면을 응시하는 3D 바이닐 피규어 — 포트폴리오 표지',
  'KIM BOMI · FRONTEND', 'KROFFLE', 'SEOUL', 'Scroll', 'MI.',
  'FRONTEND', '만들고, 남기고, 다시 꺼내는 메이커', 'Make it. Leave it. Bring it back.',
  'DEVELOPER · SEOUL · 2026', 'YOU CAN HOVER NAV ↓', '↓ SCROLL', 'MAKER KIMBOMI',
  // Projects
  'PROJECTS', '권한은 막고, 검색은 붙이고,', '흐름은 이어 붙였습니다.', 'OPEN CASE →',
  // 일하는 방식
  '잘 모르는 걸 만나면 일단 적고,', '다시 꺼낼 수 있는 형태', '로 남깁니다.',
  '나중에 헤매지 않으려고 적어 둔 메모가 블로그 100편이 됐습니다.',
  '그 습관이 지금은 일하는 방식입니다.',
  '주식회사 크로플 · Frontend Developer', '2025.05 —',
  '중대재해 관리 백오피스 FE.\n메뉴·권한·조직 선택을 공통 구조로 묶었습니다.\n\n공개 웹 9종.\n다국어 주소, 검색, 문의까지 같은 규칙으로 맞췄습니다.\n\nAlleo AI SaaS.\n분석부터 글·발행까지 이어지는 콘솔 프론트를 맡았습니다.',
  '코드잇 프론트엔드 부트캠프 · 팀장', '2024.03 — 08',
  '팀장으로 스크럼 회의를 진행하고, 리뷰만 보는 시간을 따로 두어 리뷰가 끊기지 않게 했습니다.',
  '명지전문대학교 전공심화', '2023.03 — 2024.02', '정보통신공학과 전공심화 과정. 학점 4.00 / 4.50.',
  '명지전문대학 정보통신공학과', '2020.03 — 2023.02', '정보통신공학과 졸업. 학점 3.76 / 4.50.',
  '학습 포트폴리오 공모전 「보미의 갓생 라이프」 은상', '2023.07',
  '「보미의 갓생 라이프」. 투두 앱으로 일과를 나눠, 자격증을 따고 멘토링까지 시간을 알차게 쓴 학습 기록입니다.',
  '학과 캡스톤 디자인 대회 은상 · 향수 추천 쇼핑몰', '2023.12',
  'Fumease. 키워드 색으로 취향을 고르면 OpenAI가 향수를 추천하고, 그 결과에서 바로 살 수 있게 만든 쇼핑몰입니다.',
  '정보처리산업기사', '2022.11', '한국산업인력공단 · 최종합격.',
  '정보통신공학과 학생회장', '2022.03 — 12', '명지전문대학교 정보통신공학과 학생회장.',
  '명지튜터링 · 인터넷 프로그래밍 튜터', '2021.09 — 12', '신입생 대상 HTML/CSS, 웹 기초를 맡았습니다.',
  "'NOW'", "'CAMP'", "'DEGREE'", "'AWARD'", "'CERT'", "'LEAD'", "'TUTOR'",
  // AI WORKFLOW
  'AI WORKFLOW · CURSOR', '잘 아는 쪽이', '파일럿이어야 합니다.',
  'Cursor로 코드를 많이 맡기지만, AI가 빨라졌다고 공부를 빼지 않습니다. 제가 그 일을 알고 있어야 나온 코드가 맞는지 볼 수 있습니다.',
  'RULES FIRST', '시키기 전에 쓰는 스킬 파일과 지금 구조를 먼저 넘깁니다.\n규칙 없이 맡기면 파일 위치부터 같은 이유로 여러 번 고치게 됩니다.',
  '/images/pilot/01-rules-first.png', 'GitHub에 올려 둔 FE-STYLE 스킬 파일. 시키기 전에 넘기는 규칙이다.',
  'SPLIT WORKTREES', '사이트가 여러 개면 작업 폴더부터 나눕니다.\n기업·브랜드 웹을 한 창에서 고치면 문구와 기능이 섞여, git worktree로 사이트마다 엽니다.',
  '/images/pilot/02-worktrees.png', '기업·브랜드 웹을 사이트마다 폴더와 Cursor 창으로 나눈 git worktree.',
  'ONE SESSION, ONE JOB', '기획 → 구현 → 검수. 한 세션에는 한 가지만 맡깁니다.\n한꺼번에 시키면 어디까지가 맞는지 볼 수 없습니다.',
  '/images/pilot/03-session.png', '기획 PLAN, 구현 BUILD, 검수 CHECK를 한 세션에 한 가지씩 나눈 순서.',
  'FLOW BEFORE PROMPT', '기능을 들으면 상태·화면·API 흐름을 먼저 그려 보고, 그다음 맡깁니다.\n나온 결과가 맞는지는 제가 보고, 공부한 건 글로 남깁니다.',
  '/images/pilot/04-flow.png', 'Alleo에서 사이트 분석이 끝나야 글을 만들고 블로그와 SNS로 이어지는 화면 흐름.',
  'VERIFY & WRITE', 'AI 속도에 맞춰 만들되, 확인과 기록은 제 몫입니다.\n혼자 작업할 때도 이 루틴이 있어, 같은 수정을 반복하지 않습니다.',
  '/images/pilot/05-write.png', '헤맸던 지점을 다시 꺼내 보도록 남긴 개발 블로그, 보리의 FE 개발 노트.',
  '반복 규칙은 스킬 파일로 → GitHub', 'https://github.com/Kbomi16/ai-skills',
  'FE-STYLE · SEO-AUDIT · GIT SUMMARY', '닫기',
  // Journal
  'JOURNAL · 100+', '적어두면,', '다음이 짧아집니다.',
  '거창한 나눔보다, 다음에 제가 다시 읽는 메모에 가깝습니다.', 'READ →',
  'BFF로 토큰을 감싸는 구조', 'URL이 남는 모달 — Parallel Routes', 'Next.js Image 컴포넌트 톺아보기',
  'https://bori-note.tistory.com/', 'https://bori-note.tistory.com/117',
  // Contact
  'Contact', 'bomi2172@gmail.com', "'GitHub'", 'https://github.com/Kbomi16', "'Resume'",
  'https://volcano-fisherman-e31.notion.site/31a3307fa7e6803cb79de92068674178',
  '© 2026 KIM BOMI', 'BOMI.',
  // 상세 페이지 라벨
  '문제', '선택', '결과', '구성', '열기 ↗', '테스트 계정', '← 홈', '다른 케이스',
  'NEXT', 'PREV', '← OPEN CASE', '← PROJECTS',
]

const missing = REQUIRED.filter((needle) => !corpus.includes(normalize(needle)))

if (missing.length > 0) {
  console.error(`누락 ${missing.length}건`)
  missing.forEach((needle) => console.error(`  - ${needle}`))
  process.exit(1)
}

console.log(`OK — ${REQUIRED.length}개 문구 확인`)
