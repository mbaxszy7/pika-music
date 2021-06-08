/* eslint-disable react/prop-types */
import React, { memo, useState, useMemo, Suspense, useEffect } from "react"
import { getFID } from "web-vitals"
import { renderRoutes } from "react-router-config"

const Root = React.lazy(() =>
  import(/* webpackChunkName: 'root',  webpackPreload:true  */ "./Root"),
)
const ProxyPlayBar = memo(props => {
  const [isShowRoot, setShowRoot] = useState()
  useEffect(() => {
    getFID(() => {
      setShowRoot(true)
    })
  }, [])
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
