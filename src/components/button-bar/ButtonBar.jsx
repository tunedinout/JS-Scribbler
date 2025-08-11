import { ButtonBarContainer, Button, StyledPlayIcon } from './styles'
import { Tooltip, IconButton } from '@mui/material'
import { FcGoogle } from 'react-icons/fc'
import { FaUserCircle } from 'react-icons/fa'
import { useAuth } from '@auth/AuthProvider'
import { redirectToAuth } from '@src/util'
import PropTypes from 'prop-types'
import { HiMiniInformationCircle } from 'react-icons/hi2'
// TODO: get his kind of relative path shit out
export default function ButtonBar({ onRunButton = () => {} }) {
  const { isLoggedIn, userInfo } = useAuth()
  const handleSignIn = async () => redirectToAuth()

  return (
    <ButtonBarContainer>
      <Tooltip title="Run selected scribbler">
        <Button onClick={onRunButton}>
          <StyledPlayIcon size={24} />
          <span>Run</span>
        </Button>
      </Tooltip>

      {/* {isLoggedIn && (
        <Tooltip title="Scribblers are saved in your google drive in folder 'scribbler'">
          <IconButton>
            <IoCloudDone size={24} color="#6CEBB6" />
          </IconButton>
        </Tooltip>
      )} */}

      {userInfo && userInfo.email && (
        <Tooltip title={`Signed in as ${userInfo.email}  `}>
          <IconButton>
            <FaUserCircle color="green" size={24} />
          </IconButton>
        </Tooltip>
      )}

      {!isLoggedIn && (
        <Tooltip title="Sign in with google.">
          <Button onClick={handleSignIn}>
            <FcGoogle size={24} />
            <span>Log In</span>
          </Button>
        </Tooltip>
      )}

      {
        <Tooltip
          title={
            isLoggedIn
              ? "Scribblers are saved in your google drive in folder 'scribbler'"
              : 'Scribblers are saved offline and persist across restart in this browser profile.'
          }
        >
          <IconButton>
            <HiMiniInformationCircle
              size={24}
              color={isLoggedIn ? '#5decbf' : 'red'}
            />
          </IconButton>
        </Tooltip>
      }
    </ButtonBarContainer>
  )
}

ButtonBar.propTypes = {
  onRunButton: PropTypes.func,
}
