import { useRef } from 'react'
import Display from '../components/common/Display'
import Hairline from '../components/common/Hairline'
import Label from '../components/common/Label'
import { cn } from '../lib/cn'
import { ground } from '../lib/ground'
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
      revealOnce((context.selector?.('[data-rv]') ?? []) as HTMLElement[])
    },
    { scope: sectionRef },
  )

  return (
    <section
      ref={sectionRef}
      className={cn(
        ground.light,
        'flex flex-col gap-5 px-[var(--pad)] pt-[6vh] pb-[22vh] [&>*]:mx-auto [&>*]:w-full [&>*]:max-w-[900px]',
      )}
      id="journal"
    >
      <Label data-rv className="text-muted">
        JOURNAL · 100+
      </Label>
      <Display
        data-rv
        as="h2"
        className="font-kr text-[clamp(32px,4.4vw,64px)] leading-[1.15] font-extrabold tracking-[-0.02em]"
      >
        적어두면,
        <br />
        다음이 짧아집니다.
      </Display>
      <p data-rv className="max-w-[44ch] text-ink-2">
        실무에서 막힌 지점을 100편 넘게 적어 왔습니다. 미래의 저와 팀원을 위한 메모장을
        공개해 둔 것에 가깝습니다.
      </p>
      <ul className="mt-3 list-none">
        {POSTS.map((post) => (
          <li key={post.title} data-rv>
            <Hairline
              as="a"
              className="group flex items-center justify-between gap-4 py-[18px] font-semibold"
              href={post.url}
              target="_blank"
              rel="noreferrer"
            >
              <span className="group-hover:underline group-hover:underline-offset-[5px]">
                {post.title}
              </span>
              <Label className="text-muted">READ →</Label>
            </Hairline>
          </li>
        ))}
      </ul>
    </section>
  )
}
