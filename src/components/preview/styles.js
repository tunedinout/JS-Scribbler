import { Theme } from '@src/constants'
import styled from 'styled-components'

export const IFrame = styled.iframe`
  border: none;
  outline: none;
  background: ${Theme.codeEditor.previewBgColor};
  height: 100%;
  width: 100%;
`

export const IFrameContainer = styled.div`
  border-left: 2px solid #211f1f;
`
