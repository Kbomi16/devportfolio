import type { WorkItem } from '../../content/works'

export type TunnelStation = {
  slug: WorkItem['slug']
  side: -1 | 1
  variant: 0 | 1
}

/** 예전 카드 터널과 같은 좌우 교차. 깊이는 280px 간격에 맞춘다 */
export const TUNNEL_STATIONS: TunnelStation[] = [
  { slug: 'tcc', side: -1, variant: 0 },
  { slug: 'sites', side: 1, variant: 0 },
  { slug: 'alleo', side: -1, variant: 0 },
  { slug: 'money', side: 1, variant: 0 },
  { slug: 'isle', side: -1, variant: 0 },
  { slug: 'tcc', side: 1, variant: 1 },
  { slug: 'sites', side: -1, variant: 1 },
  { slug: 'money', side: 1, variant: 1 },
  { slug: 'isle', side: -1, variant: 1 },
]

/** 복도 좌우. 제목 바깥, 화면 안에 들어오게 둔 월드 좌표 */
export const TUNNEL_LANE = 3.35

/** 첫 쌍 뒤의 간격. 시작 화면에는 두 개만 보이게 */
export const TUNNEL_GAP = 8.8

/** 뒤에 따라오는 도형 */
export const TUNNEL_SCALE = 2.05

/** 처음 둘. 글자 밴드 밖, 위·아래에 서는 크기 */
export const TUNNEL_OPEN_SCALE = 1.86

/** 처음 둘만 글자 위·아래로 갈라 놓는다. 나머지는 복도 높이 */
export const openingOffset = (index: number): { x: number; y: number } | null => {
  if (index === 0) return { x: -3.28, y: 1.52 }
  if (index === 1) return { x: 3.32, y: -1.64 }
  return null
}

/** 이 거리보다 멀면 시작 화면에서 숨긴다 */
export const TUNNEL_SHOW = 12.2

export const TUNNEL_START = 0.15

/** 마지막 도형이 카메라 뒤를 지나는 끝 */
export const TUNNEL_END = TUNNEL_GAP * (TUNNEL_STATIONS.length - 1) + 8

/** 처음 둘은 같은 깊이, 나머지는 한 칸씩 뒤로 */
export const stationDepth = (index: number): number => (index < 2 ? 0 : (index - 1) * TUNNEL_GAP)
