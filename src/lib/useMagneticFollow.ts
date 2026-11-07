import { useEffect, useRef } from 'react'
import { gsap } from './gsapSetup'
import { MEDIA } from './media'

/** zone 위 마우스 → target(버튼)과 inner(텍스트)를 다른 강도로 끌어당김. fine pointer + motion에서만. */
export const useMagneticFollow = <T extends HTMLElement = HTMLElement>(
  strength = 0.35,
  innerStrength = strength * 0.6,
) => {
  const zoneRef = useRef<HTMLDivElement>(null)
  const targetRef = useRef<T>(null)
  const innerRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const canMagnet =
      window.matchMedia(MEDIA.motion).matches && window.matchMedia(MEDIA.finePointer).matches
    const zone = zoneRef.current
    const target = targetRef.current
    const inner = innerRef.current
    if (!canMagnet || !zone || !target) return

    const moving = inner ? [target, inner] : [target]

    const handleMouseMove = (event: MouseEvent) => {
      const rect = zone.getBoundingClientRect()
      const x = event.clientX - (rect.left + rect.width / 2)
      const y = event.clientY - (rect.top + rect.height / 2)
      gsap.to(target, {
        x: x * strength,
        y: y * strength,
        duration: 0.45,
        ease: 'power3.out',
        overwrite: true,
      })
      if (inner) {
        gsap.to(inner, {
          x: x * innerStrength,
          y: y * innerStrength,
          duration: 0.45,
          ease: 'power3.out',
          overwrite: true,
        })
      }
    }

    const handleMouseLeave = () => {
      gsap.to(moving, {
        x: 0,
        y: 0,
        duration: 1,
        ease: 'elastic.out(1, 0.35)',
        overwrite: true,
      })
    }

    zone.addEventListener('mousemove', handleMouseMove)
    zone.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      zone.removeEventListener('mousemove', handleMouseMove)
      zone.removeEventListener('mouseleave', handleMouseLeave)
      gsap.killTweensOf(moving)
      gsap.set(moving, { x: 0, y: 0 })
    }
  }, [strength, innerStrength])

  return { zoneRef, targetRef, innerRef }
}
