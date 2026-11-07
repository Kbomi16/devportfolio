import { useEffect, useRef, type MouseEvent } from 'react'
import { createPortal } from 'react-dom'
import { Flip, gsap, useGSAP } from '../../lib/gsapSetup'
import { prefersReducedMotion } from '../../lib/motion'
import { useFocusTrap } from '../../lib/useFocusTrap'
import { lockScroll, unlockScroll } from '../../lib/useLenis'

type FlipLightboxProps = {
  src: string
  alt: string
  caption?: string
  origin: HTMLElement | null
  onClose: () => void
}

/** 썸네일 자리에서 풀스크린으로 커지고, 닫으면 썸네일로 돌아가는 이미지 다이얼로그 */
export default function FlipLightbox({ src, alt, caption, origin, onClose }: FlipLightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const closingRef = useRef(false)
  const closeHandlerRef = useRef<() => void>(() => undefined)

  useFocusTrap(dialogRef)
  const { contextSafe } = useGSAP(
    (_context, safe) => {
      const image = imageRef.current
      gsap.from('[data-lightbox-backdrop]', { opacity: 0, duration: 0.35, ease: 'power2.out' })
      if (!image) return
      if (!origin || prefersReducedMotion()) {
        gsap.from(image, { opacity: 0, duration: 0.3 })
        return
      }

      const grow = () => {
        Flip.fit(image, origin, { scale: true })
        gsap.set(image, { autoAlpha: 1 })
        gsap.to(image, { x: 0, y: 0, scaleX: 1, scaleY: 1, duration: 0.7, ease: 'expo.out' })
      }

      if (image.complete && image.naturalWidth > 0) {
        grow()
        return
      }
      // 크기를 알기 전에는 Flip 계산이 틀어지므로 로드 뒤에 키운다
      gsap.set(image, { autoAlpha: 0 })
      const handleLoad = safe ? safe(grow) : grow
      image.addEventListener('load', handleLoad, { once: true })
      return () => image.removeEventListener('load', handleLoad)
    },
    { scope: dialogRef },
  )

  const handleClose = contextSafe(() => {
    if (closingRef.current) return
    closingRef.current = true
    const image = imageRef.current
    gsap.to('[data-lightbox-backdrop]', { opacity: 0, duration: 0.35 })
    gsap.to('[data-lightbox-chrome]', { opacity: 0, duration: 0.2 })
    if (!image || !origin || !origin.isConnected || prefersReducedMotion()) {
      gsap.to(image, { opacity: 0, duration: 0.25, onComplete: onClose })
      return
    }
    Flip.fit(image, origin, {
      scale: true,
      duration: 0.5,
      ease: 'power3.inOut',
      onComplete: onClose,
    })
  })
  closeHandlerRef.current = handleClose

  const handleBackdropClick = () => handleClose()

  const handleCloseClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    handleClose()
  }

  const handleImageClick = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation()
  }

  useEffect(() => {
    const opener = document.activeElement
    lockScroll('lightbox')
    closeRef.current?.focus({ preventScroll: true })

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeHandlerRef.current()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      unlockScroll('lightbox')
      if (opener instanceof HTMLElement) opener.focus({ preventScroll: true })
    }
  }, [])

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      className="fixed inset-0 z-[80] flex items-center justify-center p-[var(--pad)]"
      onClick={handleBackdropClick}
    >
      <div data-lightbox-backdrop className="absolute inset-0 bg-dark-ground/90" aria-hidden />
      <button
        ref={closeRef}
        data-lightbox-chrome
        type="button"
        className="absolute top-[var(--pad)] right-[var(--pad)] z-[1] font-ui text-[12px] tracking-[0.14em] text-dark-ink"
        onClick={handleCloseClick}
      >
        닫기
      </button>
      <figure
        className="relative z-[1] flex max-h-full flex-col items-center gap-3"
        onClick={handleImageClick}
      >
        <img
          ref={imageRef}
          src={src}
          alt={alt}
          className="max-h-[82vh] max-w-[min(92vw,1100px)] object-contain will-change-transform motion-reduce:will-change-auto"
          decoding="async"
        />
        {caption ? (
          <figcaption
            data-lightbox-chrome
            className="max-w-[60ch] text-center text-[13px] leading-[1.6] text-dark-ink/70"
          >
            {caption}
          </figcaption>
        ) : null}
      </figure>
    </div>,
    document.body,
  )
}
