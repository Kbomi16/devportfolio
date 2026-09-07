import { Link, useNavigate, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import Display from '../components/common/Display'
import Hairline from '../components/common/Hairline'
import Label from '../components/common/Label'
import Pill from '../components/common/Pill'
import { WORKS, workBySlug, type WorkEntry, type WorkItem, type WorkStat } from '../content/works'

/** /work/:slug — 읽기 우선 케이스 스터디 (3D 없음) */
export default function Work() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const work = workBySlug(slug)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [slug])

  useEffect(() => {
    if (!work) navigate('/', { replace: true })
  }, [work, navigate])

  if (!work) return null

  const index = WORKS.findIndex((w) => w.slug === work.slug)
  const prev = WORKS[(index - 1 + WORKS.length) % WORKS.length]
  const next = WORKS[(index + 1) % WORKS.length]

  return (
    <div className="relative z-[2] min-h-screen bg-light-ground text-light-ink [--hairline:var(--hairline-on-light)]">
      <header className="flex items-center justify-between px-[var(--pad)] py-5">
        <Label as={Link} className="hover:underline hover:underline-offset-4" to="/">
          ← 홈
        </Label>
        <Label>{`0${index + 1} / 0${WORKS.length}`}</Label>
      </header>

      <Cover work={work} />

      <article className="mx-auto max-w-[720px] px-[var(--pad)] pt-[6vh] pb-[10vh]">
        <Label className="text-muted">{work.period}</Label>
        <Display
          as="h1"
          className="mt-3 font-kr text-[clamp(28px,4vw,48px)] leading-[1.2] font-extrabold tracking-[-0.02em]"
        >
          {work.title}
        </Display>
        <p className="mt-5 whitespace-pre-line text-[clamp(17px,1.8vw,21px)] leading-normal font-semibold">
          {work.oneLiner}
        </p>
        <Label className="my-[18px] mb-8 text-muted">{work.stack.join(' · ')}</Label>

        {work.stats ? <Stats stats={work.stats} /> : null}

        <Hairline as="section" className="grid grid-cols-[140px_1fr] gap-5 py-7 max-sm:grid-cols-1 max-sm:gap-2">
          <Label className="text-muted">문제</Label>
          <p className="text-base leading-[1.8]">{work.problem}</p>
        </Hairline>
        <Hairline as="section" className="grid grid-cols-[140px_1fr] gap-5 py-7 max-sm:grid-cols-1 max-sm:gap-2">
          <Label className="text-muted">내가 한 선택</Label>
          <p className="text-base leading-[1.8]">{work.choice}</p>
        </Hairline>
        <Hairline as="section" className="grid grid-cols-[140px_1fr] gap-5 py-7 max-sm:grid-cols-1 max-sm:gap-2">
          <Label className="text-muted">결과</Label>
          <p className="text-base leading-[1.8] font-bold">{work.result}</p>
        </Hairline>
        <Hairline as="section" className="grid grid-cols-[140px_1fr] gap-5 py-7 max-sm:grid-cols-1 max-sm:gap-2">
          <Label className="text-muted">배운 점</Label>
          <p className="text-base leading-[1.8]">{work.learned}</p>
        </Hairline>

        {work.entries ? <Entries entries={work.entries} /> : null}

        <div className="mt-10 flex flex-wrap gap-3">
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

      <Hairline
        as="footer"
        className="flex justify-between px-[var(--pad)] py-6 [&_a:hover]:underline [&_a:hover]:underline-offset-4"
      >
        <Label as={Link} to={`/work/${prev.slug}`}>
          ← {prev.label}
        </Label>
        <Label as={Link} to="/">
          홈으로
        </Label>
        <Label as={Link} to={`/work/${next.slug}`}>
          {next.label} →
        </Label>
      </Hairline>
    </div>
  )
}

function Cover({ work }: { work: WorkItem }) {
  return (
    <figure className="mx-auto w-full max-w-[1100px] px-[var(--pad)]">
      <img
        src={work.cover.src}
        alt={work.cover.alt}
        className="aspect-[16/9] w-full rounded-[32px] object-cover shadow-[0_18px_40px_rgba(0,0,0,0.18)]"
      />
    </figure>
  )
}

function Stats({ stats }: { stats: WorkStat[] }) {
  return (
    <ul className="mb-4 grid list-none grid-cols-3 gap-4 max-sm:grid-cols-1">
      {stats.map((stat) => (
        <li key={stat.label} className="border-t border-hairline pt-4">
          <Display className="text-[clamp(28px,4vw,40px)]">{stat.value}</Display>
          <Label className="mt-2 text-muted">{stat.label}</Label>
        </li>
      ))}
    </ul>
  )
}

function Entries({ entries }: { entries: WorkEntry[] }) {
  return (
    <Hairline as="section" className="flex flex-col gap-5 py-7">
      <Label className="text-muted">구성</Label>
      <ul className="list-none">
        {entries.map((entry) => (
          <li key={entry.name} className="grid grid-cols-[140px_1fr] gap-5 py-3 max-sm:grid-cols-1 max-sm:gap-1">
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
    </Hairline>
  )
}
