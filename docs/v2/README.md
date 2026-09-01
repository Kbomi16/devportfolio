# 포트폴리오 v2 — Scroll Cinema 기획

> 기준일: 2026.08.31
> 브랜치: `v2` (v1은 `main`에 유지, v2 완성 후 main으로 병합)

김보미 포트폴리오 v2. R3F(React Three Fiber) 기반 풀페이지 스크롤 시네마.
superdesign "다크 레이블 포털 히어로" 드래프트를 골격으로, 순수 흑백 무드 안에서
3D 캐릭터(hip-vinyl-v2 스타일)가 전 구간의 주인공이 되는 원페이지 사이트.

핵심 시퀀스: **검은 문이 열리고 캐릭터가 달려옴 → 화이트로 반전된 무대에서 포즈
(좌: 3D, 우: 영문 네임 타이포) → 여기부터 포트폴리오 본문 → 클로즈에서 다시 검정.**

## 문서 인덱스

| 문서 | 내용 |
|------|------|
| [PLAN.md](./PLAN.md) | 기획서 본문 — 컨셉, 디자인 시스템, 페이지 구성, 스크롤 챕터별 흐름·애니메이션 |
| [TECH.md](./TECH.md) | 기술 골격 — 스택, 아키텍처, 폴더 구조, 성능 가드레일 |
| [ASSET-PIPELINE.md](./ASSET-PIPELINE.md) | 3D 캐릭터 에셋 파이프라인 — Tripo/Meshy → Mixamo → GLB 최적화 |
| [ROADMAP.md](./ROADMAP.md) | 구현 페이즈와 MVP 정의 |

## 핵심 레퍼런스

- 구조·감각: [lenis.dev](https://lenis.dev/), [oryzo.ai](https://oryzo.ai/) — 주인공 1개 + 스크롤이 챕터를 미는 구조
- 골격: superdesign 드래프트 (로컬 `letter/portfolio-sian/.superdesign/` — 포털 히어로, 스테이트먼트, 카탈로그, 로스터, 데이츠, 크롭 워드마크 클로즈)
- 무드: [portal hero](https://superdesign.dev/library/animated-landing-page-portal-hero-that-parts-to-uncover-a-full-bleed-image), [brutalist e-commerce](https://superdesign.dev/library/brutalist-e-commerce-page)
- 캐릭터 시안: `letter/sian-bomi-3d/04-explore/hip-vinyl-v2.png`
- 콘텐츠 원본: `letter/portfolio.md` (자소서 v5·프로젝트 사실 관계)
- PDF 포트폴리오: `letter/portfolio-sian/index.html` (별도 산출물, 사이트의 Resume 버튼과 연결)

## 확정된 결정

| 항목 | 결정 |
|------|------|
| 3D 주인공 | 나를 이미지화한 3D 캐릭터 (hip-vinyl-v2 스타일, 달려오는 등장) |
| 컬러 | 순수 흑백 + 지면 반전 리듬 (검정 포털 → 화이트 본문 → 검정 클로즈) |
| 히어로 이후 리빌 | 화이트 무대에서 캐릭터 포즈(왼쪽) + `KIM BOMI` 영문 네임 타이포(오른쪽) — 본문 시작의 표지 |
| 스택 | Vite + React + TypeScript 유지 |
| 라우팅 | 원페이지 + `/work/[slug]` 케이스 스터디 3장 |
| 아키텍처 | A안 — 풀페이지 고정 캔버스 + 스크롤 진행도 기반 시네마 (전 구간) |
| 3D 모델 소스 | Tripo AI / Meshy (image-to-3D) + Mixamo (리깅·애니메이션) |
