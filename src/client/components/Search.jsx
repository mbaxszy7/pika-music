/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/require-default-props */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-indent */
import React, { memo, useState, useCallback } from "react"
import ReactPlaceholder from "react-placeholder"
import PropTypes from "prop-types"
import useSWR from "swr"
import styled from "styled-components"
import { useLocalStorage } from "../../utils/hooks"
import List from "../../shared/List"
import searchIcon from "../../assets/search.png"
import clearIcon from "../../assets/clear.png"
import Dialog from "../../shared/Dialog"
import Spinner from "../../shared/Spinner"

const InputWrapper = styled.div`
  display: ${props => (props.isFocus ? "flex" : "block")};
  align-items: center;
  margin-top: ${props => (props.isFocus ? "0" : "20px")};
  transition: all 0.3s ease-in-out;
  &::after {
    ${props => (props.isFocus ? "content:'';" : "")};
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: ${props => props.theme.mg};
    z-index: 99;
  }
  input {
    position: relative;
    z-index: 1000;
  }
  span {
    position: relative;
    z-index: 1000;
  }
`

const Input = styled.input`
  color: ${props => props.theme.fg};
  font-size: 16px;
  border: none;
  height: 30px;
  border-radius: 200px;
  width: 100%;
  background: black;
  outline: none;
  background-image: url(${searchIcon});
  background-size: 16px 16px;
  background-position: 9px center;
  background-repeat: no-repeat;
  text-indent: 30px;
  transition: width 0.8s;
`

const CancelSearchText = styled.span`
  margin-left: 12px;
  visibility: ${props => (props.isFocus ? "" : "hidden")};
  width: ${props => (props.isFocus ? "28px" : "0px")};
  transition: width 0.6s;
  color: ${props => props.theme.fg};
  font-size: 16px;
  white-space: nowrap;
`

const SuggestList = styled.ul`
  display: ${props => (props.isFocus ? "block" : "none")};
  position: relative;
  z-index: 999;
  padding: 14px 0 0 4px;
`

const SuggestItem = styled.li`
  margin-top: 20px;
  font-size: 16px;
  color: ${props => props.theme.fg};
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

const SearchResultTypeTitle = styled.p`
  padding-left: 4px;
  font-weight: bold;
  margin-top: 40px;
  color: ${props => props.theme.dg};
  font-size: 14px;
`

const BestMatchContainer = styled.div`
  color: ${props => props.theme.fg};
`

const SearchResultList = styled.div`
  padding: 5px 0 0 4px;
  position: relative;
  z-index: 999;
`
const ResultItemImage = styled.img`
  width: ${props => props.width || 44}px;
  height: ${props => props.height || 44}px;
  min-width: ${props => props.width || 44}px;
  min-height: ${props => props.height || 44}px;
  border-radius: ${props => props.borderRadius};
`

const ResultItem = styled.div`
  margin: 20px 0;
  display: flex;
  align-items: center;
  img {
    background-color: ${props => props.theme.dg};
    margin-right: 16px;
  }
  img[data-loaded="false"] {
    @keyframes react-placeholder-pulse {
      0% {
        opacity: 0.6;
      }
      50% {
        opacity: 1;
      }
      100% {
        opacity: 0.6;
      }
    }
    animation: react-placeholder-pulse 1.5s infinite;
  }
  dl {
    font-size: 14px;
    dt {
      color: ${props => props.theme.fg};
      margin-bottom: 6px;
      padding-right: 15px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      word-break: break-all;
      line-height: 1.3;
    }
    dd {
      padding-right: 15px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      word-break: break-all;
      font-size: 12px;
      color: ${props => props.theme.dg};
    }
  }
