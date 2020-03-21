/* eslint-disable react/no-array-index-key */
import React, { memo, useMemo, useState, useRef, useCallback } from "react"
import PropTypes from "prop-types"
import styled from "styled-components"
import { PlaceHolderKeyframes } from "./PlaceHolderAnimation.styled"
import { useIsomorphicEffect } from "../utils/hooks"

const defaultWidths = [97, 100, 94, 90, 98, 95, 98, 40]

export const StyledTextRow = styled.span`
  background-color: #e0e0e0;
  width: 100%;
  height: 1em;
  display: block;
  animation: ${PlaceHolderKeyframes} 1.5s infinite;
`

export const TextBlock = memo(({ rows, widths }) => {
  return Array(rows)
    .fill("")
    .map((_, i) => (
      <StyledTextRow
        key={i}
        style={{
          width: widths[(i + widths.length) % widths.length],
          marginTop: "0.7em",
        }}
      />
    ))
})

TextBlock.propTypes = {
  rows: PropTypes.number,
  widths: PropTypes.arrayOf(PropTypes.number),
}

TextBlock.defaultProps = {
  rows: 3,
  widths: defaultWidths,
}

const MyPlaceholderType = {
  textRow: StyledTextRow,
  textBlock: TextBlock,
}

const MyPlaceholder = memo(function MyPlaceholder({
  rows,
  isOnlyFirstLunched,
  customPlaceholder,
  ready,
  delay,
  type,
  widths,
  children,
}) {
  const [readProp, setReadyProp] = useState(() => ready)
  const timeout = useRef()
  const handleClick = useCallback(e => e.stopPropagation(), [])
  const placeholder = useMemo(() => {
    if (customPlaceholder && React.isValidElement(customPlaceholder)) {
      return customPlaceholder
    }
    const Holder = MyPlaceholderType[type]
    return <Holder rows={rows} widths={widths} onClick={handleClick} />
  }, [customPlaceholder, rows, type, widths, handleClick])

  useIsomorphicEffect(() => {
    if (!isOnlyFirstLunched && readProp && !ready) {
      if (delay && delay > 0) {
        timeout.current = setTimeout(() => {
          setReadyProp(false)
        }, delay)
      } else {
        setReadyProp(false)
      }
    } else if (ready) {
      // 如果已经ready
      if (timeout.current) {
        clearTimeout(timeout.current)
      }

      if (!readProp) {
        setReadyProp(true)
      }
    }
  }, [delay, isOnlyFirstLunched, readProp, ready])

  useIsomorphicEffect(() => {
    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current)
      }
    }
  }, [])

  return readProp ? children : placeholder
})

MyPlaceholder.propTypes = {
  rows: PropTypes.number,
  isOnlyFirstLunched: PropTypes.bool,
  customPlaceholder: PropTypes.node,
  ready: PropTypes.bool,
  delay: PropTypes.number,
  type: PropTypes.string,
  widths: PropTypes.arrayOf(PropTypes.number),
  children: PropTypes.node,
}
MyPlaceholder.defaultProps = {
  rows: 3,
  isOnlyFirstLunched: false,
  customPlaceholder: "",
  ready: false,
  delay: 0,
  type: "textRow",
  widths: defaultWidths,
  children: "",
}

export default MyPlaceholder
