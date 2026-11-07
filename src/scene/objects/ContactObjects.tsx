import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import type { Group, Mesh } from 'three'
import { gsap, useGSAP } from '../../lib/gsapSetup'
import GlossyMaterial from '../GlossyMaterial'

const REST = [
  { x: -1.4, y: -0.55, z: 0 },
  { x: 0, y: -0.5, z: 0.3 },
  { x: 1.35, y: -0.6, z: -0.2 },
]

/** Contact — 화면에 들어오면 세 오브젝트가 위에서 떨어지고, 다 떨어지면 함께 떠다닌다 */
export default function ContactObjects() {
  const floatRef = useRef<Group>(null)
  const meshRefs = useRef<Array<Mesh | null>>([])
  const settledRef = useRef(false)

  const invalidate = useThree((state) => state.invalidate)
  useGSAP(() => {
    meshRefs.current.forEach((mesh, index) => {
      if (!mesh) return
      gsap.fromTo(
        mesh.position,
        { y: 3.2 + index * 0.6 },
        {
          y: REST[index].y,
          duration: 1.3,
          delay: index * 0.12,
          ease: 'bounce.out',
          onUpdate: invalidate,
          onComplete: () => {
            if (index === REST.length - 1) settledRef.current = true
          },
        },
      )
      gsap.from(mesh.rotation, { x: -2, z: 1.2, duration: 1.3, delay: index * 0.12, ease: 'power3.out' })
    })
  })

  useFrame((state) => {
    const float = floatRef.current
    if (!float || !settledRef.current) return
    float.position.y = Math.sin(state.clock.elapsedTime * 1.2) * 0.06
    state.invalidate()
  })

  return (
    <group ref={floatRef}>
      <mesh
        ref={(mesh) => {
          meshRefs.current[0] = mesh
        }}
        position={[REST[0].x, REST[0].y, REST[0].z]}
      >
        <sphereGeometry args={[0.5, 48, 48]} />
        <GlossyMaterial tone="neon" />
      </mesh>
      <RoundedBox
        ref={(mesh: Mesh | null) => {
          meshRefs.current[1] = mesh
        }}
        args={[0.9, 0.9, 0.9]}
        radius={0.2}
        smoothness={6}
        position={[REST[1].x, REST[1].y, REST[1].z]}
      >
        <GlossyMaterial tone="ink" />
      </RoundedBox>
      <mesh
        ref={(mesh) => {
          meshRefs.current[2] = mesh
        }}
        position={[REST[2].x, REST[2].y, REST[2].z]}
        rotation={[1.2, 0.3, 0]}
      >
        <torusGeometry args={[0.42, 0.18, 32, 64]} />
        <GlossyMaterial tone="mid" />
      </mesh>
    </group>
  )
}
