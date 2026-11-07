import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import type { Group } from 'three'
import { gsap, useGSAP } from '../../lib/gsapSetup'
import { getHeroProgress } from '../../lib/hero'
import GlossyMaterial from '../GlossyMaterial'
import { useTilt } from '../useTilt'

/** Hero 랜딩 — Hero 핀 타임라인과 같은 진행도로 등장·회전·이동한다 */
export default function HeroObjects() {
  const scrollRef = useRef<Group>(null)
  const tiltRef = useRef<Group>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)

  useTilt(tiltRef)
  useGSAP(() => {
    const group = scrollRef.current
    if (!group) return
    group.scale.setScalar(0)
    timelineRef.current = gsap
      .timeline({ paused: true, defaults: { ease: 'none' } })
      .to(group.scale, { x: 1, y: 1, z: 1, duration: 0.12, ease: 'back.out(1.6)' }, 0.8)
      .to(group.rotation, { y: Math.PI * 0.9, duration: 0.32 }, 0.8)
      .to(group.position, { y: 0.35, duration: 0.32 }, 0.8)
      .to({}, { duration: 0.1 }, 1.02)
    return () => {
      timelineRef.current = null
    }
  })

  useFrame(() => {
    const timeline = timelineRef.current
    if (!timeline) return
    const progress = getHeroProgress()
    if (timeline.progress() !== progress) timeline.progress(progress)
  })

  return (
    <group ref={scrollRef}>
      <group ref={tiltRef}>
        <RoundedBox args={[1.3, 1.3, 1.3]} radius={0.28} smoothness={6} position={[-0.35, 0.1, 0]} rotation={[0.4, 0.6, 0]}>
          <GlossyMaterial tone="ink" />
        </RoundedBox>
        <mesh position={[0.75, -0.45, 0.4]} rotation={[1.1, 0.2, 0]}>
          <torusGeometry args={[0.42, 0.18, 32, 64]} />
          <GlossyMaterial tone="neon" />
        </mesh>
      </group>
    </group>
  )
}
