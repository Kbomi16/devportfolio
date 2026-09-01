import { useRef, useState, type ReactNode } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group, MathUtils } from 'three'
import { EXHIBITS } from '../keyframes'
import { useProgress } from '../../lib/progress'

/** 전시물 공통: 호버 부상 + 클릭 → 케이스 전환 트리거 */
function Exhibit({ slug, x, children }: { slug: string; x: number; children: ReactNode }) {
  const [hovered, setHovered] = useState(false)

  const group = useRef<Group>(null!)

  const handleClick = () => {
    useProgress.getState().setPendingSlug(slug)
  }

  const handlePointerOver = () => {
    setHovered(true)
    document.body.style.cursor = 'pointer'
  }

  const handlePointerOut = () => {
    setHovered(false)
    document.body.style.cursor = ''
  }

  useFrame((_, dt) => {
    const g = group.current
    g.position.y = MathUtils.damp(g.position.y, hovered ? 0.3 : 0, 6, dt)
  })

  return (
    <group position={[x, 0, -3]}>
      <group
        ref={group}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        {children}
      </group>
    </group>
  )
}

/** 화이트 무대 위 검은 전시물 3종 (전부 프로시저럴 — 모델링 불필요) */
export default function Exhibits() {
  const [tcc, sites, alleo] = EXHIBITS

  return (
    <>
      {/* TCC — 묵직한 블랙 큐브 (권한·규칙의 무게) */}
      <Exhibit slug={tcc.slug} x={tcc.x}>
        <mesh position={[0, 1.35, 0]} rotation-y={0.5} castShadow>
          <boxGeometry args={[1.7, 1.7, 1.7]} />
          <meshStandardMaterial color="#101013" roughness={0.4} metalness={0.15} />
        </mesh>
      </Exhibit>

      {/* SITES — 얇은 블랙 패널 4장 */}
      <Exhibit slug={sites.slug} x={sites.x}>
        {[0, 1, 2, 3].map((i) => (
          <mesh
            key={i}
            position={[(i - 1.5) * 0.62, 1.25, i * 0.12]}
            rotation-y={0.35 + i * 0.06}
            castShadow
          >
            <boxGeometry args={[0.06, 2.1, 1.15]} />
            <meshStandardMaterial color="#101013" roughness={0.5} />
          </mesh>
        ))}
      </Exhibit>

      {/* ALLEO — 블랙 와이어프레임 구조물 4덩이 (intro/blog/admin/console) */}
      <Exhibit slug={alleo.slug} x={alleo.x}>
        {(
          [
            [0, 0.65, 0, 1.1],
            [-0.85, 1.7, 0.3, 0.75],
            [0.9, 1.45, -0.2, 0.85],
            [0.15, 2.35, 0.25, 0.55],
          ] as const
        ).map(([px, py, pz, size], i) => (
          <mesh key={i} position={[px, py, pz]} rotation-y={i * 0.4}>
            <boxGeometry args={[size, size, size]} />
            <meshBasicMaterial color="#101013" wireframe />
          </mesh>
        ))}
      </Exhibit>
    </>
  )
}
