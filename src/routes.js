import { Details, Home } from "./utils/lazyPage"
import Header from "./client/Header"
import WithFetchHomeData from "./client/Home/fetchHomeData"

const routes = [
  {
    component: Header,
    routes: [
      {
        path: "/",
        exact: true,
        loadData: new WithFetchHomeData().getInitialData,
        component: Home,
      },
      {
        path: "/home",
        loadData: new WithFetchHomeData().getInitialData,
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
