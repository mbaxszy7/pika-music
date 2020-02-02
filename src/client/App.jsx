/* eslint-disable react/forbid-prop-types */
import { hot } from "react-hot-loader/root"
import React from "react"
import { Reset } from "styled-reset"
import PropTypes from "prop-types"
import { BrowserRouter } from "react-router-dom"
import { Provider } from "react-redux"
import { renderRoutes } from "react-router-config"
import routes from "../routes"
import { isCSR } from "../utils"
import ReactPlaceholderStyle from "../shared/ReactPlaceholder.styled"
import AppTheme from "../shared/AppTheme"

const App = ({ store }) => (
  <>
    <Reset />
    <ReactPlaceholderStyle />
    <AppTheme>
      <Provider store={store}>
        <BrowserRouter>{renderRoutes(routes)}</BrowserRouter>
      </Provider>
    </AppTheme>
  </>
)

App.propTypes = {
  store: PropTypes.object.isRequired,
}

export default isCSR ? hot(App) : App