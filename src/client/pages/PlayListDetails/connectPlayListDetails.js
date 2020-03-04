import ConnectCompReducer from "../../../utils/connectPageReducer"
import { SET_PLAY_LIST_DETAILS } from "./constants"

class ConnectPlayListReducer extends ConnectCompReducer {
  getInitialData = async () => {}

  setPlaylistDetails = data => ({
    type: SET_PLAY_LIST_DETAILS,
    data,
  })

  requestPlaylistDetails = async url => {
    const res = await this.fetcher.get(url)
    const { playlist } = res.data
    const {
      coverImgUrl,
      tags,
      subscribedCount,
      playCount,
      name,
      description,
      trackIds,
    } = playlist
    return {
      coverImgUrl,
      tags,
      subscribedCount,
      playCount,
      name,
      description: description ?? "",
      trackIds: trackIds.map(track => track.id),
    }
  }

  requestSongs = async url => {
    const res = await this.fetcher.get(url)
    const { songs } = res.data
    return songs.map(song => {
      const names = song.ar.length
        ? [...song.ar].reverse().reduce((ac, a) => `${a.name} ${ac}`, "")
        : ""
      return {
        imgUrl: song.al.picUrl,
        title: `${song.name}`,
        desc: names,
        artistId: song.ar[0].id,
        albumId: song.al.id,
        artistName: names,
        albumName: song.al.name,
        type: "song",
        id: song.id,
      }
    })
  }
}

export default new ConnectPlayListReducer()
