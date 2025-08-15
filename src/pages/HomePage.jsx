import { useState } from 'react'
import ButtonBar from '../components/button-bar/ButtonBar'
import {
  Header,
  HomePageContainer,
  HamburgerMenuOn,
  LogoText,
  HamburgerMenuOff,
  Main,
  Logo,
} from './homepage.styles'
import ScribblesExplorer from '@src/core-components/file-explorer/Explorer'
import CodingPad from '@src/components/coding-pad/CodingPad'
import { useAuth } from '@src/auth/AuthProvider'
import { IconButton } from '@mui/material'
import { HiMiniInformationCircle } from 'react-icons/hi2'
import { Tooltip } from '@src/core-components/tooltip'

export default function HomePage() {
  const [isRun, setIsRun] = useState(false)
  const [currentEditDetails, setCurrentEditDetails] = useState(null)
  const [navOpen, setNavOpen] = useState(false)
  const [scribbles, setScribbles] = useState([])
  const { isLoggedIn } = useAuth()
  return (
    <HomePageContainer>
      {/* <div style={{ width: '100%', height: '12px' }}>
        {autoSaving && <LinearProgress style={{ backgroundColor: 'none' }} />}
      </div> */}

      {/* {loading && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'fixed',
            width: '100%',
            height: '100%',
            zIndex: 10,
            top: 0,
            left: 0,
            background: '#fcfcfc',
            opacity: '0.4',
          }}
        >
          <CircularProgress about="fsdfsdfs" />
          <div>Please wait loading scribblers....</div>
        </div>
      )} */}
      <Header>
        {navOpen && (
          <HamburgerMenuOff size={24} onClick={() => setNavOpen(!navOpen)} />
        )}
        {!navOpen && (
          <HamburgerMenuOn size={24} onClick={() => setNavOpen(!navOpen)} />
        )}
        <Logo>
          <LogoText>Scribbler</LogoText>
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
                  size={16}
                  color={isLoggedIn ? '#5decbf' : '#e96976ff'}
                />
              </IconButton>
            </Tooltip>
          }
        </Logo>

        <ButtonBar
          {...{
            onRunButton: () => setIsRun(true),
          }}
        />
      </Header>
      {/* <div className="scribbler-js-tab-container__file-explorer"> */}
      <Main navOpen={navOpen}>
        <ScribblesExplorer
          scribbles={scribbles}
          setScribbles={setScribbles}
          currentEditDetails={currentEditDetails}
          setCurrentEditDetails={(val) => {
            setCurrentEditDetails(val)
            setIsRun(false)
          }}
        />
        {/* </div> */}

        {currentEditDetails && (
          <CodingPad
            {...{
              isRun,
              currentEditDetails,
            }}
          />
        )}
      </Main>
    </HomePageContainer>
  )
}
