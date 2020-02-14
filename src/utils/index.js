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
