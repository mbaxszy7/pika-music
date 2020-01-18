import produce from "immer"
import { ADD_BANNER_LIST } from "./constants"

const defaultState = {}

const discoverReducer = produce((draft, action) => {
  if (action.type === ADD_BANNER_LIST) {
    // eslint-disable-next-line no-param-reassign
    draft.bannerList = action.data
  }
}, defaultState)

export default discoverReducer
