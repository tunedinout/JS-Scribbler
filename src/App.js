import React, { useCallback, useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { runCode } from './indexedDB.util'
import './App.css'
import Oauth2Callback from './pages/Oauth2Callback'
import HomePage from './pages/HomePage'
import { getLogger, getLoginDetails, redirectToAuth } from './util'
import { createDriveAppFolder, refreshAccessToken } from './api'

const logger = getLogger('APP')
function App() {
    const [driveFolderId, setDriveFolderId] = useState(null)
    const [accessToken, setAccessToken] = useState('')
    const [expiryDate, setExpiryDate] = useState(0)
    const [refreshToken, setRefreshToken] = useState('')
    const [userInfo, setUserInfo] = useState(null)

    useEffect(() => {
        logger(`User Info effect`)(`userInfo`, userInfo)
    }, [userInfo])

    const oauth2CallbackHandler = ({
        accessToken,
        expiryDate,
        refreshToken,
        name,
        email,
    }) => {
        setAccessToken(accessToken)
        setRefreshToken(refreshToken)
        setExpiryDate(expiryDate);
        setUserInfo({name, email})

    }

    useEffect(() => {
        const loadAuthDetails = async () => {
            const log = logger(`loadAuthDetails`)

            const loginResponse = await getLoginDetails()
            log(`loginResponse`, loginResponse)

            // if user has not signed in (offline mode)
            // loginResponse is null

            if (!loginResponse || loginResponse?.message) {
                // handle the errors
                return
            }
            const { accessToken, refreshToken, expiryDate, name, email } =
                loginResponse

            setAccessToken(accessToken)
            setRefreshToken(refreshToken)
            setExpiryDate(expiryDate)
            setUserInfo({ name, email })
        }

        loadAuthDetails()
    }, [])

    useEffect(() => {
        // assume expiry date is only defined
        if (expiryDate && refreshToken) {
            const timer = setTimeout(
                async () => {
                    const {
                        accessToken,
                        refreshToken: newRefreshToken,
                        expiryDate,
                        name,
                        email,
                    } = await refreshAccessToken(refreshToken)
                    setAccessToken(accessToken)
                    setRefreshToken(newRefreshToken)
                    setExpiryDate(expiryDate)
                    // TODO: we dont need to really do this
                    setUserInfo({ name, email })
                },
                Math.max(expiryDate - Date.now(), 0)
            )

            return () => clearTimeout(timer)
        }
    }, [expiryDate, refreshToken])

    useEffect(() => {
        // this should only run once i.e the first time accessToken is set
        if (!driveFolderId && accessToken) {
            // create a folder called esfiddle in google drive
            const createAppFolder = async () => {
                const log = logger(`createAppFolder`)
                const folderCreateResponse =
                    await createDriveAppFolder(accessToken)
                log(`folderCreateResponse -> `, folderCreateResponse)
                if (!folderCreateResponse?.message) {
                    log(`received esfiddle folderid`, folderCreateResponse?.id)
                    setDriveFolderId(folderCreateResponse?.id)
                } else {
                    // user is shown the error
                    return
                }
            }
            createAppFolder()
        }
    }, [driveFolderId, accessToken])

    const handleSignIn = async () => {
        // setAccessToken(token)
        // call the api
        if (!accessToken) {
            redirectToAuth()
        }
    }

    return (
        <Router>
            <Routes>
                <Route
                    path="/oauth2callback"
                    element={<Oauth2Callback {...{ oauth2CallbackHandler }} />}
                />
                <Route
                    path="/"
                    element={
                        <HomePage
                            {...{
                                driveFolderId,
                                accessToken,
                                handleSignIn,
                                userInfo,
                            }}
                        />
                    }
                />
            </Routes>
        </Router>
    )
}

export default App
