import { css, keyframes } from "styled-components"

const PlaceHolderTextAnimation = css`
  &[data-loaded="false"] {
    background: ${props => props.theme.dg};
    @keyframes react-placeholder-pulse {
      0% {
        opacity: 0.6;
      }
      50% {
        opacity: 1;
      }
      100% {
        opacity: 0.6;
      }
    }
    animation: react-placeholder-pulse 1.5s infinite;
  }
`

export const PlaceHolderKeyframes = keyframes`
    0% {
      opacity: 0.6;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0.6;
    }
`

export default PlaceHolderTextAnimation
