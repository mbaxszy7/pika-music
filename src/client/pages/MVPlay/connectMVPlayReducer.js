import ConnectCompReducer from "../../../utils/connectPageReducer"
import { awaitWrapper } from "../../../utils"

class ConnectMVPlayReducer extends ConnectCompReducer {
  requestMVDetails = async url => {
    const [, res] = await awaitWrapper(this.fetcher.get)(url)
    if (res) {
      return res.data.data
    }
  }

  requestMVUrl = async url => {
    const [, res] = await awaitWrapper(this.fetcher.get)(url)
    if (res) {
      return res.data.data.url
    }
  }
}

export default new ConnectMVPlayReducer()
