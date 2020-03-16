/* eslint-disable react/prop-types */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/require-default-props */
/* eslint-disable jsx-a11y/media-has-caption */
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  memo,
} from "react"
import useSWR from "swr"
import ReactPlaceholder from "react-placeholder"
import PropTypes from "prop-types"
import { renderRoutes } from "react-router-config"
import styled from "styled-components"
import { useSelector, useDispatch } from "react-redux"
import playBarPage from "./connectPlayBarReducer"
import { MyImage } from "../../../shared/Image"
import List from "../../../shared/List"
import { SpinnerLoading } from "../../../shared/Spinner"
import { theme as appTheme } from "../../../shared/AppTheme"
import { SINGLE_CYCLE, LIST_CYCLE, SHUFFLE_PLAY } from "./constants"
import { awaitWrapper, formatAudioTime } from "../../../utils"
import { useEffectShowModal } from "../../../utils/hooks"
import InnerModal, { ModalMask } from "../../../shared/InnerModal"
import SingleLineTexts, {
  MultipleLineTexts,
} from "../../../shared/LinesTexts.styled"
import AppNavigate from "../AppNavigate/AppNavigate"
import mediaQury from "../../../shared/mediaQury.styled"
import playIcon from "../../../assets/play.png"
import pauseIcon from "../../../assets/pause.png"
import preIcon from "../../../assets/pre.png"
import nextIcon from "../../../assets/next.png"
import downIcon from "../../../assets/down.png"
import listIcon from "../../../assets/list.png"
import singleCycle from "../../../assets/singleCycle.png"
import listCycle from "../../../assets/listCycle.png"
import shufflePlay from "../../../assets/shufflePlay.png"

const StyledRemoveClose = styled.div`
  font-size: 20px;
  color: ${props => props.theme.dg};
  margin-left: auto;
`

const StyledPlayListItem = styled.div`
  display: flex;
  align-items: center;
  margin: 20px 0;
  line-height: 1.3;
  min-height: 1em;
  .text_wrapper {
    padding-right: 15px;
    ${SingleLineTexts};
    color: ${({ isActivePlay, theme }) =>
      isActivePlay ? theme.secondary : theme.fg};
  }
  .artist_name {
    font-size: 14px;
    color: ${props => props.theme.dg};
  }
`

const StyledModalContainer = styled.div`
  opacity: 0.96;
  border-radius: 12px 12px 0 0;
  background-color: ${props => props.theme.mg};
  position: absolute;
  bottom: 0;
  padding: 40px 14px 80px 14px;
  width: 100%;
  transition: transform 0.2s;
  max-height: 90vh;
  transform: ${props =>
    props.isShow ? "translate3d(0, 0,0)" : "translate3d(0, 100%,0)"};
  .contents {
    ${StyledPlayListItem}:first-child {
      margin-top: 0;
    }
    min-height: 300px;
    max-height: 70vh;
    padding: 0 15px 15px 15px;
    overflow-y: scroll;
  }
  .close {
    position: absolute;
    bottom: 20px;
    color: ${props => props.theme.fg};
    text-align: center;
    font-size: 30px;
    width: 100%;
    left: 0;
  }
`

const PlayerLoadingIcon = styled(SpinnerLoading)`
  & {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 25px;
    width: 16px;
    height: 16px;
  }
`

const IconImg = styled.img`
  width: ${({ large, small }) => (large ? 47 : small ? 20 : 32)}px;
  height: ${({ large, small }) => (large ? 47 : small ? 20 : 32)}px;
`

const HiddenPlayPageIcon = styled(IconImg)`
  opacity: 0.6;
  display: block;
`

const PlayPageBar = styled.div`
  position: fixed;
  padding: 0 3px 0 6px;
  bottom: 40px;
  left: 0;
  margin: 0 15px;
  width: calc(100% - 30px);
`

const PlayPageBarWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  ${mediaQury.aboveTablet`width: 40%;  margin: 0 auto;`}
`

const StyledMyImage = styled(MyImage)`
  & {
    position: absolute;
    width: 100%;
    height: 100%;
  }
`

const StyledSongPic = styled.div`
  position: relative;
  width: 65%;
  padding-bottom: 65%;
  display: block;
  margin: 3.2em auto 0 auto;
  border-radius: 5px;
  overflow: hidden;
  ${mediaQury.aboveTablet`width: 30%;  padding-bottom:30%`}
  ${mediaQury.miniPhone`margin:2em auto 2em auto`}
`

const SongName = styled.div`
  color: ${({ theme }) => theme.fg};
  margin-top: 1.5em;
  font-size: 1.1em;
  line-height: 1.4;
  font-weight: bold;
  ${MultipleLineTexts(2)}
  ${mediaQury.aboveTablet`padding: 0 20%;`}
`
const LyricLine = styled.div`
  color: ${({ theme }) => theme.fg};
  margin-top: 15px;
  font-size: 100%;
  line-height: 1.4;
  ${mediaQury.aboveTablet`padding: 0 20%;`}
`

const ArtistName = styled.div`
  color: ${({ theme }) => theme.dg};
  margin-top: 1em;
  font-size: 100%;
  ${mediaQury.aboveTablet`padding: 0 20%;`}
`
const ProgressBar = styled.div.attrs(({ theme, progress }) => ({
  style: {
    backgroundImage: `linear-gradient(
    90deg, ${theme.secondary} 0, ${theme.secondary} ${progress}, ${theme.fg} ${progress}
  )`,
  },
}))`
  position: relative;
  width: 100%;
  height: 3px;
  border-radius: 200px;
  color: ${props => props.theme.fg};
`

const ProgressBarHandler = styled.div.attrs(({ progress }) => ({
  style: {
    left: `${progress}`,
  },
}))`
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ theme }) => theme.secondary};

  will-change: left;
  top: 50%;
  transform: translate3d(0, -52%, 0);
  &::after {
    content: "";
    position: absolute;
    top: -10px;
    left: -10px;
    width: 28px;
    height: 28px;
  }
`

const ProgressTime = styled.div`
  position: fixed;
  color: ${({ theme }) => theme.dg};
  opacity: 0.8;
  font-size: 14px;
  top: 12px;
`
const CurrentTimeProgress = styled(ProgressTime)`
  left: 0;
`
const DurationProgress = styled(ProgressTime)`
  right: 0;
`

const ProgressContainer = styled.div`
  position: fixed;
  left: 50%;
  transform: translate3d(-50%, 0, 0);
  bottom: 130px;
  width: 85%;
`

const PlayerPlayIcon = styled.div`
  width: 0;
  height: 0;
  border-top: 0px solid transparent;
  border-bottom: 17px solid ${({ theme }) => theme.secondary};
  border-left: 12px solid transparent;
  border-right: 12px solid transparent;
  transform: rotate(90deg) translate(-9px, 4px);
  display: block;
  position: absolute;
  top: 50%;
  left: 25px;
  border-radius: 3px;
`

const PlayerStopIcon = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 25px;
  width: 16px;
  height: 18px;
  &::before {
    position: absolute;
    top: 0;
    left: 0;
    content: "";
    display: block;
    width: 6px;
    height: 100%;
    background: ${({ theme }) => theme.secondary};
    border-radius: 2px;
  }
  &::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    display: block;
    width: 6px;
    height: 100%;
    background: ${({ theme }) => theme.secondary};
    border-radius: 2px;
  }
`

