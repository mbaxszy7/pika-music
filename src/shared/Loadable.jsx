/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
/* eslint-disable react/require-default-props */
/* eslint-disable react/jsx-props-no-spreading */
import React from "react"
import PropTypes from "prop-types"
import { matchRoutes } from "react-router-config"
import { match } from "path-to-regexp"

class Loadable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      Comp: null,
      error: null,
      isTimeout: false,
    }
  }

  // eslint-disable-next-line react/sort-comp
  raceLoading = () => {
    const { pastDelay } = this.props
    return new Promise((_, reject) => {
      setTimeout(() => reject(new Error("timeout")), pastDelay || 200)
    })
  }

  load = async () => {
    const { loader } = this.props
    try {
      this.setState({
        error: null,
      })
      const loadedComp = await Promise.race([this.raceLoading(), loader()])
      this.setState({
        isTimeout: false,
        Comp:
          loadedComp && loadedComp.__esModule ? loadedComp.default : loadedComp,
      })
    } catch (e) {
      if (e.message === "timeout") {
        this.setState({
          isTimeout: true,
        })
        this.load()
      } else {
        this.setState({
          error: e,
        })
      }
    }
  }

  componentDidMount() {
    this.load()
  }

  render() {
    const { error, isTimeout, Comp } = this.state
    const { loading } = this.props
    if (error) return loading({ error, retry: this.load })
    if (isTimeout) return loading({ pastDelay: true })

    if (Comp) return <Comp {...this.props} />
    return null
  }
}

Loadable.propTypes = {
  loading: PropTypes.func,
  loader: PropTypes.func,
  pastDelay: PropTypes.number,
  children: PropTypes.func,
}

export const asyncLoader = ({ loader, loading, pastDelay }) => {
  const importable = props => (
    <Loadable
      loader={loader}
      loading={loading}
      pastDelay={pastDelay}
      {...props}
    />
  )
  importable.isAsyncComp = true

  return importable
}

// ssr的时候没必要使用动态路由，不然server端不会渲染组件本身的内容
// 所以需要主动去执行动态路由的组件
export const ssrRoutesCapture = async (routes, requestPath) => {
  const ssrRoutes = await Promise.allSettled(
    [...routes].map(async route => {
      if (route.routes) {
        return {
          ...route,
          routes: await Promise.allSettled(
            [...route.routes].map(async compRoute => {
              const { component } = compRoute

              if (component.isAsyncComp) {
                try {
                  const RealComp = await component().props.loader()

                  const ReactComp =
                    RealComp && RealComp.__esModule
                      ? RealComp.default
                      : RealComp

                  return {
                    ...compRoute,
                    component: ReactComp,
                  }
                } catch (e) {
                  console.error(e)
                }
              }
              return compRoute
            }),
          ).then(res => res.map(r => r.value)),
        }
      }
      return {
        ...route,
      }
    }),
  ).then(res => res.map(r => r.value))

  return ssrRoutes
}

// 在client端不先主动去加载匹配的动态路由的话，
// server端已经渲染好的页面，client端还是会去动态加载js script，
// 导致还是会显示一下loading状态，这个状态是没必要的
// 所以，要先加载好动态路由组件，再去渲染页面

// 指定为csr的页面除外
export const clientPreloadReady = async routes => {
  try {
    const matchedRoutes = matchRoutes(routes, window.location.pathname)
    // console.warn(route.route.component())
    if (matchedRoutes && matchedRoutes.length) {
      await Promise.allSettled(
        matchedRoutes.map(async route => {
          if (
            route?.route?.component?.isAsyncComp &&
            !route?.route?.component.csr
          ) {
            try {
              await route.route.component().props.loader()
            } catch (e) {
              await Promise.reject(e)
            }
          }
        }),
      )
    }
  } catch (e) {
    console.error(e)
  }
}
