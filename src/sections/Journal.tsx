import { useRef } from 'react'
import { useGSAP } from '../lib/gsapSetup'
import { prefersReducedMotion } from '../lib/motion'
import { revealOnce } from '../lib/reveal'

const POSTS = [
  { title: 'BFF로 토큰을 감싸는 구조', url: 'https://bori-note.tistory.com/' },
  { title: 'URL이 남는 모달 — Parallel Routes', url: 'https://bori-note.tistory.com/' },
  { title: '한글 IME에서 엔터가 두 번 먹는 문제', url: 'https://bori-note.tistory.com/' },
]

/** CH5 — 기록 (GSAP 1회 리빌) */
export default function Journal() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    (context) => {
      if (prefersReducedMotion()) return
      revealOnce((context.selector?.('.rv') ?? []) as HTMLElement[])
    },
    { scope: sectionRef },
  )

  return (
    <section ref={sectionRef} className="journal-section ground-light" id="journal">
      <span className="label rv">JOURNAL · 100+</span>
      <h2 className="display journal-head rv">
        적어두면,
        <br />
        다음이 짧아집니다.
      </h2>
      <p className="journal-copy rv">
        실무에서 막힌 지점을 100편 넘게 적어 왔습니다. 미래의 저와 팀원을 위한 메모장을
        공개해 둔 것에 가깝습니다.
      </p>
      <ul className="journal-list">
        {POSTS.map((post) => (
          <li key={post.title} className="rv">
            <a className="journal-link hairline-top" href={post.url} target="_blank" rel="noreferrer">
              <span>{post.title}</span>
              <span className="label">READ →</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
