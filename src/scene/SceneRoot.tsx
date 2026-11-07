import { lazy, Suspense, useEffect, useState, useSyncExternalStore } from 'react'
import { canRender3D } from '../lib/can3D'
import { getSceneSlotCount, subscribeSceneSlots } from '../lib/sceneBus'

const SceneCanvas = lazy(() => import('./SceneCanvas'))

/** 슬롯이 하나라도 등록되고 첫 렌더 후 1.2초가 지나면 Canvas 청크를 불러온다. 한 번 올라온 Canvas는 라우트가 바뀌어도 유지한다 */
export default function SceneRoot() {
  const [idle, setIdle] = useState(false)
  const [armed, setArmed] = useState(false)

  const slotCount = useSyncExternalStore(subscribeSceneSlots, getSceneSlotCount, () => 0)

  useEffect(() => {
    if (!canRender3D()) return
    const timer = window.setTimeout(() => setIdle(true), 1200)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (idle && slotCount > 0) setArmed(true)
  }, [idle, slotCount])

  if (!armed) return null

  return (
    <Suspense fallback={null}>
      <SceneCanvas />
    </Suspense>
  )
}
