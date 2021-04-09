/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/require-default-props */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-indent */
import React, { memo, useState, useCallback, useEffect, useRef } from "react"
import Hotkeys from "react-hot-keys"
import { useDispatch } from "react-redux"
import PropTypes from "prop-types"
import styled from "styled-components"
import { useLocalStorage } from "../../utils/hooks"
import searchIcon from "../../assets/searchIcon.png"
import Dialog from "../../shared/Dialog"
import Spinner from "../../shared/Spinner"
// import MediaItemList from "./MediaItemList"

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
    const sertchResultArea = useRef()

    const {
      lastValue: lastSearchHistory,
      setValue: setLastSuggestsHistory,
      clearValue: clearLastSuggestsHistory,
    } = useLocalStorage("searchSuggest")

    const onFocus = useCallback(async () => {
      if (!sertchResultArea.current) {
        const { default: SearchResult } = await import(
          /* webpackChunkName: 'search-result',  webpackPrefetch:true  */ "./SearchResult.jsx"
        )

        sertchResultArea.current = SearchResult
        setIsFocus(true)
      } else {
        setIsFocus(true)
      }
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
    const SearchResult = sertchResultArea.current
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
        {isFocus && SearchResult ? (
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
        ) : isFocus && !SearchResult ? (
          <Spinner style={{ marginTop: 40 }} />
        ) : null}
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
