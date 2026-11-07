import {
  Fragment,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Display from '../components/common/Display'
import FlipLightbox from '../components/common/FlipLightbox'
import Hairline from '../components/common/Hairline'
import Label from '../components/common/Label'
import Pill from '../components/common/Pill'
import { EMAIL, MAILTO } from '../content/contact'
import {
  WORKS,
  workBySlug,
  type WorkDecision,
  type WorkEntry,
  type WorkItem,
  type WorkShot,
  type WorkStat,
} from '../content/works'
import { cn } from '../lib/cn'
import { gsap, SplitText, useGSAP } from '../lib/gsapSetup'
import { matchMediaPreset, MEDIA } from '../lib/media'
import { outboundLinkProps } from '../lib/outboundLink'
import { useTransitionLink } from '../lib/pageTransition'
import { refreshOnImageLoad } from '../lib/refreshOnImageLoad'
import { revealOnce } from '../lib/reveal'
import { useMagneticFollow } from '../lib/useMagneticFollow'
import { useMediaQuery } from '../lib/useMediaQuery'
import { scrollToY } from '../lib/useLenis'
import SceneSlot from '../scene/SceneSlot'

type OpenShot = { shot: WorkShot; origin: HTMLImageElement }

const DECISION_STEPS = [
  { key: 'problem', label: '문제' },
  { key: 'choice', label: '선택' },
  { key: 'result', label: '결과' },
] as const

/** /work/:slug — 케이스가 바뀌면 SplitText·카운트업이 만진 DOM까지 새로 그리도록 slug로 다시 마운트한다 */
export default function Work() {
  const { slug } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (!workBySlug(slug)) navigate('/', { replace: true })
  }, [slug, navigate])

  const work = workBySlug(slug)
  if (!work) return null

  return <WorkCase key={work.slug} work={work} />
}

