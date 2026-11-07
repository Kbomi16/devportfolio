import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { canRender3D } from '../lib/can3D'
import { cn } from '../lib/cn'
import { registerSceneSlot } from '../lib/sceneBus'
import { useInView } from '../lib/useInView'
import type { HoverState } from './types'

const SlotView = lazy(() => import('./SlotView'))

type DistortImageSlotProps = {
  src: string
  alt: string
  fit: 'cover' | 'contain'
  hover: HoverState
  className?: string
  loading?: 'eager' | 'lazy'
}

/** DOM 이미지는 항상 렌더한다(alt·레이아웃·폴백). WebGL plane이 준비되면 DOM 이미지만 투명하게 만든다 */
export default function DistortImageSlot({ src, alt, fit, hover, className, loading = 'lazy' }: DistortImageSlotProps) {
  const [enabled] = useState(canRender3D)
  const [ready, setReady] = useState(false)

  const slotRef = useRef<HTMLSpanElement>(null)

  const inView = useInView(slotRef, '10% 30%')

  const handleReady = useCallback(() => setReady(true), [])

  useEffect(() => {
    if (!enabled) return
    return registerSceneSlot()
  }, [enabled])

  useEffect(() => {
    if (!inView) setReady(false)
  }, [inView])

  return (
    <span ref={slotRef} className={cn('relative block overflow-hidden', className)}>
      <img
        src={src}
        alt={alt}
        loading={loading}
        decoding="async"
        draggable={false}
        className={cn('size-full', fit === 'cover' ? 'object-cover' : 'object-contain', ready && 'opacity-0')}
      />
      {enabled && inView ? (
        <Suspense fallback={null}>
          <SlotView object={{ kind: 'distort', src, fit, hover, onReady: handleReady }} />
        </Suspense>
      ) : null}
    </span>
  )
}
