/* eslint-disable react/no-array-index-key */
import React, { useMemo, useCallback, useState, useRef, useEffect } from "react"
import useSWR, { useSWRPages } from "swr"
import ReactPlaceholder from "react-placeholder"
import styled from "styled-components"
import { useParams } from "react-router-dom"
import discoverMorePage from "./connecDiscoverMoreReducer"
import { shuffle } from "../../../utils"
import { PlaceHolderKeyframes } from "../../../shared/PlaceHolderAnimation.styled"
import Label from "../../components/Label"
import PlaySongsBar from "../../components/PlaySongsBar"
import { SpinnerLoading } from "../../../shared/Spinner"
import MediaItemList from "../../components/MediaItemList"
import { usePaginationMediaItems } from "../../components/ScrollPaginationMediaItems"

const NoData = styled.div`
  text-align: center;
  color: ${props => props.theme.fg};
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
  font-weight: bold;
  padding: 6px 12px;
  border-radius: 200px;
  line-height: 1em;
  transition: all 0.3s;
  background-color: ${props => props.theme.secondary};
  &[data-selected="true"] {
    transform: scale(1.3);
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
  const pageContainerRef = useRef()
  const params = useParams()
  const [selectedCat, setSelectedCat] = useState(0)
  const [selectedOrder, setSelectedOrder] = useState("HOT")

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

  const { pageFetch, getUrl } = PAGE_REQUEST[params.type]

  const onLabelClick = useCallback(e => {
    let selectedIndex = e.target.getAttribute("data-index")
    selectedIndex = selectedIndex == null ? null : selectedIndex * 1
    setSelectedCat(selectedIndex)
  }, [])

  const onOrderClick = useCallback(e => {
    const clickedOrder = e.target.getAttribute("data-order")
    if (clickedOrder && clickedOrder === e.target.innerHTML) {
      setSelectedOrder(clickedOrder)
    }
  }, [])

  const { pages, isLoadingMore, isReachingEnd, loadMore } = useSWRPages(
    "discover-more",
    ({ offset, withSWR }) => {
      const { data } = withSWR(
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useSWR(
          getUrl(selectedOrder, shuffledCats[selectedCat], offset || 0),
          pageFetch,
          {
            revalidateOnFocus: false,
          },
        ),
      )
      if (data?.list === null) {
        return <NoData>无结果</NoData>
      }
      return (
        <MediaItemList
          list={data?.list ?? new Array(2).fill({ type: params.type })}
        />
      )
    },
    // one page's SWR => offset of next page
    (SWR, index) => {
      if (SWR.data.more) return index + 1
    },
    [selectedCat, selectedOrder],
  )

  const onScroll = useCallback(() => {
    const isBottom =
      window.scrollY + 30 >
      pageContainerRef.current.clientHeight - window.innerHeight
    console.log("isBottom", isBottom, isReachingEnd)
    if (isBottom && !isReachingEnd) {
      loadMore()
    }
  }, [isReachingEnd, loadMore])

  useEffect(() => {
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [onScroll])

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
              {index === selectedCat && isLoadingMore && (
                <StyledSpinnerLoading />
              )}

              {`#${cat}`}
            </StyledLoadingLabel>
          </ReactPlaceholder>
        ))}
      </LabelWrapper>
      <ListWrapper>
        <ListHeader>
          <PlaySongsBar withoutBar songsCount={0} />
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
        <ListContent>{pages}</ListContent>
      </ListWrapper>
    </DiscoverMorePage>
  )
}

export default DiscoverMore
