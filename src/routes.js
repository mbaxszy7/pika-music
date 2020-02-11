import {
  Discover,
  ArtistDetails,
  ArtistMediaDetails,
  AlbumDetails,
} from "./utils/lazyPage"
import Rooter from "./client/Header"
// import ArtistMediaDetails from "./client/pages/ArtistMediaDetails/ArtistMediaDetails"
import discoverPage from "./client/pages/Discover/connectDiscoverReducer"
import artistDetails from "./client/pages/ArtistDetails/connectArtistDetailsReducer"
import artistMediaDetails from "./client/pages/ArtistMediaDetails/connectArtistMediaDetailsReducer"
import albumDetails from "./client/pages/AlbumDetails/connectAlbumDetailsReducer"
import SearchMore from "./client/pages/SearchMore/SearchMore"
import PlayListDetails from "./client/pages/PlayListDetails/PlayListDetails"

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
      {
        path: "/album",
        exact: true,
        loadData: albumDetails.getInitialData,
        component: AlbumDetails,
      },
      {
        path: "/more",
        exact: true,
        component: SearchMore,
      },
      {
        path: "/playlist/:id",
        exact: true,
        component: PlayListDetails,
      },
    ],
  },
]

export default routes
