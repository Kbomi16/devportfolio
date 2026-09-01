# 포트폴리오 v2 Scroll Cinema — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** PLAN.md의 스크롤 시네마(검은 포털 → 화이트 리빌 → 갤러리 → 클로즈)를 Vite + R3F로 구현한다. 캐릭터 GLB가 준비되기 전까지 프로시저럴 스탠드인으로 전 구간을 완성한다.

**Architecture:** 고정 WebGL 캔버스 1장 + 800vh 유령 스크롤 트랙 + HTML 오버레이. Lenis가 progress(0~1)를 zustand 스토어에 쓰고, 씬은 `keyframes.ts` 단일 테이블을 보간해 카메라·캐릭터·지면 반전을 구동한다. 텍스트 리빌은 IntersectionObserver 1회성.

**Tech Stack:** bun · Vite 7 · React 19 · TypeScript · three + @react-three/fiber 9 + drei · lenis · zustand · react-router-dom 7

## Global Constraints

- 컬러는 PLAN.md §2.1 토큰만 사용. 액센트 컬러 금지 (아웃라인·헤어라인·반전으로 처리)
- 폰트: Syne(디스플레이) · Sora(UI 라벨) · SUIT Variable(한글). Pretendard·세리프 금지
- 스크롤 바인딩 요소는 타이머 금지 — progress 순수 함수. 역스크롤 시 완전 역재생
- 텍스트 리빌은 1회성 (다시 사라지지 않음)
- 콘텐츠는 `letter/portfolio.md`의 사실만. 인용·수상·로고 발명 금지
- 캐릭터는 스탠드인이어도 `clip` 인터페이스(`Run|Pose|Walk|Idle|Jump`)를 유지해 GLB 교체가 drop-in이 되게 한다
- 패키지 매니저는 **bun만** 사용. `npm` / `yarn` / `pnpm` / `npx` 금지. 설치는 `bun install`, 스크립트는 `bun run …`, 일회성 CLI는 `bunx`. lockfile은 `bun.lock`만 커밋 (`package-lock.json`·`yarn.lock` 삭제)
- **FE-STYLE (이 브랜치 적용본):** `.cursor/rules/fe-style.mdc`를 작성·검수 기준으로 한다. Next.js RSC / `app/_components` / Tailwind / shadcn / React Query는 가져오지 않는다
  - 메인 컴포넌트 `export default function`, 하위 React 컴포넌트 `function`, 그 외(훅·핸들러·유틸)는 화살표 함수
  - 타입은 `type`만 (`interface` 금지)
  - 핸들러는 `handle*` 접두사. 클라이언트 선언 순서: useState → useRef → 커스텀 훅 → handle* → effect → JSX
  - 스타일은 `global.css` 토큰만. 렌더 본문 안 컴포넌트 선언 금지
  - Lenis·R3F·CSS 시네마는 PLAN 범위로 승인됨. GSAP/framer-motion 등 새 모션 라이브러리는 동의 없이 추가 금지
- 검증: `bun run build`(tsc + vite) 통과 + `bun run dev` 육안 확인. 테스트 러너는 도입하지 않는다(시각 프로젝트, YAGNI)
- 태스크마다 gitmoji 한국어 커밋

## 파일 맵 (전체)

