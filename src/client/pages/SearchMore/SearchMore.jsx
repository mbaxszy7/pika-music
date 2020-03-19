import React, { useRef, useCallback, useState, useMemo } from "react"
import styled from "styled-components"
import queryString from "query-string"
import { useLocation } from "react-router-dom"
import searchMorePage from "./connectSearchMoreReducer"
import ScrollPaginationMediaItems from "../../components/ScrollPaginationMediaItems"
import PageBack from "../../components/PageBack"
import { SEARCH_RESULT_SELECTOR } from "../Discover/connectDiscoverReducer"
import PlaySongsBar from "../../components/PlaySongsBar"
import { useIsomorphicEffect } from "../../../utils/hooks"

const ListWrapper = styled.div`
  margin-top: 78px;
  width: 100%;
`

const SearchMorePage = styled.div`
  min-height: 100%;
  padding: 30px 15px 40px 15px;
  overflow: hidden;
`
const PageBackWrapper = styled.div`
  position: fixed;
  padding: 25px 15px 15px 15px;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 501;
  background-color: ${props => props.theme.mg};
`

const requestUrl = {
  playlist: (k, offset) =>
    `/api/search?keywords=${k}&offset=${offset}&type=1000&limit=30`,
  song: (k, offset) =>
    `/api/search?keywords=${k}&offset=${offset}&type=1&limit=30`,
  artist: (k, offset) =>
    `/api/search?keywords=${k}&offset=${offset}&type=100&limit=30`,
  mv: (k, offset) =>
    `/api/search?keywords=${k}&offset=${offset}&type=1004&limit=30`,
  album: (k, offset) =>
    `/api/search?keywords=${k}&offset=${offset}&type=10&limit=30`,
}

const SearchMore = () => {
  const [itemsCount, setItemsCount] = useState(0)
  const pageContainerRef = useRef()

  const locationSearch = useLocation().search
  const { type, keyword } = queryString.parse(locationSearch)

  const scrollRef = useCallback(() => pageContainerRef.current, [])
  const getFetchUrl = useCallback(
    offset => [requestUrl[type](keyword, offset), type, offset],
    [keyword, type],
  )

  useIsomorphicEffect(() => {
    document.getElementById("root").scrollTop = 0
  }, [])

  const mockLoadingOptions = useMemo(() => {
    let opts = { type }
    if (type === "song") {
      opts = { ...opts, noImg: true, noIndex: true }
    }
    return opts
  }, [type])

  return (
    <SearchMorePage ref={pageContainerRef}>
      <PageBackWrapper>
        <PageBack title={SEARCH_RESULT_SELECTOR[type.toLowerCase()].desc} />
        <div style={{ marginTop: 20 }}>
          <PlaySongsBar songsCount={itemsCount} withoutBar />
        </div>
      </PageBackWrapper>
      <ListWrapper>
        <ScrollPaginationMediaItems
          keyPage="search-more"
          getScrollRef={scrollRef}
          pageFetch={searchMorePage.requestSearch}
          getUrl={getFetchUrl}
          mockLoadingOption={mockLoadingOptions}
          setItemsCount={setItemsCount}
        />
      </ListWrapper>
    </SearchMorePage>
  )
}

SearchMore.csr = true

export default SearchMore
