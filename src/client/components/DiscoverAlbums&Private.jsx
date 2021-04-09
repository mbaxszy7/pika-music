import React from "react"
import styled from "styled-components"
import useSWR from "swr"
import mediaQury from "../../shared/mediaQury.styled"
import MediaItemList, { MediaItemTitle } from "./MediaItemList"
import discoverPage from "../pages/Discover/connectDiscoverReducer"

const StyledMediaItemTitle = styled(MediaItemTitle)`
  color: ${props => props.theme.fg};
  &:target {
    color: ${props => props.theme.secondary} !important;
  }
`

const AlbumsSection = styled.section`
  position: relative;
  > ${StyledMediaItemTitle} {
    position: sticky;
    left: 0;
    margin-top: 20px !important;
    color: ${props => props.theme.dg};
  }
  min-width: 100%;
  white-space: nowrap;
  overflow-y: scroll;
`

const PrivateMVsSection = styled.section`
  > ${MediaItemTitle} {
    margin-top: 20px;
    color: ${props => props.theme.dg};
  }
  min-width: 100%;
  ${mediaQury.aboveTablet`
    white-space: nowrap;
    overflow-y: scroll;
    `}
`

const DiscoverAlbumsAndPrivate = () => {
  const { data: albums } = useSWR(
    "/api/album/newest",
    discoverPage.requestAlbums,
  )

  const { data: mvs } = useSWR(
    "/api/personalized/privatecontent",
    discoverPage.requestPrivateMVs,
  )
  return (
    <>
      <AlbumsSection>
        <StyledMediaItemTitle withoutMore id="album">
          Album_专辑
        </StyledMediaItemTitle>
        <MediaItemList
          title=""
          list={
            albums?.slice?.(0, 12) ?? new Array(4).fill({ type: "bigAlbum" })
          }
        />
      </AlbumsSection>

      <PrivateMVsSection>
        <StyledMediaItemTitle id="mv" withoutMore>
          MV_独家放送
        </StyledMediaItemTitle>
        <MediaItemList
          list={mvs?.slice?.(0, 3) ?? new Array(3).fill({ type: "privateMV" })}
        />
      </PrivateMVsSection>
    </>
  )
}

export default DiscoverAlbumsAndPrivate