const StyledPlayBar = styled.div`
  width: 126px;
  height: 40px;
  position: fixed;
  bottom: 20px;
  left: 15px;
  z-index: 1000;
  background: black;
  border-radius: 500px;
  padding-left: 55px;
  transition: all 0.4s;
  .duration {
    color: ${({ theme }) => theme.dg};
    font-weight: bold;
    font-size: 18px;
    height: 100%;
    line-height: 40px;
  }

  ${({ isShowPlayPage, theme }) => {
    if (isShowPlayPage) {
      return {
        zIndex: 9999,
        bottom: 0,
        left: 0,
        borderRadius: 0,
        height: window.innerHeight,
        width: "100vw",
        background: theme.mg,
        padding: 20,
      }
    }
  }}
`

const PlayListItem = ({ songName, artistName, isActivePlay, songIndex }) => {
  const storeDispatch = useDispatch()
  const onPlayClick = useCallback(
    e => {
      e.stopPropagation()
      storeDispatch(playBarPage.setPlaylistSongPlay(songIndex))
    },
    [songIndex, storeDispatch],
  )
  const onRemoveItem = useCallback(
    e => {
      e.stopPropagation()
      storeDispatch(playBarPage.removeSong(songIndex))
    },
    [songIndex, storeDispatch],
  )
  return (
    <StyledPlayListItem isActivePlay={isActivePlay} onClick={onPlayClick}>
      <p className="text_wrapper">
        {songName}
        <span className="artist_name">{` - ${artistName}`}</span>
      </p>
      <StyledRemoveClose onClick={onRemoveItem}>&times;</StyledRemoveClose>
    </StyledPlayListItem>
  )
}

const Playlist = memo(({ songList }) => {
  const currentPlayId = useSelector(state => state.playBar.currentPlayId)
  const currentPlayIndex = useSelector(state => state.playBar.currentPlayIndex)
  return (
    <List
      list={songList}
      listItem={({ item, index }) => (
        <PlayListItem
          key={item.id}
          songName={item.title}
          artistName={item.artistName}
          songIndex={index}
          isActivePlay={
            item.id === currentPlayId && currentPlayIndex === index + 1
          }
        />
      )}
    />
  )
})

const PlayerStateIcon = memo(({ playState, onClick }) => {
  if (playState === "loading")
    return <PlayerLoadingIcon color={appTheme.secondary} onClick={onClick} />
  if (playState === "playing" || playState === "loaded")
    return <PlayerStopIcon onClick={onClick} />
  return <PlayerPlayIcon onClick={onClick} />
})

PlayerStateIcon.propTypes = {
  playState: PropTypes.string,
  onClick: PropTypes.func,
}

const PlayPageAbovePart = memo(({ toPlayPage, songDetail, curLyricLine }) => {
  return (
    <>
      <HiddenPlayPageIcon src={downIcon} onClick={toPlayPage} />
      <StyledSongPic>
        <StyledMyImage url={songDetail?.[0]?.imgUrl} />
      </StyledSongPic>

      <SongName>
        <ReactPlaceholder
          type="textRow"
          ready={!!songDetail?.[0]?.title}
          style={{ width: "40%", height: ".9em" }}
        >
          {songDetail?.[0]?.title ?? ""}
        </ReactPlaceholder>
      </SongName>

      <ArtistName>{songDetail?.[0]?.artistName}</ArtistName>
      <LyricLine>{curLyricLine ?? ""}</LyricLine>
    </>
  )
})

