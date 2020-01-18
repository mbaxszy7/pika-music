/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from "react"
import styled from "styled-components"
import ReactPlaceholder from "react-placeholder"
import { useSpring, animated, config } from "react-spring"
import useSWR from "swr"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import ConnectHomeReducer from "./connectHomeReducer"

const AnimatedH = styled(animated.h1)`
  color: red;
`
const AnimatedDIV = styled(animated.div)`
  color: red;
  background: black;
  height: 40px;
`
const FlippedBackDiv = styled(animated.div)`
  width: 300px;
  height: 200px;
  background: black;
`
const FlippedFrontDiv = styled(animated.div)`
  width: 300px;
  height: 200px;
  background: red;
`

const FlippedDivGroup = styled.div`
  position: relative;
  div {
    position: absolute;
    top: 0;
    left: 0;
  }
`

const page = new ConnectHomeReducer()

// const MadeDiv = animated(({ width }) => (
//   <AnimatedH width={width}> i will be long</AnimatedH>
// ))

const Home = () => {
  const initialData = useSelector(state => state.home.playlists)
  const { data: playlists } = useSWR(
    "/api/top/playlist?limit=5&order=new",
    page.requestPlayLists,
    { initialData },
  )
  const newList = useSelector(state => state.home.newsList)

  const dispatch = useDispatch()
  const testDispatch = () => {
    dispatch({
      type: "ADD_NEWS",
      data: "ooooo",
    })
  }

  const props = useSpring({
    config: { ...config.gentle },
    from: { opacity: 0, width: 0 },
    opacity: 1,
    width: 100,
  })

  const propsAsync = useSpring({
    to: async (next, cancel) => {
      await next({ opacity: 1, color: "#ffaaee" })
      await next({ opacity: 0, color: "rgb(14,26,19)" })
    },
    from: { opacity: 0, color: "red" },
  })

  const [flipped, setFlipped] = useState(false)
  const { opacity, transform } = useSpring({
    opacity: flipped ? 1 : 0,
    transform: `perspective(600px) rotateX(${flipped ? 180 : 0}deg)`,
    config: { mass: 5, tension: 500, friction: 80 },
  })
  const eventHandlerMain = () => {
    console.log("eventHandlerMain")
  }
  const eventHandlerChild = () => {
    console.log("eventHandlerChild")
  }
  const eventHandlerSon = () => {
    console.log("eventHandlerSon")
    setTimeout(() => {
      console.log("lalalla")
    })
  }
  return (
    <div id="home">
      <div>this is home lalall ffgvhggv</div>

      {/* 尽量直接结合styled-components & animated */}
      {/* 不要中间再包一层react组件 */}
      <AnimatedH style={{ width: props.width.interpolate(n => n * 2) }}>
        i will become long
      </AnimatedH>
      <AnimatedDIV style={props} />
      <animated.div style={propsAsync}>I will fade in and out</animated.div>

      <FlippedDivGroup onClick={() => setFlipped(isFlipped => !isFlipped)}>
        <FlippedBackDiv
          style={{ opacity: opacity.interpolate(o => 1 - o), transform }}
        />
        <FlippedFrontDiv
          style={{ opacity, transform: transform.interpolate(t => `${t}`) }}
        />
      </FlippedDivGroup>

      <ul>
        {newList.map((news, index) => (
          <li key={index}>{news}</li>
        ))}
        {playlists
          ? playlists.map((song, index) => <li key={index}>{song.name}</li>)
          : ""}
      </ul>
      <div onClick={testDispatch}>add</div>
      <Link to="/details">details</Link>
      <animated.div
        style={{
          marginTop: 80,
          transform: props.opacity
            .interpolate({
              range: [0, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 1],
              output: [1, 0.97, 0.9, 1.1, 0.9, 1.1, 1.03, 1],
            })
            .interpolate(x => `scale(${x})`),
          background: "red",
        }}
      >
        i am a div
      </animated.div>
      <animated.div>{props.width.interpolate(n => n.toFixed(0))}</animated.div>
      <div className="main" onClick={eventHandlerMain}>
        <div className="child" onClick={eventHandlerChild}>
          <div className="son" onClick={eventHandlerSon}>
            test setTimeout in event bubble
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
