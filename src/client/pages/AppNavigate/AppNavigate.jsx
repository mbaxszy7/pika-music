/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useCallback, memo } from "react"
import styled from "styled-components"
import { useLocation } from "react-router-dom"
import { MyImage } from "../../../shared/Image"
import mediaQury from "../../../shared/mediaQury.styled"
import pikaTail from "../../../assets/pika_tail_512x512.png"

const StyledAppNavigate = styled.nav`
  ${mediaQury.aboveTablet`
    position: sticky;
    top: 20px;
    display: block;
    width: 240px;
    padding: 40px 12px 12px 12px;
    float: left;
    display: flex;
    flex-direction: column;
    align-items: center;
 `};
  ${mediaQury.phone`
    display: none;
 `};
`

const NAV_ITEMS = [
  { play_list: "歌单" },
  { new_track: "新歌" },
  { album: "最新专辑" },
  { mv: "独家放送" },
]

const NavItem = styled.a`
  color: ${({ theme, isActive }) => (isActive ? theme.secondary : theme.fg)};

  font-size: 18px;
  margin-top: 20px;
  text-align: center;
  text-indent: -2em;
  display: block;
  &:hover {
    color: ${({ theme }) => theme.secondary};
  }
`

const StyledMyImage = styled(MyImage)`
  width: 120px;
  height: 120px;
  border-radius: 20px;
  margin-bottom: 30px;
`

const AppNavigate = memo(() => {
  const [activeNav, setActiveNav] = useState(-1)
  const loaction = useLocation()
  const onNavClick = useCallback(e => {
    const index = e.target.getAttribute("data-index")
    if (typeof (index * 1) === "number") {
      setActiveNav(index * 1)
    }
  }, [])
  if (loaction.pathname !== "/") {
    return null
  }
  return (
    <StyledAppNavigate>
      <StyledMyImage url={pikaTail} />
      <ul onClick={onNavClick}>
        {NAV_ITEMS.map((nav, index) => (
          <NavItem
            isActive={index === activeNav}
            data-index={index}
            key={index}
            href={`#${Object.keys(nav)[0]}`}
          >
            {nav[Object.keys(nav)[0]]}
          </NavItem>
        ))}
      </ul>
    </StyledAppNavigate>
  )
})

export default AppNavigate
