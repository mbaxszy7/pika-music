import { Discover, ArtistDetails, ArtistMediaDetails } from "./utils/lazyPage"
import Rooter from "./client/Header"
// import ArtistMediaDetails from "./client/pages/ArtistMediaDetails/ArtistMediaDetails"
import discoverPage from "./client/pages/Discover/connectDiscoverReducer"
import artistDetails from "./client/pages/ArtistDetails/connectArtistDetailsReducer"
import artistMediaDetails from "./client/pages/ArtistMediaDetails/connectArtistMediaDetailsReducer"

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
      {
        path: "/artist",
        exact: true,
        loadData: artistDetails.getInitialData,
        component: ArtistDetails,
      },
      {
        path: "/artist/media",
        exact: true,
        loadData: artistMediaDetails.getInitialData,
        component: ArtistMediaDetails,
      },
    ],
  },
]

export default routes
