import styled, { css } from 'styled-components'
import { PiPlayDuotone } from 'react-icons/pi'
import { Theme } from '@src/constants'

const StyledPlayIcon = styled(PiPlayDuotone)`
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

const ButtonBarContainer = styled.div`
  box-sizing: border-box;
  display: flex;
  justify-self: end;
  gap: 1rem;
`

export { StyledPlayIcon, ButtonBarContainer }
