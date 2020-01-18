import React, { useRef, useState, useEffect } from "./node_modules/react"
import { Link } from "./node_modules/react-router-dom"
import styled, { createGlobalStyle } from "./node_modules/styled-components"
import {
  useSprings,
  interpolate,
  animated,
  useTransition,
  config,
  useSpring,
  useChain,
} from "./node_modules/react-spring"
import { useDrag } from "./node_modules/react-use-gesture"

const data = [
  {
    name: "Rare Wind",
    description: "#a8edea → #fed6e3",
    css: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    height: 200,
  },
  {
    name: "Saint Petersburg",
    description: "#f5f7fa → #c3cfe2",
    css: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
    height: 400,
  },
]

const DetailsGlobal = createGlobalStyle`
  * {
  box-sizing: border-box;
}

#root {
  max-height: 100vh;
}

.content > div {
  user-select:none;
  position: absolute;
  width: 160px;
  height: 45px;

  transform-origin: 50% 50% 0px;
  border-radius: 5px;
  color: white;
  line-height: 45px;
  padding-left: 32px;
  font-size: 14.5px;
  background: lightblue;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.content > div:nth-child(1) {
  background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
}
.content > div:nth-child(2) {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}
.content > div:nth-child(3) {
  background: linear-gradient(135deg, #5ee7df 0%, #b490ca 100%);
}
.content > div:nth-child(4) {
  background: linear-gradient(135deg, #c3cfe2 0%, #c3cfe2 100%);
}
`

const Global = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  html,
  body,
  #root {
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
    overflow: hidden;
    user-select: none;
    background: lightblue;
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`

const Container = styled(animated.div)`
  display: flex;
  flex-direction: column;

  background: white;
  border-radius: 5px;
  box-shadow: 0px 10px 10px -5px rgba(0, 0, 0, 0.05);
  will-change: width, height;
`

const Item = styled(animated.div)`
  width: 100%;
  height: 300px;
  background: white;
  border-radius: 5px;
  will-change: transform, opacity;
