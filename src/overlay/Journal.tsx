import { useReveal } from './useReveal'

const POSTS = [
  { title: 'BFF로 토큰을 감싸는 구조', url: 'https://bori-note.tistory.com/' },
  { title: 'URL이 남는 모달 — Parallel Routes', url: 'https://bori-note.tistory.com/' },
  { title: '한글 IME에서 엔터가 두 번 먹는 문제', url: 'https://bori-note.tistory.com/' },
]

/** CH5 — 기록 */
export default function Journal() {
  const ref = useReveal<HTMLElement>()

  return (
    <section ref={ref} className="journal-section" id="journal">
      <span className="label reveal">JOURNAL · 100+</span>
      <h2 className="display journal-head reveal" style={{ ['--reveal-delay' as never]: '0.1s' }}>
        적어두면,
        <br />
        다음이 짧아집니다.
      </h2>
      <p className="journal-copy reveal" style={{ ['--reveal-delay' as never]: '0.18s' }}>
        실무에서 막힌 지점을 100편 넘게 적어 왔습니다. 미래의 저와 팀원을 위한 메모장을
        공개해 둔 것에 가깝습니다.
      </p>
      <ul className="journal-list">
        {POSTS.map((post, i) => (
          <li key={post.title} className="reveal" style={{ ['--reveal-delay' as never]: `${0.24 + i * 0.06}s` }}>
            <a
              className="journal-link hairline-top"
              href={post.url}
              target="_blank"
              rel="noreferrer"
            >
              <span>{post.title}</span>
              <span className="label">READ →</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
