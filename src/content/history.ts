export type HistoryRow = {
  tag: string
  name: string
  meta: string
  note: string
}

export const HISTORY: HistoryRow[] = [
  {
    tag: 'NOW',
    name: '주식회사 크로플 · Frontend Developer',
    meta: '2025.05 —',
    note:
      '중대재해 관리 백오피스 FE.\n메뉴·권한·조직 선택을 공통 구조로 묶었습니다.\n\n공개 웹 9종.\n다국어 주소, 검색, 문의까지 같은 규칙으로 맞췄습니다.\n\nAlleo AI SaaS.\n분석부터 글·발행까지 이어지는 콘솔 프론트를 맡았습니다.',
  },
  {
    tag: 'CAMP',
    name: '코드잇 프론트엔드 부트캠프 · 팀장',
    meta: '2024.03 — 08',
    note: '팀장으로 스크럼 회의를 진행하고, 리뷰만 보는 시간을 따로 두어 리뷰가 끊기지 않게 했습니다.',
  },
  {
    tag: 'DEGREE',
    name: '명지전문대학교 전공심화',
    meta: '2023.03 — 2024.02',
    note: '정보통신공학과 전공심화 과정. 학점 4.00 / 4.50.',
  },
  {
    tag: 'DEGREE',
    name: '명지전문대학 정보통신공학과',
    meta: '2020.03 — 2023.02',
    note: '정보통신공학과 졸업. 학점 3.76 / 4.50.',
  },
  {
    tag: 'AWARD',
    name: '학습 포트폴리오 공모전 「보미의 갓생 라이프」 은상',
    meta: '2023.07',
    note: '「보미의 갓생 라이프」. 투두 앱으로 일과를 나눠, 자격증을 따고 멘토링까지 시간을 알차게 쓴 학습 기록입니다.',
  },
  {
    tag: 'AWARD',
    name: '학과 캡스톤 디자인 대회 은상 · 향수 추천 쇼핑몰',
    meta: '2023.12',
    note: 'Fumease. 키워드 색으로 취향을 고르면 OpenAI가 향수를 추천하고, 그 결과에서 바로 살 수 있게 만든 쇼핑몰입니다.',
  },
  {
    tag: 'CERT',
    name: '정보처리산업기사',
    meta: '2022.11',
    note: '한국산업인력공단 · 최종합격.',
  },
  {
    tag: 'LEAD',
    name: '정보통신공학과 학생회장',
    meta: '2022.03 — 12',
    note: '명지전문대학교 정보통신공학과 학생회장.',
  },
  {
    tag: 'TUTOR',
    name: '명지튜터링 · 인터넷 프로그래밍 튜터',
    meta: '2021.09 — 12',
    note: '신입생 대상 HTML/CSS, 웹 기초를 맡았습니다.',
  },
]
