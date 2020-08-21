import styled from "styled-components"
import SingleLineTexts from "../../../shared/LinesTexts.styled"
import { MyImage } from "../../../shared/Image"
import { StyledTextRow } from "../../../shared/MyPlaceholder"

export const PageBackWrapper = styled.div`
  position: fixed;
  padding: 25px 15px 15px 15px;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 501;
  opacity: ${props => props.opacity};
  background-color: ${props => props.theme.mg};
`
export const AlbumDetailsPage = styled.div`
  min-height: 100vh;
  padding: 30px 18px 40px 18px;
`

export const ScrollContainer = styled.div`
  position: sticky;
  padding-top: 30px;
  background-color: ${props => props.theme.mg};
  z-index: 5;
  overflow: hidden;
`

export const AlbumPic = styled.div`
  margin-top: 35px;
  position: sticky;
  z-index: 0;
  top: 15px;
  display: flex;
  justify-content: center;
`
export const StyledMyImage = styled(MyImage)`
  & {
    width: 180px;
    height: 180px;
    border-radius: 4px;
  }
`

export const PublishTime = styled.p`
  font-size: 16px;
  color: ${props => props.theme.dg};
  font-weight: bold;
  > ${StyledTextRow} {
    width: 100px;
  }
`
export const StyledDescModal = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  padding: 35px;
  font-size: 16px;
  background: ${props => props.theme.mg};
  color: ${props => props.theme.fg};
  padding-bottom: 70px;
  transition: opacity 0.2s;
  opacity: ${props => (props.isShow ? "1" : "0")};
  z-index: 1000;
  width: 100%;
  height: 100%;
  .close {
    position: absolute;
    bottom: 40px;
    color: ${props => props.theme.fg};
    text-align: center;
    font-size: 40px;
    width: 100%;
    left: 0;
  }
`

export const AlbumName = styled.p`
  margin-top: 12px;
  font-size: 20px;
  color: ${props => props.theme.fg};
  font-weight: bold;
  > ${StyledTextRow} {
    width: 150px;
  }
`
export const Artist = styled.div`
  margin-top: 20px;
  display: flex;
  align-items: center;
`

export const ArtistName = styled.span`
  font-size: 14px;
  color: ${props => props.theme.dg};
  margin-left: 15px;
  > ${StyledTextRow} {
    width: 120px;
  }
`
export const StyledDesc = styled.div`
  min-height: 20px;
  max-height: 86%;
  overflow-y: scroll;
  margin-top: 20px;
  font-size: 14px;
  line-height: 1.3;
  color: ${props => props.theme.dg};
  ${props =>
    props.isWhole ? "line-height:1.5; font-size: 16px" : SingleLineTexts};
  > ${StyledTextRow} {
    background: grey;
  }
`

export const MediaListWrapper = styled.div`
  margin-top: 30px;
`

export const PlayBarWrapper = styled.div`
  margin-bottom: 25px;
`

export const StyledCount = styled.div`
  display: inline-block;
  width: 50%;
  color: ${({ theme }) => theme.fg};
  .count {
    text-align: center;
    font-size: 22px;
    font-weight: bold;
  }
  .name {
    margin-top: 8px;
    text-align: center;
    font-size: 14px;
  }
`
