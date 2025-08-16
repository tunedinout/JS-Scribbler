// does not need a react component
import { Theme } from '@src/constants'
import styled from 'styled-components'
const TooltipElement = styled.div`
  font-family: ${Theme.fontFamily};
  font-size: 12px;
  background-color: ${Theme.HighlightColor};
  color: ${Theme.fontColor};
  padding: ${(props) => (!props.isHover ? 0 : '4px 8px')};
  border-radius: ${(props) => (!props.isHover ? 0 : '4px')};
  position: fixed;
  z-index: 1000000000;
  max-width: ${(props) => (!props.isHover ? 0 : '350px')};
  max-height: ${(props) => (!props.isHover ? 0 : 'fit-content')};
  white-space: normal;
  word-wrap: break-word;
  box-sizing: border-box;
  top: ${(props) => props?.location?.top || 0}px;
  left: ${(props) => props?.location?.left || 0}px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`

const TooltipChildrenContainer = styled.div`
  // width: max-content;
  // height: max-content;
  padding: 4px;
`

export { TooltipElement, TooltipChildrenContainer }
