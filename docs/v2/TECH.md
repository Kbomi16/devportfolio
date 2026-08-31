# 기술 골격 — 포트폴리오 v2

> PLAN.md의 스크롤 시네마를 구동하는 기술 설계.

## 1. 스택

| 레이어 | 선택 | 이유 |
|--------|------|------|
| 빌드·프레임워크 | **Vite + React 19 + TypeScript** | v1 레포 구조 유지, 원페이지 WebGL에 최적 |
| 라우팅 | **react-router v7** | `/` + `/work/[slug]` 3장 |
| 3D | **three + @react-three/fiber + @react-three/drei** | 선언적 씬 구성, useAnimations·useGLTF |
| 스크롤 | **lenis** | 부드러운 스크롤 + 진행도 소스 (사이트 전체의 심장) |
| 스크롤 연동 | 자체 progress 스토어 (Lenis `scroll` 이벤트 → 0~1 정규화) | GSAP ScrollTrigger 없이도 충분. HTML 리빌만 IntersectionObserver |
| 상태 | **zustand** | progress · 챕터 · 인터랙션 상태 공유 (React 리렌더 없이 구독) |
| 포스트프로세싱 | **@react-three/postprocessing** | 저채도 그레이딩 + 그레인 + 비네트 |
| 2D 모션 | CSS transform + (필요시) framer-motion | 패널·워드마크·리빌은 CSS로 충분 |
| GLB 최적화 | **@gltf-transform/cli** (빌드 전 스크립트) | draco + 텍스처 압축 |
| 배포 | Vercel (v1과 동일) | — |

## 2. 아키텍처

### 2.1 레이어 구조

```
<App>
 ├─ <Lenis root>                      … 스크롤 컨테이너 (높이 ~800vh 유령 트랙)
 ├─ <Canvas fixed>                    … WebGL, position: fixed, 전체 뷰포트
 │   ├─ <Stage>                       … 라이트 2 + 포그 + 바닥
 │   ├─ <Character>                   … GLB + useAnimations 상태머신
 │   ├─ <Exhibits>                    … TCC 큐브 · SITES 패널 · ALLEO 와이어 (프로시저럴)
 │   ├─ <CameraRig>                   … progress → 카메라 키프레임 보간
 │   └─ <Effects>                     … saturation · grain · vignette
 └─ <Overlay>                         … HTML 레이어 (nav · 포털 패널 · 워드마크 · 챕터 타이포)
```

### 2.2 진행도 파이프라인

```
Lenis scroll → progress(0~1) → zustand store
  ├─ Canvas: useFrame에서 store를 직접 읽음 (리렌더 없음)
  │    ├─ CameraRig: 키프레임 테이블 보간 + damping
  │    ├─ Character: 위치·회전 보간 + 클립 크로스페이드
  │    └─ Portal 관련 유니폼
  └─ Overlay: 포털 패널·워드마크는 CSS 변수(--p)로 바인딩,
              텍스트 리빌은 IntersectionObserver (1회성)
```

- **키프레임 테이블**: 챕터별 `{ at: progress, cam: {pos, lookAt}, char: {pos, rot, clip} }` 배열 하나가 단일 진실. PLAN.md의 챕터 표와 1:1 대응.
- **damping**: 카메라·캐릭터는 목표값으로 `MathUtils.damp` (스크롤 튐 흡수). 포털 패널·워드마크는 즉시 바인딩 (문은 손에 붙은 느낌이어야 함).
- **챕터 상태머신**: `portal | arrival | work | roster | journal | close`. 클립 전환·인터랙션 활성화가 이 상태를 따름.

### 2.3 캐릭터 애니메이션 상태머신

```
Run ──(arrival 진입)──▶ Idle ──(work 진입)──▶ Walk ⇄ Idle (전시물 앞 정지)
                                                    │
Idle ◀──(jump 종료)── Jump ◀──(close에서 클릭)── Idle(정면)
```

- 전환은 전부 `crossFadeTo(0.3s)`. 스크롤 역방향이면 상태도 역방향으로.
- Walk 구간의 발 미끄러짐 방지: 이동 속도를 클립 보폭에 맞춰 progress 매핑 계수 조정.

### 2.4 라우팅 전환

- CH3 전시물 클릭 → 카메라 푸시인(0.6s, 이 순간만 스크롤 잠금) → 화이트 오버레이 페이드 → `navigate('/work/tcc')`.
- `/work/*` → 홈 복귀: 저장해둔 progress로 Lenis `scrollTo(immediate)` 후 페이드인.
- `/work/*` 페이지는 Canvas를 마운트하지 않음 (2D 전용, 가벼움).

## 3. 폴더 구조 제안

```
src/
├─ app/                 # 라우터·엔트리
├─ scene/               # R3F 전용
│  ├─ CameraRig.tsx
│  ├─ Character.tsx     # GLB 로드 + 클립 상태머신
│  ├─ Stage.tsx         # 라이트·포그·바닥
│  ├─ exhibits/         # TccCube · SitePanels · AlleoWire
│  ├─ Effects.tsx
│  └─ keyframes.ts      # ★ 챕터 키프레임 테이블 (단일 진실)
├─ overlay/             # HTML 레이어
│  ├─ Nav.tsx
│  ├─ Portal.tsx        # 패널 2장 + 워드마크 + 코너 메타
│  └─ chapters/         # Arrival · Work · Roster · Journal · Close 타이포
├─ pages/work/          # 케이스 스터디 3장 + 슬리브 덱 컴포넌트
├─ lib/                 # lenis 훅 · progress store · reduced-motion 헬퍼
├─ content/             # 프로젝트 데이터 (letter/portfolio.md에서 이식)
└─ styles/              # 토큰 CSS 변수 · 폰트
public/models/          # bomi.glb (최적화 산출물)
```

- v1 코드는 이 브랜치에서 단계적으로 대체. 남길 것 없으면 삭제.

## 4. 성능 가드레일

| 항목 | 기준 |
|------|------|
| 캐릭터 GLB | **< 3MB** (draco + 1024px 텍스처, ASSET-PIPELINE.md 참고) |
| DPR | `Math.min(devicePixelRatio, 2)`, 모바일 1.5 |
| 드로우콜 | 전시물은 머티리얼 공유, 씬 전체 < 50 드로우콜 목표 |
| 프레임 | 렌더 루프는 상시(캐릭터 루프 애니메이션 때문에 demand 불가), 탭 비활성 시 정지 |
| LCP | 워드마크(HTML)가 LCP가 되도록 — Canvas는 hydrate 후 페이드인, GLB는 preload |
| 폰트 | Syne·Sora·SUIT 서브셋 woff2, `font-display: swap` |
| 모바일 | 그레인 오프, 포그 단순화, 전시물 세그먼트 축소 |

## 5. 폴백 전략

| 상황 | 처리 |
|------|------|
| `prefers-reduced-motion` | Lenis·스크롤 바인딩 끔. 문 열린 정적 상태 + 일반 스크롤 섹션 스택 |
| WebGL 실패 / no-JS | Canvas 자리에 캐릭터 렌더샷 포스터. 나머지는 HTML이라 그대로 읽힘 |
| 저사양 감지 (첫 2초 fps < 30) | DPR 1로 강등 + 그레인·비네트 오프 |
