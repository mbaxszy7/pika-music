/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/require-default-props */
/* eslint-disable react/no-array-index-key */
import React, { useMemo, useCallback } from "react"
import PropTypes from "prop-types"
import ReactPlaceholder from "react-placeholder"
import useSWR from "swr"
import { useHistory } from "react-router-dom"
import { shuffle } from "../../../utils"
import discoverMorePage from "./connectDiscoverMoreReducer"
import PlaySongsBar from "../../components/PlaySongsBar"

import MediaItemList from "../../components/MediaItemList"
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

  const onPlaylistItemClick = useCallback(
    item => {
      history.push(`/playlist/${item.id}`)
    },
    [history],
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
      <LabelWrapper onClick={handleLabelClick}>
        {shuffledCats.map((cat, index) => (
          <ReactPlaceholder
            customPlaceholder={<PlaceStyledLabel text="  " />}
            showLoadingAnimation
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
            onItemClick={onPlaylistItemClick}
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
