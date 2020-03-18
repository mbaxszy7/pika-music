import UA from "ua-device"

const uaParser = async (ctx, next) => {
  try {
    ctx.state.ua = new UA(ctx.req.headers["user-agent"])
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log("ua parse error", e)
  }
  await next()
}

export default uaParser
