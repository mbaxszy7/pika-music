/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"

const Home = () => {
  const newList = useSelector(state => state.home.newsList)
  const dispatch = useDispatch()
  const testDispatch = () =>
    dispatch({
      type: "ADD_NEWS",
      data: "ooooo",
    })
  return (
    <>
      <div>this is home lalall ffgvhggv</div>
      <ul>
        {newList.map((news, index) => (
          <li key={index}>{news}</li>
        ))}
      </ul>
      <div onClick={testDispatch}>add</div>
      <Link to="/details">details</Link>
    </>
  )
}

export default Home
