import React from "react"
import { renderRoutes } from "react-router-config"

const Rooter = ({ route }) => {
  return <>{renderRoutes(route.routes)}</>
}

export default Rooter