const PlayPageBottomPart = memo(
  ({ playState, handlePlayIconClick, onModalOpen, onNextOrPrePlay }) => {
    const playMode = useSelector(state => state.playBar.playMode)
    const storeDispatch = useDispatch()
    const onPrePlay = useCallback(() => {
      onNextOrPrePlay(true, "prev")
    }, [onNextOrPrePlay])
    const nextSong = useCallback(() => {
      onNextOrPrePlay(true, "next")
    }, [onNextOrPrePlay])
    return (
      <PlayPageBar>
        <PlayPageBarWrapper>
          {playMode === LIST_CYCLE && (
            <IconImg
              src={listCycle}
              small
              onClick={() =>
                storeDispatch(playBarPage.setPlayMode(SINGLE_CYCLE))
              }
            />
          )}
          {playMode === SHUFFLE_PLAY && (
            <IconImg
              src={shufflePlay}
              small
              onClick={() => storeDispatch(playBarPage.setPlayMode(LIST_CYCLE))}
            />
          )}
          {playMode === SINGLE_CYCLE && (
            <IconImg
              src={singleCycle}
              small
              onClick={() =>
                storeDispatch(playBarPage.setPlayMode(SHUFFLE_PLAY))
              }
            />
          )}
          <IconImg src={preIcon} onClick={onPrePlay} />
          <IconImg
            src={
              playState === "playing" || playState === "loaded"
                ? pauseIcon
                : playIcon
            }
            large
            onClick={handlePlayIconClick}
          />
          <IconImg src={nextIcon} onClick={nextSong} />
          <IconImg src={listIcon} onClick={onModalOpen} small />
        </PlayPageBarWrapper>
      </PlayPageBar>
    )
  },
)

