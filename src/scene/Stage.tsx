import type { ReactNode } from 'react'
import { ContactShadows, Environment, Lightformer, PerspectiveCamera } from '@react-three/drei'

type StageProps = {
  children: ReactNode
  fov?: number
  shadow?: boolean
  ring?: [number, number, number]
}

/** 카메라·조명·소프트 그림자. 외부 HDR 없이 Lightformer 환경광만 쓴다 */
export default function Stage({ children, fov = 30, shadow = true, ring = [-3, 0, 2] }: StageProps) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 7]} fov={fov} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 5, 4]} intensity={1.4} />
      <Environment resolution={128}>
        <Lightformer form="rect" intensity={2} position={[0, 3, 2]} scale={[6, 2, 1]} />
        <Lightformer form="ring" intensity={1.2} position={ring} scale={2} />
        <Lightformer form="rect" intensity={0.8} position={[3, -1, 1]} scale={[2, 4, 1]} />
      </Environment>
      {children}
      {shadow ? (
        <ContactShadows position={[0, -1.25, 0]} opacity={0.32} blur={2.6} scale={6} far={2.4} resolution={256} />
      ) : null}
    </>
  )
}
