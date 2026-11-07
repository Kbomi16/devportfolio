import { createContext, useContext, type MouseEvent } from 'react'

export type TransitionTarget = {
  to: string
  label: string
  /** 커튼이 화면을 다 덮은 직후, navigate 직전에 실행 */
  onCovered?: () => void
}

export type PageTransitionValue = {
  go: (target: TransitionTarget) => void
}

export const PageTransitionContext = createContext<PageTransitionValue | null>(null)

export const usePageTransition = (): PageTransitionValue => {
  const value = useContext(PageTransitionContext)
  if (!value) throw new Error('PageTransition Provider 밖에서 호출됨')
  return value
}

/** <Link onClick>용 — 수정 키 클릭(새 탭 등)은 브라우저 기본 동작에 맡긴다 */
export const useTransitionLink = (to: string, label: string) => {
  const { go } = usePageTransition()

  return (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return
    event.preventDefault()
    go({ to, label })
  }
}
