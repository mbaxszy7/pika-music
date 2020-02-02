import produce from "immer"
import { ADD_ARTIST_DESC, ADD_ARTIST_SONGS } from "./constants"

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
}, defaultState)

export default artistDetailsReducer
