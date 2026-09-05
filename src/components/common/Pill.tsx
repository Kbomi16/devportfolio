import type { ElementType } from 'react'
import { cn } from '../../lib/cn'
import type { PolymorphicProps } from '../../lib/polymorphic'

const PILL_CLASS =
  'inline-flex items-center gap-2 rounded-full border border-hairline px-[18px] py-3 font-ui text-[11px] tracking-[0.12em] uppercase transition-[border-color] duration-[250ms] ease-linear hover:border-ink'

export default function Pill<T extends ElementType = 'a'>({
  as,
  className,
  ...props
}: PolymorphicProps<T>) {
  const Comp = as ?? 'a'
  return <Comp className={cn(PILL_CLASS, className)} {...props} />
}