`
const items = "Lorem ipsum dolor sit".split(" ")
const fn = (order, down, originIndex, curIndex, y) => index => {
  return down && originIndex === index
    ? {
        y: curIndex * 50 + y,
        scale: 1.1,
        zIndex: "1",
        shadow: 15,
        immediate: name => name === "zIndex" || name === "y",
      }
    : {
        y: order.indexOf(index) * 50,
        scale: 1,
        zIndex: "0",
        shadow: 1,
        immediate: false,
      }
}

const ToggleTransition = () => {
  const [toggle, set] = useState(false)
  const transitions = useTransition(toggle, null, {
    from: { position: "absolute", opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  })
  return (
    <>
      <div style={{ position: "relative" }}>
        {transitions.map(({ item, key, props }) => {
          return item ? (
            <animated.div style={props} key={key}>
              😄
            </animated.div>
          ) : (
            <animated.div style={props} key={key}>
              🤪
            </animated.div>
          )
        })}
      </div>

      <button onClick={() => set(is => !is)}>toggle</button>
    </>
  )
}

const ChainTransition = () => {
  const [open, set] = useState(false)
  const springRef = useRef()
  const { size, opacity, ...rest } = useSpring({
    ref: springRef,
    config: config.stiff,
    from: { size: "20%", background: "hotpink" },
    to: { size: open ? "100%" : "20%", background: open ? "white" : "hotpink" },
  })

  const transRef = useRef()
  const transitions = useTransition(open ? data : [], item => item.name, {
    ref: transRef,
    config: config.stiff,
    unique: true,
    trail: 400 / data.length,
    from: { opacity: 0, transform: "scale(0)" },
    enter: { opacity: 1, transform: "scale(1)" },
    leave: { opacity: 0, transform: "scale(0)" },
  })
  useChain(open ? [springRef, transRef] : [transRef, springRef], [
    0,
    open ? 0.1 : 0.3,
  ])
  return (
    <>
      <Global />
      <Container
        style={{ ...rest, width: size, height: size }}
        onClick={() => set(open => !open)}
      >
        {transitions.map(({ item, key, props }) => (
          <Item key={key} style={{ ...props, background: item.css }} />
        ))}
      </Container>
    </>
  )
}

const Details = () => {
  // const order = useRef(items.map((_, index) => index)) // Store indicies as a local ref, this represents the item order
  // const [springs, setSprings] = useSprings(items.length, fn(order.current)) // Create springs, each corresponds to an item, controlling its transform, scale, etc.
  // const handler = ({ event, args: [originalIndex], down, movement: [, y] }) => {
  //   const curIndex = order.current.indexOf(originalIndex)
  //   const curRow =
  //     // eslint-disable-next-line no-nested-ternary
  //     Math.round((curIndex * 50 + y) / 50) < 0
  //       ? 0
  //       : Math.round((curIndex * 50 + y) / 50) > items.length - 1
  //       ? items.length - 1
  //       : Math.round((curIndex * 50 + y) / 50)
  //   const newOrder = [...order.current]
  //   ;[newOrder[curIndex], newOrder[curRow]] = [
  //     newOrder[curRow],
  //     newOrder[curIndex],
  //   ]
  //   setSprings(fn(newOrder, down, originalIndex, curIndex, y))
  //   if (!down) order.current = newOrder
  // }
  // const bind = useDrag(handler, {
  //   domTarget: document.getElementsByClassName("content")[0],
  // })

  const [itemsNum, set] = useState([{ text: 1, key: 1 }])
  const transitions = useTransition(itemsNum, item => item.text, {
    config: { ...config.gentle },
    from: { transform: "translate3d(0,-10px,0)", opacity: 0 },
    enter: { transform: "translate3d(0,0px,0)", opacity: 1 },
    leave: item => async (next, cancel) => {
      await next({ transform: "translate3d(0,-2px,0)", opacity: 0.5 })
      await next({ transform: "translate3d(0,10px,0)", opacity: 0 })
      await next({ transform: "translate3d(0,10px,0)", opacity: 0 })
    },
  })

  useEffect(() => {
    const id = setInterval(() => {
      set(nums => {
        if (nums.length > 5) {
          clearInterval(id)
        }
        nums.push({
          text: nums[nums.length - 1].text + 1,
          key: nums[nums.length - 1].text + 1,
        })

        return [...nums]
      })
    }, 1000)
  }, [])

  useEffect(() => {
    setTimeout(() => {
      const id = setInterval(() => {
        set(nums => {
          if (nums.length === 0) {
            clearInterval(id)
            return []
          }
          const copy = [...nums]
          copy.pop()
          // console.log([...nums])
          return [...copy]
        })
      }, 1000)
    }, 10000)
  }, [])
  return (
    <>
      {/* <DetailsGlobal /> */}
      {/* <div className="content">
        {springs.map(({ zIndex, shadow, y, scale }, i) => (
          <animated.div
            {...bind(i)}
            key={i}
            style={{
              touchAction: "pan-x",
              zIndex,
              boxShadow: shadow.interpolate(
                s => `rgba(0, 0, 0, 0.15) 0px ${s}px ${2 * s}px 0px`,
              ),
              transform: interpolate(
                [y, scale],
                (ys, s) => `translate3d(0,${ys}px,0) scale(${s})`,
              ),
            }}
          >
            {items[i]}
          </animated.div>
        ))}
      </div> */}

      {/* <div style={{ padding: 80, display: "flex" }}>
        {transitions.map(({ item, props, key }) => {
          return (
            <animated.div key={key} style={{ ...props, width: 20 }}>
              {item.text}
            </animated.div>
          )
        })}
      </div> */}
      <ToggleTransition />
    </>
  )
}

export default ChainTransition
