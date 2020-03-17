/* eslint-disable no-console */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable import/extensions */
import React from "react"
import ReactDOM from "react-dom"
import Loadable from "react-loadable"
import "intersection-observer"
import App from "./App.jsx"
import getReduxStore from "../store/storeCreator.js"
import { isCSR } from "../utils"

// eslint-disable-next-line no-underscore-dangle
const payloadData = window.__INITIAL_STATE__?.state ?? {}

const store = getReduxStore(payloadData)

const render = isCSR ? ReactDOM.render : ReactDOM.hydrate

if (isCSR) {
  render(<App store={store} />, document.getElementById("root"))
} else {
  Loadable.preloadReady().then(() => {
    render(<App store={store} />, document.getElementById("root"))
  })
}
