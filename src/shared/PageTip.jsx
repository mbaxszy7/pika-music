/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect, useCallback } from "react"

import { animated, useTransition } from "react-spring"
import styled from "styled-components"
import InnerModal from "./InnerModal"

const StyledPageTipWrapper = styled.ul`
  position: fixed;
  right: 0;
  bottom: 20px;
  z-index: 5000;
  max-height: 400px;
  overflow-y: scroll;
`

const StyledPageTip = styled(animated.div)`
  margin-top: 12px;
  border-left: 3px solid ${({ theme }) => theme.secondary};
  background: black;
  color: ${({ theme }) => theme.fg};
  font-size: 12px;
  padding: 5px 3px;

  white-space: pre-line;
  text-align: center;
  line-height: 1.3;
`

const PageTip = ({ tips }) => {
  const [showTipTexts, setShowTip] = useState(() =>
    tips.length
      ? tips
      : [
          {
            key: Date.now(),
            text: "",
          },
        ],
  )

  useEffect(() => {
    setShowTip(tips)

    const autoClear = setTimeout(() => {
      setShowTip([
        {
          key: Date.now(),
        },
      ])
    }, 6000)

    return () => clearTimeout(autoClear)
  }, [tips])

  const transitions = useTransition(showTipTexts, item => item.key, {
    from: { transform: "translate3d(100%,0,0)" },
    enter: { transform: "translate3d(0,0,0)" },
    leave: { transform: "translate3d(100%,0,0)" },
  })

  const onTipClick = useCallback(
    item => {
      if (typeof item.action === "function") item.action()

      const clickedIndex = showTipTexts.findIndex(text => text.key === item.key)
   
      if (clickedIndex !== -1) {
        const oldTips = [...showTipTexts]
        oldTips.splice(clickedIndex, 1)
        console.log(clickedIndex,[...oldTips] )
        setShowTip(oldTips)
      }
    },
    [showTipTexts],
  )

  return (
    <InnerModal>
      <StyledPageTipWrapper>
        {transitions.map(
          ({ item, props, key }) =>
            item?.text && (
              <StyledPageTip
                style={props}
                key={key}
                onClick={e => onTipClick(item, e)}
              >
                {item.text}
              </StyledPageTip>
            ),
        )}
      </StyledPageTipWrapper>
    </InnerModal>
  )
}

export default PageTip
