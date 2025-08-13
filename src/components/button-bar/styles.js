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
const Button = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  box-shadow: 0;
  width: 6rem;
  height: 2.5rem;
  box-sizing: border-box;
  outline: none;
  font-family: ${Theme.fontFamily};
  background: ${Theme.primaryButtonColor};
  border-radius: 0.5rem;
  cursor: pointer;
  appearance: button;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  &:active {
    box-shadow: 0 2px 3px rgba(0, 0, 0, 0.2);
    transform: translateY(2px);
  }
`
const ButtonBarContainer = styled.div`
  box-sizing: border-box;
  display: flex;
  justify-self: end;
  gap: 1rem;
`

export { StyledPlayIcon, ButtonBarContainer, Button }
