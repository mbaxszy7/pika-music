import {
  Discover,
  ArtistDetails,
  ArtistMediaDetails,
  AlbumDetails,
} from "./utils/lazyPage"
import PlayBar from "./client/pages/PlayBar/PlayBar"
// import ArtistMediaDetails from "./client/pages/ArtistMediaDetails/ArtistMediaDetails"
import discoverPage from "./client/pages/Discover/connectDiscoverReducer"
import artistDetails from "./client/pages/ArtistDetails/connectArtistDetailsReducer"
import artistMediaDetails from "./client/pages/ArtistMediaDetails/connectArtistMediaDetailsReducer"
import albumDetails from "./client/pages/AlbumDetails/connectAlbumDetailsReducer"
import SearchMore from "./client/pages/SearchMore/SearchMore"
import PlayListDetails from "./client/pages/PlayListDetails/PlayListDetails"
import DiscoverMore from "./client/pages/DiscoverMore/DiscoverMore"
import MVPlay from "./client/pages/MVPlay/MVPlay"
import NotFound from "./shared/NotFound"

const routes = [
  {
    component: PlayBar,
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
      {
        path: "/discover_more/:type",
        exact: true,
        component: DiscoverMore,
      },
      {
        path: "/mv/:id",
        exact: true,
        component: MVPlay,
      },
      {
        component: NotFound,
      },
    ],
  },
]

export default routes
