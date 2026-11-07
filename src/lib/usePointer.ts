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