/** 읽기 우선 케이스 스터디 */
function WorkCase({ work }: { work: WorkItem }) {
  const [lightbox, setLightbox] = useState<OpenShot | null>(null)

  const pageRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const cleanupImages = pageRef.current ? refreshOnImageLoad(pageRef.current) : undefined
      const mm = matchMediaPreset(({ motion, desktop }) => {
        if (!motion) return

        gsap.from('[data-work-nav]', { y: -16, opacity: 0, duration: 0.55, ease: 'power2.out' })
        SplitText.create('[data-work-title]', {
          type: 'lines',
          mask: 'lines',
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 100,
              duration: 0.9,
              stagger: 0.08,
              ease: 'expo.out',
              delay: 0.15,
            }),
        })
        gsap.from('[data-oneliner-line]', {
          yPercent: 100,
          duration: 0.8,
          stagger: 0.08,
          ease: 'expo.out',
          delay: 0.35,
        })
        gsap.from('[data-stack-item]', {
          y: 12,
          opacity: 0,
          duration: 0.5,
          stagger: 0.04,
          ease: 'power3.out',
          delay: 0.5,
        })
        gsap.from('[data-work-thumb]', { scale: 1.15, duration: 1.4, ease: 'expo.out' })
        gsap.fromTo(
          '[data-thumb-parallax]',
          { yPercent: -4, scale: 1.1 },
          {
            yPercent: 4,
            scale: 1.1,
            ease: 'none',
            scrollTrigger: {
              trigger: '[data-thumb-parallax]',
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        )
        revealOnce(gsap.utils.toArray<HTMLElement>('[data-rv]'))

        const restoreStats: (() => void)[] = []
        gsap.utils.toArray<HTMLElement>('[data-stat]').forEach((stat, index) => {
          const valueEl = stat.querySelector<HTMLElement>('[data-stat-value]')
          const raw = valueEl?.dataset.statValue ?? ''
          gsap.from(stat, {
            y: 24,
            opacity: 0,
            duration: 0.7,
            delay: index * 0.1,
            ease: 'power3.out',
            scrollTrigger: { trigger: stat, start: 'top 88%', once: true },
          })
          if (!valueEl || !/^\d+$/.test(raw)) return
          const counter = { value: 0 }
          valueEl.textContent = '0'
          restoreStats.push(() => {
            valueEl.textContent = raw
          })
          gsap.to(counter, {
            value: Number(raw),
            duration: 1.4,
            ease: 'power3.out',
            scrollTrigger: { trigger: stat, start: 'top 88%', once: true },
            onUpdate: () => {
              valueEl.textContent = String(Math.round(counter.value))
            },
          })
        })

        gsap.utils.toArray<HTMLElement>('[data-step]').forEach((step) => {
          gsap.fromTo(
            step,
            { opacity: 0.22 },
            {
              opacity: 1,
              ease: 'none',
              scrollTrigger: { trigger: step, start: 'top 78%', end: 'top 48%', scrub: true },
            },
          )
        })

        gsap.utils.toArray<HTMLElement>('[data-shot="wide"]').forEach((shot) => {
          gsap.fromTo(
            shot,
            { clipPath: 'inset(0 14% 0 14% round 16px)' },
            {
              clipPath: 'inset(0 0% 0 0% round 16px)',
              ease: 'none',
              scrollTrigger: { trigger: shot, start: 'top 92%', end: 'top 50%', scrub: true },
            },
          )
        })

        if (desktop) {
          gsap.utils.toArray<HTMLElement>('[data-shot="normal"]').forEach((shot, index) => {
            const offset = index % 2 === 0 ? 28 : -28
            gsap.fromTo(
              shot,
              { y: offset },
              {
                y: -offset,
                ease: 'none',
                scrollTrigger: { trigger: shot, start: 'top bottom', end: 'bottom top', scrub: true },
              },
            )
          })
        }

        return () => {
          restoreStats.forEach((restore) => restore())
        }
      })
      return () => {
        mm.revert()
        cleanupImages?.()
      }
    },
    { scope: pageRef },
  )

  const handleOpenShot = (shot: WorkShot, origin: HTMLImageElement) => {
    setLightbox({ shot, origin })
  }

  const handleCloseShot = () => {
    setLightbox(null)
  }

  useLayoutEffect(() => {
    scrollToY(0)
  }, [])

  const index = WORKS.findIndex((item) => item.slug === work.slug)
  const prevIndex = (index - 1 + WORKS.length) % WORKS.length
  const nextIndex = (index + 1) % WORKS.length

  return (
    <div
      ref={pageRef}
      className="relative z-[2] min-h-screen bg-light-ground pt-[var(--nav-h)] text-light-ink [--hairline:var(--hairline-on-light)]"
    >
      <header
        data-work-nav
        className="fixed inset-x-0 top-0 z-20 flex h-[var(--nav-h)] items-center justify-between border-b border-hairline bg-white/90 px-[var(--pad)] backdrop-blur-sm"
      >
        <TransitionLabelLink
          className="text-[12.5px] tracking-[0.13em] hover:underline hover:underline-offset-4"
          to="/"
          label="KIM BOMI"
        >
          ← 홈
        </TransitionLabelLink>
        <Label className="text-[12.5px] tracking-[0.13em]">{`0${index + 1} / 0${WORKS.length}`}</Label>
      </header>

      <div className="bg-white">
        <article
          className={cn(
            'mx-auto max-w-[1100px] px-[var(--pad)] pt-[calc(var(--nav-h)+clamp(28px,5vh,48px))]',
            work.entries ? 'pb-0' : 'pb-8',
          )}
        >
          <div className="max-w-[1100px]">
            <div data-rv className="flex flex-wrap items-center gap-3">
              <Label className="text-muted">{work.period}</Label>
              {work.status ? (
                <Label className="rounded-full bg-neon px-2.5 py-1 text-dark-ground">
                  {work.status}
                </Label>
              ) : null}
            </div>
            <WorkTitleMark work={work} />
          </div>

          {work.stats ? (
            <div className="max-w-[720px]">
              <Stats stats={work.stats} />
            </div>
          ) : null}

          <Decisions
            decisions={work.decisions}
            suppressTopRule={!work.stats}
            onOpenShot={handleOpenShot}
          />
        </article>
      </div>

      {work.entries ? <Entries entries={work.entries} /> : null}

      <WorkPager
        prev={WORKS[prevIndex]}
        next={WORKS[nextIndex]}
        prevIndex={prevIndex}
        nextIndex={nextIndex}
      />

      {lightbox ? (
        <FlipLightbox
          src={lightbox.shot.src}
          alt={lightbox.shot.alt}
          caption={lightbox.shot.caption}
          origin={lightbox.origin}
          onClose={handleCloseShot}
        />
      ) : null}
    </div>
  )
}

