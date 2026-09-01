import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Color, Fog, MathUtils, type DirectionalLight } from 'three'
import { sample } from './keyframes'
import { useProgress } from '../lib/progress'

const DARK = new Color('#0a0a0b')
const LIGHT = new Color('#f4f2ed')
const DARK_INK = '#f2f0eb'
const LIGHT_INK = '#0a0a0b'

const bg = new Color()

/** 라이트·포그·바닥 + 지면 반전. 캔버스 배경과 HTML CSS 변수를 같은 ground 값으로 동기화한다. */
export default function Stage() {
  const keyRef = useRef<DirectionalLight>(null)
  const ambientRef = useRef<{ intensity: number } | null>(null)
  const lastInverted = useRef(false)

  const scene = useThree((st) => st.scene)

  useFrame(() => {
    if (!scene.fog) scene.fog = new Fog(DARK.clone(), 14, 70)
    const { p } = useProgress.getState()
    const s = sample(p)
    const g = s.ground

    // 캔버스 배경·포그
    bg.lerpColors(DARK, LIGHT, g)
    scene.background = bg
    ;(scene.fog as Fog).color.copy(bg)

    // HTML 지면 동기화 (오버레이 배경·잉크·헤어라인)
    const root = document.documentElement.style
    root.setProperty('--ground', `#${bg.getHexString()}`)
    const inverted = g > 0.5
    if (inverted !== lastInverted.current) {
      lastInverted.current = inverted
      root.setProperty('--ink', inverted ? LIGHT_INK : DARK_INK)
      root.setProperty(
        '--hairline',
        inverted ? 'rgba(10, 10, 11, 0.16)' : 'rgba(242, 240, 235, 0.14)',
      )
    }

    // 라이트: 화이트 무대에서는 앰비언트를 올리고 키를 낮춘다 + 캐릭터 추적
    if (ambientRef.current) ambientRef.current.intensity = MathUtils.lerp(0.35, 0.95, g)
    const key = keyRef.current
    if (key) {
      key.intensity = MathUtils.lerp(2.4, 1.7, g)
      key.position.set(s.charPos[0] + 3, 6.5, s.charPos[2] + 4)
      key.target.position.set(s.charPos[0], 0, s.charPos[2])
      key.target.updateMatrixWorld()
    }
  })

  return (
    <>
      <ambientLight ref={ambientRef as never} intensity={0.35} />
      <directionalLight
        ref={keyRef}
        castShadow
        intensity={2.4}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={1}
        shadow-camera-far={20}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
      />
      {/* 림라이트 — 캐릭터 실루엣 분리용, 그림자 없음 */}
      <directionalLight position={[-4, 3, -6]} intensity={0.9} />
      {/* 바닥: 그림자만 받는 투명 머티리얼 — 지면색과 완전히 융합된 무한 공간 */}
      <mesh rotation-x={-Math.PI / 2} position={[16, 0, -5]} receiveShadow>
        <planeGeometry args={[300, 140]} />
        <shadowMaterial transparent opacity={0.16} />
      </mesh>
    </>
  )
}
