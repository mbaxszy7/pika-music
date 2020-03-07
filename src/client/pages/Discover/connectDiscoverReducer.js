/* eslint-disable consistent-return */
/* eslint-disable class-methods-use-this */
import ConnectCompReducer from "../../../utils/connectPageReducer"
import { awaitWrapper, lazyMoment } from "../../../utils"
import {
  ADD_BANNER_LIST,
  SET_LAST_SEARCH_WORD,
  ADD_PERSONALIZED_SONGS,
  ADD_PLAY_LIST,
  ADD_NEW_SONGS,
  ADD_ALBUMS,
  ADD_MVS,
} from "./constants"

const BEST_SEARCH_SELECTOR = {
  artist: {
    selector: data => {
      return {
        type: "artist",
        id: data.id,
        artistName: data.name,
        imgUrl: data.img1v1Url || data.picUrl,
        title: `艺人：${data.name}`,
        desc: `歌曲：${data.musicSize} 专辑：${data.albumSize}`,
      }
    },
  },
  mv: {
    selector: data => {
      return {
        type: "video",
        id: data.vid,
        vtype: data.type,
        imgUrl: data.cover,
        title: `MV：${data.name}`,
        desc: `歌手：${data.artistName} 播放量：${data.playCount}`,
      }
    },
  },
  album: {
    selector: data => {
      return {
        type: "album",
        id: data.id,
        imgUrl: data.picUrl,
        title: `专辑：${data.name}`,
        desc: `歌手：${data.artist.name}`,
      }
    },
  },
}

export const SEARCH_RESULT_SELECTOR = {
  playlist: {
    desc: "歌单",
    selector: data => {
      return {
        id: data.id,
        imgUrl: data.coverImgUrl,
        title: `${data.name}`,
        desc: `${data.trackCount}首`,
      }
    },
  },
  song: {
    desc: "歌曲",
    selector: data => {
      const artistNames = data.ar.length
        ? [...data.ar].reverse().reduce((ac, a) => `${a.name} ${ac}`, "")
        : ""
      return {
        imgUrl: data.al.picUrl,
        title: `${data.name}`,
        desc: `${artistNames} · ${data.al.name}`,
        artistId: data.ar[0].id,
        albumId: data.al.id,
        artistName: artistNames,
        albumName: data.al.name,
        id: data.id,
      }
    },
  },
  artist: {
    desc: "艺人",
    selector: data => {
      return {
        id: data.id,
        artistName: data.name,
        imgUrl: data.img1v1Url || data.picUrl,
        title: `艺人：${data.name}`,
        desc: `mv:${data.mvSize}  专辑:${data.albumSize}`,
      }
    },
  },
  mv: {
    desc: "MV",
    selector: data => {
      return {
        id: data.id,
        imgUrl: data.cover,
        title: `${data.name}`,
        desc: `${data.artistName}`,
      }
    },
  },
  album: {
    desc: "专辑",
    selector: data => {
      return {
        id: data.id,
        imgUrl: data.picUrl,
        title: data.name,
        desc: data.artist.name,
      }
    },
  },
}

class ConnectDiscoverReducer extends ConnectCompReducer {
  setLastSearchKeyword = data => {
    return {
      type: SET_LAST_SEARCH_WORD,
      data,
    }
  }

  requestBannerList = url => {
    return this.fetcher
      .get(url)
      .then(res => res.data.banners)
      .then(banners =>
        banners.map(banner => ({
          pic: banner.pic,
          typeTitle: banner.typeTitle,
        })),
      )
  }

  requestSearchSuggest = url => {
    return this.fetcher.get(url).then(res => res.data.result)
  }

  requestSearchBestMatch = async url => {
    const result = await this.fetcher.get(url).then(res => res.data.result)
    if (result) {
      if (result.orders?.length) {
        const type = result.orders[0]
        return BEST_SEARCH_SELECTOR[type].selector(result[type][0])
      }
    }
  }

  requestSearch = async (url, keyword) => {
    const result = await Promise.allSettled([
      this.fetcher.get(url).then(res => res.data.result),
      this.fetcher
        .get(`/api/search?keywords=${keyword}&type=1004`)
        .then(res => res.data.result),
    ])
    const mainResult = result[0]
    const mvsResult = result[1]
    if (mainResult.status === "fulfilled") {
      mainResult.value.mv = mvsResult.value
      if (mainResult.value.order?.length) {
        return [...mainResult.value.order, "mv"]
          .map(type => {
            const lowerCaseType = type.toLowerCase()
            const typeData = SEARCH_RESULT_SELECTOR[lowerCaseType]
            let dataList = mainResult.value?.[type]?.[`${type}s`]
            if (lowerCaseType === "song") {
              dataList = dataList.slice(0, 5)
            }
            if (typeData && dataList) {
              return {
                type: lowerCaseType,
                title: typeData.desc,
                getDesc: typeData.selector,
                dataList,
              }
            }
            return null
          })
          .filter(r => !!r)
      }
    }
  }

