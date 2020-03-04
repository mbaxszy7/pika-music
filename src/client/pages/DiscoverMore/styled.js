import styled from "styled-components"
import { SpinnerLoading } from "../../../shared/Spinner"
import { PlaceHolderKeyframes } from "../../../shared/PlaceHolderAnimation.styled"
import Label from "../../components/Label"

export const NoData = styled.div`
  text-align: center;
  color: ${props => props.theme.fg};
  margin-top: 40px;
  padding-bottom: 20px;
`

export const StyledSpinnerLoading = styled(SpinnerLoading)`
  & {
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(50%, -50%);
    width: 13px;
    height: 13px;
    z-index: 3;
    margin-right: 4px;
    vertical-align: top;
  }
`

export const DiscoverMorePage = styled.div`
  min-height: 100vh;
  padding: 30px 15px 0 15px;
  overflow: hidden;
`

export const LabelWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  min-height: 160px;
  align-content: flex-start;
`

export const StyledLabel = styled(Label)`
  & {
    position: relative;
    top: initial;
    bottom: initial;
    left: initial;
    right: initial;
  }
`
export const PlaceStyledLabel = styled(StyledLabel)`
  & {
    width: 55px;
    height: 24px;
    margin-top: 12px;
    margin-right: 8px;
    animation: ${PlaceHolderKeyframes} 1.5s infinite;
  }
`

export const StyledLoadingLabel = styled.div`
  margin-top: 12px;
  margin-right: 8px;
  position: relative;
  display: flex;
  align-items: center;
  font-size: 12px;
  padding: 6px 12px;
  border-radius: 200px;
  line-height: 1em;
  transition: all 0.3s;
  background-color: ${props => props.theme.secondary};
  font-weight: 400;
  &[data-selected="true"] {
    transform: scale(1.2);
    margin-left: 10px;
    margin-right: 20px;
    display: block;
  }
`

export const ListWrapper = styled.div`
  margin-top: 30px;
`

export const ListHeader = styled.div`
  display: flex;
  justify-content: space-between;
`

export const Order = styled.span(({ theme, isSelected }) => ({
  color: isSelected ? theme.dg : "black",
  fontSize: 16,
}))

export const Orders = styled.div`
  font-weight: bold;
  margin-right: 30px;
  ${Order} :first-of-type {
    &::after {
      content: " | ";
      color: black;
    }
  }
`

export const ListContent = styled.div`
  margin-top: 20px;
  padding-left: 10px;
  padding-bottom: 40px;
`
