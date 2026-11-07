# devportfolio v3 — 인터랙티브 리뉴얼 Implementation Plan

> **For agentic workers:** 이 문서를 위에서부터 단계(Stage) 단위로 실행한다. 각 Stage 끝에서 **바뀐 파일 목록 + 요약을 보고하고 멈춘다.** 체크박스(`- [ ]`)로 진행을 추적한다.
>
> 작성일: 2026-11-04 · 기준 커밋: `main` `0afa261` · 작업 브랜치: `feat/interactive-renewal`

**Goal:** 기존 콘텐츠를 한 글자도 바꾸지 않고, devportfolio를 Dennis Snellenberg 톤의 인터랙티브 포트폴리오로 리뉴얼한다. 범위는 프리로더, 커튼 페이지 전환, 매그네틱, 속도 반응 마퀴, 수평 갤러리와 WebGL 왜곡, 3D 포인트 오브젝트, 케이스 상세 인터랙션이다.

**Architecture:** 섹션은 일반 문서 흐름에 두고, 핀·스크럽은 GSAP ScrollTrigger가 맡는다. Lenis는 `RootLayout`에서 앱당 하나만 띄우고 `gsap.ticker`로 RAF 하나에 묶는다. 3D와 WebGL은 `RootLayout`의 고정 R3F `<Canvas>` 하나에 drei `View`로 나눠 그린다. 이 Canvas와 three 관련 코드는 전부 lazy 청크로 분리한다. 전역 상태 라이브러리는 쓰지 않는다. 포인터, 스크롤 속도, 씬 invalidate는 모듈 스코프 변수와 구독 함수로 공유한다.

**Tech Stack:** bun 1.2 · Vite 8 · React 19 · TypeScript 7 · Tailwind CSS 4 · react-router-dom 7 · gsap 3.15(ScrollTrigger·SplitText·Flip) + @gsap/react · lenis 1.3 · motion 13(모바일 부채꼴 갤러리만) · three · @react-three/fiber 9 · @react-three/drei 10

---

## 0. Global Constraints

모든 태스크에 암묵적으로 적용된다.

- **git 쓰기 금지:** commit·push·PR·브랜치 생성을 하지 않는다. 브랜치 `feat/interactive-renewal`는 이미 만들었다. 파일 수정만 한다.
- **Stage마다 멈추기:** Stage 끝에서 바뀐 파일 목록과 요약을 보고하고 사용자 지시를 기다린다.
- **콘텐츠 불변:**
  - 문구·숫자·링크·이미지 경로·이력은 원문 그대로 쓰고, 누락하지 않는다.
  - `src/content/works.ts`는 **수정 금지**. `git diff --exit-code main -- src/content/works.ts`가 항상 0이어야 한다.
  - 데이터를 옮길 때는 원본 줄을 **잘라 붙인다**. 다시 타이핑하지 않는다.
- **에셋 경로 불변:** `public/images/**`, `public/video/hero.mp4`, `public/images/bomi-landing.jpg`.
- **새 에셋 자리:** 3D 폴백 이미지는 `public/images/3d/*.webp`. 파일은 사용자가 넘기고, 코드는 없을 때 조용히 숨긴다.
- **코드 스타일** (`.cursor/rules/fe-style.mdc`, `use-bun.mdc`):
  - 함수 선언: 메인 컴포넌트는 `export default function Name()`, 하위 컴포넌트는 `function Name()`, 그 외는 전부 화살표 함수.
  - 타입: `type`만 쓰고 `interface`·`any`는 금지. 외부 입력은 `instanceof`나 타입 가드로 좁힌다.
  - 이름: 핸들러는 `handle*` 접두사. 파일명은 컴포넌트 PascalCase, `lib/`·`content/`·유틸은 camelCase.
  - 선언 순서: useState → useRef → 커스텀 훅 → handle* → effect → JSX. 그룹 사이에 빈 줄 하나.
  - 렌더 본문 안에서 컴포넌트를 선언하지 않는다. boolean 모드 prop은 쌓지 않고 variant·합성으로 나눈다.
  - 따옴표는 홑따옴표, 세미콜론은 없음, 들여쓰기는 2칸 (기존 코드와 동일).
- **패키지 매니저:** bun만 쓴다. 허용 추가 패키지는 `three @react-three/fiber @react-three/drei`(dependencies)와 `@types/three`(devDependencies)뿐이다. 그 외는 먼저 묻는다.
- **컬러:**
  - 흑백 + 네온(`--neon: #d1fe17`)만 쓴다. 2026-11-04 사용자 확정.
  - 3D 오브젝트도 `ink`/`ground`/`mid`/`neon` 톤만 쓴다.
  - 새 hex는 `src/styles/global.css` 토큰으로만 추가한다.
- **애니메이션:**
  - 속성은 transform·opacity·clip-path만 쓴다. top/left/width/height 애니메이션은 금지다.
  - `will-change`는 동작 중에만 건다.
  - 모든 GSAP 코드는 `useGSAP({ scope })` 안에 두거나, 이벤트 핸들러라면 `contextSafe`로 감싼다.
- **분기:** `matchMediaPreset()`(Task 3.1)으로 처리한다.
  - reduced-motion: pin·scrub·마퀴·3D·WebGL을 끈다.
  - `max-width: 767px`: 수평 스크롤을 세로·스와이프로 바꾸고, pin 길이를 줄이고, 매그네틱·커서·3D를 끈다. 3D 자리는 WebP 폴백으로 대신한다.
- **이미지:** Hero 외 모든 `<img>`에 `loading="lazy" decoding="async"`를 붙인다. 이미지 로드 뒤 `ScrollTrigger.refresh()`를 호출한다.
- **검증:**
  - Stage마다 `bun run build` 에러 0, `bun scripts/check-content.ts` OK(Task 2.2 이후), works.ts diff 0.
  - 브라우저 육안 확인은 dev 서버 `http://localhost:5173`에서 한다. 사용자 터미널에서 `bun dev`가 이미 실행 중이다.

---

## 1. 결정 기록

### 확정

| 항목 | 결정 |
|---|---|
| 브랜치 | `feat/interactive-renewal` (main `0afa261`에서 분기) |
| 컬러 | 흑백 + 네온. `--neon` 토큰을 정식 추가하고, 정의가 없어 동작하지 않던 `bg-neon`·`text-neon`을 살린다 |
| 문서 위치 | `docs/v3/IMPLEMENTATION.md` (이 파일) |

### 결정 대기 (해당 Stage 시작 전에 질문)

| Stage | 질문 | 선택지 |
|---|---|---|
| 6 | `sites`·`alleo`의 `links[]`를 상세에 노출할까? 지금은 `!work.entries` 조건 때문에 숨겨져 있다 | A) 지금처럼 숨김 B) entries가 있어도 히어로에 Pill로 노출 |

### 스펙과 다르게 가는 부분 (검토 요청)

구현 전에 사용자가 뒤집을 수 있다. 뒤집으면 해당 태스크의 "대안" 줄대로 한다.

1. **커튼 곡선:** SVG `d` 모핑 대신 **transform만** 쓴다. 곡선 SVG 캡의 `scaleY`와 래퍼의 `yPercent`를 움직인다. "transform·opacity·clip-path만" 규칙을 지키기 위해서다. 대안은 `attr: { d }` 모핑이다.
2. **홈 카드 → 상세 썸네일 공유 요소 Flip:** 라우트 경계를 넘는 Flip 대신 스펙이 허용한 폴백인 **커튼 + 썸네일 scale 1.15→1**로 간다. pin-spacer와 Lenis가 걸린 상태에서 언마운트되는 요소의 Flip은 회귀 위험이 크다.
3. **Decisions 고정:** title 고정은 ScrollTrigger pin 대신 **CSS `position: sticky`**로 한다. 긴 아티클에서 pin이 여러 개면 refresh 비용과 레이아웃 튐이 커진다. Lenis는 네이티브 스크롤이라 sticky가 정상 동작한다. 하이라이트 scrub은 그대로 GSAP가 맡는다.
4. **Method·Journal pin 제거:** 행별 패럴랙스와 clip 마스크 리빌은 pin 없이 일반 흐름에서 scrub로 처리한다. pin은 Hero·Projects·Pilot·Entries 4곳만 남긴다.
5. **Journal의 READ 라벨:** 별도 요소 대신 **NeonCursorRing 라벨(`data-cursor="read"`)**로 통일한다. OPEN/VIEW와 같은 시스템을 쓴다. 행 안의 기존 `READ →` 텍스트는 그대로 둔다.
6. **3D 환경광:** drei `Environment`에 HDR 프리셋 대신 **`Lightformer` 자식**을 넣는다. 외부 CDN에서 HDR(약 1.5MB)을 받지 않기 위해서다. 대안은 `<Environment preset="studio" />` 한 줄 교체다.
7. **홈으로 가는 전환 라벨:** 목적지 라벨로 기존 문구 `KIM BOMI`를 쓴다. `← PROJECTS` 링크만 `PROJECTS`를 쓴다.
8. **브라우저 뒤로가기(popstate):** 커튼 없이 즉시 전환한다. 스크롤 복원 로직은 동일하게 동작한다.

---

## 2. 현재 상태 요약 (1단계 분석 결과)

- 빌드: `bun run build`는 통과한다. JS는 한 덩어리로 605KB(gzip 201KB)다.
- `useLenis()`·`usePointer()`를 Home과 Work가 각각 호출한다. 라우트마다 Lenis를 새로 만든다.
- `gsap.matchMedia()`를 쓰는 곳이 없고, 전부 `prefersReducedMotion()`으로 조기 반환한다.
- pin 사용처: Hero `+=2000%`, Method `+=240%`, Pilot `+=320%`, Journal `+=160%`.
- `bg-neon`/`text-neon`/`hover:!bg-neon`은 토큰이 없어 CSS가 생성되지 않는다(버그).
- `PROTOCOL[].fit` 필드는 렌더에 쓰이지 않는다. 옮길 때 필드는 그대로 유지한다.
- 6장 목록에는 없지만 코드에 있어서 유지해야 하는 콘텐츠:
  - 상세 하단 `← PROJECTS`, `bomi2172@gmail.com` Pill
  - 상세 헤더 `0n / 06`
  - Gallery `0n / 06` 카운터와 현재 title
  - Pager의 `← OPEN CASE`

---

## 3. 파일 맵

```
index.html                                   [M] 폰트·랜딩 이미지 preload (Stage 8)
scripts/check-content.ts                     [C] 콘텐츠 누락 검사 (Stage 2)
public/images/3d/                            [C] 폴백 WebP 자리 (사용자가 채움, 코드는 없으면 숨김)
src/
├─ app/RootLayout.tsx                        [M] useLenis·usePointer·PageTransition·Preloader·SceneRoot 장착
├─ content/
│  ├─ works.ts                               [=] 수정 금지
│  ├─ about.ts                               [C] Hero 미디어, MARQUEE_ROWS, GREETINGS
│  ├─ history.ts                             [C] HISTORY (Method INDEX 이동)
│  ├─ workflow.ts                            [C] PROTOCOL, SKILLS_URL (Pilot 이동)
│  ├─ posts.ts                               [C] POSTS (Journal 이동)
│  └─ contact.ts                             [C] EMAIL, MAILTO, GITHUB_URL, RESUME_URL, CONTACT_LINKS
├─ lib/
│  ├─ gsapSetup.ts                           [M] SplitText·Flip 등록, ScrollTrigger.config
│  ├─ media.ts                               [C] MEDIA, MediaFlags, matchMediaPreset
│  ├─ useMediaQuery.ts                       [C] useMediaQuery
│  ├─ useLenis.ts                            [M] 단일 인스턴스, lockScroll/unlockScroll, onScroll, scrollToY, getScrollVelocity
│  ├─ usePointer.ts                          [M] getPointer, 씬 invalidate
│  ├─ useMagneticFollow.ts                   [M] innerRef(텍스트) 이중 강도, fine pointer에서만
│  ├─ useCursorFollow.ts                     [M] pointerover 위임, data-cursor 라벨
│  ├─ cursor.ts                              [C] CursorKind, CURSOR_LABELS
│  ├─ pageTransition.ts                      [C] Context, usePageTransition, useTransitionLink
│  ├─ preload.ts                             [C] preloadAssets
│  ├─ hero.ts                                [C] HERO_PIN
│  ├─ refreshOnImageLoad.ts                  [C] 이미지 로드 → ScrollTrigger.refresh (debounce)
│  ├─ useFocusTrap.ts                        [C] 다이얼로그 포커스 트랩
│  ├─ useInView.ts                           [C] IntersectionObserver 훅
│  ├─ sceneBus.ts                            [C] 씬 invalidate·슬롯 카운트 (three 의존 없음)
│  └─ can3D.ts                               [C] canRender3D
├─ components/
│  ├─ Nav.tsx                                [M] MAILTO 사용 (Pill은 자동으로 이중 매그네틱)
│  ├─ common/Pill.tsx · MagneticButton.tsx   [M] 내부 텍스트 span(innerRef)
│  ├─ common/NeonCursorRing.tsx              [M] 라벨 요소
│  ├─ common/FlipLightbox.tsx                [C] Pilot·Work 공용 Flip 라이트박스
│  ├─ transition/PageTransition.tsx          [C] 커튼 Provider
│  └─ preloader/Preloader.tsx · helloPath.ts [C] hello 프리로더
├─ sections/
│  ├─ Hero.tsx                               [M] SplitText 글자 리빌, 모바일 pin 축소, 3D 슬롯
│  ├─ Marquee.tsx                            [C] 속도 반응 마퀴
│  ├─ Gallery.tsx                            [M] 데스크톱 Rail / 모바일 Fan 분기
│  ├─ gallery/GalleryHeader.tsx              [C]
│  ├─ gallery/GalleryControls.tsx            [C] 카운터 + 이전/다음 MagneticButton
│  ├─ gallery/GalleryFan.tsx                 [C] 기존 부채꼴 이동 (+labelEyebrow)
│  ├─ gallery/GalleryRail.tsx                [C] pin + 수평 이동, DistortImageSlot
│  ├─ Method.tsx · Pilot.tsx · Journal.tsx · Close.tsx   [M]
├─ pages/Home.tsx                            [M] 전환 API, Marquee 삽입, 복원 로직
├─ pages/Work.tsx                            [M] 히어로·Stats·Decisions·Entries·Pager·Lightbox
├─ scene/                                    three 의존은 lazy 청크에만 둔다
│  ├─ types.ts · palette.ts                  [C] (three 의존 없음)
│  ├─ SceneRoot.tsx                          [C] (main) Canvas lazy 마운트
│  ├─ SceneSlot.tsx · DistortImageSlot.tsx   [C] (main) DOM 슬롯, 폴백
│  ├─ SceneCanvas.tsx · SlotView.tsx         [C] (lazy) Canvas + View
│  ├─ Stage.tsx · GlossyMaterial.tsx · useTilt.ts      [C] (lazy)
│  ├─ shaders/distort.ts                     [C] (lazy)
│  └─ objects/HeroObjects · WorkflowObject · ContactObjects · CaseObject · DistortPlane .tsx  [C] (lazy)
└─ styles/global.css                         [M] --neon, --card-ground, 커서 라벨
```

## 4. 공용 인터페이스 (태스크 사이 계약)

| 모듈 | export | 시그니처 |
|---|---|---|
| `lib/useLenis.ts` | `getLenis` | `() => Lenis \| null` |
| | `scrollToId` / `scrollToTop` | 기존 유지 |
| | `scrollToY` | `(y: number) => void` (즉시, 잠금 무시) |
| | `lockScroll` / `unlockScroll` | `(key: string) => void` |
| | `onScroll` | `(listener: (s: ScrollState) => void) => () => void` |
| | `getScrollVelocity` | `() => number` |
| | `useLenis` | `() => void` (RootLayout에서만) |
| `lib/usePointer.ts` | `usePointer`, `getPointer` | `() => void`, `() => { x: number; y: number }` (-1~1) |
| `lib/media.ts` | `MEDIA`, `MediaFlags`, `matchMediaPreset` | `(setup: (f: MediaFlags) => void \| (() => void)) => gsap.MatchMedia` |
| `lib/useMediaQuery.ts` | `useMediaQuery` | `(query: string) => boolean` |
| `lib/pageTransition.ts` | `TransitionTarget`, `PageTransitionContext`, `usePageTransition`, `useTransitionLink` | `go(target)`, `(to, label) => (e: MouseEvent<HTMLAnchorElement>) => void` |
| `lib/cursor.ts` | `CursorKind`, `CURSOR_LABELS` | `'open' \| 'view' \| 'read'` |
| `lib/sceneBus.ts` | `setSceneInvalidator`, `invalidateScene`, `registerSceneSlot`, `subscribeSceneSlots`, `getSceneSlotCount` | |
| `lib/can3D.ts` | `canRender3D` | `() => boolean` |
| `lib/useInView.ts` | `useInView` | `(ref, rootMargin?) => boolean` |
| `lib/useFocusTrap.ts` | `useFocusTrap` | `(ref) => void` |
| `lib/refreshOnImageLoad.ts` | `refreshOnImageLoad` | `(root: ParentNode) => () => void` |
| `lib/hero.ts` | `HERO_PIN` | `{ desktop: '+=2000%'; mobile: '+=1200%' }` |
| `components/common/FlipLightbox.tsx` | default | `{ src; alt; caption?; origin: HTMLElement \| null; onClose }` |
| `scene/types.ts` | `HoverState`, `SceneObject` | 아래 Task 7.1 |
| `scene/SceneSlot.tsx` | default | `{ object; fallbackSrc; className? }` |
| `scene/DistortImageSlot.tsx` | default | `{ src; alt; fit; hover; className?; loading? }` |

---

## Stage 2 — 콘텐츠 분리 (문구 변경 0)

### Task 2.1: 하드코딩 데이터를 `src/content/`로 이동

**Files:**
- Create: `src/content/history.ts`, `src/content/workflow.ts`, `src/content/posts.ts`, `src/content/contact.ts`, `src/content/about.ts`
- Modify: `src/sections/Method.tsx:10-73`, `src/sections/Pilot.tsx:14-66`, `src/sections/Journal.tsx:10-17`, `src/sections/Close.tsx:13-14,61-76`, `src/sections/Hero.tsx:9-10,154-157`, `src/components/Nav.tsx:60`, `src/pages/Work.tsx:280-285`

**Produces:** `HistoryRow`, `HISTORY`, `ProtocolStep`, `PROTOCOL`, `SKILLS_URL`, `Post`, `POSTS`, `EMAIL`, `MAILTO`, `GITHUB_URL`, `RESUME_URL`, `ContactLink`, `CONTACT_LINKS`, `HERO_VIDEO_SRC`, `HERO_IMAGE`

