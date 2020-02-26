/* eslint-disable react/jsx-indent */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/require-default-props */
import React, { memo, useCallback, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import useSWR from "swr"
import ReactPlaceholder from "react-placeholder"
import PropTypes from "prop-types"
import styled, { css } from "styled-components"
import { MyImage } from "../../shared/Image"
import SongMore from "./SongMore"
import List from "../../shared/List"
import playBarPage from "../pages/PlayBar/connectPlayBarReducer"
import Label from "./Label"
import SingleLineTexts, {
  MultipleLineTexts,
} from "../../shared/LinesTexts.styled"
import { axiosInstance } from "../../utils/connectPageReducer"
import moreIcon from "../../assets/more.png"
import Dialog from "../../shared/Dialog"

export const MediaItemTitle = styled.p`
  height: 16px;
  line-height: 16px;
  padding-left: 4px;
  font-weight: bold;
  margin-top: 40px;
  margin-bottom: 20px;

  font-size: 14px;
  ${props =>
    props.withoutMore
      ? ""
      : `background-image: url(${moreIcon});
  background-size: 16px 16px;
  background-repeat: no-repeat;
  background-position: 100% center;
  `}
 color: ${props => props.theme.dg};
`
const DurationTag = styled.span`
  font-size: 14px;
  font-weight: bold;
  position: absolute;
  bottom: 0;
  right: 0;
  padding: 5px 12px;
  border-radius: 200px;
  color: ${props => props.theme.fg};
  background-color: black;
  z-index: 4;
`

export const MediaItemTypes = {
  ALBUM: "album",
  PLAY_LIST: "playlist",
  SONG: "song",
  VIDEO: "video",
  ARTIST: "artist",
  BIG_ALBUM: "bigAlbum",
  BIG_MV: "bigMV",
  BIGGER_MV: "biggerMV",
  BIG_PLAY_LIST: "big_playlist",
  PRIVATE_MV: "privateMV",
}

const StyledResultItem = styled.div`
  vertical-align:top;
  position: relative;
  width: ${props => (props.isMultipColumItem ? "48%" : "100%")};
  margin-bottom: ${props =>
    props.isMultipColumItem || props.isSingleColumItem ? "10px" : "20px"};
  display: ${props =>
    props.isMultipColumItem || props.isSingleColumItem
      ? "inline-flex"
      : "flex"};
  flex-direction: ${props =>
    props.isMultipColumItem || props.isSingleColumItem ? "column" : "row"};
  align-items: ${props =>
    props.isMultipColumItem || props.isSingleColumItem
      ? "flex-start"
      : "center"};
  width: ${props => (props.isHalfItem ? "50%" : "")};
  dl {
    /* align-items: ${props =>
      props.isMultipColumItem || props.isSingleColumItem
        ? "flex-start"
        : ""}; */
    font-size: 16px;
    width: ${props =>
      props.isMultipColumItem || props.isSingleColumItem ? "100%" : "70%"};

    dt {
      margin-bottom: 4px;
      padding-right: 15px;
      ${props =>
        props.isMultipColumItem ? MultipleLineTexts(2) : SingleLineTexts};
      line-height: 1.3;
      min-height: 1em;
      color: ${({ isActivePlay, theme }) =>
        isActivePlay ? theme.secondary : theme.fg}
    }
    dd {
      padding-right: 15px;
      ${SingleLineTexts}
      font-size: 14px;
      min-height: 1em;
      margin-bottom: 2px;
      color: ${props => props.theme.dg};
      line-height: 1.3em;
    }
  }
`
const StyledMyImage = styled(MyImage)`
  & {
    width: 100%;
    height: 100%;
  }
`
const StyledLabel = styled(Label)`
  & {
    bottom: 0;
    right: inherit;
    left: -5px;
    z-index: 4;
  }
`

const ItemImgWrapper = styled.div`
  position: relative;
  font-size: 0;
`

const ItemIndex = styled.span`
  font-weight: bold;
  color: ${props => props.theme.fg};
  display: block;
  margin-right: 26px;
`

const ItemImg = memo(({ type, imgUrl, renderTag }) => {
  let imgConfig = {
    paddingBottom: "44px",
    width: "44px",
    borderRadius: "50%",
  }
  if (type === MediaItemTypes.ALBUM || type === MediaItemTypes.PLAY_LIST) {
    imgConfig = {
      paddingBottom: "48px",
      width: "48px",
      borderRadius: "4px",
    }
  }
  if (type === MediaItemTypes.SONG) {
    imgConfig = { ...imgConfig, borderRadius: "4px" }
  }

  if (type === MediaItemTypes.VIDEO) {
    imgConfig = {
      paddingBottom: `${25 / 1.8}%`,
      width: "25%",
      borderRadius: "4px",
    }
  }
  if (
    type === MediaItemTypes.BIG_ALBUM ||
    type === MediaItemTypes.BIG_PLAY_LIST
  ) {
    imgConfig = {
      paddingBottom: "85%",
      width: "85%",
      borderRadius: "4px",
      marginBottom: "10px",
    }
  }

  if (type === MediaItemTypes.BIG_MV) {
    imgConfig = {
      paddingBottom: `${85 / 1.33}%`,
      width: "85%",
      borderRadius: "4px",
      marginBottom: "10px",
    }
  }
  if (type === MediaItemTypes.BIGGER_MV) {
    imgConfig = {
      paddingBottom: `${100 / 1.3}%`,
      width: "100%",
      borderRadius: "4px",
      marginBottom: "10px",
    }
  }

  if (type === MediaItemTypes.PRIVATE_MV) {
    imgConfig = {
      paddingBottom: `${100 / 2.7}%`,
      width: "100%",
      borderRadius: "4px",
      marginBottom: "10px",
    }
  }

  const extraCss = css`
    width: ${imgConfig.width};
    padding-bottom: ${imgConfig.paddingBottom};
    border-radius: ${imgConfig.borderRadius};
    margin-bottom: ${imgConfig.marginBottom || 0};
    margin-right: 16px;
    position: relative;
  `
  return (
    <ItemImgWrapper css={extraCss}>
      {renderTag && renderTag()}
      <StyledMyImage
        url={imgUrl}
        css={css`
          border-radius: ${imgConfig.borderRadius};
          position: absolute;
        `}
      />
    </ItemImgWrapper>
  )
})

ItemImg.propTypes = {
  type: PropTypes.string,
  imgUrl: PropTypes.string,
  renderTag: PropTypes.func,
}

const MediaItem = memo(props => {
  const {
    imgUrl,
    title,
    desc,
    type,
    artistId,
    albumId,
    artistName,
    albumName,
    publishTime,
    duration,
    tag,
    index,
    noImg,
    noIndex,
    onItemClick,
    id,
    renderRightPart,
  } = props
  const { data: songValid, isValidating } = useSWR(
    type === MediaItemTypes.SONG && id ? `/api/check/music?id=${id}` : null,
    url => axiosInstance.get(url).then(res => res.data),
    {
      refreshInterval: 0,
      revalidateOnFocus: false,
      onErrorRetry: (err, key, option, revalidate, { retryCount }) => {
        if (err.status === 404) return
        if (retryCount >= 1) return

        // retry after 5 seconds
        setTimeout(() => revalidate({ retryCount: retryCount + 1 }), 5000)
      },
    },
  )
  const [isShowDialog, setShowDialog] = useState(false)
  const [artistNameDesc, albumNameDesc] = desc?.split(" · ") ?? ["", ""]
  const innerDD = desc || publishTime
  const storeDispatch = useDispatch()
  const onResultItemClick = useCallback(
    e => {
      e.stopPropagation()
      if (isValidating) {
        return
      }

      if (typeof onItemClick === "function" && id) {
        onItemClick({
          id,
        })
      }

      if (type === MediaItemTypes.SONG && !songValid?.success) {
        setShowDialog(true)
      }

      if (type === MediaItemTypes.SONG && songValid?.success) {
        storeDispatch(playBarPage.setImmediatelyPlay(id))
      }
    },
    [isValidating, onItemClick, id, type, songValid, storeDispatch],
  )

  const activePlayId = useSelector(state => state.playBar.currentPlayId)

  return (
    <>
      {isShowDialog && (
        <Dialog
          title="抱歉"
          dialogText="此歌曲暂无版权"
          isShowCancel={false}
          isShowConfirm
          onConfirmClick={() => setShowDialog(false)}
        />
      )}
      <StyledResultItem
        onClick={onResultItemClick}
        isMultipColumItem={
          type === MediaItemTypes.BIG_ALBUM ||
          type === MediaItemTypes.BIG_MV ||
          type === MediaItemTypes.BIG_PLAY_LIST
        }
        isSingleColumItem={
          type === MediaItemTypes.BIGGER_MV ||
          type === MediaItemTypes.PRIVATE_MV
        }
        isHalfItem={type === MediaItemTypes.BIG_PLAY_LIST}
        isActivePlay={activePlayId === id && type === MediaItemTypes.SONG}
      >
        {!noImg ? (
          <ItemImg
            type={type}
            imgUrl={isValidating ? "" : imgUrl}
            renderTag={() => (
              <>
                {duration && <DurationTag>{duration}</DurationTag>}
                {tag && <StyledLabel text={tag} />}
              </>
            )}
          />
        ) : !noIndex ? (
          <ItemIndex>{`${index + 1}`.padStart(2, 0)}</ItemIndex>
        ) : (
          ""
        )}
        <ReactPlaceholder
          ready={!!title && !isValidating}
          rows={2}
          color="grey"
          showLoadingAnimation
          style={{
            width: "40%",
            borderRadius: 200,
            height: 30,
          }}
        >
          <dl>
            <dt>{title}</dt>
            <dd>{innerDD}</dd>
          </dl>
        </ReactPlaceholder>
        {typeof renderRightPart === "function"
          ? renderRightPart()
          : type === MediaItemTypes.SONG && (
              <SongMore
                songName={title}
                artistName={artistName || artistNameDesc}
                albumName={albumName || albumNameDesc}
                artistId={artistId}
                albumId={albumId}
                id={id}
                isValid={songValid?.success && !isValidating}
              />
            )}
      </StyledResultItem>
    </>
  )
})

MediaItem.displayName = "MediaItem"

MediaItem.propTypes = {
  renderRightPart: PropTypes.func,
  noIndex: PropTypes.bool,
  noImg: PropTypes.bool,
  index: PropTypes.number,
  duration: PropTypes.string,
  imgUrl: PropTypes.string,
  title: PropTypes.string,
  artistName: PropTypes.string,
  albumName: PropTypes.string,
  desc: PropTypes.string,
  type: PropTypes.string,
  albumId: PropTypes.number,
  artistId: PropTypes.number,
  publishTime: PropTypes.string,
  tag: PropTypes.string,
  onItemClick: PropTypes.func,
  id: PropTypes.number,
}

const MediaItemList = memo(
  ({ list, title, placeHolderCount, moreUrl, onItemClick, rendItemRight }) => {
    if (!list?.length) {
      return null
    }
    return (
      <>
        {moreUrl && title ? (
          <Link to={moreUrl}>
            <MediaItemTitle withoutMore={!moreUrl}>{title}</MediaItemTitle>
          </Link>
        ) : (
          title && (
            <MediaItemTitle withoutMore={!moreUrl}>{title}</MediaItemTitle>
          )
        )}
        <List
          list={list || new Array(placeHolderCount || 1).fill({})}
          listItem={({ item, index }) => (
            <MediaItem
              index={index}
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...item}
              key={index}
              onItemClick={onItemClick}
              renderRightPart={rendItemRight}
            />
          )}
        />
      </>
    )
  },
)

MediaItemList.propTypes = {
  rendItemRight: PropTypes.func,
  onItemClick: PropTypes.func,
  moreUrl: PropTypes.string,
  placeHolderCount: PropTypes.number,
  list: PropTypes.array,
  title: PropTypes.string,
}

export default MediaItemList
