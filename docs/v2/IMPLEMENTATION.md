# 포트폴리오 v2.1 "Film & Stage" — Implementation Plan (재작성)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** PLAN.md v2.1 — R3F 3D 씬을 제거하고, 영상 스크럽 히어로 + landing 시안 패럴랙스 표지 + GSAP/motion 인터랙티브 섹션으로 전환한다.

**Architecture:** 일반 문서 흐름의 섹션 스택. 핀·스크럽은 GSAP ScrollTrigger, 스무스 스크롤은 Lenis(ticker 동기화), 마이크로 인터랙션은 motion. 전역 상태 스토어 없음 — 포인터는 CSS 변수(`--mx`/`--my`), 스크롤은 ScrollTrigger가 소유.

**Tech Stack:** bun · Vite · React 19 · TS · gsap + @gsap/react · motion · lenis · react-router-dom 7

## Global Constraints

- 컬러 토큰·타이포·FE-STYLE 규칙은 v2와 동일 (`.cursor/rules/fe-style.mdc` 적용본)
- GSAP·motion 도입은 사용자 지시로 승인됨 (2026.09.05)
- 스크롤 바인딩 = scrub(역재생), 텍스트 리빌 = 1회성
- 패키지 매니저 bun만. 검증은 `bun run build` + dev 육안
- 태스크마다 gitmoji 한국어 커밋

## 파일 맵

```
public/
├─ images/bomi-landing.jpg     # CH2 표지 시안 (기존)
└─ video/hero.mp4              # CH1 필름 (스크럽용 all-intra 인코딩)
src/
├─ main.tsx · app/router.tsx   # 유지
├─ styles/global.css           # 토큰 유지, --p 제거, 지면 반전 클래스 추가
├─ styles/sections.css         # 섹션 스타일 (overlay.css 대체)
├─ lib/
│  ├─ useLenis.ts              # Lenis + ScrollTrigger ticker 동기화 (재작성)
│  ├─ usePointer.ts            # --mx/--my 발행 (zustand 제거)
│  └─ motion.ts                # prefersReducedMotion만 유지
├─ content/works.ts            # 유지
├─ sections/
│  ├─ Film.tsx                 # CH1: 문 + 스크럽 영상 (pin)
│  ├─ Landing.tsx              # CH2: 패럴랙스 표지 (pin)
│  ├─ Gallery.tsx              # CH3: 가로 스크롤 워크 갤러리 (pin)
│  ├─ Method.tsx · Journal.tsx · Close.tsx   # GSAP 리빌로 이식
├─ overlay/Nav.tsx             # 앵커 대상만 id 앵커로 변경
└─ pages/Home.tsx · Work.tsx
삭제: src/scene/* · lib/progress.ts · lib/pointer.ts · overlay/{Portal,Reveal,WorkLabels,LandingFigure,useReveal,Method,Journal,Close}.*
```

### Task 1: 문서·에셋·의존성 리셋

- [ ] PLAN.md v2.1 재작성 (완료), ASSET-PIPELINE.md 영상 파이프라인으로 재작성, ROADMAP.md 갱신
- [ ] `public/video/hero.mp4` — 원본 재인코딩(all-intra, 1280px, 무음). 실패 시 원본 복사
- [ ] `bun remove three @react-three/fiber @react-three/drei @types/three zustand` + `bun add gsap @gsap/react motion`
- [ ] 커밋: `📝 docs: v2.1 Film & Stage 기획 재작성` / `🔧 chore: 3D 스택 제거, GSAP·motion 도입`

### Task 2: lib 재작성 (Lenis↔ScrollTrigger, pointer)

- [ ] useLenis: `gsap.ticker`로 `lenis.raf` 구동, `lenis.on('scroll', ScrollTrigger.update)`, `lagSmoothing(0)`. reduced-motion이면 미기동
- [ ] usePointer: zustand 제거, CSS 변수만 발행 (lerp 유지)
- [ ] scene/·progress.ts·keyframes 삭제
- [ ] 커밋: `♻️ refactor: 3D 씬 삭제 + GSAP 스크롤 파이프라인`

### Task 3: CH1 Film (문 + 스크럽 영상)

- [ ] 포털 마크업 이식(패널·워드마크·도트·코너) — CSS 변수 대신 GSAP 타임라인이 구동
- [ ] pinned 타임라인: 문 열림(0–0.18) → `video.currentTime` 스크럽(0.12–0.94, loadedmetadata 후 duration 바인딩) → 화이트 아웃(0.94–1)
- [ ] 폴백: reduced-motion·metadata 실패 → 문 열린 상태 + `video.play()` 1회
- [ ] 커밋: `✨ feat: CH1 필름 히어로 (문 개폐 + 영상 스크롤 스크럽)`

### Task 4: CH2 Landing (패럴랙스 표지, pin)

- [ ] 5레이어 깊이(그림자·뒤 볼륨·카드·하이라이트·타이포) — `--mx`/`--my` 바인딩, PLAN §4 CH2 표 준수
- [ ] pin +=120%: 진입 시 카드 정착(스케일), 릴리스 후 자연 스크롤 아웃
- [ ] 우측 스택: FRONTEND / KIM BOMI. / 프론트엔드 개발자 김보미 / 영문 한 줄 / 메타
- [ ] 커밋: `✨ feat: CH2 랜딩 표지 (5레이어 마우스 패럴랙스 + pin)`

### Task 5: CH3 Gallery (가로 스크롤)

- [ ] 검은 패널 3장(works.ts 라벨·homeLine), containerAnimation(`ease:none`) + pin
- [ ] motion 호버 틸트/부상, 클릭 → 블랙 페이드 → `/work/[slug]`, 복귀 시 스크롤 복원
- [ ] 커밋: `✨ feat: CH3 가로 스크롤 갤러리`

### Task 6: CH4–6 + 지면 반전 + 폴백

- [ ] Method·Journal·Close를 sections/로 이식, useReveal → GSAP 1회성 리빌
- [ ] 지면 반전: Landing 진입(검→흰)·Close 진입(흰→검) ScrollTrigger 클래스 토글
- [ ] Nav 앵커를 element 기반 `lenis.scrollTo`로 변경, Close 카피에서 3D 문구 제거
- [ ] reduced-motion 정적 스택 확인, `bun run build` 통과
- [ ] 커밋: `✨ feat: CH4–6 GSAP 리빌 + 지면 반전 + 폴백`
