type Listener = () => void

let invalidator: (() => void) | null = null
let slotCount = 0
const slotListeners = new Set<Listener>()

export const setSceneInvalidator = (fn: (() => void) | null): void => {
  invalidator = fn
}

export const invalidateScene = (): void => {
  invalidator?.()
}

export const registerSceneSlot = (): (() => void) => {
  slotCount += 1
  slotListeners.forEach((listener) => listener())
  return () => {
    slotCount -= 1
    slotListeners.forEach((listener) => listener())
  }
}

export const subscribeSceneSlots = (listener: Listener): (() => void) => {
  slotListeners.add(listener)
  return () => {
    slotListeners.delete(listener)
  }
}

export const getSceneSlotCount = (): number => slotCount
