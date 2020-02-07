/* eslint-disable react/require-default-props */
import React, { memo } from "react"
import PropTypes from "prop-types"
import ReactPlaceholder from "react-placeholder"
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
`

const Avatar = memo(({ size, url }) => {
  const wh = SIZE[size] ?? 84
  return (
    <ReactPlaceholder
      type="round"
      ready={!!url}
      style={{
        width: wh,
        height: wh,
      }}
    >
      <StyledAvatar src={url} size={wh} />
    </ReactPlaceholder>
  )
})

Avatar.propTypes = {
  size: PropTypes.string,
  url: PropTypes.string,
}

export default Avatar
