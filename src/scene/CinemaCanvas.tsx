import { Canvas } from '@react-three/fiber'
import { Suspense, useState, type ReactNode } from 'react'
import { prefersReducedMotion } from '../lib/motion'

function webglAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'))
  } catch {
    return false
  }
}

/**
 * 화면에 고정된 시네마 캔버스.
 * WebGL 불가·reduced-motion이면 렌더하지 않는다 — 오버레이는 HTML이라 그대로 읽힌다.
 */
export default function CinemaCanvas({ children }: { children: ReactNode }) {
  const [supported] = useState(() => webglAvailable() && !prefersReducedMotion())
  if (!supported) return null

  return (
    <div className="cinema-canvas" aria-hidden>
      <Canvas
        dpr={[1, 2]}
        shadows
        camera={{ fov: 38, near: 0.1, far: 150, position: [0, 1.5, 7] }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>{children}</Suspense>
      </Canvas>
    </div>
  )
}
