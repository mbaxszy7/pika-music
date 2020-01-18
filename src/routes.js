import { Discover } from "./utils/lazyPage"
import Rooter from "./client/Header"
import discoverPage from "./client/pages/Discover/connectDiscoverReducer"

const routes = [
  {
    component: Rooter,
    routes: [
      {
        path: "/",
        exact: true,
        loadData: discoverPage.getInitialData,
        component: Discover,
      },
    ],
  },
]

export default routes
