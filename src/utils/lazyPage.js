/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/button-has-type */
/* eslint-disable react/jsx-filename-extension */
import React from "react"
import styled from "styled-components"
import Spinner from "../shared/Spinner"
import Dialog from "../shared/Dialog"
import { asyncLoader } from "../shared/Loadable"

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
    return (
      <Dialog
        title="加载出错"
        dialogText={props.error?.message ?? "重新加载试一下吧～"}
        isShowConfirm
        isShowCancel={false}
        onConfirmClick={props.retry}
      />
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

export const Discover = asyncLoader({
  loader: () =>
    import(
      /* webpackChunkName: 'discover',  webpackPrefetch:true  */ "../client/pages/Discover/Discover.jsx"
    ),
  loading: Loading,
})

export const ArtistDetails = asyncLoader({
  loader: () =>
    import(
      /* webpackChunkName: 'artist-details',  webpackPrefetch:true  */ "../client/pages/ArtistDetails/ArtistDetails"
    ),
  loading: Loading,
})

export const ArtistMediaDetails = asyncLoader({
  loader: () =>
    import(
      /* webpackChunkName: 'artist-media-details',  webpackPrefetch:true  */ "../client/pages/ArtistMediaDetails/ArtistMediaDetails"
    ),
  loading: Loading,
})

export const AlbumDetails = asyncLoader({
  loader: () =>
    import(
      /* webpackChunkName: 'album-details',  webpackPrefetch:true  */ "../client/pages/AlbumDetails/AlbumDetails"
    ),
  loading: Loading,
})

export const PlayListDetails = asyncLoader({
  loader: () =>
    import(
      /* webpackChunkName: 'play-list-details',  webpackPrefetch:true  */ "../client/pages/PlayListDetails/PlayListDetails"
    ),
  loading: Loading,
})

export const MVPlay = asyncLoader({
  loader: () =>
    import(
      /* webpackChunkName: 'mv-play',  webpackPrefetch:true  */ "../client/pages/MVPlay/MVPlay"
    ),
  loading: Loading,
})

export const DiscoverMore = asyncLoader({
  loader: () =>
    import(
      /* webpackChunkName: 'discover-more',  webpackPrefetch:true  */ "../client/pages/DiscoverMore/DiscoverMore"
    ),
  loading: Loading,
})

export const SearchMore = asyncLoader({
  loader: () =>
    import(
      /* webpackChunkName: 'search-more',  webpackPrefetch:true  */ "../client/pages/SearchMore/SearchMore"
    ),
  loading: Loading,
})
