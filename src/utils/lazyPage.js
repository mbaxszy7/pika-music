/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/button-has-type */
/* eslint-disable react/jsx-filename-extension */
import React from "react"
import styled from "styled-components"
import Loadable from "react-loadable"
import Spinner from "../shared/Spinner"

const PagePlaceHolder = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: ${props => props.theme.mg};
`

function Loading(props) {
  if (props.error) {
    console.log(props.error)
    return (
      <div>
        Error!
        <button onClick={props.retry}>Retry</button>
      </div>
    )
  }
  if (props.pastDelay) {
    return (
      <PagePlaceHolder>
        <Spinner style={{ marginTop: "33.3%" }} />
      </PagePlaceHolder>
    )
  }
  return null
}

export const Discover = Loadable({
  loader: () =>
    import(
      /* webpackChunkName: 'discover',  webpackPrefetch:true  */ "../client/pages/Discover/Discover.jsx"
    ),
  loading: Loading,
})

export const ArtistDetails = Loadable({
  loader: () =>
    import(
      /* webpackChunkName: 'artist-details',  webpackPrefetch:true  */ "../client/pages/ArtistDetails/ArtistDetails"
    ),
  loading: Loading,
})

export const ArtistMediaDetails = Loadable({
  loader: () =>
    import(
      /* webpackChunkName: 'artist-media-details',  webpackPrefetch:true  */ "../client/pages/ArtistMediaDetails/ArtistMediaDetails"
    ),
  loading: Loading,
})

export const AlbumDetails = Loadable({
  loader: () =>
    import(
      /* webpackChunkName: 'album-details',  webpackPrefetch:true  */ "../client/pages/AlbumDetails/AlbumDetails"
    ),
  loading: Loading,
})
