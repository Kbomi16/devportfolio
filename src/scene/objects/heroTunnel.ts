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

/** 복도 좌우 벽. 월드 좌표라 가까워질수록 화면 밖으로 빠진다 */
export const TUNNEL_LANE = 2.55

/** 다음 도형이 확연히 작아지도록 벌린 간격 */
export const TUNNEL_GAP = 4.4

/** 가까운 도형이 카드처럼 크게 보이게 */
export const TUNNEL_SCALE = 2.35

/** 첫 쌍이 이미 가까이 있는 시작 */
export const TUNNEL_START = 0.35

/** 마지막 도형이 카메라 뒤를 지나는 끝 */
export const TUNNEL_END = TUNNEL_GAP * (TUNNEL_STATIONS.length - 1) + 9
