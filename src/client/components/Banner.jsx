/* eslint-disable react/require-default-props */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/no-array-index-key */
import React, { useRef, useState, memo, useMemo, useEffect } from "react"
import { animated, useSprings } from "react-spring"
import { useDrag } from "react-use-gesture"
import PropTypes from "prop-types"
import styled from "styled-components"
import Label from "./Label"
import { ImageLoader } from "../../shared/Image"
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
  bottom: 3px;
  left: 50%;
  transform: translateX(-50%);
`

const Dot = styled.li`
  margin-right: 4px;
  width: 6px;
  height: 6px;
  ${props => (props.active ? "background: white;" : " background: lightgray;")}
  border-radius: 50%;
  display: inline-block;
`

const BannerListItem = memo(
  ({ eventBind, display, translateX, imgUrl, scale, labelText }) => {
    const events = useMemo(() => eventBind(), [])
    return (
      <BannerItem
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...events}
        // eslint-disable-next-line react/no-array-index-key
        style={{
          display,
          transform: translateX.interpolate(
            xValue => `translate3d(${xValue}px,0 ,0)`,
          ),
        }}
      >
        <ImageLoader
          url={imgUrl}
          placeHolderStyle={{
            position: "absolute",
            top: 0,
            width: "100%",
            height: "100%",
            borderRadius: 10,
          }}
        >
          <BannerImgContainer
            style={{
              transform: scale.interpolate(s => `scale(${s})`),
              backgroundImage: `url(${imgUrl})`,
            }}
          />
        </ImageLoader>
        <Label text={labelText} />
      </BannerItem>
    )
  },
)

BannerListItem.propTypes = {
  eventBind: PropTypes.func.isRequired,
  display: PropTypes.object,
  translateX: PropTypes.object,
  imgUrl: PropTypes.string,
  scale: PropTypes.object,
  labelText: PropTypes.string,
}

const BannerListContainer = memo(({ bannerList }) => {
  const [activeBanner, setActiveBanner] = useState(0)
  const index = useRef(0)
  const [bannerWidth, setBannerWidth] = useState(768)
  useEffect(() => setBannerWidth(window.innerWidth), [])

  const [banners, set] = useSprings(bannerList.length, i => ({
    x: i * bannerWidth,
    sc: 1,
    display: "block",
  }))

  const bind = useDrag(
    ({ down, movement: [xDelta], direction: [xDir], distance, cancel }) => {
      if (down && distance > 90)
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
        const x = (i - index.current) * bannerWidth + (down ? xDelta : 0)
        const sc = down ? 1 - distance / bannerWidth / 2 : 1
        return { x, sc, display: "block" }
      })
    },
  )

  return (
    <BannerList>
      {banners.map(({ x, display, sc }, i) => (
        <BannerListItem
          key={i}
          eventBind={bind}
          display={display}
          translateX={x}
          imgUrl={bannerList[i].pic}
          labelText={bannerList[i].typeTitle}
          scale={sc}
        />
      ))}
      <DotsContainer>
        {bannerList.map((_, idx) => (
          <Dot active={idx === activeBanner} key={idx} />
        ))}
      </DotsContainer>
    </BannerList>
  )
})

BannerListContainer.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  bannerList: PropTypes.array.isRequired,
}

export default BannerListContainer
