/* eslint-disable no-unused-expressions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useCallback, useEffect } from "react"

import styled from "styled-components"
import { Tabs, TabPane } from "../../../shared/Tab"

const StyledTabs = styled(Tabs)`
  & {
    width: 100%;
    white-space: nowrap;
    overflow-x: scroll;
    line-height: 60px;
  }
`
const StyledTabPane = styled(TabPane)`
  & {
    width: 100px;
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    display: inline-block;
    vertical-align: top;
    color: ${({ isActive, theme }) => (isActive ? theme.secondary : "white")};
  }
`

const SONGS_TYPE = [
  { area: "全部", id: 0 },
  { area: "华语", id: 7 },
  { area: "欧美", id: 96 },
  { area: "日本", id: 8 },
  { area: "韩国", id: 16 },
]

const NewSongsMore = ({
  onLabelClick,
  selectedLabel,
  listData,
  setListData,
  isLoading,
  resetPage,
  type,
}) => {
  const onTabChange = useCallback(tabKey => {
    // console.warn(tabKey)
  }, [])

  return (
    <StyledTabs onChange={onTabChange} defaultActiveKey="0" activeTabKey="0">
      {SONGS_TYPE.map((area, index) => (
        <StyledTabPane
          tab={area.area}
          forceRender
          tabKey={`${index}`}
          key={area.id}
        >
          99999
        </StyledTabPane>
      ))}
    </StyledTabs>
  )
}

export default NewSongsMore
