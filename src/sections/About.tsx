import { Fragment, useRef } from 'react'
import Label from '../components/common/Label'
import { ABOUT_PARAGRAPHS, HEADLINE, WORK_STYLE } from '../content/about'
import { cn } from '../lib/cn'
import { ground } from '../lib/ground'
import { gsap, useGSAP } from '../lib/gsapSetup'
import { matchMediaPreset } from '../lib/media'
import { revealOnce } from '../lib/reveal'

/** About — 노션 포폴 v3 헤드라인·본문과 「이렇게 일해요.」 */
export default function About() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = matchMediaPreset(({ motion }) => {
        if (!motion) return
        revealOnce(gsap.utils.toArray<HTMLElement>('[data-rv]'))
      })
      return () => mm.revert()
    },
    { scope: sectionRef },
  )

  return (
    <section
      ref={sectionRef}
      className={cn(ground.light, 'relative px-[var(--pad)] py-[14vh]')}
      id="intro"
    >
      <div className="mx-auto w-full max-w-[1200px]">
        <Label data-rv className="text-muted">
          About Me
        </Label>
        <h2
          data-rv
          className="mt-3 max-w-[22em] font-kr text-[clamp(24px,3vw,44px)] leading-[1.25] font-extrabold tracking-[-0.02em]"
        >
          {HEADLINE}
        </h2>
        <div className="mt-8 grid gap-5 lg:grid-cols-2 lg:gap-10">
          {ABOUT_PARAGRAPHS.map((paragraph) => {
            const [before, after] = paragraph.text.split('{strong}')
            return (
              <p key={paragraph.text} data-rv className="text-[15px] leading-[1.8] text-ink/70 md:text-[16px]">
                {before}
                {paragraph.strong ? (
                  <Fragment>
                    <strong className="font-bold text-ink">{paragraph.strong}</strong>
                    {after}
                  </Fragment>
                ) : null}
              </p>
            )
          })}
        </div>

        <div className="mt-[10vh]">
          <h3
            data-rv
            className="font-kr text-[clamp(22px,2.6vw,36px)] leading-[1.2] font-extrabold tracking-[-0.02em]"
          >
            이렇게 일해요.
          </h3>
          <ol className="mt-6 grid list-none gap-4 lg:grid-cols-3">
            {WORK_STYLE.map((point, index) => (
              <li
                key={point.title}
                data-rv
                className="flex flex-col gap-3 rounded-xl border border-hairline bg-light-ground p-5"
              >
                <Label className="text-muted">{`0${index + 1}`}</Label>
                <p className="font-kr text-[clamp(17px,1.5vw,20px)] leading-[1.35] font-bold tracking-[-0.01em]">
                  {point.title}
                </p>
                <p className="text-[14px] leading-[1.75] text-ink/70">{point.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
