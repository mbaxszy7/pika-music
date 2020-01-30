/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/require-default-props */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { memo, useState, useCallback, useEffect } from "react"
import PropTypes from "prop-types"
import { Link } from "react-router-dom"
import styled from "styled-components"
import InnerModal, { ModalMask } from "../../shared/InnerModal"
import SingleLineTexts from "../../shared/LinesTexts.styled"
import { useEffectShowModal } from "../../utils/hooks"
import nextSong from "../../assets/next_song.png"
import artist from "../../assets/artist.png"
import album from "../../assets/album.png"

const StyledMoreIcon = styled.ul`
  display: flex;
  margin-left: auto;

  li {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background-color: ${props => props.theme.dg};
  }
  li:nth-of-type(2) {
    margin: 0 4px;
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
    background-image: url(${nextSong});
  }
  .artist {
    a {
      color: ${props => props.theme.fg};
    }
    background-image: url(${artist});
  }
  .album {
    background-image: url(${album});
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

const SongMore = memo(
  ({ songName, artistName, albumName, albumId, artistId }) => {
    const {
      isShowModal,
      isShowContent,
      onModalOpen: onMoreClick,
      onModalClose: onClose,
    } = useEffectShowModal()

    const onModalContainerClick = useCallback(e => {
      if (!e.target.getAttribute("data-close")) {
        e.stopPropagation()
      }
    }, [])

    const onAlbumNameClick = useCallback(() => {
      console.log(albumId)
    }, [artistId])

    return (
      <>
        <StyledMoreIcon onClick={onMoreClick}>
          <li />
          <li />
          <li />
        </StyledMoreIcon>
        {isShowModal && (
          <InnerModal>
            <ModalMask onClick={onClose}>
              <StyledModalContainer
                isShow={isShowContent}
                onClick={onModalContainerClick}
              >
                <div className="song_name">{songName}</div>
                <ul className="contents">
                  <li className="next_song">下一首播放</li>
                  {artistName && (
                    <li className="artist">
                      <Link to={`/artist?id=${artistId}&name=${artistName}`}>
                        {`歌手 ${artistName}`}
                      </Link>
                    </li>
                  )}
                  {albumName && (
                    <li className="album" onClick={onAlbumNameClick}>
                      {`专辑 ${albumName}`}
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
  },
)

SongMore.propTypes = {
  songName: PropTypes.string,
  artistName: PropTypes.string,
  albumName: PropTypes.string,
  albumId: PropTypes.number,
  artistId: PropTypes.number,
}

export default SongMore
