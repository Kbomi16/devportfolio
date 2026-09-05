import { gsap } from './gsapSetup'

/** 1회성 텍스트 리빌 — 요소별 ScrollTrigger, 등장 후 역스크롤에도 유지 */
export const revealOnce = (items: HTMLElement[]): void => {
  items.forEach((el) => {
    gsap.from(el, {
      y: 28,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    })
  })
}
