import React, { memo } from "react"
import styled from "styled-components"

const SpinnerContainer = styled.div`
  width: 60px;
  height: 60px;
  z-index: 10000;
  position: relative;
  margin: 0 auto;
  margin-bottom: 0;
  .bounce:last-of-type {
    animation-delay: -1s;
  }
`

const DebounceDiv = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: ${props => props.theme.secondary};
  opacity: 0.6;
  position: absolute;
  top: 0;
  left: 0;
  @keyframes bounce {
    0%,
    100% {
      transform: scale(0);
    }
    50% {
      transform: scale(1);
    }
  }
  animation: bounce 2s infinite ease-in-out;
`

// eslint-disable-next-line react/prop-types
const Spinner = memo(({ style }) => {
  return (
    <SpinnerContainer style={{ ...style }}>
      <DebounceDiv className="bounce" />
      <DebounceDiv className="bounce" />
    </SpinnerContainer>
  )
})

export default Spinner
