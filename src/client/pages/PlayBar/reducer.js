/* eslint-disable no-param-reassign */
import produce from "immer"
import {
  SET_SHOW_PLAY_BAR,
  SET_IMMEDIATELY_PLAY,
  SET_NEXT_PLAY,
  PLAY_NEXT,
  REMOVE_CURRENT,
  PLAY_PRE,
  PLAY_LIST_SONG_PLAY,
  REMOVE_SONG,
  PLAY_MODE,
  LIST_CYCLE,
} from "./constants"

const defaultState = {
  isShowPlayBar: true,
  currentPlayId: null,
  songIdList: [],
  currentPlayIndex: 0,
  playMode: LIST_CYCLE,
}

const discoverReducer = produce((draft, action) => {
  if (action.type === SET_SHOW_PLAY_BAR) {
    draft.isShowPlayBar = action.data
  }
  if (action.type === SET_IMMEDIATELY_PLAY) {
    if (Array.isArray(action.data)) {
      draft.songIdList = [...action.data, ...draft.songIdList]
      // eslint-disable-next-line prefer-destructuring
      draft.currentPlayId = action.data[0]
      draft.currentPlayIndex = 1
    } else if (action.data !== draft.currentPlayId) {
      const curPlayIndex = draft.currentPlayIndex
      draft.songIdList = [
        ...draft.songIdList.slice(0, curPlayIndex),
        action.data,
        ...draft.songIdList.slice(curPlayIndex),
      ]
      draft.currentPlayIndex = curPlayIndex + 1
      draft.currentPlayId = action.data
    }
  }
  if (action.type === SET_NEXT_PLAY) {
    if (!draft.songIdList.length) {
      draft.songIdList = [action.data]
      draft.currentPlayId = action.data
      draft.currentPlayIndex = 1
    } else {
      draft.songIdList = [
        ...draft.songIdList.slice(0, draft.currentPlayIndex),
        action.data,
        ...draft.songIdList.slice(draft.currentPlayIndex),
      ]
    }
  }
  if (action.type === PLAY_NEXT) {
    if (typeof action.data === "number") {
      const toPlayIndex = action.data
      draft.currentPlayIndex = toPlayIndex
      draft.currentPlayId = draft.songIdList[toPlayIndex - 1]
    } else if (draft.songIdList.length > draft.currentPlayIndex) {
      const toPlayIndex = draft.currentPlayIndex
      draft.currentPlayIndex = toPlayIndex + 1
      draft.currentPlayId = draft.songIdList[toPlayIndex]
    }
  }
  if (action.type === PLAY_PRE) {
    if (draft.currentPlayIndex > 1) {
      const toPlayIndex = draft.currentPlayIndex - 1
      draft.currentPlayIndex = toPlayIndex
      draft.currentPlayId = draft.songIdList[toPlayIndex - 1]
    }
  }
  if (action.type === REMOVE_CURRENT) {
    if (draft.currentPlayIndex > 0 && draft.songIdList.length > 0) {
      const list = [...draft.songIdList]
      const toIndex = draft.currentPlayIndex - 1
      list.splice(toIndex, 1)
      draft.songIdList = list

      draft.currentPlayIndex = toIndex
      draft.currentPlayId = list[toIndex - 1]
    }
  }

  if (action.type === REMOVE_SONG) {
    const toRemoveIndex = action.data
    if (toRemoveIndex + 1 <= draft.currentPlayIndex) {
      draft.currentPlayIndex -= 1
    }
    const list = [...draft.songIdList]
    list.splice(toRemoveIndex, 1)
    draft.songIdList = list
  }

  if (action.type === PLAY_LIST_SONG_PLAY) {
    if (action.data !== -1) {
      draft.currentPlayIndex = action.data + 1
      draft.currentPlayId = draft.songIdList[action.data]
    }
  }

  if (action.type === PLAY_MODE) {
    draft.playMode = action.data
  }
}, defaultState)

export default discoverReducer
