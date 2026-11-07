import { invalidateScene } from './sceneBus'

export const HERO_PIN = {
  desktop: '+=2000%',
  mobile: '+=1200%',
} as const

let heroProgress = 0

/** Hero 핀 타임라인의 스크럽된 진행도(0~1). 3D 오브젝트가 같은 구간을 따라간다 */
export const getHeroProgress = (): number => heroProgress

export const setHeroProgress = (value: number): void => {
  heroProgress = value
  invalidateScene()
}
