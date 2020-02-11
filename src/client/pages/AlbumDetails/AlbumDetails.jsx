/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { memo, useRef, useCallback } from "react"
import { useSelector } from "react-redux"
import ReactPlaceholder from "react-placeholder"
import queryString from "query-string"
import { useLocation } from "react-router-dom"
import useSWR from "swr"
import albumDetailsPage from "./connectAlbumDetailsReducer"
import PageBack from "../../components/PageBack"
import MediaItemList from "../../components/MediaItemList"
import { useEffectShowModal, useEleScrollValue } from "../../../utils/hooks"
import { clamp } from "../../../utils"
import Avatar from "../../../shared/Avatar"
import InnerModal from "../../../shared/InnerModal"
import PlaySongsBar from "../../components/PlaySongsBar"
import * as Styled from "./styled"

const AlbumBrief = memo(
  ({ publishTime, name, artist, albumDesc, shareCount, likedCount }) => {
    const {
      isShowModal,
      isShowContent,
      onModalOpen,
      onModalClose,
    } = useEffectShowModal()
    return (
      <>
        {isShowModal && (
          <InnerModal>
            <Styled.StyledDescModal isShow={isShowContent}>
              <Styled.StyledCount>
                <div className="count">{shareCount}</div>
                <div className="name">播放</div>
              </Styled.StyledCount>
              <Styled.StyledCount>
                <div className="count">{likedCount}</div>
                <div className="name">点赞</div>
              </Styled.StyledCount>
              <Styled.StyledDesc isWhole>{albumDesc}</Styled.StyledDesc>
              <div className="close" onClick={onModalClose} data-close="true">
                &times;
              </div>
            </Styled.StyledDescModal>
          </InnerModal>
        )}
        <ReactPlaceholder
          type="textRow"
          ready={!!publishTime}
          style={{ width: 100 }}
        >
          <Styled.PublishTime>{publishTime}</Styled.PublishTime>
        </ReactPlaceholder>
        <ReactPlaceholder
          type="textRow"
          ready={!!name}
          style={{ width: 150, marginTop: 12, height: "1.5em" }}
        >
          <Styled.AlbumName>{name}</Styled.AlbumName>
        </ReactPlaceholder>
        <Styled.Artist>
          <Avatar size="small" url={artist?.avatar} />
          <ReactPlaceholder
            type="textRow"
            ready={!!artist?.name}
            style={{ width: 120, marginLeft: 15, marginTop: 0 }}
          >
            <Styled.ArtistName>{artist?.name}</Styled.ArtistName>
          </ReactPlaceholder>
        </Styled.Artist>
        <ReactPlaceholder
          type="textRow"
          ready={albumDesc != null}
          style={{ marginTop: 20 }}
        >
          {albumDesc !== "" && (
            <Styled.StyledDesc onClick={onModalOpen}>
              {albumDesc}
            </Styled.StyledDesc>
          )}
        </ReactPlaceholder>
      </>
    )
  },
)

const AlbumDetails = memo(() => {
  const scrollContainerRef = useRef()
  const scrollValueFormatter = useCallback(scrollValue => {
    // eslint-disable-next-line no-nested-ternary
    const op = clamp(scrollValue, 0, 1)
    return op === 0 ? 2 : op.toFixed(2)
  }, [])

  const callScrollContainerRef = useCallback(
    () => scrollContainerRef.current,
    [],
  )
  const headerOpacity = useEleScrollValue(
    callScrollContainerRef,
    scrollValueFormatter,
  )
  const locationSearch = useLocation().search
  const { id: albumId } = queryString.parse(locationSearch)
  const initialAlbumData = useSelector(state => state.albumDetails.details)
  const { data: albumDetails } = useSWR(
    `/api/album?id=${albumId}`,
    albumDetailsPage.requestAlbumDetails,
    {
      initialData: initialAlbumData,
    },
  )

  return (
    <Styled.AlbumDetailsPage>
      <Styled.PageBackWrapper opacity={headerOpacity}>
        <PageBack title={headerOpacity !== 2 ? albumDetails.artist.name : ""} />
      </Styled.PageBackWrapper>
      <Styled.AlbumPic>
        <ReactPlaceholder
          type="rect"
          ready={!!albumDetails?.picUrl}
          showLoadingAnimation
          style={{ width: 180, height: 180, borderRadius: 8 }}
        >
          <img src={albumDetails?.picUrl} />
        </ReactPlaceholder>
      </Styled.AlbumPic>

      <Styled.ScrollContainer ref={scrollContainerRef}>
        <AlbumBrief
          publishTime={albumDetails?.publishTime}
          name={albumDetails?.name}
          artist={albumDetails?.artist}
          albumDesc={albumDetails?.desc}
          shareCount={albumDetails?.shareCount}
          likedCount={albumDetails?.likedCount}
        />
        <Styled.MediaListWrapper>
          <Styled.PlayBarWrapper>
            <PlaySongsBar songsCount={albumDetails?.songs?.length} />
          </Styled.PlayBarWrapper>

          <MediaItemList
            list={albumDetails?.songs ?? new Array(2).fill({ type: "song" })}
          />
        </Styled.MediaListWrapper>
      </Styled.ScrollContainer>
    </Styled.AlbumDetailsPage>
  )
})

export default AlbumDetails
