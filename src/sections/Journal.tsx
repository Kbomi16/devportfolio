import { useRef } from 'react'
import Hairline from '../components/common/Hairline'
import Label from '../components/common/Label'
import { POSTS } from '../content/posts'
import { cn } from '../lib/cn'
import { ground } from '../lib/ground'
import { gsap, useGSAP } from '../lib/gsapSetup'
import { matchMediaPreset } from '../lib/media'
import { outboundLinkProps } from '../lib/outboundLink'
import { revealOnce } from '../lib/reveal'

/** CH5 — 기록. 헤드라인이 줄 단위 clip 마스크로 열리고, 포스트가 한 줄씩 등장한다 (pin 없음). */
export default function Journal() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = matchMediaPreset(({ motion }) => {
        if (!motion) return
        gsap.utils.toArray<HTMLElement>('[data-head-line]').forEach((line) => {
          gsap.fromTo(
            line,
            { clipPath: 'inset(0 0 100% 0)', yPercent: 30 },
            {
              clipPath: 'inset(0 0 0% 0)',
              yPercent: 0,
              ease: 'none',
              scrollTrigger: { trigger: line, start: 'top 92%', end: 'top 62%', scrub: 0.6 },
            },
          )
        })
        revealOnce(gsap.utils.toArray<HTMLElement>('[data-head]'))
        gsap.from('[data-row]', {
          y: 30,
          autoAlpha: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: '[data-rows]', start: 'top 85%', once: true },
        })
      })
      return () => mm.revert()
    },
    { scope: sectionRef },
  )

  return (
    <section
      ref={sectionRef}
      className={cn(ground.light, 'relative flex flex-col justify-center px-[var(--pad)] py-[18vh]')}
      id="journal"
    >
      <div className="mx-auto flex w-full max-w-[1200px] flex-col">
        <Label data-head className="text-muted">
          JOURNAL · 100+
        </Label>
        <h2 className="mt-3 font-kr text-[clamp(26px,3.2vw,48px)] leading-[1.15] font-extrabold tracking-[-0.02em]">
          <span data-head-line className="block">
            적어두면,
          </span>
          <span data-head-line className="block">
            다음이 짧아집니다.
          </span>
        </h2>
        <p data-head className="max-w-[46ch] text-[15px] leading-[1.7] text-ink-2">
          나중에 헤매지 않으려고 적어 둔 메모가 블로그 100편이 됐습니다.
          <br />
          거창한 나눔보다, 다음에 제가 다시 읽는 메모에 가깝습니다.
        </p>
        <ul data-rows className="mt-3 list-none">
          {POSTS.map((post) => (
            <li key={post.title} data-row>
              <Hairline
                as="a"
                data-cursor="read"
                className="group flex items-center justify-between gap-4 py-[18px] font-semibold"
                href={post.url}
                target="_blank"
                {...outboundLinkProps(post.url)}
              >
                <span className="group-hover:underline group-hover:decoration-neon group-hover:underline-offset-[5px]">
                  {post.title}
                </span>
                <Label className="rounded-full px-2 py-1 text-muted transition-[background-color,color] duration-200 group-hover:bg-neon group-hover:text-dark-ground">
                  READ →
                </Label>
              </Hairline>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
