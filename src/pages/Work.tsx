import { useEffect, useLayoutEffect, useRef } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Display from '../components/common/Display'
import Hairline from '../components/common/Hairline'
import Label from '../components/common/Label'
import Pill from '../components/common/Pill'
import { WORKS, workBySlug, type WorkEntry, type WorkItem, type WorkShot, type WorkStat } from '../content/works'
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

  const handleCoverLoad = () => {
    ScrollTrigger.refresh()
  }

  useGSAP(
    (context) => {
      if (prefersReducedMotion()) return

      const nav = context.selector?.('[data-work-nav]')?.[0] as HTMLElement | undefined
      const cover = context.selector?.('[data-cover]')?.[0] as HTMLElement | undefined
      const coverImg = context.selector?.('[data-cover-img]')?.[0] as HTMLElement | undefined
      const stats = (context.selector?.('[data-stat]') ?? []) as HTMLElement[]

      if (nav) gsap.from(nav, { y: -16, opacity: 0, duration: 0.55, ease: 'power2.out' })
      if (cover) gsap.from(cover, { y: 36, opacity: 0, duration: 0.9, ease: 'power3.out' })
      if (coverImg) gsap.from(coverImg, { scale: 1.08, duration: 1.2, ease: 'power3.out' })
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
        className="fixed inset-x-0 top-0 z-20 flex h-[var(--nav-h)] items-center justify-between border-b border-hairline bg-light-ground/88 px-[var(--pad)] backdrop-blur-sm"
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

      <Cover work={work} onLoad={handleCoverLoad} />

      <article className="mx-auto max-w-[1100px] px-[var(--pad)] pt-[6vh] pb-[10vh]">
        <div className="max-w-[720px]">
        <div data-rv className="flex flex-wrap items-center gap-3">
          <Label className="text-muted">{work.period}</Label>
          {work.status ? (
            <Label className="rounded-full bg-neon px-2.5 py-1 text-dark-ground">{work.status}</Label>
          ) : null}
        </div>
        <Display
          data-rv
          as="h1"
          className="mt-3 font-kr text-[clamp(28px,4vw,48px)] leading-[1.2] font-extrabold tracking-[-0.02em]"
        >
          {work.title}
        </Display>
        <p
          data-rv
          className="mt-5 whitespace-pre-line text-[clamp(17px,1.8vw,21px)] leading-normal font-semibold"
        >
          {work.oneLiner}
        </p>
        <p data-rv className="mt-4 text-[15px] leading-[1.7] text-ink-2">
          {work.role}
        </p>
        <Label data-rv className="my-[18px] mb-8 text-muted">
          {work.stack.join(' · ')}
        </Label>
        </div>

        {work.stats ? (
          <div className="max-w-[720px]">
            <Stats stats={work.stats} />
          </div>
        ) : null}

        {work.shots ? <Shots shots={work.shots} /> : null}

        <Hairline
          as="section"
          data-rv
          className="grid grid-cols-[140px_1fr] gap-5 py-7 max-sm:grid-cols-1 max-sm:gap-2"
        >
          <Label className="whitespace-nowrap text-muted">문제</Label>
          <p className="max-w-[62ch] text-base leading-[1.8]">{work.problem}</p>
        </Hairline>
        <Hairline
          as="section"
          data-rv
          className="grid grid-cols-[140px_1fr] gap-5 py-7 max-sm:grid-cols-1 max-sm:gap-2"
        >
          <Label className="whitespace-nowrap text-muted">내가 한 선택</Label>
          <p className="max-w-[62ch] text-base leading-[1.8]">{work.choice}</p>
        </Hairline>
        <Hairline
          as="section"
          data-rv
          className="grid grid-cols-[140px_1fr] gap-5 py-7 max-sm:grid-cols-1 max-sm:gap-2"
        >
          <Label className="whitespace-nowrap text-muted">결과</Label>
          <p className="max-w-[62ch] text-base leading-[1.8] font-bold">{work.result}</p>
        </Hairline>
        <Hairline
          as="section"
          data-rv
          className="grid grid-cols-[140px_1fr] gap-5 py-7 max-sm:grid-cols-1 max-sm:gap-2"
        >
          <Label className="whitespace-nowrap text-muted">배운 점</Label>
          <p className="max-w-[62ch] text-base leading-[1.8]">{work.learned}</p>
        </Hairline>

        {work.entries ? <Entries entries={work.entries} /> : null}

        <div data-rv className="mt-10 flex flex-wrap gap-3">
          {work.links.map((link) => (
            <Pill
              key={link.url}
              className="border-hairline-on-light hover:border-light-ink"
              href={link.url}
              target="_blank"
              rel="noreferrer"
            >
              {link.label} ↗
            </Pill>
          ))}
        </div>
      </article>

      <WorkPager
        prev={prev}
        next={next}
        prevIndex={(index - 1 + WORKS.length) % WORKS.length}
        nextIndex={(index + 1) % WORKS.length}
      />
    </div>
  )
}

