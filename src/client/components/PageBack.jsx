/* eslint-disable react/require-default-props */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useCallback } from "react"
import PropTypes from "prop-types"
import styled from "styled-components"

import pageBackIcon from "../../assets/pageBack.png"

const StyledPageBack = styled.div`
  display: flex;
  background-color: ${props => props.theme.mg};
  img {
    width: 18px;
    height: 18px;
  }
  p {
    font-weight: bold;
    font-size: 16px;
    flex: 1;
    color: ${props => props.theme.fg};
    text-align: center;
    text-indent: -20px;
  }
`

const PageBack = ({ title, style }) => {
  const onPageBack = useCallback(() => {
    window.history.back()
  }, [])
  return (
    <StyledPageBack style={style}>
      <img src={pageBackIcon} alt="" onClick={onPageBack} />
      {title && <p>{title}</p>}
    </StyledPageBack>
  )
}

PageBack.propTypes = {
  style: PropTypes.object,
  title: PropTypes.string,
}

export default PageBack
