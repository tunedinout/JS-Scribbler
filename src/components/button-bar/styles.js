import styled, { css } from 'styled-components';
import { FiPlay } from 'react-icons/fi';
import { CommonButtonStyles } from '../styled.global';

const StyledPlayIcon = styled(FiPlay)`
    ${CommonButtonStyles}
    color: #00794A;
    font-size: 16px;
    cursor: pointer;
    fill: #00794A;

    ${({ disabled }) => disabled && css`
        opacity: 0.5;
        cursor: not-allowed;
    `}
`;

const ButtonBarContainer = styled.div`
    color: white;
    position: fixed;
    height: 40px;
    width: fit-content;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    padding-left: 8px;
    z-index: 10;
`;

export {StyledPlayIcon, ButtonBarContainer}