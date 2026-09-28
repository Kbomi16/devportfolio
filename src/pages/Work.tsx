import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Display from '../components/common/Display'
import Hairline from '../components/common/Hairline'
import Label from '../components/common/Label'
import Pill from '../components/common/Pill'
import {
  WORKS,
  workBySlug,
  type WorkDecision,
  type WorkEntry,
  type WorkItem,
  type WorkShot,
  type WorkStat,
} from '../content/works'
import CaseFlow from '../sections/CaseFlow'
import { cn } from '../lib/cn'
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsapSetup'
import { prefersReducedMotion } from '../lib/motion'
import { revealOnce } from '../lib/reveal'
import { getLenis, useLenis } from '../lib/useLenis'

/** /work/:slug — 읽기 우선 케이스 스터디 (3D 없음) */
export default function Work() {
  const pageRef = useRef<HTMLDivElement>(null)

  const { slug } = useParams()
  const navigate = useNavigate()
  useLenis()

  const handleThumbLoad = () => {
    ScrollTrigger.refresh()
  }

  useGSAP(
    (context) => {
      if (prefersReducedMotion()) return

      const nav = context.selector?.('[data-work-nav]')?.[0] as HTMLElement | undefined
      const thumbImg = context.selector?.('[data-work-thumb]')?.[0] as HTMLElement | undefined
      const stats = (context.selector?.('[data-stat]') ?? []) as HTMLElement[]

      if (nav) gsap.from(nav, { y: -16, opacity: 0, duration: 0.55, ease: 'power2.out' })
      if (thumbImg) gsap.from(thumbImg, { scale: 1.08, duration: 1.2, ease: 'power3.out' })
      revealOnce((context.selector?.('[data-rv]') ?? []) as HTMLElement[])
      if (stats.length > 0) {
        gsap.from(stats, {
          y: 24,
          opacity: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: stats[0], start: 'top 88%', once: true },
        })
      }
    },
    { scope: pageRef, dependencies: [slug], revertOnUpdate: true },
  )

  useLayoutEffect(() => {
    getLenis()?.scrollTo(0, { immediate: true })
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [slug])

  useEffect(() => {
    if (!workBySlug(slug)) navigate('/', { replace: true })
  }, [slug, navigate])

  const work = workBySlug(slug)
  if (!work) return null

  const index = WORKS.findIndex((item) => item.slug === work.slug)
  const prev = WORKS[(index - 1 + WORKS.length) % WORKS.length]
  const next = WORKS[(index + 1) % WORKS.length]

  return (
    <div
      ref={pageRef}
      className="relative z-[2] min-h-screen bg-light-ground pt-[var(--nav-h)] text-light-ink [--hairline:var(--hairline-on-light)]"
    >
      <header
        data-work-nav
        className="fixed inset-x-0 top-0 z-20 flex h-[var(--nav-h)] items-center justify-between border-b border-hairline bg-white/90 px-[var(--pad)] backdrop-blur-sm"
      >
        <Label
          as={Link}
          className="text-[12.5px] tracking-[0.13em] hover:underline hover:underline-offset-4"
          to="/"
        >
          ← 홈
        </Label>
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
            <Label className="rounded-full bg-neon px-2.5 py-1 text-dark-ground">{work.status}</Label>
          ) : null}
        </div>
        <WorkTitleMark work={work} onMarkLoad={handleThumbLoad} />
        </div>

        <section data-rv className="mt-2 mb-8 rounded-3xl border border-hairline px-4 py-8 sm:px-8">
          <CaseFlow flow={work.flow} />
        </section>

        {work.stats ? (
          <div className="max-w-[720px]">
            <Stats stats={work.stats} />
          </div>
        ) : null}

        {work.shots ? <Shots shots={work.shots} /> : null}

        <Decisions
          decisions={work.decisions}
          suppressTopRule={!work.stats && !work.shots}
        />
      </article>
      </div>

      {work.entries ? <Entries entries={work.entries} /> : null}

      <WorkPager
        prev={prev}
        next={next}
        prevIndex={(index - 1 + WORKS.length) % WORKS.length}
        nextIndex={(index + 1) % WORKS.length}
      />
    </div>
  )
}

function Decisions({
  decisions,
  suppressTopRule,
}: {
  decisions: WorkDecision[]
  suppressTopRule?: boolean
}) {
  return (
    <>
      {decisions.map((item, index) => (
        <Hairline
          as="section"
          data-rv
          key={item.title}
          className={cn('grid gap-5 py-8', index === 0 && suppressTopRule && 'border-t-0')}
        >
          <h2 className="font-kr text-[18px] font-bold tracking-[-0.02em]">{item.title}</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            <div>
              <Label className="text-muted">문제</Label>
              <p className="mt-2 text-[15px] leading-[1.75]">{item.problem}</p>
            </div>
            <div>
              <Label className="text-muted">선택</Label>
              <p className="mt-2 text-[15px] leading-[1.75]">{item.choice}</p>
            </div>
            <div>
              <Label className="text-muted">결과</Label>
              <p className="mt-2 text-[15px] leading-[1.75] font-bold">{item.result}</p>
            </div>
          </div>
        </Hairline>
      ))}
    </>
  )
}

