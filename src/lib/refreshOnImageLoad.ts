import { ScrollTrigger } from './gsapSetup'

/** root 안 미완료 이미지가 로드될 때마다 ScrollTrigger.refresh (120ms debounce) */
export const refreshOnImageLoad = (root: ParentNode): (() => void) => {
  let timer = 0

  const handleLoad = () => {
    window.clearTimeout(timer)
    timer = window.setTimeout(() => ScrollTrigger.refresh(), 120)
  }

  const pending = Array.from(root.querySelectorAll('img')).filter((img) => !img.complete)
  pending.forEach((img) => img.addEventListener('load', handleLoad, { once: true }))

  return () => {
    window.clearTimeout(timer)
    pending.forEach((img) => img.removeEventListener('load', handleLoad))
  }
}
