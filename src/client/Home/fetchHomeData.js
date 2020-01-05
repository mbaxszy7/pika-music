/* eslint-disable consistent-return */
/* eslint-disable class-methods-use-this */
import ConnectCompReducer from "../../utils/connectPageReducer"
import { awaitWrapper } from "../../utils"

class ConnectHomeReducer extends ConnectCompReducer {
  requestSongs = axiosInstance => {
    return axiosInstance.get("api/search", {
      params: {
        keywords: "大海",
      },
    })
  }

  getInitialData = async (store, axiosInstance) => {
    const [error, res] = await awaitWrapper(this.requestSongs)(axiosInstance)

    if (error) {
      //  handle error in server setInitialDataToStore
      return Promise.reject(error)
    }
    store.dispatch({
      type: "ADD_SONGS",
      data: res.data.result.songs.slice(0, 10).map(song => song.name),
    })
  }
}

export default ConnectHomeReducer
