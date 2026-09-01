export type Chapter = 'portal' | 'reveal' | 'work' | 'roster' | 'journal' | 'close'

/** 챕터 경계 (PLAN.md §4) */
export const CH = {
  portalEnd: 0.14,
  revealEnd: 0.26,
  workEnd: 0.58,
  rosterEnd: 0.74,
  journalEnd: 0.86,
} as const

export function chapterAt(p: number): Chapter {
  if (p < CH.portalEnd) return 'portal'
  if (p < CH.revealEnd) return 'reveal'
  if (p < CH.workEnd) return 'work'
  if (p < CH.rosterEnd) return 'roster'
  if (p < CH.journalEnd) return 'journal'
  return 'close'
}

export const clamp01 = (v: number): number => Math.min(1, Math.max(0, v))

/** p를 [a, b] 구간의 0~1 로컬 진행도로 변환 */
export const range = (p: number, a: number, b: number): number =>
  clamp01((p - a) / (b - a))

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}
