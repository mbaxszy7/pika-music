/* eslint-disable react/require-default-props */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/no-array-index-key */
import React, { useRef, useState, memo, useMemo, useCallback } from "react"
import { animated } from "react-spring"
import PropTypes from "prop-types"
import styled from "styled-components"
import Label from "./Label"
import { MyImage } from "../../shared/Image"
import { MyBanner } from "../../shared/MyBanner"

const BannerList = styled.div`
  position: relative;
  width: 100%;
  padding: 39% 0 0;
  overflow: hidden;
`

const StyledMyImage = styled(MyImage)`
  width: 100%;
  height: 100%;
  position: absolute;
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
  overflow: hidden;
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
    const events = useMemo(() => eventBind(), [eventBind])
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
        <BannerImgContainer
          style={{
            transform: scale.interpolate(s => `scale(${s})`),
          }}
        >
          <StyledMyImage url={imgUrl} />
        </BannerImgContainer>
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

  const myBannerref = useRef()
  const onBannerChange = useCallback(index => {
    setActiveBanner(index)
  }, [])

  return (
    <BannerList>
      <MyBanner
        banners={bannerList.map(b => b.pic)}
        onBannerChange={onBannerChange}
        ref={myBannerref}
      />
      <DotsContainer>
        {bannerList.map((_, idx) => (
          <Dot
            active={idx === activeBanner}
            key={idx}
            onClick={() => {
              myBannerref.current.nextPic(idx)
            }}
          />
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