`

const ResultItemImg = memo(({ type, imgUrl }) => {
  const [isImageLoaded, setImageLoaded] = useState(false)
  const imageOnLoad = useCallback(() => {
    setImageLoaded(true)
  }, [])
  let imgConfig = {
    width: 44,
    height: 44,
    borderRadius: "50%",
  }
  if (type === "album" || type === "playList") {
    imgConfig = {
      width: 48,
      height: 48,
      borderRadius: "4px",
    }
  }
  if (type === "song") {
    imgConfig = { ...imgConfig, borderRadius: "4px" }
  }

  if (type === "video") {
    imgConfig = {
      width: 89,
      height: 50,
      borderRadius: "4px",
    }
  }
  return (
    <ResultItemImage
      width={imgConfig.width}
      height={imgConfig.height}
      borderRadius={imgConfig.borderRadius}
      src={imgUrl}
      alt=""
      data-loaded={isImageLoaded}
      onLoad={imageOnLoad}
    />
  )
})

const ResultItemContainer = memo(({ imgUrl, title, desc, type }) => {
  return (
    <ResultItem>
      <ResultItemImg type={type} imgUrl={imgUrl} />
      <dl style={{ width: type === "video" ? "70%" : "85%" }}>
        <dt>{title}</dt>
        <dd>{desc}</dd>
      </dl>
    </ResultItem>
  )
})

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
  if (!lastSearchHistory.length) {
    return null
  }
  return (
    <LastSuggestContainer isFocus={isFocus}>
      <span className="title">最近搜索</span>
      <List
        list={lastSearchHistory}
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
        <ReactPlaceholder
          type="text"
          ready={!isValidating || (isValidating && !inputValue)}
          color="grey"
          rows={3}
          delay={500}
          showLoadingAnimation
          style={{
            width: "60%",
          }}
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
        </ReactPlaceholder>
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
    )

    const { data: searchResultList, isValidating: isLoadSearchData } = useSWR(
      keyword ? `/api/search?keywords=${keyword}&type=1018` : "",
      onSearch,
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
            lastSearchHistory={lastSearchHistory.reverse()}
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
            <SearchResultTypeTitle>最佳匹配</SearchResultTypeTitle>
            <ResultItemContainer {...bestMatchData} />
          </BestMatchContainer>
        )}
        {searchResultList &&
          searchResultList.map((typeData, index) => {
            const { type, getDesc, dataList, title } = typeData
            return (
              <React.Fragment key={index}>
                <SearchResultTypeTitle>{title}</SearchResultTypeTitle>
                {dataList.map((data, idx) => (
                  <ResultItemContainer
                    {...getDesc(data)}
                    key={idx}
                    type={type}
                  />
                ))}
              </React.Fragment>
            )
          })}
      </SearchResultList>
    )
  },
)

const Search = memo(
  ({ onSearch, onSearchSuggest, onSearchBestMatch, defaultValue }) => {
    const [isShowDialog, setShowDialog] = useState(false)
    const [isFocus, setIsFocus] = useState(!!defaultValue)
    const [value, setValue] = useState(defaultValue)
    const [keyword, setKeyword] = useState("")

    const {
      lastValue: lastSearchHistory,
      setValue: setLastSuggestsHistory,
      clearValue: clearLastSuggestsHistory,
    } = useLocalStorage("searchSuggest")

    const onFocus = useCallback(() => {
      setIsFocus(true)
    }, [])

    const onBlur = useCallback(() => {
      setIsFocus(false)
      setValue("")
      setKeyword("")
    }, [])

    const onChange = useCallback(e => {
      setValue(e.target.value)
      setKeyword("")
    }, [])

    const onClearSuggestHistoryClick = useCallback(() => {
      setShowDialog(true)
    }, [])

    const onDialogConfirm = useCallback(() => {
      clearLastSuggestsHistory()
      setShowDialog(false)
    }, [clearLastSuggestsHistory])

    const onDialogCancel = useCallback(() => {
      setShowDialog(false)
    }, [])

    return (
      <>
        {isShowDialog && (
          <Dialog
            title="搜索历史"
            dialogText="确认清空搜索历史？"
            isShowCancel
            isShowConfirm
            onCancelClick={onDialogCancel}
            onConfirmClick={onDialogConfirm}
          />
        )}
        <InputWrapper isFocus={isFocus}>
          <Input
            value={value}
            type="text"
            onFocus={onFocus}
            // onBlur={onBlur}
            onChange={onChange}
            placeholder={isFocus ? "搜索" : ""}
          />
          <CancelSearchText onClick={onBlur} isFocus={isFocus}>
            取消
          </CancelSearchText>
        </InputWrapper>
        <SearchResult
          isFocus={isFocus}
          value={value}
          setValue={setValue}
          keyword={keyword}
          setKeyword={setKeyword}
          onSearchSuggest={onSearchSuggest}
          lastSearchHistory={lastSearchHistory}
          setLastSuggestsHistory={setLastSuggestsHistory}
          onSearchBestMatch={onSearchBestMatch}
          onSearch={onSearch}
          onClearSuggestHistoryClick={onClearSuggestHistoryClick}
        />
      </>
    )
  },
)

Search.propTypes = {
  onSearch: PropTypes.func.isRequired,
  onSearchBestMatch: PropTypes.func.isRequired,
  onSearchSuggest: PropTypes.func.isRequired,
  defaultValue: PropTypes.string,
}
Search.defaultProps = {
  defaultValue: "",
}
export default Search
