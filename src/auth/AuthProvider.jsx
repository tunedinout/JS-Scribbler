import React, {
    createContext,
    useContext,
    useEffect,
    useState,
} from 'react'
import { fetchMe } from '../api'
import { getLogger } from '../util'
import PropTypes from 'prop-types'

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
        fetchMe(controller.signal)
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
AuthProvider.propTypes = {
    children: PropTypes.node
}