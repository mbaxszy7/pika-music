/* eslint-disable react/prop-types */
import React, {
  memo,
  useMemo,
  Suspense,
  useState,
  useEffect,
  useCallback,
} from "react"
import { getFID } from "web-vitals"
import { useSelector } from "react-redux"
import { renderRoutes } from "react-router-config"

const Root = React.lazy(() =>
  import(/* webpackChunkName: 'root',  webpackPreload:true  */ "./Root"),
)
const ProxyPlayBar = memo(props => {
  const [isShowRoot, setShowRoot] = useState()
  const device = useSelector(state => state.config)
  const showPlayBar = useCallback(() => {
    if (!isShowRoot) setShowRoot(true)
  }, [isShowRoot])
  useEffect(() => {
    if (device?.ua?.broswer?.name === "Chrome")
      getFID(() => {
        showPlayBar()
      })
    else {
      window.onload = () => {
        showPlayBar()
      }
    }
  }, [device, showPlayBar])
  const routesRender = useMemo(() => renderRoutes(props.route.routes), [
    props.route.routes,
  ])

  return (
    <>
      {isShowRoot && (
        <Suspense fallback={null}>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <Root {...props} />
        </Suspense>
      )}

      {routesRender}
    </>
  )
})

export default ProxyPlayBar
