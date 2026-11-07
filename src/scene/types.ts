import type { WorkItem } from '../content/works'

export type HoverState = { value: number }

export type SceneObject =
  | { kind: 'hero' }
  | { kind: 'memo' }
  | { kind: 'cursor' }
  | { kind: 'contact' }
  | { kind: 'case'; slug: WorkItem['slug'] }
  | {
      kind: 'distort'
      src: string
      fit: 'cover' | 'contain'
      hover: HoverState
      onReady: () => void
    }

export type DecorObject = Exclude<SceneObject, { kind: 'distort' }>