- [ ] **Step 1: `history.ts` 만들기.** `Method.tsx` 10–15행의 `type IndexRow`와 17–73행의 `INDEX` 배열을 잘라 붙인다. 이름만 바꾸고 값은 바꾸지 않는다.

```ts
export type HistoryRow = {
  tag: string
  name: string
  meta: string
  note: string
}

export const HISTORY: HistoryRow[] = [
  // ← Method.tsx 18–72행의 객체 9개를 그대로 붙여 넣는다 (tag NOW … TUTOR)
]
```

- [ ] **Step 2: `workflow.ts` 만들기.** `Pilot.tsx` 14행 `SKILLS_URL`, 16–23행 `type ProtocolStep`, 25–66행 `PROTOCOL`을 잘라 붙인다. `fit` 필드도 유지한다.

```ts
export const SKILLS_URL = 'https://github.com/Kbomi16/ai-skills'

export type ProtocolStep = {
  no: string
  en: string
  kr: string
  shot: string
  alt: string
  fit: 'cover' | 'contain'
}

export const PROTOCOL: ProtocolStep[] = [
  // ← Pilot.tsx 26–65행의 객체 5개를 그대로 붙여 넣는다
]
```

- [ ] **Step 3: `posts.ts` 만들기.** `Journal.tsx` 10–17행을 옮긴다.

```ts
export type Post = {
  title: string
  url: string
}

export const POSTS: Post[] = [
  { title: 'BFF로 토큰을 감싸는 구조', url: 'https://bori-note.tistory.com/' },
  { title: 'URL이 남는 모달 — Parallel Routes', url: 'https://bori-note.tistory.com/' },
  {
    title: 'Next.js Image 컴포넌트 톺아보기',
    url: 'https://bori-note.tistory.com/117',
  },
]
```

- [ ] **Step 4: `contact.ts` 만들기.** `MAILTO`는 템플릿 문자열로 조립하지 말고 리터럴로 둔다. 콘텐츠 검사에서 원문 매칭이 되게 하기 위해서다.

```ts
export const EMAIL = 'bomi2172@gmail.com'
export const MAILTO = 'mailto:bomi2172@gmail.com'
export const GITHUB_URL = 'https://github.com/Kbomi16'
export const RESUME_URL =
  'https://volcano-fisherman-e31.notion.site/31a3307fa7e6803cb79de92068674178'

export type ContactLink = {
  label: string
  href: string
  external: boolean
}

export const CONTACT_LINKS: ContactLink[] = [
  { label: EMAIL, href: MAILTO, external: false },
  { label: 'GitHub', href: GITHUB_URL, external: true },
  { label: 'Resume', href: RESUME_URL, external: true },
]
```

- [ ] **Step 5: `about.ts` 만들기.** Hero 상수를 옮긴다. 마퀴·인사 문구는 이후 Task에서 이 파일에 추가한다.

```ts
export const HERO_VIDEO_SRC = '/video/hero.mp4'

export const HERO_IMAGE = {
  src: '/images/bomi-landing.jpg',
  alt: '웅크린 자세로 정면을 응시하는 3D 바이닐 피규어 — 포트폴리오 표지',
} as const
```

- [ ] **Step 6: 섹션에서 import로 교체한다.**
  - `Method.tsx`: `INDEX` → `HISTORY`, `IndexRow` → `HistoryRow`. `IndexItem`의 prop 타입도 같이 바꾼다.
  - `Pilot.tsx`: `import { PROTOCOL, SKILLS_URL, type ProtocolStep } from '../content/workflow'`.
  - `Journal.tsx`: `import { POSTS } from '../content/posts'`.
  - `Hero.tsx`: `VIDEO_SRC`/`IMAGE_SRC` 상수를 지우고 `HERO_VIDEO_SRC`, `HERO_IMAGE.src`, `HERO_IMAGE.alt`를 쓴다.
  - `Nav.tsx` 60행 `href="mailto:bomi2172@gmail.com"` → `href={MAILTO}`.
  - `Work.tsx` 282행 → `href={MAILTO}`, 284행 텍스트 → `{EMAIL}`.
  - `Close.tsx` 60–68행 Pill 3개 → 아래 map. 75–76행 → `<Label>{EMAIL}</Label>`.

```tsx
<div data-rv className="mt-5 flex flex-wrap gap-3">
  {CONTACT_LINKS.map((link) => (
    <Pill
      key={link.href}
      href={link.href}
      target={link.external ? '_blank' : undefined}
      {...outboundLinkProps(link.href)}
    >
      {link.label}
    </Pill>
  ))}
</div>
```

- [ ] **Step 7: 빌드한다.** `bun run build`를 돌려 에러 0을 확인한다.

### Task 2.2: 콘텐츠 누락 검사 스크립트

**Files:** Create `scripts/check-content.ts`

이 스크립트는 `src/**`와 `index.html` 전체 텍스트에서 필수 문구가 하나라도 빠지면 실패한다. 공백과 `\n` 이스케이프는 정규화해서 비교한다. 이후 모든 Stage의 회귀 테스트로 쓴다.

- [ ] **Step 1: 스크립트를 작성한다.** 문구는 사용자 프롬프트 6장과 현재 코드에서 그대로 복사한다.

```ts
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
```

- [ ] **Step 2: 스크립트를 돌린다.** `bun scripts/check-content.ts`의 기대 출력은 `OK — N개 문구 확인`이다. 실패하면 Task 2.1에서 문구가 바뀐 것이므로 원본과 대조해 고친다.
- [ ] **Step 3: works.ts를 확인한다.** `git diff --exit-code main -- src/content/works.ts`의 종료 코드가 0이어야 한다.
- [ ] **Step 4: 화면을 비교한다.** dev 서버에서 `/`와 `/work/tcc`를 열고, 수정 전 화면과 같은지 스크린샷으로 비교한다. 비교 대상은 Method 9행, Pilot 5카드, Journal 3행, Contact Pill 3개다.
- [ ] **Step 5: Stage 2를 보고하고 멈춘다.**

---

## Stage 3 — 기반 (Lenis·matchMedia·커튼 전환·매그네틱·커서)

### Task 3.1: GSAP 플러그인, 미디어 프리셋, 토큰

**Files:**
- Modify: `src/lib/gsapSetup.ts`, `src/styles/global.css`
- Create: `src/lib/media.ts`, `src/lib/useMediaQuery.ts`

- [ ] **Step 1: `gsapSetup.ts`를 고친다.**

```ts
import gsap from 'gsap'
import { Flip } from 'gsap/Flip'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, SplitText, Flip, useGSAP)
ScrollTrigger.config({ ignoreMobileResize: true })

export { gsap, Flip, ScrollTrigger, SplitText, useGSAP }
```

- [ ] **Step 2: `media.ts`를 만든다.**

```ts
import { gsap } from './gsapSetup'

export const MEDIA = {
  motion: '(prefers-reduced-motion: no-preference)',
  reduce: '(prefers-reduced-motion: reduce)',
  desktop: '(min-width: 768px)',
  mobile: '(max-width: 767px)',
  finePointer: '(hover: hover) and (pointer: fine)',
  coarsePointer: '(pointer: coarse)',
} as const

export type MediaKey = keyof typeof MEDIA
export type MediaFlags = Record<MediaKey, boolean>

/** useGSAP 안에서 호출. 반환값을 cleanup에서 revert한다. */
export const matchMediaPreset = (
  setup: (flags: MediaFlags) => void | (() => void),
): gsap.MatchMedia => {
  const mm = gsap.matchMedia()
  mm.add(MEDIA, (context) => {
    const conditions = context.conditions ?? {}
    return setup({
      motion: Boolean(conditions.motion),
      reduce: Boolean(conditions.reduce),
      desktop: Boolean(conditions.desktop),
      mobile: Boolean(conditions.mobile),
      finePointer: Boolean(conditions.finePointer),
      coarsePointer: Boolean(conditions.coarsePointer),
    })
  })
  return mm
}
```

사용 패턴은 모든 섹션에서 동일하다.

```ts
useGSAP(
  () => {
    const mm = matchMediaPreset(({ motion, desktop }) => {
      if (!motion) return
      // ...
    })
    return () => mm.revert()
  },
  { scope: sectionRef },
)
```

- [ ] **Step 3: `useMediaQuery.ts`를 만든다.**

```ts
import { useCallback, useSyncExternalStore } from 'react'

export const useMediaQuery = (query: string): boolean => {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query)
      list.addEventListener('change', onChange)
      return () => list.removeEventListener('change', onChange)
    },
    [query],
  )

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  )
}
```

- [ ] **Step 4: `global.css`에 토큰을 추가한다.** `:root`의 `--cursor-neon-*` 위에 넣는다.

```css
  /* 액센트 — 흑백 + 네온만 (2026-11-04 확정) */
  --neon: #d1fe17;
  /* 카드 이미지 바탕 (기존 #f4f0e8 승격) */
  --card-ground: #f4f0e8;
```

`@theme inline`에는 아래를 추가한다.

```css
  --color-neon: var(--neon);
  --color-card-ground: var(--card-ground);
```

- [ ] **Step 5: 기존 hex를 토큰으로 바꾼다.** 이번에 손대는 파일에서만 `bg-[#f4f0e8]`/`!bg-[#f4f0e8]` → `bg-card-ground`/`!bg-card-ground`로 바꾼다(Gallery·Work).
- [ ] **Step 6: 빌드하고 네온을 확인한다.** `bun run build` 후 `rg -o 'bg-neon' dist/assets/*.css`의 결과가 1건 이상이어야 한다. `/work/money`의 "진행 중" 배지가 네온 배경으로 보여야 한다.

### Task 3.2: Lenis 단일 인스턴스, 스크롤 잠금, 포인터 공유

**Files:**
- Modify: `src/lib/useLenis.ts` (전체 교체), `src/lib/usePointer.ts`, `src/app/RootLayout.tsx`, `src/pages/Home.tsx`, `src/pages/Work.tsx`, `src/sections/Pilot.tsx:120-138`
- Create: `src/lib/sceneBus.ts`, `src/lib/refreshOnImageLoad.ts`

- [ ] **Step 1: `sceneBus.ts`를 만든다.** three를 import하지 않으므로 main 번들에 둔다.

```ts
type Listener = () => void

let invalidator: (() => void) | null = null
let slotCount = 0
const slotListeners = new Set<Listener>()

export const setSceneInvalidator = (fn: (() => void) | null): void => {
  invalidator = fn
}

export const invalidateScene = (): void => {
  invalidator?.()
}

export const registerSceneSlot = (): (() => void) => {
  slotCount += 1
  slotListeners.forEach((listener) => listener())
  return () => {
    slotCount -= 1
    slotListeners.forEach((listener) => listener())
  }
}

export const subscribeSceneSlots = (listener: Listener): (() => void) => {
  slotListeners.add(listener)
  return () => {
    slotListeners.delete(listener)
  }
}

export const getSceneSlotCount = (): number => slotCount
```

- [ ] **Step 2: `useLenis.ts`를 전체 교체한다.** 잠금은 키 기반으로 동작한다. 그래서 프리로더·전환·라이트박스가 겹쳐도 마지막 해제 시점에만 다시 시작된다. Lenis가 만들어지기 전에 건 잠금도 생성 직후 적용된다(자식 effect가 먼저 실행되는 문제 대응).

```ts
import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './gsapSetup'
import { prefersReducedMotion } from './motion'

export type ScrollState = {
  scroll: number
  velocity: number
  direction: number
}

type ScrollListener = (state: ScrollState) => void

let instance: Lenis | null = null
let lastVelocity = 0
const locks = new Set<string>()
const listeners = new Set<ScrollListener>()

/** reduced-motion이면 null */
export const getLenis = (): Lenis | null => instance

export const getScrollVelocity = (): number => lastVelocity

export const scrollToId = (id: string): void => {
  if (instance) instance.scrollTo(`#${id}`)
  else document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export const scrollToTop = (): void => {
  if (instance) instance.scrollTo(0)
  else window.scrollTo({ top: 0, behavior: 'smooth' })
}

/** 즉시 이동 — 잠금 중에도 동작 (복원·전환용) */
export const scrollToY = (y: number): void => {
  if (instance) instance.scrollTo(y, { immediate: true, force: true })
  else window.scrollTo({ top: y, behavior: 'instant' })
}

const applyLock = (): void => {
  const locked = locks.size > 0
  document.documentElement.style.overflow = locked ? 'hidden' : ''
  if (!instance) return
  if (locked) instance.stop()
  else instance.start()
}

export const lockScroll = (key: string): void => {
  locks.add(key)
  applyLock()
}

export const unlockScroll = (key: string): void => {
  locks.delete(key)
  applyLock()
}

export const onScroll = (listener: ScrollListener): (() => void) => {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/** RootLayout에서 1회 — Lenis 기동 + ScrollTrigger·gsap.ticker 단일 RAF */
export const useLenis = (): void => {
  useEffect(() => {
    if (prefersReducedMotion()) return

    const lenis = new Lenis({ lerp: 0.09 })
    instance = lenis

    const handleScroll = (current: Lenis) => {
      ScrollTrigger.update()
      const state = {
        scroll: current.scroll,
        velocity: current.velocity,
        direction: current.direction,
      }
      listeners.forEach((listener) => listener(state))
    }

    const tick = (time: number) => {
      lenis.raf(time * 1000)
      lastVelocity = lenis.velocity
    }

    lenis.on('scroll', handleScroll)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    applyLock()

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      instance = null
      lastVelocity = 0
    }
  }, [])
}
```

- [ ] **Step 3: `usePointer.ts`를 고친다.** 모듈 스코프에 `pointer`를 두고 `getPointer`를 export한다. 값이 변하는 동안에만 CSS 변수를 갱신하고 씬을 invalidate한다.

```ts
import { useEffect } from 'react'
import { invalidateScene } from './sceneBus'
import { prefersReducedMotion } from './motion'

const pointer = { x: 0, y: 0 }

export const getPointer = (): { x: number; y: number } => pointer

const publish = (x: number, y: number): void => {
  const root = document.documentElement
  root.style.setProperty('--mx', x.toFixed(4))
  root.style.setProperty('--my', y.toFixed(4))
}

/** RootLayout에서 1회 — 마우스 위치(-1~1)를 --mx/--my와 getPointer()로 발행 */
export const usePointer = (): void => {
  useEffect(() => {
    if (prefersReducedMotion()) {
      publish(0, 0)
      return
    }

    const target = { x: 0, y: 0 }
    let raf = 0

    const handlePointerMove = (event: PointerEvent) => {
      const w = window.innerWidth || 1
      const h = window.innerHeight || 1
      target.x = (event.clientX / w) * 2 - 1
      target.y = (event.clientY / h) * 2 - 1
    }

    const handlePointerLeave = () => {
      target.x = 0
      target.y = 0
    }

    const tick = () => {
      const dx = target.x - pointer.x
      const dy = target.y - pointer.y
      if (Math.abs(dx) > 0.0001 || Math.abs(dy) > 0.0001) {
        pointer.x += dx * 0.09
        pointer.y += dy * 0.09
        publish(pointer.x, pointer.y)
        invalidateScene()
      }
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('pointerleave', handlePointerLeave)
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerleave', handlePointerLeave)
    }
  }, [])
}
```

- [ ] **Step 4: `refreshOnImageLoad.ts`를 만든다.**

```ts
import { ScrollTrigger } from './gsapSetup'

/** root 안 미완료 이미지가 로드될 때마다 ScrollTrigger.refresh (120ms debounce) */
export const refreshOnImageLoad = (root: ParentNode): (() => void) => {
  let timer = 0

  const handleLoad = () => {
    window.clearTimeout(timer)
    timer = window.setTimeout(() => ScrollTrigger.refresh(), 120)
  }

  const pending = Array.from(root.querySelectorAll('img')).filter((img) => !img.complete)
  pending.forEach((img) => img.addEventListener('load', handleLoad, { once: true }))

  return () => {
    window.clearTimeout(timer)
    pending.forEach((img) => img.removeEventListener('load', handleLoad))
  }
}
```

- [ ] **Step 5: `RootLayout.tsx`로 올린다.** 이 Step은 임시 모습이다. Task 3.3·4·7.1에서 Provider·Preloader·SceneRoot를 추가한다.

```tsx
import { Outlet } from 'react-router-dom'
import NeonCursorRing from '../components/common/NeonCursorRing'
import { useLenis } from '../lib/useLenis'
import { usePointer } from '../lib/usePointer'

export default function RootLayout() {
  useLenis()
  usePointer()

  return (
    <>
      <NeonCursorRing />
      <Outlet />
    </>
  )
}
```

- [ ] **Step 6: 페이지 쪽 호출을 정리한다.**
  - `Home.tsx`·`Work.tsx`에서 `useLenis()`·`usePointer()` 호출과 import를 지운다.
  - `Work.tsx` 60–63행은 `scrollToY(0)` 한 줄로 바꾼다(`useLayoutEffect` 유지).
- [ ] **Step 7: Pilot 오버레이 잠금을 바꾼다.** `Pilot.tsx`의 effect(120–138행)에서 `lenis.stop()` + `body.overflow`를 지우고, `lockScroll('pilot-shot')` / cleanup `unlockScroll('pilot-shot')`로 바꾼다. ESC 처리는 유지한다. 오버레이 자체는 Task 5.5에서 FlipLightbox로 교체된다.
- [ ] **Step 8: 빌드와 확인.** `bun run build`를 돌린다. 브라우저에서 아래를 확인한다.
  - 홈 스무스 스크롤이 동작한다.
  - Nav 앵커 이동이 동작한다.
  - Pilot 이미지를 열면 스크롤이 잠기고, ESC로 닫으면 풀린다.
  - `/work/tcc` → `← 홈`으로 돌아오면 스크롤 위치가 복원된다.

### Task 3.3: 페이지 전환 커튼

**Files:**
- Create: `src/lib/pageTransition.ts`, `src/components/transition/PageTransition.tsx`
- Modify: `src/app/RootLayout.tsx`, `src/pages/Home.tsx`, `src/pages/Work.tsx` (`← 홈`, `← PROJECTS`, PagerCard)

**Produces:** `TransitionTarget`, `usePageTransition().go`, `useTransitionLink(to, label)`

- [ ] **Step 1: `pageTransition.ts`를 만든다.**

```ts
import { createContext, useContext, type MouseEvent } from 'react'

export type TransitionTarget = {
  to: string
  label: string
  /** 커튼이 화면을 다 덮은 직후, navigate 직전에 실행 */
  onCovered?: () => void
}

