/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/require-default-props */
import React, { memo, useState, useEffect, useCallback } from "react"
import PropTypes from "prop-types"
import styled from "styled-components"
import ReactPlaceholder from "react-placeholder"

import UserAvatar from "../assets/user.png"

const ImageLoader = memo(
  ({
    url,
    children,
    showLoadingAnimation,
    placeHolderType,
    placeHolderStyle,
  }) => {
    const [isLoaded, setLoaded] = useState(false)

    useEffect(() => {
      const image = new Image()
      image.onload = () => {
        setLoaded(true)
      }

      image.onerror = () => {
        setLoaded(false)
      }
      image.src = url
    }, [url])

    return (
      <ReactPlaceholder
        showLoadingAnimation={showLoadingAnimation}
        type={placeHolderType}
        ready={isLoaded}
        color="#E0E0E0"
        style={placeHolderStyle}
      >
        {children}
      </ReactPlaceholder>
    )
  },
)

ImageLoader.propTypes = {
  showLoadingAnimation: PropTypes.bool,
  children: PropTypes.element,
  placeHolderStyle: PropTypes.object,
  url: PropTypes.string.isRequired,
  placeHolderType: PropTypes.string,
  // children: PropTypes.func.isRequired,
}

ImageLoader.defaultProps = {
  showLoadingAnimation: true,
  placeHolderType: "rect",
}

const StyledImage = styled.img`
  background-color: ${props => props.theme.dg};
  &[data-url="false"] {
    padding: 20px;
  }
  &[data-loaded="false"] {
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
  ${props => props.styledCss}
`

const MyImage = memo(({ url, styledCss }) => {
  const [isLoaded, setLoaded] = useState(false)
  const onImageLoaded = useCallback(() => setLoaded(true), [])

  return (
    <StyledImage
      src={url || UserAvatar}
      styledCss={styledCss}
      data-url={!!url}
      data-loaded={isLoaded}
      alt=""
      onLoad={onImageLoaded}
    />
  )
})

MyImage.propTypes = {
  styledCss: PropTypes.array,
  url: PropTypes.string,
}

export { MyImage, ImageLoader }
