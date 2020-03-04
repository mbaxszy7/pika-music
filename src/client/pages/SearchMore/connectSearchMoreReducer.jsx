import ConnectCompReducer from "../../../utils/connectPageReducer"
import { SEARCH_RESULT_SELECTOR } from "../Discover/connectDiscoverReducer"

const getData = {
  song: data => {
    const artistNames = data.artists.length
      ? [...data.artists].reverse().reduce((ac, a) => `${a.name} ${ac}`, "")
      : ""
    return {
      type: "song",
      noImg: true,
      noIndex: true,
      title: `${data.name}`,
      artistId: data.artists[0]?.id,
      albumId: data.album.id,
      artistName: artistNames,
      albumName: data.album.name,
      desc: `${artistNames} · ${data.album.name}`,
      id: data.id,
    }
  },
  mv: data => {
    return {
      ...SEARCH_RESULT_SELECTOR.mv.selector(data),
      type: "mv",
    }
  },
  playlist: data => {
    return {
      ...SEARCH_RESULT_SELECTOR.playlist.selector(data),
      type: "playlist",
    }
  },
  album: data => {
    return {
      ...SEARCH_RESULT_SELECTOR.album.selector(data),
      type: "album",
    }
  },
  artist: data => {
    return {
      ...SEARCH_RESULT_SELECTOR.artist.selector(data),
      type: "artist",
    }
  },
}

class ConnectSearchMoreDetails extends ConnectCompReducer {
  requestSearch = async (url, type, offset) => {
    const res = await this.fetcher.get(url)
    const dataList = res?.data?.result[`${type}s`]

    if (dataList) {
      const index = dataList.length + offset * dataList.length
      const count = res?.data?.result[`${type}Count`]
      let isMore = index < count
      if (offset === 0) {
        if (index < count) {
          isMore = true
        }
      }
      return [
        [...dataList]
          .reverse()
          .map(data => ({
            // eslint-disable-next-line no-plusplus
            ...getData[type](data),
          }))
          .reverse(),
        isMore,
        count,
      ]
    }
    return [null]
  }

  getInitialData = async () => {}
}

export default new ConnectSearchMoreDetails()
