import { useMemo } from 'react'
import { toneColor, type Tone } from './palette'

/** 클리어코트 광택 재질 */
export default function GlossyMaterial({ tone }: { tone: Tone }) {
  const color = useMemo(() => toneColor(tone), [tone])

  return (
    <meshPhysicalMaterial
      color={color}
      roughness={0.28}
      metalness={0.08}
      clearcoat={1}
      clearcoatRoughness={0.12}
    />
  )
}
