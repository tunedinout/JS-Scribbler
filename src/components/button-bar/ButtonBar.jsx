import React from 'react'
import { ButtonBarContainer, StyledPlayIcon } from './styles'
// TODO: get his kind of relative path shit out

export default function ButtonBar({
    onRunButton = () => {},
    disableRun = false,
}) {
    return (
        <ButtonBarContainer>
                <StyledPlayIcon onClick={onRunButton} />
        </ButtonBarContainer>
    )
}
