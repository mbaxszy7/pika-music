/* eslint-disable react/require-default-props */
import React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"

const BannerLabel = styled.span`
  position: absolute;
  padding: 6px 12px;
  border-radius: 200px;
  background: ${props => props.theme.secondary};
  font-size: 12px;
  color: black;
  bottom: 14px;
  right: 10px;
  font-weight: bold;
`

const Label = ({ text, className }) => {
  return <BannerLabel className={className}>{`#${text}`}</BannerLabel>
}

Label.propTypes = {
  text: PropTypes.string.isRequired,
  className: PropTypes.string,
}

export default Label
