import { HERO_IMAGE, HERO_VIDEO_SRC } from '../content/about'

const TIMEOUT_MS = 4000

const withTimeout = (task: Promise<unknown>): Promise<void> =>
  Promise.race([
    task.then(
      () => undefined,
      () => undefined,
    ),
    new Promise<void>((resolve) => window.setTimeout(resolve, TIMEOUT_MS)),
  ])

const loadImage = (src: string): Promise<void> => {
  const image = new Image()
  image.src = src
  return image.decode()
}

const loadVideoMetadata = (src: string): Promise<void> =>
  new Promise((resolve) => {
    const video = document.createElement('video')
    const handleDone = () => resolve()
    video.preload = 'metadata'
    video.muted = true
    video.addEventListener('loadedmetadata', handleDone, { once: true })
    video.addEventListener('error', handleDone, { once: true })
    video.src = src
  })

/** 실제 로딩 진행도(0~1)를 onProgress로 보고, 전부 끝나면 resolve */
export const preloadAssets = (onProgress: (ratio: number) => void): Promise<void> => {
  const tasks = [
    document.fonts.ready,
    loadImage(HERO_IMAGE.src),
    loadVideoMetadata(HERO_VIDEO_SRC),
  ]
  let done = 0

  return Promise.all(
    tasks.map((task) =>
      withTimeout(task).then(() => {
        done += 1
        onProgress(done / tasks.length)
      }),
    ),
  ).then(() => undefined)
}
