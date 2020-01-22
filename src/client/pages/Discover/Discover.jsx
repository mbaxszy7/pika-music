import React, { memo } from "react"
import styled from "styled-components"
import { useSelector } from "react-redux"
import useSWR from "swr"
import discoverPage from "./connectDiscoverReducer"
import BannerListContainer from "../../components/Banner"
import Search from "../../components/Search"

const PageTitle = styled.h1`
  font-size: 18px;
  color: ${props => props.theme.fg};
  font-weight: 900;
`

const BannersSection = styled.section`
  width: 100%;
`
const DiscoverPage = styled.main`
  position: relative;
  padding: 15px;
`

const Discover = memo(() => {
  const initialBannerList = useSelector(state => state.discover.bannerList)
  const { data: bannerList } = useSWR(
    "/api/banner?type=2",
    discoverPage.requestBannerList,
    {
      initialData: initialBannerList,
    },
  )

  return (
    <DiscoverPage>
      <PageTitle>DISCOVER</PageTitle>
      <Search
        onSearchSuggest={discoverPage.requestSearchSuggest}
        onSearchBestMatch={discoverPage.requestSearchBestMatch}
        onSearch={discoverPage.requestSearch}
      />
      <BannersSection>
        <BannerListContainer bannerList={bannerList ?? []} />
      </BannersSection>
    </DiscoverPage>
  )
})

export default Discover
