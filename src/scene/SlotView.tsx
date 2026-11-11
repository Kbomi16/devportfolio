import { Suspense, useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { View } from '@react-three/drei'
import type { DecorObject, SceneObject } from './types'
import Stage from './Stage'
import HeroObjects from './objects/HeroObjects'
import WorkflowObject from './objects/WorkflowObject'
import ContactObjects from './objects/ContactObjects'
import CaseObject from './objects/CaseObject'
import DistortPlane from './objects/DistortPlane'

type SlotViewProps = {
  object: SceneObject
}

/** DOM 슬롯 안에 View를 렌더한다. 내용은 Canvas의 View.Port로 터널링된다 */
export default function SlotView({ object }: SlotViewProps) {
  return (
    <View className="absolute inset-0">
      <Suspense fallback={null}>
        {object.kind === 'distort' ? (
          <DistortPlane src={object.src} fit={object.fit} hover={object.hover} onReady={object.onReady} />
        ) : (
          <Stage fov={object.kind === 'hero' ? 52 : 30} shadow={object.kind !== 'hero'}>
            <DecorMesh object={object} />
          </Stage>
        )}
        <InvalidateOnMount />
      </Suspense>
    </View>
  )
}

/** demand 프레임루프라 마운트·언마운트 때 한 프레임을 직접 요청한다. 언마운트 후 남은 픽셀을 지운다 */
function InvalidateOnMount() {
  const invalidate = useThree((state) => state.invalidate)

  useEffect(() => {
    invalidate()
    return () => invalidate()
  }, [invalidate])

  return null
}

function DecorMesh({ object }: { object: DecorObject }) {
  if (object.kind === 'hero') return <HeroObjects />
  if (object.kind === 'memo') return <WorkflowObject variant="memo" />
  if (object.kind === 'cursor') return <WorkflowObject variant="cursor" />
  if (object.kind === 'contact') return <ContactObjects />
  return <CaseObject slug={object.slug} />
}