function WorkTitleMark({ work, onMarkLoad }: { work: WorkItem; onMarkLoad: () => void }) {
  return (
    <div data-rv className="relative mt-5 sm:mt-6">
      <figure className="pointer-events-none absolute top-[-6%] right-[-2%] z-[1] w-[clamp(140px,38vw,440px)]">
        <img
          data-work-thumb
          src={work.thumb.src}
          alt={work.thumb.alt}
          className="aspect-[3/4] w-full object-contain"
          onLoad={onMarkLoad}
        />
      </figure>
      <div className="relative z-[2] min-w-0 max-w-[42rem] pr-[min(36vw,11rem)] sm:max-w-[min(78%,46rem)] sm:pr-[min(40vw,14rem)] md:max-w-[min(88%,56rem)] md:pr-[min(34vw,17rem)]">
        <Label className="text-muted">{work.label}</Label>
        <Display
          as="h1"
          className="mt-2 font-kr text-[clamp(28px,4.6vw,52px)] leading-[1.14] font-extrabold tracking-[-0.03em]"
        >
          {work.title}
        </Display>
        <div className="mt-4 max-w-[56rem] text-[clamp(17px,1.8vw,21px)] leading-normal font-semibold">
          {work.oneLiner.split('\n').map((line, index) => (
            <span key={index} className="block md:whitespace-nowrap">
              {line}
            </span>
          ))}
        </div>
        <p className="mt-3 text-[15px] leading-[1.7] text-ink-2">{work.role}</p>
        <Label className="mb-8 mt-4 max-w-[46rem] text-muted">{work.stack.join(' · ')}</Label>
      </div>
    </div>
  )
}

function Stats({ stats }: { stats: WorkStat[] }) {
  return (
    <ul className="mb-4 grid list-none grid-cols-3 gap-x-4 gap-y-6 border-t border-hairline pt-6 max-sm:grid-cols-1">
      {stats.map((stat) => (
        <li key={stat.label} data-stat>
          <Display className="text-[clamp(28px,4vw,40px)]">{stat.value}</Display>
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
        <Label
          as={Link}
          className="hover:underline hover:underline-offset-4"
          to="/"
        >
          ← PROJECTS
        </Label>
        <Pill
          className="border-hairline-on-light hover:border-light-ink"
          href="mailto:bomi2172@gmail.com"
        >
          bomi2172@gmail.com
        </Pill>
      </Hairline>
    </footer>
  )
}

function PagerCard({
  work,
  index,
  direction,
}: {
  work: WorkItem
  index: number
  direction: 'prev' | 'next'
}) {
  const isNext = direction === 'next'

  return (
    <Link
      aria-label={`${isNext ? '다음' : '이전'} 케이스 ${work.title}`}
      className={
        isNext
          ? 'group flex flex-col items-end border-l border-hairline py-10 pl-8 text-right max-md:items-start max-md:border-l-0 max-md:border-t max-md:pl-0 max-md:text-left'
          : 'group flex flex-col py-10 pr-8 max-md:pr-0'
      }
      to={`/work/${work.slug}`}
    >
      <Label className="text-muted">{isNext ? 'NEXT' : 'PREV'} · 0{index + 1}</Label>
      <Display className="mt-3 text-[clamp(32px,4.4vw,56px)] group-hover:underline group-hover:underline-offset-4">
        {work.label}
      </Display>
      <p className="mt-3 max-w-[36ch] font-kr text-[15px] leading-[1.55] font-semibold">
        {work.title}
      </p>
      <Label className="mt-4 text-muted">{work.period}</Label>
      <Label className="mt-6 text-ink-2">{isNext ? 'OPEN CASE →' : '← OPEN CASE'}</Label>
    </Link>
  )
}

function Shots({ shots }: { shots: WorkShot[] }) {
  return (
    <ul className="mt-2 mb-8 grid list-none grid-cols-2 gap-4 max-sm:grid-cols-1">
      {shots.map((shot) => (
        <li key={shot.src} data-rv className="overflow-hidden rounded-2xl border border-hairline bg-white">
          <img src={shot.src} alt={shot.alt} className="aspect-[4/3] w-full object-contain object-top" />
          <p className="px-4 py-3 text-[13px] leading-[1.6] text-ink-2">{shot.caption}</p>
        </li>
      ))}
    </ul>
  )
}

function Entries({ entries }: { entries: WorkEntry[] }) {
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
            rel="noreferrer"
            className="mt-3 inline-block font-ui text-[11px] font-medium tracking-[0.12em] text-dark-ink/55 uppercase transition-colors duration-500 hover:text-neon"
          >
            열기 ↗
          </a>
        ) : null}
      </figcaption>
    </figure>
  )
}
