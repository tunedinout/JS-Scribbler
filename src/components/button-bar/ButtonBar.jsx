import React, { useEffect } from 'react'
import { ButtonBarContainer, StyledPlayIcon } from './styles'
import { IoCloudOffline } from 'react-icons/io5'
import { IoCloudDone } from 'react-icons/io5'
import { Tooltip, IconButton } from '@mui/material'
import { FcGoogle } from 'react-icons/fc'
import { FaSignInAlt, FaUserCircle } from 'react-icons/fa'
import { useAuth } from '../../auth/AuthProvider'
import { getLogger } from '../../util'
// TODO: get his kind of relative path shit out
const logger = getLogger(`ButtonBAR`)
export default function ButtonBar({
    onRunButton = () => {},
    // TODO: re-evaluate the use of this
    disableRun = false,
}) {
    const { mode, userInfo, handleSignIn } = useAuth();

    useEffect(() => {
        logger(`mode effect`)(`mode => `, mode);
    }, [mode])
    return (
        <ButtonBarContainer>
            <Tooltip title="Run selected scribbler">
                <IconButton>
                    <StyledPlayIcon onClick={onRunButton} />
                </IconButton>
            </Tooltip>
            {mode === 'offline' && (
                <Tooltip title="Scribblers are saved offline and persist across restart in this browser profile.">
                    <IconButton>
                        <IoCloudOffline size={16} color="red" />
                    </IconButton>
                </Tooltip>
            )}

            {mode === 'online' && (
                <Tooltip title="Scribblers are saved in your google drive in folder 'scribbler'">
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
                        
                    </IconButton>
                </Tooltip>
            )}
        </ButtonBarContainer>
    )
}
