import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrthographicCamera, useTexture } from '@react-three/drei'
import { Color, MathUtils, SRGBColorSpace, Vector2 } from 'three'
import { getScrollVelocity } from '../../lib/useLenis'
import { tokenColor } from '../palette'
import { DISTORT_FRAGMENT, DISTORT_VERTEX } from '../shaders/distort'
import type { HoverState } from '../types'

type DistortPlaneProps = {
  src: string
  fit: 'cover' | 'contain'
  hover: HoverState
  onReady: () => void
}

const CARD_RADIUS = 12

const imageSize = (image: unknown): Vector2 => {
  if (image instanceof HTMLImageElement) return new Vector2(image.naturalWidth || 1, image.naturalHeight || 1)
  if (image instanceof ImageBitmap) return new Vector2(image.width || 1, image.height || 1)
  return new Vector2(1, 1)
}

/** 직교 카메라 zoom 1 — 1 unit이 1px이고 plane이 View 크기와 같다. hover나 스크롤 속도가 있을 때만 시간을 흘린다 */
export default function DistortPlane({ src, fit, hover, onReady }: DistortPlaneProps) {
  const velocityRef = useRef(0)
  const readyRef = useRef(false)

  const texture = useTexture(src)
  const size = useThree((state) => state.size)

  const uniforms = useMemo(() => {
    texture.colorSpace = SRGBColorSpace
    return {
      uTex: { value: texture },
      uPlane: { value: new Vector2(1, 1) },
      uImage: { value: imageSize(texture.image) },
      uFit: { value: fit === 'contain' ? 1 : 0 },
      uBg: { value: new Color(tokenColor('--card-ground')) },
      uHover: { value: 0 },
      uVelocity: { value: 0 },
      uTime: { value: 0 },
      uRadius: { value: CARD_RADIUS },
    }
  }, [texture, fit])

  useFrame((state, delta) => {
    const target = MathUtils.clamp(getScrollVelocity() / 40, -1, 1)
    velocityRef.current = MathUtils.lerp(velocityRef.current, target, 0.12)
    uniforms.uVelocity.value = velocityRef.current
    uniforms.uHover.value = hover.value
    uniforms.uPlane.value.set(size.width, size.height)
    if (hover.value > 0.001 || Math.abs(velocityRef.current) > 0.002) {
      uniforms.uTime.value += delta
      state.invalidate()
    }
    if (!readyRef.current) {
      readyRef.current = true
      onReady()
    }
  })

  return (
    <>
      <OrthographicCamera makeDefault position={[0, 0, 10]} zoom={1} />
      <mesh>
        <planeGeometry args={[size.width, size.height, 24, 24]} />
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={DISTORT_VERTEX}
          fragmentShader={DISTORT_FRAGMENT}
          toneMapped={false}
          transparent
        />
      </mesh>
    </>
  )
}
