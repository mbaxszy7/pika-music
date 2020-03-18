/* eslint-disable no-console */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable import/extensions */
import React from "react"
import ReactDOM from "react-dom"
import Loadable from "react-loadable"
import "intersection-observer"
import App from "./App.jsx"
import getReduxStore from "../store/storeCreator.js"
import { isDEV } from "../utils"

// eslint-disable-next-line no-underscore-dangle
let payloadData = {}
try {
  payloadData = JSON.parse(
    document.getElementById("data-context")?.value ?? "{}",
  )
} catch (e) {
  console.log(e)
}

const store = getReduxStore(payloadData)

const render = isDEV ? ReactDOM.render : ReactDOM.hydrate

if (isDEV) {
  render(<App store={store} />, document.getElementById("root"))
} else {
  Loadable.preloadReady().then(() => {
    render(<App store={store} />, document.getElementById("root"))
  })
}
