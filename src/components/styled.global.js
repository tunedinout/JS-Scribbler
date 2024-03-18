import { css } from 'styled-components'

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

export { CommonButtonStyles }
