import React, { useCallback, useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { runCode } from './indexedDB.util'
import './App.css'
import Oauth2Callback from './pages/Oauth2Callback'
import HomePage from './pages/HomePage'
import { getLogger, getLoginDetails, redirectToAuth } from './util'
import { createDriveAppFolder, refreshAccessToken } from './api'
import { AuthProvider } from './auth/AuthProvider'

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

    // useEffect(() => {
    //     // assume expiry date is only defined
    //     if (expiryDate && refreshToken) {
    //         const timer = setTimeout(
    //             async () => {
    //                 const {
    //                     accessToken,
    //                     refreshToken: newRefreshToken,
    //                     expiryDate,
    //                     name,
    //                     email,
    //                 } = await refreshAccessToken(refreshToken)
    //                 setAccessToken(accessToken)
    //                 setRefreshToken(newRefreshToken)
    //                 setExpiryDate(expiryDate)
    //                 // TODO: we dont need to really do this
    //                 setUserInfo({ name, email })
    //             },
    //             Math.max(expiryDate - Date.now(), 0)
    //         )

    //         return () => clearTimeout(timer)
    //     }
    // }, [expiryDate, refreshToken])

   

    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route
                        path="/oauth2callback"
                        element={
                            <Oauth2Callback />
                        }
                    />
                    <Route
                        path="/"
                        element={
                            <HomePage
                            />
                        }
                    />
                </Routes>
            </Router>
        </AuthProvider>
    )
}

export default App
