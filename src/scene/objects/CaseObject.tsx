import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import type { Group } from 'three'
import type { WorkItem } from '../../content/works'
import GlossyMaterial from '../GlossyMaterial'
import { CASE_TONES } from '../palette'
import { leaveProgress } from '../scrollProgress'
import { useTilt } from '../useTilt'

type CaseObjectProps = {
  slug: WorkItem['slug']
}

/** 상세 히어로 — 케이스별 색 조합. 히어로를 벗어나는 동안 y축으로 반 바퀴 돈다 */
export default function CaseObject({ slug }: CaseObjectProps) {
  const scrollRef = useRef<Group>(null)
  const tiltRef = useRef<Group>(null)

  useTilt(tiltRef)

  useFrame(() => {
    const group = scrollRef.current
    if (!group) return
    group.rotation.y = leaveProgress('[data-work-hero]') * Math.PI
  })

  const tones = CASE_TONES[slug]

  return (
    <group ref={scrollRef}>
      <group ref={tiltRef}>
        <RoundedBox args={[1.2, 1.2, 1.2]} radius={0.26} smoothness={6} position={[-0.25, 0.15, 0]} rotation={[0.4, 0.6, 0]}>
          <GlossyMaterial tone={tones.base} />
        </RoundedBox>
        <mesh position={[0.65, -0.45, 0.4]} rotation={[1.1, 0.2, 0]}>
          <torusGeometry args={[0.38, 0.16, 32, 64]} />
          <GlossyMaterial tone={tones.accent} />
        </mesh>
      </group>
    </group>
  )
}
