/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/button-has-type */
/* eslint-disable react/jsx-filename-extension */
import React from "react"
import styled from "styled-components"
import Spinner from "../shared/Spinner"
import Dialog from "../shared/Dialog"

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

class Loadable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      Comp: null,
      error: null,
      isTimeout: false,
      retry: this.load,
    }
  }

  // eslint-disable-next-line react/sort-comp
  raceLoading = () => {
    return new Promise((_, reject) => {
      setTimeout(
        () => reject(new Error("timeout")),
        this.props.pastDelay || 200,
      )
    })
  }

  load = async () => {
    const { loader } = this.props
    try {
      const loadedComp = await Promise.race([this.raceLoading(), loader()])

      this.setState({
        isTimeout: false,
        Comp: loadedComp.default ? loadedComp.default : loadedComp,
      })
      // this.setState({
      //   error: { message: "test" },
      // })
    } catch (e) {
      if (e.message === "timeout") {
        this.setState({
          isTimeout: true,
        })
        this.load()
      } else {
        this.setState({
          error: e,
        })
      }
    }
  }

  componentDidMount() {
    this.load()
  }

  render() {
    const { error, isTimeout, Comp, retry } = this.state
    const { loading } = this.props
    if (error) return loading({ error, retry })
    if (isTimeout) return loading({ pastDelay: true })
    if (Comp) return <Comp {...this.props} />
    return null
  }
}

const AsyncLoader = ({ loader, loading, pastDelay }) => {
  return props => (
    <Loadable
      loader={loader}
      loading={loading}
      pastDelay={pastDelay}
      {...props}
    />
  )
}

export const Discover = AsyncLoader({
  loader: () =>
    import(
      /* webpackChunkName: 'discover',  webpackPrefetch:true  */ "../client/pages/Discover/Discover.jsx"
    ),
  loading: Loading,
})

export const ArtistDetails = AsyncLoader({
  loader: () =>
    import(
      /* webpackChunkName: 'artist-details',  webpackPrefetch:true  */ "../client/pages/ArtistDetails/ArtistDetails"
    ),
  loading: Loading,
})

export const ArtistMediaDetails = AsyncLoader({
  loader: () =>
    import(
      /* webpackChunkName: 'artist-media-details',  webpackPrefetch:true  */ "../client/pages/ArtistMediaDetails/ArtistMediaDetails"
    ),
  loading: Loading,
})

export const AlbumDetails = AsyncLoader({
  loader: () =>
    import(
      /* webpackChunkName: 'album-details',  webpackPrefetch:true  */ "../client/pages/AlbumDetails/AlbumDetails"
    ),
  loading: Loading,
})

export const PlayListDetails = AsyncLoader({
  loader: () =>
    import(
      /* webpackChunkName: 'play-list-details',  webpackPrefetch:true  */ "../client/pages/PlayListDetails/PlayListDetails"
    ),
  loading: Loading,
})

export const MVPlay = AsyncLoader({
  loader: () =>
    import(
      /* webpackChunkName: 'mv-play',  webpackPrefetch:true  */ "../client/pages/MVPlay/MVPlay"
    ),
  loading: Loading,
})

export const DiscoverMore = AsyncLoader({
  loader: () =>
    import(
      /* webpackChunkName: 'discover-more',  webpackPrefetch:true  */ "../client/pages/DiscoverMore/DiscoverMore"
    ),
  loading: Loading,
})

export const SearchMore = AsyncLoader({
  loader: () =>
    import(
      /* webpackChunkName: 'search-more',  webpackPrefetch:true  */ "../client/pages/SearchMore/SearchMore"
    ),
  loading: Loading,
})
