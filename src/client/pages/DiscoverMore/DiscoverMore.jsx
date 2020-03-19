/* eslint-disable react/no-array-index-key */
import React, { useCallback, useState, useRef, useEffect, memo } from "react"
import { useParams } from "react-router-dom"
import { awaitWrapper, throttle } from "../../../utils"
import { NoData, DiscoverMorePage } from "./styled"
import PageBack from "../../components/PageBack"
import discoverMorePage from "./connectDiscoverMoreReducer"
import PlaylistsMore from "./PlaylistsMore"
import NewSongsMore from "./NewSongsMore"
import { useIsomorphicEffect } from "../../../utils/hooks"

const PAGE_REQUEST = {
  playlist: {
    getUrl: (cat, offset, selectedOrder) => {
      return (
        cat &&
        `/api/top/playlist?limit=10&order=${selectedOrder ||
          "HOT"}&cat=${cat}&offset=${offset}`
      )
    },
    selector: ({ playlists, more }) => {
      return {
        list: playlists.map(playlist => {
          return {
            imgUrl: playlist.coverImgUrl,
            title: playlist.name,
            desc: `${playlist.trackCount}首`,
            type: "playlist",
            id: playlist.id,
          }
        }),
        more,
      }
    },
    PagePart: PlaylistsMore,
  },
  song: {
    getUrl: (type = 0) => `/api/top/song?type=${type}`,
    selector: ({ data: songs }) => {
      return {
        list: songs.map(song => {
          const artistNames = song.artists.length
            ? [...song.artists]
                .reverse()
                .reduce((ac, a) => `${a.name} ${ac}`, "")
            : ""
          return {
            imgUrl: song.album.picUrl,
            title: `${song.name}`,
            desc: `${artistNames} · ${song.album.name}`,
            artistId: song.artists[0]?.id,
            albumId: song.album.id,
            artistName: artistNames,
            albumName: song.album.name,
            type: "song",
            id: song.id,
          }
        }),
        more: false,
      }
    },
    PagePart: NewSongsMore,
  },
}

const PAGE_TYPES = {
  PLAYLIST: "playlist",
}

const DiscoverMore = memo(() => {
  const page = useRef(0)
  const pageContainerRef = useRef()
  const params = useParams()

  const [isLoading, setIsLoading] = useState(false)
  const [isMore, setIsMore] = useState(true)
  const [selectedLabel, setSelectedLabel] = useState(() => {
    if (params.type === PAGE_TYPES.PLAYLIST) {
      return "全部"
    }
  })
  const [listData, setListData] = useState([])
  const [selectedSubLabel, setSelectedSubLabel] = useState(() => {
    if (params.type === PAGE_TYPES.PLAYLIST) {
      return "HOT"
    }
  })

  useIsomorphicEffect(() => {
    document.getElementById("root").scrollTop = 0
  }, [])

  const resetPage = useCallback(() => {
    page.current = 0
  }, [])

  const { getUrl, selector, PagePart } = PAGE_REQUEST[params.type]

  const onLabelClick = useCallback(
    clickedLabel => {
      if (clickedLabel != null) {
        setSelectedLabel(prevSelectedLabel => {
          if (clickedLabel === prevSelectedLabel) {
            return prevSelectedLabel
          }
          setIsMore(true)
          resetPage()
          setListData([])
          return clickedLabel
        })
      }
    },
    [resetPage],
  )

  const requestList = useCallback(
    url => {
      return discoverMorePage.fetcher
        .get(url)
        .then(res => res.data)
        .then(selector)
    },
    [selector],
  )

  const request = useCallback(async () => {
    const url = getUrl(selectedLabel, page.current, selectedSubLabel)
    if (!url) return Promise.resolve()
    setIsLoading(true)
    const [error, data] = await awaitWrapper(requestList)(url)
    setIsLoading(false)
    if (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    } else if (data) {
      setIsMore(data.more)
      setListData(prev => {
        return [...prev, ...data.list]
      })
    }
  }, [getUrl, requestList, selectedLabel, selectedSubLabel])

  const onScroll = useCallback(() => {
    const isBottom =
      window.scrollY + 30 >
      pageContainerRef.current.clientHeight - window.innerHeight
    if (isBottom && !isLoading && isMore) {
      page.current += 1
      request()
    }
  }, [isLoading, isMore, request])

  useEffect(() => {
    const throttled = throttle(onScroll, 300)
    window.addEventListener("scroll", throttled)
    return () => window.removeEventListener("scroll", throttled)
  }, [onScroll])

  useEffect(() => {
    request()
  }, [request])

  return (
    <DiscoverMorePage ref={pageContainerRef}>
      <PageBack />
      <PagePart
        onLabelClick={onLabelClick}
        selectedLabel={selectedLabel}
        selectedSubLabel={selectedSubLabel}
        setSelectedSubLabel={setSelectedSubLabel}
        isLoading={isLoading}
        listData={listData}
        setListData={setListData}
        resetPage={resetPage}
        type={params.type}
        request={request}
      />
      {!isMore && <NoData>到底啦～</NoData>}
    </DiscoverMorePage>
  )
})

DiscoverMore.csr = true

export default DiscoverMore
