import ConnectCompReducer from "../../../utils/connectPageReducer"
import { awaitWrapper, lazyMoment } from "../../../utils"
import { ADD_ALBUM_DETAILS } from "./constants"

class ConnectAlbumDetailsReducer extends ConnectCompReducer {
  requestAlbumDetails = async url => {
    const { default: moment } = await lazyMoment()
    return this.fetcher
      .get(url)
      .then(res => res.data)
      .then(data => {
        const { album, songs } = data
        const { artist, description, alias, info } = album
        return {
          picUrl: album.picUrl,
          publishTime: moment(new Date(album.publishTime), "YYYY-MM-DD").format(
            "YYYY-MM-DD",
          ),
          name: `${album.name}${alias[0] ? `(${alias[0]})` : ""}`,
          artist: {
            avatar: album.artist.picUrl,
            name: `${artist.name}${
              artist.alias[0] ? `(${artist.alias[0]})` : ""
            }`,
          },
          shareCount: info.shareCount,
          likedCount: info.likedCount,
          desc: description,
          songs: songs.map(song => ({
            title: song.name,
            id: song.id,
            desc: artist.name,
            artistName: artist.name,
            albumName: song.al.name,
            albumId: song.al.id,
            artistId: song.ar[0].id,
            type: "song",
            noImg: true,
          })),
        }
      })
  }

  getInitialData = async (store, ctx) => {
    const { id } = ctx.query
    const [error, result] = await awaitWrapper(this.requestAlbumDetails)(
      `/api/album?id=${id}`,
    )

    if (error) {
      //  handle error in server setInitialDataToStore
      return Promise.reject(error)
    }
    store.dispatch({
      type: ADD_ALBUM_DETAILS,
      data: result,
    })
  }
}

export default new ConnectAlbumDetailsReducer()
