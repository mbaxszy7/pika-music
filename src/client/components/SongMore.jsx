/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/require-default-props */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { memo, useCallback } from "react"
import PropTypes from "prop-types"
import { Link } from "react-router-dom"
import styled from "styled-components"
import { useDispatch } from "react-redux"
import InnerModal, { ModalMask } from "../../shared/InnerModal"
import SingleLineTexts from "../../shared/LinesTexts.styled"
import { useEffectShowModal } from "../../utils/hooks"
import playBarPage from "../pages/PlayBar/connectPlayBarReducer"
import nextSong from "../../assets/nextSong.png"
import attention from "../../assets/attention.png"
import artist from "../../assets/artist.png"
import album from "../../assets/album.png"

const StyledMoreIcon = styled.ul`
  display: flex;
  margin-left: auto;
  position: relative;
  li {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background-color: ${props => props.theme.dg};
  }
  li:nth-of-type(2) {
    margin: 0 4px;
  }
  &::after {
    content: "";
    position: absolute;
    width: 60px;
    height: 30px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`

const StyledModalContainer = styled.div`
  border-radius: 12px 12px 0 0;
  background-color: ${props => props.theme.mg};
  position: absolute;
  bottom: 0;
  padding: 25px 14px 80px 14px;
  width: 100%;
  transition: transform 0.2s;
  transform: ${props =>
    props.isShow ? "translate3d(0, 0,0)" : "translate3d(0, 100%,0)"};
  .contents {
    min-height: 200px;
    max-height: 55vh;
    overflow-y: scroll;
    li {
      color: ${props => props.theme.fg};
      padding-left: 45px;
      margin: 29px 0 0 2px;
      font-size: 14px;
      background-position: 10px center;
      background-repeat: no-repeat;
      background-size: 23px 23px;
      height: 30px;
      line-height: 30px;
      &:first-of-type {
        margin-top: 40px;
      }
    }
  }
  .next_song {
    background-image: ${({ isValid }) =>
      isValid ? `url(${nextSong})` : `url(${attention})`};
  }
  .artist {
    ${SingleLineTexts}
    a {
      color: ${props => props.theme.fg};
    }
    background-image: url(${artist});
  }
  .album {
    background-image: url(${album});
    ${SingleLineTexts}
    a {
      color: ${props => props.theme.fg};
    }
  }
  .song_name {
    color: ${props => props.theme.fg};
    font-size: 16px;
    ${SingleLineTexts}
  }
  .close {
    position: absolute;
    bottom: 40px;
    color: ${props => props.theme.fg};
    text-align: center;
    font-size: 30px;
    width: 100%;
    left: 0;
  }
`

const SongMore = memo(function SongMore({
  songName,
  artistName,
  albumName,
  albumId,
  artistId,
  isValid,
  id,
}) {
  const {
    isShowModal,
    isShowContent,
    onModalOpen: onMoreClick,
    onModalClose: onClose,
  } = useEffectShowModal()
  const storeDispatch = useDispatch()
  const onModalContainerClick = useCallback(e => {
    if (!e.target.getAttribute("data-close")) {
      e.stopPropagation()
    }
  }, [])

  const handleMoreClick = useCallback(
    e => {
      e.stopPropagation()
      onMoreClick()
    },
    [onMoreClick],
  )

  const handleModalClose = useCallback(
    e => {
      e.stopPropagation()
      onClose()
    },
    [onClose],
  )

  const handleNextPlay = useCallback(
    e => {
      if (isValid) {
        storeDispatch(playBarPage.setNextPlay(id))
        handleModalClose(e)
      }
    },
    [handleModalClose, id, isValid, storeDispatch],
  )

  return (
    <>
      <StyledMoreIcon onClick={handleMoreClick}>
        <li />
        <li />
        <li />
      </StyledMoreIcon>
      {isShowModal && (
        <InnerModal>
          <ModalMask onClick={handleModalClose}>
            <StyledModalContainer
              isShow={isShowContent}
              onClick={onModalContainerClick}
              isValid={isValid}
            >
              <div className="song_name">{songName}</div>
              <ul className="contents">
                <li className="next_song" onClick={handleNextPlay}>
                  {isValid ? "下一首播放" : "暂无版权"}
                </li>
                {artistName && (
                  <li className="artist">
                    <Link
                      to={`/artist?id=${artistId}&name=${
                        artistName?.split(" ")?.[0]
                      }`}
                      onClick={handleModalClose}
                    >
                      {`歌手 ${artistName}`}
                    </Link>
                  </li>
                )}
                {albumName && (
                  <li className="album">
                    <Link to={`/album?id=${albumId}`}>
                      {`专辑 ${albumName}`}
                    </Link>
                  </li>
                )}
              </ul>
              <div className="close" data-close="true">
                &times;
              </div>
            </StyledModalContainer>
          </ModalMask>
        </InnerModal>
      )}
    </>
  )
})

SongMore.propTypes = {
  songName: PropTypes.string,
  artistName: PropTypes.string,
  albumName: PropTypes.string,
  albumId: PropTypes.number,
  artistId: PropTypes.number,
  isValid: PropTypes.bool,
}

export default SongMore
