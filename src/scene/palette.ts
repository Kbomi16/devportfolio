import type { WorkItem } from '../content/works'

export type Tone = 'ink' | 'ground' | 'mid' | 'neon'

const TOKEN: Record<Tone, string> = {
  ink: '--dark-ink',
  ground: '--dark-ground',
  mid: '--ink-2',
  neon: '--neon',
}

export const tokenColor = (token: string): string =>
  getComputedStyle(document.documentElement).getPropertyValue(token).trim()

export const toneColor = (tone: Tone): string => tokenColor(TOKEN[tone])

export const CASE_TONES: Record<WorkItem['slug'], { base: Tone; accent: Tone }> = {
  tcc: { base: 'ground', accent: 'neon' },
  sites: { base: 'ink', accent: 'neon' },
  alleo: { base: 'neon', accent: 'ground' },
  money: { base: 'ink', accent: 'ground' },
  isle: { base: 'mid', accent: 'neon' },
}
