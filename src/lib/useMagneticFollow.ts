import { useEffect, useRef } from 'react'
import { gsap } from './gsapSetup'
import { prefersReducedMotion } from './motion'

/** zone 위 마우스 위치 → target x/y (GSAP). reduced-motion이면 no-op. */
export const useMagneticFollow = (strength = 0.35) => {
  const zoneRef = useRef<HTMLDivElement>(null)
  const targetRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return

    const zone = zoneRef.current
    const target = targetRef.current
    if (!zone || !target) return

    const handleMouseMove = (event: MouseEvent) => {
      const rect = zone.getBoundingClientRect()
      const x = gsap.utils.mapRange(
        rect.left,
        rect.right,
        -rect.width / 2,
        rect.width / 2,
        event.clientX,
      )
      const y = gsap.utils.mapRange(
        rect.top,
        rect.bottom,
        -rect.height / 2,
        rect.height / 2,
        event.clientY,
      )

      gsap.to(target, {
        x: x * strength,
        y: y * strength,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: true,
      })
    }

    const handleMouseLeave = () => {
      gsap.to(target, {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: 'elastic.out(1, 0.4)',
        overwrite: true,
      })
    }

    zone.addEventListener('mousemove', handleMouseMove)
    zone.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      zone.removeEventListener('mousemove', handleMouseMove)
      zone.removeEventListener('mouseleave', handleMouseLeave)
      gsap.set(target, { x: 0, y: 0 })
    }
  }, [strength])

  return { zoneRef, targetRef }
}
