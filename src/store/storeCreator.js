import { createStore, applyMiddleware, combineReducers } from "redux"
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly"
import thunk from "redux-thunk"
import homeReducer from "../client/pages/Home/reducer"
import discoverReducer from "../client/pages/Discover/reducer"
import artistDetailsReducer from "../client/pages/ArtistDetails/reducer"
import { isCSR } from "../utils"

const rootReducer = {
  artistDetails: artistDetailsReducer,
  discover: discoverReducer,
  home: homeReducer,
  config: () => ({
    isSSR: !isCSR,
  }),
}

const getReduxStore = defaultState => {
  const store = createStore(
    combineReducers({ ...rootReducer }),
    defaultState || {},
    composeWithDevTools(applyMiddleware(thunk)),
  )
  return store
}

export default getReduxStore
