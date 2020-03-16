import ConnectCompReducer from "../../../utils/connectPageReducer"
import { awaitWrapper } from "../../../utils"

class ConnectMVPlayReducer extends ConnectCompReducer {
  requestMVDetails = async url => {
    const [, res] = await awaitWrapper(this.fetcher.get)(url)
    if (res) {
      return {
        ...res.data.data,
        desc: res.data.data.desc ?? "",
        cover: res.data.data.cover
          ? res.data.data.cover.replace(/https?/, "https")
          : "",
      }
    }
  }

  requestMVUrl = async url => {
    const [, res] = await awaitWrapper(this.fetcher.get)(url)
    if (res) {
      return res.data.data.url
        ? res.data.data.url.replace(/https?/, "https")
        : ""
    }
  }

  requestSameMVs = async url => {
    const [, res] = await awaitWrapper(this.fetcher.get)(url)
    if (res) {
      return res.data.mvs.map(mv => ({
        vtype: 0,
        imgUrl: mv.cover ? mv.cover.replace(/https?/, "https") : "",
        title: mv.name,
        id: mv.id,
        type: "bigMV",
      }))
    }
  }
}

export default new ConnectMVPlayReducer()
