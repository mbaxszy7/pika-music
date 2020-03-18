import moment from "moment"
import { isDEV } from "./index"
import createAxiosInstance from "./axiosInstance"

export const axiosInstance = createAxiosInstance({ isDEV })
class ConnectCompReducer {
  constructor() {
    this.fetcher = axiosInstance
    this.moment = moment
  }

  getInitialData = async () => {
    throw new Error("child must implememnt this method!")
  }
}

export default ConnectCompReducer
