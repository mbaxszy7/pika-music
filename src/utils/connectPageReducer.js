/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-this-in-sfc */
import React from "react"
import { isCSR, isDEV } from "./index"
import createAxiosInstance from "./axiosInstance"

const axiosInstance = createAxiosInstance({ isDEV, isSSR: !isCSR })

class ConnectCompReducer {
  getInitialData = async () => {
    throw new Error("child must implememnt this method!")
  }

  initPageComp = Component => {
    const Comp = props => <Component {...props} axiosInstance={axiosInstance} />
    Comp.loadData = this.getInitialData
    return Comp
  }
}

export default ConnectCompReducer
