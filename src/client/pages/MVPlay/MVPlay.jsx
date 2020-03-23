/* eslint-disable react/prop-types */
/* eslint-disable no-unused-expressions */
/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable no-console */
/* eslint-disable no-nested-ternary */
import React, { memo, useState, useCallback, useRef, useEffect } from "react"
import screenfull from "screenfull"
import styled from "styled-components"
import useSWR from "swr"
import { useParams, Link } from "react-router-dom"
import { useDispatch } from "react-redux"

import MediaItemList from "../../components/MediaItemList"
import { MyImage } from "../../../shared/Image"
import { formatAudioTime, awaitWrapper } from "../../../utils"
import PageBack from "../../components/PageBack"
import MVPlayPage from "./connectMVPlayReducer"
import playBarPage from "../Root/connectPlayBarReducer"
import { SpinnerLoading } from "../../../shared/Spinner"
import { theme as appTheme } from "../../../shared/AppTheme"
import { useIsomorphicEffect } from "../../../utils/hooks"
import playIcon from "../../../assets/play.png"
import pauseIcon from "../../../assets/pause.png"
import fullScrenIcon from "../../../assets/fullScreen.png"
import mediaQuery from "../../../shared/mediaQury.styled"
import MyPlaceholder, { StyledTextRow } from "../../../shared/MyPlaceholder"

const StyledMVPlayPage = styled.div`
  ${mediaQuery.aboveTablet`
    padding: 0 10%;
 `}
`

const SameMVsContainer = styled.div`
  margin-top: 30px;
  padding: 0 12px;
`

const SameMVsTitle = styled.div`
  margin-bottom: 20px;
  font-size: 16px;
  color: ${({ theme }) => theme.fg};
`

const ArtistWrapper = styled.div`
  margin-top: 14px;
  display: flex;
  align-items: center;
`

const StyledMyImg = styled(MyImage)`
  & {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
`

const VideoDetailsContainer = styled.div`
  margin-top: 25px;
  padding: 0 12px;
`
const VideoName = styled.div`
  color: ${({ theme }) => theme.fg};
  font-weight: bold;
  font-size: 20px;
  line-height: 1.3;
  > ${StyledTextRow} {
    height: 1em;
    width: 60%;
  }
`

const PublishTime = styled.div`
  margin-top: 20px;
  font-size: 14px;
  color: ${({ theme }) => theme.dg};
  > ${StyledTextRow} {
    width: 30%;
  }
`

const VideoArtistName = styled.div`
  font-size: 14px;
  margin-left: 10px;
  a {
    color: ${({ theme }) => theme.fg};
  }
  > ${StyledTextRow} {
    min-width: 80px;
  }
`

const VideoDesc = styled.div`
  margin-top: 10px;
  font-size: 14px;
  color: ${({ theme }) => theme.dg};
  line-height: 1.5;
  > ${StyledTextRow} {
    width: 100% !important;
    background: grey;
  }
`

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
  touch-action: pan-x;
  &::after {
    content: "";
    position: absolute;
    height: 30px;
    width: 100%;
    top: -3px;
  }
