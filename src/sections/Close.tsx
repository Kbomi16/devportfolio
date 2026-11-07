import { useRef } from 'react'
import Display from '../components/common/Display'
import Label from '../components/common/Label'
import Pill from '../components/common/Pill'
import Hairline from '../components/common/Hairline'
import { CONTACT_LINKS, EMAIL } from '../content/contact'
import { cn } from '../lib/cn'
import { ground } from '../lib/ground'
import { gsap, useGSAP } from '../lib/gsapSetup'
import { matchMediaPreset } from '../lib/media'
import { outboundLinkProps } from '../lib/outboundLink'
import { revealOnce } from '../lib/reveal'
import SceneSlot from '../scene/SceneSlot'

/** CH6 — 다시 검정. 컨택트 + 크롭 워드마크(스크럽 패럴랙스) */
export default function Close() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = matchMediaPreset(({ motion }) => {
        if (!motion) return
        revealOnce(gsap.utils.toArray<HTMLElement>('[data-rv]'))

        gsap.fromTo(
          '[data-close-mark]',
          { yPercent: 36 },
          {
            yPercent: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom bottom',
              scrub: true,
            },
          },
        )
      })
      return () => mm.revert()
    },
    { scope: sectionRef },
  )

  return (
    <section
      ref={sectionRef}
      className={cn(
        ground.dark,
        'relative flex min-h-screen flex-col justify-center gap-[6vh] overflow-hidden px-[var(--pad)] pt-[20vh]',
      )}
      id="contact"
    >
      <div>
        <Display
          data-rv
          as="h2"
          className="text-[clamp(40px,6vw,96px)] leading-[0.95] font-extrabold tracking-[-0.02em]"
        >
          Contact
        </Display>
        <div data-rv className="mt-5 flex flex-wrap gap-4 py-2">
          {CONTACT_LINKS.map((link) => (
            <Pill
              key={link.href}
              strength={0.4}
              href={link.href}
              target={link.external ? '_blank' : undefined}
              {...outboundLinkProps(link.href)}
            >
              {link.label}
            </Pill>
          ))}
        </div>
      </div>

      <Hairline
        as="footer"
        className="mb-[clamp(90px,16vw,240px)] flex justify-between py-4 text-muted"
      >
        <Label>© 2026 KIM BOMI</Label>
        <Label>{EMAIL}</Label>
      </Hairline>

      <SceneSlot
        object={{ kind: 'contact' }}
        fallbackSrc="/images/3d/contact.webp"
        className="absolute bottom-[clamp(110px,18vw,280px)] left-1/2 h-[clamp(160px,22vw,320px)] w-[min(90vw,760px)] -translate-x-1/2"
      />

      <Display
        data-close-mark
        className="pointer-events-none absolute right-0 bottom-0 left-0 translate-y-[18%] text-center text-[clamp(130px,24vw,380px)] leading-[0.78]"
        aria-hidden
      >
        BOMI.
      </Display>
    </section>
  )
}