```
index.html                    # 폰트 프리로드·타이틀·OG (수정)
package.json                  # 의존성 리셋 (수정)
vite.config.ts                # 유지
src/
├─ main.tsx                   # 엔트리 (라우터 마운트)
├─ app/router.tsx             # / · /work/:slug
├─ styles/global.css          # 토큰·리셋·폰트·유틸 (단일 CSS)
├─ lib/
│  ├─ progress.ts             # zustand: { p } + setP. getState() 직접 읽기용
│  ├─ useLenis.ts             # Lenis 초기화 → progress 기록 + CSS 변수 --p
│  └─ motion.ts               # prefersReducedMotion() · chapterAt(p)
├─ content/works.ts           # Work 3건 데이터 (홈 라벨 + 케이스 본문)
├─ scene/
│  ├─ CinemaCanvas.tsx        # <Canvas> fixed 래퍼 (dpr cap, WebGL 실패 폴백)
│  ├─ keyframes.ts            # ★ 키프레임 테이블 + sample(p) 보간
│  ├─ CameraRig.tsx           # sample(p).cam → damp
│  ├─ Stage.tsx               # 라이트·포그·바닥 + 지면 반전(배경색 lerp)
│  ├─ Character.tsx           # 스탠드인 마네킹 + clip 절차 모션
│  └─ exhibits/Exhibits.tsx   # TCC 큐브 · SITES 패널 · ALLEO 와이어 + 호버/클릭
├─ overlay/
│  ├─ Nav.tsx                 # difference 블렌드 고정 내비
│  ├─ Portal.tsx              # CH1: 패널 2장·워드마크·코너 메타·도트
│  ├─ Reveal.tsx              # CH2: 영문 네임 스택
│  ├─ WorkLabels.tsx          # CH3: 전시물 타이포
│  ├─ Method.tsx              # CH4: 일하는 방식 + 로스터 + 데이츠
│  ├─ Journal.tsx             # CH5: 기록
│  ├─ Close.tsx               # CH6: 컨택트 + 크롭 워드마크
│  └─ useReveal.ts            # IntersectionObserver 1회 리빌 훅
└─ pages/
   ├─ Home.tsx                # 트랙 + Canvas + Overlay 조립
   └─ Work.tsx                # /work/:slug 템플릿
```

## 핵심 인터페이스 (태스크 간 계약)

```ts
// lib/progress.ts
export const useProgress = create<{ p: number; setP: (v: number) => void }>(...);
// 씬은 useFrame에서 useProgress.getState().p 로 읽는다 (리렌더 없음)

// scene/keyframes.ts
export type Clip = 'Run' | 'Pose' | 'Walk' | 'Idle' | 'Jump';
export type Sample = {
  camPos: [number, number, number];
  camLook: [number, number, number];
  charPos: [number, number, number];
  charRotY: number;
  clip: Clip;
  ground: number; // 0 = 검정, 1 = 화이트
};
export const sample = (p: number): Sample => { /* 키프레임 선형 보간 */ };

// lib/motion.ts
export type Chapter = 'portal' | 'reveal' | 'work' | 'roster' | 'journal' | 'close';
export const chapterAt = (p: number): Chapter => { /* ... */ };
// 경계: 0.14 / 0.26 / 0.58 / 0.74 / 0.86

// content/works.ts
export type WorkItem = {
  slug: 'tcc' | 'sites' | 'alleo';
  title: string; label: string; period: string; oneLiner: string;
  stack: string[]; problem: string; choice: string; result: string;
  learned: string; links: { label: string; url: string }[];
};
```

## 챕터 ↔ 트랙 오프셋 (오버레이 배치 기준)

트랙 높이 800vh. 오버레이는 트랙 내 `top: N%` 절대 배치 (스크롤과 함께 자연 통과).

| 챕터 | progress | 트랙 top |
|------|----------|----------|
| CH1 PORTAL (fixed, p<0.15에서만 표시) | 0.00–0.14 | — |
| CH2 REVEAL | 0.14–0.26 | 16% |
| CH3 WORK 라벨 3개 | 0.26–0.58 | 31% / 41% / 51% |
| CH4 METHOD·ROSTER·DATES | 0.58–0.74 | 59% |
| CH5 JOURNAL | 0.74–0.86 | 75% |
| CH6 CLOSE | 0.86–1.00 | 88% |

---

### Task 1: 프로젝트 리셋

**Files:** `package.json`(재작성) · `index.html`(재작성) · `src/` v1 전체 삭제 · `tailwind.config.js`·`postcss.config.js`·`yarn.lock`·`package-lock.json` 삭제 · `src/styles/global.css` 생성

