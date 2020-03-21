/* eslint-disable react/require-default-props */
import React, { memo, useState, useCallback } from "react"
import PropTypes from "prop-types"
import styled from "styled-components"

const SIZE = {
  large: 134,
  medium: 84,
  small: 44,
}

const StyledAvatar = styled.img`
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  max-width: ${props => props.size}px;
  max-height: ${props => props.size}px;
  border-radius: 50%;
  display: block;
  &[data-settled="false"] {
    background-color: grey;
  }
`

const Avatar = memo(({ size, url }) => {
  const [isLoaded, setLoaded] = useState(false)
  const onImageLoaded = useCallback(() => setLoaded(true), [])
  const wh = SIZE[size] ?? 84
  return (
    <StyledAvatar
      src={url}
      size={wh}
      data-settled={isLoaded}
      onLoad={onImageLoaded}
    />
  )
})

Avatar.propTypes = {
  size: PropTypes.string,
  url: PropTypes.string,
}

export default Avatar
