import { useEffect, useRef } from 'react'

/**
 * 컨테이너 내부의 `.reveal` 요소들을 1회성으로 등장시킨다.
 * 등장 후 다시 사라지지 않는다 (PLAN §7 모션 규칙).
 */
export const useReveal = <T extends HTMLElement>() => {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const targets = el.querySelectorAll('.reveal')
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in')
            io.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.2 },
    )
    targets.forEach((t) => io.observe(t))
    return () => io.disconnect()
  }, [])

  return ref
}