const PlayBar = memo(({ route }) => {
  const audioRef = useRef()
  const [playState, setPlayState] = useState("")
  const [isShowPlayPage, setShowPlayPage] = useState(false)
  const [audioCurTime, setAudioCurTime] = useState(0)
  const isShowPlayBar = useSelector(state => state.playBar.isShowPlayBar)
  const [curLyricLine, setCurLyricLine] = useState("")
  const songIdList = useSelector(state => state.playBar.songIdList)
  const currentPlayId = useSelector(state => state.playBar.currentPlayId)
  const currentPlayIndex = useSelector(state => state.playBar.currentPlayIndex)
  const storeDispatch = useDispatch()
  const isProgressBarActived = useRef(false)
  const playMode = useSelector(state => state.playBar.playMode)
  const progressBarRef = useRef()

  const {
    isShowModal,
    isShowContent,
    onModalOpen,
    onModalClose,
  } = useEffectShowModal()

  const { data: songDetail } = useSWR(
    currentPlayId && `/api/song/detail?ids=${currentPlayId}`,
    playBarPage.requestSongDetails,
  )

  const { data: songLyric } = useSWR(
    currentPlayId && `/api/lyric?id=${currentPlayId}`,
    playBarPage.requestSongLyric,
  )

  const { data: songList } = useSWR(
    songIdList?.length ? `/api/song/detail?ids=${songIdList.join(",")}` : null,
    playBarPage.requestSongDetails,
  )

  const getTrack = useCallback(async id => {
    const data = await playBarPage.fetcher
      .get(`/api/song/url?id=${id}`)
      .then(res => res.data.data[0])

    return data
  }, [])

  const onNextOrPrePlay = useCallback(
    (isForcedNextOrPrev, direct) => {
      let toPlayIndex = null
      if (playMode === LIST_CYCLE) {
        if (direct === "next" && songIdList.length === currentPlayIndex) {
          toPlayIndex = 1
        }
        if (direct === "prev" && currentPlayIndex === 1) {
          toPlayIndex = songIdList.length
        }
      } else if (playMode === SINGLE_CYCLE && !isForcedNextOrPrev) {
        audioRef.current.currentTime = 0
        audioRef.current.play()
        return
      } else if (playMode === SHUFFLE_PLAY) {
        toPlayIndex = Math.ceil(Math.random() * songIdList.length)
      }

      if (isForcedNextOrPrev) {
        audioRef.current.currentTime = 0
      }
      if (direct === "next") {
        storeDispatch(playBarPage.playNext(toPlayIndex))
      }
      if (direct === "prev") {
        storeDispatch(playBarPage.playPre(toPlayIndex))
      }
    },
    [currentPlayIndex, playMode, songIdList.length, storeDispatch],
  )

  useEffect(() => {
    const setTrack = async () => {
      if (currentPlayId) {
        setPlayState("loading")
        const [error, track] = await awaitWrapper(getTrack)(currentPlayId)
        console.log(error, !track?.url)
        if (error?.response?.status === 403) {
          audioRef.current.src = ` https://music.163.com/song/media/outer/url?id=${currentPlayId}.mp3`
          audioRef.current.currentTime = 0
          audioRef.current.play()
        } else if (error || !track?.url) {
          setPlayState("stopped")
          storeDispatch(playBarPage.removeCur())
          onNextOrPrePlay(false, "next")
        } else {
          audioRef.current.src = track.url
          audioRef.current.currentTime = 0
          audioRef.current.play()
        }
      } else {
        audioRef.current.src = ""
        audioRef.current.currentTime = 0
      }
    }
    setTrack()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPlayId, getTrack, storeDispatch])

  const onAudioEnd = useCallback(() => {
    setPlayState("stopped")
    onNextOrPrePlay(false, "next")
  }, [onNextOrPrePlay])

  const onAudioLoadedData = useCallback(() => {
    setAudioCurTime(audioRef.current.duration)
    setPlayState("loaded")
  }, [])

  const lyriclines = useMemo(
    () =>
      songLyric?.split("\n")?.map(s => {
        const r = s.match(/\[([^\[\]]*)\](.*)/)
        return r
          ? [
              r[1]
                .split(":")
                .map(n => n * 1)
                .reduce((a, b) => a * 60 + b)
                .toFixed(3),
              r[2],
            ]
          : []
      }),
    [songLyric],
  )

  const onAudioTimeUpdate = useCallback(() => {
    setAudioCurTime(audioRef.current.duration - audioRef.current.currentTime)
    const lyricLineIndex = lyriclines?.findIndex(
      line =>
        // eslint-disable-next-line eqeqeq
        Math.max(line[0], audioRef.current.currentTime.toFixed(3)) == line[0],
    )
    setCurLyricLine(lyriclines?.[lyricLineIndex - 1]?.[1])
  }, [lyriclines])

  const onAudioPlay = useCallback(() => {
    setPlayState("playing")
  }, [])

  const onAudioPause = useCallback(() => {
    setPlayState("paused")
  }, [])

  const handlePlayIconClick = useCallback(() => {
    if (playState === "paused" || playState === "stopped") {
      audioRef.current.play()
    } else if (playState === "playing" || playState === "loaded") {
      audioRef.current.pause()
    }
  }, [playState])

  const routesRender = useMemo(() => renderRoutes(route.routes), [route.routes])

  const toPlayPage = useCallback(() => {
    setShowPlayPage(pre => !!(!pre && currentPlayId))
  }, [currentPlayId])

  const getProgress = useCallback(() => {
    if (Number.isNaN(audioRef.current.duration)) {
      return 0
    }
    return audioRef.current.currentTime / audioRef.current.duration
  }, [])

  const audioSeek = useCallback(per => {
    audioRef.current.currentTime = audioRef.current.duration * per
    if (!isProgressBarActived.current) {
      audioRef.current.play()
    }
  }, [])

  const onProgressBarClick = useCallback(
    e => {
      const { left, width } = e.currentTarget.getBoundingClientRect()
      const clickedX = e.clientX
      if (clickedX > left && clickedX < width + left) {
        const offset = clickedX - left
        audioSeek(offset / width)
      }
    },
    [audioSeek],
  )

  const onMouseDown = useCallback(() => {
    isProgressBarActived.current = true
    audioRef.current.pause()
  }, [])

  const onTouchStart = useCallback(() => {
    audioRef.current.pause()
    isProgressBarActived.current = true
  }, [])

  const onProgressBarTouchMoving = useCallback(
    touchPointX => {
      const { left, width } = progressBarRef.current.getBoundingClientRect()
      const offset = touchPointX - left
      if (offset >= width) {
        audioSeek(0.99)
      } else if (!Number.isNaN(offset)) {
        audioSeek(offset / width)
      }
    },
    [audioSeek],
  )

  const onTouchEnd = useCallback(
    e => {
      e.preventDefault()
      const touchPointX = e.changedTouches[0].pageX
      isProgressBarActived.current = false
      onProgressBarTouchMoving(touchPointX)
    },
    [onProgressBarTouchMoving],
  )

  const onTouchMove = useCallback(
    e => {
      const touchPointX = e.changedTouches[0].pageX
      onProgressBarTouchMoving(touchPointX)
    },
    [onProgressBarTouchMoving],
  )

  const onProgressBarMouseEnd = useCallback(
    e => {
      if (!isProgressBarActived.current) {
        return false
      }

      isProgressBarActived.current = false

      const clickedPointX = e.clientX
      onProgressBarTouchMoving(clickedPointX)
    },
    [onProgressBarTouchMoving],
  )

  const onProgressBarMouseMove = useCallback(
    e => {
      if (!isProgressBarActived.current) {
        return false
      }

      const clickedPointX = e.clientX
      onProgressBarTouchMoving(clickedPointX)
    },
    [onProgressBarTouchMoving],
  )

  const songPlayList = useMemo(() => {
    return songList
      ? songIdList.map(id => songList?.find?.(song => song.id === id))
      : []
  }, [songIdList, songList])

  return (
    <>
      <AppNavigate />
      {isShowModal && (
        <InnerModal>
          <ModalMask onClick={onModalClose}>
            <StyledModalContainer isShow={isShowContent}>
              <div className="contents">
                <Playlist songList={songPlayList} />
              </div>
              <div className="close" data-close="true">
                &times;
              </div>
            </StyledModalContainer>
          </ModalMask>
        </InnerModal>
      )}

      <audio
        src=""
        ref={audioRef}
        onEnded={onAudioEnd}
        preload="metadata"
        onLoadedData={onAudioLoadedData}
        onTimeUpdate={onAudioTimeUpdate}
        onPlay={onAudioPlay}
        onPause={onAudioPause}
        onError={e => {
          console.log(
            e,
            e.currentTarget?.error?.code,
            e.currentTarget?.error?.message,
          )
        }}
      />

      {isShowPlayBar && (
        <StyledPlayBar isShowPlayPage={isShowPlayPage}>
          {!isShowPlayPage ? (
            <>
              <PlayerStateIcon
                playState={playState}
                onClick={handlePlayIconClick}
              />

              <span className="duration" onClick={toPlayPage}>
                {formatAudioTime(audioCurTime)}
              </span>
            </>
          ) : (
            <>
              <PlayPageAbovePart
                toPlayPage={toPlayPage}
                songDetail={songDetail}
                curLyricLine={curLyricLine}
              />
              <ProgressContainer>
                <ProgressBar
                  progress={`${getProgress() * 100}%`}
                  onClick={onProgressBarClick}
                  onMouseUp={onProgressBarMouseEnd}
                  onMouseLeave={onProgressBarMouseEnd}
                  onMouseMove={onProgressBarMouseMove}
                  ref={progressBarRef}
                >
                  <ProgressBarHandler
                    progress={`${getProgress() * 100}%`}
                    onMouseDown={onMouseDown}
                    onTouchStart={onTouchStart}
                    onTouchEnd={onTouchEnd}
                    onTouchMove={onTouchMove}
                  />
                </ProgressBar>
                <CurrentTimeProgress>
                  {formatAudioTime(audioCurTime)}
                </CurrentTimeProgress>
                <DurationProgress>
                  {formatAudioTime(audioRef.current.duration)}
                </DurationProgress>
              </ProgressContainer>
              <PlayPageBottomPart
                playState={playState}
                handlePlayIconClick={handlePlayIconClick}
                onModalOpen={onModalOpen}
                onNextOrPrePlay={onNextOrPrePlay}
              />
            </>
          )}
        </StyledPlayBar>
      )}
      {routesRender}
    </>
  )
})

export default PlayBar
