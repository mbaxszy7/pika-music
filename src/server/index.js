/* eslint-disable import/no-named-as-default-member */
/* eslint-disable import/no-named-as-default */
import Koa from "koa"
import path from "path"
import serve from "koa-static"
import mount from "koa-mount"
import fs from "fs"
import logger from "koa-logger"
import renderHTML from "./renderHTML"
import uaParser from "./middlewares/ua"

function pipe(from, to, options) {
  return new Promise((resolve, reject) => {
    from.pipe(to, options)
    from.on("error", reject)
    from.on("end", resolve)
  })
}

const template = fs.readFileSync(
  path.join(process.cwd(), "/public", "./views/index.html"),
  "utf-8",
)

const replace = "<!--clientContent-->"

const app = new Koa()

app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    ctx.status = err.status || 500
    ctx.body = "server error"
    ctx.app.emit("error", err, ctx)
  }
})

app.use(logger())
app.use(async (ctx, next) => {
  if (ctx.path.includes("service-worker.js")) {
    ctx.set({ "Service-Worker-Allowed": "/" })
  }
  await next()
})
app.use(mount("/images", serve("./public/images")))
app.use(mount("/public", serve("./public")))
app.use(uaParser)

app.use(async ctx => {
  const staticContext = {}
  const { jsxStream, state } = await renderHTML(ctx, staticContext)
  if (staticContext.NOT_FOUND) {
    ctx.status = 404
  }
  const ret = template.replace("<!--state-->", JSON.stringify(state))
  // const preloadImgs = [
  //   ...(state?.discover?.personalizedSongs
  //     ?.slice?.(0, 3)
  //     .map?.(song => song?.picUrl) || []),
  //   state?.discover?.bannerList?.[0]?.pic,
  // ]

  // if (preloadImgs.filter(i => !!i).length) {
  //   ret = ret.replace(
  //     "<!--preload-->",
  //     preloadImgs
  //       .map(
  //         img => `<link rel="preload" href=${img?.replace?.(
  //           "http://",
  //           "https://",
  //         )} as="image">
  // `,
  //       )
  //       .join("\n"),
  //   )
  // }

  const jsxReplace = ret.indexOf(replace)
  const resOne = ret.slice(0, jsxReplace)
  const resTwo = ret.slice(jsxReplace + replace.length)
  ctx.status = 200
  ctx.res.write(resOne)
  if (jsxStream) {
    await pipe(jsxStream, ctx.res, { end: false })
  }

  ctx.res.write(resTwo)
  ctx.res.end()
})

app.on("error", err => {
  // eslint-disable-next-line no-console
  console.error("server error", err)
})

app.listen(5000, () => {
  // eslint-disable-next-line no-console
  console.log("music-motion server is listening on 5000")
})
