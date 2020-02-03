/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/require-default-props */
import React, { memo } from "react"
import moment from "moment"
import ReactPlaceholder from "react-placeholder"
import PropTypes from "prop-types"
import styled, { css } from "styled-components"
import { MyImage } from "../../shared/Image"
import SongMore from "./SongMore"
import List from "../../shared/List"
import SingleLineTexts, {
  MultipleLineTexts,
} from "../../shared/LinesTexts.styled"

const MediaItemTitle = styled.p`
  padding-left: 4px;
  font-weight: bold;
  margin-top: 40px;
  margin-bottom: 20px;
  color: ${props => props.theme.dg};
  font-size: 14px;
`

export const MediaItemTypes = {
  ALBUM: "album",
  PLAY_LIST: "playList",
  SONG: "song",
  VIDEO: "video",
  ARTIST: "artist",
  BIG_ALBUM: "bigAlbum",
  BIG_MV: "bigMV",
}

const StyledResultItem = styled.div`
  width: ${props => (props.isColumItem ? "48%" : "100%")};
  margin-bottom: ${props => (props.isColumItem ? "10px" : "20px")};
  display: ${props => (props.isColumItem ? "inline-flex" : "flex")};
  flex-direction: ${props => (props.isColumItem ? "column" : "row")};
  align-items: ${props => (props.isColumItem ? "flex-start" : "center")};
  overflow: hidden;
  margin-left: 5px;

  dl {
    font-size: 14px;
    width: ${props => (props.isColumItem ? "100%" : "70%")};

    dt {
      color: ${props => props.theme.fg};
      margin-bottom: 6px;
      padding-right: 15px;
      ${props => (props.isColumItem ? MultipleLineTexts(2) : SingleLineTexts)};
      line-height: 1.3;
    }
    dd {
      padding-right: 15px;
      ${SingleLineTexts}
      font-size: 12px;
      color: ${props => props.theme.dg};
    }
  }
`

const ItemImg = memo(({ type, imgUrl }) => {
  let imgConfig = {
    width: 44,
    height: 44,
    borderRadius: "50%",
  }
  if (type === MediaItemTypes.ALBUM || type === MediaItemTypes.PLAY_LIST) {
    imgConfig = {
      width: 48,
      height: 48,
      borderRadius: "4px",
    }
  }
  if (type === MediaItemTypes.SONG) {
    imgConfig = { ...imgConfig, borderRadius: "4px" }
  }

  if (type === MediaItemTypes.VIDEO) {
    imgConfig = {
      width: 89,
      height: 50,
      borderRadius: "4px",
    }
  }
  if (type === MediaItemTypes.BIG_ALBUM) {
    imgConfig = {
      width: 130,
      height: 130,
      borderRadius: "4px",
      marginBottom: "10px",
    }
  }
  if (type === MediaItemTypes.BIG_MV) {
    imgConfig = {
      width: 130,
      height: 98,
      borderRadius: "4px",
      marginBottom: "10px",
    }
  }

  const extraCss = css`
    width: ${imgConfig.width}px;
    height: ${imgConfig.height}px;
    min-width: ${imgConfig.width}px;
    min-height: ${imgConfig.height}px;
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
  }) => {
    const [artistNameDesc, albumNameDesc] = desc?.split(" · ") ?? ["", ""]
    return (
      <StyledResultItem
        isColumItem={
          type === MediaItemTypes.BIG_ALBUM || type === MediaItemTypes.BIG_MV
        }
      >
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
            <dd>
              {desc ||
                (publishTime
                  ? moment(new Date(publishTime), "YYYY-MM-DD").format(
                      "YYYY-MM-DD",
                    )
                  : "")}
            </dd>
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
  imgUrl: PropTypes.string,
  title: PropTypes.string,
  artistName: PropTypes.string,
  albumName: PropTypes.string,
  desc: PropTypes.string,
  type: PropTypes.string,
  albumId: PropTypes.number,
  artistId: PropTypes.number,
  publishTime: PropTypes.number,
}

const MediaItemList = ({ list, title, placeHolderCount }) => {
  return (
    <>
      <MediaItemTitle>{title}</MediaItemTitle>
      <List
        list={list || new Array(placeHolderCount || 1).fill({})}
        // eslint-disable-next-line react/jsx-props-no-spreading
        listItem={({ item, index }) => <MediaItem {...item} key={index} />}
      />
    </>
  )
}

MediaItemList.propTypes = {
  placeHolderCount: PropTypes.number,
  list: PropTypes.array,
  title: PropTypes.string,
}

export default MediaItemList
