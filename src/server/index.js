/* eslint-disable import/no-named-as-default-member */
/* eslint-disable import/no-named-as-default */
import Koa from "koa"
import path from "path"
import serve from "koa-static"
import mount from "koa-mount"
import views from "koa-views"
import logger from "koa-logger"
import renderHTML from "./renderHTML"
import uaParser from "./ua"

const app = new Koa()
app.use(logger())
app.use(async (ctx, next) => {
  if (ctx.path.includes(".js")) {
    ctx.set({ "Service-Worker-Allowed": "/" })
  }
  await next()
})
app.use(
  views(path.join(process.cwd(), "/public", "./views"), {
    map: { hbs: "handlebars" },
    extension: "hbs",
    cache: true,
  }),
)
app.use(mount("/images", serve("./public/images")))
app.use(mount("/public", serve("./public")))
app.use(uaParser)

app.use(async ctx => {
  const staticContext = {}
  const { styleTags, clientContent, state, dynamicBundles } = await renderHTML(
    ctx,
    staticContext,
  )
  if (staticContext.NOT_FOUND) {
    ctx.status = 404
  }
  await ctx.render("main", {
    styleTags,
    clientContent,
    state,
    dynamicBundles,
  })
})

app.on("error", err => {
  // eslint-disable-next-line no-console
  console.error("server error", err)
})

app.listen(5000, () => {
  // eslint-disable-next-line no-console
  console.log("music-motion server is listening on 5000")
})
