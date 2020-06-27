/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-globals */
import { precacheAndRoute } from "workbox-precaching/precacheAndRoute"
import { setCacheNameDetails, skipWaiting, clientsClaim } from "workbox-core"
import {
  NetworkFirst,
  CacheFirst,
  StaleWhileRevalidate,
} from "workbox-strategies"
import { ExpirationPlugin } from "workbox-expiration"
import { CacheableResponsePlugin } from "workbox-cacheable-response"
import { registerRoute } from "workbox-routing/registerRoute"

// 预缓存设置
setCacheNameDetails({
  prefix: "pika",
})
skipWaiting()
clientsClaim()
precacheAndRoute(self.__WB_MANIFEST)

registerRoute(
  new RegExp("/"),
  new NetworkFirst({
    cacheName: "whole-site",
  }),
)

// // 站点png图片拦截为webp
// registerRoute(/\.png$/, ({ event }) => {
//   let supportWebp = false
//   if (event.request.headers.has("accept")) {
//     supportWebp = event.request.headers.get("accept").includes("webp")
//   }

//   if (supportWebp) {
//     const req = event.request.clone()
//     const returnUrl = `${req.url.substr(0, req.url.lastIndexOf("."))}.webp`
//     event.respondWith(
//       (async () => {
//         // 创建或者打开pika-webp
//         const pikaWebpCache = await caches.open("pika-webp")
//         // 匹配缓存
//         const cacheRes = await pikaWebpCache.match(returnUrl)
//         // 如果匹配缓存，则立即返回
//         if (cacheRes) {
//           return cacheRes
//         }
//         // 不匹配缓存， 去fetch
//         const [error, response] = await awaitWrapper(fetch)(returnUrl, {
//           mode: "no-cors",
//         })

//         // 如果fetch出错，则返回png缓存（precache的）
//         if (error) {
//           const res = await caches.match(event.request)
//           if (res) return res
//         } else if (response) {
//           // fetch成功，则放入pika-webp， 并返回
//           if (response) {
//             pikaWebpCache.put(returnUrl, response.clone())
//             return response
//           }
//         }
//       })(),
//     )
//   }
// })

// Images
registerRoute(
  /^https?:\/\/p[1-4]\.music\.126\.net/,
  new CacheFirst({
    cacheName: "net-easy-p",
    plugins: [
      new ExpirationPlugin({
        // 要缓存的最大条目数。使用最少的条目将被删除，直到达到最大值。
        maxEntries: 50,
        maxAgeSeconds: 60 * 60 * 24 * 4,
        // 如果超出了可用的存储配额，是否选择将此缓存用于自动删除。
        purgeOnQuotaError: true,
      }),
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  }),
)

// 首页banner
registerRoute(
  /https?:\/\/111\.229\.78\.115\/api\/banner\?type=2/,
  new NetworkFirst({
    cacheName: "api-banner",
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24,
        purgeOnQuotaError: true,
      }),
    ],
  }),
)

// 首页个性歌曲推荐
registerRoute(
  /https?:\/\/111\.229\.78\.115\/api\/personalized\/newsong/,
  new NetworkFirst({
    cacheName: "api-personalized-newsong",
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24,
        purgeOnQuotaError: true,
      }),
    ],
  }),
)

// 首页歌单
registerRoute(
  /https?:\/\/111\.229\.78\.115\/api\/top\/playlist\?limit=8&order=hot/,
  new NetworkFirst({
    cacheName: "api-playlist",
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24,
        purgeOnQuotaError: true,
      }),
    ],
  }),
)

// 首页新歌
registerRoute(
  /https?:\/\/111\.229\.78\.115\/api\/top\/song\?type=0/,
  new StaleWhileRevalidate({
    cacheName: "api-songs",
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24,
        purgeOnQuotaError: true,
      }),
    ],
  }),
)

// 首页专辑
registerRoute(
  /https?:\/\/111\.229\.78\.115\/api\/album\/newest/,
  new NetworkFirst({
    cacheName: "api-albums",
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24,
        purgeOnQuotaError: true,
      }),
    ],
  }),
)

// 首页独家MV
registerRoute(
  /https?:\/\/111\.229\.78\.115\/api\/personalized\/privatecontent/,
  new StaleWhileRevalidate({
    cacheName: "api-mvs",
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24,
        purgeOnQuotaError: true,
      }),
    ],
  }),
)
