import { useEffect, type RefObject } from 'react'

const FOCUSABLE =
  'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'

/** ref 안에서만 Tab 포커스가 순환하게 한다 */
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
