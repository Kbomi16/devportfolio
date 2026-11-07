export type CursorKind = 'open' | 'view' | 'read'

export const CURSOR_LABELS: Record<CursorKind, string> = {
  open: 'OPEN',
  view: 'VIEW',
  read: 'READ',
}

const isCursorKind = (value: string | undefined): value is CursorKind =>
  value === 'open' || value === 'view' || value === 'read'

export const cursorKindOf = (element: Element | null): CursorKind | null => {
  const host = element?.closest<HTMLElement>('[data-cursor]')
  const kind = host?.dataset.cursor
  return isCursorKind(kind) ? kind : null
}
