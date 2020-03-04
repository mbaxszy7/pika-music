/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/require-default-props */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect, useRef, useCallback, memo } from "react"
import PropTypes from "prop-types"
import styled from "styled-components"
import useSWR from "swr"
import ReactPlaceholder from "react-placeholder"
import { useLocation } from "react-router-dom"
import queryString from "query-string"
import { useSelector, useDispatch } from "react-redux"
import artistDetailsPage from "./connectArtistDetailsReducer"
import SingleLineTexts, {
  MultipleLineTexts,
} from "../../../shared/LinesTexts.styled"
import InnerModal from "../../../shared/InnerModal"
import { useEffectShowModal, useEleScrollValue } from "../../../utils/hooks"
import MediaItemList from "../../components/MediaItemList"
import PageBack from "../../components/PageBack"
import { clamp } from "../../../utils"
import Avatar from "../../../shared/Avatar"

const PageBackWrapper = styled.div`
  position: fixed;
  padding: 25px 15px 15px 15px;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 501;
  opacity: ${props => props.opacity};
  background-color: ${props => props.theme.mg};
`

const StyledAvatar = styled.div`
  margin: 0 auto;
  margin-top: 35px;
  position: sticky;
  z-index: 0;
  top: 15px;
  display: flex;
  justify-content: center;
`

const ArtistDetailsPage = styled.div`
  padding: 30px 15px 40px 15px;
`

const StyledDesc = styled.div`
  min-height: 36px;
  max-height: 70vh;
  overflow-y: scroll;
  margin-top: 15px;
  font-size: 16px;
  line-height: 1.3;
  color: ${props => props.theme.dg};
  ${props => (props.isWhole ? "line-height:1.5" : MultipleLineTexts(2))}
`
const StyledName = styled.p`
  font-size: 18px;
  line-height: 1.3;
  color: ${props => props.theme.fg};

  ${SingleLineTexts}
`

const StyledDescModal = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  padding: 35px;
  font-size: 16px;
  background: ${props => props.theme.mg};
  color: ${props => props.theme.fg};
  padding-bottom: 70px;
  transition: opacity 0.2s;
  opacity: ${props => (props.isShow ? "1" : "0")};
  z-index: 1000;
  .close {
    position: absolute;
    bottom: 40px;
    color: ${props => props.theme.fg};
    text-align: center;
    font-size: 40px;
    width: 100%;
    left: 0;
  }
`

const ScrollContainer = styled.div`
  position: sticky;
  padding-top: 30px;
  background-color: ${props => props.theme.mg};
  z-index: 5;
  overflow: hidden;
`

const ArtistNameAndBrief = memo(
  ({ realArtistName, artistInfo, artistDesc }) => {
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
              <StyledDesc isWhole>{artistDesc}</StyledDesc>
              <div className="close" onClick={onModalClose} data-close="true">
                &times;
              </div>
            </StyledDescModal>
          </InnerModal>
        )}

        <ReactPlaceholder
          type="text"
          ready={!!(realArtistName != null && artistDesc != null)}
          style={{ marginTop: 0 }}
          customPlaceholder={
            <>
              <ReactPlaceholder
                type="textRow"
                ready={false}
                style={{ width: 120, margin: "0 0 20px 0", height: "1.5em" }}
              >
                {" "}
              </ReactPlaceholder>
              <ReactPlaceholder type="textRow" ready={false}>
                {" "}
              </ReactPlaceholder>
              <ReactPlaceholder type="textRow" ready={false}>
                {" "}
              </ReactPlaceholder>
            </>
          }
          showLoadingAnimation
        >
          {realArtistName && (
            <StyledName>
              {`${realArtistName}${artistInfo ? ` (${artistInfo})` : ""}`}
            </StyledName>
          )}
          {artistDesc && (
            <StyledDesc onClick={onModalOpen}>{artistDesc}</StyledDesc>
          )}
        </ReactPlaceholder>
      </>
    )
  },
)

ArtistNameAndBrief.propTypes = {
  realArtistName: PropTypes.string,
  artistInfo: PropTypes.string,
  artistDesc: PropTypes.string,
}

const ArtistDetails = () => {
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

  const initArtistDesc = useSelector(state => state.artistDetails.desc)
  const initArtistSongs = useSelector(state => state.artistDetails.songs)
  const initArtistAlbums = useSelector(state => state.artistDetails.albums)
  const initMVs = useSelector(state => state.artistDetails.mvs)
  const storeDispatch = useDispatch()
  const location = useLocation()
  const { id: artistId, name: artistName } = queryString.parse(location.search)

  const [realArtistName, setRealArtistName] = useState(
    () => artistName?.split(" ")?.[0],
  )

  useEffect(() => {
    const { name } = queryString.parse(window.location.search)
    setRealArtistName(name)
  }, [artistId, storeDispatch])

  useEffect(() => {
    if (artistId) {
      storeDispatch(artistDetailsPage.setAlbums(null))
      storeDispatch(artistDetailsPage.setSONGS(null))
      storeDispatch(artistDetailsPage.setDesc(null))
      storeDispatch(artistDetailsPage.setMVS(null))
    }
  }, [artistId, storeDispatch])

  const { data: artistDesc } = useSWR(
    `/api/artist/desc?id=${artistId}`,
    artistDetailsPage.requestArtistDesc,
    {
      initialData: initArtistDesc,
    },
    {
      revalidateOnFocus: false,
    },
  )

  const { data: artistSongs } = useSWR(
    `/api/artists?id=${artistId}`,
    artistDetailsPage.requestArtistSongs,
    {
      initialData: initArtistSongs,
    },
    {
      revalidateOnFocus: false,
    },
  )

  const { data: artistAlbums } = useSWR(
    `/api/artist/album?id=${artistId}&offset=0&limit=4`,
    artistDetailsPage.requestArtistAlbums,
    {
      initialData: initArtistAlbums,
    },
    {
      revalidateOnFocus: false,
    },
  )

  const { data: artistMVs } = useSWR(
    `/api/artist/mv?id=${artistId}&offset=0&limit=4`,
    artistDetailsPage.requestArtistMVs,
    {
      initialData: initMVs,
    },
    {
      revalidateOnFocus: false,
    },
  )

  return (
    <ArtistDetailsPage>
      <PageBackWrapper opacity={headerOpacity}>
        <PageBack title={headerOpacity !== 2 ? realArtistName : ""} />
      </PageBackWrapper>

      <StyledAvatar>
        <Avatar url={artistSongs?.[0][1]?.img1v1Url} size="large" />
      </StyledAvatar>

      <ScrollContainer ref={scrollContainerRef}>
        <ArtistNameAndBrief
          realArtistName={realArtistName}
          artistInfo={artistSongs?.[0][1]?.alias?.[0]}
          artistDesc={artistDesc}
        />
        <MediaItemList
          moreUrl={`/artist/media?type=song&artistId=${artistId}`}
          title="歌曲"
          list={
            artistSongs?.[0][0].slice?.(0, 5) ??
            new Array(5).fill({ type: "song" })
          }
        />
        <MediaItemList
          moreUrl={`/artist/media?type=bigAlbum&artistId=${artistId}`}
          title="专辑"
          list={artistAlbums?.[0] ?? new Array(4).fill({ type: "bigAlbum" })}
        />
        <MediaItemList
          moreUrl={`/artist/media?type=biggerMV&artistId=${artistId}`}
          title="MV"
          list={artistMVs?.[0] ?? new Array(4).fill({ type: "bigMV" })}
        />
      </ScrollContainer>
    </ArtistDetailsPage>
  )
}

export default ArtistDetails
