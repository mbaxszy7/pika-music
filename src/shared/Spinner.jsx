import React, { memo } from "react"
import PropTypes from "prop-types"
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

const LoadingRing = styled.div`
  display: inline-block;
  position: relative;
  @keyframes lds-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: inherit;
    height: inherit;
    border: 3px solid white;
    border-radius: 50%;
    animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: #fff transparent transparent transparent;
  }
  div:nth-child(1) {
    animation-delay: -0.45s;
  }
  div:nth-child(2) {
    animation-delay: -0.3s;
  }
  div:nth-child(3) {
    animation-delay: -0.15s;
  }
  div {
    ${props => ({ ...props.styleRing })}
  }
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

export const SpinnerLoading = memo(({ className }) => {
  return (
    <LoadingRing className={className}>
      <div />
      <div />
      <div />
      <div />
    </LoadingRing>
  )
})

SpinnerLoading.propsTypes = {
  className: PropTypes.string,
}

export default Spinner
