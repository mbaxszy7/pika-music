import ConnectCompReducer from "../../../utils/connectPageReducer"
import { lazyMoment } from "../../../utils"
import connectArtistDetailsReducer from "../ArtistDetails/connectArtistDetailsReducer"

class ConnectArtistMediaDetails extends ConnectCompReducer {
  requestBigAlbums = url => {
    return connectArtistDetailsReducer.requestArtistAlbums(url)
  }

  requestBigMVs = async url => {
    const [res, { default: moment }] = await Promise.all([
      this.fetcher.get(url),
      lazyMoment(),
    ])

    return [
      res.data.mvs.map(mv => ({
        imgUrl: mv.imgurl,
        title: mv.name,
        id: mv.id,
        duration: mv.duration
          ? moment(new Date(mv.duration), "HH:mm").format("HH:mm")
          : "",
        type: "biggerMV",
      })),
      res.data.hasMore,
    ]
  }

  requestSongs = url => {
    return connectArtistDetailsReducer.requestArtistSongs(url)
  }

  getInitialData = async () => {}
}

export default new ConnectArtistMediaDetails()
