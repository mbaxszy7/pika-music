/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { memo, useRef, useCallback } from "react"
import { useSelector } from "react-redux"
import ReactPlaceholder from "react-placeholder"
import queryString from "query-string"
import { useLocation } from "react-router-dom"
import styled from "styled-components"
import useSWR from "swr"
import albumDetailsPage from "./connectAlbumDetailsReducer"
import PageBack from "../../components/PageBack"
import MediaItemList from "../../components/MediaItemList"
import { useEffectShowModal, useEleScrollValue } from "../../../utils/hooks"
import { clamp } from "../../../utils"
import Avatar from "../../../shared/Avatar"
import InnerModal from "../../../shared/InnerModal"
import SingleLineTexts from "../../../shared/LinesTexts.styled"
import PlaySongsBar from "../../components/PlaySongsBar"

const PageBackWrapper = styled.div`
  position: fixed;
  padding: 25px 15px 15px 15px;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 501;
  opacity: ${props => props.opacity};
  background-color: ${props => props.theme.mg};
`

const AlbumDetailsPage = styled.div`
  min-height: 100vh;
  padding: 30px 18px 40px 18px;
`

const ScrollContainer = styled.div`
  position: sticky;
  padding-top: 30px;
  background-color: ${props => props.theme.mg};
  z-index: 5;
  overflow: hidden;
`

const AlbumPic = styled.div`
  border-radius: 8px;
  margin-top: 35px;
  position: sticky;
  z-index: 0;
  top: 15px;
  display: flex;
  justify-content: center;
  border-radius: 8px;
  img {
    width: 180px;
    height: 180px;
    border-radius: 8px;
  }
`

const PublishTime = styled.p`
  font-size: 16px;
  color: ${props => props.theme.dg};
  font-weight: bold;
`
const StyledDescModal = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  padding: 35px;
  font-size: 16px;
  background: ${props => props.theme.mg};
  color: ${props => props.theme.fg};
  padding-bottom: 70px;
  transition: opacity 0.2s;
  opacity: ${props => (props.isShow ? "1" : "0")};
  z-index: 1000;
  .close {
    position: absolute;
    bottom: 40px;
    color: ${props => props.theme.fg};
    text-align: center;
    font-size: 40px;
    width: 100%;
    left: 0;
  }
`

const AlbumName = styled.p`
  margin-top: 12px;
  font-size: 20px;
  color: ${props => props.theme.fg};
  font-weight: bold;
`
const Artist = styled.div`
  margin-top: 20px;
  display: flex;
  align-items: center;
`

const ArtistName = styled.span`
  font-size: 14px;
  color: ${props => props.theme.dg};
  margin-left: 15px;
`
const StyledDesc = styled.div`
  min-height: 20px;
  max-height: 70vh;
  overflow-y: scroll;
  margin-top: 20px;
  font-size: 14px;
  line-height: 1.3;
  color: ${props => props.theme.dg};
  ${props =>
    props.isWhole ? "line-height:1.5; font-size: 16px" : SingleLineTexts}
`

const MediaListWrapper = styled.div`
  margin-top: 30px;
`

const PlayBarWrapper = styled.div`
  margin-bottom: 25px;
`

const AlbumBrief = memo(({ publishTime, name, artist, albumDesc }) => {
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
          <StyledDescModal isShow={isShowContent}>
            <StyledDesc isWhole>{albumDesc}</StyledDesc>
            <div className="close" onClick={onModalClose} data-close="true">
              &times;
            </div>
          </StyledDescModal>
        </InnerModal>
      )}
      <ReactPlaceholder
        type="textRow"
        ready={!!publishTime}
        style={{ width: 100 }}
      >
        <PublishTime>{publishTime}</PublishTime>
      </ReactPlaceholder>
      <ReactPlaceholder
        type="textRow"
        ready={!!name}
        style={{ width: 150, marginTop: 12, height: "1.5em" }}
      >
        <AlbumName>{name}</AlbumName>
      </ReactPlaceholder>
      <Artist>
        <Avatar size="small" url={artist?.avatar} />
        <ReactPlaceholder
          type="textRow"
          ready={!!artist?.name}
          style={{ width: 120, marginLeft: 15, marginTop: 0 }}
        >
          <ArtistName>{artist?.name}</ArtistName>
        </ReactPlaceholder>
      </Artist>
      <ReactPlaceholder
        type="textRow"
        ready={!!albumDesc}
        style={{ marginTop: 20 }}
      >
        <StyledDesc onClick={onModalOpen}>{albumDesc}</StyledDesc>
      </ReactPlaceholder>
    </>
  )
})

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
    <AlbumDetailsPage>
      <PageBackWrapper opacity={headerOpacity}>
        <PageBack title={headerOpacity !== 2 ? albumDetails.artist.name : ""} />
      </PageBackWrapper>
      <AlbumPic>
        <ReactPlaceholder
          type="rect"
          ready={!!albumDetails?.picUrl}
          showLoadingAnimation
          style={{ width: 180, height: 180, borderRadius: 8 }}
        >
          <img src={albumDetails?.picUrl} />
        </ReactPlaceholder>
      </AlbumPic>

      <ScrollContainer ref={scrollContainerRef}>
        <AlbumBrief
          publishTime={albumDetails?.publishTime}
          name={albumDetails?.name}
          artist={albumDetails?.artist}
          albumDesc={albumDetails?.desc}
        />
        <MediaListWrapper>
          <PlayBarWrapper>
            <PlaySongsBar songsCount={albumDetails?.songs?.length} />
          </PlayBarWrapper>

          <MediaItemList
            list={albumDetails?.songs ?? new Array(2).fill({ type: "song" })}
          />
        </MediaListWrapper>
      </ScrollContainer>
    </AlbumDetailsPage>
  )
})

export default AlbumDetails