export type PageTransitionValue = {
  go: (target: TransitionTarget) => void
}

export const PageTransitionContext = createContext<PageTransitionValue | null>(null)

export const usePageTransition = (): PageTransitionValue => {
  const value = useContext(PageTransitionContext)
  if (!value) throw new Error('PageTransition Provider 밖에서 호출됨')
  return value
}

/** <Link onClick>용 — 수정 키 클릭(새 탭 등)은 브라우저 기본 동작에 맡긴다 */
export const useTransitionLink = (to: string, label: string) => {
  const { go } = usePageTransition()

  return (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return
    event.preventDefault()
    go({ to, label })
  }
}
```

- [ ] **Step 2: `PageTransition.tsx`를 만든다.**
  - 구조: 래퍼 높이는 124vh(위 캡 12vh + 본문 100vh + 아래 캡 12vh)이고 `top: -12vh`에 둔다. 진입할 때는 `yPercent` 100→0, 퇴장할 때는 0→-100으로 움직인다.
  - 곡선: 위 캡(볼록)은 진입하면서 `scaleY` 1→0으로 평평해진다. 아래 캡(오목)은 퇴장 시작 때 `scaleY` 0→1로 생긴다.
  - StrictMode 대응: pending 플래그는 rAF 안에서만 내린다. effect가 두 번 실행돼도 퇴장 애니메이션이 한 번은 반드시 돈다.

```tsx
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Display from '../common/Display'
import { gsap, ScrollTrigger, useGSAP } from '../../lib/gsapSetup'
import { prefersReducedMotion } from '../../lib/motion'
import { PageTransitionContext, type TransitionTarget } from '../../lib/pageTransition'
import { getLenis, lockScroll, unlockScroll } from '../../lib/useLenis'

type PageTransitionProps = {
  children: ReactNode
}

export default function PageTransition({ children }: PageTransitionProps) {
  const [label, setLabel] = useState('')

  const rootRef = useRef<HTMLDivElement>(null)
  const runningRef = useRef(false)
  const pendingRef = useRef(false)

  const navigate = useNavigate()
  const location = useLocation()
  const { contextSafe } = useGSAP({ scope: rootRef })

  const handleGo = contextSafe((target: TransitionTarget) => {
    if (runningRef.current) return
    if (prefersReducedMotion()) {
      target.onCovered?.()
      navigate(target.to)
      return
    }

    runningRef.current = true
    lockScroll('transition')
    setLabel(target.label)

    gsap
      .timeline({
        onComplete: () => {
          target.onCovered?.()
          pendingRef.current = true
          navigate(target.to)
        },
      })
      .set('[data-curtain]', { autoAlpha: 1, yPercent: 100 })
      .set('[data-curtain-top]', { scaleY: 1 })
      .set('[data-curtain-bottom]', { scaleY: 0 })
      .set('[data-curtain-label]', { yPercent: 110 })
      .to('[data-curtain]', { yPercent: 0, duration: 0.8, ease: 'power3.inOut' })
      .to('[data-curtain-top]', { scaleY: 0, duration: 0.55, ease: 'power2.out' }, '-=0.45')
      .to('[data-curtain-label]', { yPercent: 0, duration: 0.6, ease: 'expo.out' }, '-=0.35')
  })

  useEffect(() => {
    if (!pendingRef.current) return

    const raf = requestAnimationFrame(() => {
      pendingRef.current = false
      ScrollTrigger.refresh()
      getLenis()?.resize()
      unlockScroll('transition')

      gsap
        .timeline({
          onComplete: () => {
            runningRef.current = false
            gsap.set('[data-curtain]', { autoAlpha: 0 })
          },
        })
        .to('[data-curtain-label]', { yPercent: -110, duration: 0.45, ease: 'power3.in' })
        .to('[data-curtain-bottom]', { scaleY: 1, duration: 0.4, ease: 'power2.out' }, '-=0.1')
        .to('[data-curtain]', { yPercent: -100, duration: 0.85, ease: 'power3.inOut' }, '<')
    })

    return () => cancelAnimationFrame(raf)
  }, [location.key])

  return (
    <PageTransitionContext.Provider value={{ go: handleGo }}>
      {children}
      <div ref={rootRef} className="pointer-events-none fixed inset-0 z-[90]" aria-hidden>
        <div
          data-curtain
          className="invisible absolute inset-x-0 top-[-12vh] flex h-[124vh] flex-col opacity-0"
        >
          <svg
            data-curtain-top
            className="block h-[12vh] w-full origin-bottom"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path d="M0 100 Q50 0 100 100 Z" className="fill-dark-ground" />
          </svg>
          <div className="flex h-screen items-center justify-center bg-dark-ground text-dark-ink">
            <span className="overflow-hidden">
              <Display data-curtain-label className="block text-[clamp(40px,7vw,120px)]">
                {label}
              </Display>
            </span>
          </div>
          <svg
            data-curtain-bottom
            className="block h-[12vh] w-full origin-top"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path d="M0 0 Q50 100 100 0 Z" className="fill-dark-ground" />
          </svg>
        </div>
      </div>
    </PageTransitionContext.Provider>
  )
}
```

- [ ] **Step 3: RootLayout을 감싼다.** `<PageTransition>`으로 `NeonCursorRing`과 `Outlet`을 감싼다. 라우터 안이므로 `useNavigate`를 쓸 수 있다.
- [ ] **Step 4: `Home.tsx`를 교체한다.** 위치 저장·Lenis 정지·복귀 복원은 유지하고, 블랙 페이드 div와 `leaving` state는 제거한다.

```tsx
export default function Home() {
  const pageRef = useRef<HTMLElement>(null)

  const { go } = usePageTransition()

  const handleOpenWork = (slug: string) => {
    const work = workBySlug(slug)
    if (!work) return
    sessionStorage.setItem('home-scroll', String(Math.round(window.scrollY)))
    go({ to: `/work/${slug}`, label: work.label })
  }

  useGSAP(() => refreshOnImageLoad(document), { scope: pageRef })

  // 케이스 페이지에서 복귀 시 갤러리 위치 복원 (StrictMode 대응: rAF 안에서 키 제거)
  useEffect(() => {
    if (sessionStorage.getItem('home-scroll') === null) return
    const raf = requestAnimationFrame(() => {
      const saved = sessionStorage.getItem('home-scroll')
      sessionStorage.removeItem('home-scroll')
      ScrollTrigger.refresh()
      if (saved !== null) scrollToY(Number(saved))
    })
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <>
      <Nav />
      <main ref={pageRef}>
        <Hero />
        {/* Task 5.2에서 <Marquee /> 삽입 */}
        <Gallery onOpenWork={handleOpenWork} />
        <Method />
        <Pilot />
        <Journal />
        <Close />
      </main>
    </>
  )
}
```

Lenis 정지(`getLenis()?.stop()`)는 `go()` 안의 `lockScroll('transition')`이 대신한다.

- [ ] **Step 5: `Work.tsx`의 링크에 전환을 단다.** 아래 하위 컴포넌트를 추가하고 각 위치에서 쓴다.
  - `← 홈` (헤더 Label as Link): `useTransitionLink('/', 'KIM BOMI')`
  - `← PROJECTS`: `useTransitionLink('/', 'PROJECTS')`
  - `PagerCard`: `useTransitionLink(`/work/${work.slug}`, work.label)`

```tsx
function TransitionLabelLink({ to, label, className, children }: TransitionLabelLinkProps) {
  const handleClick = useTransitionLink(to, label)

  return (
    <Label as={Link} className={className} to={to} onClick={handleClick}>
      {children}
    </Label>
  )
}
```

  `type TransitionLabelLinkProps = { to: string; label: string; className?: string; children: ReactNode }`

- [ ] **Step 6: 빌드와 확인.** `bun run build`를 돌린다. 브라우저에서 아래를 확인한다.
  - 홈 카드 클릭 시 커튼이 오르며 `BACKOFFICE` 라벨이 보이고, 상세로 이동한 뒤 커튼이 위로 퇴장한다.
  - `← 홈` 클릭 시 `KIM BOMI` 커튼이 뜨고, 홈 갤러리 위치로 복원된다.
  - PREV/NEXT 클릭 시 커튼이 뜨고 상단에서 시작한다.
  - 연속 클릭해도 전환이 겹치지 않는다.
  - reduced-motion 에뮬레이션(CDP `Emulation.setEmulatedMedia` `prefers-reduced-motion: reduce`)에서는 즉시 이동한다.

### Task 3.4: 매그네틱 이중 강도와 커서 라벨

**Files:**
- Modify: `src/lib/useMagneticFollow.ts`, `src/components/common/Pill.tsx`, `src/components/common/MagneticButton.tsx`, `src/lib/useCursorFollow.ts`, `src/components/common/NeonCursorRing.tsx`, `src/styles/global.css`
- Create: `src/lib/cursor.ts`

- [ ] **Step 1: `useMagneticFollow.ts`를 교체한다.** 버튼과 내부 텍스트를 서로 다른 강도로 끌어당기고, 벗어나면 elastic으로 복귀한다. fine pointer와 motion 허용일 때만 동작한다.

```ts
import { useEffect, useRef } from 'react'
import { gsap } from './gsapSetup'
import { MEDIA } from './media'

/** zone 위 마우스 → target(버튼)과 inner(텍스트)를 다른 강도로 끌어당김 */
export const useMagneticFollow = (strength = 0.35, innerStrength = strength * 0.6) => {
  const zoneRef = useRef<HTMLDivElement>(null)
  const targetRef = useRef<HTMLElement>(null)
  const innerRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const canMagnet =
      window.matchMedia(MEDIA.motion).matches && window.matchMedia(MEDIA.finePointer).matches
    const zone = zoneRef.current
    const target = targetRef.current
    const inner = innerRef.current
    if (!canMagnet || !zone || !target) return

    const handleMouseMove = (event: MouseEvent) => {
      const rect = zone.getBoundingClientRect()
      const x = event.clientX - (rect.left + rect.width / 2)
      const y = event.clientY - (rect.top + rect.height / 2)
      gsap.to(target, { x: x * strength, y: y * strength, duration: 0.45, ease: 'power3.out', overwrite: true })
      if (inner) {
        gsap.to(inner, { x: x * innerStrength, y: y * innerStrength, duration: 0.45, ease: 'power3.out', overwrite: true })
      }
    }

    const handleMouseLeave = () => {
      gsap.to([target, inner].filter(Boolean), {
        x: 0,
        y: 0,
        duration: 1,
        ease: 'elastic.out(1, 0.35)',
        overwrite: true,
      })
    }

    zone.addEventListener('mousemove', handleMouseMove)
    zone.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      zone.removeEventListener('mousemove', handleMouseMove)
      zone.removeEventListener('mouseleave', handleMouseLeave)
      gsap.set([target, inner].filter(Boolean), { x: 0, y: 0 })
    }
  }, [strength, innerStrength])

  return { zoneRef, targetRef, innerRef }
}
```

- [ ] **Step 2: Pill과 MagneticButton에 내부 텍스트 span을 단다.** 두 컴포넌트에 `innerStrength?: number` prop을 추가하고, children을 아래 span으로 감싼다. 레이아웃은 바뀌지 않아야 한다.
  - Pill: `<span ref={innerRef} className="inline-flex items-center gap-2">{children}</span>`
  - MagneticButton: `<span ref={innerRef} className="inline-flex items-center justify-center">{children}</span>`
- [ ] **Step 3: `cursor.ts`를 만든다.**

```ts
export type CursorKind = 'open' | 'view' | 'read'

export const CURSOR_LABELS: Record<CursorKind, string> = {
  open: 'OPEN',
  view: 'VIEW',
  read: 'READ',
}

const isCursorKind = (value: string | undefined): value is CursorKind =>
  value === 'open' || value === 'view' || value === 'read'

export const cursorKindOf = (element: Element | null): CursorKind | null => {
  const host = element?.closest<HTMLElement>('[data-cursor]')
  const kind = host?.dataset.cursor
  return isCursorKind(kind) ? kind : null
}
```

- [ ] **Step 4: `useCursorFollow.ts`를 바꾼다.**
  - 매 pointermove마다 `elementFromPoint`로 판정하던 것을 `pointerover` 이벤트 위임으로 바꾼다.
  - 라벨 요소를 받는 옵션 `labelRef`를 추가한다.
  - `isHoverTargetAt`을 `isInteractive(target: Element)`로 바꾼다. 로직은 기존 closest + computed cursor walk와 같다.

```ts
const handlePointerOver = (event: PointerEvent) => {
  const hit = event.target instanceof Element ? event.target : null
  const kind = cursorKindOf(hit)
  el.classList.toggle('neon-cursor--pointer', hit ? isInteractive(hit) : false)
  el.classList.toggle('neon-cursor--label', kind !== null)
  if (label) label.textContent = kind ? CURSOR_LABELS[kind] : ''
}
```

  `pointermove`는 좌표 갱신만 한다. `window.addEventListener('pointerover', handlePointerOver, { passive: true })`.

- [ ] **Step 5: NeonCursorRing에 라벨을 넣는다.** `useCursorFollow(followRef, { labelRef })`로 넘긴다.

```tsx
<div ref={followRef} className="neon-cursor" aria-hidden>
  <div className="neon-cursor__visual">
    <div className="neon-cursor__ring" />
  </div>
  <span ref={labelRef} className="neon-cursor__label" />
</div>
```

- [ ] **Step 6: `global.css`에 라벨 스타일을 추가한다.**

```css
.neon-cursor__label {
  position: absolute;
  top: 50%;
  left: 50%;
  translate: -50% -50%;
  font-family: var(--font-ui);
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.15em;
  color: var(--dark-ground);
  opacity: 0;
  transition: opacity 0.25s ease;
}

.neon-cursor--label .neon-cursor__visual {
  transform: scale(2.1);
}

.neon-cursor--label .neon-cursor__ring {
  border-color: var(--neon);
  background: var(--neon);
}

.neon-cursor--label .neon-cursor__label {
  opacity: 1;
}
```

- [ ] **Step 7: 커서 라벨을 지정한다.**
  - `data-cursor="open"`: Gallery 카드 버튼, PagerCard.
  - `data-cursor="view"`: Pilot 이미지 버튼, Work shot 버튼.
  - `data-cursor="read"`: Journal 포스트 행. Journal은 Task 5.6에서 지정한다.
- [ ] **Step 8: 빌드와 확인.** `bun run build`를 돌린다. 데스크톱에서 아래를 확인한다.
  - Nav `contact me`, Contact Pill, Gallery ‹ ›, 상세 링크 Pill은 버튼과 텍스트가 어긋나게 끌려오고, 벗어나면 elastic으로 복귀한다.
  - Gallery 카드 위에서 커서 링이 확대되며 OPEN이 보인다.
  - 390px 모바일 에뮬레이션에서는 커서와 매그네틱이 없다.
- [ ] **Step 9: Stage 3를 보고하고 멈춘다.**

---

## Stage 4 — 프리로더 (hello)

### Task 4.1: 인사 문구, 프리로드, hello 경로

**Files:**
- Modify: `src/content/about.ts`
- Create: `src/lib/preload.ts`, `src/components/preloader/helloPath.ts`

- [ ] **Step 1: `about.ts`에 인사 문구를 추가한다.** 프롬프트 3장 원문 순서이고, 처음과 끝이 모두 `안녕하세요`다.

```ts
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
```

- [ ] **Step 2: `preload.ts`를 만든다.** 폰트, 랜딩 이미지 decode, 영상 메타데이터를 받는다. 각 항목은 4초 타임아웃이고 실패해도 진행한다.

```ts
import { HERO_IMAGE, HERO_VIDEO_SRC } from '../content/about'

const TIMEOUT_MS = 4000

const withTimeout = (task: Promise<unknown>): Promise<void> =>
  Promise.race([
    task.then(() => undefined, () => undefined),
    new Promise<void>((resolve) => window.setTimeout(resolve, TIMEOUT_MS)),
  ])

const loadImage = (src: string): Promise<void> => {
  const image = new Image()
  image.src = src
  return image.decode()
}

const loadVideoMetadata = (src: string): Promise<void> =>
  new Promise((resolve) => {
    const video = document.createElement('video')
    const handleDone = () => resolve()
    video.preload = 'metadata'
    video.muted = true
    video.addEventListener('loadedmetadata', handleDone, { once: true })
    video.addEventListener('error', handleDone, { once: true })
    video.src = src
  })

/** 실제 로딩 진행도(0~1)를 onProgress로 보고, 전부 끝나면 resolve */
export const preloadAssets = (onProgress: (ratio: number) => void): Promise<void> => {
  const tasks = [document.fonts.ready, loadImage(HERO_IMAGE.src), loadVideoMetadata(HERO_VIDEO_SRC)]
  let done = 0

  return Promise.all(
    tasks.map((task) =>
      withTimeout(task).then(() => {
        done += 1
        onProgress(done / tasks.length)
      }),
    ),
  ).then(() => undefined)
}
```

- [ ] **Step 3: `helloPath.ts`를 만든다.** 필기체 hello 단일 획이다. 획 순서는 h → e → l → l → o.
  - 1차 경로로 시작하고, Step 4.2 확인 단계에서 육안으로 좌표를 조정한다.
  - 사용자가 다듬은 SVG를 주면 이 상수만 교체한다.

```ts
export const HELLO_VIEWBOX = '0 0 448 200'

export const HELLO_PATH = [
  'M 24 168',
  'C 60 140 96 84 98 44',
  'C 99 22 78 18 72 42',
  'C 64 78 60 128 58 170',
  'C 70 136 92 116 112 120',
  'C 132 124 124 156 136 168',
  'C 156 182 196 150 198 128',
  'C 200 108 172 108 166 130',
  'C 158 160 182 176 210 166',
  'C 244 150 262 86 262 48',
  'C 262 22 240 24 238 52',
  'C 236 92 240 140 258 166',
  'C 282 150 302 92 302 52',
  'C 302 26 280 28 278 56',
  'C 276 96 280 142 298 166',
  'C 312 178 330 150 346 128',
  'C 332 108 368 98 378 122',
  'C 388 150 360 178 340 160',
  'C 326 146 344 120 376 120',
  'C 398 120 412 112 424 104',
].join(' ')
```

### Task 4.2: Preloader 컴포넌트

**Files:**
- Create: `src/components/preloader/Preloader.tsx`
- Modify: `src/app/RootLayout.tsx`

시간 예산은 아래와 같고 합계 약 3.3초다(2.5~3.5초 범위).

| 구간 | 시간 |
|---|---|
| 획 드로잉 | 0.95s |
| hello 페이드 | 0.2s |
| 인사 8회 교체 | 0.12s × 8 = 0.96s |
| 마지막 안녕하세요 홀드 | 0.35s |
| 커튼 퇴장 | 0.8s |

로딩이 늦으면 드로잉이 끝난 뒤 `addPause`에서 기다린다. 재방문은 0.6초, reduced-motion은 페이드 0.3초다. `sessionStorage` 키는 `preloader-seen`이고, StrictMode 이중 실행 대비로 모드는 `useState` 초기화에서 한 번만 정한다.

- [ ] **Step 1: 컴포넌트를 작성한다.**

```tsx
import { useRef, useState } from 'react'
import Display from '../common/Display'
import { GREETINGS } from '../../content/about'
import { gsap, useGSAP } from '../../lib/gsapSetup'
import { prefersReducedMotion } from '../../lib/motion'
import { preloadAssets } from '../../lib/preload'
import { lockScroll, unlockScroll } from '../../lib/useLenis'
import { HELLO_PATH, HELLO_VIEWBOX } from './helloPath'

