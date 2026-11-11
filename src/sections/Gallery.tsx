import Display from '../components/common/Display'
import Label from '../components/common/Label'
import { WORKS, type WorkItem } from '../content/works'
import { cn } from '../lib/cn'
import { ground } from '../lib/ground'
import GalleryHeader from './gallery/GalleryHeader'

type GalleryProps = {
  onOpenWork: (slug: string) => void
}

const coverOf = (work: WorkItem) => work.entries?.[0]?.image ?? work.thumb

/** PROJECTS — 01부터 같은 행. 호버 이미지는 행 위로 겹친다. */
export default function Gallery({ onOpenWork }: GalleryProps) {
  return (
    <section
      className={cn(ground.light, 'relative px-[var(--pad)] pt-[calc(var(--nav-h)+22px)] pb-[12vh]')}
      id="work"
    >
      <div className="mx-auto w-full max-w-[1200px]">
        <GalleryHeader />
        <ul className="mt-8 list-none" aria-label="프로젝트">
          {WORKS.map((work, index) => (
            <WorkRow key={work.slug} work={work} index={index} onOpen={onOpenWork} />
          ))}
        </ul>
      </div>
    </section>
  )
}

function WorkRow({
  work,
  index,
  onOpen,
}: {
  work: WorkItem
  index: number
  onOpen: (slug: string) => void
}) {
  const cover = coverOf(work)

  const handleClick = () => onOpen(work.slug)

  return (
    <li className="relative border-t border-hairline last:border-b hover:z-20 focus-within:z-20">
      <button
        type="button"
        data-cursor="open"
        aria-label={`${work.title} 케이스 스터디 열기`}
        className="group grid w-full grid-cols-[auto_1fr] items-center gap-4 py-5 text-left"
        onClick={handleClick}
      >
        <Label className="text-muted">{`0${index + 1}`}</Label>
        <span className="min-w-0">
          <span className="flex flex-wrap items-center gap-2">
            <Display className="text-[clamp(18px,2vw,28px)]">{work.label}</Display>
            {work.labelEyebrow ? <Label className="text-muted">{work.labelEyebrow}</Label> : null}
            {work.status ? (
              <Label className="rounded-full bg-neon px-2 py-0.5 text-dark-ground">{work.status}</Label>
            ) : null}
          </span>
          <Label className="mt-1 block text-muted">{work.homeLine}</Label>
        </span>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 z-10 hidden w-[min(46vw,380px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-lg opacity-0 shadow-[0_22px_50px_rgba(0,0,0,0.22)] transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 md:block motion-reduce:transition-none"
        >
          <img
            src={cover.src}
            alt=""
            className="aspect-[4/3] w-full bg-card-ground object-cover object-top"
            loading="lazy"
            decoding="async"
            draggable={false}
          />
        </span>
      </button>
    </li>
  )
}
