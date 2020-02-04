/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/require-default-props */
import React, { memo } from "react"
import { Link } from "react-router-dom"
import ReactPlaceholder from "react-placeholder"
import PropTypes from "prop-types"
import styled, { css } from "styled-components"
import { MyImage } from "../../shared/Image"
import SongMore from "./SongMore"
import List from "../../shared/List"
import SingleLineTexts, {
  MultipleLineTexts,
} from "../../shared/LinesTexts.styled"

import moreIcon from "../../assets/more.png"

const MediaItemTitle = styled.p`
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
  bottom: 50px;
  right: 0;
  padding: 5px 12px;
  border-radius: 200px;
  color: ${props => props.theme.fg};
  background-color: black;
`

export const MediaItemTypes = {
  ALBUM: "album",
  PLAY_LIST: "playList",
  SONG: "song",
  VIDEO: "video",
  ARTIST: "artist",
  BIG_ALBUM: "bigAlbum",
  BIG_MV: "bigMV",
  BIGGER_MV: "biggerMV",
}

const StyledResultItem = styled.div`
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
  overflow: hidden;

  dl {
    font-size: 16px;
    width: ${props =>
      props.isMultipColumItem || props.isSingleColumItem ? "100%" : "70%"};

    dt {
      color: ${props => props.theme.fg};
      margin-bottom: 4px;
      padding-right: 15px;
      ${props =>
        props.isMultipColumItem ? MultipleLineTexts(2) : SingleLineTexts};
      line-height: 1.3;
      min-height: 1em;
    }
    dd {
      padding-right: 15px;
      ${SingleLineTexts}
      font-size: 14px;
      min-height: 1em;
      margin-bottom: 2px;
      color: ${props => props.theme.dg};
    }
  }
`

const ItemImg = memo(({ type, imgUrl }) => {
  let imgConfig = {
    width: "44px",
    height: "44px",
    borderRadius: "50%",
  }
  if (type === MediaItemTypes.ALBUM || type === MediaItemTypes.PLAY_LIST) {
    imgConfig = {
      width: "48px",
      height: "48px",
      borderRadius: "4px",
    }
  }
  if (type === MediaItemTypes.SONG) {
    imgConfig = { ...imgConfig, borderRadius: "4px" }
  }

  if (type === MediaItemTypes.VIDEO) {
    imgConfig = {
      width: "89px",
      height: "50px",
      borderRadius: "4px",
    }
  }
  if (type === MediaItemTypes.BIG_ALBUM) {
    imgConfig = {
      width: "85%",
      "min-height": "130px",
      borderRadius: "4px",
      marginBottom: "10px",
    }
  }
  if (type === MediaItemTypes.BIG_MV || type === MediaItemTypes.BIGGER_MV) {
    imgConfig = {
      width: type === MediaItemTypes.BIGGER_MV ? "100%" : "85%",
      "min-height": type === MediaItemTypes.BIGGER_MV ? "256px" : "98px",
      borderRadius: "4px",
      marginBottom: "10px",
    }
  }

  const extraCss = css`
    width: ${imgConfig.width};
    height: ${imgConfig.height};
    min-width: ${imgConfig.width};
    min-height: ${imgConfig.height || imgConfig["min-height"]};
    border-radius: ${imgConfig.borderRadius};
    margin-bottom: ${imgConfig.marginBottom || 0};
    margin-right: 16px;
  `
  return <MyImage styledCss={extraCss} url={imgUrl} />
})

ItemImg.propTypes = {
  type: PropTypes.string,
  imgUrl: PropTypes.string,
}

const MediaItem = memo(
  ({
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
  }) => {
    const [artistNameDesc, albumNameDesc] = desc?.split(" · ") ?? ["", ""]
    const innerDD = desc || publishTime
    return (
      <StyledResultItem
        isMultipColumItem={
          type === MediaItemTypes.BIG_ALBUM || type === MediaItemTypes.BIG_MV
        }
        isSingleColumItem={type === MediaItemTypes.BIGGER_MV}
      >
        {duration && <DurationTag>{duration}</DurationTag>}
        <ItemImg type={type} imgUrl={imgUrl} />
        <ReactPlaceholder
          ready={!!title}
          rows={2}
          color="grey"
          showLoadingAnimation
          style={{ width: "40%", borderRadius: 200, height: 30 }}
        >
          <dl>
            <dt>{title}</dt>
            <dd>{innerDD}</dd>
          </dl>
        </ReactPlaceholder>

        {type === MediaItemTypes.SONG && (
          <SongMore
            songName={title}
            artistName={artistName || artistNameDesc}
            albumName={albumName || albumNameDesc}
            artistId={artistId}
            albumId={albumId}
          />
        )}
      </StyledResultItem>
    )
  },
)

MediaItem.displayName = "MediaItem"

MediaItem.propTypes = {
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
}

const MediaItemList = ({ list, title, placeHolderCount, moreUrl }) => {
  return (
    <>
      {moreUrl && title ? (
        <Link to={moreUrl}>
          <MediaItemTitle withoutMore={!moreUrl}>{title}</MediaItemTitle>
        </Link>
      ) : (
        title && <MediaItemTitle withoutMore={!moreUrl}>{title}</MediaItemTitle>
      )}
      <List
        list={list || new Array(placeHolderCount || 1).fill({})}
        // eslint-disable-next-line react/jsx-props-no-spreading
        listItem={({ item, index }) => <MediaItem {...item} key={index} />}
      />
    </>
  )
}

MediaItemList.propTypes = {
  moreUrl: PropTypes.string,
  placeHolderCount: PropTypes.number,
  list: PropTypes.array,
  title: PropTypes.string,
}

export default MediaItemList