type PreloaderMode = 'full' | 'short' | 'reduce'

const SEEN_KEY = 'preloader-seen'
const GREET_STEP = 0.12

const pickMode = (): PreloaderMode => {
  if (prefersReducedMotion()) return 'reduce'
  return sessionStorage.getItem(SEEN_KEY) === '1' ? 'short' : 'full'
}

export default function Preloader() {
  const [mode] = useState<PreloaderMode>(pickMode)
  const [visible, setVisible] = useState(true)

  const rootRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const root = rootRef.current
      const path = root?.querySelector<SVGPathElement>('[data-hello-path]')
      if (!root || !path) return

      lockScroll('preloader')

      const handleFinish = () => {
        sessionStorage.setItem(SEEN_KEY, '1')
        unlockScroll('preloader')
        setVisible(false)
      }

      if (mode === 'reduce') {
        gsap.to(root, { autoAlpha: 0, duration: 0.3, delay: 0.1, onComplete: handleFinish })
        return () => unlockScroll('preloader')
      }

      const exit = (tl: gsap.core.Timeline, duration: number) =>
        tl
          .to('[data-preloader-stage]', { yPercent: -100, duration, ease: 'power3.inOut' })
          .to('[data-preloader-cap]', { scaleY: 1, duration: duration * 0.5, ease: 'power2.out' }, '<')

      if (mode === 'short') {
        gsap.set('[data-greet]', { autoAlpha: 0 })
        gsap.set('[data-greet]:last-child', { autoAlpha: 1 })
        exit(gsap.timeline({ onComplete: handleFinish }), 0.6)
        return () => unlockScroll('preloader')
      }

      const length = path.getTotalLength()
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length })
      gsap.set('[data-greet]', { autoAlpha: 0 })
      gsap.set('[data-preloader-bar]', { scaleX: 0 })

      const ready = preloadAssets((ratio) => {
        gsap.to('[data-preloader-bar]', { scaleX: ratio, duration: 0.4, ease: 'power2.out' })
      })

      const tl = gsap.timeline({ onComplete: handleFinish })
      tl.to(path, { strokeDashoffset: 0, duration: 0.95, ease: 'power2.inOut' })
        .addPause('+=0', () => {
          ready.then(() => tl.resume())
        })
        .to('[data-hello]', { autoAlpha: 0, duration: 0.2 })

      gsap.utils.toArray<HTMLElement>('[data-greet]').forEach((greet, index) => {
        tl.set('[data-greet]', { autoAlpha: 0 }, index === 0 ? '>' : `+=${GREET_STEP}`)
        tl.set(greet, { autoAlpha: 1 }, '<')
      })

      tl.to('[data-preloader-bar]', { autoAlpha: 0, duration: 0.2 }, '+=0.15')
      exit(tl.to({}, { duration: 0.2 }), 0.8)

      return () => unlockScroll('preloader')
    },
    { scope: rootRef },
  )

  if (!visible) return null

  return (
    <div ref={rootRef} className="fixed inset-0 z-[100]" aria-hidden>
      <div data-preloader-stage className="absolute inset-x-0 top-0 flex h-[112vh] flex-col">
        <div className="relative flex h-screen items-center justify-center bg-dark-ground text-dark-ink">
          <svg
            data-hello
            className="w-[min(56vw,420px)]"
            viewBox={HELLO_VIEWBOX}
            fill="none"
          >
            <path
              data-hello-path
              d={HELLO_PATH}
              stroke="currentColor"
              strokeWidth={9}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="absolute inset-0 grid place-items-center">
            {GREETINGS.map((greet, index) => (
              <Display
                key={`${greet}-${index}`}
                data-greet
                className="col-start-1 row-start-1 font-kr text-[clamp(36px,6vw,88px)] opacity-0"
              >
                {greet}
              </Display>
            ))}
          </div>
          <span
            data-preloader-bar
            className="absolute bottom-[var(--pad)] left-[var(--pad)] h-px w-[calc(100%-var(--pad)*2)] origin-left scale-x-0 bg-dark-ink/40"
          />
        </div>
        <svg
          data-preloader-cap
          className="block h-[12vh] w-full origin-top scale-y-0"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path d="M0 0 Q50 100 100 0 Z" className="fill-dark-ground" />
        </svg>
      </div>
    </div>
  )
}
```

  `'[data-greet]:last-child'`는 grid 안 마지막 Display(마지막 `안녕하세요`)를 가리킨다.

- [ ] **Step 2: RootLayout에 넣는다.** `<PageTransition>` 안 `NeonCursorRing` 다음에 `<Preloader />`를 넣는다.
- [ ] **Step 3: 빌드와 확인.** `bun run build`를 돌린다. 브라우저에서 아래를 확인한다.
  - 새 탭에서는 hello 획 → 인사 9개 → 커튼 퇴장 순서로 진행되고, 문(BO MI.) 화면으로 이어진다.
  - 총 길이는 약 3.3초다.
  - 새로고침하면 0.6초짜리 짧은 버전이 나온다(sessionStorage 유지).
  - reduced-motion에서는 페이드만 나온다.
  - 프리로더가 도는 동안 스크롤 휠이 막히고, 끝나면 풀린다.
  - hello 획 모양이 어색하면 `helloPath.ts` 좌표를 조정하고, 조정 전후 스크린샷을 보고에 첨부한다.
- [ ] **Step 4: Stage 4를 보고하고 멈춘다.**

---

## Stage 5 — 홈 섹션

### Task 5.1: Hero

**Files:**
- Create: `src/lib/hero.ts`
- Modify: `src/sections/Hero.tsx`

- [ ] **Step 1: `hero.ts`를 만든다.**

```ts
export const HERO_PIN = {
  desktop: '+=2000%',
  mobile: '+=1200%',
} as const
```

- [ ] **Step 2: 타임라인 위치를 유지한 채 바꾼다.** 문, 영상 스크럽, 블랙, 랜딩의 타임라인 위치는 그대로 둔다. 아래만 바꾼다.
  - `end: '+=2000%'` → `end: window.matchMedia(MEDIA.mobile).matches ? HERO_PIN.mobile : HERO_PIN.desktop`
  - h1 `KIM BOMI`: `data-hero-copy`를 빼고 `data-hero-name`을 붙인다. `[transform:...]` 래퍼는 유지한다.
  - 타임라인 생성 직전에 SplitText를 만든다(아래 코드).
  - `.fromTo('[data-hero-copy]', …, 0.88)` 바로 뒤에 글자 리빌을 넣는다(아래 코드).

```ts
const nameSplit = SplitText.create('[data-hero-name]', { type: 'chars', mask: 'chars' })
```

```ts
.fromTo(
  nameSplit.chars,
  { yPercent: 110 },
  { yPercent: 0, duration: 0.1, stagger: 0.012, ease: 'expo.out' },
  0.88,
)
```

  SplitText는 useGSAP 컨텍스트에서 만들었기 때문에 revert 시 자동 복원된다. `aria` 기본값(`auto`)으로 h1에 aria-label이 유지된다.

- [ ] **Step 3: 3D 슬롯 자리를 둔다.** 실제 `SceneSlot` 장착은 Task 7.2에서 한다. 지금은 랜딩 레이어 안 타이포 블록 앞에 빈 래퍼만 둔다.

```tsx
<div
  data-hero-object
  className="pointer-events-none absolute top-1/2 right-[calc(var(--pad)+min(44vw,620px))] z-[3] size-[clamp(180px,20vw,300px)] -translate-y-1/2 max-md:top-[calc(var(--nav-h)+16px)] max-md:right-[var(--pad)] max-md:size-[120px] max-md:translate-y-0"
  aria-hidden
/>
```

- [ ] **Step 4: 빌드와 확인.** `bun run build`를 돌린다. 아래를 확인한다.
  - 문 열림 → 영상 스크럽 → 블랙 → 랜딩 흐름이 기존과 같다.
  - KIM BOMI가 글자 단위로 마스크 리빌된다.
  - 역스크롤 시 되감긴다.
  - 마우스 패럴랙스가 유지된다.
  - 모바일 pin이 짧아졌다.

### Task 5.2: 속도 반응 마퀴

**Files:**
- Modify: `src/content/about.ts`, `src/pages/Home.tsx`
- Create: `src/sections/Marquee.tsx`

- [ ] **Step 1: `about.ts`에 마퀴 문구를 추가한다.** 문구는 기존 것만 쓴다.

```ts
export const MARQUEE_ROWS = [
  ['KIM BOMI — FRONTEND — '],
  ['Make it. Leave it. Bring it back.', 'MAKER KIMBOMI'],
] as const
```

- [ ] **Step 2: `Marquee.tsx`를 작성한다.**
  - 줄마다 기본 방향이 반대다.
  - 스크롤 방향이 바뀌면 둘 다 뒤집힌다.
  - Lenis velocity로 가속하고, 손을 떼면 감쇠한다.
  - 화면 밖에서는 tick을 멈추고, 세트 하나의 너비로 wrap한다.

```tsx
import { useRef } from 'react'
import Display from '../components/common/Display'
import { MARQUEE_ROWS } from '../content/about'
import { cn } from '../lib/cn'
import { ground } from '../lib/ground'
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsapSetup'
import { matchMediaPreset } from '../lib/media'
import { onScroll } from '../lib/useLenis'

const BASE_SPEED = 0.6
const MAX_BOOST = 14
const REPEAT = 4

export default function Marquee() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = matchMediaPreset(({ motion }) => {
        if (!motion) return

        const rows = gsap.utils.toArray<HTMLElement>('[data-marquee-row]').map((row, index) => {
          const firstSet = row.firstElementChild
          return {
            setX: gsap.quickSetter(row, 'x', 'px'),
            x: 0,
            width: firstSet instanceof HTMLElement ? firstSet.offsetWidth : 0,
            base: index % 2 === 0 ? -1 : 1,
            firstSet,
          }
        })

        let direction = 1
        let boost = 0
        let active = false

        const measure = () => {
          rows.forEach((row) => {
            if (row.firstSet instanceof HTMLElement) row.width = row.firstSet.offsetWidth
          })
        }

        const tick = (_time: number, deltaTime: number) => {
          if (!active) return
          const step = deltaTime / 16.67
          boost *= 0.92
          rows.forEach((row) => {
            if (row.width === 0) return
            row.x += row.base * direction * (BASE_SPEED + boost) * step
            row.x = gsap.utils.wrap(-row.width, 0, row.x)
            row.setX(row.x)
          })
        }

        const offScroll = onScroll(({ velocity, direction: next }) => {
          if (next !== 0) direction = next
          boost = Math.min(Math.abs(velocity) * 0.6, MAX_BOOST)
        })

        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          onToggle: (self) => {
            active = self.isActive
          },
        })
        ScrollTrigger.addEventListener('refresh', measure)
        gsap.ticker.add(tick)

        return () => {
          offScroll()
          gsap.ticker.remove(tick)
          ScrollTrigger.removeEventListener('refresh', measure)
        }
      })
      return () => mm.revert()
    },
    { scope: sectionRef },
  )

  return (
    <section
      ref={sectionRef}
      className={cn(ground.dark, 'relative overflow-hidden border-y border-hairline py-[clamp(20px,3vw,40px)]')}
      aria-hidden
    >
      {MARQUEE_ROWS.map((phrases, rowIndex) => (
        <div key={rowIndex} data-marquee-row className="flex w-max will-change-transform motion-reduce:will-change-auto">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center">
              {Array.from({ length: REPEAT }, (_, repeat) =>
                phrases.map((phrase) => (
                  <span key={`${repeat}-${phrase}`} className="flex items-center">
                    <Display className="px-[0.4em] text-[clamp(44px,8vw,128px)] leading-[1.05] whitespace-pre">
                      {phrase}
                    </Display>
                    {phrases.length > 1 ? <span className="size-[0.5em] rounded-full bg-neon" /> : null}
                  </span>
                )),
              )}
            </div>
          ))}
        </div>
      ))}
    </section>
  )
}
```

  둘째 줄의 네온 점은 장식 요소이고, 섹션 전체가 `aria-hidden`이다. 문구는 Hero에 이미 있다.

- [ ] **Step 3: Home에 넣는다.** `<Hero />` 다음에 `<Marquee />`를 둔다.
- [ ] **Step 4: 빌드와 확인.** `bun run build`를 돌린다. 아래를 확인한다.
  - 천천히 스크롤하면 기본 속도로 흐른다.
  - 빠르게 스크롤하면 가속한다.
  - 위로 스크롤하면 두 줄 모두 방향이 뒤집힌다.
  - 화면 밖에서는 tick이 정지한다(Performance 패널로 확인).
  - reduced-motion에서는 정지 상태로 렌더된다.

### Task 5.3: Projects — 데스크톱 수평 Rail / 모바일 Fan

**Files:**
- Modify: `src/sections/Gallery.tsx` (분기만 남김)
- Create: `src/sections/gallery/GalleryHeader.tsx`, `GalleryControls.tsx`, `GalleryFan.tsx`, `GalleryRail.tsx`

WebGL 왜곡은 Stage 7(Task 7.3)에서 `DistortImageSlot`으로 바꿔 끼운다. 이 태스크에서는 일반 `<img>`를 쓴다.

- [ ] **Step 1: `GalleryHeader.tsx`를 만든다.** `Gallery.tsx` 69–76행의 header를 그대로 옮긴다(`PROJECTS`, 제목 2줄).
- [ ] **Step 2: `GalleryControls.tsx`를 만든다.** `Gallery.tsx` 115–137행을 옮기고 props로 받는다. 카운터, 제목, ‹ › MagneticButton 마크업은 기존과 동일하다.

```tsx
type GalleryControlsProps = {
  active: number
  total: number
  title: string
  onPrev: () => void
  onNext: () => void
}
```

- [ ] **Step 3: `GalleryFan.tsx`를 만든다.** 기존 `Gallery` 본문(부채꼴 + motion 스와이프 + `SlideCard`)을 그대로 옮기고, `<section id="work">` 래퍼와 `GalleryHeader`·`GalleryControls`를 쓴다.
  - `SlideCard`에 `labelEyebrow`를 추가한다. Display 바로 위에 둔다.
  - 버튼에 `data-cursor="open"`을 붙인다.

```tsx
{work.labelEyebrow ? <Label className="text-dark-ink/55">{work.labelEyebrow}</Label> : null}
```

- [ ] **Step 4: `GalleryRail.tsx`를 만든다.**
  - 섹션 전체를 pin하고 트랙을 x로 이동한다.
  - 진행도로 active를 계산하고, ‹ ›는 해당 카드 위치로 스크롤한다.
  - reduced-motion이면 pin 없이 `overflow-x-auto`로 둔다.

```tsx
import { useRef, useState } from 'react'
import Display from '../../components/common/Display'
import Label from '../../components/common/Label'
import { WORKS, type WorkItem } from '../../content/works'
import { cn } from '../../lib/cn'
import { ground } from '../../lib/ground'
import { gsap, ScrollTrigger, useGSAP } from '../../lib/gsapSetup'
import { matchMediaPreset } from '../../lib/media'
import { getLenis } from '../../lib/useLenis'
import GalleryControls from './GalleryControls'
import GalleryHeader from './GalleryHeader'

type GalleryRailProps = {
  onOpenWork: (slug: string) => void
}

export default function GalleryRail({ onOpenWork }: GalleryRailProps) {
  const [active, setActive] = useState(0)

  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLUListElement>(null)
  const triggerRef = useRef<ScrollTrigger | null>(null)

  const total = WORKS.length

  const scrollToCard = (index: number) => {
    const trigger = triggerRef.current
    const next = gsap.utils.clamp(0, total - 1, index)
    if (!trigger) {
      setActive(next)
      return
    }
    const y = trigger.start + (trigger.end - trigger.start) * (next / (total - 1))
    const lenis = getLenis()
    if (lenis) lenis.scrollTo(y, { duration: 1.1 })
    else window.scrollTo({ top: y, behavior: 'smooth' })
  }

  const handlePrev = () => scrollToCard(active - 1)

  const handleNext = () => scrollToCard(active + 1)

  useGSAP(
    () => {
      const mm = matchMediaPreset(({ motion }) => {
        const track = trackRef.current
        if (!motion || !track) return

        const getDistance = () => Math.max(0, track.scrollWidth - window.innerWidth)

        const tween = gsap.to(track, {
          x: () => -getDistance(),
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: () => `+=${getDistance()}`,
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const next = Math.round(self.progress * (total - 1))
              setActive((prev) => (prev === next ? prev : next))
            },
          },
        })
        triggerRef.current = tween.scrollTrigger ?? null

        return () => {
          triggerRef.current = null
        }
      })
      return () => mm.revert()
    },
    { scope: sectionRef },
  )

  return (
    <section
      ref={sectionRef}
      className={cn(
        ground.light,
        'relative flex h-svh min-h-[640px] flex-col overflow-hidden pt-[calc(var(--nav-h)+22px)] pb-8',
      )}
      id="work"
    >
      <div className="px-[var(--pad)]">
        <GalleryHeader />
      </div>
      <div className="mt-8 min-h-0 flex-1 motion-reduce:overflow-x-auto">
        <ul ref={trackRef} className="flex h-full w-max list-none items-center gap-[clamp(20px,3vw,48px)] px-[var(--pad)]">
          {WORKS.map((work, index) => (
            <RailCard key={work.slug} work={work} index={index} onOpen={onOpenWork} />
          ))}
        </ul>
      </div>
      <div className="px-[var(--pad)]">
        <GalleryControls
          active={active}
          total={total}
          title={WORKS[active].title}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      </div>
    </section>
  )
}