`

const VideoWrapper = styled.div`
  position: sticky;
  z-index: 300;
  top: 0;
  width: 100%;
  font-size: 0;
  background: ${({ theme }) => theme.mg};
  ${mediaQuery.aboveTablet`
    width: 500px;
    margin: 0 auto;
    position: relative;
  `};
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

  useIsomorphicEffect(() => {
    document.getElementById("root").scrollTop = 0
  }, [id])

  useIsomorphicEffect(() => {
    storeDispatch(playBarPage.setShowPlayBar(false))
    return () => {
      storeDispatch(playBarPage.setShowPlayBar(true))
    }
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
    setVideoFocuced(pre => !pre)
    // 当前为可播放状态就直接点击播放
    if (playState === "canplay") {
      videoRef.current.play()
      isUserClickVideo.current = true
    }
    // 当前为正在播放就延迟三秒关闭控制面板
    if (playState === "playing") {
      if (autoChangeVideoFocuced.current) {
        clearTimeout(autoChangeVideoFocuced.current)
        autoChangeVideoFocuced.current = null
      }
      autoChangeVideoFocuced.current = setTimeout(() => {
        setVideoFocuced(false)
      }, 3000)
    }
  }, [playState])

  useEffect(() => {
    // 监听如果是暂停状态不要延迟三秒关闭控制面板
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
      const { width, left } = progressBarRef.current.getBoundingClientRect()
      if (touchPointX - left >= width) {
        audioSeek(0.99)
      } else if (!Number.isNaN(touchPointX)) {
        audioSeek((touchPointX - left) / width)
      }
    },
    [audioSeek],
  )

  // const onProgressBarMouseMove = useCallback(
  //   e => {
  //     const clickedPointX = e.clientX
  //     console.log(clickedPointX)
  //     if (clickedPointX > 0) {
  //       onProgressBarTouchMoving(clickedPointX)
  //     }
  //   },
  //   [onProgressBarTouchMoving],
  // )

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

  // const onProgressBarMouseEnd = useCallback(
  //   e => {
  //     setVideoFocuced(false)
  //     const isNeedLoading = isSeekedNeedLoading()
  //     if (isNeedLoading) {
  //       setPlayState("loading")
  //     }
  //   },
  //   [isSeekedNeedLoading],
  // )

  // const onMouseDown = useCallback(e => {
  //   e.stopPropagation()
  //   videoRef.current.pause()
  // }, [])

  const onTouchStart = useCallback(() => {
    console.log("onTouchStart")
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
      const { width, left } = e.currentTarget.getBoundingClientRect()
      const clickedX = e.clientX
      if (width > 0 && clickedX > 0) {
        audioSeek((clickedX - left) / width)
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
            // onMouseUp={onProgressBarMouseEnd}
            // onMouseLeave={onProgressBarMouseEnd}
            // onMouseMove={onProgressBarMouseMove}
            // onMouseDown={onMouseDown}
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
      <VideoDetails details={details} />
      <SameMVs mvId={id} />
    </StyledMVPlayPage>
  )
})

MVPlay.csr = true

export default MVPlay

const VideoDetails = ({ details }) => {
  const [artistAvatar, setAvatar] = useState("")
  useEffect(() => {
    if (details?.artists?.[0]?.id) {
      const getArtistAvatar = async () => {
        const [, res] = await awaitWrapper(MVPlayPage.fetcher)(
          `/api/artists?id=${details.artists[0].id}`,
        )
        if (res) {
          setAvatar(res.data.artist.img1v1Url)
        }
      }
      getArtistAvatar()
    }
  }, [details])

  return (
    <>
      <VideoDetailsContainer>
        <VideoName>
          <MyPlaceholder ready={!!details?.name}>
            {details?.name ?? ""}
          </MyPlaceholder>
        </VideoName>

        <ArtistWrapper>
          <StyledMyImg url={artistAvatar} />
          <VideoArtistName>
            <MyPlaceholder ready={details?.artistName != null}>
              <Link
                to={`/artist?id=${details?.artists?.[0]?.id}&name=${details?.artists?.[0]?.name}`}
              >
                {details?.artistName ?? ""}
              </Link>
            </MyPlaceholder>
          </VideoArtistName>
        </ArtistWrapper>

        <PublishTime>
          <MyPlaceholder ready={details?.publishTime != null}>
            {details?.publishTime ? `发布：${details?.publishTime}` : ""}
          </MyPlaceholder>
        </PublishTime>

        <VideoDesc>
          <MyPlaceholder
            type="textBlock"
            ready={details?.desc != null}
            rows={3}
          >
            {details?.desc ?? ""}
          </MyPlaceholder>
        </VideoDesc>
      </VideoDetailsContainer>
    </>
  )
}

const SameMVs = ({ mvId }) => {
  const { data: sameMVs } = useSWR(
    `/api/simi/mv?mvid=${mvId}`,
    MVPlayPage.requestSameMVs,
  )
  return (
    <SameMVsContainer>
      <SameMVsTitle>相似MV</SameMVsTitle>
      <MediaItemList list={sameMVs ?? new Array(4).fill({ type: "bigMV" })} />
    </SameMVsContainer>
  )
}
