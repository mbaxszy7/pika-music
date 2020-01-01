/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { awaitWrapper } from "../utils"

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
      <div>this is home lalall ffxsxsxcsdcsdc</div>
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
Home.loadData = async store => {
  const fakeFetchData = new Promise(resolve => {
    setTimeout(() => {
      resolve(["rrrrr", "llllll"])
    }, 2000)
  })

  const [error, data] = await awaitWrapper(fakeFetchData)
  if (error) {
    return Promise.reject(error)
  }
  store.dispatch({
    type: "ADD_NEWS",
    data,
  })
}
export default Home