  requestPersonalizedSongs = async url => {
    const [error, res] = await awaitWrapper(this.fetcher.get)(url)
    const { result } = res.data

    return result.map(item => ({
      picUrl: item.picUrl,
      id: item.song.id,
      name: item.song.name,
    }))
  }

  requestPlaylist = async url => {
    const [error, res] = await awaitWrapper(this.fetcher.get)(url)

    const { playlists } = res.data
    return playlists.map(list => ({
      id: list.id,
      description: list.description,
      imgUrl: list.coverImgUrl,
      title: `${list.name}`,
      tags: list.tags,
      tag: list.tags[0],
      type: "big_playlist",
    }))
  }

  requestNewSongs = async url => {
    const [error, res] = await awaitWrapper(this.fetcher.get)(url)
    const songs = res.data.data
    return songs.map(song => {
      const names = song.artists.length
        ? [...song.artists].reverse().reduce((ac, a) => `${a.name} ${ac}`, "")
        : ""

      return {
        imgUrl: song.album.picUrl,
        title: `${song.name}`,
        desc: names,
        artistId: song.artists[0].id,
        albumId: song.album.id,
        artistName: names,
        albumName: song.album.name,
        type: "song",
        id: song.id,
      }
    })
  }

  requestAlbums = async url => {
    const [res, { default: moment }] = await Promise.all([
      this.fetcher.get(url),
      lazyMoment(),
    ])
    const { albums } = res.data
    return albums.map(album => ({
      imgUrl: album.picUrl,
      title: album.name,
      publishTime: album.publishTime
        ? moment(new Date(album.publishTime), "YYYY-MM-DD").format("YYYY-MM-DD")
        : null,
      type: "bigAlbum",
      id: album.id,
      albumId: album.id,
    }))
  }

  requestPrivateMVs = async url => {
    const [error, res] = await awaitWrapper(this.fetcher.get)(url)
    const mvs = res.data.result
    return mvs.map(mv => ({
      imgUrl: mv.picUrl,
      title: mv.name,
      id: mv.id,
      type: "privateMV",
    }))
  }

  getInitialData = async store => {
    const [
      error,
      res,
    ] = await awaitWrapper(
      (
        bannerUrl,
        personalizedSongUrl,
        playlistUrl,
        newSongUrl,
        albumUrl,
        mvUrl,
      ) =>
        Promise.allSettled([
          this.requestBannerList(bannerUrl),
          this.requestPersonalizedSongs(personalizedSongUrl),
          this.requestPlaylist(playlistUrl),
          this.requestNewSongs(newSongUrl),
          this.requestAlbums(albumUrl),
          this.requestPrivateMVs(mvUrl),
        ]),
    )(
      "/api/banner?type=2",
      "/api/personalized/newsong",
      "/api/top/playlist?limit=8&order=hot",
      "/api/top/song?type=0",
      "/api/album/newest",
      "/api/personalized/privatecontent",
    )
    if (error) {
      //  handle error in server setInitialDataToStore
      return Promise.reject(error)
    }
    if (res[0].status === "fulfilled") {
      store.dispatch(this.setBannerList(res[0].value))
    }
    if (res[1].status === "fulfilled") {
      store.dispatch(this.setPersonalizedSongs(res[1].value))
    }
    if (res[2].status === "fulfilled") {
      store.dispatch(this.setPlayLists(res[2].value))
    }
    if (res[3].status === "fulfilled") {
      store.dispatch(this.setNewSongs(res[3].value))
    }
    if (res[4].status === "fulfilled") {
      store.dispatch(this.setAlbums(res[4].value))
    }
    if (res[5].status === "fulfilled") {
      store.dispatch(this.setMVs(res[5].value))
    }
  }

  setBannerList = data => ({
    type: ADD_BANNER_LIST,
    data,
  })

  setPersonalizedSongs = data => ({
    type: ADD_PERSONALIZED_SONGS,
    data,
  })

  setPlayLists = data => ({
    type: ADD_PLAY_LIST,
    data,
  })

  setNewSongs = data => ({
    type: ADD_NEW_SONGS,
    data,
  })

  setAlbums = data => ({
    type: ADD_ALBUMS,
    data,
  })

  setMVs = data => ({
    type: ADD_MVS,
    data,
  })
}

export default new ConnectDiscoverReducer()
