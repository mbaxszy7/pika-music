/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { memo, useRef, useCallback } from "react"
import { useSelector, useDispatch } from "react-redux"
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
import playBarPage from "../Root/connectPlayBarReducer"
import * as Styled from "./styled"
import MyPlaceholder from "../../../shared/MyPlaceholder"

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

        <Styled.PublishTime>
          <MyPlaceholder ready={!!publishTime}>{publishTime}</MyPlaceholder>
        </Styled.PublishTime>

        <Styled.AlbumName>
          <MyPlaceholder ready={!!name}>{name}</MyPlaceholder>
        </Styled.AlbumName>

        <Styled.Artist>
          <Avatar size="small" url={artist?.avatar} />
          <Styled.ArtistName>
            <MyPlaceholder ready={!!artist?.name}>{artist?.name}</MyPlaceholder>
          </Styled.ArtistName>
        </Styled.Artist>

        <Styled.StyledDesc onClick={onModalOpen}>
          <MyPlaceholder ready={albumDesc != null}>{albumDesc}</MyPlaceholder>
        </Styled.StyledDesc>
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

  const storeDispatch = useDispatch()

  const onPlayIconClick = useCallback(() => {
    if (albumDetails?.songs?.length) {
      storeDispatch(
        playBarPage.setImmediatelyPlay(albumDetails.songs.map(song => song.id)),
      )
    }
  }, [albumDetails, storeDispatch])

  return (
    <Styled.AlbumDetailsPage>
      <Styled.PageBackWrapper opacity={headerOpacity}>
        <PageBack
          title={headerOpacity !== 2 ? albumDetails?.artist?.name : ""}
        />
      </Styled.PageBackWrapper>
      <Styled.AlbumPic>
        <Styled.StyledMyImage url={albumDetails?.picUrl} />
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
            <PlaySongsBar
              songsCount={albumDetails?.songs?.length}
              onPlayIconClick={onPlayIconClick}
            />
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
