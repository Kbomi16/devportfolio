import { useEffect } from 'react'
import GalleryFan from './gallery/GalleryFan'
import GalleryRail from './gallery/GalleryRail'
import { ScrollTrigger } from '../lib/gsapSetup'
import { MEDIA } from '../lib/media'
import { useMediaQuery } from '../lib/useMediaQuery'

type GalleryProps = {
  onOpenWork: (slug: string) => void
}

/** PROJECTS — 데스크톱은 수평 Rail, 모바일은 부채꼴 Fan */
export default function Gallery({ onOpenWork }: GalleryProps) {
  const isDesktop = useMediaQuery(MEDIA.desktop)

  // Rail↔Fan 교체 뒤 생성 순서가 바뀐 트리거를 문서 순서로 다시 계산
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      ScrollTrigger.sort()
      ScrollTrigger.refresh()
    })
    return () => cancelAnimationFrame(raf)
  }, [isDesktop])

  return isDesktop ? (
    <GalleryRail onOpenWork={onOpenWork} />
  ) : (
    <GalleryFan onOpenWork={onOpenWork} />
  )
}
