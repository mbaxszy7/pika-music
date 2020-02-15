/* eslint-disable react/no-array-index-key */
import React, { useMemo, useCallback, useState, useRef, useEffect } from "react"
import useSWR from "swr"
import axios from "axios"
import ReactPlaceholder from "react-placeholder"
import styled from "styled-components"
import { useParams, useHistory } from "react-router-dom"
import discoverMorePage from "./connecDiscoverMoreReducer"
import { PlaceHolderKeyframes } from "../../../shared/PlaceHolderAnimation.styled"
import Label from "../../components/Label"
import PlaySongsBar from "../../components/PlaySongsBar"
import { SpinnerLoading } from "../../../shared/Spinner"
import MediaItemList from "../../components/MediaItemList"
import { awaitWrapper, throttle, shuffle } from "../../../utils"

const NoData = styled.div`
  text-align: center;
  color: ${props => props.theme.fg};
  margin-top: 40px;
`

const StyledSpinnerLoading = styled(SpinnerLoading)`
  & {
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(50%, -50%);
    width: 13px;
    height: 13px;
    z-index: 3;
    margin-right: 4px;
    vertical-align: top;
  }
`

const DiscoverMorePage = styled.div`
  min-height: 100vh;
  padding: 30px 15px 0 15px;
`

const LabelWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  min-height: 160px;
  align-content: flex-start;
`

const StyledLabel = styled(Label)`
  & {
    position: relative;
    top: initial;
    bottom: initial;
    left: initial;
    right: initial;
  }
`
const PlaceStyledLabel = styled(StyledLabel)`
  & {
    width: 55px;
    height: 24px;
    margin-top: 12px;
    margin-right: 8px;
    animation: ${PlaceHolderKeyframes} 1.5s infinite;
  }
`

const StyledLoadingLabel = styled.div`
  margin-top: 12px;
  margin-right: 8px;
  position: relative;
  display: flex;
  align-items: center;
  font-size: 12px;
  padding: 6px 12px;
  border-radius: 200px;
  line-height: 1em;
  transition: all 0.3s;
  background-color: ${props => props.theme.secondary};
  font-weight: 400;
  &[data-selected="true"] {
    transform: scale(1.2);
    margin-left: 10px;
    margin-right: 20px;
    display: block;
  }
`

const ListWrapper = styled.div`
  margin-top: 30px;
`

const ListHeader = styled.div`
  display: flex;
  justify-content: space-between;
`

const Order = styled.span(({ theme, isSelected }) => ({
  color: isSelected ? theme.dg : "black",
  fontSize: 16,
}))

const Orders = styled.div`
  font-weight: bold;
  margin-right: 30px;
  ${Order} :first-of-type {
    &::after {
      content: " | ";
      color: black;
    }
  }
`

const ListContent = styled.div`
  margin-top: 20px;
  padding-left: 10px;
  padding-bottom: 40px;
`

const ORDERS = ["HOT", "NEW"]

const PAGE_REQUEST = {
  playlist: {
    pageFetch: discoverMorePage.requestPlaylist,
    getUrl: (selectedOrder, cat, offset) => {
      return (
        cat &&
        `/api/top/playlist?limit=10&order=${selectedOrder}&cat=${cat}&offset=${offset}`
      )
    },
  },
}

const DiscoverMore = () => {
  const page = useRef(0)
  const pageContainerRef = useRef()
  const params = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [isMore, setIsMore] = useState(false)
  const [selectedCat, setSelectedCat] = useState(0)
  const [selectedOrder, setSelectedOrder] = useState("HOT")
  const [listData, setListData] = useState([])

  const history = useHistory()

  const { data: playlistCats } = useSWR(
    "/api/playlist/catlist",
    discoverMorePage.requestPlaylistCat,
  )

  const shuffledCats = useMemo(() => {
    if (playlistCats) {
      return ["全部"].concat(shuffle(playlistCats))
    }
    return ["全部"].concat(new Array(8).fill(""))
  }, [playlistCats])

  const { getUrl } = PAGE_REQUEST[params.type]

  const onLabelClick = useCallback(e => {
    const selectedIndex = e.target.getAttribute("data-index")
    if (selectedIndex != null) {
      setSelectedCat(prevSelectedCat => {
        if (selectedIndex * 1 === prevSelectedCat) {
          return prevSelectedCat
        }
        page.current = 0
        setListData([])
        return selectedIndex * 1
      })
    }
  }, [])

  const onOrderClick = useCallback(e => {
    const clickedOrder = e.target.getAttribute("data-order")
    if (clickedOrder && clickedOrder === e.target.innerHTML) {
      setSelectedOrder(prevClickedOrder => {
        if (clickedOrder === prevClickedOrder) {
          return prevClickedOrder
        }
        page.current = 0
        setListData([])
        return clickedOrder
      })
    }
  }, [])

  const requestList = useCallback(() => {
    const url = getUrl(selectedOrder, shuffledCats[selectedCat], page.current)
    if (!url) return Promise.resolve()
    return axios
      .get(url)
      .then(res => res.data)
      .then(({ playlists, more }) => {
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
      })
  }, [getUrl, selectedCat, selectedOrder, shuffledCats])

  const request = useCallback(async () => {
    setIsLoading(true)
    const [error, data] = await awaitWrapper(requestList)()
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
  }, [requestList])

  useEffect(() => {
    request()
  }, [request])

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

  const onPlaylistItemClick = useCallback(
    item => {
      history.push(`/playlist/${item.id}`)
    },
    [history],
  )

  return (
    <DiscoverMorePage ref={pageContainerRef}>
      <LabelWrapper onClick={onLabelClick}>
        {shuffledCats.map((cat, index) => (
          <ReactPlaceholder
            customPlaceholder={<PlaceStyledLabel text="  " />}
            showLoadingAnimation
            ready={!!cat}
            key={index}
          >
            <StyledLoadingLabel
              data-index={index}
              data-selected={index === selectedCat}
            >
              {index === selectedCat && isLoading && <StyledSpinnerLoading />}

              {`#${cat}`}
            </StyledLoadingLabel>
          </ReactPlaceholder>
        ))}
      </LabelWrapper>
      <ListWrapper>
        <ListHeader>
          <PlaySongsBar withoutBar songsCount={listData.length} />
          <Orders onClick={onOrderClick}>
            {ORDERS.map(order => (
              <Order
                data-order={order}
                isSelected={selectedOrder === order}
                key={order}
              >
                {order}
              </Order>
            ))}
          </Orders>
        </ListHeader>
        <ListContent>
          <MediaItemList
            onItemClick={onPlaylistItemClick}
            list={
              listData.length
                ? listData
                : new Array(2).fill({ type: params.type })
            }
          />
          {isLoading && (
            <MediaItemList list={new Array(2).fill({ type: params.type })} />
          )}
          {!isMore && <NoData>到底啦～</NoData>}
        </ListContent>
      </ListWrapper>
    </DiscoverMorePage>
  )
}

export default DiscoverMore
