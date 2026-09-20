import { useRef } from 'react'
import Display from '../components/common/Display'
import Hairline from '../components/common/Hairline'
import Label from '../components/common/Label'
import { cn } from '../lib/cn'
import { ground } from '../lib/ground'
import { gsap, useGSAP } from '../lib/gsapSetup'
import { prefersReducedMotion } from '../lib/motion'

const POSTS = [
  { title: 'BFF로 토큰을 감싸는 구조', url: 'https://bori-note.tistory.com/' },
  { title: 'URL이 남는 모달 — Parallel Routes', url: 'https://bori-note.tistory.com/' },
  { title: '한글 IME에서 엔터가 두 번 먹는 문제', url: 'https://bori-note.tistory.com/' },
]

/** CH5 — 기록. 핀 + 스크럽으로 헤드라인이 열리고 포스트가 한 줄씩 등장한다. */
export default function Journal() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    (context) => {
      if (prefersReducedMotion()) return

      const heads = (context.selector?.('[data-head]') ?? []) as HTMLElement[]
      const rows = (context.selector?.('[data-row]') ?? []) as HTMLElement[]

      gsap.set(rows, { autoAlpha: 0, y: 30 })

      const tl = gsap.timeline({
        defaults: { ease: 'power2.out' },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=160%',
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
        },
      })

      tl.from(heads, { y: 44, opacity: 0, duration: 0.6, stagger: 0.16 })
      rows.forEach((row) => {
        tl.to(row, { autoAlpha: 1, y: 0, duration: 0.45 }, '+=0.18')
      })
      tl.to({}, { duration: 0.45 })
    },
    { scope: sectionRef },
  )

  return (
    <section
      ref={sectionRef}
      className={cn(
        ground.light,
        'relative flex h-screen flex-col justify-center gap-5 overflow-hidden px-[var(--pad)] [&>*]:mx-auto [&>*]:w-full [&>*]:max-w-[900px]',
        'motion-reduce:h-auto motion-reduce:overflow-visible motion-reduce:py-[18vh]',
      )}
      id="journal"
    >
      <Label data-head className="text-muted">
        JOURNAL · 100+
      </Label>
      <Display
        data-head
        as="h2"
        className="font-kr text-[clamp(32px,4.4vw,64px)] leading-[1.15] font-extrabold tracking-[-0.02em]"
      >
        적어두면,
        <br />
        다음이 짧아집니다.
      </Display>
      <p data-head className="max-w-[46ch] text-ink-2">
        모르는 걸 만나면 적어 두었습니다. 완성된 글보다는, 다음에 같은 자리에서 덜 헤매려는
        메모입니다.
      </p>
      <ul className="mt-3 list-none">
        {POSTS.map((post) => (
          <li key={post.title} data-row>
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
