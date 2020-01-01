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

const App = ({ store }) => (
  <Provider store={store}>
    {isCSR && <Reset />}
    <BrowserRouter>{renderRoutes(routes)}</BrowserRouter>
  </Provider>
)

App.propTypes = {
  store: PropTypes.object.isRequired,
}

export default isCSR ? hot(App) : App
