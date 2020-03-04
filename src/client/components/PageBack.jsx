/* eslint-disable react/require-default-props */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useCallback, memo } from "react"
import PropTypes from "prop-types"
import styled from "styled-components"
import SingleLineTexts from "../../shared/LinesTexts.styled"
import pageBackIcon from "../../assets/pageBack.png"
import blackBackIcon from "../../assets/blackBack.png"

const StyledPageBack = styled.div`
  display: flex;
  background-color: ${props => props.theme.mg};
  img {
    width: 18px;
    height: 18px;
    margin-right: 20px;
  }
  p {
    font-weight: bold;
    font-size: 16px;
    flex: 1;
    color: ${props => props.theme.fg};
    text-align: center;
    text-indent: -20px;
    ${SingleLineTexts}
  }
`

const PageBack = memo(({ title, style, className, isBlack }) => {
  const onPageBack = useCallback(() => {
    window.history.back()
  }, [])
  return (
    <StyledPageBack style={style} className={className}>
      {isBlack ? (
        <img src={blackBackIcon} alt="" onClick={onPageBack} />
      ) : (
        <img src={pageBackIcon} alt="" onClick={onPageBack} />
      )}

      {title && <p>{title}</p>}
    </StyledPageBack>
  )
})

PageBack.propTypes = {
  isBlack: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
  title: PropTypes.string,
}

export default PageBack
