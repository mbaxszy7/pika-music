/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/react-in-jsx-scope */
import React from "react"
import Loadable from "react-loadable"
import { getBundles } from "react-loadable/webpack"
import { Provider } from "react-redux"
import { StaticRouter } from "react-router-dom"
import { matchRoutes, renderRoutes } from "react-router-config"
import { renderToString } from "react-dom/server"
import { ServerStyleSheet, StyleSheetManager } from "styled-components"
import routes from "../routes"
import getReduxStore from "../store/storeCreator"
import stats from "../../public/react-loadable.json"
import ReactPlaceholderStyle from "../shared/ReactPlaceholder.styled"
import AppTheme from "../shared/AppTheme"
import AppCss from "../shared/AppCss.styled"

const setInitialDataToStore = async ctx => {
  // const axiosInstance = createAxiosInstance({ ctx, isSSR: !isCSR, isDEV })
  const store = getReduxStore({ ua: ctx.state.ua })
  const matchedRoutes = matchRoutes(routes, ctx.request.path)

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
  const store = await setInitialDataToStore(ctx)
  const sheet = new ServerStyleSheet()
  let clientContent = ""
  let styleTags = ""
  const modules = []
  let dynamicBundles = []
  try {
    clientContent = renderToString(
      <Loadable.Capture report={moduleName => modules.push(moduleName)}>
        <StyleSheetManager sheet={sheet.instance}>
          <>
            <AppCss />
            <ReactPlaceholderStyle />
            <AppTheme>
              <Provider store={store}>
                <StaticRouter
                  location={ctx.request.path}
                  context={staticContext}
                >
                  {/* 渲染 / 根路由 */}
                  {renderRoutes(routes)}
                </StaticRouter>
              </Provider>
            </AppTheme>
          </>
        </StyleSheetManager>
      </Loadable.Capture>,
    )
    const bundles = getBundles(stats, modules)
    dynamicBundles = bundles.map(bundle => {
      return `<script type="text/javascript" src="/public/${bundle.file}"></script>`
    })

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
    dynamicBundles: dynamicBundles.join(""),
  }
}

export default renderHTML
