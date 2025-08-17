import { ButtonBarContainer, StyledPlayIcon } from './styles'
import { IconButton } from '@mui/material'
import { FcGoogle } from 'react-icons/fc'
import { FaUserCircle } from 'react-icons/fa'
import { useAuth } from '@auth/AuthProvider'
import { redirectToAuth } from '@src/util'
import PropTypes from 'prop-types'
import { Tooltip } from '@src/core-components/tooltip'
import { Button } from '../styled.global'
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
            <FcGoogle size={16} />
            <span>Log In</span>
          </Button>
        </Tooltip>
      )}
    </ButtonBarContainer>
  )
}

ButtonBar.propTypes = {
  onRunButton: PropTypes.func,
}
