import React from "react"

import { useSelector } from "react-redux"
import styled from "styled-components"
import playPage from "./connectPlayBarReducer"
import { formatAudioTime } from "../../../utils"
import { useHistory } from "react-router-dom"

const DiscoverPage = styled.main`
  position: relative;
  padding: 15px;
`

const PlayPage = props => {
  const { audioRef } = props
  console.log(props)
  const currentPlayId = useSelector(state => state.playBar.currentPlayId)
  const history = useHistory()

  console.log(songDetail)
  // console.log(formatAudioTime(audioRef.currentTime))
  return (
    <DiscoverPage>
      <PageBack />
    </DiscoverPage>
  )
}

export default PlayPage
