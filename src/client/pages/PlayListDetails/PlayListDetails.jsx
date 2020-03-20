/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/require-default-props */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useCallback, useRef, memo } from "react"
import PropTypes from "prop-types"
import { useDispatch } from "react-redux"
import useSWR from "swr"
import ReactPlaceholder from "react-placeholder"
import styled from "styled-components"
import { useParams } from "react-router-dom"
import playlistDetailPage from "./connectPlayListDetails"
import MediaItemList from "../../components/MediaItemList"
import {
  useEffectShowModal,
  useEleScrollValue,
  useIsomorphicEffect,
} from "../../../utils/hooks"
import { clamp } from "../../../utils"
import InnerModal from "../../../shared/InnerModal"
import PlaySongsBar from "../../components/PlaySongsBar"
import PageBack from "../../components/PageBack"
import Label from "../../components/Label"
import List from "../../../shared/List"
import playBarPage from "../Root/connectPlayBarReducer"
import {
  AlbumDetailsPage as PlaylistDetails,
  AlbumPic,
  ScrollContainer,
  PageBackWrapper,
  StyledDescModal,
  AlbumName,
  StyledCount,
  StyledDesc,
  MediaListWrapper,
  PlayBarWrapper,
  StyledMyImage,
} from "../AlbumDetails/styled"

const PlaylistName = styled(AlbumName)`
  line-height: 1.4;
`

const StyledLabel = styled(Label)`
  & {
    position: relative;
    top: initial;
    bottom: initial;
    left: initial;
    right: initial;
    margin-top: 10px;
    margin-right: 8px;
  }
`

const TagsWrapper = styled.div`
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
`

const PlaylistBrief = memo(
  ({ title, desc, subscribedCount, playCount, tags }) => {
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
              <StyledCount>
                <div className="count">{playCount}</div>
                <div className="name">播放</div>
              </StyledCount>
              <StyledCount>
                <div className="count">{subscribedCount}</div>
                <div className="name">订阅</div>
              </StyledCount>
              <StyledDesc isWhole>{desc}</StyledDesc>
              <div className="close" onClick={onModalClose} data-close="true">
                &times;
              </div>
            </StyledDescModal>
          </InnerModal>
        )}
        <ReactPlaceholder
          type="textRow"
          ready={!!title}
          style={{ width: 150, marginTop: 12, height: "1.5em" }}
        >
          <PlaylistName>{title}</PlaylistName>
        </ReactPlaceholder>

        <ReactPlaceholder
          type="textRow"
          ready={desc != null}
          style={{ marginTop: 20 }}
        >
          <StyledDesc onClick={onModalOpen}>{desc}</StyledDesc>
        </ReactPlaceholder>
        <TagsWrapper>
          <List
            list={tags}
            listItem={({ item, index }) => (
              <StyledLabel text={item} key={index} />
            )}
          />
        </TagsWrapper>
      </>
    )
  },
)

PlaylistBrief.propTypes = {
  title: PropTypes.string,
  desc: PropTypes.string,
  subscribedCount: PropTypes.number,
  playCount: PropTypes.number,
  tags: PropTypes.array,
}

const PlayListDetails = () => {
  useIsomorphicEffect(() => {
    document.getElementById("root").scrollTop = 0
  }, [])
  const params = useParams()
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

  const { data: playlistDetails } = useSWR(
    `/api/playlist/detail?id=${params.id}`,
    playlistDetailPage.requestPlaylistDetails,
  )
  const { data: playlistSongs } = useSWR(
    playlistDetails?.trackIds
      ? `/api/song/detail?ids=${playlistDetails.trackIds.join()}`
      : "",
    playlistDetailPage.requestSongs,
  )

  const storeDispatch = useDispatch()

  const onPlayIconClick = useCallback(() => {
    if (playlistSongs?.length) {
      storeDispatch(
        playBarPage.setImmediatelyPlay(playlistSongs.map(song => song.id)),
      )
    }
  }, [playlistSongs, storeDispatch])
  return (
    <PlaylistDetails>
      <PageBackWrapper opacity={headerOpacity}>
        <PageBack title={headerOpacity !== 2 ? playlistDetails?.name : ""} />
      </PageBackWrapper>
      <AlbumPic>
        <StyledMyImage url={playlistDetails?.coverImgUrl} />
      </AlbumPic>
      <ScrollContainer ref={scrollContainerRef}>
        <PlaylistBrief
          title={playlistDetails?.name}
          desc={playlistDetails?.description}
          subscribedCount={playlistDetails?.subscribedCount}
          playCount={playlistDetails?.playCount}
          tags={playlistDetails?.tags}
        />
        <MediaListWrapper>
          <PlayBarWrapper>
            <PlaySongsBar
              songsCount={playlistSongs?.length}
              onPlayIconClick={onPlayIconClick}
            />
          </PlayBarWrapper>

          <MediaItemList
            list={playlistSongs ?? new Array(4).fill({ type: "song" })}
          />
        </MediaListWrapper>
      </ScrollContainer>
    </PlaylistDetails>
  )
}

PlayListDetails.csr = true

export default PlayListDetails
