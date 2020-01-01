/* eslint-disable react/jsx-filename-extension */
/* eslint-disable import/extensions */
import React from "react"
import { loadableReady } from "@loadable/component"
import ReactDOM from "react-dom"
import App from "./App.jsx"
import { getClientStore } from "../store/storeCreator.js"
import { isCSR } from "../utils"

const store = getClientStore(
  // eslint-disable-next-line no-underscore-dangle
  window.__INITIAL_STATE__?.state ?? {},
)

const render = isCSR ? ReactDOM.render : ReactDOM.hydrate

if (isCSR) {
  render(<App store={store} />, document.getElementById("root"))
} else {
  loadableReady(() => {
    render(<App store={store} />, document.getElementById("root"))
  })
}