type TransitionLabelLinkProps = {
  to: string
  label: string
  className?: string
  children: ReactNode
}

function TransitionLabelLink({ to, label, className, children }: TransitionLabelLinkProps) {
  const handleClick = useTransitionLink(to, label)

  return (
    <Label as={Link} className={className} to={to} onClick={handleClick}>
      {children}
    </Label>
  )
}

function Decisions({
  decisions,
  suppressTopRule,
  onOpenShot,
}: {
  decisions: WorkDecision[]
  suppressTopRule?: boolean
  onOpenShot: (shot: WorkShot, origin: HTMLImageElement) => void
}) {
  return (
    <>
      {decisions.map((item, index) => (
        <Hairline
          as="section"
          key={item.title}
          className={cn('grid gap-8 py-10', index === 0 && suppressTopRule && 'border-t-0')}
        >
          <div className="grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-12">
            <h2 className="font-kr text-[18px] font-bold tracking-[-0.02em] lg:sticky lg:top-[calc(var(--nav-h)+32px)] lg:self-start lg:text-[clamp(20px,2vw,26px)]">
              {item.title}
            </h2>
            <div className="grid gap-8">
              {DECISION_STEPS.map((step) => (
                <div key={step.key} data-step>
                  <Label className="text-muted">{step.label}</Label>
                  <p
                    className={cn(
                      'mt-2 text-[15px] leading-[1.75]',
                      step.key === 'result' && 'font-bold',
                    )}
                  >
                    {item[step.key]}
                  </p>
                </div>
              ))}
            </div>
          </div>
          {item.shots?.length ? <DecisionShots shots={item.shots} onOpenShot={onOpenShot} /> : null}
        </Hairline>
      ))}
    </>
  )
}

