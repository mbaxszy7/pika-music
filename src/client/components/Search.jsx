/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/require-default-props */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-indent */
import React, { memo, useState, useCallback, useEffect, useRef } from "react"
import Hotkeys from "react-hot-keys"
import { useDispatch } from "react-redux"
import ReactPlaceholder from "react-placeholder"
import PropTypes from "prop-types"
import useSWR from "swr"
import styled from "styled-components"
import { useLocalStorage } from "../../utils/hooks"
import List from "../../shared/List"
import searchIcon from "../../assets/searchIcon.png"
import clearIcon from "../../assets/clear.png"
import Dialog from "../../shared/Dialog"
import Spinner from "../../shared/Spinner"
import MediaItemList from "./MediaItemList"

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

const BestMatchContainer = styled.div`
  color: ${props => props.theme.fg};
`

const SearchResultList = styled.div`
  padding: 5px 0 0 4px;
  position: absolute;
  width: calc(100% - 30px);
  z-index: 999;
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
        <ReactPlaceholder
          type="text"
          ready={!isValidating || (isValidating && !inputValue)}
          color="grey"
          rows={3}
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

const Search = memo(
  ({
    onSearch,
    onSearchSuggest,
    onSearchBestMatch,
    defaultValue,
    setLastSearchWord,
  }) => {
    const inputRef = useRef()
    const [isShowDialog, setShowDialog] = useState(false)
    const [isFocus, setIsFocus] = useState(!!defaultValue)
    const [value, setValue] = useState(defaultValue)
    const [keyword, setKeyword] = useState(defaultValue)
    const dispatch = useDispatch()

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
      setShowDialog(false)
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

    const onEnterKeyDown = useCallback(() => {
      inputRef.current.blur()
      setKeyword(value)
    }, [value])

    useEffect(() => {
      dispatch(setLastSearchWord(keyword))
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [keyword])

    // useEffect(() => {
    //   if (defaultValue) {
    //     setKeyword(defaultValue)
    //   }
    // }, [defaultValue])

    return (
      <>
        <Hotkeys
          keyName="enter"
          onKeyDown={onEnterKeyDown}
          filter={() => true}
        />
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
            ref={inputRef}
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
        {isFocus && (
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
        )}
      </>
    )
  },
)

Search.propTypes = {
  setLastSearchWord: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  onSearchBestMatch: PropTypes.func.isRequired,
  onSearchSuggest: PropTypes.func.isRequired,
  defaultValue: PropTypes.string,
}
Search.defaultProps = {
  defaultValue: "",
}
export default Search
