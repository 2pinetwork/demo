const delays = [ 1, 3, 7 ]

export const wait = delay => {
  return new Promise(resolve => setTimeout(resolve, delay))
}

export const callAndRetry = async (fn, depth = 0) => {
  try {
    return await fn()

  } catch (error) {
    if (depth > 2) throw error

    await wait(delays[depth] * 1000)

    return callAndRetry(fn, depth + 1)
  }
}

export const loopWithBackOff = (fn, { delay, onSuccess, onError }) => {
  let timeoutId, isActive = true

  const run = async () => {
    try {
      const result = await callAndRetry(fn)

      if (isActive) {
        onSuccess(result, cancel)
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error(error)
      }

      onError(error, cancel)
    } finally {
      if (isActive) {
        timeoutId = setTimeout(run, delay)
      }
    }
  }

  const cancel = () => {
    isActive = false

    clearTimeout(timeoutId)
  }

  // Start loop
  run()

  return cancel
}
