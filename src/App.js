import React, { useCallback, useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { runCode } from './indexedDB.util'
import './App.css'
import Oauth2Callback from './pages/Oauth2Callback'
import HomePage from './pages/HomePage'
import { getLogger, getLoginDetails } from './util'
import { createDriveAppFolder, refreshAccessToken } from './api'


const logger = getLogger('APP')
function App() {
    const [driveFolderId, setDriveFolderId] = useState(null)
    const [accessToken, setAccessToken] = useState('')
    const [expiryDate, setExpiryDate] = useState(0)
    const [refreshToken, setRefreshToken] = useState('')

    useEffect(() => {
        logger(`access token effect`)(`accessToken`, accessToken)
    }, [accessToken])

    const oauth2CallbackHandler = ({
        accessToken,
        expiryDate,
        refreshToken,
    }) => {
        setAccessToken(accessToken)
        setRefreshToken(refreshToken)
        setExpiryDate(expiryDate)
    }

    useEffect(() => {
        const loadAuthDetails = async () => {
            const log = logger(`loadAuthDetails`)
            // this redirect to auth URL if the tokens are not defined
            // or not set
            const loginResponse = await getLoginDetails()
            log(`loginResponse`, loginResponse)

            // if there is nothing in the indexeddb i.e login details
            // ususally the first time login
            // at this time - loginResponse is undefined

            if (!loginResponse || loginResponse?.message) {
                // handle the errors
                return
            }
            const { accessToken, refreshToken, expiryDate } = loginResponse

            setAccessToken(accessToken)
            setRefreshToken(refreshToken)
            setExpiryDate(expiryDate)
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
                    } = await refreshAccessToken(refreshToken)
                    setAccessToken(accessToken)
                    setRefreshToken(newRefreshToken)
                    setExpiryDate(expiryDate)
                },
                Math.max(expiryDate - Date.now(), 0)
            )

            return () => clearTimeout(timer)
        }
    }, [expiryDate, refreshToken])

    useEffect(() => {
        // this should only run once i.e the first time accessToken is set
        if (!driveFolderId && accessToken) {
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
                            }}
                        />
                    }
                />
            </Routes>
        </Router>
    )
}

export default App
