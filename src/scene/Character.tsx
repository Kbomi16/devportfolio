import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group, MathUtils } from 'three'
import { sample, type Clip } from './keyframes'
import { useProgress } from '../lib/progress'
import { chapterAt } from '../lib/motion'

/**
 * 캐릭터 스탠드인 마네킹.
 * GLB(bomi.glb)가 준비되면 이 컴포넌트 내부만 useGLTF + useAnimations로 교체한다 —
 * 위치·회전·clip 결정은 전부 keyframes.sample()이 담당하므로 인터페이스는 동일.
 */

const CLIPS: Clip[] = ['Run', 'Pose', 'Walk', 'Idle', 'Jump']
const JUMP_MS = 700

const isClose = () => chapterAt(useProgress.getState().p) === 'close'

export default function Character() {
  const root = useRef<Group>(null!)
  const body = useRef<Group>(null!)
  const head = useRef<Group>(null!)
  const armL = useRef<Group>(null!)
  const armR = useRef<Group>(null!)
  const legL = useRef<Group>(null!)
  const legR = useRef<Group>(null!)
  const weights = useRef<Record<Clip, number>>({ Run: 1, Pose: 0, Walk: 0, Idle: 0, Jump: 0 })

  const handleClick = () => {
    if (isClose()) useProgress.getState().triggerJump()
  }

  const handlePointerOver = () => {
    if (isClose()) document.body.style.cursor = 'pointer'
  }

  const handlePointerOut = () => {
    document.body.style.cursor = ''
  }

  useFrame((state, dt) => {
    const { p, jumpAt } = useProgress.getState()
    const s = sample(p)
    const t = state.clock.elapsedTime
    const w = weights.current

    // 클립 크로스페이드 (~0.3s)
    for (const clip of CLIPS) {
      w[clip] = MathUtils.damp(w[clip], clip === s.clip ? 1 : 0, 8, dt)
    }

    // 루트 이동·회전 (약한 damp — 스크롤 튐 흡수, 역재생 대응)
    const g = root.current
    g.position.x = MathUtils.damp(g.position.x, s.charPos[0], 6, dt)
    g.position.z = MathUtils.damp(g.position.z, s.charPos[2], 6, dt)
    g.rotation.y = MathUtils.damp(g.rotation.y, s.charRotY, 5, dt)

    // 절차 모션 파라미터 (클립 가중 합)
    const runPhase = Math.sin(t * 11)
    const walkPhase = Math.sin(t * 6.5)
    const swing = w.Run * runPhase * 0.85 + w.Walk * walkPhase * 0.5
    const breath = (w.Idle + w.Pose) * Math.sin(t * 2) * 0.012
    const bounce =
      w.Run * Math.abs(runPhase) * 0.07 + w.Walk * Math.abs(walkPhase) * 0.03 + breath

    // CH6 클릭 리액션: 1회 점프 포물선
    let jumpY = 0
    if (jumpAt > 0) {
      const jt = (performance.now() - jumpAt) / JUMP_MS
      if (jt < 1) jumpY = Math.sin(jt * Math.PI) * 0.55
    }

    g.position.y = s.charPos[1] + bounce + jumpY

    // 사지
    legL.current.rotation.x = swing
    legR.current.rotation.x = -swing
    armL.current.rotation.x = -swing * 0.9
    armR.current.rotation.x = swing * 0.9
    // Pose: 왼손 허리, 몸 무게중심 이동, 고개 살짝
    armL.current.rotation.z = w.Pose * 1.05
    body.current.rotation.z = w.Pose * 0.06
    body.current.rotation.x = w.Run * 0.18 + w.Walk * 0.06
    head.current.rotation.y = w.Pose * 0.2
    head.current.rotation.z = w.Pose * -0.08
  })

  return (
    <group
      ref={root}
      position={[0, 0, -40]}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {/* 몸통 */}
      <group ref={body} position={[0, 1.08, 0]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.27, 0.42, 6, 16]} />
          <meshStandardMaterial color="#dcd8d0" roughness={0.55} />
        </mesh>
      </group>
      {/* 머리 (치비 비율 — hip-vinyl 시안처럼 큼직하게) */}
      <group ref={head} position={[0, 1.66, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.31, 24, 20]} />
          <meshStandardMaterial color="#e8e4dc" roughness={0.45} />
        </mesh>
        {/* 헤어 캡 — 긴 머리 실루엣 */}
        <mesh position={[0, 0.06, -0.05]} castShadow>
          <sphereGeometry args={[0.325, 24, 20, 0, Math.PI * 2, 0, Math.PI * 0.62]} />
          <meshStandardMaterial color="#17171a" roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.18, -0.2]} castShadow>
          <capsuleGeometry args={[0.14, 0.34, 4, 10]} />
          <meshStandardMaterial color="#17171a" roughness={0.7} />
        </mesh>
      </group>
      {/* 팔 */}
      <group ref={armL} position={[-0.36, 1.32, 0]}>
        <mesh position={[0, -0.22, 0]} castShadow>
          <capsuleGeometry args={[0.07, 0.34, 4, 10]} />
          <meshStandardMaterial color="#dcd8d0" roughness={0.55} />
        </mesh>
      </group>
      <group ref={armR} position={[0.36, 1.32, 0]}>
        <mesh position={[0, -0.22, 0]} castShadow>
          <capsuleGeometry args={[0.07, 0.34, 4, 10]} />
          <meshStandardMaterial color="#dcd8d0" roughness={0.55} />
        </mesh>
      </group>
      {/* 다리 — 데님 톤 */}
      <group ref={legL} position={[-0.13, 0.82, 0]}>
        <mesh position={[0, -0.34, 0]} castShadow>
          <capsuleGeometry args={[0.09, 0.5, 4, 10]} />
          <meshStandardMaterial color="#23232a" roughness={0.65} />
        </mesh>
      </group>
      <group ref={legR} position={[0.13, 0.82, 0]}>
        <mesh position={[0, -0.34, 0]} castShadow>
          <capsuleGeometry args={[0.09, 0.5, 4, 10]} />
          <meshStandardMaterial color="#23232a" roughness={0.65} />
        </mesh>
      </group>
    </group>
  )
}
