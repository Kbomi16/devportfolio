import { useEffect } from 'react'
import { prefersReducedMotion } from './motion'

const publish = (x: number, y: number): void => {
  const root = document.documentElement
  root.style.setProperty('--mx', x.toFixed(4))
  root.style.setProperty('--my', y.toFixed(4))
}

/** Home에서 1회 — 마우스 위치(-1~1)를 CSS 변수 --mx/--my로 발행 (패럴랙스용) */
export const usePointer = (): void => {
  useEffect(() => {
    if (prefersReducedMotion()) {
      publish(0, 0)
      return
    }

    const target = { x: 0, y: 0 }
    const cur = { x: 0, y: 0 }
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
      cur.x += (target.x - cur.x) * 0.09
      cur.y += (target.y - cur.y) * 0.09
      publish(cur.x, cur.y)
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
