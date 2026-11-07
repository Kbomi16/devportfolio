import { useRef } from 'react'
import Display from '../components/common/Display'
import { MARQUEE_ROWS } from '../content/about'
import { cn } from '../lib/cn'
import { ground } from '../lib/ground'
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsapSetup'
import { matchMediaPreset } from '../lib/media'
import { onScroll } from '../lib/useLenis'

const BASE_SPEED = 0.6
const MAX_BOOST = 14
const REPEAT = 4

/** 줄마다 반대 방향으로 흐르고, 스크롤 속도로 가속·방향 반전된다. 화면 밖에서는 멈춘다. */
export default function Marquee() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = matchMediaPreset(({ motion }) => {
        if (!motion) return

        const rows = gsap.utils.toArray<HTMLElement>('[data-marquee-row]').map((row, index) => {
          const firstSet = row.firstElementChild
          return {
            setX: gsap.quickSetter(row, 'x', 'px'),
            x: 0,
            width: firstSet instanceof HTMLElement ? firstSet.offsetWidth : 0,
            base: index % 2 === 0 ? -1 : 1,
            firstSet,
          }
        })

        let direction = 1
        let boost = 0
        let active = false

        const measure = () => {
          rows.forEach((row) => {
            if (row.firstSet instanceof HTMLElement) row.width = row.firstSet.offsetWidth
          })
        }

        const tick = (_time: number, deltaTime: number) => {
          if (!active) return
          const step = deltaTime / 16.67
          boost *= 0.92
          rows.forEach((row) => {
            if (row.width === 0) return
            row.x += row.base * direction * (BASE_SPEED + boost) * step
            row.x = gsap.utils.wrap(-row.width, 0, row.x)
            row.setX(row.x)
          })
        }

        const offScroll = onScroll(({ velocity, direction: next }) => {
          if (next !== 0) direction = next
          boost = Math.min(Math.abs(velocity) * 0.6, MAX_BOOST)
        })

        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          onToggle: (self) => {
            active = self.isActive
          },
        })
        ScrollTrigger.addEventListener('refresh', measure)
        gsap.ticker.add(tick)

        return () => {
          offScroll()
          gsap.ticker.remove(tick)
          ScrollTrigger.removeEventListener('refresh', measure)
        }
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
        'relative overflow-hidden border-y border-hairline py-[clamp(20px,3vw,40px)]',
      )}
      aria-hidden
    >
      {MARQUEE_ROWS.map((phrases, rowIndex) => (
        <div
          key={rowIndex}
          data-marquee-row
          className="flex w-max will-change-transform motion-reduce:will-change-auto"
        >
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center">
              {Array.from({ length: REPEAT }, (_, repeat) =>
                phrases.map((phrase) => (
                  <span key={`${repeat}-${phrase}`} className="flex items-center">
                    <Display className="px-[0.4em] text-[clamp(44px,8vw,128px)] leading-[1.05] whitespace-pre">
                      {phrase}
                    </Display>
                    <span className="size-[clamp(10px,1.1vw,18px)] shrink-0 rounded-full bg-neon" />
                  </span>
                )),
              )}
            </div>
          ))}
        </div>
      ))}
    </section>
  )
}
