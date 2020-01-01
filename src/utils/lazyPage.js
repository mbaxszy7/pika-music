import React from "react"
import loadable from "@loadable/component"

export const Home = loadable(
  () => import(/* webpackChunkName: 'home'  */ "../client/Home.jsx"),
  {
    fallback: <div>Loading...</div>,
  },
)
export const Details = loadable(
  () => import(/* webpackChunkName: 'details'  */ "../client/Details.jsx"),
  {
    fallback: <div>Loading...</div>,
  },
)
export const Header = loadable(
  () => import(/* webpackChunkName: 'header'  */ "../client/Header.jsx"),
  {
    fallback: <div>Loading...</div>,
  },
)
