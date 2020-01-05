/* eslint-disable react/button-has-type */
/* eslint-disable react/jsx-filename-extension */
import React from "react"
import Loadable from "react-loadable"

function Loading(props) {
  if (props.error) {
    return (
      <div>
        Error!
        <button onClick={props.retry}>Retry</button>
      </div>
    )
  }
  if (props.pastDelay) {
    return <div>Loading...</div>
  }
  return null
}

export const Home = Loadable({
  loader: () =>
    import(/* webpackChunkName: 'home'  */ "../client/Home/Home.jsx"),
  loading: Loading,
  delay: 300,
})

export const Details = Loadable({
  loader: () =>
    import(/* webpackChunkName: 'details'  */ "../client/Details/Details.jsx"),
  loading: Loading,
  delay: 300,
})
export const Header = Loadable({
  loader: () =>
    import(/* webpackChunkName: 'header'  */ "../client/Header.jsx"),
  loading: Loading,
  delay: 300,
})