- [x] v1 소스·설정 삭제, package.json 재작성 (react 19 / vite 7 / three·r3f·drei·lenis·zustand·react-router-dom 7)
- [x] `bun install` 성공 (`bun.lock` 생성)
- [x] `index.html`: lang=ko, 타이틀 `김보미 — Frontend Developer`, Syne·Sora Google Fonts + SUIT jsdelivr CSS
- [x] `global.css`: PLAN §2.1 토큰, 리셋, 셀렉션·포커스 스타일
- [x] 커밋: `🔧 chore: v2 기반 리셋 (React 19 + R3F 스택)`

### Task 2: lib — progress 스토어 + Lenis

**Files:** `src/lib/progress.ts` · `src/lib/useLenis.ts` · `src/lib/motion.ts`

**Produces:** `useProgress` · `useLenis(trackRef)` · `chapterAt(p)` · `prefersReducedMotion()`

- [x] zustand 스토어, Lenis 훅(rAF 루프, `--p` CSS 변수를 `document.documentElement`에 기록)
- [x] reduced-motion이면 Lenis 미기동 (네이티브 스크롤)
- [x] 커밋: `✨ feat: Lenis 진행도 파이프라인`

### Task 3: 라우터 + Home 뼈대

**Files:** `src/main.tsx` · `src/app/router.tsx` · `src/pages/Home.tsx` · `src/scene/CinemaCanvas.tsx`

**Consumes:** `useLenis` · **Produces:** Home 레이아웃 (`.track` 800vh + fixed Canvas + overlay 슬롯)

- [x] 라우터 2장(`/`, `/work/:slug` 임시 스텁), Canvas fixed 마운트(dpr cap 2), 진행도 % 디버그 표시
- [x] 확인: 스크롤 시 % 가 0→100 왕복
- [x] 커밋: `✨ feat: 라우터·800vh 트랙·고정 캔버스 뼈대`

### Task 4: keyframes + CameraRig + Stage(지면 반전)

**Files:** `src/scene/keyframes.ts` · `src/scene/CameraRig.tsx` · `src/scene/Stage.tsx`

**Consumes:** `useProgress` · **Produces:** `sample(p)` (위 인터페이스)

- [x] PLAN §4 챕터 표 → 키프레임 테이블 (달려옴 z−40→−6 / 포즈 좌측 프레이밍·로우앵글 / 90° 턴 가로 트래킹 / 풀백 정면)
- [x] Stage: 키·림 라이트, 포그, 바닥. `ground` 값으로 scene.background·fog·`--ground` CSS 변수 lerp
- [x] CameraRig: `MathUtils.damp`로 sample 추적 + CH1 마우스 패럴랙스(±0.3)
- [x] 커밋: `✨ feat: 키프레임 시네마 (카메라·지면 반전)`

### Task 5: 캐릭터 스탠드인

**Files:** `src/scene/Character.tsx`

**Consumes:** `sample(p)` · **Produces:** GLB와 동일한 `clip` 계약의 마네킹

- [x] 캡슐 몸통+구 머리+팔다리 프리미티브. clip별 절차 모션: Run(상하 바운스+팔다리 스윙 빠름) / Walk(느린 스윙) / Pose(한 손 허리, 정지+미세 숨) / Idle(미세 숨) / Jump(1회 포물선)
- [x] 클립 전환은 0.3s 블렌드 (가중치 lerp)
- [x] 커밋: `✨ feat: 캐릭터 스탠드인 마네킹 + 클립 상태머신`

### Task 6: CH1 포털 오버레이

**Files:** `src/overlay/Nav.tsx` · `src/overlay/Portal.tsx` · `src/overlay/useReveal.ts`

- [x] Nav: difference 블렌드, `BOMI.` + 앵커 5개(lenis.scrollTo) + 메일 필
- [x] Portal: 패널 2장·워드마크 `BO`/`MI.`·코너 메타 4개·중앙 도트 2개 — 전부 `--p` 기반 CSS `calc()` 바인딩, p>0.15에서 pointer-events 제거
- [x] 확인: 역스크롤 시 문이 완전히 닫힘
- [x] 커밋: `✨ feat: CH1 포털 히어로 (문·워드마크 스크롤 바인딩)`

