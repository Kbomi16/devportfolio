import type { ElementType } from 'react'
import { cn } from '../../lib/cn'
import type { PolymorphicProps } from '../../lib/polymorphic'

const OUTLINE_CLASS = 'text-transparent [-webkit-text-stroke:1px_currentColor]'

export default function OutlineText<T extends ElementType = 'span'>({
  as,
  className,
  ...props
}: PolymorphicProps<T>) {
  const Comp = as ?? 'span'
  return <Comp className={cn(OUTLINE_CLASS, className)} {...props} />
}
