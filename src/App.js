import React, { useCallback, useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import {
    getExistingSesionObjects,
    runCode,
    updateSessionObject,
} from './indexedDB.util'
import './App.css'
import Oauth2Callback from './pages/Oauth2Callback'
import HomePage from './pages/HomePage'
import { getLogger, redirectToAuth } from './util'

/*
TODOS: 
--------

Add Grid layout

once indexdb is being used for most file storage needs 
// is there a way to include cache

*/
const logger = getLogger('APP')
function App() {
    const [code, setCode] = useState('')
    const [isCompilationError, setIsCompilationError] = useState(false)
    const [runtimeError, setRuntimeError] = useState(null)
    const [isRun, SetIsRun] = useState(false)
    const [backupDriveFolderId, setBackupDriveFolderId] = useState(null)

    useEffect(() => {
        if (isRun) {
            try {
                runCode(code)
            } catch (error) {
                setRuntimeError(error)
                console.error(`error occured after running code`, error)
            } finally {
                SetIsRun(false)
            }
        }
    }, [code, isRun])

    const handleRunClick = function () {
        if (!isCompilationError) {
            SetIsRun(true)
        }
    }
    function onCodeChange(__code, isError) {
        setCode(__code)
        setIsCompilationError(isError)
    }
    function onFileChange() {
        setRuntimeError(null)
    }

    async function loadFiles(folderId) {
        const log = logger(`loadFiles`);
        log(`folderId`, folderId)
        const result = await getExistingSesionObjects();
        const { accessToken } = result[0];
        const response =   await fetch(`http://localhost:3000/drive/load-files`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                accessToken,
                folderId
            })
        });
        const filesData = await response.json();
        log(`filesdata`,filesData);

    }

    const handleSession = useCallback(async () => {
        const log = logger(`handleSession - inline fn`)
        //add session handler
        const result = await getExistingSesionObjects()
        if (result.length) {
            log('handleSession - result', result)
            // session obj at 0
            const {
                accessToken,
                refreshToken: existingRefreshToken,
                email,
                name,
                expiryDate,
            } = result[0]

            if (!(accessToken || existingRefreshToken)) {
                log(`redirect to Auth block`)
                await redirectToAuth()
                return
            }

            // token is expired refresh token
            if (expiryDate < Date.now()) {
                setBackupDriveFolderId(null)
                const response = await fetch(
                    `http://localhost:3000/auth/google/refresh`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            refreshToken: existingRefreshToken,
                            email,
                        }),
                    }
                )
                const jsonResponse = await response.json()
                const {
                    accessToken,
                    refreshToken,
                    idToken,
                    expiryDate,
                    type = 'Bearer',
                } = jsonResponse
                // lets update session
                await updateSessionObject(
                    accessToken,
                    idToken,
                    expiryDate,
                    refreshToken,
                    email
                )
                log(`refreshEndPoint`, jsonResponse)
            } else {
                log(`backupDriveFolder`, backupDriveFolderId)
                if (backupDriveFolderId) return
                // get current session object
                const response = await fetch(
                    `http://localhost:3000/drive/create/folder`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            accessToken,
                        }),
                    }
                )
                // get the id of the created / existing folder
                const jsonResponse = await response.json()
                const { id } = jsonResponse
                setBackupDriveFolderId(id)
                // save current file in drie

                log('jsonResponse', jsonResponse)
            }
        } else {
            // redirect to auth

            redirectToAuth()
        }
    }, [backupDriveFolderId])

    useEffect(() => {
       const id =  setInterval(handleSession, 10000)
        return () => clearInterval(id)
    }, [handleSession])

    useEffect(() => {
        if(backupDriveFolderId) {
            loadFiles(backupDriveFolderId);
        }
    }, [backupDriveFolderId])
    return (
        <Router>
            <Routes>
                <Route path="/oauth2callback" element={<Oauth2Callback />} />
                <Route
                    path="/"
                    element={
                        <HomePage
                            {...{
                                handleRunClick,
                                onCodeChange,
                                onFileChange,
                                isCompilationError,
                                runtimeError,
                                code,
                                driveFolderId: backupDriveFolderId,
                            }}
                        />
                    }
                />
            </Routes>
        </Router>
    )
}

export default App
