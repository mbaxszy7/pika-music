import ConnectCompReducer from "../../../utils/connectPageReducer"
import { awaitWrapper } from "../../../utils"
import {
  SET_SHOW_PLAY_BAR,
  SET_IMMEDIATELY_PLAY,
  SET_NEXT_PLAY,
  PLAY_NEXT,
  REMOVE_CURRENT,
  PLAY_PRE,
  PLAY_LIST_SONG_PLAY,
  REMOVE_SONG,
  PLAY_MODE,
} from "./constants"

class ConnectPlayBarReducer extends ConnectCompReducer {
  requestSongDetails = async url => {
    const [, res] = await awaitWrapper(this.fetcher)(url)
    if (res) {
      return res.data.songs.map(data => {
        return {
          picUrl: data.al?.picUrl,
          type: "song",
          noImg: true,
          noIndex: true,
          title: data.name,
          artistId: data.ar[0]?.id,
          albumId: data.al.id,
          artistName: data.ar[0]?.name,
          albumName: data.al.name,
          desc: data.ar[0]?.name,
          id: data.id,
        }
      })
    }
  }

  getInitialData = async () => {}

  setShowPlayBar = data => ({
    type: SET_SHOW_PLAY_BAR,
    data,
  })

  setImmediatelyPlay = data => ({
    type: SET_IMMEDIATELY_PLAY,
    data,
  })

  setNextPlay = data => ({
    type: SET_NEXT_PLAY,
    data,
  })

  playNext = data => ({
    type: PLAY_NEXT,
    data,
  })

  playPre = data => ({
    type: PLAY_PRE,
    data,
  })

  removeCur = () => ({
    type: REMOVE_CURRENT,
  })

  setPlaylistSongPlay = index => ({
    type: PLAY_LIST_SONG_PLAY,
    data: index,
  })

  removeSong = index => ({
    type: REMOVE_SONG,
    data: index,
  })

  setPlayMode = mode => ({
    type: PLAY_MODE,
    data: mode,
  })
}

export default new ConnectPlayBarReducer()
