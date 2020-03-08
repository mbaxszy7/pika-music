import { css } from "styled-components"

const sizes = {
  desktop: 992,
  tablet: 768,
  phone: 414,
  miniPhone: 320,
  aboveTablet: 500,
}

// Iterate through the sizes and create a media template
const media = Object.keys(sizes).reduce((acc, label) => {
  if (label === "aboveTablet") {
    acc[label] = (...args) => css`
      @media (min-width: ${sizes[label] / 16}em) {
        ${css(...args)}
      }
    `
  } else {
    acc[label] = (...args) => css`
      @media (max-width: ${sizes[label] / 16}em) {
        ${css(...args)}
      }
    `
  }

  return acc
}, {})

export default media
