import { ButtonBarContainer, StyledPlayIcon } from './styles'
import { IoCloudOffline } from 'react-icons/io5'
import { IoCloudDone } from 'react-icons/io5'
import { Tooltip, IconButton } from '@mui/material'
import { FcGoogle } from 'react-icons/fc'
import { FaUserCircle } from 'react-icons/fa'
import { useAuth } from '../../auth/AuthProvider'
import { redirectToAuth } from '../../util'
// TODO: get his kind of relative path shit out
export default function ButtonBar({
    onRunButton = () => {},
    // TODO: re-evaluate the use of this
    disableRun = false,
}) {
    const { isLoggedIn, userInfo } = useAuth();
    const handleSignIn = async () => redirectToAuth()

    return (
        <ButtonBarContainer>
            <Tooltip title="Run selected scribbler">
                <IconButton>
                    <StyledPlayIcon size={24} onClick={onRunButton} />
                </IconButton>
            </Tooltip>
            {!isLoggedIn && (
                <Tooltip title="Scribblers are saved offline and persist across restart in this browser profile.">
                    <IconButton>
                        <IoCloudOffline size={24} color="red" />
                    </IconButton>
                </Tooltip>
            )}

            {isLoggedIn && (
                <Tooltip title="Scribblers are saved in your google drive in folder 'scribbler'">
                    <IconButton>
                        <IoCloudDone size={24} color="#6CEBB6" />
                    </IconButton>
                </Tooltip>
            )}

            {userInfo && userInfo.email && (
                <Tooltip title={`Signed in as ${userInfo.email}  `}>
                    <IconButton>
                        <FaUserCircle color="green" size={24} />
                    </IconButton>
                </Tooltip>
            )}

            {!isLoggedIn && (
                <Tooltip title="Sign in with google.">
                    <IconButton onClick={handleSignIn}>
                        <FcGoogle size={24} />
                        
                    </IconButton>
                </Tooltip>
            )}
        </ButtonBarContainer>
    )
}