function WorkTitleMark({ work }: { work: WorkItem }) {
  return (
    <div data-work-hero className="relative mt-5 sm:mt-6">
      <div className="relative z-[2] min-w-0 max-w-[56rem]">
        <Label data-rv className="block text-muted">
          {work.label}
        </Label>
        <Display
          as="h1"
          data-work-title
          className="mt-2 font-kr text-[clamp(28px,4.6vw,52px)] leading-[1.14] font-extrabold tracking-[-0.03em]"
        >
          {work.title}
        </Display>
        <div className="mt-4 max-w-[56rem] text-[clamp(17px,1.8vw,21px)] leading-normal font-semibold">
          {work.oneLiner.split('\n').map((line, index) => (
            <span key={index} className="block overflow-hidden">
              <span data-oneliner-line className="block md:whitespace-nowrap">
                {line}
              </span>
            </span>
          ))}
        </div>
        <p data-rv className="mt-3 text-[15px] leading-[1.7] text-ink-2">
          {work.role}
        </p>
        <Label
          className={cn(
            'mt-4 max-w-[46rem] text-muted',
            !(work.links.length > 0 && !work.entries) && 'mb-8',
          )}
        >
          {work.stack.map((item, index) => (
            <Fragment key={item}>
              {index > 0 ? ' · ' : null}
              <span data-stack-item className="inline-block">
                {item}
              </span>
            </Fragment>
          ))}
        </Label>
        {work.links.length > 0 && !work.entries ? (
          <div data-rv className="mb-8 mt-5 flex flex-wrap items-center gap-3">
            {work.links.map((link) => (
              <Pill
                key={link.url}
                className="border-hairline-on-light hover:border-light-ink"
                href={link.url}
                target="_blank"
                {...outboundLinkProps(link.url)}
              >
                {link.label} ↗
              </Pill>
            ))}
            {work.testAccount ? (
              <span className="inline-flex max-w-full flex-wrap items-baseline gap-x-2 gap-y-1 rounded-full border border-hairline px-[18px] py-3">
                <Label className="shrink-0">테스트 계정</Label>
                <span className="text-[13px] leading-snug tabular-nums text-ink-2">
                  {work.testAccount.email} / {work.testAccount.password}
                </span>
              </span>
            ) : null}
          </div>
        ) : null}
      </div>
      <figure className="relative mt-8 overflow-hidden rounded-2xl border border-hairline bg-card-ground">
        <div data-thumb-parallax className="will-change-transform motion-reduce:will-change-auto">
          <img
            data-work-thumb
            src={work.thumb.src}
            alt={work.thumb.alt}
            className="aspect-[8/5] w-full object-cover object-top"
            decoding="async"
          />
        </div>
        <SceneSlot
          key={work.slug}
          object={{ kind: 'case', slug: work.slug }}
          fallbackSrc={`/images/3d/case-${work.slug}.webp`}
          className="absolute top-4 right-4 size-[clamp(88px,10vw,140px)]"
        />
      </figure>
    </div>
  )
}

function Stats({ stats }: { stats: WorkStat[] }) {
  return (
    <ul className="mb-4 grid list-none grid-cols-3 gap-x-4 gap-y-6 border-t border-hairline pt-6 max-sm:grid-cols-1">
      {stats.map((stat) => (
        <li key={stat.label} data-stat>
          <Display
            data-stat-value={stat.value}
            className="text-[clamp(28px,4vw,40px)] tabular-nums"
            aria-hidden
          >
            {stat.value}
          </Display>
          <span className="sr-only">{stat.value}</span>
          <Label className="mt-2 text-muted">{stat.label}</Label>
        </li>
      ))}
    </ul>
  )
}

function WorkPager({
  prev,
  next,
  prevIndex,
  nextIndex,
}: {
  prev: WorkItem
  next: WorkItem
  prevIndex: number
  nextIndex: number
}) {
  return (
    <footer className="mt-[4vh] px-[var(--pad)] pb-10">
      <Label data-rv className="text-muted">
        다른 케이스
      </Label>
      <div
        data-rv
        className="mt-5 grid grid-cols-2 border-t border-hairline max-md:grid-cols-1"
      >
        <PagerCard work={prev} index={prevIndex} direction="prev" />
        <PagerCard work={next} index={nextIndex} direction="next" />
      </div>
      <Hairline className="mt-2 flex items-center justify-between py-5">
        <TransitionLabelLink
          className="hover:underline hover:underline-offset-4"
          to="/"
          label="PROJECTS"
        >
          ← PROJECTS
        </TransitionLabelLink>
        <Pill
          className="border-hairline-on-light hover:border-light-ink"
          href={MAILTO}
        >
          {EMAIL}
        </Pill>
      </Hairline>
    </footer>
  )
}

type PagerCardProps = {
  work: WorkItem
  index: number
  direction: 'prev' | 'next'
}

