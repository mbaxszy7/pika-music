import React from "react"
import { renderRoutes } from "react-router-config"

const Header = ({ route, ...restProps }) => {
  return (
    <>
      <div>this is header</div>
      {renderRoutes(route.routes, { pageData: restProps.pageData })}
    </>
  )
}

export default Header
