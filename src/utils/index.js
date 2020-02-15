export const awaitWrapper = pFn => {
  return async (...args) => {
    try {
      const res = await Promise.resolve(
        typeof pFn === "function" ? pFn(...args) : pFn,
      )
      return [null, res]
    } catch (error) {
      return [error, null]
    }
  }
}

// eslint-disable-next-line no-undef
export const isCSR = RENDER_OPTS === "client"

export const isDEV = process.env.NODE_ENV === "development"

export const clamp = (num, min, max) => {
  if (num < min) return min
  if (num > max) return max
  return num
}

export const lazyMoment = () =>
  import(/* webpackChunkName: 'moment',  webpackPrefetch:true  */ "moment")

export const shuffle = arr =>
  arr.slice().sort(() => (Math.random() > 0.5 ? 1 : -1))

export const throttle = (fn, wait) => {
  let timer = null
  let isFirstInvoked = false
  function throttled(...args) {
    const context = this
    if (!isFirstInvoked) {
      fn.apply(context, args)
      isFirstInvoked = true
      return
    }
    if (timer) {
      return
    }
    timer = setTimeout(() => {
      clearTimeout(timer)
      timer = null
      fn.apply(context, args)
    }, wait)
  }
  return throttled
}
