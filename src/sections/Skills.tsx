import { useRef } from 'react'
import Label from '../components/common/Label'
import { outboundLinkProps } from '../lib/outboundLink'
import {
  AI_TOOLS,
  ORIGINAL_THOUGHTS,
  SKILLS_FAMILIAR,
  SKILLS_TRIED,
  SKILLS_URL,
  type SkillGroup,
} from '../content/workflow'
import { cn } from '../lib/cn'
import { ground } from '../lib/ground'
import { gsap, useGSAP } from '../lib/gsapSetup'
import { matchMediaPreset } from '../lib/media'
import { revealOnce } from '../lib/reveal'

/** 원래부터 갖고 있던 생각 + Skills(익숙해요 / 써봤어요 / 일할 때 쓰는 AI) — 노션 포폴 v3 */
export default function Skills() {
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
      className={cn(ground.dark, 'relative px-[var(--pad)] py-[14vh]')}
      id="skills"
    >
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-[10vh]">
        <div>
          <Label data-rv className="text-muted">
            AI WORKFLOW
          </Label>
          <h3
            data-rv
            className="mt-3 font-kr text-[clamp(22px,2.6vw,36px)] leading-[1.2] font-extrabold tracking-[-0.02em]"
          >
            원래부터 갖고 있던 생각
          </h3>
          <ol className="mt-6 grid list-none gap-4 lg:grid-cols-3">
            {ORIGINAL_THOUGHTS.map((thought, index) => (
              <li key={thought.title} data-rv className="flex flex-col gap-3 rounded-xl border border-hairline p-5">
                <Label className="text-muted">{`0${index + 1}`}</Label>
                <p className="font-kr text-[clamp(17px,1.5vw,20px)] leading-[1.35] font-bold tracking-[-0.01em]">
                  {thought.title}
                </p>
                <p className="text-[14px] leading-[1.75] text-ink/70">{thought.body}</p>
                {thought.link ? (
                  <a
                    href={thought.link.url}
                    target="_blank"
                    {...outboundLinkProps(thought.link.url)}
                    className="mt-auto font-ui text-[11px] font-medium tracking-[0.12em] text-ink/70 uppercase hover:text-neon"
                  >
                    {thought.link.label} ↗
                  </a>
                ) : null}
              </li>
            ))}
          </ol>
        </div>

        <div>
          <Label data-rv className="text-muted">
            Skills
          </Label>
          <div className="mt-6 grid gap-8 md:grid-cols-2 md:gap-10">
            <SkillColumn title="익숙해요" groups={SKILLS_FAMILIAR} />
            <SkillColumn title="써봤어요" groups={SKILLS_TRIED} />
          </div>
        </div>

        <div>
          <h3
            data-rv
            className="font-kr text-[clamp(20px,2.2vw,30px)] leading-[1.2] font-extrabold tracking-[-0.02em]"
          >
            일할 때 쓰는 AI
          </h3>
          <ul className="mt-5 list-none border-t border-hairline">
            {AI_TOOLS.map((tool) => (
              <li
                key={tool.name}
                data-rv
                className="grid gap-1 border-b border-hairline py-3.5 md:grid-cols-[180px_1fr] md:gap-6"
              >
                <span className="font-ui text-[13px] font-semibold">{tool.name}</span>
                <span className="text-[14px] leading-[1.65] text-ink/70">
                  {tool.note}
                  {tool.name === '스킬 파일' ? (
                    <>
                      {' '}
                      <a
                        href={SKILLS_URL}
                        target="_blank"
                        {...outboundLinkProps(SKILLS_URL)}
                        className="underline decoration-hairline underline-offset-4 hover:decoration-current"
                      >
                        (GitHub)
                      </a>
                    </>
                  ) : null}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

function SkillColumn({ title, groups }: { title: string; groups: SkillGroup[] }) {
  return (
    <div data-rv>
      <h3 className="font-kr text-[clamp(20px,2.2vw,30px)] leading-[1.2] font-extrabold tracking-[-0.02em]">
        {title}
      </h3>
      <div className="mt-5 flex flex-col gap-5">
        {groups.map((group) => (
          <div key={group.name}>
            <Label className="text-muted">{group.name}</Label>
            <ul className="mt-2 flex list-none flex-wrap gap-2">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-hairline px-3 py-1 font-ui text-[12.5px] leading-[1.5]"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
