import { Theme } from '@src/constants'
import styled, { css } from 'styled-components'

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

const CommonButtonStyles = css`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
  margin: 8px;
  border-radius: 4px;
  box-sizing: border-box;

  /* Hover styles */
  &:hover {
    /* Add your hover styles here */
    background-color: rgba(211, 211, 211, 0.8);
  }

  /* Active styles */
  &:active {
    /* Add your active styles here */
  }

  /* Disabled styles */
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    /* Add your disabled styles here */
    box-shadow: none;
  }
`

export { CommonButtonStyles, Button }
