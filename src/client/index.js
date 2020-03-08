/* eslint-disable no-console */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable import/extensions */
import React from "react"
import ReactDOM from "react-dom"
import VConsole from "vconsole"
import Loadable from "react-loadable"
import "intersection-observer"
import App from "./App.jsx"
import getReduxStore from "../store/storeCreator.js"
import { isCSR, isDEV } from "../utils"

// eslint-disable-next-line no-underscore-dangle
const payloadData = window.__INITIAL_STATE__?.state ?? {}

if (
  (payloadData.config?.ua.device.type === "mobile" && isDEV) ||
  window.location.hash === "#test"
) {
  // eslint-disable-next-line no-unused-vars
  const vConsole = new VConsole()
}

const store = getReduxStore(payloadData)

const render = isCSR ? ReactDOM.render : ReactDOM.hydrate

if (isCSR) {
  render(<App store={store} />, document.getElementById("root"))
} else {
  Loadable.preloadReady().then(() => {
    render(<App store={store} />, document.getElementById("root"))
  })
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/public/service-worker.js", { scope: "/" })
      .then(registration => {
        console.log("SW registered: ", registration)
      })
      .catch(registrationError => {
        console.log("SW registration failed: ", registrationError)
      })
  })
}
