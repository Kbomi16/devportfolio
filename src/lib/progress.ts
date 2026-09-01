import { create } from 'zustand'

type ProgressState = {
  /** 전체 스크롤 진행도 0~1 */
  p: number
  /** CH3 전시물 클릭 → 케이스 페이지 전환 중인 slug (푸시인·페이드 트리거) */
  pendingSlug: string | null
  /** CH6 캐릭터 클릭 리액션 타임스탬프 (ms) */
  jumpAt: number
  setP: (v: number) => void
  setPendingSlug: (slug: string | null) => void
  triggerJump: () => void
}

export const useProgress = create<ProgressState>((set) => ({
  p: 0,
  pendingSlug: null,
  jumpAt: 0,
  setP: (v) => set({ p: v }),
  setPendingSlug: (slug) => set({ pendingSlug: slug }),
  triggerJump: () => set({ jumpAt: performance.now() }),
}))
