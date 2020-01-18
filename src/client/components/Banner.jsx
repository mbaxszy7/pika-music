import React, { useRef, useState } from "react"
import ReactPlaceholder from "react-placeholder"
import { animated, useSprings } from "react-spring"
import { useDrag } from "react-use-gesture"
import PropTypes from "prop-types"
import styled from "styled-components"
import Image from "../../shared/Image"
import { clamp } from "../../utils"

const BannerList = styled.div`
  position: relative;
  width: 100%;
  padding: 38.15% 0 0;
  overflow: hidden;
`

const BannerItem = styled(animated.div)`
  min-width: 100%;
  will-change: transform;
  position: absolute;
  padding: 38.15% 0 0;
  top: 0px;
  touch-action: pan-x;
`
const BannerImgContainer = styled(animated.div)`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  background-size: 100% auto;
  background-repeat: no-repeat;
  will-change: transform;
  border-radius: 10px;
`

const DotsContainer = styled.ul`
  position: absolute;
  top: 1px;
  right: 3px;
`

const Dot = styled.li`
  margin-right: 4px;
  width: 6px;
  height: 6px;
  ${props => (props.active ? "background: white;" : " background: lightgray;")}
  border-radius: 50%;
  display: inline-block;
`

const BannerListContainer = ({ bannerList }) => {
  const [activeBanner, setActiveBanner] = useState(0)
  const index = useRef(0)

  const [banners, set] = useSprings(bannerList.length, i => ({
    x: i * window.innerWidth,
    sc: 1,
    display: "block",
  }))
  const bind = useDrag(
    ({ down, movement: [xDelta], direction: [xDir], distance, cancel }) => {
      if (down && distance > 115)
        cancel(
          (index.current = clamp(
            index.current + (xDir > 0 ? -1 : 1),
            0,
            bannerList.length - 1,
          )),
        )
      set(i => {
        if (i < index.current - 1 || i > index.current + 1)
          return { display: "none" }
        setActiveBanner(index.current)
        const x = (i - index.current) * window.innerWidth + (down ? xDelta : 0)
        const sc = down ? 1 - distance / window.innerWidth / 2 : 1
        return { x, sc, display: "block" }
      })
    },
  )

  return (
    <BannerList>
      {banners.map(({ x, display, sc }, i) => (
        <BannerItem
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...bind()}
          // eslint-disable-next-line react/no-array-index-key
          key={i}
          style={{
            display,
            transform: x.interpolate(xValue => `translate3d(${xValue}px,0 ,0)`),
          }}
        >
          <Image url={bannerList[i].pic}>
            {(isLoaded, url) => (
              <ReactPlaceholder
                type="rect"
                ready={isLoaded}
                color="#E0E0E0"
                showLoadingAnimation
                style={{
                  position: "absolute",
                  top: 0,
                  width: "100%",
                  height: "100%",
                  borderRadius: 10,
                }}
              >
                <BannerImgContainer
                  style={{
                    transform: sc.interpolate(s => `scale(${s})`),
                    backgroundImage: `url(${url})`,
                  }}
                />
              </ReactPlaceholder>
            )}
          </Image>
        </BannerItem>
      ))}
      <DotsContainer>
        {bannerList.map((_, idx) => (
          // eslint-disable-next-line react/no-array-index-key
          <Dot active={idx === activeBanner} key={idx} />
        ))}
      </DotsContainer>
    </BannerList>
  )
}

BannerListContainer.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  bannerList: PropTypes.array.isRequired,
}

export default BannerListContainer
