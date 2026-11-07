import type { ElementType } from 'react'
import { cn } from '../../lib/cn'
import type { PolymorphicProps } from '../../lib/polymorphic'
import { useMagneticFollow } from '../../lib/useMagneticFollow'

type MagneticButtonProps<T extends ElementType = 'button'> = PolymorphicProps<T> & {
  strength?: number
  innerStrength?: number
}

/** 마우스 위치에 따라 버튼과 내부 텍스트가 다른 강도로 끌려간다. zone은 inline-flex 래퍼. */
export default function MagneticButton<T extends ElementType = 'button'>({
  as,
  className,
  strength = 0.35,
  innerStrength,
  children,
  ...props
}: MagneticButtonProps<T>) {
  const { zoneRef, targetRef, innerRef } = useMagneticFollow(strength, innerStrength)
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
        <span ref={innerRef} className="inline-flex items-center justify-center">
          {children}
        </span>
      </Comp>
    </div>
  )
}
