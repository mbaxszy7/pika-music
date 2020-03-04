import React from "react"
import { createGlobalStyle, ThemeProvider } from "styled-components"

const AppBgTheme = createGlobalStyle`
  * {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    -ms-box-sizing: border-box;
    box-sizing: border-box;
  }
  a {
    text-decoration: none;
  }
 #root {
   max-height: 100vh;
   height:100vh;
   overflow-y:scroll;
   padding-bottom: 63px;
   background-color: #212121;
 }
`
export const theme = {
  // 主背景
  mg: "#212121",
  fg: "rgb(245,245,245)",
  dg: "grey",
  secondary: "rgb(254, 221, 39)",
}

// eslint-disable-next-line react/prop-types
const AppTheme = ({ children }) => {
  return (
    <>
      <AppBgTheme />
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </>
  )
}

export default AppTheme
