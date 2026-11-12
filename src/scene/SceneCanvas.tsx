import { useEffect } from 'react'
import { Canvas, useFrame, useThree, type RootState } from '@react-three/fiber'
import { View } from '@react-three/drei'
import { invalidateScene, setSceneInvalidator } from '../lib/sceneBus'
import { onScroll } from '../lib/useLenis'

/** 고정 풀스크린 Canvas 하나. 섹션 위, Nav(20)·커서(50)·라이트박스(80)·커튼(90)·프리로더(100) 아래 */
export default function SceneCanvas() {
  const handleCreated = (state: RootState) => {
    setSceneInvalidator(state.invalidate)
  }

  useEffect(() => {
    const offScroll = onScroll(() => invalidateScene())
    const handleResize = () => invalidateScene()
    window.addEventListener('resize', handleResize)
    return () => {
      offScroll()
      window.removeEventListener('resize', handleResize)
      setSceneInvalidator(null)
    }
  }, [])

  return (
    <Canvas
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 15 }}
      eventSource={document.getElementById('root') ?? undefined}
      eventPrefix="client"
      dpr={[1, 1.5]}
      frameloop="demand"
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onCreated={handleCreated}
    >
      <ClearFrame />
      <View.Port />
    </Canvas>
  )
}

/** 화면 밖으로 나간 View는 이전 픽셀을 지우지 않는다. 그리기 전에 버퍼를 비운다 */
function ClearFrame() {
  const gl = useThree((state) => state.gl)

  useFrame(() => {
    gl.setScissorTest(false)
    gl.clear(true, true)
  }, -1)

  return null
}
