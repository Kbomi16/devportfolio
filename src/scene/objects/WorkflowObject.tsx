import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Extrude, RoundedBox } from '@react-three/drei'
import { MathUtils, Shape, type Group } from 'three'
import GlossyMaterial from '../GlossyMaterial'
import { passProgress } from '../scrollProgress'
import { useTilt } from '../useTilt'

type WorkflowObjectProps = {
  variant: 'memo' | 'cursor'
}

const TRIGGER: Record<WorkflowObjectProps['variant'], string> = {
  memo: '#roster',
  cursor: '#pilot',
}

const CURSOR_SHAPE = (() => {
  const shape = new Shape()
  shape.moveTo(0, 0)
  shape.lineTo(0, -1.2)
  shape.lineTo(0.32, -0.9)
  shape.lineTo(0.55, -1.4)
  shape.lineTo(0.72, -1.32)
  shape.lineTo(0.5, -0.84)
  shape.lineTo(0.92, -0.84)
  shape.closePath()
  return shape
})()

const CURSOR_EXTRUDE = {
  depth: 0.18,
  bevelEnabled: true,
  bevelThickness: 0.06,
  bevelSize: 0.05,
  bevelSegments: 6,
}

/** 일하는 방식(memo)·AI WORKFLOW(cursor) 모서리 오브젝트 — 섹션 통과에 따라 z축으로 기운다 */
export default function WorkflowObject({ variant }: WorkflowObjectProps) {
  const scrollRef = useRef<Group>(null)
  const tiltRef = useRef<Group>(null)

  useTilt(tiltRef)

  useFrame(() => {
    const group = scrollRef.current
    if (!group) return
    group.rotation.z = MathUtils.lerp(-0.3, 0.3, passProgress(TRIGGER[variant]))
  })

  return (
    <group ref={scrollRef}>
      <group ref={tiltRef}>{variant === 'memo' ? <MemoMesh /> : <CursorMesh />}</group>
    </group>
  )
}

function MemoMesh() {
  return (
    <>
      <RoundedBox args={[1.5, 1.8, 0.08]} radius={0.04} smoothness={4} rotation={[0, 0, -0.08]}>
        <GlossyMaterial tone="ink" />
      </RoundedBox>
      <RoundedBox args={[0.7, 0.22, 0.04]} radius={0.02} smoothness={4} position={[0, 0.88, 0.07]} rotation={[0, 0, 0.12]}>
        <GlossyMaterial tone="neon" />
      </RoundedBox>
      <group position={[0.35, -0.2, 0.32]} rotation={[0.2, 0, -0.7]}>
        <mesh>
          <cylinderGeometry args={[0.1, 0.1, 1.5, 6]} />
          <GlossyMaterial tone="ground" />
        </mesh>
        <mesh position={[0, -0.88, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.1, 0.26, 6]} />
          <GlossyMaterial tone="neon" />
        </mesh>
      </group>
    </>
  )
}

function CursorMesh() {
  return (
    <>
      <Extrude args={[CURSOR_SHAPE, CURSOR_EXTRUDE]} position={[-0.45, 0.7, 0]}>
        <GlossyMaterial tone="ground" />
      </Extrude>
      <mesh position={[0.6, -0.55, 0.3]}>
        <sphereGeometry args={[0.22, 32, 32]} />
        <GlossyMaterial tone="neon" />
      </mesh>
    </>
  )
}
