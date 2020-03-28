/* eslint-disable no-console */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable import/extensions */
import React from "react"
import ReactDOM from "react-dom"
import LogRocket from "logrocket"
import setupLogRocketReact from "logrocket-react"
import "intersection-observer"
import App from "./App.jsx"
import getReduxStore from "../store/storeCreator.js"
import { isDEV } from "../utils"
import routes from "../routes"
import { clientPreloadReady } from "../shared/Loadable"

LogRocket.init("xz31mz/react-log")
LogRocket.identify(Date.now())
setupLogRocketReact(LogRocket)

// eslint-disable-next-line no-underscore-dangle
let payloadData = {}
try {
  const ele = document.getElementById("data-context")
  payloadData = JSON.parse(ele?.value?.trim?.() ? ele?.value : "{}")
} catch (e) {
  LogRocket.captureException(e)
  console.log(e)
}

const store = getReduxStore(payloadData)

const render = isDEV ? ReactDOM.render : ReactDOM.hydrate

if (isDEV) {
  render(<App store={store} />, document.getElementById("root"))
} else {
  clientPreloadReady(routes).then(() => {
    render(<App store={store} />, document.getElementById("root"))
  })
}
