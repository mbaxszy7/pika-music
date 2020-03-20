import {
  Discover,
  ArtistDetails,
  ArtistMediaDetails,
  AlbumDetails,
  PlayListDetails,
  MVPlay,
  DiscoverMore,
  SearchMore,
} from "./utils/lazyPage"
import Root from "./client/pages/Root/Root"
// import ArtistMediaDetails from "./client/pages/ArtistMediaDetails/ArtistMediaDetails"
import discoverPage from "./client/pages/Discover/connectDiscoverReducer"
import artistDetails from "./client/pages/ArtistDetails/connectArtistDetailsReducer"
import artistMediaDetails from "./client/pages/ArtistMediaDetails/connectArtistMediaDetailsReducer"
import albumDetails from "./client/pages/AlbumDetails/connectAlbumDetailsReducer"
import NotFound from "./shared/NotFound"

const routes = [
  {
    component: Root,
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
