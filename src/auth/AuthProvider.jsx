import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react'
import { refreshAccessToken } from '../api'
import { clearExistingSessionObject, storeSessionObject } from '../indexedDB.util'
import { getLogger, getLoginDetails, redirectToAuth } from '../util'

const AuthContext = createContext(null)

export const useAuth = () => useContext(AuthContext)

const logger = getLogger(`AUTH-PROVIDER`)
export const AuthProvider = ({ children }) => {
    const [isRefreshTokenFailed, setIsRefreshTokenFailed] = useState(false)
    const [isAccessTokenExpired, setIsAccessTokenExpired] = useState(false)
    const [accessToken, setAccessToken] = useState(null)
    const [refreshToken, setRefreshToken] = useState(null)
    const [userInfo, setUserInfo] = useState(null)

    useEffect(() => {
        // checks in the indexedDB if any access Token is available or not
        const loadAuthDetails = async () => {
            const log = logger(`loadAuthDetails`)

            const loginResponse = await getLoginDetails()
            log(`loginResponse`, loginResponse)

            // if user has not signed in (offline mode)
            // loginResponse is null

            if (!loginResponse || loginResponse?.message) {
                // if both are true it is offline mode
                setIsRefreshTokenFailed(true)
                setIsAccessTokenExpired(true)
                return
            }
            const { accessToken, refreshToken, name, email } = loginResponse

            setAccessToken(accessToken)
            setRefreshToken(refreshToken)
            setUserInfo({ name, email })
        }
        // TODO: enable after review
        loadAuthDetails()
    }, [])

    useEffect(() => {
       
        if (isAccessTokenExpired && !isRefreshTokenFailed) {
            const loadTokens = async () => {
                const log = logger(`loadTokens invoked`)
                const response = await refreshAccessToken(refreshToken)
                log(`refresh token response`, response)
                if (!response.message) {
                    const {
                        accessToken,
                        refreshToken: newRefreshToken,
                        name,
                        email,
                    } = response

                    // this method will delete any existing tokens
                    await storeSessionObject({
                        accessToken,
                        email,
                        name,
                        refreshToken,
                    })
                    // session stored in indexedDB
                    setAccessToken(accessToken)
                    setIsAccessTokenExpired(false);
                    setIsRefreshTokenFailed(false)
                    setRefreshToken(newRefreshToken)
                    // TODO: we dont need to really do this
                    setUserInfo({ name, email })
                } else {
                    //TODO: set to offlineMode
                    // accesstoken is already expired
                    // refreshTokenFailed = true will make it offline mode
                    setIsRefreshTokenFailed(true)
                    setIsAccessTokenExpired(true);
                }
            }
            loadTokens()
        }
        if (isAccessTokenExpired && isRefreshTokenFailed) {
            setAccessToken(null)
            setRefreshToken(null)
            setUserInfo(null)
            // nothing much do here
            // users work continues to be saved
            // in offline mode
            // let the user try to sign in if they want
            // show them some sort of a notification that makes them aware
            // of thier offline status
        }
    }, [isAccessTokenExpired, isRefreshTokenFailed])

    const oauth2CallbackHandler = useCallback(
        ({ accessToken, refreshToken, name, email }) => {
            setAccessToken(accessToken)
            setRefreshToken(refreshToken)
            setUserInfo({ name, email })
        }
    )

    const handleSignIn = useCallback(async () => {
        // setAccessToken(token)
        // call the api
        if (!accessToken) {
            await clearExistingSessionObject();
            redirectToAuth()
        }
    }, [accessToken])

    const invalidateAccessToken = useCallback(() => {
        const log = logger(`invalidateAccessToken`)
        log(`accessToken invalidated`)
        setAccessToken(null)
        setIsAccessTokenExpired(true)
        setIsRefreshTokenFailed(() => false);
        // call reresh token endpoint and store in indexedDB
    },[])

    return (
        <AuthContext.Provider
            value={{
                // Any API that gets 401 returned
                mode: Boolean(accessToken) ? 'online' : 'offline',
                invalidateAccessToken,
                accessToken,
                refreshToken,
                userInfo,
                oauth2CallbackHandler,
                handleSignIn,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}
