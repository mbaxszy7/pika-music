import React from "react"
import { renderRoutes } from "react-router-config"

const Header = ({ route }) => {
  return (
    <>
      <div>this is header</div>
      {renderRoutes(route.routes)}
    </>
  )
}

export default Header
