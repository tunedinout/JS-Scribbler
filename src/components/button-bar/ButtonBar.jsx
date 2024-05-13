import React from 'react'
import { ButtonBarContainer, StyledPlayIcon } from './styles'
import { IoCloudOffline } from "react-icons/io5";
import { IoCloudDone } from "react-icons/io5";
// TODO: get his kind of relative path shit out

export default function ButtonBar({
    onRunButton = () => {},
    disableRun = false,
    isOfflineMode = false,
}) {
    return (
        <ButtonBarContainer>
                <StyledPlayIcon onClick={onRunButton} />
                {isOfflineMode && <IoCloudOffline size={16} color='red' />}
                {!isOfflineMode && <IoCloudDone size={16} color='#6CEBB6' />}
        </ButtonBarContainer>
    )
}