type RailCardProps = {
  work: WorkItem
  index: number
  onOpen: (slug: string) => void
}

function RailCard({ work, index, onOpen }: RailCardProps) {
  const image = work.compare ?? work.thumb

  const handleClick = () => onOpen(work.slug)

  return (
    <li className="w-[clamp(320px,34vw,520px)] shrink-0">
      <button
        type="button"
        data-cursor="open"
        aria-label={`${work.title} 케이스 스터디 열기`}
        className="group block w-full overflow-hidden rounded-xl text-left !text-dark-ink shadow-[0_18px_40px_rgba(0,0,0,0.18)]"
        onClick={handleClick}
      >
        <span data-rail-image className="block aspect-[8/5] overflow-hidden bg-card-ground">
          <img
            src={image.src}
            alt={work.compare ? work.compare.alt : ''}
            className={cn('size-full', work.compare ? 'object-contain' : 'object-cover')}
            loading={index < 2 ? 'eager' : 'lazy'}
            decoding="async"
            draggable={false}
          />
        </span>
        <span className="flex flex-col gap-1.5 bg-dark-ground p-4">
          <span className="flex items-center gap-2">
            <Label className="text-neon">{`0${index + 1}`}</Label>
            {work.status ? (
              <Label className="rounded-full bg-neon px-2 py-0.5 text-dark-ground">{work.status}</Label>
            ) : null}
          </span>
          {work.labelEyebrow ? <Label className="text-dark-ink/55">{work.labelEyebrow}</Label> : null}
          <Display className="text-[clamp(22px,2vw,32px)] leading-[0.95] break-words">{work.label}</Display>
          <Label className="text-dark-ink/70">{work.homeLine}</Label>
          <Label className="mt-1 text-dark-ink group-hover:text-neon">OPEN CASE →</Label>
        </span>
      </button>
    </li>
  )
}
```

  `shadow-[...rgba(0,0,0,0.18)]`는 기존 SlideCard 값을 그대로 쓴 것이다.

- [ ] **Step 5: `Gallery.tsx`를 분기만 남긴다.**

```tsx
import GalleryFan from './gallery/GalleryFan'
import GalleryRail from './gallery/GalleryRail'
import { MEDIA } from '../lib/media'
import { useMediaQuery } from '../lib/useMediaQuery'

type GalleryProps = {
  onOpenWork: (slug: string) => void
}

export default function Gallery({ onOpenWork }: GalleryProps) {
  const isDesktop = useMediaQuery(MEDIA.desktop)

  return isDesktop ? <GalleryRail onOpenWork={onOpenWork} /> : <GalleryFan onOpenWork={onOpenWork} />
}
```

- [ ] **Step 6: 빌드와 확인.** `bun run build`를 돌린다. 아래를 확인한다.
  - 데스크톱: pin 상태에서 카드 6개가 가로로 지나간다.
  - 데스크톱: 카운터와 제목이 진행도에 맞게 바뀐다.
  - 데스크톱: ‹ ›를 누르면 해당 카드 위치로 스크롤된다.
  - 데스크톱: 카드를 클릭하면 커튼 전환이 일어난다.
  - 데스크톱: 상세에서 돌아오면 같은 카드 위치로 복원된다.
  - 390px: 기존 부채꼴 스와이프가 유지되고 `SEO GEO AEO`가 표시된다.
  - 창 크기를 바꾸면 Rail과 Fan이 전환된다.

### Task 5.4: 일하는 방식 (`#roster`)

**Files:** Modify `src/sections/Method.tsx`

- [ ] **Step 1: 섹션 클래스를 바꾼다(pin 제거).** `h-screen … overflow-hidden` 대신 아래를 쓴다. `motion-reduce:` 클래스는 지운다(이미 정적이다).

```ts
cn(ground.light, 'relative flex flex-col gap-[6vh] px-[var(--pad)] py-[16vh]')
```

- [ ] **Step 2: 스테이트먼트에 split 대상을 표시한다.** 두 평문 조각을 `<span data-split-words>`로 감싼다. 문구는 그대로다.

```tsx
<span data-split-words>잘 모르는 걸 만나면 일단 적고,</span>
<br />
<MarkedPhrase>…기존 그대로…</MarkedPhrase>
<span data-split-words>로 남깁니다.</span>
```

- [ ] **Step 3: 3D 슬롯 자리를 둔다.** 섹션 우상단에 빈 래퍼를 둔다(장착은 Task 7.2).

```tsx
<div
  data-roster-object
  className="pointer-events-none absolute top-[12vh] right-[var(--pad)] size-[clamp(96px,10vw,160px)] max-md:size-[72px]"
  aria-hidden
/>
```

- [ ] **Step 4: useGSAP을 교체한다.**

```ts
useGSAP(
  () => {
    const mm = matchMediaPreset(({ motion, desktop }) => {
      if (!motion) return

      const words = gsap.utils
        .toArray<HTMLElement>('[data-split-words]')
        .flatMap((el) => SplitText.create(el, { type: 'words', mask: 'words' }).words)

      gsap.from(words, {
        yPercent: 110,
        stagger: 0.05,
        ease: 'none',
        scrollTrigger: { trigger: '[data-statement]', start: 'top 85%', end: 'top 45%', scrub: 0.6 },
      })

      gsap
        .timeline({
          scrollTrigger: { trigger: '[data-statement]', start: 'top 60%', end: 'top 25%', scrub: 0.6 },
        })
        .fromTo('[data-mark-fill]', { scaleX: 0 }, { scaleX: 1, ease: 'power3.inOut' })
        .fromTo(
          '[data-mark-text]',
          { clipPath: 'inset(0 100% 0 0)' },
          { clipPath: 'inset(0 0% 0 0)', ease: 'power3.out' },
          '-=0.2',
        )

      const depths = desktop ? [60, 110, 160] : [24]
      gsap.utils.toArray<HTMLElement>('[data-row]').forEach((row, index) => {
        gsap.fromTo(
          row,
          { y: depths[index % depths.length], autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            ease: 'none',
            scrollTrigger: { trigger: row, start: 'top bottom', end: 'top 62%', scrub: 0.6 },
          },
        )
      })
    })
    return () => mm.revert()
  },
  { scope: sectionRef },
)
```

- [ ] **Step 5: 빌드와 확인.** `bun run build`를 돌린다. 아래를 확인한다.
  - 단어가 마스크 리빌된다.
  - 하이라이트 마크가 scrub로 채워진다.
  - 9행이 서로 다른 속도로 올라온다.
  - hover나 Tab 포커스로 note가 펼쳐진다(기존 유지).
  - reduced-motion에서는 정적으로 렌더되고 마크가 채워진 상태다.

### Task 5.5: AI WORKFLOW (`#pilot`) + FlipLightbox

**Files:**
- Create: `src/lib/useFocusTrap.ts`, `src/components/common/FlipLightbox.tsx`
- Modify: `src/sections/Pilot.tsx`

- [ ] **Step 1: `useFocusTrap.ts`를 만든다.**

```ts
import { useEffect, type RefObject } from 'react'

const FOCUSABLE =
  'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'

export const useFocusTrap = (ref: RefObject<HTMLElement | null>): void => {
  useEffect(() => {
    const root = ref.current
    if (!root) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return
      const items = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE))
      const first = items[0]
      const last = items[items.length - 1]
      if (!first || !last) {
        event.preventDefault()
        return
      }
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    root.addEventListener('keydown', handleKeyDown)
    return () => root.removeEventListener('keydown', handleKeyDown)
  }, [ref])
}
```

- [ ] **Step 2: `FlipLightbox.tsx`를 만든다.**
  - 열 때는 썸네일 위치에서 풀스크린으로 커지고(`Flip.fit` 후 원위치로 tween), 닫을 때는 썸네일로 돌아간다.
  - ESC로 닫히고, 포커스 트랩과 Lenis 잠금이 걸리며, 닫힌 뒤 열었던 요소로 포커스가 돌아간다.
  - reduced-motion이거나 origin이 없으면 페이드만 한다.

```tsx
import { useEffect, useRef, type MouseEvent } from 'react'
import { createPortal } from 'react-dom'
import { Flip, gsap, useGSAP } from '../../lib/gsapSetup'
import { prefersReducedMotion } from '../../lib/motion'
import { useFocusTrap } from '../../lib/useFocusTrap'
import { lockScroll, unlockScroll } from '../../lib/useLenis'

type FlipLightboxProps = {
  src: string
  alt: string
  caption?: string
  origin: HTMLElement | null
  onClose: () => void
}

export default function FlipLightbox({ src, alt, caption, origin, onClose }: FlipLightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const closingRef = useRef(false)

  useFocusTrap(dialogRef)
  const { contextSafe } = useGSAP(
    () => {
      const image = imageRef.current
      gsap.from('[data-lightbox-backdrop]', { opacity: 0, duration: 0.35, ease: 'power2.out' })
      if (!image) return
      if (!origin || prefersReducedMotion()) {
        gsap.from(image, { opacity: 0, duration: 0.3 })
        return
      }
      Flip.fit(image, origin, { scale: true })
      gsap.to(image, { x: 0, y: 0, scaleX: 1, scaleY: 1, duration: 0.7, ease: 'expo.out' })
    },
    { scope: dialogRef },
  )

  const handleClose = contextSafe(() => {
    if (closingRef.current) return
    closingRef.current = true
    const image = imageRef.current
    gsap.to('[data-lightbox-backdrop]', { opacity: 0, duration: 0.35 })
    gsap.to('[data-lightbox-chrome]', { opacity: 0, duration: 0.2 })
    if (!image || !origin || prefersReducedMotion()) {
      gsap.to(image, { opacity: 0, duration: 0.25, onComplete: onClose })
      return
    }
    Flip.fit(image, origin, { scale: true, duration: 0.5, ease: 'power3.inOut', onComplete: onClose })
  })

  const handleBackdropClick = () => handleClose()

  const handleCloseClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    handleClose()
  }

  const handleImageClick = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation()
  }

  useEffect(() => {
    const opener = document.activeElement
    lockScroll('lightbox')
    closeRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') handleClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      unlockScroll('lightbox')
      if (opener instanceof HTMLElement) opener.focus()
    }
  }, [handleClose])

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      className="fixed inset-0 z-[80] flex items-center justify-center p-[var(--pad)]"
      onClick={handleBackdropClick}
    >
      <div data-lightbox-backdrop className="absolute inset-0 bg-dark-ground/90" aria-hidden />
      <button
        ref={closeRef}
        data-lightbox-chrome
        type="button"
        className="absolute top-[var(--pad)] right-[var(--pad)] z-[1] font-ui text-[12px] tracking-[0.14em] text-dark-ink"
        onClick={handleCloseClick}
      >
        닫기
      </button>
      <figure className="relative z-[1] flex max-h-full flex-col items-center gap-3" onClick={handleImageClick}>
        <img
          ref={imageRef}
          src={src}
          alt={alt}
          className="max-h-[82vh] max-w-[min(92vw,1100px)] object-contain will-change-transform"
          decoding="async"
        />
        {caption ? (
          <figcaption data-lightbox-chrome className="max-w-[60ch] text-center text-[13px] leading-[1.6] text-dark-ink/70">
            {caption}
          </figcaption>
        ) : null}
      </figure>
    </div>,
    document.body,
  )
}
```

  `handleClose`는 contextSafe가 매 렌더마다 새 함수를 만들기 때문에 effect의 deps가 바뀔 수 있다. 실행할 때 아래 둘 중 하나로 고정한다.
  - `useRef`에 최신 handleClose를 담고 effect deps를 `[]`로 둔다(권장).
  - ESC 리스너를 `useGSAP` 안으로 옮긴다.

- [ ] **Step 3: Pilot을 바꾼다.**
  - 데이터 import는 Task 2.1에서 이미 했다.
  - state를 `openIndex` 대신 `{ index: number; origin: HTMLImageElement } | null`로 바꾼다.
  - `ProtocolCard`에서 이미지 ref를 넘긴다.
  - 기존 `ShotOverlay`와 Task 3.2에서 바꾼 Pilot의 `lockScroll` effect는 삭제한다. FlipLightbox가 둘 다 담당한다.
  - `.shot-overlay` CSS는 더 쓰는 곳이 없으면 삭제한다.
  - `ProtocolCard` 버튼에 `data-cursor="view"`를 붙인다.
  - 카드 루트에 dim 레이어를 추가한다.
  - pin 길이는 모바일에서 줄인다: `end: window.matchMedia(MEDIA.mobile).matches ? '+=220%' : '+=320%'`.

```tsx
const handleOpen = (index: number, origin: HTMLImageElement) => {
  setOpenShot({ index, origin })
}

const handleClose = () => {
  setOpenShot(null)
}
```

```tsx
{openShot ? (
  <FlipLightbox
    src={PROTOCOL[openShot.index].shot}
    alt={PROTOCOL[openShot.index].alt}
    origin={openShot.origin}
    onClose={handleClose}
  />
) : null}
```

```tsx
<span data-dim className="pointer-events-none absolute inset-0 z-[1] bg-black opacity-0" aria-hidden />
```

- [ ] **Step 4: 카드 스택을 고도화한다.** 타임라인의 카드 루프를 아래로 바꾼다. 이전 카드는 scale 0.92로 줄고 어두워지며 뒤로 밀린다.

```ts
lines.forEach((line, i) => {
  tl.set(line, { zIndex: i + 1 }, '+=0.2')
  tl.to(line, { y: 0, duration: 0.55 }, '<')
  lines.slice(0, i).forEach((prev, j) => {
    const depth = i - j
    tl.to(
      prev,
      { y: -(depth * 14), scale: Math.max(0.84, 1 - depth * 0.08), transformOrigin: '50% 0%', duration: 0.55 },
      '<',
    )
    tl.to(prev.querySelector('[data-dim]'), { opacity: Math.min(depth * 0.3, 0.6), duration: 0.55 }, '<')
  })
})
```

- [ ] **Step 5: 3D 슬롯 자리를 둔다.** `data-pilot-object` 래퍼를 섹션 우상단에 둔다. 클래스는 Task 5.4와 동일하다.
- [ ] **Step 6: 빌드와 확인.** `bun run build`를 돌린다. 아래를 확인한다.
  - 카드가 쌓일 때 이전 카드가 0.92로 줄고 어두워진다.
  - 이미지를 클릭하면 썸네일에서 풀스크린으로 Flip 확대된다.
  - 닫기 버튼, ESC, 배경 클릭으로 닫히고 썸네일로 돌아간다.
  - 열려 있는 동안 Tab이 다이얼로그 안을 순환하고, 스크롤이 잠긴다.
  - 닫힌 뒤 열었던 버튼으로 포커스가 돌아간다.

### Task 5.6: Journal (`#journal`)

**Files:** Modify `src/sections/Journal.tsx`

- [ ] **Step 1: pin을 제거한다.** 섹션 클래스를 `cn(ground.light, 'relative flex flex-col justify-center px-[var(--pad)] py-[18vh]')`로 바꾼다.
- [ ] **Step 2: 헤드라인을 줄 마스크로 감싼다.** h2 안의 `<br />`를 줄 단위 래퍼로 바꾼다. 문구는 동일하다.

```tsx
<h2 className="mt-3 font-kr text-[clamp(26px,3.2vw,48px)] leading-[1.15] font-extrabold tracking-[-0.02em]">
  <span data-head-line className="block">적어두면,</span>
  <span data-head-line className="block">다음이 짧아집니다.</span>
</h2>
```

- [ ] **Step 3: 포스트 행에 READ 라벨을 단다.** 각 포스트 `<Hairline as="a">`에 `data-cursor="read"`를 붙인다. 기존 `READ →` Label은 그대로 둔다.
- [ ] **Step 4: useGSAP을 교체한다.**

```ts
useGSAP(
  () => {
    const mm = matchMediaPreset(({ motion }) => {
      if (!motion) return
      gsap.utils.toArray<HTMLElement>('[data-head-line]').forEach((line) => {
        gsap.fromTo(
          line,
          { clipPath: 'inset(0 0 100% 0)', yPercent: 30 },
          {
            clipPath: 'inset(0 0 0% 0)',
            yPercent: 0,
            ease: 'none',
            scrollTrigger: { trigger: line, start: 'top 92%', end: 'top 62%', scrub: 0.6 },
          },
        )
      })
      revealOnce(gsap.utils.toArray<HTMLElement>('[data-head]'))
      gsap.from('[data-row]', {
        y: 30,
        autoAlpha: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '[data-rows]', start: 'top 85%', once: true },
      })
    })
    return () => mm.revert()
  },
  { scope: sectionRef },
)
```

  - Label(`JOURNAL · 100+`)과 본문 p에는 `data-head`를 유지한다. h2에서는 `data-head`를 뺀다.
  - `ul`에는 `data-rows`를 붙인다.

- [ ] **Step 5: 빌드와 확인.** `bun run build`를 돌린다. 아래를 확인한다.
  - 헤드라인 두 줄이 clip 마스크로 차례로 열린다.
  - 포스트 행에 hover하면 커서 링에 READ가 보이고, 링크가 동작한다.

### Task 5.7: Contact (`#contact`)

**Files:** Modify `src/sections/Close.tsx`

- [ ] **Step 1: Pill과 워드마크를 확인한다.** Pill 매그네틱은 Task 3.4로 이미 이중 강도가 적용됐다. `strength={0.4}`로 조금 키운다. 워드마크 scrub(`yPercent` 36→0)은 그대로 둔다.
- [ ] **Step 2: 매그네틱 영역에 여유를 준다.** Pill 래퍼에 `gap-4` + `py-2`를 준다. 레이아웃 변화는 최소화한다.
- [ ] **Step 3: 3D 슬롯 자리를 둔다.** 워드마크 바로 위에 빈 래퍼를 둔다.

```tsx
<div
  data-contact-object
  className="pointer-events-none absolute bottom-[clamp(110px,18vw,280px)] left-1/2 h-[clamp(160px,22vw,320px)] w-[min(90vw,760px)] -translate-x-1/2"
  aria-hidden
/>
```

- [ ] **Step 4: useGSAP을 matchMediaPreset 패턴으로 바꾼다.** 동작은 동일하다.
- [ ] **Step 5: 빌드, 콘텐츠 검사, 화면 확인.**
  - `bun run build`와 `bun scripts/check-content.ts`를 돌린다.
  - 홈 전체를 데스크톱과 390px 스크린샷으로 확인한다.
- [ ] **Step 6: Stage 5를 보고하고 멈춘다.**

---

## Stage 6 — 상세 페이지 `/work/:slug`

