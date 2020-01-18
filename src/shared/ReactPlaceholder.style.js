import { createGlobalStyle } from "styled-components"

const ReactPlaceholderStyle = createGlobalStyle`
.show-loading-animation {
  &.rect-shape,
  &.round-shape,
  &.text-row,
  .rect-shape,
  .round-shape,
  .text-row {
    animation: react-placeholder-pulse 1.5s infinite;
  }
}


@keyframes react-placeholder-pulse {
  0% {
    opacity: .6;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: .6;
  }
}
`

{
  /* <ReactPlaceholder
type="text"
ready={!!playlists}
rows={6}
color="#E0E0E0"
showLoadingAnimation
>
{playlists
  ? playlists.map((song, index) => <li key={index}>{song.name}</li>)
  : ""}
</ReactPlaceholder> */
}

export default ReactPlaceholderStyle
