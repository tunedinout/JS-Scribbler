// NOTE: GENERAL format of error response handling
// will help us by checking the res.message for errors

import { axiosRetry, fetchRetry, getLogger } from './util'
import axios from 'axios'

// and handle that directly in the calling code
const logger = getLogger(`API.JS`)
export async function sendAuthCode(authCode) {
    try {
        const response = await fetch('http://localhost:3000/auth/google', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ authCode }),
        })
        const res = await response.json()
        console.log(res)
        return res
    } catch ({ response }) {
        // TODO: carefully evaluate why we do this
        return {
            message:
                response?.data?.message ||
                response?.data ||
                'Unable to send access token',
        }
    }
}

export async function getAuthURL() {
    try {
        const response = await fetch('http://localhost:3000/auth/google', {
            method: 'GET',
            headers: {
                // TODO: do we need this
                'Access-Control-Allow-Origin': '*',
            },
        })
        const authObj = await response.json()
        return authObj
    } catch ({ response }) {
        // TODO: carefully evaluate why we do this
        return {
            message:
                response?.data?.message ||
                response?.data ||
                'Unable to get AUTH url',
            ...response,
        }
    }
}

/**
 * R
 * @param {String} existingRefreshToken
 * @returns response object
 */
export async function refreshAccessToken(existingRefreshToken) {
    try {
        const response = await axiosRetry({
            url: `http://localhost:3000/auth/google/refresh`,
            method: 'POST',
            withCredentials: true,
            data: {
                refreshToken: existingRefreshToken,
            },
        })

        const { accessToken, refreshToken, expiryDate, name, email } = response.data
        return {
            accessToken,
            refreshToken,
            expiryDate,
            name,
            email,
        }
    } catch (error) {
        const { response } = error
        // TODO: carefully evaluate why we do this
        return {
            message:
                response?.data?.message ||
                response?.data ||
                'Unable to refresh accessToken',
            ...response,
        }
    }
}


export async function createDriveAppFolder(accessToken) {
    const log = logger(`createDriveAppFolder`)
    try {
        const response = await axios({
            url: `http://localhost:3000/drive/create/folder`,
            method: 'POST',
            withCredentials: true,
        })

        return response
    } catch ({ response }) {
        // TODO: carefully evaluate why we do this
        console.log(`error response while creating app folder`, response)
        return {
            message:
                response?.data?.message ||
                response?.data ||
                'Unable to create app folder.',
            ...response,
        }
    }
}

/**
 *
 * @param {String} accessToken
 * @param {String} scribblerFolderId
 * @returns an array of {id,name} - of existing js-scribbler sessions
 */
export async function fetchExistingScribblerSessions(
    scribblerFolderId
) {
    const log = logger(`fetchExistingScribblerSessions`);
    try {
        const response = await axios({
            url: `http://localhost:3000/drive/folder/sessions?scribblerFolderId=${scribblerFolderId}`,
            method: 'GET',
            withCredentials: true,
        })
        return response
    } catch ({ response }) {
        log(`response`, response)
        return {
            message:
                response?.data?.message ||
                response?.data ||
                'Unable to get existing js-scribbler sessions.',
            ...response,
        }
    }
}

/**
 *
 * @param {String} accessToken
 * @param {String} scribblerFolderId
 * @returns an array of {mimeType,id,data} - of each css, js and html file
 */
export async function fetchExistingScribblerSession( scribblerSessionId) {
    try {
        const response = await axios({
            url: `http://localhost:3000/drive/folder/sessions/${scribblerSessionId}`,
            method: 'GET',
            withCredentials: true,
        })
        return response
    } catch ({ response }) {
        return {
            message:
                response?.data?.message ||
                response?.data ||
                'Unable to get existing js-scribbler sessions.',
            ...response,
        }
    }
}


export async function createScribblerSession(
    driveFolderId,
    {
        name = '', js = '', css = '', html = ''
    }
) {
    try {
        const response = await axios({
            url: `http://localhost:3000/drive/folder/session`,
            method: 'POST',
            withCredentials: true,
            data: {
                scribblerFolderId: driveFolderId,
                scribblerSessionName: name,
                js,
                css,
                html,
            },
        })

        return response
    } catch (error) {
        // throw this error since this method will be used for both 
        // creating individual scribbler and bulk 
        // we loet the calling code decide
        throw error;
    }
}


export async function updateScribblerSession({
    id: scribblerSessionId,
    js,
    css,
    html,
}) {
    const log = logger(`updateScribblerSession`)
    try {
        const response = await axios({
            url: `http://localhost:3000/drive/folder/session/${scribblerSessionId}`,
            method: 'PUT',
            withCredentials: true,
            data: {
                scribblerSessionId,
                js,
                css,
                html,
            },
        })
        log(`response`, response)

        return response
    } catch ({ response }) {
        return {
            message:
                response?.data?.message ||
                response?.data ||
                `unable to update scribbler session with id ${scribblerSessionId}`,
            ...response,
        }
    }
}

export async function fetchCurrentUser(signal) {
    const response =  axios.get('http://localhost:3000/api/v1/me', {signal, withCredentials: true})
    return response
}