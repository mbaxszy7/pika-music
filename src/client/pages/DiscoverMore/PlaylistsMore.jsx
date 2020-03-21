/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/require-default-props */
/* eslint-disable react/no-array-index-key */
import React, { useMemo, useCallback } from "react"
import styled from "styled-components"
import PropTypes from "prop-types"
import useSWR from "swr"
import { shuffle } from "../../../utils"
import discoverMorePage from "./connectDiscoverMoreReducer"
import PlaySongsBar from "../../components/PlaySongsBar"
import MediaItemList from "../../components/MediaItemList"
import MyPlaceholder from "../../../shared/MyPlaceholder"
import {
  LabelWrapper,
  StyledLoadingLabel,
  StyledSpinnerLoading,
  PlaceStyledLabel,
  ListWrapper,
  ListHeader,
  ListContent,
  Order,
  Orders,
} from "./styled"

const ORDERS = ["HOT", "NEW"]

const StyledLabelWrapper = styled(LabelWrapper)`
  margin-top: 10px;
`

const PlaylistsMore = ({
  onLabelClick,
  selectedLabel,
  selectedSubLabel,
  setSelectedSubLabel,
  listData,
  setListData,
  isLoading,
  resetPage,
  type,
}) => {
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

  const onOrderClick = useCallback(
    e => {
      const clickedOrder = e.target.getAttribute("data-order")
      if (clickedOrder && clickedOrder === e.target.innerHTML) {
        setSelectedSubLabel(prevClickedOrder => {
          if (clickedOrder === prevClickedOrder) {
            return prevClickedOrder
          }
          resetPage()
          setListData([])
          return clickedOrder
        })
      }
    },
    [resetPage, setListData, setSelectedSubLabel],
  )

  const handleLabelClick = useCallback(
    e => {
      const clickedLabel = e.target.getAttribute("data-label")
      onLabelClick(clickedLabel)
    },
    [onLabelClick],
  )

  return (
    <>
      <StyledLabelWrapper onClick={handleLabelClick}>
        {shuffledCats.map((cat, index) => (
          <MyPlaceholder
            customPlaceholder={<PlaceStyledLabel text="  " />}
            ready={!!cat}
            key={index}
          >
            <StyledLoadingLabel
              data-label={cat}
              data-selected={cat === selectedLabel}
            >
              {cat === selectedLabel && isLoading && <StyledSpinnerLoading />}

              {`#${cat}`}
            </StyledLoadingLabel>
          </MyPlaceholder>
        ))}
      </StyledLabelWrapper>
      <ListWrapper>
        <ListHeader>
          <PlaySongsBar withoutBar songsCount={listData.length} />
          <Orders onClick={onOrderClick}>
            {ORDERS.map(order => (
              <Order
                data-order={order}
                isSelected={selectedSubLabel === order}
                key={order}
              >
                {order}
              </Order>
            ))}
          </Orders>
        </ListHeader>
        <ListContent>
          <MediaItemList
            list={listData.length ? listData : new Array(2).fill({ type })}
          />
          {isLoading && <MediaItemList list={new Array(2).fill({ type })} />}
        </ListContent>
      </ListWrapper>
    </>
  )
}

PlaylistsMore.propTypes = {
  onLabelClick: PropTypes.func,
  selectedLabel: PropTypes.string,
  selectedSubLabel: PropTypes.string,
  setSelectedSubLabel: PropTypes.func,
  listData: PropTypes.array,
  setListData: PropTypes.func,
  isLoading: PropTypes.bool,
  resetPage: PropTypes.func,
  type: PropTypes.string,
}

export default PlaylistsMore
