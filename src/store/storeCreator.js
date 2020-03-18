import { createStore, applyMiddleware, combineReducers } from "redux"
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly"
import thunk from "redux-thunk"
import homeReducer from "../client/pages/Home/reducer"
import discoverReducer from "../client/pages/Discover/reducer"
import artistDetailsReducer from "../client/pages/ArtistDetails/reducer"
import albumDetailsReducer from "../client/pages/AlbumDetails/reducer"
import playlistReducer from "../client/pages/PlayListDetails/reducer"
import playBarReducer from "../client/pages/PlayBar/reducer"

const rootReducer = {
  albumDetails: albumDetailsReducer,
  artistDetails: artistDetailsReducer,
  discover: discoverReducer,
  home: homeReducer,
  playBar: playBarReducer,
  playlistDetails: playlistReducer,
}

const getReduxStore = defaultState => {
  const store = createStore(
    combineReducers({
      ...rootReducer,
      config: () => ({ ua: defaultState?.ua }),
    }),
    composeWithDevTools(applyMiddleware(thunk)),
  )
  return store
}

export default getReduxStore
