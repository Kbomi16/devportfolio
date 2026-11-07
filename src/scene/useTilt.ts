import type { RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { MathUtils, type Group } from 'three'
import { getPointer } from '../lib/usePointer'

/** 마우스에 따른 기울기를 lerp하고, 수렴할 때까지만 invalidate한다 */
export const useTilt = (ref: RefObject<Group | null>, amount = 0.35): void => {
  useFrame((state) => {
    const group = ref.current
    if (!group) return
    const { x, y } = getPointer()
    const targetX = y * amount
    const targetY = x * amount
    group.rotation.x = MathUtils.lerp(group.rotation.x, targetX, 0.08)
    group.rotation.y = MathUtils.lerp(group.rotation.y, targetY, 0.08)
    if (Math.abs(group.rotation.x - targetX) > 0.0005 || Math.abs(group.rotation.y - targetY) > 0.0005) {
      state.invalidate()
    }
  })
}
