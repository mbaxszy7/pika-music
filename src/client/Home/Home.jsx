/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from "react"
import axios from "axios"
import useSWR from "swr"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import ConnectHomeReducer from "./fetchHomeData"

const page = new ConnectHomeReducer()

const Home = ({ axiosInstance }) => {
  const memoFetcher = React.useMemo(
    () => page.requestPlayLists(axiosInstance),
    [],
  )
  const initialData = useSelector(state => state.home.playlists)
  const { data: playlists, error } = useSWR("/api/top/playlist", memoFetcher, {
    initialData: initialData.length ? initialData : undefined,
  })
  const newList = useSelector(state => state.home.newsList)

  const dispatch = useDispatch()
  const testDispatch = () => {
    dispatch({
      type: "ADD_NEWS",
      data: "ooooo",
    })
  }

  if (!playlists) return <div>loading playlists...</div>

  return (
    <>
      <div>this is home lalall ffgvhggv</div>
      <ul>
        {newList.map((news, index) => (
          <li key={index}>{news}</li>
        ))}
        {playlists &&
          playlists.map((song, index) => <li key={index}>{song.name}</li>)}
      </ul>
      <div onClick={testDispatch}>add</div>
      <Link to="/details">details</Link>
    </>
  )
}

export default page.initPageComp(Home)
