import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { canRender3D } from '../lib/can3D'
import { cn } from '../lib/cn'
import { registerSceneSlot } from '../lib/sceneBus'
import { useInView } from '../lib/useInView'
import type { DecorObject } from './types'

const SlotView = lazy(() => import('./SlotView'))

type SceneSlotProps = {
  object: DecorObject
  fallbackSrc: string
  className?: string
}

/** 3D가 가능하면 화면 안에 들어왔을 때만 View를 마운트한다. 불가능하면 WebP 폴백, 파일이 없으면 빈 자리 */
export default function SceneSlot({ object, fallbackSrc, className }: SceneSlotProps) {
  const [enabled] = useState(canRender3D)
  const [fallbackMissing, setFallbackMissing] = useState(false)

  const slotRef = useRef<HTMLDivElement>(null)

  const inView = useInView(slotRef)

  const handleFallbackError = () => setFallbackMissing(true)

  useEffect(() => {
    if (!enabled) return
    return registerSceneSlot()
  }, [enabled])

  return (
    <div ref={slotRef} className={cn('pointer-events-none', className)} aria-hidden>
      {enabled ? (
        inView ? (
          <Suspense fallback={null}>
            <SlotView object={object} />
          </Suspense>
        ) : null
      ) : fallbackMissing ? null : (
        <img
          src={fallbackSrc}
          alt=""
          loading="lazy"
          decoding="async"
          className="size-full object-contain"
          onError={handleFallbackError}
        />
      )}
    </div>
  )
}
