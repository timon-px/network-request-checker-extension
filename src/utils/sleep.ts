export const sleep = async (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const waitMinDelay = async (
  startTime: number,
  minDelay: number = 200
) => {
  const elapsed = Date.now() - startTime
  const remaining = Math.max(minDelay - elapsed, 0)

  if (remaining > 0) await sleep(remaining)
}
