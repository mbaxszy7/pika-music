import React, { useEffect, useMemo } from "react"
import lozad from "lozad"
import { renderRoutes } from "react-router-config"

// eslint-disable-next-line react/prop-types
const Rooter = ({ route }) => {
  // eslint-disable-next-line react/prop-types
  return <>{renderRoutes(route.routes)}</>
}

export default Rooter
