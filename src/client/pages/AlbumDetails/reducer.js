/* eslint-disable no-param-reassign */
import produce from "immer"
import { ADD_ALBUM_DETAILS } from "./constants"

const defaultState = {}

const albumDetailsReducer = produce((draft, action) => {
  if (action.type === ADD_ALBUM_DETAILS) {
    draft.details = action.data
  }
}, defaultState)

export default albumDetailsReducer
