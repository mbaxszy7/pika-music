import loadable from "@loadable/component"
import { Home, Details, Header } from "./utils/lazyPage"

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
