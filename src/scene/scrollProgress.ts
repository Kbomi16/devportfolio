import { MathUtils } from 'three'

const measureOf = (selector: string): DOMRect | null => {
  const element = document.querySelector(selector)
  if (!element) return null
  const parent = element.parentElement
  const target = parent?.classList.contains('pin-spacer') ? parent : element
  return target.getBoundingClientRect()
}

/** 'top bottom' → 'bottom top' 구간 진행도(0~1). pin된 섹션은 pin-spacer 기준 */
export const passProgress = (selector: string): number => {
  const rect = measureOf(selector)
  if (!rect) return 0
  const vh = window.innerHeight
  return MathUtils.clamp((vh - rect.top) / (vh + rect.height), 0, 1)
}

/** 'top top' → 'bottom top' 구간 진행도(0~1) */
export const leaveProgress = (selector: string): number => {
  const rect = measureOf(selector)
  if (!rect || rect.height === 0) return 0
  return MathUtils.clamp(-rect.top / rect.height, 0, 1)
}

/** 핀이 시작돼 섹션이 화면을 벗어날 때까지. 히어로 빨림과 글자 퇴장에 쓴다 */
export const heroTravelProgress = (selector: string): number => {
  const rect = measureOf(selector)
  if (!rect) return 0
  const travel = Math.max(rect.height - window.innerHeight, window.innerHeight * 0.85)
  return MathUtils.clamp(-rect.top / travel, 0, 1)
}
