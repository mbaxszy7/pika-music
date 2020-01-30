import produce from "immer"
import { ADD_ARTIST_DESC, ADD_ARTIST_AVATAR } from "./constants"

const defaultState = {}

const artistDetailsReducer = produce((draft, action) => {
  if (action.type === ADD_ARTIST_DESC) {
    // eslint-disable-next-line no-param-reassign
    draft.desc = action.data
  }
  if (action.type === ADD_ARTIST_AVATAR) {
    // eslint-disable-next-line no-param-reassign
    draft.avatar = action.data
  }
}, defaultState)

export default artistDetailsReducer