> **시작 전 질문:** 1장의 "결정 대기"(sites·alleo `links[]` 노출 여부). 답에 따라 Task 6.1 Step 5가 갈린다.

### Task 6.1: 케이스 히어로

**Files:** Modify `src/pages/Work.tsx` (`WorkTitleMark`, 메인 useGSAP)

- [ ] **Step 1: 래퍼 속성을 정리한다.** `WorkTitleMark` 루트 div에서 `data-rv`를 빼고 `data-work-hero`를 붙인다. 개별 리빌로 바꾸기 위해서다.
- [ ] **Step 2: 각 요소에 애니메이션 대상 표시를 단다.**
  - 제목 Display에 `data-work-title`.
  - oneLiner 줄마다 마스크 래퍼를 단다(아래 코드).
  - stack은 같은 텍스트(`·` join)를 유지하면서 항목별 span으로 나눈다(아래 코드).
  - 썸네일 img를 패럴랙스 래퍼로 감싼다(아래 코드).

```tsx
{work.oneLiner.split('\n').map((line, index) => (
  <span key={index} className="block overflow-hidden">
    <span data-oneliner-line className="block md:whitespace-nowrap">{line}</span>
  </span>
))}
```

```tsx
<Label className={cn('mt-4 max-w-[46rem] text-muted', …기존 조건…)}>
  {work.stack.map((item, index) => (
    <span key={item} data-stack-item className="inline-block">
      {index > 0 ? ' · ' : ''}
      {item}
    </span>
  ))}
</Label>
```

```tsx
<figure className="relative mt-8 overflow-hidden rounded-2xl border border-hairline bg-card-ground">
  <div data-thumb-parallax className="will-change-transform">
    <img data-work-thumb … />
  </div>
  <div data-case-object className="pointer-events-none absolute top-4 right-4 size-[clamp(88px,10vw,140px)]" aria-hidden />
</figure>
```

  - `' · '` 앞뒤 공백 때문에 `inline-block` span 경계에서 공백이 사라질 수 있다. 구분자는 span 밖 텍스트 노드로 둔다. 실행 시 `{index > 0 ? ' · ' : null}<span …>{item}</span>`처럼 Fragment로 처리한다.
  - `data-case-object` 슬롯 장착은 Task 7.2에서 한다.

- [ ] **Step 3: 메인 useGSAP을 교체한다.** 기존 nav, thumb, rv, stats 처리를 아래로 바꾼다. Stats 카운트업은 Task 6.2에서 추가한다.

```ts
useGSAP(
  () => {
    const cleanupImages = pageRef.current ? refreshOnImageLoad(pageRef.current) : undefined
    const mm = matchMediaPreset(({ motion }) => {
      if (!motion) return
      gsap.from('[data-work-nav]', { y: -16, opacity: 0, duration: 0.55, ease: 'power2.out' })
      SplitText.create('[data-work-title]', {
        type: 'lines',
        mask: 'lines',
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, { yPercent: 100, duration: 0.9, stagger: 0.08, ease: 'expo.out', delay: 0.15 }),
      })
      gsap.from('[data-oneliner-line]', { yPercent: 100, duration: 0.8, stagger: 0.08, ease: 'expo.out', delay: 0.35 })
      gsap.from('[data-stack-item]', { y: 12, opacity: 0, duration: 0.5, stagger: 0.04, ease: 'power3.out', delay: 0.5 })
      gsap.from('[data-work-thumb]', { scale: 1.15, duration: 1.4, ease: 'expo.out' })
      gsap.fromTo(
        '[data-thumb-parallax]',
        { yPercent: -4 },
        {
          yPercent: 4,
          ease: 'none',
          scrollTrigger: { trigger: '[data-thumb-parallax]', start: 'top bottom', end: 'bottom top', scrub: true },
        },
      )
      revealOnce(gsap.utils.toArray<HTMLElement>('[data-rv]'))
    })
    return () => {
      mm.revert()
      cleanupImages?.()
    }
  },
  { scope: pageRef, dependencies: [slug], revertOnUpdate: true },
)
```

  - period/status 줄의 `data-rv`는 유지한다.
  - label, role, links 블록에도 `data-rv`를 붙인다.

- [ ] **Step 4: 썸네일 onLoad를 정리한다.** `handleThumbLoad`/`onMarkLoad`는 `refreshOnImageLoad`가 대체하므로 제거한다.
- [ ] **Step 5: links 블록을 결정에 따라 처리한다.**
  - A(숨김): 조건 `work.links.length > 0 && !work.entries`를 그대로 둔다.
  - B(노출): 조건을 `work.links.length > 0`으로 바꾼다. `testAccount` 블록 위치는 그대로다.
- [ ] **Step 6: 확인.** `bun run build`를 돌리고, 6개 슬러그를 전부 열어 아래를 확인한다.
  - 제목이 줄 단위로 리빌된다.
  - oneLiner 줄바꿈이 유지된다.
  - stack 텍스트가 기존과 같다(`·` 구분).
  - 썸네일이 scale 1.15→1로 리빌되고 패럴랙스가 동작한다.

### Task 6.2: Stats 카운트업

**Files:** Modify `src/pages/Work.tsx` (`Stats`, useGSAP)

- [ ] **Step 1: 값 요소를 표시한다.** JS가 없거나 reduced-motion이면 최종값이 그대로 보인다.

```tsx
<Display data-stat-value={stat.value} className="text-[clamp(28px,4vw,40px)] tabular-nums">
  {stat.value}
</Display>
```

- [ ] **Step 2: 카운트업을 넣는다.** 메인 useGSAP의 motion 블록 안에 아래를 추가한다. 숫자만 카운트업하고, 숫자가 아니면 리빌만 한다.

```ts
gsap.utils.toArray<HTMLElement>('[data-stat]').forEach((stat, index) => {
  const valueEl = stat.querySelector<HTMLElement>('[data-stat-value]')
  const raw = valueEl?.dataset.statValue ?? ''
  gsap.from(stat, {
    y: 24,
    opacity: 0,
    duration: 0.7,
    delay: index * 0.1,
    ease: 'power3.out',
    scrollTrigger: { trigger: stat, start: 'top 88%', once: true },
  })
  if (!valueEl || !/^\d+$/.test(raw)) return
  const counter = { value: 0 }
  valueEl.textContent = '0'
  gsap.to(counter, {
    value: Number(raw),
    duration: 1.4,
    ease: 'power3.out',
    scrollTrigger: { trigger: stat, start: 'top 88%', once: true },
    onUpdate: () => {
      valueEl.textContent = String(Math.round(counter.value))
    },
  })
})
```

  mm revert 시 textContent가 되돌아가지 않으므로, cleanup에 `valueEl.textContent = raw` 복원을 넣는다.

- [ ] **Step 3: 확인.** `/work/tcc`에서 90, 50, 0이 카운트업되는지 확인한다. 0은 0에 머문다. 최종값은 원문과 같아야 한다.

### Task 6.3: Decisions — sticky title, 단계 하이라이트, shot 리빌, 라이트박스

**Files:** Modify `src/pages/Work.tsx` (`Decisions`, `DecisionShots`, `ShotCard`, `Work` state)

- [ ] **Step 1: 라벨 상수를 둔다.** 문구는 기존과 같다.

```ts
const DECISION_STEPS = [
  { key: 'problem', label: '문제' },
  { key: 'choice', label: '선택' },
  { key: 'result', label: '결과' },
] as const
```

- [ ] **Step 2: Decision 마크업을 바꾼다.** 왼쪽 title은 sticky, 오른쪽은 문제·선택·결과, shot은 아래 전체 폭에 둔다.

```tsx
<Hairline as="section" key={item.title} className={cn('grid gap-8 py-10', index === 0 && suppressTopRule && 'border-t-0')}>
  <div className="grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-12">
    <h2 className="font-kr text-[18px] font-bold tracking-[-0.02em] lg:sticky lg:top-[calc(var(--nav-h)+32px)] lg:self-start lg:text-[clamp(20px,2vw,26px)]">
      {item.title}
    </h2>
    <div className="grid gap-8">
      {DECISION_STEPS.map((step) => (
        <div key={step.key} data-step>
          <Label className="text-muted">{step.label}</Label>
          <p className={cn('mt-2 text-[15px] leading-[1.75]', step.key === 'result' && 'font-bold')}>
            {item[step.key]}
          </p>
        </div>
      ))}
    </div>
  </div>
  {item.shots?.length ? <DecisionShots shots={item.shots} onOpenShot={onOpenShot} /> : null}
</Hairline>
```

- [ ] **Step 3: ShotCard를 버튼으로 만든다.** 라이트박스를 열 수 있도록 바꾸고, lazy 로딩을 적용한다.

```tsx
type ShotCardProps = {
  shot: WorkShot
  onOpen: (shot: WorkShot, origin: HTMLImageElement) => void
}

function ShotCard({ shot, onOpen }: ShotCardProps) {
  const imageRef = useRef<HTMLImageElement>(null)

  const handleClick = () => {
    if (imageRef.current) onOpen(shot, imageRef.current)
  }

  return (
    <figure data-shot={shot.wide ? 'wide' : 'normal'} className="overflow-hidden rounded-2xl border border-hairline bg-white">
      <button type="button" data-cursor="view" aria-label={`${shot.alt} 크게 보기`} className="block w-full" onClick={handleClick}>
        <img
          ref={imageRef}
          src={shot.src}
          alt={shot.alt}
          loading="lazy"
          decoding="async"
          className={cn('w-full object-contain object-top', shot.wide ? 'max-h-[420px]' : 'aspect-[4/3]')}
        />
      </button>
      <figcaption className="px-4 py-3 text-[13px] leading-[1.6] text-ink-2">{shot.caption}</figcaption>
    </figure>
  )
}
```

- [ ] **Step 4: Work에 라이트박스 상태를 둔다.** `Decisions`에 `onOpenShot` prop을 내려준다.

```tsx
const [lightbox, setLightbox] = useState<{ shot: WorkShot; origin: HTMLImageElement } | null>(null)

const handleOpenShot = (shot: WorkShot, origin: HTMLImageElement) => {
  setLightbox({ shot, origin })
}

const handleCloseShot = () => {
  setLightbox(null)
}
```

```tsx
{lightbox ? (
  <FlipLightbox
    src={lightbox.shot.src}
    alt={lightbox.shot.alt}
    caption={lightbox.shot.caption}
    origin={lightbox.origin}
    onClose={handleCloseShot}
  />
) : null}
```

  `useEffect`로 slug가 바뀌면 `setLightbox(null)`.

- [ ] **Step 5: 하이라이트와 shot 리빌을 넣는다.** 메인 useGSAP의 motion 블록에 아래를 추가하고, 기존 shot의 `data-rv`는 제거한다.

```ts
gsap.utils.toArray<HTMLElement>('[data-step]').forEach((step) => {
  gsap.fromTo(
    step,
    { opacity: 0.22 },
    { opacity: 1, ease: 'none', scrollTrigger: { trigger: step, start: 'top 78%', end: 'top 48%', scrub: true } },
  )
})

gsap.utils.toArray<HTMLElement>('[data-shot="wide"]').forEach((shot) => {
  gsap.fromTo(
    shot,
    { clipPath: 'inset(0 14% 0 14% round 16px)' },
    {
      clipPath: 'inset(0 0% 0 0% round 16px)',
      ease: 'none',
      scrollTrigger: { trigger: shot, start: 'top 92%', end: 'top 50%', scrub: true },
    },
  )
})

if (desktop) {
  gsap.utils.toArray<HTMLElement>('[data-shot="normal"]').forEach((shot, index) => {
    const offset = index % 2 === 0 ? 28 : -28
    gsap.fromTo(
      shot,
      { y: offset },
      { y: -offset, ease: 'none', scrollTrigger: { trigger: shot, start: 'top bottom', end: 'bottom top', scrub: true } },
    )
  })
}
```

  `desktop` 플래그는 `matchMediaPreset(({ motion, desktop }) => …)`에서 받는다.

- [ ] **Step 6: 확인.** `bun run build`를 돌린다. 6개 슬러그에서 아래를 확인한다.
  - title이 sticky로 고정된다.
  - 문제·선택·결과가 차례로 밝아진다.
  - wide shot이 clip으로 펼쳐진다.
  - 일반 shot이 2열 패럴랙스로 움직인다(`sites` 2번째 decision, `useme`).
  - shot을 클릭하면 Flip 라이트박스가 열리고, ESC와 포커스 트랩이 동작한다.
  - useme 두 번째 decision(shots 없음)이 정상 렌더된다.

### Task 6.4: Entries — 수평 리스트와 커서 프리뷰

**Files:** Modify `src/pages/Work.tsx` (`Entries` → `EntriesList` 이름 변경 + `EntriesRail` 추가 + 분기)

- [ ] **Step 1: 분기를 만든다.** 기존 `Entries`를 `EntriesList`로 이름만 바꾼다(모바일·reduced-motion용, 마크업 그대로). 분기 컴포넌트를 추가한다.

```tsx
function Entries({ entries }: { entries: WorkEntry[] }) {
  const isDesktop = useMediaQuery(MEDIA.desktop)
  const isReduced = useMediaQuery(MEDIA.reduce)

  return isDesktop && !isReduced ? <EntriesRail entries={entries} /> : <EntriesList entries={entries} />
}
```

- [ ] **Step 2: `EntriesRail`을 만든다.**
  - 섹션을 pin하고 트랙을 x로 이동한다.
  - 카드 hover나 focus로 active가 바뀌고, 이미지가 있으면 커서를 따라오는 프리뷰를 띄운다. 프리뷰는 body 포털이다(pin 컨테이너의 transform 영향 회피).
  - alleo처럼 이미지가 없으면 프리뷰 없이 텍스트만 쓴다.

```tsx
function EntriesRail({ entries }: { entries: WorkEntry[] }) {
  const [active, setActive] = useState(0)

  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLUListElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)

  const { contextSafe } = useGSAP(
    () => {
      const track = trackRef.current
      if (!track) return
      gsap.set(previewRef.current, { autoAlpha: 0, scale: 0.9, xPercent: -50, yPercent: -50 })
      const getDistance = () => Math.max(0, track.scrollWidth - window.innerWidth)
      gsap.to(track, {
        x: () => -getDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${getDistance()}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      })
    },
    { scope: sectionRef },
  )

  const handlePointerMove = contextSafe((event: PointerEvent<HTMLElement>) => {
    gsap.to(previewRef.current, { x: event.clientX, y: event.clientY, duration: 0.5, ease: 'power3.out', overwrite: 'auto' })
  })

  const handleEnter = contextSafe((index: number) => {
    setActive(index)
    const hasImage = Boolean(entries[index]?.image)
    gsap.to(previewRef.current, { autoAlpha: hasImage ? 1 : 0, scale: hasImage ? 1 : 0.9, duration: 0.4, ease: 'expo.out' })
  })

  const handleLeave = contextSafe(() => {
    gsap.to(previewRef.current, { autoAlpha: 0, scale: 0.9, duration: 0.3, ease: 'power2.out' })
  })

  const current = entries[active] ?? entries[0]

  return (
    <section
      ref={sectionRef}
      className="relative left-1/2 flex h-svh w-screen max-w-[100vw] -translate-x-1/2 flex-col overflow-hidden bg-dark-ground py-10 text-dark-ink [--hairline:var(--hairline-on-dark)]"
      onPointerMove={handlePointerMove}
    >
      <div className="flex shrink-0 items-center justify-between gap-4 px-[var(--pad)]">
        <Label className="text-dark-ink/55">구성</Label>
        <Label className="tabular-nums text-dark-ink/55">
          {String(active + 1).padStart(2, '0')} / {String(entries.length).padStart(2, '0')}
        </Label>
      </div>
      <ul ref={trackRef} className="mt-auto mb-auto flex w-max list-none gap-[clamp(16px,2vw,28px)] px-[var(--pad)]">
        {entries.map((entry, index) => (
          <EntryRailCard key={entry.name} entry={entry} index={index} onEnter={handleEnter} onLeave={handleLeave} />
        ))}
      </ul>
      {createPortal(
        <div ref={previewRef} className="pointer-events-none fixed top-0 left-0 z-[30] w-[clamp(220px,22vw,320px)] overflow-hidden rounded-xl border border-hairline-on-dark" aria-hidden>
          {current?.image ? (
            <img src={current.image.src} alt="" className="aspect-[16/10] w-full object-cover object-top" decoding="async" />
          ) : null}
        </div>,
        document.body,
      )}
    </section>
  )
}

type EntryRailCardProps = {
  entry: WorkEntry
  index: number
  onEnter: (index: number) => void
  onLeave: () => void
}

function EntryRailCard({ entry, index, onEnter, onLeave }: EntryRailCardProps) {
  const handleEnter = () => onEnter(index)

  return (
    <li
      className="flex w-[clamp(260px,26vw,360px)] shrink-0 flex-col gap-3 border-t border-hairline pt-5"
      onMouseEnter={handleEnter}
      onMouseLeave={onLeave}
      onFocus={handleEnter}
    >
      <span className="font-display text-[12px] tabular-nums text-dark-ink/45">{String(index + 1).padStart(2, '0')}</span>
      <Display className="text-[clamp(26px,2.4vw,40px)] leading-none">{entry.name}</Display>
      <p className="text-[14px] leading-[1.6] font-medium text-dark-ink/80">{entry.note}</p>
      {entry.url ? (
        <a
          href={entry.url}
          target="_blank"
          {...outboundLinkProps(entry.url)}
          className="mt-1 inline-block font-ui text-[11px] font-medium tracking-[0.12em] text-dark-ink/55 uppercase transition-colors duration-500 hover:text-neon"
        >
          열기 ↗
        </a>
      ) : null}
    </li>
  )
}
```

  `PointerEvent`는 React 타입이다. `import { type PointerEvent } from 'react'`로 가져온다.

- [ ] **Step 3: 확인.** 아래를 확인한다.
  - `/work/sites`에서 9종이 가로로 지나간다.
  - hover하면 OG 이미지가 커서를 따라온다.
  - `열기 ↗`를 Tab으로 이동하면 카운터가 바뀐다.
  - `/work/alleo`의 4종은 텍스트만 나온다.
  - 390px에서는 기존 리스트 + 프리뷰 레이아웃이다.

### Task 6.5: 이전/다음 매그네틱 카드

**Files:** Modify `src/pages/Work.tsx` (`PagerCard`)

- [ ] **Step 1: 매그네틱과 전환을 단다.** Link에 `useMagneticFollow(0.06, 0.12)`를 걸고 `useTransitionLink`로 전환한다. 텍스트 내용은 동일하다.

