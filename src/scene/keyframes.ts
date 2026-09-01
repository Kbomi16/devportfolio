/**
 * ★ 챕터 키프레임 테이블 — 시네마의 단일 진실.
 * PLAN.md §4 챕터 표와 1:1 대응. 모든 값은 스크롤 진행도 p(0~1)에 바인딩된다.
 *
 * 좌표계: 바닥 y=0, 캐릭터 발 기준. CH1은 z축(달려옴), CH3은 x축(갤러리 트래킹).
 * clip 의미: "이 키프레임에 도달하는 구간 동안의 동작" (구간 진입 즉시 크로스페이드 시작).
 */

export type Clip = 'Run' | 'Pose' | 'Walk' | 'Idle' | 'Jump'

export interface Sample {
  camPos: [number, number, number]
  camLook: [number, number, number]
  charPos: [number, number, number]
  charRotY: number
  clip: Clip
  /** 지면 반전 0 = 검정, 1 = 화이트 */
  ground: number
}

interface Keyframe extends Sample {
  at: number
}

const PI = Math.PI

/** CH3 전시물 배치 (Exhibits·CameraRig 푸시인 공유) */
export const EXHIBITS = [
  { slug: 'tcc', x: 8 },
  { slug: 'sites', x: 20 },
  { slug: 'alleo', x: 32 },
] as const

const KF: Keyframe[] = [
  // CH1 PORTAL — 어둠 속에서 달려온다
  { at: 0.0,  camPos: [0, 1.55, 7.2],   camLook: [0, 1.3, -10],   charPos: [0, 0, -40],    charRotY: 0,      clip: 'Run',  ground: 0 },
  { at: 0.14, camPos: [0, 1.4, 6.2],    camLook: [0, 1.2, -2],    charPos: [0, 0, -2.2],   charRotY: 0,      clip: 'Run',  ground: 0 },
  // CH2 REVEAL — 지면 반전 + 포즈 (좌측 1/3, 로우앵글)
  { at: 0.18, camPos: [0.9, 1.05, 4.2], camLook: [-0.7, 1.2, -1], charPos: [-1.0, 0, -1.1], charRotY: 0.3,   clip: 'Pose', ground: 1 },
  { at: 0.26, camPos: [1.15, 0.95, 3.5],camLook: [-1.0, 1.25, -1],charPos: [-1.15, 0, -1],  charRotY: 0.35,  clip: 'Pose', ground: 1 },
  // CH3 WORK — 90° 턴, 화이트 갤러리 트래킹
  { at: 0.31, camPos: [8.6, 1.6, 7.5],  camLook: [8, 1.2, -1.5],  charPos: [8, 0, 0],      charRotY: PI / 2, clip: 'Walk', ground: 1 },
  { at: 0.37, camPos: [8.8, 1.55, 7.0], camLook: [8, 1.1, -2.2],  charPos: [8, 0, 0],      charRotY: PI,     clip: 'Idle', ground: 1 },
  { at: 0.41, camPos: [20.6, 1.6, 7.5], camLook: [20, 1.2, -1.5], charPos: [20, 0, 0],     charRotY: PI / 2, clip: 'Walk', ground: 1 },
  { at: 0.47, camPos: [20.8, 1.55, 7.0],camLook: [20, 1.1, -2.2], charPos: [20, 0, 0],     charRotY: PI,     clip: 'Idle', ground: 1 },
  { at: 0.51, camPos: [32.6, 1.6, 7.5], camLook: [32, 1.2, -1.5], charPos: [32, 0, 0],     charRotY: PI / 2, clip: 'Walk', ground: 1 },
  { at: 0.57, camPos: [32.8, 1.55, 7.0],camLook: [32, 1.1, -2.2], charPos: [32, 0, 0],     charRotY: PI,     clip: 'Idle', ground: 1 },
  // CH4 ROSTER & DATES — 호흡 구간, 캐릭터는 구석에 작게
  { at: 0.6,  camPos: [34.5, 2.0, 10],  camLook: [33.5, 1.2, -1], charPos: [32.7, 0, 0.4], charRotY: 2.6,    clip: 'Idle', ground: 1 },
  { at: 0.74, camPos: [34.2, 1.9, 9.5], camLook: [33.4, 1.2, -0.5],charPos: [32.7, 0, 0.4],charRotY: 2.6,    clip: 'Idle', ground: 1 },
  // CH5 JOURNAL — 카메라 쪽으로 몸을 돌리기 시작
  { at: 0.84, camPos: [33.4, 1.6, 7.8], camLook: [33, 1.2, 0.2],  charPos: [32.9, 0, 0.8], charRotY: 0.8,    clip: 'Idle', ground: 1 },
  // CH6 CLOSE — 다시 검정, 정면
  { at: 0.88, camPos: [33.1, 1.4, 6.6], camLook: [33, 1.15, 0.8], charPos: [33, 0, 1],     charRotY: 0,      clip: 'Idle', ground: 0 },
  { at: 1.0,  camPos: [33, 1.25, 5.6],  camLook: [33, 1.1, 1],    charPos: [33, 0, 1],     charRotY: 0,      clip: 'Idle', ground: 0 },
]

const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const lerp3 = (
  a: readonly [number, number, number],
  b: readonly [number, number, number],
  t: number,
): [number, number, number] => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)]

/** 진행도 p의 시네마 상태를 키프레임 선형 보간으로 계산 (순수 함수 — 역스크롤 완전 대응) */
export function sample(p: number): Sample {
  const clamped = Math.min(1, Math.max(0, p))
  let i = 0
  while (i < KF.length - 2 && clamped > KF[i + 1].at) i++
  const a = KF[i]
  const b = KF[i + 1]
  const t = (clamped - a.at) / (b.at - a.at)

  return {
    camPos: lerp3(a.camPos, b.camPos, t),
    camLook: lerp3(a.camLook, b.camLook, t),
    charPos: lerp3(a.charPos, b.charPos, t),
    charRotY: lerp(a.charRotY, b.charRotY, t),
    clip: b.clip,
    ground: lerp(a.ground, b.ground, t),
  }
}
