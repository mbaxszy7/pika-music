/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useCallback } from "react"
import PropTypes from "prop-types"
import styled from "styled-components"

import pageBackIcon from "../../assets/pageBack.png"

const StyledPageBack = styled.div`
  display: flex;
  margin-bottom: 20px;
  img {
    width: 18px;
    height: 18px;
  }
  p {
    font-size: 16px;
    flex: 1;
    color: ${props => props.theme.fg};
    text-align: center;
    text-indent: -20px;
  }
`

const PageBack = ({ title }) => {
  const onPageBack = useCallback(() => {
    window.history.back()
  }, [])
  return (
    <StyledPageBack>
      <img src={pageBackIcon} alt="" onClick={onPageBack} />
      <p>{title}</p>
    </StyledPageBack>
  )
}

PageBack.propTypes = {
  title: PropTypes.string.isRequired,
}

export default PageBack
