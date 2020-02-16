import ConnectCompReducer from "../../../utils/connectPageReducer"
import { awaitWrapper } from "../../../utils"

class ConnectDiscoverMoreReducer extends ConnectCompReducer {
  requestPlaylistCat = async url => {
    const res = await this.fetcher.get(url)
    const cats = res.data.sub
    return cats.filter(cat => cat.hot).map(cat => cat.name)
  }

  requestPlaylist = async url => {
    const res = await this.fetcher.get(url)
    const { playlists, more } = res.data

    return {
      list: playlists.map(playlist => {
        return {
          imgUrl: playlist.coverImgUrl,
          title: playlist.name,
          desc: `${playlist.trackCount}首`,
          type: "playlist",
        }
      }),
      more,
    }
  }

  getInitialData = async () => {}
}

export default new ConnectDiscoverMoreReducer()
