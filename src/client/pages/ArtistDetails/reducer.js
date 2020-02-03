import produce from "immer"
import {
  ADD_ARTIST_DESC,
  ADD_ARTIST_SONGS,
  ADD_ARTIST_ALBUMS,
  ADD_ARTIST_MVS,
} from "./constants"

const defaultState = {}

const artistDetailsReducer = produce((draft, action) => {
  if (action.type === ADD_ARTIST_DESC) {
    // eslint-disable-next-line no-param-reassign
    draft.desc = action.data
  }
  if (action.type === ADD_ARTIST_SONGS) {
    // eslint-disable-next-line no-param-reassign
    draft.songs = action.data
  }
  if (action.type === ADD_ARTIST_ALBUMS) {
    // eslint-disable-next-line no-param-reassign
    draft.albums = action.data
  }
  if (action.type === ADD_ARTIST_MVS) {
    // eslint-disable-next-line no-param-reassign
    draft.mvs = action.data
  }
}, defaultState)

export default artistDetailsReducer