function Cover({ work, onLoad }: { work: WorkItem; onLoad: () => void }) {
  return (
    <figure data-cover className="mx-auto w-full max-w-[1100px] px-[var(--pad)]">
      <div className="overflow-hidden rounded-[32px] shadow-[0_18px_40px_rgba(0,0,0,0.18)]">
        <img
          data-cover-img
          src={work.cover.src}
          alt={work.cover.alt}
          className={cn(
            'aspect-[16/9] w-full origin-center bg-white',
            work.cover.fit === 'contain' ? 'object-contain' : 'object-cover',
          )}
          onLoad={onLoad}
        />
      </div>
    </figure>
  )
}

function Stats({ stats }: { stats: WorkStat[] }) {
  return (
    <ul className="mb-4 grid list-none grid-cols-3 gap-4 max-sm:grid-cols-1">
      {stats.map((stat) => (
        <li key={stat.label} data-stat className="border-t border-hairline pt-4">
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
        {work.title.replace(`${work.label} — `, '')}
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
  const pictured = entries.filter((entry) => entry.image)
  const plain = entries.filter((entry) => !entry.image)

  return (
    <Hairline as="section" data-rv className="flex flex-col gap-5 py-7">
      <Label className="text-muted">구성</Label>
      {pictured.length > 0 ? (
        <ul className="grid list-none grid-cols-2 gap-4 max-md:grid-cols-1">
          {pictured.map((entry) => (
            <li key={entry.name} data-rv className="overflow-hidden rounded-2xl border border-hairline bg-white">
              <a href={entry.url} target="_blank" rel="noreferrer" className="block">
                <img
                  src={entry.image?.src}
                  alt={entry.image?.alt ?? entry.name}
                  className="aspect-[16/9] w-full object-contain"
                />
                <span className="block px-4 pt-4 font-ui text-[13px] tracking-[0.12em] uppercase">
                  {entry.name}
                </span>
                <span className="block px-4 pt-2 pb-4 text-[14px] leading-[1.6]">{entry.note}</span>
              </a>
            </li>
          ))}
        </ul>
      ) : null}
      {plain.length > 0 ? (
        <ul className="list-none">
          {plain.map((entry) => (
            <li
              key={entry.name}
              data-rv
              className="grid grid-cols-[140px_1fr] gap-5 py-3 max-sm:grid-cols-1 max-sm:gap-1"
            >
              {entry.url ? (
                <a
                  className="font-ui text-[13px] tracking-[0.12em] uppercase hover:underline hover:underline-offset-4"
                  href={entry.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {entry.name}
                </a>
              ) : (
                <span className="font-ui text-[13px] tracking-[0.12em] uppercase">{entry.name}</span>
              )}
              <p className="text-base leading-[1.8]">{entry.note}</p>
            </li>
          ))}
        </ul>
      ) : null}
    </Hairline>
  )
}