```tsx
function PagerCard({ work, index, direction }: PagerCardProps) {
  const { zoneRef, targetRef, innerRef } = useMagneticFollow(0.06, 0.12)
  const handleClick = useTransitionLink(`/work/${work.slug}`, work.label)

  const isNext = direction === 'next'

  return (
    <div ref={zoneRef} className={isNext ? 'border-l border-hairline max-md:border-t max-md:border-l-0' : ''}>
      <Link
        ref={targetRef as never}
        data-cursor="open"
        aria-label={`${isNext ? '다음' : '이전'} 케이스 ${work.title}`}
        className={…기존 클래스에서 border 관련만 제거…}
        to={`/work/${work.slug}`}
        onClick={handleClick}
      >
        <span ref={innerRef} className="flex flex-col …정렬 클래스 기존과 동일…">
          {/* 기존 Label NEXT/PREV · 0n, Display label, title, period, OPEN CASE */}
        </span>
      </Link>
    </div>
  )
}
```

  `ref={targetRef as never}`는 기존 Pill/MagneticButton과 같은 패턴이다. 실행할 때 `useMagneticFollow`의 `targetRef` 타입을 `HTMLElement`로 두고 `RefObject<HTMLAnchorElement>`와 호환되지 않으면, 훅에 제네릭 `<T extends HTMLElement>`를 추가해서 캐스트를 없앤다.

- [ ] **Step 2: 확인과 보고.**
  - `bun run build`와 `bun scripts/check-content.ts`를 돌린다.
  - 6개 슬러그 × (PREV, NEXT) 이동이 커튼으로 동작하는지 확인한다.
  - 없는 슬러그(`/work/nope`)는 홈으로 replace된다.
  - Stage 6를 보고하고 멈춘다.

---

## Stage 7 — 3D (R3F 단일 Canvas + View)

### Task 7.1: 설치와 씬 인프라

**Files:**
- Create: `src/lib/can3D.ts`, `src/lib/useInView.ts`, `src/scene/types.ts`, `src/scene/palette.ts`, `src/scene/SceneRoot.tsx`, `src/scene/SceneCanvas.tsx`, `src/scene/SlotView.tsx`, `src/scene/SceneSlot.tsx`, `src/scene/Stage.tsx`, `src/scene/GlossyMaterial.tsx`, `src/scene/useTilt.ts`
- Modify: `src/app/RootLayout.tsx`, `package.json`, `bun.lock`

- [ ] **Step 1: 패키지를 설치한다.**

```bash
bun add three @react-three/fiber @react-three/drei
bun add -d @types/three
```

  `package.json`에 4개가 추가되고 `bun.lock`만 갱신돼야 한다. 다른 lockfile이 생기면 삭제한다.

- [ ] **Step 2: `can3D.ts`를 만든다.**

```ts
import { MEDIA } from './media'

let webglSupport: boolean | null = null

const supportsWebGL = (): boolean => {
  if (webglSupport !== null) return webglSupport
  try {
    const canvas = document.createElement('canvas')
    webglSupport = Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'))
  } catch {
    webglSupport = false
  }
  return webglSupport
}

/** 데스크톱·fine pointer·motion 허용·WebGL 지원일 때만 true. 아니면 WebP 폴백 */
export const canRender3D = (): boolean =>
  typeof window !== 'undefined' &&
  window.matchMedia(MEDIA.motion).matches &&
  window.matchMedia(MEDIA.desktop).matches &&
  !window.matchMedia(MEDIA.coarsePointer).matches &&
  supportsWebGL()
```

- [ ] **Step 3: `useInView.ts`를 만든다.**

```ts
import { useEffect, useState, type RefObject } from 'react'

export const useInView = (ref: RefObject<Element | null>, rootMargin = '25% 0px'): boolean => {
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new IntersectionObserver(
      (entries) => setInView(entries.some((entry) => entry.isIntersecting)),
      { rootMargin },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [ref, rootMargin])

  return inView
}
```

- [ ] **Step 4: `types.ts`를 만든다.** three를 import하지 않는다.

```ts
import type { WorkItem } from '../content/works'

export type HoverState = { value: number }

export type SceneObject =
  | { kind: 'hero' }
  | { kind: 'memo' }
  | { kind: 'cursor' }
  | { kind: 'contact' }
  | { kind: 'case'; slug: WorkItem['slug'] }
  | {
      kind: 'distort'
      src: string
      fit: 'cover' | 'contain'
      hover: HoverState
      onReady: () => void
    }

export type DecorObject = Exclude<SceneObject, { kind: 'distort' }>
```

- [ ] **Step 5: `palette.ts`를 만든다.** 색은 CSS 토큰에서 읽는다. 새 hex는 없다.

```ts
import type { WorkItem } from '../content/works'

export type Tone = 'ink' | 'ground' | 'mid' | 'neon'

const TOKEN: Record<Tone, string> = {
  ink: '--dark-ink',
  ground: '--dark-ground',
  mid: '--ink-2',
  neon: '--neon',
}

export const toneColor = (tone: Tone): string =>
  getComputedStyle(document.documentElement).getPropertyValue(TOKEN[tone]).trim()

export const tokenColor = (token: string): string =>
  getComputedStyle(document.documentElement).getPropertyValue(token).trim()

export const CASE_TONES: Record<WorkItem['slug'], { base: Tone; accent: Tone }> = {
  tcc: { base: 'ground', accent: 'neon' },
  sites: { base: 'ink', accent: 'neon' },
  alleo: { base: 'neon', accent: 'ground' },
  money: { base: 'ink', accent: 'ground' },
  useme: { base: 'neon', accent: 'ink' },
  isle: { base: 'mid', accent: 'neon' },
}
```

- [ ] **Step 6: `SceneRoot.tsx`를 만든다.** main 번들에 들어간다.
  - 슬롯이 하나라도 등록되고, 첫 렌더 후 1.2초가 지나면 Canvas 청크를 불러온다(LCP 보호).
  - 한 번 올라온 Canvas는 라우트가 바뀌어도 유지한다(WebGL 컨텍스트 재생성 방지).

```tsx
import { lazy, Suspense, useEffect, useState, useSyncExternalStore } from 'react'
import { canRender3D } from '../lib/can3D'
import { getSceneSlotCount, subscribeSceneSlots } from '../lib/sceneBus'

const SceneCanvas = lazy(() => import('./SceneCanvas'))

export default function SceneRoot() {
  const [idle, setIdle] = useState(false)
  const [armed, setArmed] = useState(false)

  const slotCount = useSyncExternalStore(subscribeSceneSlots, getSceneSlotCount, () => 0)

  useEffect(() => {
    if (!canRender3D()) return
    const timer = window.setTimeout(() => setIdle(true), 1200)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (idle && slotCount > 0) setArmed(true)
  }, [idle, slotCount])

  if (!armed) return null

  return (
    <Suspense fallback={null}>
      <SceneCanvas />
    </Suspense>
  )
}
```

- [ ] **Step 7: `SceneCanvas.tsx`를 만든다(lazy).**
  - 고정 풀스크린이고 포인터는 통과시킨다.
  - `frameloop="demand"`이고 `dpr` 상한은 1.5다.
  - Lenis 스크롤과 포인터 이동이 있을 때만 invalidate한다.

```tsx
import { useEffect } from 'react'
import { Canvas, type RootState } from '@react-three/fiber'
import { View } from '@react-three/drei'
import { invalidateScene, setSceneInvalidator } from '../lib/sceneBus'
import { onScroll } from '../lib/useLenis'

export default function SceneCanvas() {
  const handleCreated = (state: RootState) => {
    setSceneInvalidator(state.invalidate)
  }

  useEffect(() => {
    const offScroll = onScroll(() => invalidateScene())
    const handleResize = () => invalidateScene()
    window.addEventListener('resize', handleResize)
    return () => {
      offScroll()
      window.removeEventListener('resize', handleResize)
      setSceneInvalidator(null)
    }
  }, [])

  return (
    <Canvas
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 15 }}
      eventSource={document.getElementById('root') ?? undefined}
      eventPrefix="client"
      dpr={[1, 1.5]}
      frameloop="demand"
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onCreated={handleCreated}
    >
      <View.Port />
    </Canvas>
  )
}
```

  z-index 15는 섹션 위, Nav(20)·커서(50)·라이트박스(80)·커튼(90)·프리로더(100) 아래다.

- [ ] **Step 8: `SlotView.tsx`를 만든다(lazy).** DOM 슬롯 안에 View를 렌더하고, 내용은 Canvas의 `View.Port`로 터널링된다.

```tsx
import { Suspense } from 'react'
import { View } from '@react-three/drei'
import type { SceneObject } from './types'
import Stage from './Stage'
import HeroObjects from './objects/HeroObjects'
import WorkflowObject from './objects/WorkflowObject'
import ContactObjects from './objects/ContactObjects'
import CaseObject from './objects/CaseObject'
import DistortPlane from './objects/DistortPlane'

type SlotViewProps = {
  object: SceneObject
}

export default function SlotView({ object }: SlotViewProps) {
  return (
    <View className="absolute inset-0">
      <Suspense fallback={null}>
        {object.kind === 'distort' ? (
          <DistortPlane src={object.src} fit={object.fit} hover={object.hover} onReady={object.onReady} />
        ) : (
          <Stage>
            <DecorMesh object={object} />
          </Stage>
        )}
      </Suspense>
    </View>
  )
}

function DecorMesh({ object }: { object: Exclude<SceneObject, { kind: 'distort' }> }) {
  if (object.kind === 'hero') return <HeroObjects />
  if (object.kind === 'memo') return <WorkflowObject variant="memo" />
  if (object.kind === 'cursor') return <WorkflowObject variant="cursor" />
  if (object.kind === 'contact') return <ContactObjects />
  return <CaseObject slug={object.slug} />
}
```

- [ ] **Step 9: `SceneSlot.tsx`를 만든다(main).**
  - 3D가 가능하면 화면 안에 들어왔을 때만 View를 마운트한다.
  - 3D가 불가능하면 WebP 폴백을 보여 주고, 파일이 없으면 숨긴다.

```tsx
import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { canRender3D } from '../lib/can3D'
import { cn } from '../lib/cn'
import { registerSceneSlot } from '../lib/sceneBus'
import { useInView } from '../lib/useInView'
import type { DecorObject } from './types'

const SlotView = lazy(() => import('./SlotView'))

type SceneSlotProps = {
  object: DecorObject
  fallbackSrc: string
  className?: string
}

export default function SceneSlot({ object, fallbackSrc, className }: SceneSlotProps) {
  const [enabled] = useState(canRender3D)
  const [fallbackMissing, setFallbackMissing] = useState(false)

  const slotRef = useRef<HTMLDivElement>(null)

  const inView = useInView(slotRef)

  const handleFallbackError = () => setFallbackMissing(true)

  useEffect(() => {
    if (!enabled) return
    return registerSceneSlot()
  }, [enabled])

  return (
    <div ref={slotRef} className={cn('pointer-events-none relative', className)} aria-hidden>
      {enabled ? (
        inView ? (
          <Suspense fallback={null}>
            <SlotView object={object} />
          </Suspense>
        ) : null
      ) : fallbackMissing ? null : (
        <img
          src={fallbackSrc}
          alt=""
          loading="lazy"
          decoding="async"
          className="size-full object-contain"
          onError={handleFallbackError}
        />
      )}
    </div>
  )
}
```

- [ ] **Step 10: `Stage.tsx`, `GlossyMaterial.tsx`, `useTilt.ts`를 만든다(lazy).**
  - Stage: 카메라, 조명, 소프트 그림자. 외부 HDR 없이 Lightformer 환경광을 쓴다.

```tsx
import type { ReactNode } from 'react'
import { ContactShadows, Environment, Lightformer, PerspectiveCamera } from '@react-three/drei'

export default function Stage({ children }: { children: ReactNode }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={30} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 5, 4]} intensity={1.4} />
      <Environment resolution={128}>
        <Lightformer form="rect" intensity={2} position={[0, 3, 2]} scale={[6, 2, 1]} />
        <Lightformer form="ring" intensity={1.2} position={[-3, 0, 2]} scale={2} />
        <Lightformer form="rect" intensity={0.8} position={[3, -1, 1]} scale={[2, 4, 1]} />
      </Environment>
      {children}
      <ContactShadows position={[0, -1.25, 0]} opacity={0.32} blur={2.6} scale={6} far={2.4} resolution={256} />
    </>
  )
}
```

  - GlossyMaterial: 클리어코트 광택 재질이고 roughness는 0.28이다.

```tsx
import { useMemo } from 'react'
import { toneColor, type Tone } from './palette'

export default function GlossyMaterial({ tone }: { tone: Tone }) {
  const color = useMemo(() => toneColor(tone), [tone])

  return (
    <meshPhysicalMaterial
      color={color}
      roughness={0.28}
      metalness={0.08}
      clearcoat={1}
      clearcoatRoughness={0.12}
    />
  )
}
```

  - useTilt: 마우스에 따른 기울기를 lerp하고, 수렴할 때까지만 invalidate한다.

```ts
import type { RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { MathUtils, type Group } from 'three'
import { getPointer } from '../lib/usePointer'

export const useTilt = (ref: RefObject<Group | null>, amount = 0.35): void => {
  useFrame((state) => {
    const group = ref.current
    if (!group) return
    const { x, y } = getPointer()
    const targetX = y * amount
    const targetY = x * amount
    group.rotation.x = MathUtils.lerp(group.rotation.x, targetX, 0.08)
    group.rotation.y = MathUtils.lerp(group.rotation.y, targetY, 0.08)
    if (Math.abs(group.rotation.x - targetX) > 0.0005 || Math.abs(group.rotation.y - targetY) > 0.0005) {
      state.invalidate()
    }
  })
}
```

- [ ] **Step 11: RootLayout에 넣는다.** `<Outlet />` 다음에 `<SceneRoot />`를 둔다. 최종 RootLayout은 아래와 같다.

```tsx
export default function RootLayout() {
  useLenis()
  usePointer()

  return (
    <PageTransition>
      <NeonCursorRing />
      <Preloader />
      <Outlet />
      <SceneRoot />
    </PageTransition>
  )
}
```

- [ ] **Step 12: 빌드와 청크 확인.** `bun run build`를 돌린다. 아래를 확인한다.
  - three, R3F, drei가 **별도 청크**로 나온다.
  - main 청크가 Stage 6 대비 크게 늘지 않았다(+10KB 이내).

### Task 7.2: 포인트 오브젝트 (primitive placeholder)

**Files:**
- Create: `src/scene/objects/HeroObjects.tsx`, `WorkflowObject.tsx`, `ContactObjects.tsx`, `CaseObject.tsx`
- Modify: `src/sections/Hero.tsx`, `Method.tsx`, `Pilot.tsx`, `Close.tsx`, `src/pages/Work.tsx`

공통 패턴은 다음과 같다.
- 바깥 group은 GSAP 스크롤 회전·이동을 맡는다. ScrollTrigger의 `onUpdate`에서 `invalidate`를 부른다.
- 안쪽 group은 `useTilt`를 맡는다.
- 재질은 전부 `GlossyMaterial`이다.
- 오브젝트에 텍스트나 사실 정보는 넣지 않는다.

- [ ] **Step 1: `HeroObjects.tsx`를 만든다.** RoundedBox(ink)와 Torus(neon)로 구성한다. Hero pin 타임라인과 같은 구간에서 등장하고 회전·이동한다.

```tsx
import { useRef } from 'react'
import { useThree } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import type { Group } from 'three'
import { gsap, useGSAP } from '../../lib/gsapSetup'
import { HERO_PIN } from '../../lib/hero'
import GlossyMaterial from '../GlossyMaterial'
import { useTilt } from '../useTilt'

export default function HeroObjects() {
  const scrollRef = useRef<Group>(null)
  const tiltRef = useRef<Group>(null)

  const invalidate = useThree((state) => state.invalidate)
  useTilt(tiltRef)

  useGSAP(() => {
    const group = scrollRef.current
    if (!group) return
    group.scale.setScalar(0)
    gsap
      .timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: '#about', start: 'top top', end: HERO_PIN.desktop, scrub: 0.4, onUpdate: invalidate },
      })
      .to(group.scale, { x: 1, y: 1, z: 1, duration: 0.12, ease: 'back.out(1.6)' }, 0.8)
      .to(group.rotation, { y: Math.PI * 0.9, duration: 0.32 }, 0.8)
      .to(group.position, { y: 0.35, duration: 0.32 }, 0.8)
      .to({}, { duration: 0.1 }, 1.02)
  })

  return (
    <group ref={scrollRef}>
      <group ref={tiltRef}>
        <RoundedBox args={[1.3, 1.3, 1.3]} radius={0.28} smoothness={6} position={[-0.35, 0.1, 0]} rotation={[0.4, 0.6, 0]}>
          <GlossyMaterial tone="ink" />
        </RoundedBox>
        <mesh position={[0.75, -0.45, 0.4]} rotation={[1.1, 0.2, 0]}>
          <torusGeometry args={[0.42, 0.18, 32, 64]} />
          <GlossyMaterial tone="neon" />
        </mesh>
      </group>
    </group>
  )
}
```

- [ ] **Step 2: `WorkflowObject.tsx`를 만든다.** variant는 `'memo' | 'cursor'`다.
  - memo: 얇은 RoundedBox(ink) 메모지, 네온 테이프 RoundedBox, 육각 cylinder와 cone으로 만든 연필(ground/neon).
  - cursor: `Shape`를 Extrude한 화살표(ground, bevel 둥글게)와 작은 Sphere(neon).
  - 스크롤 회전: trigger는 memo면 `'#roster'`, cursor면 `'#pilot'`이다. `start 'top bottom'`, `end 'bottom top'`, `rotation.z` -0.3→0.3, scrub.

```ts
const CURSOR_SHAPE = (() => {
  const shape = new Shape()
  shape.moveTo(0, 0)
  shape.lineTo(0, -1.2)
  shape.lineTo(0.32, -0.9)
  shape.lineTo(0.55, -1.4)
  shape.lineTo(0.72, -1.32)
  shape.lineTo(0.5, -0.84)
  shape.lineTo(0.92, -0.84)
  shape.closePath()
  return shape
})()
```

```tsx
<Extrude
  args={[CURSOR_SHAPE, { depth: 0.18, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.05, bevelSegments: 6 }]}
  position={[-0.45, 0.7, 0]}
>
  <GlossyMaterial tone="ground" />
</Extrude>
```

