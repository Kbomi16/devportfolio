const TIMEOUT_MS = 4000

const withTimeout = (task: Promise<unknown>): Promise<void> =>
  Promise.race([
    task.then(
      () => undefined,
      () => undefined,
    ),
    new Promise<void>((resolve) => window.setTimeout(resolve, TIMEOUT_MS)),
  ])

/** 실제 로딩 진행도(0~1)를 onProgress로 보고, 전부 끝나면 resolve */
export const preloadAssets = (onProgress: (ratio: number) => void): Promise<void> => {
  const tasks = [document.fonts.ready]
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
