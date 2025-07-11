import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react'
import { fetchCurrentUser, refreshAccessToken } from '../api'
import { clearExistingSessionObject, storeSessionObject } from '../indexedDB.util'
import { getLogger, getLoginDetails, redirectToAuth } from '../util'

const AuthContext = createContext(null)

export const useAuth = () => useContext(AuthContext)

const logger = getLogger(`AUTH-PROVIDER`)
export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userInfo, setUserInfo] = useState(null);
    useEffect(() => {
        //TODO: add the call to fetch me
        const log = logger(`fetching me...`)
        const controller = new AbortController();
        fetchCurrentUser(controller.signal)
        .then(({data: user}) => {
            log(`user`, user)
            setUserInfo(user)
        })
        .then(() => setIsLoggedIn(true))
        .catch( error => {
            log(`error:`, error)
            setIsLoggedIn(false);
            setUserInfo(null)
        })
        return () => controller.abort();
    },[])

    return (
        <AuthContext.Provider
            value={{
                // Any API that gets 401 returned
               isLoggedIn,
               userInfo
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}
