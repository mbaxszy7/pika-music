import produce from "immer"
import { SET_PLAY_LIST_DETAILS } from "./constants"

const defaultState = {}

const playListDetailsReducer = produce((draft, action) => {
  if (action.type === SET_PLAY_LIST_DETAILS) {
    // eslint-disable-next-line no-param-reassign
    draft.details = action.data
  }
}, defaultState)

export default playListDetailsReducer