function PagerCard({ work, index, direction }: PagerCardProps) {
  const { zoneRef, targetRef, innerRef } = useMagneticFollow<HTMLAnchorElement>(0.06, 0.12)
  const handleClick = useTransitionLink(`/work/${work.slug}`, work.label)

  const isNext = direction === 'next'

  return (
    <div
      ref={zoneRef}
      className={isNext ? 'border-l border-hairline max-md:border-t max-md:border-l-0' : undefined}
    >
      <Link
        ref={targetRef}
        data-cursor="open"
        aria-label={`${isNext ? '다음' : '이전'} 케이스 ${work.title}`}
        className={cn(
          'group block py-10 will-change-transform motion-reduce:will-change-auto',
          isNext ? 'pl-8 max-md:pl-0' : 'pr-8 max-md:pr-0',
        )}
        to={`/work/${work.slug}`}
        onClick={handleClick}
      >
        <span
          ref={innerRef}
          className={cn(
            'flex flex-col',
            isNext && 'items-end text-right max-md:items-start max-md:text-left',
          )}
        >
          <Label className="text-muted">
            {isNext ? 'NEXT' : 'PREV'} · 0{index + 1}
          </Label>
          <Display className="mt-3 text-[clamp(32px,4.4vw,56px)] group-hover:underline group-hover:underline-offset-4">
            {work.label}
          </Display>
          <span className="mt-3 block max-w-[36ch] font-kr text-[15px] leading-[1.55] font-semibold">
            {work.title}
          </span>
          <Label className="mt-4 text-muted">{work.period}</Label>
          <Label className="mt-6 text-ink-2">{isNext ? 'OPEN CASE →' : '← OPEN CASE'}</Label>
        </span>
      </Link>
    </div>
  )
}

type ShotCardProps = {
  shot: WorkShot
  onOpen: (shot: WorkShot, origin: HTMLImageElement) => void
}

function ShotCard({ shot, onOpen }: ShotCardProps) {
  const imageRef = useRef<HTMLImageElement>(null)

  const handleClick = () => {
    if (imageRef.current) onOpen(shot, imageRef.current)
  }

  return (
    <figure
      data-shot={shot.wide ? 'wide' : 'normal'}
      className="overflow-hidden rounded-2xl border border-hairline bg-white"
    >
      <button
        type="button"
        data-cursor="view"
        aria-label={`${shot.alt} 크게 보기`}
        className="block w-full"
        onClick={handleClick}
      >
        <img
          ref={imageRef}
          src={shot.src}
          alt={shot.alt}
          loading="lazy"
          decoding="async"
          className={cn(
            'w-full object-contain object-top',
            shot.wide ? 'max-h-[420px]' : 'aspect-[4/3]',
          )}
        />
      </button>
      <figcaption className="px-4 py-3 text-[13px] leading-[1.6] text-ink-2">{shot.caption}</figcaption>
    </figure>
  )
}

function DecisionShots({
  shots,
  onOpenShot,
}: {
  shots: WorkShot[]
  onOpenShot: (shot: WorkShot, origin: HTMLImageElement) => void
}) {
  return (
    <ul
      className={cn(
        'list-none grid gap-4',
        shots.length > 1 ? 'grid-cols-2 max-sm:grid-cols-1' : 'grid-cols-1',
      )}
    >
      {shots.map((shot) => (
        <li
          key={shot.src}
          className={cn(shot.wide && shots.length > 1 && 'max-sm:col-span-1 sm:col-span-2')}
        >
          <ShotCard shot={shot} onOpen={onOpenShot} />
        </li>
      ))}
    </ul>
  )
}

/** 데스크톱은 pin + 수평 레일, 모바일·reduced-motion은 리스트 + 프리뷰 */
function Entries({ entries }: { entries: WorkEntry[] }) {
  const isDesktop = useMediaQuery(MEDIA.desktop)
  const isReduced = useMediaQuery(MEDIA.reduce)

  return isDesktop && !isReduced ? (
    <EntriesRail entries={entries} />
  ) : (
    <EntriesList entries={entries} />
  )
}

