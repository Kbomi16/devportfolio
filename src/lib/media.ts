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
