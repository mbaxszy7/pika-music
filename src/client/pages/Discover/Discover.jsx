import React from "react"
import styled from "styled-components"
import { useSelector } from "react-redux"
import useSWR from "swr"
import discoverPage from "./connectDiscoverReducer"
import BannerListContainer from "../../components/Banner"

const BannersSection = styled.section`
  margin: 15px;
`

const Discover = () => {
  const initialBannerList = useSelector(state => state.discover.bannerList)
  const { data: bannerList } = useSWR(
    "/api/banner?type=2",
    discoverPage.requestBannerList,
    {
      initialData: initialBannerList,
    },
  )

  return (
    <BannersSection>
      <BannerListContainer bannerList={bannerList ?? []} />
    </BannersSection>
  )
}

export default Discover
