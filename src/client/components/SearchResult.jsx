/* eslint-disable react/no-array-index-key */
/* eslint-disable react/require-default-props */
/* eslint-disable react/prop-types */
import React, { memo, useCallback } from "react"
import useSWR from "swr"
import PropTypes from "prop-types"
import styled from "styled-components"
import Spinner from "../../shared/Spinner"
import MediaItemList from "./MediaItemList"
import MyPlaceholder, { StyledTextRow } from "../../shared/MyPlaceholder"
import clearIcon from "../../assets/clear.png"
import List from "../../shared/List"

const BestMatchContainer = styled.div`
  color: ${props => props.theme.fg};
`

const SearchResultList = styled.div`
  padding: 5px 0 0 4px;
  position: absolute;
  padding: 0 15px;
  width: calc(100% - 15px);
  z-index: 999;
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  padding-bottom: 60px;
`

const SuggestList = styled.ul`
  display: ${props => (props.isFocus ? "block" : "none")};
  position: relative;
  z-index: 999;
  padding: 14px 0 0 4px;
  > ${StyledTextRow} {
    height: 12px;
    background: grey;
    width: 50% !important;
  }
`

const LastSuggestContainer = styled.ul`
  display: ${props => (props.isFocus ? "block" : "none")};
  position: relative;
  z-index: 999;
  padding: 25px 0 0 4px;
  .title {
    color: ${props => props.theme.dg};
  }
`

const ClearSuggestsHistory = styled.span`
  margin-top: 24px;
  color: ${props => props.theme.fg};
  font-size: 14px;
  position: relative;
  display: inline-block;
  left: calc(50%);
  transform: translateX(-50%);
  background-image: url(${clearIcon});
  background-size: 16px 16px;
  background-position: 21px center;
  background-repeat: no-repeat;
  padding: 8px 24px;
  background-color: black;
  border-radius: 200px;
  text-indent: 20px;
`

const SuggestItem = styled.li`
  margin-top: 20px;
  font-size: 16px;
  color: ${props => props.theme.fg};
`

const SearchItem = memo(({ keyword, setKeyword, setValue }) => {
  const onSetKeyword = useCallback(() => {
    setKeyword(keyword)
    setValue(keyword)
  }, [keyword, setKeyword, setValue])
  return (
    <SuggestItem data-suggest={keyword} onClick={onSetKeyword}>
      {keyword}
    </SuggestItem>
  )
})

SearchItem.propTypes = {
  setValue: PropTypes.func.isRequired,
  setKeyword: PropTypes.func.isRequired,
  keyword: PropTypes.string.isRequired,
}

const SuggestHistory = ({
  lastSearchHistory,
  onClearSuggestHistoryClick,
  isFocus,
  setKeyword,
  setValue,
}) => {
  if (!lastSearchHistory?.length) {
    return null
  }
  return (
    <LastSuggestContainer isFocus={isFocus}>
      <span className="title">最近搜索</span>
      <List
        list={[...lastSearchHistory].reverse()}
        listItem={({ item, index }) => (
          <SearchItem
            key={index}
            keyword={item}
            setKeyword={setKeyword}
            setValue={setValue}
          />
        )}
      />

      <ClearSuggestsHistory onClick={onClearSuggestHistoryClick}>
        清空历史
      </ClearSuggestsHistory>
    </LastSuggestContainer>
  )
}

SuggestHistory.propTypes = {
  setValue: PropTypes.func.isRequired,
  setKeyword: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  lastSearchHistory: PropTypes.array,
  onClearSuggestHistoryClick: PropTypes.func,
  isFocus: PropTypes.bool,
}

const SearchSuggestList = memo(
  ({
    inputValue,
    onSearchSuggest,
    setLastSuggestsHistory,
    isFocus,
    setKeyword,
    setValue,
  }) => {
    const { data: searchSuggest, isValidating } = useSWR(
      inputValue
        ? `/api/search/suggest?keywords=${inputValue}&type=mobile`
        : "",
      onSearchSuggest,
    )

    const onSuggestItemClick = useCallback(
      e => {
        const suggest = e.target.getAttribute("data-suggest")
        setLastSuggestsHistory(suggest)
      },
      [setLastSuggestsHistory],
    )

    return (
      <SuggestList isFocus={isFocus} onClick={onSuggestItemClick}>
        <MyPlaceholder
          type="textBlock"
          ready={!isValidating || (isValidating && !inputValue)}
          rows={2}
          delay={200}
        >
          <List
            list={searchSuggest?.allMatch}
            listItem={({ item }) => (
              <SearchItem
                setValue={setValue}
                key={item.keyword}
                keyword={item.keyword}
                setKeyword={setKeyword}
              />
            )}
          />
        </MyPlaceholder>
      </SuggestList>
    )
  },
)

SearchSuggestList.propTypes = {
  setValue: PropTypes.func.isRequired,
  setKeyword: PropTypes.func.isRequired,
  inputValue: PropTypes.string,
  onSearchSuggest: PropTypes.func,
  setLastSuggestsHistory: PropTypes.func,
  isFocus: PropTypes.bool,
}

const SearchResult = memo(
  ({
    keyword,
    value,
    isFocus,
    setValue,
    onSearchSuggest,
    lastSearchHistory,
    setLastSuggestsHistory,
    onSearchBestMatch,
    onSearch,
    onClearSuggestHistoryClick,
    setKeyword,
  }) => {
    const { data: bestMatchData } = useSWR(
      keyword ? `/api/search/multimatch?keywords=${keyword}` : "",
      onSearchBestMatch,
      {
        revalidateOnFocus: false,
      },
    )

    const { data: searchResultList, isValidating: isLoadSearchData } = useSWR(
      keyword ? [`/api/search?keywords=${keyword}&type=1018`, keyword] : "",
      onSearch,
      {
        revalidateOnFocus: false,
      },
    )

    if (isLoadSearchData) {
      return <Spinner style={{ marginTop: 40 }} />
    }

    if (!bestMatchData && !searchResultList) {
      return (
        <>
          <SearchSuggestList
            setKeyword={setKeyword}
            setValue={setValue}
            inputValue={value}
            onSearchSuggest={onSearchSuggest}
            setLastSuggestsHistory={setLastSuggestsHistory}
            isFocus={isFocus}
          />

          <SuggestHistory
            setKeyword={setKeyword}
            setValue={setValue}
            lastSearchHistory={lastSearchHistory}
            onClearSuggestHistoryClick={onClearSuggestHistoryClick}
            isFocus={isFocus}
          />
        </>
      )
    }

    return (
      <SearchResultList>
        {bestMatchData && (
          <BestMatchContainer>
            <MediaItemList
              moreUrl=""
              title="最佳匹配"
              list={[
                {
                  ...bestMatchData,
                },
              ]}
            />
          </BestMatchContainer>
        )}
        {searchResultList &&
          searchResultList.map((typeData, index) => {
            const { type, getDesc, dataList, title } = typeData

            return (
              <React.Fragment key={index}>
                <MediaItemList
                  moreUrl={`/more?type=${type}&keyword=${keyword}`}
                  type={type}
                  title={title}
                  list={dataList.map(data => {
                    const media = getDesc(data)
                    return { ...media, type }
                  })}
                />
              </React.Fragment>
            )
          })}
      </SearchResultList>
    )
  },
)

export default SearchResult
