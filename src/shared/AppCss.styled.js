import reset from "styled-reset"
import { createGlobalStyle } from "styled-components"

const AppCss = createGlobalStyle`
  ${reset}
  /* other styles */
  .no_scroll {
    height: 100%;
    overflow: hidden;
 
    z-index: 1;
    -webkit-touch-callout: none; 
    -webkit-user-select: none; 
    -webkit-overflow-scrolling: auto;
  }
`

export default AppCss
