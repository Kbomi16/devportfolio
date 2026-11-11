import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Extrude, RoundedBox } from '@react-three/drei'
import { Shape, type Group, type Object3D } from 'three'
import { gsap, useGSAP } from '../../lib/gsapSetup'
import GlossyMaterial from '../GlossyMaterial'
import { useTilt } from '../useTilt'

const FLAP = (() => {
  const shape = new Shape()
  shape.moveTo(-1.15, 0)
  shape.lineTo(1.15, 0)
  shape.lineTo(0, -0.82)
  shape.closePath()
  return shape
})()

const PLANE = (() => {
  const shape = new Shape()
  shape.moveTo(0, 0.72)
  shape.lineTo(0.78, -0.38)
  shape.lineTo(0.16, -0.16)
  shape.lineTo(0, -0.48)
  shape.lineTo(-0.16, -0.16)
  shape.lineTo(-0.78, -0.38)
  shape.closePath()
  return shape
})()

const THIN = {
  depth: 0.05,
  bevelEnabled: true,
  bevelThickness: 0.02,
  bevelSize: 0.02,
  bevelSegments: 2,
}

const REST = [
  { x: -0.55, y: -0.42, z: 0 },
  { x: 1.55, y: -0.05, z: 0.15 },
]

/** Contact — 봉투와 종이비행기. 들어오면 떨어지고, 앉으면 같이 떠다닌다 */
export default function ContactObjects() {
  const floatRef = useRef<Group>(null)
  const tiltRef = useRef<Group>(null)
  const pieceRefs = useRef<Array<Object3D | null>>([])
  const settledRef = useRef(false)

  const invalidate = useThree((state) => state.invalidate)

  useTilt(tiltRef, 0.28)

  useGSAP(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      invalidate()
      return
    }

    pieceRefs.current.forEach((piece, index) => {
      if (!piece) return
      gsap.fromTo(
        piece.position,
        { y: 3.4 + index * 0.7 },
        {
          y: REST[index].y,
          duration: 1.25,
          delay: index * 0.16,
          ease: 'bounce.out',
          onUpdate: invalidate,
          onComplete: () => {
            if (index === REST.length - 1) settledRef.current = true
          },
        },
      )
      gsap.from(piece.rotation, {
        x: -1.4,
        z: index === 0 ? 0.4 : -0.8,
        duration: 1.25,
        delay: index * 0.16,
        ease: 'power3.out',
        onUpdate: invalidate,
      })
    })
  })

  useFrame((state) => {
    const float = floatRef.current
    const plane = pieceRefs.current[1]
    if (!float || !settledRef.current) return
    const time = state.clock.elapsedTime
    float.position.y = Math.sin(time * 1.15) * 0.06
    if (plane) {
      plane.rotation.z = -0.45 + Math.sin(time * 1.4) * 0.12
      plane.position.y = REST[1].y + Math.sin(time * 1.6) * 0.08
    }
    state.invalidate()
  })

  return (
    <group ref={floatRef} scale={1.2}>
      <group ref={tiltRef}>
        <group
          ref={(node) => {
            pieceRefs.current[0] = node
          }}
          position={[REST[0].x, REST[0].y, REST[0].z]}
        >
          <Envelope />
        </group>
        <group
          ref={(node) => {
            pieceRefs.current[1] = node
          }}
          position={[REST[1].x, REST[1].y, REST[1].z]}
          rotation={[0.35, 0.55, -0.45]}
        >
          <PaperPlane />
        </group>
      </group>
    </group>
  )
}

function Envelope() {
  return (
    <group>
      <RoundedBox args={[2.45, 1.5, 0.16]} radius={0.06} smoothness={4}>
        <GlossyMaterial tone="ink" />
      </RoundedBox>
      <RoundedBox args={[1.72, 1.2, 0.04]} radius={0.04} smoothness={3} position={[0, 0.46, 0.12]}>
        <GlossyMaterial tone="mid" />
      </RoundedBox>
      <Extrude args={[FLAP, THIN]} position={[0, 0.78, 0.18]} rotation={[0.7, 0, 0]}>
        <GlossyMaterial tone="ink" />
      </Extrude>
      <mesh position={[0, 0.22, 0.32]}>
        <sphereGeometry args={[0.14, 32, 32]} />
        <GlossyMaterial tone="neon" />
      </mesh>
    </group>
  )
}

function PaperPlane() {
  return (
    <group>
      <Extrude args={[PLANE, THIN]}>
        <GlossyMaterial tone="ink" />
      </Extrude>
      <mesh position={[0, 0.05, 0.06]}>
        <boxGeometry args={[0.08, 0.85, 0.03]} />
        <GlossyMaterial tone="neon" />
      </mesh>
    </group>
  )
}
