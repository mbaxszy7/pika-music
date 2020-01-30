import ConnectCompReducer from "../../../utils/connectPageReducer"
import { awaitWrapper } from "../../../utils"
import { ADD_ARTIST_DESC, ADD_ARTIST_AVATAR } from "./constants"

class ConnectArtistDetailsReducer extends ConnectCompReducer {
  requestArtistDesc = url => {
    return this.fetcher.get(url).then(res => res.data.briefDesc)
  }

  requestArtistInfo = (url, id) => {
    return this.fetcher
      .get(url)
      .then(res => res.data.result)
      .then(data => data.artists?.filter(ar => ar.id == id)[0])
  }

  getInitialData = async (store, ctx) => {
    const { id, name } = ctx.query
    const [error, result] = await awaitWrapper(descUrl =>
      Promise.all([this.requestArtistDesc(descUrl)]),
    )(`/api/artist/desc?id=${id}`)
    if (error) {
      //  handle error in server setInitialDataToStore
      return Promise.reject(error)
    }
    store.dispatch({
      type: ADD_ARTIST_DESC,
      data: result[0],
    })
  }
}

export default new ConnectArtistDetailsReducer()
