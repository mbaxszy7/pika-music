/* eslint-disable consistent-return */
/* eslint-disable class-methods-use-this */
import ConnectCompReducer from "../../utils/connectPageReducer"

import { awaitWrapper } from "../../utils"

class ConnectHomeReducer extends ConnectCompReducer {
  requestPlayLists = url => {
    return this.fetcher.get(url).then(res => res.data.playlists)
  }

  getInitialData = async store => {
    const [error, playlists] = await awaitWrapper(this.requestPlayLists)(
      "/api/top/playlist?limit=5&order=new",
    )

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
