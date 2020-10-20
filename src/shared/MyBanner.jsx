/* eslint-disable react/no-array-index-key */
/* eslint-disable no-param-reassign */
/* eslint-disable react/prop-types */
import React, {
  memo,
  useLayoutEffect,
  useCallback,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react"
import styled from "styled-components"
import { MyImage, StyledImage } from "../shared/Image.jsx"

export const MyStyledBanner = styled.div`
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
  white-space: nowrap;
  touch-action: pan-x;
  .banner_wrapper {
    width: 100%;
    display: inline-block;
    transition: transform ease 0.8s;
    transform: scale(1);
  }
`

const BannerImage = styled(MyImage)`
  width: 100%;
  border-radius: 10px;
`

export const MyBanner = memo(
  forwardRef((props, ref) => {
    const { banners, onBannerChange } = props
    if (!banners.length) return null
    const requestNextPicId = useRef()
    const requestNextTick = useRef()
    const root = useRef()
    const position = useRef(0)
    const startX = useRef(0)
    const scrollX = useRef()

    const pause = useCallback(() => {
      clearTimeout(requestNextPicId.current)
      clearTimeout(requestNextTick.current)
    }, [])

    const goTo = useCallback(() => {
      const currentPosition = position.current
      const nextPosition = (currentPosition + 1) % banners.length
      const current = root.current?.childNodes?.[currentPosition]
      const next = root.current.childNodes[nextPosition]

      current.style.transition = "none"
      next.style.transition = "none"

      // current的position translate到position 0的位置
      current.style.transform = `translate3d(${-100 * currentPosition}%, 0, 0)`

      // current的position translate到position 1的位置
      next.style.transform = `translate3d(${100 - 100 * nextPosition}%, 0, 0)`
      next.style.transform = `${next.style.transform}scale(0.8)`

      const tick = () => {
        current.style.transition = ""
        next.style.transition = ""

        // current 向前（左）translate
        current.style.transform = `translate3d(${-100 -
          100 * currentPosition}%, 0, 0)`
        current.style.transform = `${current.style.transform}scale(0.8)`

        // next到current的位置
        next.style.transform = `translate3d(${-100 * nextPosition}%, 0, 0)`
        position.current = nextPosition
        onBannerChange(position.current)
      }
      requestAnimationFrame(() => {
        requestAnimationFrame(() => tick())
      })
      requestNextTick.current = setTimeout(() => {
        goTo()
      }, 3000)
    }, [banners.length, onBannerChange])

    const nextPic = useCallback(
      index => {
        if (index != null) {
          onBannerChange(index)
          pause()
          const cur = root.current.childNodes[position.current]
          cur.style.transition = "none"
          // 移走当前的position
          cur.style.transform = `translate3d(${(banners.length + 1) *
            100}%, 0, 0)`

          const current = root.current.childNodes[index]
          current.style.transition = "none"
          // 移动指定的index到当前位置
          current.style.transform = `translate3d(${-100 * index}%, 0, 0)`

          position.current = index
        } else {
          onBannerChange(position.current)
        }

        requestNextPicId.current = setTimeout(() => {
          goTo()
        }, 3000)
      },
      [banners.length, goTo, onBannerChange, pause],
    )

    const start = useCallback(() => {
      clearTimeout(requestNextPicId.current)
      nextPic()
    }, [nextPic])

    const onEventStart = useCallback(
      (startXValue, current, last, next, lastPosition, nextPosition) => {
        pause()
        startX.current = startXValue

        current.style.transition = "none"
        last.style.transition = "none"
        next.style.transition = "none"

        current.style.transform = `translate3d(${-scrollX.current *
          position.current}px, 0, 0)`
        last.style.transform = `translate3d(${-scrollX.current -
          scrollX.current * lastPosition}px, 0, 0)`
        next.style.transform = `translate3d(${scrollX.current -
          scrollX.current * nextPosition}px, 0, 0)`
      },
      [pause],
    )

    const onEventMove = useCallback(
      (moveX, current, last, next, lastPosition, nextPosition) => {
        current.style.transform = `translate3d(${moveX -
          startX.current -
          scrollX.current * position.current}px, 0, 0)`
        current.style.transform = `${current.style.transform}scale(${1 -
          Math.abs((moveX - startX.current) / (scrollX.current * 2.5))})`

        last.style.transform = `translate3d(${moveX -
          startX.current -
          scrollX.current -
          scrollX.current * lastPosition}px, 0, 0)`
        last.style.transform = `${last.style.transform}scale(0.9)`

        next.style.transform = `translate3d(${moveX -
          startX.current +
          scrollX.current -
          scrollX.current * nextPosition}px, 0, 0)`
        next.style.transform = `${next.style.transform}scale(0.9)`
      },
      [],
    )

    const onEventEnd = useCallback(
      (endX, current, last, next, lastPosition, nextPosition) => {
        let offset = 0

        if (endX - startX.current > scrollX.current * 0.3) {
          offset = 1
        } else if (endX - startX.current < -scrollX.current * 0.3) {
          offset = -1
        }

        current.style.transition = ""
        last.style.transition = ""
        next.style.transition = ""

        current.style.transform = `translate3d(${offset * scrollX.current -
          scrollX.current * position.current}px, 0, 0)`
        last.style.transform = `translate3d(${offset * scrollX.current -
          scrollX.current -
          scrollX.current * lastPosition}px, 0, 0)`
        next.style.transform = `translate3d(${offset * scrollX.current +
          scrollX.current -
          scrollX.current * nextPosition}px, 0, 0)`

        position.current =
          (position.current - offset + banners.length) % banners.length

        start()
      },
      [banners.length, start],
    )

    const mouseEvent = useCallback(
      event => {
        const lastPosition =
          (position.current - 1 + banners.length) % banners.length
        const nextPosition = (position.current + 1) % banners.length

        const current = root.current.childNodes[position.current]
        const last = root.current.childNodes[lastPosition]
        const next = root.current.childNodes[nextPosition]

        onEventStart(
          event.clientX,
          current,
          last,
          next,
          lastPosition,
          nextPosition,
        )

        const move = e => {
          onEventMove(
            e.clientX,
            current,
            last,
            next,
            lastPosition,
            nextPosition,
          )
        }
        const up = e => {
          onEventEnd(e.clientX, current, last, next, lastPosition, nextPosition)

          root.current.removeEventListener("mousemove", move)
          root.current.removeEventListener("mouseup", up)
          root.current.removeEventListener("mouseleave", up)
        }
        root.current.addEventListener("mousemove", move)
        root.current.addEventListener("mouseup", up)
        root.current.addEventListener("mouseleave", up)
      },
      [banners.length, onEventEnd, onEventMove, onEventStart],
    )

    const bind = useCallback(() => {
      root.current.addEventListener("mousedown", mouseEvent)

      root.current.addEventListener(
        "touchstart",
        event => {
          if (event.cancelable) {
            event.preventDefault()
          }
          const lastPosition =
            (position.current - 1 + banners.length) % banners.length
          const nextPosition = (position.current + 1) % banners.length

          const current = root.current.childNodes[position.current]
          const last = root.current.childNodes[lastPosition]
          const next = root.current.childNodes[nextPosition]

          onEventStart(
            event.changedTouches[0].pageX,
            current,
            last,
            next,
            lastPosition,
            nextPosition,
          )

          const move = e => {
            if (e.cancelable) {
              e.preventDefault()
            }
            onEventMove(
              e.changedTouches[0].pageX,
              current,
              last,
              next,
              lastPosition,
              nextPosition,
            )
          }
          const up = e => {
            onEventEnd(
              e.changedTouches[0].pageX,
              current,
              last,
              next,
              lastPosition,
              nextPosition,
            )

            root.current.removeEventListener("touchmove", move)
            root.current.removeEventListener("touchend", up)
          }
          root.current.addEventListener("touchmove", move, { passive: false })
          root.current.addEventListener("touchend", up, { passive: true })
        },
        { passive: true },
      )
    }, [banners.length, mouseEvent, onEventEnd, onEventMove, onEventStart])

    useLayoutEffect(() => {
      nextPic()
      requestAnimationFrame(() => {
        scrollX.current = parseInt(getComputedStyle(root.current).width, 10)
        bind()
      })
    }, [bind, nextPic])

    useImperativeHandle(ref, () => ({
      nextPic,
    }))

    return (
      <MyStyledBanner ref={root}>
        {banners.map((b, index) => (
          <div className="banner_wrapper" key={index}>
            <BannerImage url={b} alt="" draggable={false} />
          </div>
        ))}
      </MyStyledBanner>
    )
  }),
)