- [ ] **Step 3: `ContactObjects.tsx`를 만든다.** Sphere(neon), RoundedBox(ink), Torus(mid) 3개가 마운트(=화면 진입) 시 위에서 `bounce.out`으로 떨어진다. 다 떨어지면 바깥 group이 `sin(t)`로 떠다니고, 이 동안은 화면 안에 있을 때만 계속 invalidate한다.

```ts
const REST = [
  { x: -1.4, y: -0.55, z: 0 },
  { x: 0, y: -0.5, z: 0.3 },
  { x: 1.35, y: -0.6, z: -0.2 },
]
```

```ts
useGSAP(() => {
  meshRefs.current.forEach((mesh, index) => {
    if (!mesh) return
    gsap.fromTo(
      mesh.position,
      { y: 3.2 + index * 0.6 },
      {
        y: REST[index].y,
        duration: 1.3,
        delay: index * 0.12,
        ease: 'bounce.out',
        onUpdate: invalidate,
        onComplete: () => {
          if (index === REST.length - 1) settledRef.current = true
        },
      },
    )
    gsap.from(mesh.rotation, { x: -2, z: 1.2, duration: 1.3, delay: index * 0.12, ease: 'power3.out' })
  })
})
```

```ts
useFrame((state) => {
  const float = floatRef.current
  if (!float || !settledRef.current) return
  float.position.y = Math.sin(state.clock.elapsedTime * 1.2) * 0.06
  state.invalidate()
})
```

- [ ] **Step 4: `CaseObject.tsx`를 만든다.** RoundedBox(`CASE_TONES[slug].base`)와 Torus(`accent`)로 구성한다. 스크롤 회전은 trigger `'[data-work-hero]'`, `start 'top top'`, `end 'bottom top'`, `rotation.y` 0→π다. 틸트도 적용한다.
- [ ] **Step 5: 섹션의 빈 래퍼를 SceneSlot으로 바꾼다.** className은 기존 래퍼 값을 그대로 쓴다.

| 위치 | object | fallbackSrc |
|---|---|---|
| Hero `data-hero-object` | `{ kind: 'hero' }` | `/images/3d/hero.webp` |
| Method `data-roster-object` | `{ kind: 'memo' }` | `/images/3d/workflow-memo.webp` |
| Pilot `data-pilot-object` | `{ kind: 'cursor' }` | `/images/3d/workflow-cursor.webp` |
| Close `data-contact-object` | `{ kind: 'contact' }` | `/images/3d/contact.webp` |
| Work `data-case-object` | `{ kind: 'case', slug: work.slug }` | `` `/images/3d/case-${work.slug}.webp` `` |

  Work에서는 `key={work.slug}`를 줘서 슬러그가 바뀔 때 재마운트되게 한다.

- [ ] **Step 6: 확인.** `bun run build`를 돌리고 데스크톱에서 아래를 확인한다.
  - Hero 랜딩에서 오브젝트가 등장하고, 마우스를 따라 기울며, 스크롤에 따라 회전하고, 역스크롤하면 사라진다.
  - Method와 Pilot 모서리 오브젝트가 보인다.
  - Contact 진입 시 오브젝트가 낙하하고 떠다닌다.
  - 상세 오브젝트 색이 슬러그별로 다르다.
  - Performance 패널에서 스크롤·마우스를 멈추면 GPU 프레임이 멈춘다.
  - 390px와 reduced-motion에서는 Canvas 청크가 로드되지 않는다(Network 패널). 폴백 WebP가 없으면 빈 자리이고 깨진 아이콘은 없다.

### Task 7.3: Projects 이미지 WebGL 왜곡 (사이트 전체에서 이 한 곳만)

**Files:**
- Create: `src/scene/shaders/distort.ts`, `src/scene/objects/DistortPlane.tsx`, `src/scene/DistortImageSlot.tsx`
- Modify: `src/sections/gallery/GalleryRail.tsx`

- [ ] **Step 1: `distort.ts`에 셰이더를 작성한다.**

```ts
export const DISTORT_VERTEX = /* glsl */ `
  uniform float uVelocity;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 p = position;
    p.y += sin(uv.x * 3.14159) * uVelocity * 18.0;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`

export const DISTORT_FRAGMENT = /* glsl */ `
  uniform sampler2D uTex;
  uniform vec2 uPlane;
  uniform vec2 uImage;
  uniform float uFit;
  uniform vec3 uBg;
  uniform float uHover;
  uniform float uVelocity;
  uniform float uTime;
  varying vec2 vUv;

  vec2 fitUv(vec2 uv) {
    float planeAspect = uPlane.x / uPlane.y;
    float imageAspect = uImage.x / uImage.y;
    vec2 scale = uFit < 0.5
      ? (planeAspect > imageAspect ? vec2(1.0, imageAspect / planeAspect) : vec2(planeAspect / imageAspect, 1.0))
      : (planeAspect > imageAspect ? vec2(planeAspect / imageAspect, 1.0) : vec2(1.0, imageAspect / planeAspect));
    return (uv - 0.5) * scale + 0.5;
  }

  void main() {
    vec2 uv = vUv;
    float amp = 0.012 * uHover + 0.02 * abs(uVelocity);
    uv.x += sin(uv.y * 12.0 + uTime * 2.0) * amp;
    uv.y += cos(uv.x * 10.0 + uTime * 1.6) * amp * 0.6;
    vec2 tuv = fitUv(uv);
    bool outside = any(lessThan(tuv, vec2(0.0))) || any(greaterThan(tuv, vec2(1.0)));
    gl_FragColor = outside ? vec4(uBg, 1.0) : texture2D(uTex, tuv);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`
```

- [ ] **Step 2: `DistortPlane.tsx`를 만든다.**
  - 직교 카메라 zoom 1을 쓰므로 1 unit이 1px이고, plane이 View 크기와 같다.
  - hover나 속도가 있을 때만 시간을 흘리고 invalidate한다.

```tsx
import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrthographicCamera, useTexture } from '@react-three/drei'
import { Color, MathUtils, SRGBColorSpace, Vector2 } from 'three'
import { getScrollVelocity } from '../../lib/useLenis'
import { tokenColor } from '../palette'
import { DISTORT_FRAGMENT, DISTORT_VERTEX } from '../shaders/distort'
import type { HoverState } from '../types'

type DistortPlaneProps = {
  src: string
  fit: 'cover' | 'contain'
  hover: HoverState
  onReady: () => void
}

const imageSize = (image: unknown): Vector2 => {
  if (image instanceof HTMLImageElement) return new Vector2(image.naturalWidth || 1, image.naturalHeight || 1)
  if (image instanceof ImageBitmap) return new Vector2(image.width || 1, image.height || 1)
  return new Vector2(1, 1)
}

export default function DistortPlane({ src, fit, hover, onReady }: DistortPlaneProps) {
  const velocityRef = useRef(0)

  const texture = useTexture(src)
  const size = useThree((state) => state.size)

  const uniforms = useMemo(() => {
    texture.colorSpace = SRGBColorSpace
    return {
      uTex: { value: texture },
      uPlane: { value: new Vector2(1, 1) },
      uImage: { value: imageSize(texture.image) },
      uFit: { value: fit === 'contain' ? 1 : 0 },
      uBg: { value: new Color(tokenColor('--card-ground')) },
      uHover: { value: 0 },
      uVelocity: { value: 0 },
      uTime: { value: 0 },
    }
  }, [texture, fit])

  useFrame((state, delta) => {
    const target = MathUtils.clamp(getScrollVelocity() / 40, -1, 1)
    velocityRef.current = MathUtils.lerp(velocityRef.current, target, 0.12)
    uniforms.uVelocity.value = velocityRef.current
    uniforms.uHover.value = hover.value
    uniforms.uPlane.value.set(size.width, size.height)
    if (hover.value > 0.001 || Math.abs(velocityRef.current) > 0.002) {
      uniforms.uTime.value += delta
      state.invalidate()
    }
  })

  useEffect(() => {
    onReady()
  }, [onReady])

  return (
    <>
      <OrthographicCamera makeDefault position={[0, 0, 10]} zoom={1} />
      <mesh>
        <planeGeometry args={[size.width, size.height, 24, 24]} />
        <shaderMaterial uniforms={uniforms} vertexShader={DISTORT_VERTEX} fragmentShader={DISTORT_FRAGMENT} />
      </mesh>
    </>
  )
}
```

- [ ] **Step 3: `DistortImageSlot.tsx`를 만든다(main).**
  - DOM `<img>`는 항상 렌더한다(alt, 레이아웃, 폴백).
  - WebGL plane이 준비되면 DOM 이미지만 투명하게 만든다.
  - 화면 밖에서는 View를 언마운트하고 DOM 이미지로 돌아간다.

```tsx
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { canRender3D } from '../lib/can3D'
import { cn } from '../lib/cn'
import { registerSceneSlot } from '../lib/sceneBus'
import { useInView } from '../lib/useInView'
import type { HoverState } from './types'

const SlotView = lazy(() => import('./SlotView'))

type DistortImageSlotProps = {
  src: string
  alt: string
  fit: 'cover' | 'contain'
  hover: HoverState
  className?: string
  loading?: 'eager' | 'lazy'
}

export default function DistortImageSlot({ src, alt, fit, hover, className, loading = 'lazy' }: DistortImageSlotProps) {
  const [enabled] = useState(canRender3D)
  const [ready, setReady] = useState(false)

  const slotRef = useRef<HTMLSpanElement>(null)

  const inView = useInView(slotRef, '10% 30%')

  const handleReady = useCallback(() => setReady(true), [])

  useEffect(() => {
    if (!enabled) return
    return registerSceneSlot()
  }, [enabled])

  useEffect(() => {
    if (!inView) setReady(false)
  }, [inView])

  return (
    <span ref={slotRef} className={cn('relative block overflow-hidden', className)}>
      <img
        src={src}
        alt={alt}
        loading={loading}
        decoding="async"
        draggable={false}
        className={cn('size-full', fit === 'cover' ? 'object-cover' : 'object-contain', ready && 'opacity-0')}
      />
      {enabled && inView ? (
        <Suspense fallback={null}>
          <SlotView object={{ kind: 'distort', src, fit, hover, onReady: handleReady }} />
        </Suspense>
      ) : null}
    </span>
  )
}
```

  `useInView` 시그니처의 `RefObject<Element | null>`은 `HTMLSpanElement`를 받는다.

- [ ] **Step 4: GalleryRail에 연결한다.** `RailCard`의 `[data-rail-image]` span을 교체하고 hover 상태를 단다.

```tsx
const hoverRef = useRef<HoverState>({ value: 0 })

const handleMouseEnter = () => {
  gsap.to(hoverRef.current, { value: 1, duration: 0.6, ease: 'power3.out', onUpdate: invalidateScene })
}

const handleMouseLeave = () => {
  gsap.to(hoverRef.current, { value: 0, duration: 0.8, ease: 'power3.out', onUpdate: invalidateScene })
}
```

```tsx
<DistortImageSlot
  src={image.src}
  alt={work.compare ? work.compare.alt : ''}
  fit={work.compare ? 'contain' : 'cover'}
  hover={hoverRef.current}
  className="aspect-[8/5] bg-card-ground"
  loading={index < 2 ? 'eager' : 'lazy'}
/>
```

  - 버튼에 `onMouseEnter`/`onMouseLeave`(그리고 `onFocus`/`onBlur`)를 단다.
  - 핸들러 안 gsap 호출은 컴포넌트 수명과 무관한 일회성 tween이다. 언마운트 시 `gsap.killTweensOf(hoverRef.current)`를 effect cleanup에 둔다.

- [ ] **Step 5: 확인.** `bun run build`를 돌린다. 데스크톱에서 아래를 확인한다.
  - 카드 hover 시 이미지가 물결친다.
  - 빠르게 스크롤하면 이미지가 휘고, 멈추면 정지한다.
  - compare 이미지(contain)는 여백이 `--card-ground` 색이다.
  - thumb 이미지(useme, isle)는 cover로 채워진다.
  - DOM 이미지와 WebGL plane 위치가 정확히 겹친다(스크롤 중 어긋남 없음).
  - 상세 페이지에는 왜곡이 없다.
  - 모바일은 기존 Fan이다.
- [ ] **Step 6: Stage 7을 보고하고 멈춘다.**

---

## Stage 8 — 마감

### Task 8.1: 성능과 로딩

**Files:** Modify `index.html`, 전체 `<img>` 점검

- [ ] **Step 1: `index.html`에 preload를 추가한다.** 기존 preconnect·stylesheet는 유지하고, title·description은 그대로 둔다.

```html
<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin />
<link rel="preload" as="image" href="/images/bomi-landing.jpg" fetchpriority="high" />
<link
  rel="preload"
  as="style"
  href="https://fonts.googleapis.com/css2?family=Syne:wght@600..800&family=Sora:wght@400..600&display=swap"
/>
<link
  rel="preload"
  as="style"
  href="https://cdn.jsdelivr.net/gh/sun-typeface/SUIT@2/fonts/variable/woff2/SUIT-Variable.css"
/>
```

- [ ] **Step 2: img 속성을 점검한다.** `rg -n '<img' src`로 전부 확인한다. Hero 이미지와 Rail 앞 2장 외에는 모두 `loading="lazy" decoding="async"`가 있어야 한다.
- [ ] **Step 3: will-change를 점검한다.** `rg -n 'will-change' src`로 확인한다. 상시 `will-change`는 마퀴 row, Hero 레이어, 커서만 남긴다. 그 외는 제거하거나 `motion-reduce:will-change-auto`를 붙인다.
- [ ] **Step 4: 빌드 결과를 기록한다.** `bun run build`를 돌리고 main 청크와 3D 청크 크기를 보고에 적는다.
- [ ] **Step 5: Lighthouse를 측정한다.** 프로덕션 빌드(`bun run preview`)의 `/`를 데스크톱과 모바일로 측정한다. 목표는 Performance 90+, CLS 0.1 이하다. 미달 항목은 원인과 함께 보고한다.

### Task 8.2: 환경별 QA

- [ ] **reduced-motion** (CDP `Emulation.setEmulatedMedia`)
  - 프리로더는 페이드만 한다.
  - Hero는 자동 재생 1회 후 랜딩이 나온다.
  - 마퀴는 정지 상태다.
  - Rail은 pin 없이 가로 스크롤이다.
  - Method, Journal, Pilot은 정적이다.
  - 3D·WebGL 청크가 로드되지 않는다.
  - 커튼 없이 즉시 이동한다.
  - 라이트박스는 페이드만 한다.
- [ ] **모바일 390px** (CDP `Emulation.setDeviceMetricsOverride` + touch)
  - Fan 스와이프가 동작한다.
  - Hero pin이 짧다.
  - 커서와 매그네틱이 없다.
  - 3D 자리는 WebP 폴백이거나 빈칸이다.
  - Entries는 리스트다.
  - 확인 후 `Emulation.clearDeviceMetricsOverride`로 해제한다.
- [ ] **키보드**
  - Nav 섹션 버튼, 로고, contact me, Gallery 카드와 ‹ ›, Method 행(note 펼침), Pilot 이미지 버튼, Journal 링크, Contact Pill, 상세 링크·shot·entries `열기 ↗`·Pager를 전부 Tab으로 조작할 수 있다.
  - 라이트박스 안에서 포커스가 순환한다.
- [ ] **라우트**
  - `/` ↔ `/work/:slug` 6종, PREV·NEXT, `← 홈`, `← PROJECTS`를 확인한다.
  - 브라우저 뒤로가기 시 스크롤 위치가 복원된다.
  - 없는 슬러그는 홈으로 replace된다.
- [ ] **콘솔:** 경고와 에러가 0이다(React key, three 경고 포함).

### Task 8.3: 콘텐츠 누락 체크리스트 보고

- [ ] `bun scripts/check-content.ts`가 OK다.
- [ ] `git diff --exit-code main -- src/content/works.ts`의 종료 코드가 0이다.
- [ ] 프롬프트 6장 항목을 표로 하나씩 대조한다. 열은 항목, 위치(파일:행), 화면 확인(스크린샷)이다.
  - 메타, Nav, Hero, Projects, 일하는 방식(9행), AI WORKFLOW(5단계와 아웃트로), Journal(3개), Contact.
  - 상세 6개 슬러그 × 필드: label, period, status, title, oneLiner, role, stack, thumb, stats, decisions, shots, entries, links, testAccount, 라벨류.
- [ ] 최종 보고를 한다.
  - 바뀐 파일 전체 목록(`git status --short`)
  - Stage별 요약
  - 1장 "스펙과 다르게 가는 부분"의 최종 상태
  - 미해결 위험
  - 커밋 메시지 제안(gitmoji 한국어, 사용자가 직접 커밋)

---

## 9. Stage 보고 형식

```markdown
## Stage N 완료 — <제목>

**바뀐 파일**
- `path` — 한 줄 요약

**검증**
- bun run build: ✅ (main xxx KB / gzip yyy KB)
- check-content: ✅ N개
- works.ts diff: ✅ 0
- 브라우저: (데스크톱/390px 스크린샷)

**스펙과 다르게 한 것 / 확인 필요**
- …
```

## 10. 위험과 대응

| 위험 | 대응 |
|---|---|
| Hero 2000% pin과 3D 오브젝트 ScrollTrigger 동기화가 어긋남 | 같은 `trigger '#about'`, `start 'top top'`, `end HERO_PIN.desktop`, 타임라인 총 길이 1.12로 맞춘다. 어긋나면 Hero 타임라인에 `onUpdate`로 진행도를 sceneBus에 발행하는 방식으로 바꾼다 |
| drei View가 Lenis 스크롤 중 DOM과 1프레임 어긋남 | View는 렌더 시점의 rect를 쓴다. `onScroll`에서 invalidate하므로 같은 RAF(gsap.ticker)에서 갱신된다. 그래도 밀리면 SceneCanvas에서 `gsap.ticker.add(invalidateScene)`를 슬롯이 보일 때만 건다 |
| pin이 여러 개라 refresh 순서가 꼬임 | 섹션은 DOM 순서대로 마운트된다. 이미지 로드 refresh는 debounce한다. 전환 후 `ScrollTrigger.refresh()` 1회 |
| `/work/:slug` 직접 접속 404 (Netlify) | `public/_redirects`가 없다. 범위 밖이지만 Stage 8 보고에서 `/* /index.html 200` 추가 여부를 질문한다 |
| hello 손글씨 경로 품질 | 1차 좌표로 시작하고, 스크린샷을 보며 조정한다. 사용자가 SVG를 주면 `helloPath.ts`만 교체한다 |
| CJK 인사 글리프 | SUIT에 일본어·중국어 글리프가 없어서 시스템 폰트로 대체된다. 문제가 있으면 보고하고, 폰트 추가 여부를 묻는다 |
