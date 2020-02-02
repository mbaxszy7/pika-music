import ConnectCompReducer from "../../../utils/connectPageReducer"
import { awaitWrapper } from "../../../utils"
import { ADD_ARTIST_DESC, ADD_ARTIST_SONGS } from "./constants"

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

  requestArtistSongs = async url => {
    const res = await this.fetcher.get(url)
    return res.data.hotSongs.map(song => ({
      imgUrl: song.al.picUrl,
      title: `${song.name}`,
      desc: `${song.al.name}`,
      artistName: song.ar.length
        ? [...song.ar].reverse().reduce((ac, a) => `${a.name} ${ac}`, "")
        : "",
      albumName: song.al.name,
      artistId: song.ar[0].id,
      albumId: song.al.id,
      type: "song",
    }))
  }

  getInitialData = async (store, ctx) => {
    const { id } = ctx.query
    const [error, result] = await awaitWrapper((descUrl, songsUrl) =>
      Promise.all([
        this.requestArtistDesc(descUrl),
        this.requestArtistSongs(songsUrl),
      ]),
    )(`/api/artist/desc?id=${id}`, `/api/artists?id=${id}`)
    if (error) {
      //  handle error in server setInitialDataToStore
      return Promise.reject(error)
    }
    store.dispatch({
      type: ADD_ARTIST_DESC,
      data: result[0],
    })
    store.dispatch({
      type: ADD_ARTIST_SONGS,
      data: result[1],
    })
  }
}

export default new ConnectArtistDetailsReducer()
