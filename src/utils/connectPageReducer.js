import { isCSR, isDEV } from "./index"
import createAxiosInstance from "./axiosInstance"

const axiosInstance = createAxiosInstance({ isDEV, isSSR: !isCSR })
class ConnectCompReducer {
  constructor() {
    this.fetcher = axiosInstance
  }

  getInitialData = async () => {
    throw new Error("child must implememnt this method!")
  }
}

export default ConnectCompReducer
