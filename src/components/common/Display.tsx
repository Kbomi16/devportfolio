import type { ElementType } from 'react'
import { cn } from '../../lib/cn'
import type { PolymorphicProps } from '../../lib/polymorphic'

const DISPLAY_CLASS = 'font-display font-extrabold tracking-[-0.02em] leading-none'

export default function Display<T extends ElementType = 'span'>({
  as,
  className,
  ...props
}: PolymorphicProps<T>) {
  const Comp = as ?? 'span'
  return <Comp className={cn(DISPLAY_CLASS, className)} {...props} />
}
