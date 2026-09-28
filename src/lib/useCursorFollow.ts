import { useEffect, type RefObject } from 'react'
import { prefersReducedMotion } from './motion'

type UseCursorFollowOptions = {
  lerp?: number
}

const canFollow = (): boolean =>
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: hover) and (pointer: fine)').matches

const INTERACTIVE_SELECTOR =
  'a[href], button:not(:disabled), [role="button"], [role="link"], label, summary, select, input[type="button"], input[type="submit"], input[type="reset"], [tabindex]:not([tabindex="-1"])'

const isHoverTargetAt = (x: number, y: number): boolean => {
  const hit = document.elementFromPoint(x, y)
  if (!(hit instanceof Element)) return false

  if (hit.closest(INTERACTIVE_SELECTOR)) return true

  let node: Element | null = hit
  while (node && node !== document.documentElement) {
    if (node instanceof HTMLElement) {
      const cursor = getComputedStyle(node).cursor
      if (cursor === 'pointer' || cursor === 'grab') return true
    }
    node = node.parentElement
  }
  return false
}

/** fixed 오버레이를 client 좌표로 부드럽게 따라가게 함 (rAF lerp) */
export const useCursorFollow = (
  ref: RefObject<HTMLElement | null>,
  options?: UseCursorFollowOptions,
): void => {
  const lerp = options?.lerp ?? 0.14

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion() || !canFollow()) return

    let tx = window.innerWidth * 0.5
    let ty = window.innerHeight * 0.5
    let cx = tx
    let cy = ty
    let raf = 0
    let active = false

    const setVisible = (next: boolean) => {
      active = next
      el.style.opacity = next ? '1' : '0'
    }

    const handlePointerMove = (event: PointerEvent) => {
      tx = event.clientX
      ty = event.clientY
      el.classList.toggle('neon-cursor--pointer', isHoverTargetAt(tx, ty))
      if (!active) {
        cx = tx
        cy = ty
        setVisible(true)
      }
    }

    const handlePointerLeave = () => {
      el.classList.remove('neon-cursor--pointer')
      setVisible(false)
    }

    const tick = () => {
      cx += (tx - cx) * lerp
      cy += (ty - cy) * lerp
      el.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`
      raf = requestAnimationFrame(tick)
    }

    setVisible(false)
    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('pointerleave', handlePointerLeave)
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerleave', handlePointerLeave)
    }
  }, [ref, lerp])
}
