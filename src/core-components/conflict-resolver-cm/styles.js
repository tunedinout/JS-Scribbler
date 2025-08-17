import { Theme } from '@src/constants'
import styled, { css } from 'styled-components'
import { FaCheck, FaArrowLeft } from 'react-icons/fa'
import { ImCross } from 'react-icons/im'

export const DifferContainer = styled.div`
  width: inherit;
  height: ${(props) => props.height}px;
  font-family: ${Theme.fontFamily};
  background: ${Theme.codeEditor.editorBgColor};
  overflow: auto;
  font-size: 14px;

  button {
    color: white;
    font-size: 1.2rem;
    height: 20px;
    width: 30px;
  }
  .ͼ4 .cm-line ::selection,
  .ͼ4 .cm-line::selection {
    background-color: #003d73 !important;
  }

  // .cm-content::selection {
  //   background-color: red !important;
  // }

  .cm-content {
    background: ${Theme.codeEditor.editorBgColor};
    color: ${Theme.fontColor};
  }
  .cm-gutters {
    background: ${Theme.codeEditor.editorBgColor};
  }
  .cm-merge-revert {
    background-color: ${Theme.secondaryColor};
  }
  .cm-deletedLine .cm-changedText {
    background: ${Theme.codeEditor.diffRed};
  }
  .cm-changedLine .cm-insertedLine .cm-changedText {
    background: ${Theme.codeEditor.diffGreen};
  }
`

export const SaveUpstream = styled(FaCheck)`
  color: ${Theme.playColor};
  font-size: 18px;
  cursor: pointer;
  fill: ${Theme.playColor};

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.5;
      cursor: not-allowed;
    `}
`

export const LeftArrow = styled(FaArrowLeft)`
  z-index: 100;
`

export const RejectCurrent = styled(ImCross)`
  color: ${Theme.danger};
  font-size: 18px;
  cursor: pointer;
  fill: ${Theme.danger};

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.5;
      cursor: not-allowed;
    `}
`
