import type { ElementType } from 'react'
import { cn } from '../../lib/cn'
import type { PolymorphicProps } from '../../lib/polymorphic'
import { useMagneticFollow } from '../../lib/useMagneticFollow'

export const PILL_CLASS =
  'inline-flex items-center gap-2 rounded-full border border-hairline px-[18px] py-3 font-ui text-[11px] tracking-[0.12em] uppercase transition-[border-color] duration-[250ms] ease-linear hover:border-ink'

type PillProps<T extends ElementType = 'a'> = PolymorphicProps<T> & {
  strength?: number
  innerStrength?: number
}

export default function Pill<T extends ElementType = 'a'>({
  as,
  className,
  strength = 0.32,
  innerStrength,
  children,
  ...props
}: PillProps<T>) {
  const { zoneRef, targetRef, innerRef } = useMagneticFollow(strength, innerStrength)
  const Comp = as ?? 'a'

  return (
    <div ref={zoneRef} className="inline-flex">
      <Comp
        ref={targetRef as never}
        className={cn(
          PILL_CLASS,
          'will-change-transform motion-reduce:transform-none motion-reduce:will-change-auto',
          className,
        )}
        {...props}
      >
        <span ref={innerRef} className="inline-flex items-center gap-2">
          {children}
        </span>
      </Comp>
    </div>
  )
}
