import React, { useMemo, useEffect, useRef, memo, useCallback } from "react"
import { useLocation } from "react-router-dom"
import styled from "styled-components"
import queryString from "query-string"
import ScrollPaginationMediaItems from "../../components/ScrollPaginationMediaItems"
import artistMediaDetailsPage from "./connectArtistMediaDetailsReducer"
import PageBack from "../../components/PageBack"
import { useIsomorphicEffect } from "../../../utils/hooks"

const ListWrapper = styled.div`
  margin-top: 60px;
  width: 100%;
`

const PageBackWrapper = styled.div`
  position: fixed;
  padding: 25px 15px 15px 15px;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 501;
  background-color: ${props => props.theme.mg};
`

const ArtistMediaDetailsPage = styled.div`
  min-height: 100vh;
  padding: 30px 15px 40px 15px;
  overflow: hidden;
`

const MediaTypeToRequest = {
  bigAlbum: {
    title: "专辑",
    getUrl: (id, offset) => `/api/artist/album?id=${id}&offset=${offset}`,
    fetch: artistMediaDetailsPage.requestBigAlbums,
  },
  biggerMV: {
    title: "视频",
    getUrl: (id, offset) => `/api/artist/mv?id=${id}&offset=${offset}`,
    fetch: artistMediaDetailsPage.requestBigMVs,
  },
  song: {
    title: "热曲",
    getUrl: (id, offset) => `/api/artists?id=${id}&offset=${offset}`,
    fetch: async url => {
      const data = await artistMediaDetailsPage.requestSongs(url)
      return data[0]
    },
  },
}

const ArtistMediaDetails = memo(() => {
  const pageContainerRef = useRef()

  const location = useLocation().search
  const { type, artistId } = useMemo(() => queryString.parse(location), [
    location,
  ])
  const { getUrl, fetch: pageFetch, title } = useMemo(
    () => MediaTypeToRequest[type],
    [type],
  )

  useIsomorphicEffect(() => {
    document.getElementById("root").scrollTop = 0
  }, [])

  useEffect(() => {
    window.title = title
  }, [title])

  const scrollRef = useCallback(() => pageContainerRef.current, [])
  const getFetchUrl = useCallback(getUrl.bind(null, artistId), [
    artistId,
    getUrl,
  ])

  return (
    <ArtistMediaDetailsPage ref={pageContainerRef}>
      <PageBackWrapper>
        <PageBack title={title} />
      </PageBackWrapper>
      <ListWrapper>
        <ScrollPaginationMediaItems
          keyPage="artist-media-details"
          getScrollRef={scrollRef}
          pageFetch={pageFetch}
          getUrl={getFetchUrl}
          mockLoadingOption={{
            type,
          }}
        />
      </ListWrapper>
    </ArtistMediaDetailsPage>
  )
})

export default ArtistMediaDetails
