/* eslint-disable no-param-reassign */
import produce from "immer"
import { ADD_BANNER_LIST, SET_LAST_SEARCH_WORD } from "./constants"

const defaultState = {}

const discoverReducer = produce((draft, action) => {
  if (action.type === ADD_BANNER_LIST) {
    draft.bannerList = action.data
  }
  if (action.type === SET_LAST_SEARCH_WORD) {
    draft.lastSearchWord = action.data
  }
}, defaultState)

export default discoverReducer
