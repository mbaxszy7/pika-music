/* eslint-disable react/require-default-props */
/* eslint-disable react/forbid-prop-types */
import { hot } from "react-hot-loader/root"
import React from "react"
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

const App = ({ store, isServer, staticContext, location }) => {
  const IsomophicRouter = isServer ? (
    <StaticRouter location={location} context={staticContext}>
      {renderRoutes(routes)}
    </StaticRouter>
  ) : (
    <BrowserRouter>{renderRoutes(routes)}</BrowserRouter>
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
}

export default isDEV ? hot(App) : App
