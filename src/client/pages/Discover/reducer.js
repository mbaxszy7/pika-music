/* eslint-disable no-param-reassign */
import produce from "immer"
import {
  ADD_BANNER_LIST,
  SET_LAST_SEARCH_WORD,
  ADD_PERSONALIZED_SONGS,
  ADD_PLAY_LIST,
  ADD_NEW_SONGS,
  ADD_ALBUMS,
  ADD_MVS,
} from "./constants"

const defaultState = {}

const discoverReducer = produce((draft, action) => {
  if (action.type === ADD_BANNER_LIST) {
    draft.bannerList = action.data
  }
  if (action.type === SET_LAST_SEARCH_WORD) {
    draft.lastSearchWord = action.data
  }
  if (action.type === ADD_PERSONALIZED_SONGS) {
    draft.personalizedSongs = action.data
  }
  if (action.type === ADD_PLAY_LIST) {
    draft.playlists = action.data
  }
  if (action.type === ADD_NEW_SONGS) {
    draft.newSongs = action.data
  }
  if (action.type === ADD_ALBUMS) {
    draft.albums = action.data
  }
  if (action.type === ADD_MVS) {
    draft.mvs = action.data
  }
}, defaultState)

export default discoverReducer
