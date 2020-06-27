import React from "react"
import { matchRoutes } from "react-router-config"
import { renderToNodeStream } from "react-dom/server"
import { ServerStyleSheet } from "styled-components"
import routes from "../routes"
import getReduxStore from "../store/storeCreator"
import { ssrRoutesCapture } from "../shared/Loadable"
import App from "../client/App"

const setInitialDataToStore = async (matchedRoutes, ctx) => {
  // const axiosInstance = createAxiosInstance({ ctx, isSSR: !isCSR, isDEV })
  const store = getReduxStore({
    config: {
      ua: ctx.state.ua,
    },
  })
  await Promise.race([
    Promise.allSettled(
      matchedRoutes.map(item => {
        return Promise.resolve(
          item.route?.component?.getInitialProps?.(store, ctx) ?? null,
        )
      }),
    ),
    new Promise(resolve => setTimeout(() => resolve(), 600)),
  ]).catch(error => {
    // eslint-disable-next-line no-console
    console.error("renderHTML 41,", error)
  })

  return store
}

const renderHTML = async (ctx, staticContext) => {
  let jsxStream = ""
  const sheet = new ServerStyleSheet()
  const ssrRoutes = await ssrRoutesCapture(routes, ctx.request.path)
  const matchedRoutes = matchRoutes(ssrRoutes, ctx.request.path)
  // 如果有组件是配置csr为就退出ssr
  if (matchedRoutes.some(({ route }) => route.component.csr)) {
    return {
      jsxStream,
      state: "",
    }
  }
  const store = await setInitialDataToStore(matchedRoutes, ctx)

  try {
    const markup = sheet.collectStyles(
      // eslint-disable-next-line react/jsx-filename-extension
      <App
        store={store}
        isServer
        location={ctx.request.path}
        staticContext={staticContext}
        ssrRoutes={ssrRoutes}
      />,
    )
    jsxStream = sheet.interleaveWithNodeStream(renderToNodeStream(markup))
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log("renderHTML 70,", error)
  } finally {
    sheet.seal()
  }

  return {
    jsxStream,
    state: JSON.stringify(store.getState()),
  }
}

export default renderHTML
