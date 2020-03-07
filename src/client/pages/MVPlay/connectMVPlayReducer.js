import ConnectCompReducer from "../../../utils/connectPageReducer"
import { awaitWrapper } from "../../../utils"

class ConnectMVPlayReducer extends ConnectCompReducer {
  requestMVDetails = async url => {
    const [, res] = await awaitWrapper(this.fetcher.get)(url)
    if (res) {
      return { ...res.data.data, desc: res.data.data.desc ?? "" }
    }
  }

  requestMVUrl = async url => {
    const [, res] = await awaitWrapper(this.fetcher.get)(url)
    if (res) {
      return res.data.data.url
    }
  }

  requestSameMVs = async url => {
    const [, res] = await awaitWrapper(this.fetcher.get)(url)
    if (res) {
      return res.data.mvs.map(mv => ({
        vtype: 0,
        imgUrl: mv.cover,
        title: mv.name,
        id: mv.id,
        type: "bigMV",
      }))
    }
  }
}

export default new ConnectMVPlayReducer()