### Task 7: CH2 리빌

**Files:** `src/overlay/Reveal.tsx`

- [x] 트랙 16% 지점, 우측 정렬 네임 스택 `FRONTEND / KIM / BOMI. / DEVELOPER · SEOUL · 2026` — useReveal 1회성 순차 리빌 + 약한 패럴랙스, 하단 `↓ WORK` 힌트
- [x] 확인: 지면 반전(검→흰)과 포즈 타이밍이 맞물림
- [x] 커밋: `✨ feat: CH2 화이트 리빌 (포즈 + 영문 네임)`

### Task 8: CH3 갤러리

**Files:** `src/scene/exhibits/Exhibits.tsx` · `src/overlay/WorkLabels.tsx` · `src/pages/Home.tsx`(수정)

- [x] 블랙 큐브 / 패널 4장 / 와이어 구조물 — 가로 배치(x 12·24·36), 호버 부상 + 커서, 클릭 → 카메라 푸시인 0.6s + 블랙 페이드 → navigate
- [x] WorkLabels: 전시물별 타이포 (works.ts 라벨 사용, 1회 리빌)
- [x] 홈 복귀 시 스크롤 위치 복원 (sessionStorage에 progress 저장)
- [x] 커밋: `✨ feat: CH3 화이트 갤러리 (전시물 3종 + 케이스 라우팅)`

### Task 9: CH4–CH6 오버레이

**Files:** `src/overlay/Method.tsx` · `src/overlay/Journal.tsx` · `src/overlay/Close.tsx`

- [x] Method: 일하는 방식 스테이트먼트(아웃라인 `01`) + 로스터 5행 + 데이츠 4행 (PLAN §4 CH4 내용 그대로)
- [x] Journal: 헤드라인 + 대표 글 링크 (tistory)
- [x] Close: 메일·GitHub·Resume 버튼, 푸터 스트립, 크롭 워드마크 `BOMI.` (translateY 18%)
- [x] 커밋: `✨ feat: CH4–CH6 (로스터·데이츠·기록·클로즈)`

### Task 10: /work/* 케이스 페이지

**Files:** `src/content/works.ts` · `src/pages/Work.tsx`

- [x] works.ts: TCC·SITES·ALLEO 본문 (`letter/portfolio.md` §프로젝트에서 문제→선택→결과→배운 점 이식)
- [x] Work.tsx: 화이트 지면 읽기 템플릿 + 이전/다음 + 홈 복귀
- [x] 커밋: `✨ feat: 케이스 스터디 3장`

### Task 11: 폴백 + 빌드 검증

**Files:** `src/scene/CinemaCanvas.tsx`(수정) · `src/pages/Home.tsx`(수정)

- [x] reduced-motion: 캔버스 정지 프레임 + 오버레이 전부 리빌 완료 상태
- [x] WebGL 실패: 캔버스 자리 빈 무대 배경 (오버레이는 HTML이라 그대로 동작)
- [x] `bun run build` 통과, 콘솔 에러 0
- [x] 커밋: `✨ feat: 접근성·폴백 + 빌드 검증`

## Self-Review 결과

- 스펙 커버리지: PLAN §4 챕터 6개 → Task 4–9, §6 케이스 → Task 10, §7 모션 규칙 → Task 2·11. **모바일 다운그레이드·OG 이미지·성능 측정은 ROADMAP 페이즈 6으로 명시적 이월** (이번 플랜 범위 밖).
- GLB 교체점: Character.tsx만 수정하면 되도록 clip 계약 고정 (Task 5).
- 타입 일관성: `Sample`·`Clip`·`WorkItem`·`Chapter` 를 이 문서 인터페이스 블록에 고정.