function EntriesRail({ entries }: { entries: WorkEntry[] }) {
  const [active, setActive] = useState(0)

  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLUListElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)

  const { contextSafe } = useGSAP(
    () => {
      const track = trackRef.current
      if (!track) return
      gsap.set(previewRef.current, { autoAlpha: 0, scale: 0.9, xPercent: -50, yPercent: -50 })
      const getDistance = () => Math.max(0, track.scrollWidth - window.innerWidth)
      gsap.to(track, {
        x: () => -getDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${getDistance()}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      })
    },
    { scope: sectionRef },
  )

  const handlePointerMove = contextSafe((event: PointerEvent<HTMLElement>) => {
    gsap.to(previewRef.current, {
      x: event.clientX,
      y: event.clientY,
      duration: 0.5,
      ease: 'power3.out',
      overwrite: 'auto',
    })
  })

  const handleEnter = contextSafe((index: number) => {
    setActive(index)
    const hasImage = Boolean(entries[index]?.image)
    gsap.to(previewRef.current, {
      autoAlpha: hasImage ? 1 : 0,
      scale: hasImage ? 1 : 0.9,
      duration: 0.4,
      ease: 'expo.out',
    })
  })

  const handleLeave = contextSafe(() => {
    gsap.to(previewRef.current, { autoAlpha: 0, scale: 0.9, duration: 0.3, ease: 'power2.out' })
  })

  const current = entries[active] ?? entries[0]

  return (
    <section
      ref={sectionRef}
      className="relative flex h-svh w-full flex-col overflow-hidden bg-dark-ground pt-[calc(var(--nav-h)+24px)] pb-10 text-dark-ink [--hairline:var(--hairline-on-dark)]"
      onPointerMove={handlePointerMove}
    >
      <div className="flex shrink-0 items-center justify-between gap-4 px-[var(--pad)]">
        <Label className="text-dark-ink/55">구성</Label>
        <Label className="tabular-nums text-dark-ink/55">
          {String(active + 1).padStart(2, '0')} / {String(entries.length).padStart(2, '0')}
        </Label>
      </div>
      <ul
        ref={trackRef}
        className="my-auto flex w-max list-none gap-[clamp(16px,2vw,28px)] px-[var(--pad)]"
      >
        {entries.map((entry, index) => (
          <EntryRailCard
            key={entry.name}
            entry={entry}
            index={index}
            onEnter={handleEnter}
            onLeave={handleLeave}
          />
        ))}
      </ul>
      {createPortal(
        <div
          ref={previewRef}
          className="pointer-events-none invisible fixed top-0 left-0 z-[30] w-[clamp(220px,22vw,320px)] overflow-hidden rounded-xl border border-hairline-on-dark opacity-0"
          aria-hidden
        >
          {current?.image ? (
            <img
              src={current.image.src}
              alt=""
              className="aspect-[16/10] w-full object-cover object-top"
              decoding="async"
            />
          ) : null}
        </div>,
        document.body,
      )}
    </section>
  )
}

type EntryRailCardProps = {
  entry: WorkEntry
  index: number
  onEnter: (index: number) => void
  onLeave: () => void
}

function EntryRailCard({ entry, index, onEnter, onLeave }: EntryRailCardProps) {
  const handleEnter = () => onEnter(index)

  return (
    <li
      className="flex w-[clamp(260px,26vw,360px)] shrink-0 flex-col gap-3 border-t border-hairline pt-5"
      onMouseEnter={handleEnter}
      onMouseLeave={onLeave}
      onFocus={handleEnter}
    >
      <span className="font-display text-[12px] tabular-nums text-dark-ink/45">
        {String(index + 1).padStart(2, '0')}
      </span>
      <Display className="text-[clamp(26px,2.4vw,40px)] leading-none">{entry.name}</Display>
      <p className="text-[14px] leading-[1.6] font-medium text-dark-ink/80">{entry.note}</p>
      {entry.url ? (
        <a
          href={entry.url}
          target="_blank"
          {...outboundLinkProps(entry.url)}
          className="mt-1 inline-block self-start font-ui text-[11px] font-medium tracking-[0.12em] text-dark-ink/55 uppercase transition-colors duration-500 hover:text-neon"
        >
          열기 ↗
        </a>
      ) : null}
    </li>
  )
}

