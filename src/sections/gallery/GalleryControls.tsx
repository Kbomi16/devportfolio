import Label from '../../components/common/Label'
import MagneticButton from '../../components/common/MagneticButton'

type GalleryControlsProps = {
  active: number
  total: number
  title: string
  onPrev: () => void
  onNext: () => void
}

export default function GalleryControls({ active, total, title, onPrev, onNext }: GalleryControlsProps) {
  return (
    <div className="relative z-20 mx-auto mt-8 flex w-full max-w-[1200px] flex-col items-center gap-4 md:mt-6">
      <p className="mx-auto max-w-[min(100%,28rem)] text-center" aria-live="polite">
        <Label className="text-muted">{`0${active + 1} / 0${total}`}</Label>
        <span className="mt-1 block font-kr text-[15px] font-semibold">{title}</span>
      </p>
      <div className="flex gap-2">
        <MagneticButton
          aria-label="이전 프로젝트"
          className="grid size-10 place-items-center rounded-lg !border !border-light-ink/15 !bg-light-ink/[0.06] !font-ui !text-[18px] transition-colors hover:!border-neon hover:!bg-neon"
          strength={0.22}
          onClick={onPrev}
        >
          ‹
        </MagneticButton>
        <MagneticButton
          aria-label="다음 프로젝트"
          className="grid size-10 place-items-center rounded-lg !border !border-light-ink/15 !bg-light-ink/[0.06] !font-ui !text-[18px] transition-colors hover:!border-neon hover:!bg-neon"
          strength={0.22}
          onClick={onNext}
        >
          ›
        </MagneticButton>
      </div>
    </div>
  )
}
