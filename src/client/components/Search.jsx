/* eslint-disable no-nested-ternary */
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

const BEST_SEARCH_SELECTOR = {
  artist: {
    selector: data => {
      return {
        imgUrl: data.img1v1Url || data.picUrl,
        title: `艺人：${data.name}`,
        desc: `歌曲：${data.musicSize} 专辑：${data.albumSize}`,
      }
    },
  },
  mv: {
    selector: data => {
      return {
        imgUrl: data.cover,
        title: `MV：${data.name}`,
        desc: `歌手：${data.artistName} 播放量：${data.playCount}`,
      }
    },
  },
  album: {
    selector: data => {
      return {
        imgUrl: data.picUrl,
        title: `专辑：${data.name}`,
        desc: `歌手：${data.artist.name}`,
      }
    },
  },
}

const SEARCH_RESULT_SELECTOR = {
  playList: {
    desc: "歌单",
    selector: data => {
      return {
        imgUrl: data.coverImgUrl,
        title: `${data.name}`,
        desc: `${data.trackCount}首`,
      }
    },
  },
  song: {
    desc: "歌曲",
    selector: data => {
      return {
        imgUrl: data.al.picUrl,
        title: `${data.name}`,
        desc: `${data.ar[0].name} · ${data.al.name}`,
      }
    },
  },
  artist: {
    desc: "艺人",
    selector: data => {
      return {
        imgUrl: data.img1v1Url || data.picUrl,
        title: `艺人：${data.name}`,
        desc: `mv:${data.mvSize}  专辑:${data.albumSize}`,
      }
    },
  },
  video: {
    desc: "视频",
    selector: data => {
      return {
        imgUrl: data.coverUrl,
        title: `${data.title}`,
        desc: `${data.creator[0].userName}`,
      }
    },
  },
  album: {
    desc: "专辑",
    selector: data => {
      return {
        imgUrl: data.picUrl,
        title: `${data.name}`,
        desc: `${data.artist.name}`,
      }
    },
  },
}

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
const ResultItemDefaultImg = styled.img`
  width: 44px;
  height: 44px;
  min-width: 44px;
  min-height: 44px;
  border-radius: 50%;
`

const ResultItemAlbumImg = styled.img`
  width: 48px;
  height: 48px;
  min-width: 48px;
  min-height: 48px;
  border-radius: 4px;
`

const ResultItemSongImg = styled.img`
  width: 44px;
  height: 44px;
  min-width: 44px;
  min-height: 44px;
  border-radius: 4px;
`

const ResultItemVideoImg = styled.img`
  width: 89px;
  height: 50px;
  min-width: 89px;
  min-height: 50px;
  border-radius: 4px;
`

const ResultItem = styled.div`
  margin: 20px 0;
  display: flex;
  align-items: center;
  img {
    background-color: ${props => props.theme.dg};
    margin-right: 16px;

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
  let img = (
    <ResultItemDefaultImg
      src={imgUrl}
      alt=""
      onLoaded={imageOnLoad}
      isImageLoaded
    />
  )
  if (type === "album" || type === "playList") {
    img = (
      <ResultItemAlbumImg
        src={imgUrl}
        alt=""
        onLoaded={imageOnLoad}
        isImageLoaded
      />
    )
  }
  if (type === "song") {
    img = (
      <ResultItemSongImg
        src={imgUrl}
        alt=""
        onLoaded={imageOnLoad}
        isImageLoaded
      />
    )
  }

  if (type === "video") {
    img = (
      <ResultItemVideoImg
        src={imgUrl}
        alt=""
        onLoaded={imageOnLoad}
        isImageLoaded
      />
    )
  }
  return img
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

// const SearchResultList = memo(({  }) => {

// })

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

    const { data: searchBestMatch } = useSWR(
      keyword ? `/api/search/multimatch?keywords=${keyword}` : "",
      onSearchBestMatch,
    )

    const { data: searchResultList, isValidating: isLoadSearchData } = useSWR(
      keyword ? `/api/search?keywords=${keyword}&type=1018` : "",
      onSearch,
    )

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
        {!isLoadSearchData &&
        (searchBestMatch?.type || searchResultList?.order.length > 0) ? (
          <SearchResultList>
            {searchBestMatch?.type && (
              <BestMatchContainer>
                <SearchResultTypeTitle>最佳匹配</SearchResultTypeTitle>
                <ResultItemContainer
                  {...BEST_SEARCH_SELECTOR[searchBestMatch.type].selector(
                    searchBestMatch.data[0],
                  )}
                />
              </BestMatchContainer>
            )}
            {searchResultList?.order.length > 0 &&
              searchResultList.order.map((type, index) => {
                const typeData = SEARCH_RESULT_SELECTOR[type]
                let dataList = searchResultList[type][`${type}s`]
                if (type === "song") {
                  dataList = dataList.slice(0, 5)
                }
                return (
                  typeData && (
                    <React.Fragment key={index}>
                      <SearchResultTypeTitle>
                        {typeData.desc}
                      </SearchResultTypeTitle>
                      {dataList.map((data, idx) => (
                        <ResultItemContainer
                          {...typeData.selector(data)}
                          key={idx}
                          type={type}
                        />
                      ))}
                    </React.Fragment>
                  )
                )
              })}
          </SearchResultList>
        ) : isLoadSearchData ? (
          <Spinner style={{ marginTop: 40 }} />
        ) : (
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
        )}
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
