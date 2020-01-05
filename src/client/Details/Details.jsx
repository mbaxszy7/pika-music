import React from "react"
import axios from "axios"
import useSWR from "swr"
import { Link } from "react-router-dom"

const fetcher = url => axios.get(url, {})

const Details = () => (
  // const { data, error } = useSWR('/api/top/playlist?limit=10&order=new', fetcher)
  <>
    <div>this is details</div>
    <Link to="/home">home</Link>
  </>
)

export default Details
