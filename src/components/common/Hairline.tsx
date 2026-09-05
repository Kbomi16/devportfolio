import type { ElementType } from 'react'
import { cn } from '../../lib/cn'
import type { PolymorphicProps } from '../../lib/polymorphic'

const HAIRLINE_CLASS = 'border-t border-hairline'

export default function Hairline<T extends ElementType = 'div'>({
  as,
  className,
  ...props
}: PolymorphicProps<T>) {
  const Comp = as ?? 'div'
  return <Comp className={cn(HAIRLINE_CLASS, className)} {...props} />
}
