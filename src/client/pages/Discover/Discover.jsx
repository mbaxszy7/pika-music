/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { memo, useMemo, useCallback } from "react"
import styled from "styled-components"
import { Link } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import useSWR from "swr"
import discoverPage from "./connectDiscoverReducer"
import BannerListContainer from "../../components/Banner"
import Search from "../../components/Search"
import playBarPage from "../PlayBar/connectPlayBarReducer"
import { MyImage } from "../../../shared/Image"
import MediaItemList, { MediaItemTitle } from "../../components/MediaItemList"
import { useIsomorphicEffect } from "../../../utils/hooks"
import mediaQury from "../../../shared/mediaQury.styled"

const StyledMediaItemTitle = styled(MediaItemTitle)`
  color: ${props => props.theme.fg};
  &:target {
    color: ${props => props.theme.secondary} !important;
  }
`

const BannersSection = styled.section`
  ${mediaQury.aboveTablet`
    max-width: 50vw;
    margin: 0 auto;
    margin-top: 30px;
  `}
  width: 100%;
`
const DiscoverPage = styled.main`
  position: relative;
  padding: 15px;
  overflow: hidden;
  ${mediaQury.aboveTablet`
    margin-left: 240px;
  `}
`

const PersonalizedSongsSection = styled.section`
  margin-top: 40px;
`

const StyledMyImage = styled(MyImage)`
  & {
    ${mediaQury.aboveTablet`
      width: 8vw !important;
    `}
  }
`

const StyledCenterMyImage = styled(MyImage)`
  & {
    width: 56% !important;
    position: absolute;
    left: 50%;
    bottom: 0;
    transform: translateX(-50%);
    ${mediaQury.aboveTablet`
      width: 10vw !important;
      left: 8vw;
   `}
  }
`

const PersonalizedSongsContainer = styled.div`
  width: 100%;
  background-color: black;
  border-radius: 30px 200px 200px 30px;
  display: flex;
  align-items: center;
  /* min-height: 73px; */
  ${mediaQury.aboveTablet`
      display: none;
  `}
  .left_images {
    font-size: 0;
    flex: 2;
    height: 100%;
    position: relative;
    img {
      border-radius: 5px;
      width: 50%;
    }
  }
  .title {
    text-align: center;
    color: ${props => props.theme.dg};
    font-size: 14px;
    flex: 2;
    letter-spacing: 0.3em;
  }
  .right_play_bar {
    margin: 15px 20px 15px 0;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: ${props => props.theme.secondary};
    &::after {
      content: "";
      width: 0;
      height: 0;
      border-top: 0px solid transparent;
      border-bottom: 12px solid black;
      border-left: 9px solid transparent;
      border-right: 9px solid transparent;
      transform: rotate(90deg) translate(-6px, 7px);
      display: block;
      position: relative;
      top: 50%;
      left: 50%;
      border-radius: 3px;
    }
  }
`

const PlayListSection = styled.section`
  min-width: 100%;
  white-space: nowrap;
  overflow-y: scroll;
`

const NewSongsSection = styled.section`
  ${MediaItemTitle} {
    margin-top: 10px;
    color: ${props => props.theme.dg};
  }
  min-width: 100%;
  overflow: hidden;
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

const SectionScroll = styled.div`
  display: flex;
  max-width: 100%;
  overflow-y: scroll;
  > ${PlayListSection}:first-of-type {
    padding-left: 6px;
  }
`

const Discover = memo(() => {
  const lastSearchWord = useSelector(state => state.discover.lastSearchWord)

  const initialBannerList = useSelector(state => state.discover.bannerList)
  const initialPersonalizedSongs = useSelector(
    state => state.discover.personalizedSongs,
  )
  const initialPlaylists = useSelector(state => state.discover.playlists)
  const initialNewSongs = useSelector(state => state.discover.newSongs)
  const initialAlbums = useSelector(state => state.discover.albums)
  const initialMVs = useSelector(state => state.discover.mvs)

  useIsomorphicEffect(() => {
    document.getElementById("root").scrollTop = 0
  }, [])

  const { data: bannerList } = useSWR(
    "/api/banner?type=2",
    discoverPage.requestBannerList,
    {
      initialData: initialBannerList,
    },
  )
  const { data: personalizedSongs } = useSWR(
    "/api/personalized/newsong",
    discoverPage.requestPersonalizedSongs,
    {
      initialData: initialPersonalizedSongs,
    },
  )
  const { data: playlists } = useSWR(
    "/api/top/playlist?limit=8&order=hot",
    discoverPage.requestPlaylist,
    {
      initialData: initialPlaylists,
    },
  )
  const { data: newSongs } = useSWR(
    "/api/top/song?type=0",
    discoverPage.requestNewSongs,
    {
      initialData: initialNewSongs,
    },
  )

  const { data: albums } = useSWR(
    "/api/album/newest",
    discoverPage.requestAlbums,
    {
      initialData: initialAlbums,
    },
  )

  const { data: mvs } = useSWR(
    "/api/personalized/privatecontent",
    discoverPage.requestPrivateMVs,
    {
      initialData: initialMVs,
    },
  )

  const threePersonalizedSongs = useMemo(
    () => personalizedSongs?.slice?.(0, 3).map(song => song.picUrl),
    [personalizedSongs],
  )

  const storeDispatch = useDispatch()

  const onPlayPersonalizedSongs = useCallback(() => {
    storeDispatch(
      playBarPage.setImmediatelyPlay(
        personalizedSongs?.map(song => song.id) ?? [],
      ),
    )
  }, [personalizedSongs, storeDispatch])

  return (
    <DiscoverPage>
      <Search
        onSearchSuggest={discoverPage.requestSearchSuggest}
        onSearchBestMatch={discoverPage.requestSearchBestMatch}
        onSearch={discoverPage.requestSearch}
        defaultValue={lastSearchWord}
        setLastSearchWord={discoverPage.setLastSearchKeyword}
      />
      <BannersSection>
        <BannerListContainer bannerList={bannerList ?? []} />
      </BannersSection>

      <PersonalizedSongsSection>
        <PersonalizedSongsContainer>
          <div className="left_images">
            {threePersonalizedSongs?.map((pic, index) =>
              index === 2 ? (
                <StyledCenterMyImage key={index} url={pic} alt="" />
              ) : (
                <StyledMyImage key={index} url={pic} alt="" />
              ),
            )}
          </div>
          <p className="title">个性好歌推荐</p>
          <div className="right_play_bar" onClick={onPlayPersonalizedSongs} />
        </PersonalizedSongsContainer>
      </PersonalizedSongsSection>

      <Link to="/discover_more/playlist">
        <StyledMediaItemTitle id="play_list">
          Playlist_歌单
        </StyledMediaItemTitle>
      </Link>
      <SectionScroll>
        <PlayListSection>
          <MediaItemList
            list={
              playlists?.slice?.(0, 12) ??
              new Array(4).fill({ type: "big_playlist" })
            }
          />
        </PlayListSection>
      </SectionScroll>

      <NewSongsSection>
        <StyledMediaItemTitle id="new_track" moreUrl="/discover_more/song">
          Track_新歌
        </StyledMediaItemTitle>
        <MediaItemList
          list={newSongs?.slice?.(0, 5) ?? new Array(5).fill({ type: "song" })}
        />
      </NewSongsSection>

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
    </DiscoverPage>
  )
})

export default Discover
