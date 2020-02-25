import ConnectCompReducer from "../../../utils/connectPageReducer"
import { awaitWrapper } from "../../../utils"
import {
  SET_SHOW_PLAY_BAR,
  SET_IMMEDIATELY_PLAY,
  SET_NEXT_PLAY,
  PLAY_NEXT,
  REMOVE_CURRENT,
  PLAY_PRE,
} from "./constants"

class ConnectPlayBarReducer extends ConnectCompReducer {
  requestSongDetails = async url => {
    const [error, res] = await awaitWrapper(this.fetcher)(url)
    if (res) {
      return res.data.songs
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
}

export default new ConnectPlayBarReducer()
