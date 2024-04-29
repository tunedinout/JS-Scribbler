import React, { useEffect, useState } from 'react'
import GoogleSignIn from './GoogleSignIn'
import GoogleDrive from './GoogleDrive'
import { CLIENT_ID } from '../../constants'
import { useGoogleLogin } from '@react-oauth/google'
import { Button } from '@mui/material'
import { styled } from '@mui/material'
import { getExistingSesionObjects } from '../../indexedDB.util'
import { getLogger, redirectToAuth } from '../../util'
import { useNavigate } from 'react-router-dom'

const CornerFixedCustomButton = styled(Button)(() => ({
    position: 'fixed',
    top: 0,
    right: 0,
    zIndex: 10000,
    background: 'white',
}))
const logger = getLogger('GoogleLoginWidget')

export default function GoogleLoginWidget() {
    const [accessToken, setAccessToken] = useState(null)
    // {email, name}
    const [userinfo, setUserinfo] = useState(null)
    const navigate = useNavigate();

    // check if access token already exists or not

    // only then show sign in with google

    useEffect(() => {
        const log = logger(`init UseEffect`)
        const init = async () => {
            // check existing session
            const result = await getExistingSesionObjects()
            log('initial session result array', result)

            if (result.length) {
                const existingSessionObject = result[0]
                const { accessToken, name, email } = existingSessionObject
                setAccessToken(accessToken)
                setUserinfo({ name, email })
            }
        }
        init()
    }, [])

    const handleSignIn = async () => {
        // setAccessToken(token)
        // call the api
        if (!accessToken) {
            redirectToAuth();
        }
    }

    return (
        <div>
            {userinfo && (
                <CornerFixedCustomButton>
                    <span
                        className="button-auth"
                        style={{ color: 'white', border: '1px solid white' }}
                    >
                        ${userinfo.name} ${userinfo.email}
                    </span>
                </CornerFixedCustomButton>
            )}
            {!userinfo && (
                <CornerFixedCustomButton
                    className="button-auth"
                    onClick={handleSignIn}
                    variant="primary"
                >
                    Sign in with Google
                </CornerFixedCustomButton>
            )}
        </div>
    )
}
