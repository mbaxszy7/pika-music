import { createStore, applyMiddleware, combineReducers } from "redux"
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly"
import thunk from "redux-thunk"
import homeReducer from "../client/Home/reducer"
import { isCSR, isDEV } from "../utils"
import createAxiosInstance from "../utils/axiosInstance"

const rootReducer = {
  home: homeReducer,
  config: () => ({
    isSSR: !isCSR,
  }),
}

export const getServerStore = axiosInstance => {
  // 在thunk中间件中传入serverAxios实例 在action creator中保证服务端通过特定URL（http://....）访问数据
  const store = createStore(
    combineReducers({ ...rootReducer }),
    composeWithDevTools(
      applyMiddleware(thunk.withExtraArgument(axiosInstance)),
    ),
  )
  return store
}

export const getClientStore = defaultState => {
  const store = createStore(
    combineReducers({ ...rootReducer }),
    defaultState || {},
    composeWithDevTools(
      applyMiddleware(
        thunk.withExtraArgument(createAxiosInstance({ isSSR: !isCSR, isDEV })),
      ),
    ),
  )
  return store
}
