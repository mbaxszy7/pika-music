/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect, useLayoutEffect, useRef } from "react"
import styled from "styled-components"
import useSWR from "swr"
import ReactPlaceholder from "react-placeholder"
import { useLocation } from "react-router-dom"
import queryString from "query-string"
import { useSelector } from "react-redux"
import artistDetailsPage from "./connectArtistDetailsReducer"
import SingleLineTexts, {
  MultipleLineTexts,
} from "../../../shared/LinesTexts.styled"
import InnerModal from "../../../shared/InnerModal"
import { useEffectShowModal } from "../../../utils/hooks"
import MediaItemList from "../../components/MediaItemList"
import PageBack from "../../components/PageBack"

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

const StyledAvatar = styled.img`
  width: 134px;
  height: 134px;
  max-width: 134px;
  max-height: 134px;
  margin: 0 auto;
  border-radius: 50%;
  display: block;
  margin-top: 35px;
  position: sticky;
  z-index: 0;
  top: 15px;
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

const ArtistDetails = () => {
  const {
    isShowModal,
    isShowContent,
    onModalOpen,
    onModalClose,
  } = useEffectShowModal()
  const scrollContainerRef = useRef()
  const [headerOpacity, setHeaderOpacity] = useState(2)
  const initArtistDesc = useSelector(state => state.artistDetails.desc)
  const initArtistSongs = useSelector(state => state.artistDetails.songs)
  const initArtistAlbums = useSelector(state => state.artistDetails.albums)
  const initMVs = useSelector(state => state.artistDetails.mvs)

  const location = useLocation().search
  const { id: artistId, name: artistName } = queryString.parse(location)
  const [realArtistName, setRealArtistName] = useState(
    () => artistName?.split(" ")?.[0],
  )

  useLayoutEffect(() => {
    window.scroll(0, 0)
  }, [])

  useEffect(() => {
    const { name } = queryString.parse(window.location.search)
    setRealArtistName(name)
  }, [])

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

  const { data: artistInfo } = useSWR(
    [`/api/search?keywords=${realArtistName}&type=100`, artistId],
    artistDetailsPage.requestArtistInfo,
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

  useEffect(() => {
    const onWindowScroll = () => {
      const { top } = scrollContainerRef.current.getBoundingClientRect()
      const opacityV = (184 - top) / 184
      // eslint-disable-next-line no-nested-ternary
      const op = opacityV < 0 ? 0 : opacityV > 1 ? 1 : opacityV
      setHeaderOpacity(op.toFixed(2) === "0.00" ? 2 : op.toFixed(2))
    }
    window.addEventListener("scroll", onWindowScroll)
    return () => window.removeEventListener("scroll", onWindowScroll)
  }, [])

  return (
    <ArtistDetailsPage>
      <PageBackWrapper opacity={headerOpacity}>
        <PageBack title={headerOpacity !== 2 ? realArtistName : ""} />
      </PageBackWrapper>

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
        type="round"
        ready={!!artistInfo?.img1v1Url}
        style={{ width: 134, height: 134, margin: "20px  auto 0 auto" }}
      >
        <StyledAvatar src={artistInfo?.img1v1Url} />
      </ReactPlaceholder>

      <ScrollContainer ref={scrollContainerRef}>
        <ReactPlaceholder
          type="text"
          ready={!!realArtistName}
          rows={1}
          showLoadingAnimation
          style={{
            width: 120,
            borderRadius: 200,
            fontSize: "1.5em",
            marginTop: 30,
          }}
        >
          <StyledName>
            {`${realArtistName}${
              artistInfo?.alia?.[0] ? ` (${artistInfo.alia[0]})` : ""
            }`}
          </StyledName>
        </ReactPlaceholder>

        <ReactPlaceholder
          type="text"
          ready={!!artistDesc}
          rows={2}
          showLoadingAnimation
          style={{ borderRadius: 200, height: "2.5em", marginTop: 20 }}
        >
          <StyledDesc onClick={onModalOpen}>{artistDesc}</StyledDesc>
        </ReactPlaceholder>

        <MediaItemList
          moreUrl={`/artist/media?type=song&artistId=${artistId}`}
          title="歌曲"
          list={
            artistSongs?.[0].slice(0, 5) ?? new Array(5).fill({ type: "song" })
          }
        />
        <MediaItemList
          moreUrl={`/artist/media?type=bigAlbum&artistId=${artistId}`}
          title="专辑"
          list={artistAlbums?.[0] ?? new Array(4).fill({ type: "bigAlbum" })}
        />
        <MediaItemList
          moreUrl={`/artist/media?type=biggerMV&artistId=${artistId}`}
          title="视频"
          list={artistMVs?.[0] ?? new Array(4).fill({ type: "bigMV" })}
        />
      </ScrollContainer>
    </ArtistDetailsPage>
  )
}

export default ArtistDetails
