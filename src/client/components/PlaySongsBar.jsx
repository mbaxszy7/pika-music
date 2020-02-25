/* eslint-disable react/require-default-props */
import React, { memo, useCallback } from "react"
import PropTypes from "prop-types"
import styled from "styled-components"

export const PlayIcon = styled.div`
  background: ${props => props.theme.secondary};
  width: 70px;
  height: 32px;
  border-radius: 200px;
  &::after {
    content: "";
    width: 0;
    height: 0;
    border-top: 0px solid transparent;
    border-bottom: 12px solid black;
    border-left: 9px solid transparent;
    border-right: 9px solid transparent;
    transform: rotate(90deg) translate(-6px, 7px);
    display: block;
    position: relative;
    top: 50%;
    left: 50%;
    border-radius: 3px;
  }
`

const PlayBar = styled.div`
  display: flex;

  align-items: center;
`

const SongsCount = styled.span`
  color: ${props => props.theme.dg};
  font-size: 16px;
  font-weight: bold;
  margin-left: 18px;
`

const PlaySongsBar = memo(({ songsCount, withoutBar, onPlayIconClick }) => {
  const handlePlayIconClick = useCallback(() => {
    onPlayIconClick()
  }, [onPlayIconClick])

  return (
    <PlayBar>
      {!withoutBar && <PlayIcon onClick={handlePlayIconClick} />}
      <SongsCount>{songsCount}</SongsCount>
    </PlayBar>
  )
})

PlaySongsBar.propTypes = {
  withoutBar: PropTypes.bool,
  songsCount: PropTypes.number,
  onPlayIconClick: PropTypes.func,
}

PlaySongsBar.defaultProps = {
  withoutBar: false,
}

export default PlaySongsBar
