import type { ElementType } from 'react'
import { cn } from '../../lib/cn'
import type { PolymorphicProps } from '../../lib/polymorphic'

const LABEL_CLASS = 'font-ui text-[10.5px] font-medium tracking-[0.15em] uppercase'

export default function Label<T extends ElementType = 'span'>({
  as,
  className,
  ...props
}: PolymorphicProps<T>) {
  const Comp = as ?? 'span'
  return <Comp className={cn(LABEL_CLASS, className)} {...props} />
}
