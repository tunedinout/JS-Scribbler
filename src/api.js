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

/**
 *
 * @param {String} accessToken
 * @returns {id} OR {message} - if error response received
 */
export async function createDriveAppFolder(accessToken) {
    const log = logger(`createDriveAppFolder`)
    try {
        const response = await axios({
            url: `http://localhost:3000/drive/create/folder`,
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken},`,
            },
        })

        return response.data
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
 * @param {String} esfiddleFolderId
 * @returns an array of {id,name} - of existing fiddle sessions
 */
export async function fetchExistingFiddleSessions(
    accessToken,
    esfiddleFolderId
) {
    const log = logger(`fetchExistingFiddleSessions`);
    try {
        const response = await axios({
            url: `http://localhost:3000/drive/folder/sessions?esfiddleFolderId=${esfiddleFolderId}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
        return response.data
    } catch ({ response }) {
        log(`response`, response)
        return {
            message:
                response?.data?.message ||
                response?.data ||
                'Unable to get existing fiddle sessions.',
            ...response,
        }
    }
}

/**
 *
 * @param {String} accessToken
 * @param {String} esfiddleFolderId
 * @returns an array of {mimeType,id,data} - of each css, js and html file
 */
export async function fetchExistingFiddleSession(accessToken, fiddleSessionId) {
    try {
        const response = await axios({
            url: `http://localhost:3000/drive/folder/sessions/${fiddleSessionId}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
        return response.data
    } catch ({ response }) {
        return {
            message:
                response?.data?.message ||
                response?.data ||
                'Unable to get existing fiddle sessions.',
            ...response,
        }
    }
}

/**
 *
 * @param {String} accessToken
 * @param {String} esfiddleFolderId
 * @returns response
 */
export async function createFiddleSession(
    accessToken,
    esfiddleFolderId,
    fiddleSessionName,
    js = '',
    css = '',
    html = ''
) {
    try {
        const response = await axios({
            url: `http://localhost:3000/drive/folder/session`,
            method: 'POST',
            headers: {
                // axios will set this auto
                // 'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            data: {
                fiddleSessionName,
                esfiddleFolderId,
                js,
                css,
                html,
            },
        })

        return response.data
    } catch (error) {
        // throw this error since this method will be used for both 
        // creating individual fiddle and bulk 
        // we loet the calling code decide
        throw error;
    }
}

/**
 *
 * @param {String} accessToken
 * @param {String} fiddleSessionName - name of current fiddle session
 * @param {String} js - new contents of the index.js file
 * @param {*} css  - new contents of the index.css file
 * @param {*} html  - new contents of the index.html file
 * @returns
 */
export async function updateFiddleSession(
    accessToken,
    fiddleSessionId,
    js = '',
    css = '',
    html = ''
) {
    const log = logger(`updateFiddleSession`)
    try {
        const response = await axios({
            url: `http://localhost:3000/drive/folder/session/${fiddleSessionId}`,
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${accessToken}test`,
            },
            data: {
                fiddleSessionId,
                js,
                css,
                html,
            },
        })
        log(`response`, response)

        return response.data
    } catch ({ response }) {
        return {
            message:
                response?.data?.message ||
                response?.data ||
                `unable to update fiddle session with id ${fiddleSessionId}`,
            ...response,
        }
    }
}
