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
import NotFound from "./shared/NotFound"

const routes = [
  {
    component: Root,
    routes: [
      {
        path: "/",
        exact: true,
        component: Discover,
      },
      {
        path: "/artist",
        exact: true,
        component: ArtistDetails,
      },
      {
        path: "/artist/media",
        exact: true,
        component: ArtistMediaDetails,
      },
      {
        path: "/album",
        exact: true,
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
