import ConnectCompReducer from "../../../utils/connectPageReducer"
import { awaitWrapper, lazyMoment } from "../../../utils"
import {
  ADD_ARTIST_DESC,
  ADD_ARTIST_SONGS,
  ADD_ARTIST_ALBUMS,
  ADD_ARTIST_MVS,
} from "./constants"

class ConnectArtistDetailsReducer extends ConnectCompReducer {
  requestArtistDesc = url => {
    return this.fetcher.get(url).then(res => res.data.briefDesc ?? "")
  }

  requestArtistInfo = (url, id) => {
    return this.fetcher
      .get(url)
      .then(res => res.data.result)
      .then(data => data.artists?.filter(ar => ar.id == id)[0])
  }

  requestArtistSongs = async url => {
    const res = await this.fetcher.get(url)
    return [
      [
        res.data.hotSongs.map(song => ({
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
          id: song.id,
        })),
        res.data.artist,
      ],
      false,
    ]
  }

  requestArtistAlbums = async url => {
    const [res, { default: moment }] = await Promise.all([
      this.fetcher.get(url),
      lazyMoment(),
    ])

    return [
      res.data.hotAlbums.map(album => {
        return {
          imgUrl: album.picUrl,
          title: album.name,
          publishTime: album.publishTime
            ? moment(new Date(album.publishTime), "YYYY-MM-DD").format(
                "YYYY-MM-DD",
              )
            : null,
          type: "bigAlbum",
          albumId: album.id,
        }
      }),
      res.data.more,
    ]
  }

  requestArtistMVs = async url => {
    const res = await this.fetcher.get(url)
    return [
      res.data.mvs.map(mv => ({
        imgUrl: mv.imgurl,
        title: mv.name,
        id: mv.id,
        type: "bigMV",
      })),
      res.data.hasMore,
    ]
  }

  getInitialData = async (store, ctx) => {
    const { id } = ctx.query
    const [
      error,
      result,
    ] = await awaitWrapper((descUrl, songsUrl, albumsUrl, mvsUrl) =>
      Promise.all([
        this.requestArtistDesc(descUrl),
        this.requestArtistSongs(songsUrl),
        this.requestArtistAlbums(albumsUrl),
        this.requestArtistMVs(mvsUrl),
      ]),
    )(
      `/api/artist/desc?id=${id}`,
      `/api/artists?id=${id}`,
      `/api/artist/album?id=${id}&offset=0&limit=4`,
      `/api/artist/mv?id=${id}&offset=0&limit=4`,
    )
    if (error) {
      //  handle error in server setInitialDataToStore
      return Promise.reject(error)
    }
    store.dispatch(this.setDesc(result[0]))
    store.dispatch(this.setSONGS(result[1][0]))
    store.dispatch(this.setAlbums(result[2][0]))
    store.dispatch(this.setMVS(result[3][0]))
  }

  setDesc = data => {
    return {
      type: ADD_ARTIST_DESC,
      data,
    }
  }

  setSONGS = data => {
    return {
      type: ADD_ARTIST_SONGS,
      data,
    }
  }

  setMVS = data => {
    return {
      type: ADD_ARTIST_MVS,
      data,
    }
  }

  setAlbums = data => {
    return {
      type: ADD_ARTIST_ALBUMS,
      data,
    }
  }
}

export default new ConnectArtistDetailsReducer()
