/* eslint-disable no-console */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable import/extensions */
import React from "react"
import { mutate } from "swr"
import ReactDOM from "react-dom"
import "intersection-observer"
import App from "./App.jsx"
import getReduxStore from "../store/storeCreator.js"
import { isDEV } from "../utils"
import routes from "../routes"
import { clientPreloadReady } from "../shared/Loadable"

// eslint-disable-next-line no-underscore-dangle
let payloadData = {}
try {
  const ele = document.getElementById("data-context")
  payloadData = JSON.parse(ele?.value?.trim?.() ? ele?.value : "{}")
} catch (e) {
  console.log(e)
}

const store = getReduxStore(payloadData)
// console.warn(payloadData)
const render = isDEV ? ReactDOM.render : ReactDOM.hydrate

if (isDEV) {
  render(<App store={store} />, document.getElementById("root"))
} else {
  navigator.serviceWorker.addEventListener("message", async event => {
    if (event.data.meta === "workbox-broadcast-update") {
      const { cacheName } = event.data.payload
      console.warn(cacheName)
      mutate(cacheName)
    }
  })
  clientPreloadReady(routes).then(() => {
    render(<App store={store} />, document.getElementById("root"))
  })
}
