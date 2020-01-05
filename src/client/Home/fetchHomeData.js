/* eslint-disable consistent-return */
/* eslint-disable class-methods-use-this */
import ConnectCompReducer from "../../utils/connectPageReducer"

import { awaitWrapper } from "../../utils"

class ConnectHomeReducer extends ConnectCompReducer {
  requestPlayLists = axiosInstance => {
    return url =>
      axiosInstance
        .get(url, {
          params: {
            limit: 10,
            order: "new",
          },
        })
        .then(res => res.data.playlists)
  }

  getInitialData = async (store, axiosInstance) => {
    const [error, playlists] = await awaitWrapper(
      this.requestPlayLists(axiosInstance).bind(null, "/api/top/playlist"),
    )()
    console.log("playlists", playlists)
    if (error) {
      //  handle error in server setInitialDataToStore
      return Promise.reject(error)
    }

    store.dispatch({
      type: "ADD_SONGS",
      data: playlists,
    })
  }
}

export default ConnectHomeReducer
