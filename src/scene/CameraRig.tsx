import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MathUtils, Vector3 } from 'three'
import { sample, EXHIBITS } from './keyframes'
import { useProgress } from '../lib/progress'
import { chapterAt } from '../lib/motion'

const look = new Vector3()

export default function CameraRig() {
  const lookTarget = useRef(new Vector3(0, 1.3, -10))
  const mouse = useRef({ x: 0, y: 0 })
  const pushT = useRef(0) // 전시물 푸시인 블렌드 0~1

  useFrame((state, dt) => {
    const { p, pendingSlug } = useProgress.getState()
    const s = sample(p)

    // CH1 마우스 패럴랙스 (감도 낮게, 포털에서만)
    const isPortal = chapterAt(p) === 'portal'
    mouse.current.x = MathUtils.damp(mouse.current.x, isPortal ? state.pointer.x : 0, 3, dt)
    mouse.current.y = MathUtils.damp(mouse.current.y, isPortal ? state.pointer.y : 0, 3, dt)

    let targetPos: [number, number, number] = [
      s.camPos[0] + mouse.current.x * 0.3,
      s.camPos[1] + mouse.current.y * 0.18,
      s.camPos[2],
    ]
    let targetLook: [number, number, number] = s.camLook

    // 전시물 클릭 → 0.6s 푸시인 (스크롤 잠금은 Home에서 처리)
    const exhibit = pendingSlug ? EXHIBITS.find((e) => e.slug === pendingSlug) : undefined
    pushT.current = MathUtils.damp(pushT.current, exhibit ? 1 : 0, 6, dt)
    if (exhibit && pushT.current > 0.001) {
      const px = exhibit.x
      targetPos = [
        MathUtils.lerp(targetPos[0], px, pushT.current),
        MathUtils.lerp(targetPos[1], 1.3, pushT.current),
        MathUtils.lerp(targetPos[2], 1.6, pushT.current),
      ]
      targetLook = [px, 1.1, -3]
    }

    const cam = state.camera
    cam.position.x = MathUtils.damp(cam.position.x, targetPos[0], 4, dt)
    cam.position.y = MathUtils.damp(cam.position.y, targetPos[1], 4, dt)
    cam.position.z = MathUtils.damp(cam.position.z, targetPos[2], 4, dt)

    const lt = lookTarget.current
    lt.x = MathUtils.damp(lt.x, targetLook[0], 4, dt)
    lt.y = MathUtils.damp(lt.y, targetLook[1], 4, dt)
    lt.z = MathUtils.damp(lt.z, targetLook[2], 4, dt)
    cam.lookAt(look.copy(lt))
  })

  return null
}
