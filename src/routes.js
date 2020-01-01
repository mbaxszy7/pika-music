import { Details, Home } from "./utils/lazyPage"
import Header from "./client/Header"

const routes = [
  {
    component: Header,
    routes: [
      {
        path: "/",
        exact: true,
        loadData: Home.loadData,
        component: Home,
      },
      {
        path: "/home",
        loadData: Home.loadData,
        component: Home,
      },
      {
        path: "/details",
        component: Details,
      },
    ],
  },
]

export default routes
