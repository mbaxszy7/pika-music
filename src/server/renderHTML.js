/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/react-in-jsx-scope */
import React from "react"
import { matchRoutes } from "react-router-config"
import { renderToString } from "react-dom/server"
import { ServerStyleSheet, StyleSheetManager } from "styled-components"
import routes from "../routes"
import getReduxStore from "../store/storeCreator"
import { ssrRoutesCapture } from "../utils/loadable"
import App from "../client/App"

const setInitialDataToStore = async (matchedRoutes, ctx) => {
  // const axiosInstance = createAxiosInstance({ ctx, isSSR: !isCSR, isDEV })
  const store = getReduxStore({ ua: ctx.state.ua })
  await Promise.all(
    matchedRoutes.map(item => {
      return Promise.resolve(item.route?.loadData?.(store, ctx) ?? null)
    }),
  ).catch(error => {
    // eslint-disable-next-line no-console
    console.error("renderHTML 41,", error)
  })

  return store
}

const renderHTML = async (ctx, staticContext) => {
  let clientContent = ""
  let styleTags = ""
  const sheet = new ServerStyleSheet()
  const ssrRoutes = await ssrRoutesCapture(routes)
  const matchedRoutes = matchRoutes(ssrRoutes, ctx.request.path)
  // 如果有组件是配置csr为就退出ssr
  if (matchedRoutes.some(({ route }) => route.component.csr)) {
    return {
      styleTags,
      clientContent,
      state: "",
    }
  }
  const store = await setInitialDataToStore(matchedRoutes, ctx)

  try {
    clientContent = renderToString(
      <StyleSheetManager sheet={sheet.instance}>
        <App
          store={store}
          isServer
          location={ctx.request.path}
          staticContext={staticContext}
          ssrRoutes={ssrRoutes}
        />
      </StyleSheetManager>,
    )

    styleTags = sheet.getStyleTags()
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log("renderHTML 70,", error)
  } finally {
    sheet.seal()
  }

  return {
    styleTags,
    clientContent,
    state: JSON.stringify(store.getState()),
  }
}

export default renderHTML
