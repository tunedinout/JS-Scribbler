import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { sendAuthCode } from '../api'
import { getLogger } from '../util'
import { getExistingSesionObjects, storeSessionObject } from '../indexedDB.util'
const logger = getLogger('Oauth2Callback')

// collects access token and saves to indexedDb
export default function Oauth2Callback({ oauth2CallbackHandler}) {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const [isRedirectToHome, setIsRedirectToHome] = useState(false)
    // console.log(searchParams);
    const code = searchParams.get('code')
    const initRef = useRef(null)
    useEffect(() => {
        const log = logger(`init UseEffect`)
        const init = async () => {
            if (!code) return
            if (!initRef.current) initRef.current = 'init'
            else {
                const tokenResponse = await sendAuthCode(code)
                log('tokenResponse obj send auth code', tokenResponse)
                if (!tokenResponse?.message) {
                    // if session object is not in indexed DB
                    const currentSesions = await getExistingSesionObjects()
                    const {
                        accessToken,
                        email,
                        name,
                        refreshToken,
                        expiryDate,
                    } = tokenResponse
                    if (!currentSesions.length || !currentSesions[0]?.accessToken || !currentSesions[0]?.refreshToken) {
                        log(`stored session object`)
                        await storeSessionObject({
                            accessToken,
                            email,
                            name,
                            refreshToken,
                            expiryDate,
                        })
                        // call the handler to set the login deets
                        oauth2CallbackHandler({accessToken, refreshToken, expiryDate,name,email})
                        
                    }
                }

                setIsRedirectToHome(true)
            }
        }
        init()
    }, [initRef, code])

    useEffect(() => {
        if (isRedirectToHome) {
            navigate('/')
        }
    }, [isRedirectToHome])

    return (
        <div>
            <h1>Processing...</h1>
            {/* You can show a loading spinner or message here */}
        </div>
    )
}
