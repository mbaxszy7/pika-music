/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-this-in-sfc */
import React, { useEffect } from "react"
import { useStore } from "react-redux"
import PropTypes from "prop-types"
import { isCSR, isDEV } from "./index"
import createAxiosInstance from "./axiosInstance"

const axiosInstance = createAxiosInstance({ isDEV, isSSR: !isCSR })

const InnerHostComp = ({
  dependencyFn,
  getInitialData,
  Comp,
  ...restProps
}) => {
  const store = useStore()
  useEffect(() => {
    const shouldNotLoaddata =
      typeof dependencyFn === "function" ? dependencyFn(store.getState()) : true
    if (isCSR && !shouldNotLoaddata) {
      getInitialData(store, axiosInstance).catch(err => {
        // eslint-disable-next-line no-console
        console.error(err)
      })
    }
  }, [])
  return <Comp {...restProps} />
}

InnerHostComp.propTypes = {
  dependencyFn: PropTypes.func,
  getInitialData: PropTypes.func.isRequired,
  Comp: PropTypes.elementType.isRequired,
}

InnerHostComp.defaultProps = {
  dependencyFn: Function.prototype,
}

class ConnectCompReducer {
  constructor(Component) {
    this.Component = Component
    this.isSSR = !isCSR
  }

  getInitialData = async () => {
    throw new Error("child must implememnt this method!")
  }

  initPageComp = dependencyFn => {
    const Comp = props => (
      <InnerHostComp
        dependencyFn={dependencyFn}
        getInitialData={this.getInitialData}
        Comp={this.Component}
        {...props}
      />
    )
    Comp.loadData = this.getInitialData
    return Comp
  }
}

export default ConnectCompReducer
