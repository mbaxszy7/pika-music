/* eslint-disable import/no-named-as-default-member */
/* eslint-disable import/no-named-as-default */
import Koa from "koa"
import serve from "koa-static"
import mount from "koa-mount"
import logger from "koa-logger"
import renderHTML from "./renderHTML"
import uaParser from "./ua"

const app = new Koa()
app.use(logger())
app.use(mount("/public", serve("./public")))
app.use(uaParser)

app.use(async ctx => {
  const staticContext = {}
  const html = await renderHTML(ctx, staticContext)
  ctx.type = "text/html; charset=utf-8"
  ctx.body = html
})

app.on("error", err => {
  // eslint-disable-next-line no-console
  console.error("server error", err)
})

app.listen(7004, () => {
  // eslint-disable-next-line no-console
  console.log("music-motion server is listening on 7004")
})