function EntriesList({ entries }: { entries: WorkEntry[] }) {
  const [active, setActive] = useState(0)

  const current = entries[active] ?? entries[0]

  const handleSelect = (index: number) => {
    setActive(index)
  }

  if (!current) return null

  return (
    <section
      data-rv
      className="relative left-1/2 flex min-h-svh w-screen max-w-[100vw] -translate-x-1/2 flex-col bg-dark-ground text-dark-ink [--hairline:var(--hairline-on-dark)]"
    >
      <div className="mx-auto flex w-full max-w-[1100px] flex-1 flex-col px-[var(--pad)] py-10 md:py-14">
        <div data-rv className="flex shrink-0 items-center justify-between gap-4">
          <Label className="text-dark-ink/55">구성</Label>
          <Label className="tabular-nums text-dark-ink/55">
            {String(active + 1).padStart(2, '0')} / {String(entries.length).padStart(2, '0')}
          </Label>
        </div>
        <div className="flex flex-1 flex-col justify-center pt-8 md:pt-10">
          <div className="grid items-center gap-8 md:grid-cols-[minmax(0,1fr)_minmax(240px,340px)] md:gap-12 lg:gap-16">
            <ul className="list-none border-t border-hairline">
              {entries.map((entry, index) => {
                const selected = index === active

                return (
                  <li key={entry.name}>
                    <button
                      type="button"
                      aria-current={selected ? 'true' : undefined}
                      className={cn(
                        'group relative grid w-full grid-cols-[2.25rem_minmax(0,1fr)] items-center gap-3 border-b border-hairline py-3.5 text-left transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
                        selected ? 'translate-x-1.5 md:translate-x-2.5' : 'hover:translate-x-1',
                      )}
                      onMouseEnter={() => handleSelect(index)}
                      onFocus={() => handleSelect(index)}
                      onClick={() => handleSelect(index)}
                    >
                      <span
                        aria-hidden
                        className={cn(
                          'absolute top-1/2 left-0 h-5 w-px origin-center -translate-y-1/2 bg-dark-ink transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
                          selected ? 'scale-y-100' : 'scale-y-0 group-hover:scale-y-50',
                        )}
                      />
                      <span
                        className={cn(
                          'text-right font-display text-[12px] tabular-nums tracking-[-0.02em] transition-colors duration-500',
                          selected ? 'text-dark-ink' : 'text-dark-ink/45 group-hover:text-dark-ink/75',
                        )}
                      >
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span
                        className={cn(
                          'min-w-0 text-[15px] leading-snug transition-colors duration-500 md:text-[16px]',
                          selected
                            ? 'font-semibold text-dark-ink'
                            : 'text-dark-ink/55 group-hover:text-dark-ink/85',
                        )}
                      >
                        {entry.name}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
            <EntryPreview entry={current} />
          </div>
        </div>
      </div>
    </section>
  )
}

function EntryPreview({ entry }: { entry: WorkEntry }) {
  return (
    <figure
      key={entry.name}
      className="entry-swap mx-auto w-full max-w-[340px] md:mx-0 md:justify-self-end"
    >
      <div className="overflow-hidden rounded-2xl border border-hairline bg-white">
        {entry.image ? (
          <img
            src={entry.image.src}
            alt={entry.image.alt}
            className="aspect-[16/10] w-full object-cover object-top"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="flex aspect-[16/10] items-end bg-light-ground px-4 py-3">
            <Display className="text-[clamp(22px,2vw,28px)] leading-none text-light-ink">
              {entry.name}
            </Display>
          </div>
        )}
      </div>
      <figcaption className="mt-4">
        <p className="text-[14px] leading-[1.6] font-medium text-dark-ink/90">{entry.note}</p>
        {entry.url ? (
          <a
            href={entry.url}
            target="_blank"
            {...outboundLinkProps(entry.url)}
            className="mt-3 inline-block font-ui text-[11px] font-medium tracking-[0.12em] text-dark-ink/55 uppercase transition-colors duration-500 hover:text-neon"
          >
            열기 ↗
          </a>
        ) : null}
      </figcaption>
    </figure>
  )
}
