/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from "react"
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

const StyledAvatar = styled.img`
  width: 134px;
  height: 134px;
  max-width: 134px;
  max-height: 134px;
  margin: 0 auto;
  border-radius: 50%;
  display: block;
`

const ArtistDetailsPage = styled.div`
  padding: 30px 15px 40px 15px;
`

const StyledDesc = styled.div`
  max-height: 70vh;
  overflow-y: scroll;
  margin-top: 15px;
  font-size: 14px;
  line-height: 1.3;
  color: ${props => props.theme.dg};
  ${props => (props.isWhole ? "line-height:1.5" : MultipleLineTexts(2))}
`
const StyledName = styled.p`
  margin-top: 30px;
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

const ArtistDetails = () => {
  const {
    isShowModal,
    isShowContent,
    onModalOpen,
    onModalClose,
  } = useEffectShowModal()

  const initArtistDesc = useSelector(state => state.artistDetails.desc)
  const initArtistSongs = useSelector(state => state.artistDetails.songs)

  const location = useLocation().search
  const { id: artistId, name: artistName } = queryString.parse(location)
  const realArtistName = artistName?.split(" ")?.[0]
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

  return (
    <ArtistDetailsPage>
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
        style={{ width: 134, height: 134, margin: "0 auto" }}
      >
        <StyledAvatar src={artistInfo?.img1v1Url} />
      </ReactPlaceholder>

      <ReactPlaceholder
        type="text"
        ready={!!artistName}
        rows={1}
        showLoadingAnimation
        style={{ width: 100, borderRadius: 200, height: 30, marginTop: 30 }}
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
        color="grey"
        showLoadingAnimation
        style={{ width: "90%", borderRadius: 200, height: 30, marginTop: 15 }}
      >
        <StyledDesc onClick={onModalOpen}>{artistDesc}</StyledDesc>
      </ReactPlaceholder>

      <MediaItemList
        title="歌曲"
        list={artistSongs?.slice(0, 5) ?? new Array(5).fill({ type: "song" })}
      />
    </ArtistDetailsPage>
  )
}

export default ArtistDetails
