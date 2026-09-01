import { Link, useNavigate, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { WORKS, workBySlug } from '../content/works'

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
    <div className="work-page">
      <header className="work-page-nav">
        <Link className="label" to="/">
          ← 홈
        </Link>
        <span className="label">{`0${index + 1} / 0${WORKS.length}`}</span>
      </header>

      {/* 슬리브 헤더 — 드래프트의 덱 카드를 2D 액센트로 재활용 */}
      <div className="sleeve">
        <span className="label">{`CATALOGUE 0${index + 1}`}</span>
        <span className="display sleeve-mark">{work.label}</span>
        <span className="label">{work.period}</span>
      </div>

      <article className="work-body">
        <h1 className="display work-page-title">{work.title}</h1>
        <p className="work-page-lede">{work.oneLiner}</p>
        <p className="label work-page-stack">{work.stack.join(' · ')}</p>

        <section className="work-block hairline-top">
          <h2 className="label">문제</h2>
          <p>{work.problem}</p>
        </section>
        <section className="work-block hairline-top">
          <h2 className="label">내가 한 선택</h2>
          <p>{work.choice}</p>
        </section>
        <section className="work-block hairline-top">
          <h2 className="label">결과</h2>
          <p className="work-result">{work.result}</p>
        </section>
        <section className="work-block hairline-top">
          <h2 className="label">배운 점</h2>
          <p>{work.learned}</p>
        </section>

        <div className="work-links">
          {work.links.map((link) => (
            <a key={link.url} className="pill" href={link.url} target="_blank" rel="noreferrer">
              {link.label} ↗
            </a>
          ))}
        </div>
      </article>

      <footer className="work-page-footer hairline-top">
        <Link className="label" to={`/work/${prev.slug}`}>
          ← {prev.label}
        </Link>
        <Link className="label" to="/">
          홈으로
        </Link>
        <Link className="label" to={`/work/${next.slug}`}>
          {next.label} →
        </Link>
      </footer>
    </div>
  )
}
