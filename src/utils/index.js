/* eslint-disable import/prefer-default-export */
export const awaitWrapper = async pFn => {
  try {
    const res = await Promise.resolve(typeof pFn === "function" ? pFn() : pFn)
    return [null, res]
  } catch (error) {
    return [error, null]
  }
}

export const isCSR = RENDER_OPTS === "client"
