import ConnectCompReducer from "../../../utils/connectPageReducer"
import connectArtistDetailsReducer from "../ArtistDetails/connectArtistDetailsReducer"

class ConnectArtistMediaDetails extends ConnectCompReducer {
  requestBigAlbums = url => {
    return connectArtistDetailsReducer.requestArtistAlbums(url)
  }

  requestBigMVs = async url => {
    const res = await this.fetcher.get(url)

    return [
      res.data.mvs.map(mv => ({
        vtype: 0,
        imgUrl: mv.imgurl,
        title: mv.name,
        id: mv.id,
        duration: mv.duration
          ? this.moment(new Date(mv.duration), "HH:mm").format("HH:mm")
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
