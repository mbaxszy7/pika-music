/* eslint-disable no-unused-expressions */
/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable no-console */
/* eslint-disable no-nested-ternary */
import React, {
  memo,
  useLayoutEffect,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react"
import screenfull from "screenfull"
import styled from "styled-components"
import useSWR from "swr"
import { useParams } from "react-router-dom"
import { useDispatch } from "react-redux"

import { formatAudioTime } from "../../../utils"
import PageBack from "../../components/PageBack"
import MVPlayPage from "./connectMVPlayReducer"
import playBarPage from "../PlayBar/connectPlayBarReducer"
import { SpinnerLoading } from "../../../shared/Spinner"
import { theme as appTheme } from "../../../shared/AppTheme"
import playIcon from "../../../assets/play.png"
import pauseIcon from "../../../assets/pause.png"
import fullScrenIcon from "../../../assets/fullScreen.png"

const StyledMVPlayPage = styled.div``

const VideoMask = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
`

const IconImg = styled.img`
  position: absolute;
  z-index: 100;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  width: ${({ large, small }) => (large ? 47 : small ? 20 : 32)}px;
  height: ${({ large, small }) => (large ? 47 : small ? 20 : 32)}px;
`
const VideoLoadingIcon = styled(SpinnerLoading)`
  & {
    position: absolute;
    z-index: 100;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    width: 32px;
    height: 32px;
  }
`

const PageBackWrapper = styled.div`
  position: absolute;
  top: 20px;
  left: 15px;
  z-index: 501;
`
const FullScreenIcon = styled(IconImg)`
  position: absolute;
  right: 15px;
  z-index: 501;
  top: 20px;
  left: initial;
  transform: initial;
`

const StyledPageBack = styled(PageBack)`
  & {
    background: none;
  }
`

const ProgressBar = styled.div.attrs(({ theme, progress, bufferedLength }) => ({
  style: {
    backgroundImage: `linear-gradient(
    90deg, ${theme.secondary} 0, ${theme.secondary} ${progress}, transparent ${progress}
  ), linear-gradient(
    90deg, ${theme.dg} 0, ${theme.dg} ${bufferedLength}, ${theme.fg} ${bufferedLength}
  )`,
  },
}))`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: ${({ isSeeking }) => (isSeeking ? 10 : 4)}px;
  color: ${props => props.theme.fg};
  transition: all 0.3s;
  &::after {
    content: "";
    position: absolute;
    height: 30px;
    width: 100%;
    top: -3px;
  }
`

const VideoWrapper = styled.div`
  position: relative;
  width: 100%;
  font-size: 0;
`

const DurationTime = styled.div`
  display: inline-block;
  color: white;
  font-size: 28px;
`

const DurationTimeWrapper = styled.div`
  position: absolute;
  z-index: 500;

  top: 100%;
  transform: translateY(-160%);
  left: 20px;
  background: rgba(0, 0, 0, 0.3);
  padding: 4px;
  ${DurationTime}:first-of-type {
    font-weight: bold;
  }
`

const PlayBackIcons = memo(
  ({ playState, isVideoFocuced, onPlayClick, onPauseClick }) => {
    if (playState === "playing")
      return isVideoFocuced ? (
        <IconImg src={pauseIcon} onClick={onPauseClick} large />
      ) : null
    if (playState === "paused")
      return isVideoFocuced ? (
        <VideoMask>
          <IconImg src={playIcon} onClick={onPlayClick} large />
        </VideoMask>
      ) : null
    if (playState === "loading")
      return <VideoLoadingIcon color={appTheme.secondary} />
    if (playState === "canplay")
      return isVideoFocuced ? (
        <IconImg src={playIcon} onClick={onPlayClick} large />
      ) : null
  },
)

const MVPlay = memo(() => {
  const [playState, setPlayState] = useState("canplay")
  // 控制面板是否激活
  const [isVideoFocuced, setVideoFocuced] = useState(true)
  const [videoCurTime, setVideoCurTime] = useState(0)
  const [bufferedLength, setBufferedLength] = useState("0%")
  const { id } = useParams()
  const storeDispatch = useDispatch()
  const autoChangeVideoFocuced = useRef()
  const videoRef = useRef()
  const isSeeking = useRef()
  const progressBarRef = useRef()
  const isUserClickVideo = useRef()

  useLayoutEffect(() => {
    storeDispatch(playBarPage.setShowPlayBar(false))
  }, [storeDispatch])

  const { data: details } = useSWR(
    id && `/api/mv/detail?mvid=${id}`,
    MVPlayPage.requestMVDetails,
    {
      refreshInterval: 0,
      revalidateOnFocus: false,
    },
  )

  const { data: url } = useSWR(
    id && `/api/mv/url?id=${id}`,
    MVPlayPage.requestMVUrl,
    {
      refreshInterval: 0,
      revalidateOnFocus: false,
    },
  )

  const onVideoWrapperClick = useCallback(() => {
    console.warn("playState", playState)
    // if (playState === "canplay") {
    videoRef.current.play()
    isUserClickVideo.current = true
    // }
    setVideoFocuced(pre => !pre)
    if (autoChangeVideoFocuced.current) {
      clearTimeout(autoChangeVideoFocuced.current)
      autoChangeVideoFocuced.current = null
    }
    if (playState === "playing") {
      autoChangeVideoFocuced.current = setTimeout(() => {
        setVideoFocuced(false)
      }, 3000)
    }
  }, [playState])

  useEffect(() => {
    if (autoChangeVideoFocuced.current && playState === "paused") {
      clearTimeout(autoChangeVideoFocuced.current)
      autoChangeVideoFocuced.current = null
    }
  }, [playState])

  const getProgress = useCallback(() => {
    if (!videoRef.current) return 0
    if (Number.isNaN(videoRef.current.duration)) {
      return 0
    }
    return videoCurTime / videoRef.current.duration
  }, [videoCurTime])

  const onPlayClick = useCallback(() => {
    videoRef.current.play()
  }, [])

  const onPauseClick = useCallback(e => {
    e.stopPropagation()
    videoRef.current.pause()
  }, [])

  const onLoadStart = useCallback(() => {
    setPlayState("loading")
    console.log("onLoadStart")
  }, [])

  const onLoadedMetaData = useCallback(() => {
    // 移动端不自动触发 onCanPlayThrough
    setPlayState("canplay")
    console.log("onLoadedMetaData")
  }, [])

  const onError = useCallback(e => {
    console.error(e)
    console.log("onError")
  }, [])

  const onCanPlayThrough = useCallback(() => {
    if (videoRef.current.paused) {
      setPlayState("canplay")
    } else {
      setPlayState("playing")
    }
  }, [])

  const onTimeUpdate = useCallback(() => {
    if (!isSeeking.current) {
      setVideoCurTime(videoRef.current.currentTime)
      setPlayState("playing")
    }
  }, [])

  const onPlay = useCallback(() => {
    setPlayState("playing")
  }, [])

  const onPause = useCallback(() => {
    setPlayState("paused")
  }, [])

  const onSeeked = useCallback(() => {
    console.log("onSeeked")
    videoRef.current.play()
    isSeeking.current = false
  }, [])

  const onSeeking = useCallback(() => {
    isSeeking.current = true
  }, [])

  const onProgress = useCallback(() => {
    let bufferedEnd = 0
    try {
      bufferedEnd = videoRef.current.buffered.end(
        videoRef.current.buffered.length - 1,
      )
    } catch (e) {
      console.warn(e)
    }

    const { duration } = videoRef.current
    if (duration > 0) {
      setBufferedLength(`${(bufferedEnd / duration) * 100}%`)
    }
    console.log("onProgress")
  }, [])

  const audioSeek = useCallback(per => {
    setVideoCurTime(videoRef.current.duration * per)
    videoRef.current.currentTime = videoRef.current.duration * per
  }, [])

  const onProgressBarTouchMoving = useCallback(
    touchPointX => {
      const { width } = progressBarRef.current.getBoundingClientRect()
      if (touchPointX >= width) {
        audioSeek(0.99)
      } else if (!Number.isNaN(touchPointX)) {
        audioSeek(touchPointX / width)
      }
    },
    [audioSeek],
  )

  const onProgressBarMouseMove = useCallback(
    e => {
      const clickedPointX = e.clientX
      onProgressBarTouchMoving(clickedPointX)
    },
    [onProgressBarTouchMoving],
  )

  const onProgressBarMouseEnd = useCallback(
    e => {
      const clickedPointX = e.clientX
      onProgressBarTouchMoving(clickedPointX)
    },
    [onProgressBarTouchMoving],
  )

  const onMouseDown = useCallback(() => {
    videoRef.current.pause()
  }, [])

  const onTouchStart = useCallback(() => {
    console.log("onTouchStart")
  }, [])

  const isSeekedNeedLoading = useCallback(() => {
    try {
      const timeRangesObject = videoRef.current.buffered
      const timeRanges = []
      // eslint-disable-next-line no-plusplus
      for (let count = 0; count < timeRangesObject.length; count++) {
        timeRanges.push([
          timeRangesObject.start(count),
          timeRangesObject.end(count),
        ])
      }

      return (
        timeRanges.findIndex(range => {
          return (
            videoRef.current.currentTime >= range[0] &&
            videoRef.current.currentTime <= range[1]
          )
        }) === -1
      )
    } catch (e) {
      return false
    }
  }, [])

  const onTouchEnd = useCallback(() => {
    setVideoFocuced(false)
    const isNeedLoading = isSeekedNeedLoading()
    if (isNeedLoading) {
      setPlayState("loading")
    }
    console.log("onTouchEnd", isNeedLoading)
  }, [isSeekedNeedLoading])

  const onTouchMove = useCallback(
    e => {
      const touchPointX = e.changedTouches[0].clientX
      if (touchPointX > 0) {
        onProgressBarTouchMoving(touchPointX)
      }
    },
    [onProgressBarTouchMoving],
  )

  const onProgressBarClick = useCallback(
    e => {
      e.stopPropagation()
      const { width } = e.currentTarget.getBoundingClientRect()
      const clickedX = e.clientX
      if (window > 0 && clickedX > 0) {
        audioSeek(clickedX / width)
      }
    },
    [audioSeek],
  )

  useEffect(() => {
    if (screenfull.isEnabled) {
      screenfull.on("error", event => {
        console.error("Failed to enable fullscreen", event)
      })
    }
  }, [])

  const onRequestFullScreen = useCallback(e => {
    e.stopPropagation()
    if (screenfull.isEnabled) {
      screenfull.request(videoRef.current)
    } else if (
      videoRef.current.webkitEnterFullscreen ||
      videoRef.current.enterFullScreen
    ) {
      // 是否支持苹果Safari自带的video全屏api
      videoRef.current.webkitEnterFullscreen &&
        videoRef.current.webkitEnterFullscreen()
      videoRef.current.enterFullScreen && videoRef.current.enterFullScreen()
    }
  }, [])

  return (
    <StyledMVPlayPage>
      <VideoWrapper
        style={{
          paddingBottom: `${(details?.height / details?.width) * 100}%`,
        }}
        onClick={onVideoWrapperClick}
      >
        {isVideoFocuced && (
          <>
            <PageBackWrapper>
              <StyledPageBack isBlack />
            </PageBackWrapper>
            <FullScreenIcon
              src={fullScrenIcon}
              small
              onClick={onRequestFullScreen}
            />
          </>
        )}

        <PlayBackIcons
          playState={playState}
          isVideoFocuced={isVideoFocuced}
          onPlayClick={onPlayClick}
          onPauseClick={onPauseClick}
        />

        <video
          allowFullScreen
          style={{
            width: "100%",
            height: "100%",
          }}
          onLoadedData={() => {
            console.log("onLoadedData")
          }}
          onLoadedMetadata={onLoadedMetaData}
          src={url}
          controls={false}
          // allowFullScreen="allow"
          poster={details?.cover}
          x5-video-player-type="h5"
          x5-video-orientation="landscape|portrait"
          playsInline
          webkit-playsinline="true"
          onLoadStart={onLoadStart}
          // 手动设置currentTime会触发一次canplaythrough事件
          onCanPlayThrough={onCanPlayThrough}
          onTimeUpdate={onTimeUpdate}
          onPause={onPause}
          onPlay={onPlay}
          ref={videoRef}
          onSeeked={onSeeked}
          onSeeking={onSeeking}
          onError={onError}
          onProgress={onProgress}
        />
        {isUserClickVideo.current && (
          <ProgressBar
            progress={`${getProgress() * 100}%`}
            bufferedLength={bufferedLength}
            isSeeking={isSeeking.current}
            ref={progressBarRef}
            onClick={onProgressBarClick}
            onMouseUp={onProgressBarMouseEnd}
            onMouseLeave={onProgressBarMouseEnd}
            onMouseMove={onProgressBarMouseMove}
            onMouseDown={onMouseDown}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            onTouchMove={onTouchMove}
          />
        )}
        {isSeeking.current && (
          <DurationTimeWrapper>
            <DurationTime>{formatAudioTime(videoCurTime)}</DurationTime>
            <DurationTime>
              {`_${formatAudioTime(videoRef?.current?.duration)}`}
            </DurationTime>
          </DurationTimeWrapper>
        )}
      </VideoWrapper>
    </StyledMVPlayPage>
  )
})

export default MVPlay
