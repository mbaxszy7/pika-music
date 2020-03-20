/* eslint-disable react/require-default-props */
/* eslint-disable react/forbid-prop-types */
import { hot } from "react-hot-loader/root"
import React, { useState, useMemo } from "react"
import { SWRConfig, mutate } from "swr"
import PropTypes from "prop-types"
import { BrowserRouter, StaticRouter } from "react-router-dom"
import { Provider } from "react-redux"
import { renderRoutes } from "react-router-config"
import routes from "../routes"
import { isDEV } from "../utils"
import ReactPlaceholderStyle from "../shared/ReactPlaceholder.styled"
import AppTheme from "../shared/AppTheme"
import AppCss from "../shared/AppCss.styled"
import PWAService from "../shared/PWAService"
import PageTip from "../shared/PageTip"

const ClientRouter = () => {
  const [timeoutTips, setTimeoutTips] = useState([])
  const [errorTips, setErrorTips] = useState([])
  const subRoutes = useMemo(() => renderRoutes(routes), [])
  return (
    <SWRConfig
      value={{
        onLoadingSlow: key => {
          if (key.includes("/api/check/music")) return
          setTimeoutTips([
            {
              key,
              text: `··( 数据好像加载超时了\n请检查网络`,
              action: () => mutate(key),
            },
          ])
        },
        onErrorRetry: (err, key, option, revalidate) => {
          if (key.includes("/api/check/music")) return

          setErrorTips(pre => {
            const isPreTip = pre.findIndex(tip => tip.key === key) !== -1
            if (isPreTip) return pre
            return [
              ...pre,
              {
                key,
                text: `··( 数据好像加载错误了\n点击重试`,
                action: () => revalidate({ retryCount: 1 }),
              },
            ]
          })
        },
      }}
    >
      <BrowserRouter>
        <PageTip tips={[...errorTips, ...timeoutTips]} />
        {subRoutes}
      </BrowserRouter>
    </SWRConfig>
  )
}

const App = ({ store, isServer, staticContext, location, ssrRoutes }) => {
  const IsomophicRouter = isServer ? (
    <StaticRouter location={location} context={staticContext}>
      {renderRoutes(ssrRoutes)}
    </StaticRouter>
  ) : (
    <ClientRouter />
  )

  return (
    <>
      <AppCss />
      <ReactPlaceholderStyle />
      <AppTheme>
        <Provider store={store}>
          {!isServer && <PWAService />}
          {IsomophicRouter}
        </Provider>
      </AppTheme>
    </>
  )
}

App.propTypes = {
  store: PropTypes.object.isRequired,
  isServer: PropTypes.bool,
  location: PropTypes.string,
  staticContext: PropTypes.object,
  ssrRoutes: PropTypes.array,
}

export default isDEV ? hot(App) : App
