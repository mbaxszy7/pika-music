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
import { axiosInstance } from "../../../utils/connectPageReducer"
import { SpinnerLoading } from "../../../shared/Spinner"
import { theme } from "../../../shared/AppTheme"
import { awaitWrapper, formatAudioTime } from "../../../utils"
import playIcon from "../../../assets/play.png"
import pauseIcon from "../../../assets/pause.png"
import preIcon from "../../../assets/pre.png"
import nextIcon from "../../../assets/next.png"
import downIcon from "../../../assets/down.png"

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
  width: ${({ large }) => (large ? 47 : 32)}px;
  height: ${({ large }) => (large ? 47 : 32)}px;
`

const HiddenPlayPageIcon = styled(IconImg)`
  opacity: 0.6;
  display: block;
`

const PlayPageBar = styled.div`
  position: fixed;
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
  margin: 30px auto 0 auto;
  border-radius: 5px;
  overflow: hidden;
`

const SongName = styled.div`
  color: ${({ theme }) => theme.fg};
  margin-top: 25px;
  font-size: 20px;
  line-height: 1.4;
  font-weight: bold;
`
const ArtistName = styled.div`
  color: ${({ theme }) => theme.dg};
  margin-top: 15px;
  font-size: 16px;
`
const ProgressBar = styled.div`
  position: relative;
  width: 100%;
  height: 3px;
  border-radius: 200px;
  color: ${({ theme }) => theme.fg};
  background-image: linear-gradient(
    90deg,
    ${({ progress, theme }) =>
      `${theme.secondary} 0, ${theme.secondary} ${progress}, ${theme.fg} ${progress}`}
  );
`

const ProgressBarHandler = styled.div`
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ theme }) => theme.secondary};
  left: ${({ progress }) => progress};
  will-change: left;
  top: 50%;
  transform: translate3d(0, -52%, 0);
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
        zIndex: 99999,
        bottom: 0,
        left: 0,
        borderRadius: 0,
        height: "100vh",
        width: "100vw",
        background: theme.mg,
        padding: 20,
      }
    }
  }}
`

const PlayBar = memo(({ route }) => {
  const audioRef = useRef()
  const [playState, setPlayState] = useState("")
  const [isShowPlayPage, setShowPlayPage] = useState(false)
  const [audioCurTime, setAudioCurTime] = useState(0)
  const isShowPlayBar = useSelector(state => state.playBar.isShowPlayBar)
  const songIdList = useSelector(state => state.playBar.songIdList)
  const currentPlayId = useSelector(state => state.playBar.currentPlayId)
  const storeDispatch = useDispatch()

  const { data: songDetail } = useSWR(
    currentPlayId && `/api/song/detail?ids=${currentPlayId}`,
    playBarPage.requestSongDetails,
  )

  const getTrack = useCallback(async id => {
    const data = await axiosInstance
      .get(`/api/song/url?id=${id}`)
      .then(res => res.data.data[0])

    return data
  }, [])

  const onNextPlay = useCallback(() => {
    console.log("onNextPlay")
    storeDispatch(playBarPage.playNext())
  }, [storeDispatch])

  const onPrePlay = useCallback(() => {
    console.log("onPrePlay")
    storeDispatch(playBarPage.playPre())
  }, [storeDispatch])

  useEffect(() => {
    const setTrack = async () => {
      if (currentPlayId) {
        setPlayState("loading")
        const [error, track] = await awaitWrapper(getTrack)(currentPlayId)
        console.log(error, !track?.url)
        if (error || !track?.url) {
          setPlayState("stopped")
          storeDispatch(playBarPage.removeCur())
          onNextPlay()
        } else {
          audioRef.current.src = track.url
          audioRef.current.currentTime = 0
          audioRef.current.play()
        }
      }
    }
    setTrack()
  }, [currentPlayId, getTrack, onNextPlay, storeDispatch])

  const onAudioEnd = useCallback(() => {
    setPlayState("stopped")
    onNextPlay()
  }, [onNextPlay])

  const onAudioLoadedData = useCallback(() => {
    setAudioCurTime(audioRef.current.duration)
    setPlayState("loaded")
    console.log("onAudioLoadedData", audioRef.current.duration)
  }, [])

  const onAudioTimeUpdate = useCallback(() => {
    console.log("onAudioTimeUpdate", audioRef.current.duration)
    setPlayState("playing")
    setAudioCurTime(audioRef.current.duration - audioRef.current.currentTime)
  }, [])

  const onAudioPlay = useCallback(() => {
    console.log("onAudioPlay", audioRef.current.duration)
  }, [])

  const onAudioPause = useCallback(() => {
    console.log("onAudioPause", audioRef.current.duration)
    setPlayState("paused")
  }, [])

  const handlePlayIconClick = useCallback(() => {
    if (playState === "paused" || playState === "stopped") {
      audioRef.current.play()
    } else if (playState === "playing") {
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

  const onProgressBarClick = useCallback(() => {}, [])

  console.log("songDetail", songDetail)

  return (
    <>
      {
        <audio
          src=""
          ref={audioRef}
          onEnded={onAudioEnd}
          preload="metadata"
          onLoadedData={onAudioLoadedData}
          onTimeUpdate={onAudioTimeUpdate}
          onPlay={onAudioPlay}
          onPause={onAudioPause}
        />
      }
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
              <HiddenPlayPageIcon src={downIcon} onClick={toPlayPage} />
              <StyledSongPic>
                <StyledMyImage url={songDetail?.[0]?.al?.picUrl} />
              </StyledSongPic>

              <SongName>
                <ReactPlaceholder
                  type="textRow"
                  ready={!!songDetail?.[0]?.name}
                  style={{ width: "40%", height: "1.2em" }}
                >
                  {songDetail?.[0]?.name}
                </ReactPlaceholder>
              </SongName>
              <ArtistName>{songDetail?.[0]?.ar[0]?.name}</ArtistName>
              <ProgressContainer>
                <ProgressBar
                  progress={`${getProgress() * 100}%`}
                  onClick={onProgressBarClick}
                >
                  <ProgressBarHandler progress={`${getProgress() * 100}%`} />
                </ProgressBar>
                <CurrentTimeProgress>
                  {formatAudioTime(audioRef.current.currentTime)}
                </CurrentTimeProgress>
                <DurationProgress>
                  {formatAudioTime(audioRef.current.duration)}
                </DurationProgress>
              </ProgressContainer>

              <PlayPageBar>
                <PlayPageBarWrapper>
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
                  <IconImg src={nextIcon} onClick={onNextPlay} />
                </PlayPageBarWrapper>
              </PlayPageBar>
            </>
          )}
        </StyledPlayBar>
      )}
      {routesRender}
    </>
  )
})

const PlayerStateIcon = memo(({ playState, onClick }) => {
  if (playState === "loading")
    return <PlayerLoadingIcon color={theme.secondary} onClick={onClick} />
  if (playState === "playing" || playState === "loaded")
    return <PlayerStopIcon onClick={onClick} />
  return <PlayerPlayIcon onClick={onClick} />
})

PlayerStateIcon.propTypes = {
  playState: PropTypes.string,
  onClick: PropTypes.func,
}

export default PlayBar
