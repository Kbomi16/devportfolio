import { useEffect, type RefObject } from 'react'
import { CURSOR_LABELS, cursorKindOf } from './cursor'
import { MEDIA } from './media'
import { prefersReducedMotion } from './motion'

type UseCursorFollowOptions = {
  lerp?: number
  labelRef?: RefObject<HTMLElement | null>
}

const canFollow = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia(MEDIA.finePointer).matches

const INTERACTIVE_SELECTOR =
  'a[href], button:not(:disabled), [role="button"], [role="link"], label, summary, select, input[type="button"], input[type="submit"], input[type="reset"], [tabindex]:not([tabindex="-1"])'

const isInteractive = (target: Element): boolean => {
  if (target.closest(INTERACTIVE_SELECTOR)) return true

  let node: Element | null = target
  while (node && node !== document.documentElement) {
    if (node instanceof HTMLElement) {
      const cursor = getComputedStyle(node).cursor
      if (cursor === 'pointer' || cursor === 'grab') return true
    }
    node = node.parentElement
  }
  return false
}

/** fixed 오버레이를 client 좌표로 부드럽게 따라가게 함 (rAF lerp) + data-cursor 라벨 */
export const useCursorFollow = (
  ref: RefObject<HTMLElement | null>,
  options?: UseCursorFollowOptions,
): void => {
  const lerp = options?.lerp ?? 0.14
  const labelRef = options?.labelRef

  useEffect(() => {
    const el = ref.current
    const label = labelRef?.current ?? null
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
      if (!active) {
        cx = tx
        cy = ty
        setVisible(true)
      }
    }

    const handlePointerOver = (event: PointerEvent) => {
      const hit = event.target instanceof Element ? event.target : null
      const kind = cursorKindOf(hit)
      el.classList.toggle('neon-cursor--pointer', hit ? isInteractive(hit) : false)
      el.classList.toggle('neon-cursor--label', kind !== null)
      if (label) label.textContent = kind ? CURSOR_LABELS[kind] : ''
    }

    const handlePointerLeave = () => {
      el.classList.remove('neon-cursor--pointer', 'neon-cursor--label')
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
    window.addEventListener('pointerover', handlePointerOver, { passive: true })
    document.documentElement.addEventListener('pointerleave', handlePointerLeave)
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerover', handlePointerOver)
      document.documentElement.removeEventListener('pointerleave', handlePointerLeave)
    }
  }, [ref, lerp, labelRef])
}
