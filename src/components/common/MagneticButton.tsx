import type { ElementType } from 'react'
import { cn } from '../../lib/cn'
import type { PolymorphicProps } from '../../lib/polymorphic'
import { useMagneticFollow } from '../../lib/useMagneticFollow'

type MagneticButtonProps<T extends ElementType = 'button'> = PolymorphicProps<T> & {
  strength?: number
}

/** 마우스 위치에 따라 살짝 끌려가는 버튼·링크. zone은 inline-flex 래퍼. */
export default function MagneticButton<T extends ElementType = 'button'>({
  as,
  className,
  strength = 0.35,
  children,
  ...props
}: MagneticButtonProps<T>) {
  const { zoneRef, targetRef } = useMagneticFollow(strength)
  const Comp = as ?? 'button'
  const isButton = Comp === 'button'
  const buttonType = isButton
    ? ((props as { type?: 'button' | 'submit' | 'reset' }).type ?? 'button')
    : undefined

  return (
    <div ref={zoneRef} className="inline-flex">
      <Comp
        ref={targetRef as never}
        className={cn(
          'will-change-transform motion-reduce:transform-none motion-reduce:will-change-auto',
          className,
        )}
        {...props}
        {...(isButton ? { type: buttonType } : {})}
      >
        {children}
      </Comp>
    </div>
  )
}
