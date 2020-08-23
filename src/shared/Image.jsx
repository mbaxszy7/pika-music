/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/require-default-props */
import React, {
  memo,
  useState,
  useLayoutEffect,
  useCallback,
  useRef,
} from "react"
import styled from "styled-components"
import PropTypes from "prop-types"
import pikaLazy from "../utils/lazyImage"

const StyledImage = styled.img`
  background-color: ${props => props.theme.dg};
  user-select: none;
  &[data-settled="false"] {
    @keyframes react-placeholder-pulse {
      0% {
        opacity: 0.6;
      }
      50% {
        opacity: 1;
      }
      100% {
        opacity: 0.6;
      }
    }
    animation: react-placeholder-pulse 1.5s infinite;
  }
  ${props => props.styledCss}
`

const MyImage = memo(({ url, styledCss, className }) => {
  const imgRef = useRef()
  const [isLoaded, setLoaded] = useState(false)
  const onImageLoaded = useCallback(() => setLoaded(true), [])
  const isPageMounted = useRef()

  useLayoutEffect(() => {
    if (isPageMounted.current) {
      imgRef.current.setAttribute("data-loaded", false)
      imgRef.current.setAttribute("data-settled", true)
      imgRef.current.src = ""
    } else {
      isPageMounted.current = true
    }

    const observer = pikaLazy()
    observer.lazyObserver(imgRef.current)
  }, [url])

  return (
    <StyledImage
      onMouseDown={e => e.preventDefault()}
      ref={imgRef}
      className={` ${className} ${url ? "pika-lazy" : ""}`}
      data-src={url ? url.replace(/https?/, "https") : ""}
      styledCss={styledCss}
      data-settled={isLoaded}
      alt=""
      onLoad={onImageLoaded}
      loading="lazy"
    />
  )
})

MyImage.propTypes = {
  className: PropTypes.string,
  styledCss: PropTypes.array,
  url: PropTypes.string,
}

export { MyImage, StyledImage }
