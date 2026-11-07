import { MEDIA } from './media'

let webglSupport: boolean | null = null

const supportsWebGL = (): boolean => {
  if (webglSupport !== null) return webglSupport
  try {
    const canvas = document.createElement('canvas')
    webglSupport = Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'))
  } catch {
    webglSupport = false
  }
  return webglSupport
}

/** 데스크톱·fine pointer·motion 허용·WebGL 지원일 때만 true. 아니면 WebP 폴백 */
export const canRender3D = (): boolean =>
  typeof window !== 'undefined' &&
  window.matchMedia(MEDIA.motion).matches &&
  window.matchMedia(MEDIA.desktop).matches &&
  window.matchMedia(MEDIA.finePointer).matches &&
  supportsWebGL()
