import React, { useLayoutEffect } from "react"
import styled from "styled-components"
import { useDispatch } from "react-redux"
import PropTypes from "prop-types"
import playBarPage from "../client/pages/PlayBar/connectPlayBarReducer"

const NotFoundAlert = styled.div`
  color: ${({ theme }) => theme.secondary};
  font-size: 18px;
  margin-top: 35vh;
  font-weight: bold;
  text-align: center;
`

const NotFound = ({ staticContext }) => {
  if (staticContext) {
    staticContext.NOT_FOUND = true
  }

  const dispatch = useDispatch()

  useLayoutEffect(() => {
    dispatch(playBarPage.setShowPlayBar(false))
  }, [dispatch])

  return <NotFoundAlert>You Are Lost</NotFoundAlert>
}

NotFound.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  staticContext: PropTypes.object.isRequired,
}

export default NotFound
