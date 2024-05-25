import React from 'react'
import { ButtonBarContainer, StyledPlayIcon } from './styles'
import { IoCloudOffline } from 'react-icons/io5'
import { IoCloudDone } from 'react-icons/io5'
import { Tooltip, IconButton } from '@mui/material'
import { FcGoogle } from 'react-icons/fc'
import { FaSignInAlt, FaUserCircle } from 'react-icons/fa'
// TODO: get his kind of relative path shit out

export default function ButtonBar({
    onRunButton = () => {},
    disableRun = false,
    isOfflineMode = false,
    handleSignIn,
    userInfo,
}) {
    return (
        <ButtonBarContainer>
            <Tooltip title="Run selected fiddle">
                <IconButton>
                    <StyledPlayIcon onClick={onRunButton} />
                </IconButton>
            </Tooltip>
            {isOfflineMode && (
                <Tooltip title="Fiddles are saved offline and persist across restart in this browser profile.">
                    <IconButton>
                        <IoCloudOffline size={16} color="red" />
                    </IconButton>
                </Tooltip>
            )}

            {!isOfflineMode && (
                <Tooltip title="Fiddles are saved in your google drive in folder 'esfiddle'">
                    <IconButton>
                        <IoCloudDone size={16} color="#6CEBB6" />
                    </IconButton>
                </Tooltip>
            )}

            {userInfo && userInfo.email && (
                <Tooltip title={`Signed in as ${userInfo.email}  `}>
                    <IconButton>
                        <FaUserCircle color="green" size={16} />
                    </IconButton>
                </Tooltip>
            )}

            {!userInfo?.email && (
                <Tooltip title="Sign in with google.">
                    <IconButton onClick={handleSignIn}>
                        <FcGoogle size={16} />
                        <FaSignInAlt size={10} color="white" />
                    </IconButton>
                </Tooltip>
            )}
        </ButtonBarContainer>
    )
}
